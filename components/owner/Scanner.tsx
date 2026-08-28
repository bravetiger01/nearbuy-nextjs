'use client';

import { useRef, useState } from 'react';
import { useApp } from '../../lib/store-context';
import { SCANNED_BILL_PRODUCTS } from '../../lib/data';

const SCAN_STEPS = ['INITIALIZING AI SCANNER…', 'DETECTING DOCUMENT EDGES…', 'EXTRACTING TEXT (OCR)…', 'RECOGNIZING PRODUCTS…', 'MATCHING DATABASE…', 'FINALIZING RESULTS…'];

type ScanPhase = 'drop' | 'processing' | 'results';

export default function Scanner() {
  const { saveProduct, showToast } = useApp();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [phase, setPhase] = useState<ScanPhase>('drop');
  const [stepIdx, setStepIdx] = useState(0);

  const simulateBillScan = () => {
    setPhase('processing');
    setStepIdx(0);
    const iv = setInterval(() => setStepIdx((i) => (i + 1) % SCAN_STEPS.length), 500);
    setTimeout(() => {
      clearInterval(iv);
      setPhase('results');
    }, 3200);
  };

  const addAllScannedToInventory = () => {
    SCANNED_BILL_PRODUCTS.forEach((p) => {
      saveProduct({ id: Date.now() + Math.random(), name: p.name, stock: p.qty, price: p.unitPrice, category: p.category, listed: true });
    });
    setPhase('drop');
    showToast(`${SCANNED_BILL_PRODUCTS.length} PRODUCTS ADDED TO INVENTORY`, 'success');
  };

  return (
    <div className="o-section active">
      <h2 className="o-title">AI Bill Scanner</h2>
      <p className="o-desc">Upload any purchase invoice. AI extracts all products and adds them to your inventory automatically.</p>
      <div className="scanner-boxy">
        {phase === 'drop' && (
          <div className="scan-drop">
            <div className="scan-drop-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <h3>DROP INVOICE HERE</h3>
            <p>JPG, PNG, PDF · Max 10 MB</p>
            <div className="scan-drop-btns">
              <input
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                ref={fileRef}
                onChange={() => {
                  if (fileRef.current?.files?.[0]) simulateBillScan();
                }}
              />
              <button className="btn-owner-outline" onClick={() => fileRef.current?.click()}>
                CHOOSE FILE
              </button>
              <button className="btn-owner-solid" onClick={simulateBillScan}>
                ✦ DEMO SCAN
              </button>
            </div>
          </div>
        )}

        {phase === 'processing' && (
          <div className="scan-processing">
            <div className="scan-anim-wrap">
              <div className="scan-bill-art">
                <div className="sba-hdr" />
                <div className="sba-line" />
                <div className="sba-line short" />
                <div className="sba-line" />
                <div className="sba-line short" />
                <div className="sba-line" />
                <div className="sba-line short" />
              </div>
              <div className="scan-laser" />
            </div>
            <p className="scan-status-txt">{SCAN_STEPS[stepIdx]}</p>
          </div>
        )}

        {phase === 'results' && (
          <div className="scan-results">
            <div className="scan-ok-bar">AI EXTRACTED {SCANNED_BILL_PRODUCTS.length} PRODUCTS</div>
            {SCANNED_BILL_PRODUCTS.map((p) => (
              <div
                key={p.name}
                style={{ background: 'var(--white)', border: 'var(--brd)', padding: '10px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    {p.qty} Units · ₹{p.unitPrice} / unit
                  </div>
                </div>
              </div>
            ))}
            <div className="scan-res-actions">
              <button className="btn-owner-solid btn-full-w" onClick={addAllScannedToInventory}>
                ADD ALL TO INVENTORY
              </button>
              <button className="btn-owner-outline" onClick={() => setPhase('drop')}>
                SCAN ANOTHER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}