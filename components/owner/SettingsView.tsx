'use client';

import { useApp } from '../../lib/store-context';

export default function SettingsView() {
  const { showToast } = useApp();
  return (
    <div className="o-section active">
      <h2 className="o-title">Store Settings</h2>
      <div className="settings-boxy">
        <div className="form-grid">
          {[
            ['STORE NAME', 'SVIT Stationery Mart'],
            ['PHONE', '+91 94265 12345'],
            ['HOURS', '9:00 AM – 9:00 PM'],
          ].map(([label, val], i) => (
            <div className="form-g" key={label}>
              <label>{label}</label>
              {i === 2 ? (
                <input type="text" className="f-inp" defaultValue={val} />
              ) : (
                <input type="text" className="f-inp" defaultValue={val} />
              )}
            </div>
          ))}
          <div className="form-g">
            <label>CATEGORY</label>
            <select className="f-inp" defaultValue="Stationery">
              {['Stationery', 'Electronics', 'Grocery', 'Medical', 'Hardware'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-g full">
          <label>ADDRESS</label>
          <input type="text" className="f-inp" defaultValue="Near SVIT Gate, Vasad, Anand District, Gujarat — 388306" />
        </div>
        <div className="toggle-list">
          {['Show on nearbuy platform', 'Accept reservations', 'Allow rider orders', 'Allow Style Guide orders'].map((t) => (
            <div className="toggle-row-boxy" key={t}>
              <span>{t}</span>
              <label className="tgl">
                <input type="checkbox" defaultChecked />
                <span className="tgl-slider" />
              </label>
            </div>
          ))}
        </div>
        <button className="btn-owner-solid" onClick={() => showToast('Settings saved!', 'success')}>
          SAVE SETTINGS
        </button>
      </div>
    </div>
  );
}