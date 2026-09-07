'use client';

import { useApp } from '../../lib/store-context';
import { UserIcon } from '../../lib/icons';

export default function SettingsView() {
  const { showToast, ownerLogout } = useApp();
  
  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">Store Settings</h2>
        <button 
          className="btn-owner-outline" 
          onClick={ownerLogout}
          style={{ borderColor: '#FECACA', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <UserIcon size={14} /> LOGOUT
        </button>
      </div>
      
      <div className="settings-boxy" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', marginBottom: 16 }}>Store Information</h3>
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

      <div className="settings-boxy">
        <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', marginBottom: 16 }}>Subscription Plan</h3>
        <div className="pricing-grid">
          <div className="pricing-card active">
            <div className="pc-badge">CURRENT PLAN</div>
            <h4>Free Plan</h4>
            <div className="pc-price">₹0<span>/month</span></div>
            <ul className="pc-feats">
              <li>✓ Basic Storefront</li>
              <li>✓ Up to 50 Products</li>
              <li>✓ Standard Search listing</li>
            </ul>
            <button className="btn-owner-outline" disabled>ACTIVE</button>
          </div>

          <div className="pricing-card">
            <h4>Smart+</h4>
            <div className="pc-price">₹499<span>/month</span></div>
            <ul className="pc-feats">
              <li>✓ Everything in Free</li>
              <li>✓ Unlimited Products</li>
              <li>✓ Basic Sales Analytics</li>
              <li>✓ Promotions feature</li>
            </ul>
            <button className="btn-owner-solid" onClick={() => showToast('Redirecting to payment gateway...', 'info')}>UPGRADE</button>
          </div>

          <div className="pricing-card pro">
            <div className="pc-badge">RECOMMENDED</div>
            <h4>Smart+ Pro</h4>
            <div className="pc-price">₹999<span>/month</span></div>
            <ul className="pc-feats">
              <li>✓ Everything in Smart+</li>
              <li>✓ AI Business Assistant</li>
              <li>✓ AI Bill Scanner</li>
              <li>✓ Advanced Analytics</li>
              <li>✓ Priority Search placement</li>
            </ul>
            <button className="btn-owner-solid" onClick={() => showToast('Redirecting to payment gateway...', 'info')}>UPGRADE</button>
          </div>
        </div>
      </div>
    </div>
  );
}