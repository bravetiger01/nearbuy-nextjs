'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';

interface DocRow {
  product: string;
  qty: string;
  rate: string;
  pct: string;
}

const fmt = (v: number) => `₹${v.toLocaleString('en-IN')}`;

function DocEditable({
  id,
  meta,
  showPct,
  pctLabel,
  hasDiscount,
  saveLabel,
  extraAct,
}: {
  id: string;
  meta: { [k: string]: string };
  showPct: boolean;
  pctLabel: string;
  hasDiscount: boolean;
  saveLabel: string;
  extraAct?: string;
}) {
  const { showToast } = useApp();
  const pctValue = hasDiscount ? 5 : 18;
  const [rows, setRows] = useState<DocRow[]>([{ product: '', qty: '10', rate: '120', pct: String(pctValue) }]);

  const addRow = () => setRows((r) => [...r, { product: '', qty: '1', rate: '0', pct: String(pctValue) }]);
  const delRow = (i: number) => setRows((r) => (r.length > 1 ? r.filter((_, x) => x !== i) : r));
  const set = (i: number, k: keyof DocRow, v: string) => setRows((r) => r.map((row, x) => (x === i ? { ...row, [k]: v } : row)));

  const items = rows.map((row) => {
    const qty = Number(row.qty) || 0;
    const rate = Number(row.rate) || 0;
    const pct = Number(row.pct) || 0;
    let total = qty * rate;
    if (showPct) total += Math.round((total * pct) / 100);
    if (hasDiscount) total -= Math.round((total * pct) / 100);
    return { ...row, total };
  });
  const subtotal = items.reduce((s, i) => s + Number(i.qty || 0) * Number(i.rate || 0), 0);
  const pctTotal = items.reduce((s, i) => {
    const base = Number(i.qty || 0) * Number(i.rate || 0);
    return s + Math.round((base * (Number(i.pct) || 0)) / 100);
  }, 0);
  const grand = hasDiscount ? subtotal - pctTotal : subtotal + pctTotal;

  return (
    <div className="doc-boxy">
      <div className="doc-meta">
        {Object.entries(meta).map(([label, val]) => (
          <div className="form-g" key={label}>
            <label>{label.toUpperCase()}</label>
            <input type="text" className="f-inp" defaultValue={val} placeholder={val} />
          </div>
        ))}
      </div>
      <div className="table-scroll">
        <table className="doc-table-boxy">
        <thead>
          <tr>
            <th>#</th>
            <th>PRODUCT</th>
            <th>QTY</th>
            <th>UNIT (₹)</th>
            {showPct && <th>{pctLabel.toUpperCase()}</th>}
            <th>TOTAL</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <input type="text" placeholder="Product" className="d-inp" value={row.product} onChange={(e) => set(i, 'product', e.target.value)} />
              </td>
              <td>
                <input type="number" className="d-inp sm" value={row.qty} onChange={(e) => set(i, 'qty', e.target.value)} />
              </td>
              <td>
                <input type="number" className="d-inp sm" value={row.rate} onChange={(e) => set(i, 'rate', e.target.value)} />
              </td>
              {showPct && (
                <td>
                  <input type="number" className="d-inp sm" value={row.pct} onChange={(e) => set(i, 'pct', e.target.value)} />
                </td>
              )}
              <td className="itm-tot">{fmt(row.total)}</td>
              <td>
                <button className="del-btn" onClick={() => delRow(i)}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <button className="add-row-boxy" onClick={addRow}>
        + ADD ITEM
      </button>
      <div className="doc-tots">
        <div className="dt-r">
          <span>SUBTOTAL</span>
          <span>{fmt(subtotal)}</span>
        </div>
        {showPct && (
          <div className="dt-r">
            <span>{hasDiscount ? pctLabel.toUpperCase() : `${pctLabel.toUpperCase()} (${pctValue}%)`}</span>
            <span>{hasDiscount ? `-${fmt(pctTotal)}` : fmt(pctTotal)}</span>
          </div>
        )}
        <div className="dt-r grand">
          <span>{hasDiscount ? 'TOTAL' : 'GRAND TOTAL'}</span>
          <span>{fmt(Math.max(grand, 0))}</span>
        </div>
      </div>
      <div className="doc-acts">
        <button className="btn-owner-solid" onClick={() => showToast(`${saveLabel} saved!`, 'success')}>
          SAVE
        </button>
        {id === 'invoice' && (
          <button className="btn-owner-outline" onClick={() => showToast('Opening print…', 'info')}>
            PRINT
          </button>
        )}
        {id === 'proforma' && (
          <button className="btn-owner-outline" onClick={() => showToast('Opening print…', 'info')}>
            PRINT
          </button>
        )}
        {id === 'quotation' && (
          <button className="btn-owner-outline" onClick={() => showToast('Sent to client!', 'success')}>
            SEND
          </button>
        )}
        {extraAct === 'email' && (
          <button className="btn-owner-outline" onClick={() => showToast('Email sent!', 'success')}>
            EMAIL
          </button>
        )}
      </div>
    </div>
  );
}

export default function Docs() {
  const { ownerSection } = useApp();

  return (
    <>
      {ownerSection === 'invoice' && (
        <div className="o-section active">
          <h2 className="o-title">Purchase Invoice</h2>
          <DocEditable
            id="invoice"
            showPct
            pctLabel="GST%"
            hasDiscount={false}
            saveLabel="Invoice"
            extraAct="email"
            meta={{ 'INVOICE NO.': 'PI-2026-0047', DATE: '2026-08-07', 'DUE DATE': '2026-08-21', SUPPLIER: 'Supplier name', 'GST NO.': 'GSTIN' }}
          />
        </div>
      )}
      {ownerSection === 'proforma' && (
        <div className="o-section active">
          <h2 className="o-title">Proforma Invoice</h2>
          <DocEditable
            id="proforma"
            showPct
            pctLabel="DISC%"
            hasDiscount
            saveLabel="Proforma"
            meta={{ 'PROFORMA NO.': 'PF-2026-0012', 'VALID UNTIL': '2026-09-07', CUSTOMER: 'Customer name', 'DELIVERY TERMS': 'Ex-Works / FOB' }}
          />
        </div>
      )}
      {ownerSection === 'quotation' && (
        <div className="o-section active">
          <h2 className="o-title">Quotation</h2>
          <DocEditable
            id="quotation"
            showPct={false}
            pctLabel=""
            hasDiscount={false}
            saveLabel="Quote"
            meta={{ 'QUOTE NO.': 'QT-2026-0031', 'VALID (DAYS)': '30', CLIENT: 'Client / Institution', NOTES: 'Terms or conditions' }}
          />
        </div>
      )}
    </>
  );
}