'use client';

import { useMemo, useState } from 'react';
import { useApp } from '../../lib/store-context';

function stockCls(stock: number, min = 10) {
  return stock > min ? 'ok' : stock > Math.floor(min / 2) ? 'low' : 'crit';
}

const CATS = ['all', 'Notebooks', 'Pens', 'Math', 'Electronics', 'Paper', 'Office'];
const STOCK_FILTERS = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

export default function Inventory() {
  const { ownerInventory, toggleListing, deleteProduct, openModal, setEditProduct, updateStock, showToast } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [stockVal, setStockVal] = useState('');

  const filtered = useMemo(() => {
    return ownerInventory.filter((p) => {
      const matchQ = p.name.toLowerCase().includes(q.toLowerCase()) || (p.sku || '').toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === 'all' || p.category === cat;
      const min = p.minThreshold || 10;
      const matchStock =
        stockFilter === 'all' ||
        (stockFilter === 'out-of-stock' && p.stock === 0) ||
        (stockFilter === 'low-stock' && p.stock > 0 && p.stock <= min) ||
        (stockFilter === 'in-stock' && p.stock > min);
      return matchQ && matchCat && matchStock;
    });
  }, [ownerInventory, q, cat, stockFilter]);

  const getStatus = (stock: number, min = 10) => {
    if (stock === 0) return { label: 'OUT OF STOCK', cls: 'oos' };
    if (stock <= min) return { label: 'LOW STOCK', cls: 'low' };
    return { label: 'IN STOCK', cls: 'ok' };
  };

  const commitStock = (id: number) => {
    const n = parseInt(stockVal, 10);
    if (isNaN(n) || n < 0) { showToast('Enter a valid stock number', 'error'); return; }
    updateStock(id, n);
    setEditingStockId(null);
    showToast('Stock updated!', 'success');
  };

  const lowCount = ownerInventory.filter((p) => p.stock <= (p.minThreshold || 10)).length;

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <div>
          <h2 className="o-title">Stock Manager</h2>
          {lowCount > 0 && (
            <div className="inv-alert-bar">
              ⚠️ {lowCount} product{lowCount > 1 ? 's' : ''} running low on stock
            </div>
          )}
        </div>
        <button
          className="btn-owner-solid"
          onClick={() => {
            setEditProduct(null);
            openModal('addProduct');
          }}
        >
          + ADD PRODUCT
        </button>
      </div>

      {/* Filters */}
      <div className="inv-filters-row">
        <input
          type="text"
          placeholder="Search product or SKU…"
          className="o-inp-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="o-sel" value={cat} onChange={(e) => setCat(e.target.value)}>
          {CATS.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'ALL CATEGORIES' : c}</option>
          ))}
        </select>
        <select className="o-sel" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
          <option value="all">ALL STOCK</option>
          <option value="in-stock">IN STOCK</option>
          <option value="low-stock">LOW STOCK</option>
          <option value="out-of-stock">OUT OF STOCK</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="o-table-boxy">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>SKU</th>
              <th>CATEGORY</th>
              <th>STOCK</th>
              <th>PRICE (₹)</th>
              <th>COST (₹)</th>
              <th>MARGIN</th>
              <th>SUPPLIER</th>
              <th>STATUS</th>
              <th>LISTED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: '32px' }}>No products match filters</td></tr>
            ) : filtered.map((p, i) => {
              const status = getStatus(p.stock, p.minThreshold);
              const cost = p.costPrice || Math.round(p.price * 0.65);
              const margin = Math.round(((p.price - cost) / p.price) * 100);
              const idx = ownerInventory.findIndex((x) => x.id === p.id);
              return (
                <tr key={p.id} style={p.stock <= (p.minThreshold || 10) && p.stock > 0 ? { background: '#FFFBEB' } : p.stock === 0 ? { background: '#FEF2F2' } : {}}>
                  <td>
                    <div style={{ fontWeight: 700, maxWidth: 180 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 2 }}>{p.description.slice(0, 40)}…</div>}
                  </td>
                  <td><code style={{ fontSize: '0.72rem', background: 'var(--gray-100)', padding: '2px 6px' }}>{p.sku || '—'}</code></td>
                  <td>{p.category}</td>
                  <td>
                    {editingStockId === p.id ? (
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <input
                          type="number"
                          value={stockVal}
                          onChange={(e) => setStockVal(e.target.value)}
                          style={{ width: 60, border: 'var(--brd)', padding: '3px 6px', fontSize: '0.8rem', outline: 'none' }}
                          autoFocus
                          onKeyDown={(e) => { if (e.key === 'Enter') commitStock(p.id); if (e.key === 'Escape') setEditingStockId(null); }}
                        />
                        <button onClick={() => commitStock(p.id)} style={{ padding: '2px 7px', background: 'var(--lav-500)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>✓</button>
                        <button onClick={() => setEditingStockId(null)} style={{ padding: '2px 7px', background: 'var(--gray-200)', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                      </div>
                    ) : (
                      <span
                        className={`stock-tag ${stockCls(p.stock, p.minThreshold)}`}
                        style={{ cursor: 'pointer' }}
                        title="Click to update stock"
                        onClick={() => { setEditingStockId(p.id); setStockVal(String(p.stock)); }}
                      >
                        {p.stock} UNITS ✎
                      </span>
                    )}
                    {p.minThreshold && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginTop: 2 }}>Min: {p.minThreshold}</div>
                    )}
                  </td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>₹{cost.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: margin >= 30 ? '#059669' : margin >= 15 ? '#D97706' : '#DC2626' }}>
                      {margin}%
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{p.supplier || '—'}</td>
                  <td>
                    <span className={`inv-status-tag ${status.cls}`}>{status.label}</span>
                  </td>
                  <td>
                    <label className="tgl" style={{ width: 38, height: 20 }}>
                      <input type="checkbox" checked={p.listed} onChange={() => toggleListing(idx)} />
                      <span className="tgl-slider" />
                    </label>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="tbl-btn-boxy"
                        onClick={() => {
                          setEditProduct(p);
                          openModal('addProduct');
                        }}
                      >
                        EDIT
                      </button>
                      <button className="tbl-btn-boxy del" onClick={() => deleteProduct(idx)}>
                        DEL
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, fontSize: '0.78rem', color: 'var(--gray-400)' }}>
        Showing {filtered.length} of {ownerInventory.length} products · Click stock number to update inline
      </div>
    </div>
  );
}