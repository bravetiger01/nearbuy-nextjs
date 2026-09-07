'use client';

import { useApp } from '../../lib/store-context';

const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

export default function Ledger() {
  const { ledger, openModal } = useApp();
  const balance = ledger[0]?.balance ?? 0;

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <div>
          <h2 className="o-title">Bank Ledger</h2>
          <div className="balance-tag">BALANCE — {fmt(balance)}</div>
        </div>
        <button className="btn-owner-solid" onClick={() => openModal('addTxn')}>
          + ADD TRANSACTION
        </button>
      </div>
      <div className="table-scroll">
        <table className="o-table-boxy">
          <thead>
            <tr>
              <th>DATE</th>
              <th>DESCRIPTION</th>
              <th>TYPE</th>
              <th>AMOUNT (₹)</th>
              <th>BALANCE (₹)</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((t, i) => (
              <tr className={`${t.type}-row`} key={i}>
                <td>{t.date}</td>
                <td>{t.desc}</td>
                <td>
                  <span className={`${t.type}-tag`}>{t.type === 'credit' ? 'CREDIT ↑' : 'DEBIT ↓'}</span>
                </td>
                <td>
                  {t.type === 'credit' ? '+' : '-'}
                  {fmt(t.amount)}
                </td>
                <td>{fmt(t.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}