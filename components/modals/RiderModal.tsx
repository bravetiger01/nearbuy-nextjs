'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

const STORE_POSTERS = [
  { name: 'Zudio', sub: 'Casual · Trendy', grad: 'linear-gradient(135deg,#8B5CF6,#5B21B6)', abbr: 'ZD' },
  { name: 'Westside', sub: 'Premium · Classic', grad: 'linear-gradient(135deg,#0A0A0A,#374151)', abbr: 'WS' },
  { name: 'Max Fashion', sub: 'Affordable · Family', grad: 'linear-gradient(135deg,#D97706,#B45309)', abbr: 'MX' },
  { name: 'H&M', sub: 'International · Youth', grad: 'linear-gradient(135deg,#DC2626,#991B1B)', abbr: 'H&M' },
  { name: 'FBB', sub: 'Budget · Everyday', grad: 'linear-gradient(135deg,#059669,#065F46)', abbr: 'FBB' },
];

const SWATCHES: { bg: string; title: string; color: string }[] = [
  { bg: '#1E293B', title: 'Black/Navy', color: 'Black/Navy' },
  { bg: '#FFFFFF', title: 'White', color: 'White' },
  { bg: '#8B5CF6', title: 'Lavender/Purple', color: 'Lavender/Purple' },
  { bg: '#EF4444', title: 'Red', color: 'Red' },
  { bg: '#F59E0B', title: 'Yellow/Orange', color: 'Yellow/Orange' },
  { bg: '#10B981', title: 'Green', color: 'Green' },
  { bg: '#3B82F6', title: 'Blue', color: 'Blue' },
  { bg: '#EC4899', title: 'Pink', color: 'Pink' },
  { bg: 'linear-gradient(135deg,#F59E0B,#EF4444,#8B5CF6)', title: 'Any/Multicolor', color: 'Any' },
];

