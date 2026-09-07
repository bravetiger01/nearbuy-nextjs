'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';

export default function Promotions() {
  const { promotions, togglePromotion, deletePromotion, addPromotion, showToast, ownerInventory } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [pct, setPct] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleCreate = () => {
    if (!name || !pct || !start || !end) {
      showToast('Please fill all fields', 'error');
      return;
    }
    const promo = {
      id: `P-${Date.now()}`,
      name,
      products: ['All Products'], // simplified for hackathon
      discountPct: parseInt(pct),
      startDate: start,
      endDate: end,
      active: true,
    };
    addPromotion(promo);
    showToast('Promotion Created!', 'success');
    setShowForm(false);
    setName(''); setPct(''); setStart(''); setEnd('');
  };

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">Promotional Boost</h2>
        <button className="btn-owner-solid" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ CANCEL' : '+ CREATE OFFER'}
        </button>
      </div>

      {showForm && (
        <div className="promo-form-boxy">
          <h3 style={{ marginBottom: 16, fontFamily: 'var(--display)' }}>Create New Promotion</h3>
          <div className="form-g">
            <label>PROMOTION NAME</label>
            <input type="text" className="f-inp" placeholder="e.g. Diwali Mega Sale" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-grid-2">
            <div className="form-g">
              <label>DISCOUNT PERCENTAGE (%)</label>
              <input type="number" className="f-inp" placeholder="15" value={pct} onChange={e => setPct(e.target.value)} />
            </div>
            <div className="form-g">
              <label>APPLY TO</label>
              <select className="f-inp" disabled>
                <option>All Products (Storewide)</option>
              </select>
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-g">
              <label>START DATE</label>
              <input type="date" className="f-inp" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div className="form-g">
              <label>END DATE</label>
              <input type="date" className="f-inp" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>
          <button className="btn-owner-solid" onClick={handleCreate} style={{ marginTop: 16, width: '100%' }}>
            ACTIVATE PROMOTION
          </button>
        </div>
      )}

      <div className="promo-list">
        {promotions.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>No active promotions.</p>
        ) : (
          promotions.map((p) => (
            <div className={`promo-card-boxy ${!p.active ? 'inactive' : ''}`} key={p.id}>
              <div className="pc-top">
                <div className="pc-name">{p.name}</div>
                <div className="pc-pct">{p.discountPct}% OFF</div>
              </div>
              <div className="pc-mid">
                Valid: {p.startDate} to {p.endDate} • Applies to: {p.products.join(', ')}
              </div>
              <div className="pc-bot">
                <label className="tgl" style={{ width: 36, height: 20 }}>
                  <input type="checkbox" checked={p.active} onChange={() => togglePromotion(p.id)} />
                  <span className="tgl-slider" />
                </label>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: p.active ? 'var(--lav-600)' : 'var(--gray-400)' }}>
                  {p.active ? 'ACTIVE' : 'PAUSED'}
                </span>
                <button className="del-btn" style={{ marginLeft: 'auto' }} onClick={() => deletePromotion(p.id)}>
                  REMOVE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
