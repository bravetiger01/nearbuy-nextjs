'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../../lib/store-context';

export default function Payments() {
  const { payments } = useApp();
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = useMemo(() => {
    return payments.filter(p => {
      const mMatch = filterMethod === 'all' || p.method === filterMethod;
      const sMatch = filterStatus === 'all' || p.status === filterStatus;
      return mMatch && sMatch;
    });
  }, [payments, filterMethod, filterStatus]);

  const methodTotals = payments.reduce((acc, p) => {
    if (p.status === 'paid') {
      acc[p.method] = (acc[p.method] || 0) + p.amount;
      acc.total += p.amount;
    }
    return acc;
  }, { cash: 0, upi: 0, card: 0, online: 0, total: 0 } as Record<string, number>);

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">Payments & Reconciliation</h2>
      </div>

      <div className="kpi-row">
        <div className="kpi-boxy white" style={{ borderColor: 'var(--lav-500)' }}>
          <div className="kpi-lbl">TOTAL SETTLED (TODAY)</div>
          <div className="kpi-val" style={{ color: 'var(--lav-600)' }}>₹{methodTotals.total.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-boxy white">
          <div className="kpi-lbl">UPI TRANSACTIONS</div>
          <div className="kpi-val">₹{methodTotals.upi.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-boxy white">
          <div className="kpi-lbl">CASH IN HAND</div>
          <div className="kpi-val">₹{methodTotals.cash.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-boxy white">
          <div className="kpi-lbl">ONLINE / CARD</div>
          <div className="kpi-val">₹{(methodTotals.card + methodTotals.online).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="inv-filters-row" style={{ marginTop: 24, marginBottom: 16 }}>
        <select className="o-sel" value={filterMethod} onChange={e => setFilterMethod(e.target.value)}>
          <option value="all">ALL METHODS</option>
          <option value="cash">CASH</option>
          <option value="upi">UPI</option>
          <option value="card">CARD</option>
          <option value="online">ONLINE</option>
        </select>
        <select className="o-sel" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">ALL STATUSES</option>
          <option value="paid">PAID</option>
          <option value="pending">PENDING</option>
          <option value="failed">FAILED</option>
        </select>
      </div>

      <div className="table-scroll">
        <table className="o-table-boxy">
          <thead>
            <tr>
              <th>TXN ID</th>
              <th>ORDER / REF</th>
              <th>CUSTOMER</th>
              <th>AMOUNT (₹)</th>
              <th>METHOD</th>
              <th>DATE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>No transactions found.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id}>
                <td><code>{p.id}</code></td>
                <td style={{ fontWeight: 600 }}>{p.orderId}</td>
                <td>{p.customer}</td>
                <td style={{ fontWeight: 700 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                <td>
                  <span className="pay-method-badge">{p.method.toUpperCase()}</span>
                </td>
                <td>{p.date}</td>
                <td>
                  <span className={`pay-status-badge ${p.status}`}>{p.status.toUpperCase()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