export default function RiderModal() {
  const { showToast, closeModal, riderCtx } = useApp();

  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [dist, setDist] = useState(0.5);
  const [payMethod, setPayMethod] = useState<'COD' | 'UPI'>('COD');
  const [poster, setPoster] = useState('Zudio');
  const [color, setColor] = useState('Black/Navy');
  const [colorInput, setColorInput] = useState('Black/Navy');
  const [videoCall, setVideoCall] = useState(true);

  const base = riderCtx?.price ?? 0;
  const distCharge = dist > 1 ? Math.round((dist - 1) * 8) : 0;
  const total = base + 35 + distCharge;
  const totalAmt = `₹${total}`;
  const distChargeTxt = distCharge > 0 ? `₹${distCharge}` : 'FREE';

  const goStep = (s: number) => {
    if (s === 2) {
      if (!addr.trim()) {
        showToast('Enter your delivery address', 'error');
        return;
      }
      if (!phone.trim() || phone.trim().length < 10) {
        showToast('Enter a valid phone number', 'error');
        return;
      }
    }
    setStep(s);
  };

  const confirmRider = () => {
    if (!addr.trim() || !phone.trim()) {
      showToast('Fill in address and phone', 'error');
      return;
    }
    closeModal('rider');
    showToast(
      `RIDER BOOKED via Porter${videoCall ? ' · Video call requested' : ''} · Pay ${payMethod}: ${totalAmt}`,
      'success'
    );
  };

  return (
    <Modal
      name="rider"
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          BOOK A RIDER <span className="porter-badge">POWERED BY PORTER</span>
        </span>
      }
      width="xl"
    >
      <div className="rider-steps-bar">
        <div className={`rsb-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>
          <div className="rsb-num">1</div>
          <span>DETAILS</span>
        </div>
        <div className="rsb-line" />
        <div className={`rsb-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
          <div className="rsb-num">2</div>
          <span>PREFERENCES</span>
        </div>
        <div className="rsb-line" />
        <div className={`rsb-step ${step === 3 ? 'active' : step > 3 ? 'done' : ''}`}>
          <div className="rsb-num">3</div>
          <span>PAYMENT</span>
        </div>
      </div>

      {step === 1 && (
        <div className="modal-bdy-boxy">
          <div className="porter-info-bar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="5" cy="17" r="3" />
              <circle cx="19" cy="17" r="3" />
              <path d="M5 17H3V9l4-5h10l3 6h2v7h-3M9 17h6" />
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Verified Porter Rider on the way</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: 2 }}>
                Real-time tracking · Background-verified · Insured delivery
              </div>
            </div>
            <div className="porter-eta-chip">~25 MIN ETA</div>
          </div>

          <div className="rider-prod-disp">
            <strong>{riderCtx?.productName ?? '—'}</strong>
            <br />
            <span style={{ fontSize: '0.78rem', letterSpacing: '0.04em', color: 'var(--lav-700)' }}>
              {riderCtx?.storeName ?? ''} · ₹{riderCtx?.price.toLocaleString('en-IN') ?? 0}
            </span>
          </div>

          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div className="route-line-visual">
              <div className="rlv-dot origin" />
              <div className="rlv-track" />
              <div className="rlv-dot dest" />
            </div>
            <div style={{ paddingLeft: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="form-g" style={{ minWidth: 0 }}>
                <label>PICK-UP FROM STORE</label>
                <input
                  type="text"
                  className="f-inp"
                  readOnly
                  style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}
                  value={`${riderCtx?.storeName ?? 'SVIT Stationery Mart'}, Vasad`}
                />
              </div>
              <div className="form-g" style={{ minWidth: 0 }}>
                <label>DELIVER TO (YOUR ADDRESS)</label>
                <input type="text" className="f-inp" placeholder="Enter your full delivery address" value={addr} onChange={(e) => setAddr(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-g">
              <label>YOUR PHONE</label>
              <input type="tel" className="f-inp" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-g">
              <label>QUANTITY</label>
              <input type="number" className="f-inp" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
            </div>
          </div>

          <div className="distance-slider-wrap">
            <label className="form-g" style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--gray-500)' }}>
                ESTIMATED DISTANCE
              </span>
              <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--lav-600)' }}>{dist.toFixed(1)} km</span>
            </label>
            <input
              type="range"
              className="dist-slider"
              min={0.5}
              max={10}
              step={0.5}
              value={dist}
              onChange={(e) => setDist(parseFloat(e.target.value))}
            />
            <div className="dist-labels">
              <span>0.5 km</span>
              <span>5 km</span>
              <span>10 km</span>
            </div>
          </div>

          <div className="rider-est">
            <div className="re-row">
              <span>PRODUCT COST</span>
              <span>₹{base.toLocaleString('en-IN')}</span>
            </div>
            <div className="re-row">
              <span>BASE RIDER FEE</span>
              <span>₹35</span>
            </div>
            <div className="re-row">
              <span>DISTANCE CHARGE</span>
              <span>{distChargeTxt}</span>
            </div>
            <div className="re-row total">
              <span>TOTAL (ESTIMATE)</span>
              <span>{totalAmt}</span>
            </div>
            {qty > 1 && (
              <div className="re-row">
                <span style={{ color: 'var(--gray-500)' }}>QTY x{qty} (product total)</span>
                <span>₹{(base * qty).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="modal-bdy-boxy">
          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--lav-600)', borderLeft: '3px solid var(--lav-500)', paddingLeft: 8, marginBottom: 16 }}>
            CLOTHING PREFERENCES FOR YOUR RIDER
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--gray-500)', marginBottom: 10 }}>
              SELECT FASHION OUTLET
            </div>
            <div className="store-poster-row">
              {STORE_POSTERS.map((sp) => (
                <div key={sp.name} className={`store-poster ${poster === sp.name ? 'active' : ''}`} onClick={() => setPoster(sp.name)}>
                  <div className="sp-banner" style={{ background: sp.grad }}>
                    <span>{sp.abbr}</span>
                  </div>
                  <div className="sp-label">{sp.name.toUpperCase()}</div>
                  <div className="sp-sub">{sp.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-g">
              <label>CLOTHING TYPE</label>
              <select className="f-inp">
                {['T-Shirt / Top', 'Formal Shirt', 'Jeans / Trousers', 'Kurti / Dress', 'Saree', 'Jacket / Hoodie', 'Ethnic Wear', 'Shorts / Skirt', 'Full Outfit (Rider picks best)'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="form-g">
              <label>YOUR SIZE</label>
              <select className="f-inp" defaultValue="M (38-40)">
                {['XS (32-34)', 'S (34-36)', 'M (38-40)', 'L (40-42)', 'XL (42-44)', 'XXL (44-46)', 'XXXL (46-48)'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-g" style={{ marginTop: 4 }}>
            <label>COLOR PREFERENCE</label>
            <div className="color-palette-row">
              {SWATCHES.map((s) => (
                <div
                  key={s.title}
                  className={`cp-swatch ${color === s.color ? 'active' : ''}`}
                  style={{ background: s.bg, border: s.bg === '#FFFFFF' ? '2px solid #E5E7EB' : undefined }}
                  title={s.title}
                  onClick={() => {
                    setColor(s.color);
                    setColorInput(s.color);
                  }}
                />
              ))}
            </div>
            <input type="text" className="f-inp" style={{ marginTop: 8 }} placeholder="Or type a specific colour / shade" value={colorInput} onChange={(e) => setColorInput(e.target.value)} />
          </div>

          <div className="form-grid-2" style={{ marginTop: 8 }}>
            <div className="form-g">
              <label>BUDGET RANGE (₹)</label>
              <select className="f-inp" defaultValue="₹500 – ₹1,000">
                {['Under ₹500', '₹500 – ₹1,000', '₹1,000 – ₹2,000', '₹2,000 – ₹5,000', 'Above ₹5,000'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="form-g">
              <label>OCCASION</label>
              <select className="f-inp">
                {['Casual / Everyday', 'College / Office', 'Party / Event', 'Festival / Wedding', 'Workout / Sports'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-g" style={{ marginTop: 4 }}>
            <label>SPECIAL INSTRUCTIONS FOR RIDER</label>
            <input type="text" className="f-inp" placeholder="e.g. Avoid synthetic material, prefer cotton, something similar to what I sent on WhatsApp" />
          </div>

          <div className="video-call-strip" onClick={() => setVideoCall((v) => !v)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="vcall-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="23,7 16,12 23,17 23,7" />
                  <rect x="1" y="5" width="15" height="14" rx="1" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Request LIVE Video Call from Store</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 2 }}>
                  Rider will call you once at store — see every option before they buy
                </div>
              </div>
            </div>
            <label className="tgl" style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              <input type="checkbox" checked={videoCall} onChange={(e) => setVideoCall(e.target.checked)} />
              <span className="tgl-slider" />
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="modal-bdy-boxy">
          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--lav-600)', borderLeft: '3px solid var(--lav-500)', paddingLeft: 8, marginBottom: 16 }}>
            CONFIRM & PAY
          </div>

          <div className="order-summary-card">
            <div className="re-row">
              <span>PRODUCT / ITEM</span>
              <span>{riderCtx?.productName ?? '—'}</span>
            </div>
            <div className="re-row">
              <span>STORE</span>
              <span>{riderCtx?.storeName ?? '—'}</span>
            </div>
            <div className="re-row">
              <span>RIDER FEE + DISTANCE</span>
              <span>₹35 + {distChargeTxt}</span>
            </div>
            {qty > 1 && (
              <div className="re-row">
                <span>QUANTITY</span>
                <span>x{qty}</span>
              </div>
            )}
            <div className="re-row total">
              <span>TOTAL AMOUNT</span>
              <span>{qty > 1 ? `₹${total * qty}` : totalAmt}</span>
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--gray-500)', margin: '16px 0 10px' }}>
            CHOOSE PAYMENT METHOD
          </div>
          <div className="pay-method-grid">
            <div className={`pay-method-card ${payMethod === 'COD' ? 'active' : ''}`} onClick={() => setPayMethod('COD')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
              <div className="pm-label">CASH ON DELIVERY</div>
              <div className="pm-sub">Pay when rider arrives</div>
            </div>
            <div className={`pay-method-card ${payMethod === 'UPI' ? 'active' : ''}`} onClick={() => setPayMethod('UPI')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 12h6M9 15h4" />
              </svg>
              <div className="pm-label">UPI / QR CODE</div>
              <div className="pm-sub">Scan & pay instantly</div>
            </div>
            <div className="pay-method-card pm-coming">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <div className="pm-label">RAZORPAY</div>
              <div className="pm-sub">Card / Wallet — Coming Soon</div>
            </div>
            <div className="pay-method-card pm-coming">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                <path d="M8 12l4-4 4 4M12 8v8" />
              </svg>
              <div className="pm-label">PHONEPE</div>
              <div className="pm-sub">Coming Soon</div>
            </div>
          </div>

          {payMethod === 'UPI' && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <div className="qr-display-box">
                <div className="qr-inner-box" style={{ width: 140, height: 140, margin: '0 auto 10px', fontSize: '0.6rem' }}>
                  [ QR CODE ]
                  <br />
                  Scan with any UPI app
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  UPI ID: <span style={{ color: 'var(--lav-600)' }}>nearbuy@upi</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 4 }}>
                  Amount: <strong>{qty > 1 ? `₹${total * qty}` : totalAmt}</strong>
                </div>
              </div>
              <div className="pay-apps-row">
                {['GPay', 'PhonePe', 'BHIM', 'Paytm'].map((a) => (
                  <div className="pa-chip" key={a}>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-note" style={{ marginTop: 16 }}>
            <strong>Powered by Porter</strong> — Your rider is background verified, insured, and real-time tracked.{' '}
            You&apos;ll receive live location updates via SMS once booked.
          </div>
        </div>
      )}

      <div className="modal-ftr-boxy" style={step === 1 ? {} : { display: 'flex' }}>
        {step === 1 && (
          <>
            <button className="btn-modal-outline" onClick={() => closeModal('rider')}>
              CANCEL
            </button>
            <button className="btn-modal-rider" onClick={() => goStep(2)}>
              NEXT — PREFERENCES →
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <button className="btn-modal-outline" onClick={() => goStep(1)}>
              ← BACK
            </button>
            <button className="btn-modal-rider" onClick={() => goStep(3)}>
              NEXT — PAYMENT →
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <button className="btn-modal-outline" onClick={() => goStep(2)}>
              ← BACK
            </button>
            <button className="btn-modal-rider" onClick={confirmRider} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20,6 9,17 4,12" />
              </svg>
              CONFIRM & BOOK RIDER
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}