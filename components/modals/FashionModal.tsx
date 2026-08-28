'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

const FASHION_STORES = [
  'Zudio — Anand',
  'H&amp;M — Ahmedabad',
  'Max Fashion — Anand',
  'Westside — Vadodara',
  'FBB (Big Bazaar Fashion) — Anand',
  'Trends — Anand',
];

export default function FashionModal() {
  const { showToast, closeModal } = useApp();
  const [store, setStore] = useState(FASHION_STORES[0]);
  const [size, setSize] = useState('L');
  const [budget, setBudget] = useState(1000);
  const [pref, setPref] = useState('');
  const [addr, setAddr] = useState('');

  const confirm = () => {
    if (!addr.trim()) {
      showToast('Enter your delivery address', 'error');
      return;
    }
    closeModal('fashion');
    showToast(`STYLE GUIDE BOOKED — Heading to ${store} for you!`, 'success');
  };

  return (
    <Modal
      name="fashion"
      title="BOOK A STYLE GUIDE"
      width="wide"
      footer={
        <>
          <button className="btn-modal-outline" onClick={() => closeModal('fashion')}>
            CANCEL
          </button>
          <button className="btn-modal-fashion" onClick={confirm}>
            BOOK STYLE GUIDE — ₹89
          </button>
        </>
      }
    >
      <div className="fashion-modal-intro">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23,7 16,12 23,17 23,7" />
          <rect x="1" y="5" width="15" height="14" rx="1" />
        </svg>
        <p>
          Your Style Guide goes to the store, video calls you from there, shows you all options live. You pick — they buy —
          they deliver.
        </p>
      </div>
      <div className="form-g">
        <label>CHOOSE STORE</label>
        <select className="f-inp" value={store} onChange={(e) => setStore(e.target.value)}>
          {FASHION_STORES.map((fs) => (
            <option key={fs}>{fs}</option>
          ))}
        </select>
      </div>
      <div className="form-grid-2">
        <div className="form-g">
          <label>YOUR SIZE (CLOTHING)</label>
          <select className="f-inp" value={size} onChange={(e) => setSize(e.target.value)}>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-g">
          <label>BUDGET (₹)</label>
          <input type="number" className="f-inp" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
        </div>
      </div>
      <div className="form-g">
        <label>STYLE PREFERENCE</label>
        <input type="text" className="f-inp" placeholder="e.g. Casual, formal, ethnic, pastel colours" value={pref} onChange={(e) => setPref(e.target.value)} />
      </div>
      <div className="form-g">
        <label>DELIVERY ADDRESS</label>
        <input type="text" className="f-inp" placeholder="Your address for delivery" value={addr} onChange={(e) => setAddr(e.target.value)} />
      </div>
      <div className="fashion-modal-est">
        <div className="re-row">
          <span>STYLE GUIDE FEE</span>
          <span>₹49</span>
        </div>
        <div className="re-row">
          <span>DELIVERY FEE</span>
          <span>₹40</span>
        </div>
        <div className="re-row">
          <span>PRODUCT COST</span>
          <span>AS PER YOUR CHOICE</span>
        </div>
        <div className="re-row">
          <span>VIDEO CALL</span>
          <span>LIVE FROM STORE</span>
        </div>
        <div className="re-row total">
          <span>FLAT FEE TODAY</span>
          <span>₹89 + PRODUCT</span>
        </div>
      </div>
    </Modal>
  );
}