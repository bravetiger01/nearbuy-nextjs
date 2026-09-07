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
    </div>
  );
}