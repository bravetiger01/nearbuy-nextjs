'use client';

import { useApp } from '../../lib/store-context';

export default function Bank() {
  const { showToast } = useApp();
  return (
    <div className="o-section active">
      <h2 className="o-title">Bank Details</h2>
      <div className="settings-boxy">
        <div className="form-grid">
          {[
            ['ACCOUNT HOLDER', 'SVIT Stationery Mart'],
            ['BANK NAME', 'State Bank of India'],
            ['ACCOUNT NUMBER', 'XXXX XXXX 4821'],
            ['IFSC CODE', 'SBIN0011234'],
            ['UPI ID', 'svitmart@sbi'],
            ['GST NUMBER', '24AAAAA0000A1Z5'],
          ].map(([label, val]) => (
            <div className="form-g" key={label}>
              <label>{label}</label>
              <input type="text" className="f-inp" defaultValue={val} />
            </div>
          ))}
        </div>
        <div className="qr-boxy">
          <div className="qr-inner-box">QR</div>
          <p>UPI QR — svitmart@sbi</p>
        </div>
        <button className="btn-owner-solid" onClick={() => showToast('Bank details saved!', 'success')}>
          SAVE DETAILS
        </button>
      </div>
    </div>
  );
}