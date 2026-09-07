'use client';

import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { useApp } from '../../lib/store-context';
import type { ScannedProduct } from '../../lib/types';

type ScanPhase = 'drop' | 'processing' | 'review' | 'saving';

const CATEGORY_GUESS: [RegExp, string][] = [
  [/notebook|graph|register|diary|copy/i, 'Notebooks'],
  [/pen|ball|gel|marker|highlighter/i, 'Pens'],
  [/geometry|compass|protector|set\s?square|divider/i, 'Math Instruments'],
  [/calculator/i, 'Electronics'],
  [/paper|ream|print|copy\s*paper/i, 'Paper'],
  [/stapler|pin|clip|file|folder|tape|glue|sharpener|scale|board|envelope/i, 'Office Supplies'],
  [/shampoo|lotion|body\s*wash|hand\s*wash|soap|cream|cosmetic|beauty/i, 'Personal Care'],
  [/biscuit|snack|chip|chocolate|cookie|juice|drink|water|oil|rice/i, 'Food & Beverage'],
];

function guessCategory(name: string): string {
  for (const [re, cat] of CATEGORY_GUESS) if (re.test(name)) return cat;
  return 'General';
}

function defaultSelling(purchaseRate: number): number {
  // Default 20% margin
  return Math.ceil(purchaseRate * 1.2);
}

