'use client';

import { useApp } from '../../lib/store-context';
import { StoreIcon, MapIcon, ClockIcon } from '../../lib/icons';

export default function Storefront() {
  const { ownerInventory, promotions } = useApp();
  
  const listedProducts = ownerInventory.filter(p => p.listed);
  const activePromo = promotions.find(p => p.active);

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <div>
          <h2 className="o-title" style={{ marginBottom: 4 }}>Storefront Preview</h2>
          <p className="o-desc" style={{ marginBottom: 0 }}>This is how your store appears to customers on the NEARBUY app.</p>
        </div>
      </div>

      <div className="storefront-preview-container">
        {/* Mock Mobile Device Frame */}
        <div className="mobile-frame">
          <div className="mf-notch"></div>
          
          <div className="mf-content">
            {/* Header image / gradient */}
            <div className="mf-header-bg" style={{ background: 'linear-gradient(135deg, var(--lav-500), var(--lav-700))', height: 120 }}></div>
            
            <div className="mf-store-info">
              <div className="mf-avatar-wrap">
                <div className="mf-avatar">SM</div>
                <div className="mf-online-badge"></div>
              </div>
              
              <h1 className="mf-store-name">SVIT Stationery Mart</h1>
              <div className="mf-store-meta">
                <span>Stationery</span> • <span>4.8 ★</span> • <span>0.2 km</span>
              </div>
              
              <div className="mf-store-details">
                <div className="mfd-item"><MapIcon size={12} /> Near SVIT Gate, Vasad</div>
                <div className="mfd-item"><ClockIcon size={12} /> Open • Closes 9:00 PM</div>
              </div>

              {activePromo && (
                <div className="mf-promo-banner">
                  <strong>{activePromo.discountPct}% OFF</strong> — {activePromo.name}
                </div>
              )}
            </div>

            <div className="mf-products-area">
              <div className="mf-tabs">
                <div className="mf-tab active">All Items</div>
                <div className="mf-tab">Notebooks</div>
                <div className="mf-tab">Pens</div>
              </div>

              <div className="mf-product-list">
                {listedProducts.length === 0 ? (
                  <div className="mf-empty">No products listed.</div>
                ) : (
                  listedProducts.map(p => (
                    <div className="mf-product-card" key={p.id}>
                      <div className="mfp-info">
                        <div className="mfp-name">{p.name}</div>
                        {p.description && <div className="mfp-desc">{p.description.substring(0,40)}...</div>}
                        <div className="mfp-price">
                          ₹{p.price.toLocaleString('en-IN')}
                          {activePromo && <span className="mfp-old-price">₹{Math.round(p.price / (1 - activePromo.discountPct/100))}</span>}
                        </div>
                      </div>
                      <div className="mfp-action">
                        {p.stock > 0 ? (
                          <button className="mfp-add-btn">ADD</button>
                        ) : (
                          <span className="mfp-oos">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="storefront-stats">
          <div className="ss-card">
            <div className="ssc-label">PROFILE VIEWS (7D)</div>
            <div className="ssc-val">1,834</div>
            <div className="ssc-trend up">↑ 23%</div>
          </div>
          <div className="ss-card">
            <div className="ssc-label">CONVERSION RATE</div>
            <div className="ssc-val">4.2%</div>
            <div className="ssc-trend up">↑ 0.5%</div>
          </div>
          <div className="ss-card">
            <div className="ssc-label">CUSTOMER RATING</div>
            <div className="ssc-val">4.8 / 5.0</div>
            <div className="ssc-sub">Based on 142 reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}
