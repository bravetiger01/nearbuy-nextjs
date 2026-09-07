'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';
import { Bar, Doughnut, rupee } from '../../lib/charts';
import { RupeeIcon, BoxIcon, EyeIcon, ReserveIcon } from '../../lib/icons';

const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PAID_STATUSES = ['delivered', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'];

function categorize(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('notebook')) return 'Notebooks';
  if (n.includes('pen') || n.includes('highlighter') || n.includes('pencil')) return 'Pens';
  if (n.includes('geometry') || n.includes('scale') || n.includes('graph') || n.includes('ruler')) return 'Math';
  if (n.includes('calculator') || n.includes('cartridge') || n.includes('electronic')) return 'Electronics';
  if (n.includes('paper')) return 'Paper';
  if (n.includes('stapler') || n.includes('folder') || n.includes('fevicol') || n.includes('file')) return 'Office';
  return 'Other';
}

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const dayKey = (d: Date) => `${monthKey(d)}-${String(d.getDate()).padStart(2, '0')}`;

export default function Dashboard() {
  const { reservations, ownerInventory, ownerOrders, ownerOrderItems, ownerShopViews, promotions, setOwnerSection, openModal, setEditProduct } = useApp();
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');

  const now = new Date();
  const thisMonth = monthKey(now);

  const revenueOrders = ownerOrders.filter(
    (o) => PAID_STATUSES.includes(o.status) && o.payment_status === 'paid'
  );
  const monthRevenue = revenueOrders
    .filter((o) => o.created_at.startsWith(thisMonth))
    .reduce((s, o) => s + Number(o.total_amount), 0);

  // Revenue overview — last 6 months vs last 7 days
  const monthlyChart = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: MONTH_KEYS[d.getMonth()],
      rev: revenueOrders
        .filter((o) => o.created_at.startsWith(monthKey(d)))
        .reduce((s, o) => s + Number(o.total_amount), 0),
    };
  });
  const weeklyChart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
    return {
      label: MONTH_KEYS[d.getMonth()].slice(0, 3) + ' ' + d.getDate(),
      rev: revenueOrders
        .filter((o) => o.created_at.startsWith(dayKey(d)))
        .reduce((s, o) => s + Number(o.total_amount), 0),
    };
  });
  const chartData = period === 'monthly' ? monthlyChart : weeklyChart;

  // Category split by revenue from order_items
  const revenueByCat: Record<string, number> = {};
  ownerOrderItems.forEach((it) => {
    const cat = categorize(it.product_name);
    revenueByCat[cat] = (revenueByCat[cat] ?? 0) + Number(it.subtotal);
  });
  const catEntries = Object.entries(revenueByCat).sort((a, b) => b[1] - a[1]);
  const catColors = ['#8B5CF6', '#A78BFA', '#7C3AED', '#5B21B6', '#C4B5FD', '#4C1D95', '#9333EA'];

  const viewsThisMonth = ownerShopViews.filter((v) => v.created_at.startsWith(thisMonth)).length;
  const activeReservations = reservations.filter((r) => ['pending', 'confirmed', 'ready'].includes(r.status));
  const activePromos = promotions.filter((p) => p.active).length;

  const kpis = [
    { icon: <RupeeIcon size={18} />, val: `₹${monthRevenue.toLocaleString('en-IN')}`, lbl: 'REVENUE THIS MONTH', chg: `${revenueOrders.length} total orders`, cls: 'purple' },
    { icon: <BoxIcon size={18} />, val: String(ownerInventory.length), lbl: 'PRODUCTS LISTED', chg: 'Live on storefront', cls: 'dark' },
    { icon: <EyeIcon size={18} />, val: viewsThisMonth.toLocaleString('en-IN'), lbl: 'PLATFORM VIEWS', chg: 'This month', cls: 'light' },
    { icon: <ReserveIcon size={18} />, val: String(activeReservations.length), lbl: 'ACTIVE RESERVATIONS', chg: 'Pending or confirmed', cls: 'white' },
  ];

  const lowStock = ownerInventory
    .filter((p) => p.stock <= (p.minThreshold ?? 10))
    .sort((a, b) => a.stock - b.stock);

  const quickActions = [
    { icon: '＋', label: 'Add Product', action: () => { setEditProduct(null); openModal('addProduct'); } },
    { icon: '⚡', label: 'Scan Bill', action: () => setOwnerSection('scanner') },
    { icon: '📦', label: 'Update Stock', action: () => setOwnerSection('inventory') },
    { icon: '🏷️', label: 'Promotion', action: () => setOwnerSection('promotions') },
    { icon: '📊', label: 'Analytics', action: () => setOwnerSection('analytics') },
    { icon: '🤖', label: 'AI Assistant', action: () => setOwnerSection('assistant') },
  ];

  return (
    <div className="o-section active">
      {/* Quick Actions */}
      <div className="quick-actions-boxy">
        <div className="qa-label">QUICK ACTIONS</div>
        <div className="qa-grid">
          {quickActions.map((qa) => (
            <button key={qa.label} className="qa-btn" onClick={qa.action}>
              <span className="qa-icon">{qa.icon}</span>
              <span className="qa-lbl">{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Promo Banner */}
      {activePromos > 0 && (
        <div className="promo-banner-boxy" onClick={() => setOwnerSection('promotions')} style={{ cursor: 'pointer' }}>
          <span>🏷️</span>
          <span><strong>{activePromos} active promotion{activePromos > 1 ? 's' : ''}</strong> running — Click to manage</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', opacity: 0.7 }}>VIEW →</span>
        </div>
      )}

      {/* KPI Row */}
      <div className="kpi-row">
        {kpis.map((k) => (
          <div className={`kpi-boxy ${k.cls}`} key={k.lbl}>
            <div className="kpi-icon-boxy">{k.icon}</div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-lbl">{k.lbl}</div>
            <div className="kpi-chg">{k.chg}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid-boxy">
        <div className="chart-card-boxy wide">
          <div className="ccard-top">
            <h3>Revenue Overview</h3>
            <select className="ccard-period" value={period} onChange={(e) => setPeriod(e.target.value as 'monthly' | 'weekly')}>
              <option value="monthly">MONTHLY</option>
              <option value="weekly">LAST 7 DAYS</option>
            </select>
          </div>
          <div style={{ height: 260 }}>
            {chartData.every((d) => d.rev === 0) ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                No sales yet — run the business seed for demo data.
              </div>
            ) : (
              <Bar
                data={{
                  labels: chartData.map((d) => d.label),
                  datasets: [
                    {
                      label: 'Revenue (₹)',
                      data: chartData.map((d) => d.rev),
                      backgroundColor: 'rgba(139,92,246,0.8)',
                      borderColor: '#5B21B6',
                      borderWidth: 2,
                      borderRadius: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { callback: (v) => rupee(Number(v)) }, grid: { color: 'rgba(0,0,0,0.05)' } } },
                }}
              />
            )}
          </div>
        </div>
        <div className="chart-card-boxy">
          <div className="ccard-top">
            <h3>Category Split</h3>
          </div>
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {catEntries.length === 0 ? (
              <span className="chart-empty">No order data yet.</span>
            ) : (
              <Doughnut
                data={{
                  labels: catEntries.map(([k]) => k),
                  datasets: [
                    {
                      data: catEntries.map(([, v]) => v),
                      backgroundColor: catEntries.map((_, i) => catColors[i % catColors.length]),
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } } },
                  cutout: '62%',
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="dash-two-boxy">
        <div className="dash-block-boxy">
          <div className="dbb-title">
            Recent Reservations <span className="count-tag">{activeReservations.length}</span>
          </div>
          {activeReservations.length === 0 ? (
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No active reservations.</p>
          ) : (
            activeReservations.slice(0, 5).map((r) => (
              <div className="res-item-boxy" key={r.id}>
                <div>
                  <div className="ri-name">{r.customer}</div>
                  <div className="ri-prod">
                    {r.product} × {r.qty}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`ri-status ${r.status}`}>{r.status.toUpperCase()}</span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', marginTop: 3, letterSpacing: '0.04em' }}>
                    {new Date(r.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            ))
          )}
          <button
            className="btn-owner-outline"
            style={{ marginTop: 14, width: '100%', fontSize: '0.72rem' }}
            onClick={() => setOwnerSection('analytics')}
          >
            VIEW ALL ORDERS →
          </button>
        </div>
        <div className="dash-block-boxy">
          <div className="dbb-title">Low Stock Alert</div>
          {lowStock.length ? (
            lowStock.map((p) => (
              <div className="ls-item-boxy" key={p.id}>
                <div>
                  <div className="lsi-prod">{p.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 2 }}>{p.supplier || 'Supplier'}</div>
                </div>
                <span className={`lsi-stock ${p.stock <= 5 ? 'critical' : 'low'}`}>{p.stock} LEFT</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>All stock levels OK ✓</p>
          )}
          <button
            className="btn-owner-outline"
            style={{ marginTop: 14, width: '100%', fontSize: '0.72rem' }}
            onClick={() => setOwnerSection('inventory')}
          >
            MANAGE INVENTORY →
          </button>
        </div>
      </div>
    </div>
  );
}