export default function Scanner() {
  const { supabase, profile, showToast } = useApp();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [phase, setPhase] = useState<ScanPhase>('drop');
  const [fileName, setFileName] = useState('');
  const [statusTxt, setStatusTxt] = useState('');
  const [items, setItems] = useState<ScannedProduct[]>([]);

  /* ─── helpers ────────────────────────────────────────────────────── */
  const updateItem = (idx: number, patch: Partial<ScannedProduct>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  /* ─── scan ────────────────────────────────────────────────────────── */
  const runScan = async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      showToast('Upload a JPG, PNG, WEBP, or PDF file.', 'error');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      showToast('File must be under 15 MB.', 'error');
      return;
    }

    setFileName(file.name);
    setStatusTxt('SENDING TO GEMINI AI…');
    setPhase('processing');

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/scan-bill', { method: 'POST', body: fd });
      const json = await res.json() as {
        items?: { name: string; qty: number; rate: number; hsn: string }[];
        error?: string;
        raw?: string;
      };

      if (!res.ok || json.error) {
        const errMsg = json.error ?? 'AI scan failed.';
        console.error('scan-bill API error:', json);
        // Show a friendlier message for common errors
        if (errMsg.includes('API_KEY') || errMsg.includes('not set')) {
          showToast('⚠️ GOOGLE_AI_KEY not configured in .env.local', 'error');
        } else if (errMsg.includes('quota') || errMsg.includes('429')) {
          showToast('Gemini quota exceeded — wait 60s and retry.', 'error');
        } else {
          showToast(`AI Error: ${errMsg.slice(0, 120)}`, 'error');
        }
        setPhase('drop');
        return;
      }

      const parsed: ScannedProduct[] = (json.items ?? []).map((it) => ({
        name: it.name.trim(),
        qty: Math.max(1, Math.round(it.qty)),
        unitPrice: Math.round(it.rate),
        sellingPrice: defaultSelling(Math.round(it.rate)),
        category: guessCategory(it.name),
        hsn: it.hsn ?? '',
        include: true,
      }));

      if (parsed.length === 0) {
        showToast('AI found no product lines. Try a clearer image.', 'error');
        setPhase('drop');
        return;
      }

      setItems(parsed);
      setPhase('review');
    } catch (err) {
      console.error('scan error:', err);
      showToast('Scan failed — check console for details.', 'error');
      setPhase('drop');
    }
  };

  /* ─── save to supabase ───────────────────────────────────────────── */
  const saveToSupabase = async () => {
    if (!supabase || !profile) {
      showToast('Not logged in.', 'error');
      return;
    }

    const toSave = items.filter((it) => it.include);
    if (toSave.length === 0) {
      showToast('Select at least one item to import.', 'error');
      return;
    }

    setPhase('saving');
    setStatusTxt('FINDING YOUR SHOP…');

    try {
      // 1. Get owner's shop
      const { data: shopRow, error: shopErr } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', profile.id)
        .limit(1)
        .maybeSingle();

      if (shopErr || !shopRow) {
        showToast('No shop found for your account. Set up your shop first.', 'error');
        setPhase('review');
        return;
      }
      const shopId = shopRow.id as string;

      let saved = 0;
      for (const [i, item] of toSave.entries()) {
        setStatusTxt(`SAVING ${i + 1} / ${toSave.length}…`);

        // 2. Find or create global product by name (case-insensitive)
        let productId: string;

        const { data: existing } = await supabase
          .from('products')
          .select('id')
          .ilike('name', item.name.trim())
          .limit(1)
          .maybeSingle();

        if (existing?.id) {
          productId = existing.id as string;
        } else {
          // Create new global product
          const { data: created, error: createErr } = await supabase
            .from('products')
            .insert({
              name: item.name.trim(),
              description: null,
              brand: null,
              category_id: null,
              sku: item.hsn ? `HSN-${item.hsn}` : null,
              barcode: null,
              unit: 'piece',
              image_url: null,
            })
            .select('id')
            .single();

          if (createErr || !created) {
            console.error('create product error:', createErr);
            showToast(`Failed to create product "${item.name}"`, 'error');
            continue;
          }
          productId = created.id as string;
        }

        // 3. Upsert shop_products (price = selling, mrp = purchase rate, qty = stock)
        const { error: spErr } = await supabase
          .from('shop_products')
          .upsert(
            {
              shop_id: shopId,
              product_id: productId,
              price: item.sellingPrice,
              mrp: item.unitPrice,
              quantity: item.qty,
              low_stock_threshold: Math.max(3, Math.floor(item.qty * 0.1)),
              discount_percentage: 0,
              is_available: true,
            },
            { onConflict: 'shop_id,product_id' }
          );

        if (spErr) {
          console.error('upsert shop_products error:', spErr);
          showToast(`Error saving "${item.name}": ${spErr.message}`, 'error');
        } else {
          saved++;
        }
      }

      showToast(
        `${saved} of ${toSave.length} product${toSave.length > 1 ? 's' : ''} saved to inventory!`,
        'success'
      );
      setPhase('drop');
      setItems([]);
    } catch (err) {
      console.error('saveToSupabase error:', err);
      showToast('Save failed — check console.', 'error');
      setPhase('review');
    }
  };

  /* ─── dnd ─────────────────────────────────────────────────────────── */
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void runScan(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void runScan(file);
    e.target.value = '';
  };

  const includedCount = items.filter((it) => it.include).length;
  const billTotal = items.filter((it) => it.include).reduce((s, it) => s + it.qty * it.unitPrice, 0);

  /* ─── render ─────────────────────────────────────────────────────── */
  return (
    <div className="o-section active">
      <h2 className="o-title">AI Bill Scanner</h2>
      <p className="o-desc">
        Upload any purchase invoice (JPG, PNG, PDF). Gemini AI extracts every product line.
        Set your selling price, then save to inventory.
      </p>

      <div className="scanner-boxy">
        {/* ── DROP ──────────────────────────────────────────────────── */}
        {phase === 'drop' && (
          <div className="scan-drop" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
            <div className="scan-drop-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="12" y1="12" x2="12" y2="18" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h3>DROP INVOICE HERE</h3>
            <p>JPG · PNG · PDF · Max 15 MB · Powered by Gemini Vision</p>
            <div className="scan-drop-btns">
              <input type="file" accept="image/*,application/pdf" style={{ display: 'none' }}
                ref={fileRef} onChange={onFileChange} />
              <button className="btn-owner-solid" onClick={() => fileRef.current?.click()}>
                CHOOSE FILE
              </button>
            </div>
          </div>
        )}

        {/* ── PROCESSING ────────────────────────────────────────────── */}
        {(phase === 'processing' || phase === 'saving') && (
          <div className="scan-processing">
            <div className="scan-anim-wrap">
              <div className="scan-bill-art">
                <div className="sba-hdr" />
                <div className="sba-line" />
                <div className="sba-line short" />
                <div className="sba-line" />
                <div className="sba-line short" />
                <div className="sba-line" />
              </div>
              <div className="scan-laser" />
            </div>
            <p className="scan-status-txt">{statusTxt}</p>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: 4 }}>{fileName}</p>
          </div>
        )}

        {/* ── REVIEW ────────────────────────────────────────────────── */}
        {phase === 'review' && (
          <div className="scan-results">
            {/* Summary bar */}
            <div className="scan-ok-bar" style={{ marginBottom: 16 }}>
              ✦ GEMINI EXTRACTED {items.length} LINE ITEM{items.length !== 1 ? 'S' : ''} FROM "{fileName}"
            </div>

            {/* Column header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '28px minmax(0,2fr) 64px 88px 88px 90px 28px',
              gap: '0 8px',
              padding: '6px 10px',
              fontSize: '0.67rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
              color: 'var(--gray-500)',
              borderBottom: 'var(--brd)',
              marginBottom: 6,
            }}>
              <span />
              <span>PRODUCT NAME &amp; HSN</span>
              <span style={{ textAlign: 'center' }}>QTY</span>
              <span style={{ textAlign: 'right' }}>PURCHASE ₹</span>
              <span style={{ textAlign: 'right' }}>SELLING ₹</span>
              <span>CATEGORY</span>
              <span />
            </div>

            {/* Item rows */}
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px minmax(0,2fr) 64px 88px 88px 90px 28px',
                  gap: '0 8px',
                  alignItems: 'start',
                  padding: '8px 10px',
                  marginBottom: 6,
                  background: item.include ? 'var(--white)' : 'var(--gray-50)',
                  border: item.include ? 'var(--brd)' : '1.5px dashed var(--gray-300)',
                  opacity: item.include ? 1 : 0.55,
                  transition: 'all 0.15s',
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={item.include}
                  onChange={(e) => updateItem(idx, { include: e.target.checked })}
                  style={{ cursor: 'pointer', width: 16, height: 16, marginTop: 6 }}
                />

                {/* Name + HSN */}
                <div style={{ minWidth: 0 }}>
                  <input
                    type="text"
                    value={item.name}
                    title={item.name}
                    onChange={(e) => updateItem(idx, { name: e.target.value })}
                    style={{
                      border: 'none', background: 'transparent', fontWeight: 600,
                      fontSize: '0.82rem', width: '100%', outline: 'none',
                      fontFamily: 'var(--display)', whiteSpace: 'normal',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                  />
                  {item.hsn && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em',
                        color: 'var(--gray-500)', background: 'var(--gray-100)',
                        border: 'var(--brd)', borderRadius: 3, padding: '1px 5px',
                      }}>HSN</span>
                      <input
                        type="text"
                        value={item.hsn}
                        onChange={(e) => updateItem(idx, { hsn: e.target.value })}
                        style={{
                          border: 'none', background: 'transparent', fontSize: '0.7rem',
                          color: 'var(--gray-600)', fontFamily: 'monospace', outline: 'none',
                          width: 80,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Qty */}
                <input
                  type="number"
                  value={item.qty}
                  min={1}
                  onChange={(e) => updateItem(idx, { qty: Math.max(1, parseInt(e.target.value) || 1) })}
                  style={{
                    border: 'var(--brd)', background: 'var(--lav-50)', borderRadius: 3,
                    padding: '3px 6px', textAlign: 'center', fontSize: '0.82rem', width: '100%',
                  }}
                />

                {/* Purchase rate (cost/MRP from bill) */}
                <input
                  type="number"
                  value={item.unitPrice}
                  min={0}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    updateItem(idx, { unitPrice: v, sellingPrice: defaultSelling(v) });
                  }}
                  style={{
                    border: 'var(--brd)', background: 'var(--lav-50)', borderRadius: 3,
                    padding: '3px 6px', textAlign: 'right', fontSize: '0.82rem', width: '100%',
                  }}
                />

                {/* Selling price */}
                <input
                  type="number"
                  value={item.sellingPrice}
                  min={0}
                  onChange={(e) => updateItem(idx, { sellingPrice: parseFloat(e.target.value) || 0 })}
                  style={{
                    border: '1.5px solid var(--lav-400)', background: 'var(--lav-50)',
                    borderRadius: 3, padding: '3px 6px', textAlign: 'right',
                    fontSize: '0.82rem', width: '100%', fontWeight: 700, color: 'var(--lav-700)',
                  }}
                />

                {/* Category */}
                <select
                  value={item.category}
                  onChange={(e) => updateItem(idx, { category: e.target.value })}
                  style={{
                    border: 'var(--brd)', background: 'var(--lav-50)', borderRadius: 3,
                    padding: '3px 4px', fontSize: '0.72rem', width: '100%',
                  }}
                >
                  {['Notebooks','Pens','Math Instruments','Electronics','Paper','Office Supplies',
                    'Personal Care','Food & Beverage','General'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Delete */}
                <button
                  onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)',
                    fontSize: '1rem', padding: 0, lineHeight: 1 }}
                  title="Remove item"
                >✕</button>
              </div>
            ))}

            {/* Legend */}
            <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', margin: '8px 0 16px', padding: '0 10px' }}>
              <strong style={{ color: 'var(--lav-700)' }}>PURCHASE ₹</strong> = cost from bill &nbsp;·&nbsp;
              <strong style={{ color: 'var(--lav-700)' }}>SELLING ₹</strong> = price shown to customers (edit freely)
            </div>

            {/* Summary + actions */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 10px', borderTop: 'var(--brd)', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 700 }}>{includedCount}</span> item{includedCount !== 1 ? 's' : ''} selected
                &nbsp;·&nbsp; Bill total <strong>₹{billTotal.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn-owner-outline"
                  onClick={() => { setPhase('drop'); setItems([]); }}
                >
                  CANCEL
                </button>
                <button
                  className="btn-owner-solid"
                  onClick={saveToSupabase}
                  disabled={includedCount === 0}
                  style={{ opacity: includedCount === 0 ? 0.5 : 1 }}
                >
                  SAVE {includedCount} ITEM{includedCount !== 1 ? 'S' : ''} TO INVENTORY →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}