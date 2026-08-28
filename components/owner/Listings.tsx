'use client';

import { useMemo, useState } from 'react';
import { useApp } from '../../lib/store-context';

const CATS = ['all', 'Notebooks', 'Pens', 'Math', 'Electronics', 'Paper', 'Office'];

export default function Listings() {
  const { ownerInventory, toggleListing, deleteProduct, openModal, setEditProduct } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');

  const listed = useMemo(
    () =>
      ownerInventory.filter(
        (p) => p.listed && (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())
      ),
    [ownerInventory, q, cat]
  );

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">My Listings</h2>
        <button className="btn-owner-solid" onClick={() => { setEditProduct(null); openModal('addProduct'); }}>
          + ADD PRODUCT
        </button>
      </div>
      <div className="listings-tb">
        <input type="text" placeholder="Search listings…" className="o-inp-search" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="o-sel" value={cat} onChange={(e) => setCat(e.target.value)}>
          {CATS.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'ALL CATEGORIES' : c}
            </option>
          ))}
        </select>
      </div>
      <div className="listings-grid-boxy">
        {listed.length === 0 ? (
          <p style={{ color: 'var(--gray-500)' }}>No matches.</p>
        ) : (
          listed.map((p) => (
            <div className="lc-boxy" key={p.id}>
              <div className="lc-top-boxy">
                <span className="lc-cat-tag">{p.category}</span>
                <label className="tgl" style={{ width: 36, height: 20 }}>
                  <input type="checkbox" checked onChange={() => toggleListing(ownerInventory.indexOf(p))} />
                  <span className="tgl-slider" />
                </label>
              </div>
              <div className="lc-name-boxy">{p.name}</div>
              <div className="lc-row-boxy">
                <span className="lc-stk">{p.stock} IN STOCK</span>
                <span className="lc-pr">₹{p.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="lc-acts-boxy">
                <button
                  className="btn-owner-outline"
                  style={{ flex: 1, padding: 6, fontSize: '0.72rem' }}
                  onClick={() => {
                    setEditProduct(p);
                    openModal('addProduct');
                  }}
                >
                  EDIT
                </button>
                <button
                  className="btn-owner-outline"
                  style={{ flex: 1, padding: 6, fontSize: '0.72rem', color: '#B91C1C' }}
                  onClick={() => deleteProduct(ownerInventory.indexOf(p))}
                >
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