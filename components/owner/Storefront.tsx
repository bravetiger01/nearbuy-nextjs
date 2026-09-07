'use client';

import { useApp } from '../../lib/store-context';
import type { IconProps } from '../../lib/icons';
import { StoreIcon, MapIcon, ClockIcon, EyeIcon, TrendUpIcon } from '../../lib/icons';

const StarGlyph = (p: IconProps) => (
  <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

export default function Storefront() {
  const { ownerInventory, ownerShopData, ownerShopViews, promotions } = useApp();

  const listedProducts = ownerInventory.filter((p) => p.listed);
  const activePromos = promotions.filter((p) => p.active);
  const shop = ownerShopData;

  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const weekViews = ownerShopViews.filter((v) => new Date(v.created_at).getTime() >= sevenDaysAgo).length;

  const address = [shop?.address_line_1, shop?.city, shop?.state].filter(Boolean).join(', ');

  const stats = [
    { icon: <EyeIcon size={18} />, val: weekViews.toLocaleString(), lbl: 'PROFILE VIEWS (7D)' },
    { icon: <StoreIcon size={18} />, val: String(listedProducts.length), lbl: 'LISTED PRODUCTS' },
    { icon: <StarGlyph size={18} />, val: `${shop?.rating ?? '—'} / 5`, lbl: 'AVERAGE RATING' },
    { icon: <TrendUpIcon size={18} />, val: String(activePromos.length), lbl: 'ACTIVE PROMOS' },
  ];

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <div>
          <h2 className="o-title" style={{ marginBottom: 4 }}>Storefront Preview</h2>
          <p className="o-desc" style={{ marginBottom: 0 }}>
            How your store appears to customers on the NearBuy app.
          </p>
        </div>
      </div>

      <div className="pnl-kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        {stats.map((s) => (
          <div className="pnl-kpi-boxy green" key={s.lbl}>
            <div className="pk-ic">{s.icon}</div>
            <div className="pk-val">{s.val}</div>
            <div className="pk-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="chart-card-boxy" style={{ marginBottom: 24 }}>
        <div className="ccard-top">
          <h3>Store Info</h3>
          <span
            className="ri-status"
            style={shop?.is_open
              ? { background: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0' }
              : { background: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' }}
          >
            {shop?.is_open ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 60, height: 60, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--lav-500), var(--lav-700))',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.25rem',
            }}
          >
            {(shop?.name ?? 'NB').slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.125rem', marginBottom: 2 }}>
              {shop?.name ?? 'Your Store'}
            </div>
            <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapIcon size={12} /> {address || 'Add your address in Store Settings'}
            </div>
            {shop?.phone && (
              <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginTop: 2 }}>{shop.phone}</div>
            )}
            <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ClockIcon size={12} /> {shop?.total_reviews ?? 0} reviews · {shop?.rating ?? '—'} avg rating
            </div>
          </div>

          {activePromos.length > 0 && (
            <div style={{ padding: '10px 14px', border: '1px solid var(--lav-300)', background: 'var(--lav-50)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--lav-700)' }}>
              {activePromos.length} active promo{activePromos.length > 1 ? 's' : ''} live
            </div>
          )}
        </div>
      </div>

      <div className="ccard-top">
        <h3>Listed Products</h3>
        <span className="ekl" style={{ margin: 0 }}>{listedProducts.length} ITEMS</span>
      </div>
      {listedProducts.length === 0 ? (
        <div className="exp-item-boxy">
          <div className="eib-left">
            <div className="eib-name">No products listed yet</div>
            <div className="eib-meta">Add products and toggle "Listed" to show them here.</div>
          </div>
        </div>
      ) : (
        <table className="o-table-boxy" style={{ fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {listedProducts.map((p) => (
              <tr key={p.supabaseId ?? p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>₹{p.price.toLocaleString('en-IN')}</td>
                <td>{p.stock} left</td>
                <td>
                  <span className={`ri-status ${p.stock > 0 ? 'ready' : 'cancelled'}`}>
                    {p.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        .storefront-preview-container {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 24px;
        }
        .mobile-frame {
          width: 320px;
          height: 600px;
          border: 12px solid #111;
          border-radius: 36px;
          position: relative;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          flex-shrink: 0;
        }
        .mf-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 24px;
          background: #111;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          z-index: 10;
        }
        .mf-content {
          height: 100%;
          overflow-y: auto;
          position: relative;
        }
        .mf-content::-webkit-scrollbar {
          display: none;
        }
        .mf-header-bg {
          height: 120px;
        }
        .mf-store-info {
          padding: 0 16px;
          margin-top: -30px;
          text-align: center;
        }
        .mf-avatar-wrap {
          width: 72px;
          height: 72px;
          background: #fff;
          border-radius: 50%;
          margin: 0 auto 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          position: relative;
        }
        .mf-avatar {
          width: 100%;
          height: 100%;
          background: #333;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .mf-online-badge {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          background: #10B981;
          border: 2px solid #fff;
          border-radius: 50%;
        }
        .mf-store-name {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .mf-store-meta {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 12px;
        }
        .mf-store-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          margin-bottom: 16px;
        }
        .mfd-item {
          font-size: 0.75rem;
          color: #555;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mf-promo-banner {
          background: #FEF3C7;
          color: #92400E;
          padding: 8px;
          border-radius: 8px;
          font-size: 0.75rem;
          margin-bottom: 16px;
        }
        .mf-tabs {
          display: flex;
          border-bottom: 1px solid #eee;
          margin-bottom: 16px;
        }
        .mf-tab {
          flex: 1;
          text-align: center;
          padding: 10px 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: #888;
        }
        .mf-tab.active {
          color: var(--lav-700);
          border-bottom: 2px solid var(--lav-700);
        }
        .mf-products-area {
          padding: 0 16px 24px;
        }
        .mf-product-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mf-product-card {
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 12px;
        }
        .mfp-info {
          flex: 1;
        }
        .mfp-name {
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .mfp-desc {
          font-size: 0.7rem;
          color: #888;
          margin-bottom: 6px;
        }
        .mfp-price {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .mfp-old-price {
          font-size: 0.7rem;
          color: #999;
          text-decoration: line-through;
          margin-left: 6px;
          font-weight: normal;
        }
        .mfp-add-btn {
          background: var(--lav-100);
          color: var(--lav-700);
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .mfp-oos {
          font-size: 0.7rem;
          color: #ef4444;
          font-weight: 600;
        }
        .storefront-stats {
          flex: 1;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ss-card {
          padding: 20px;
          border: var(--brd);
          border-radius: var(--r-sm);
          background: #fff;
          box-shadow: var(--shadow-sm);
        }
        .ssc-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #666;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .ssc-val {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .ssc-trend.up {
          color: #10b981;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .ssc-sub {
          font-size: 0.8rem;
          color: #888;
        }
      `}</style>
    </div>
  );
}