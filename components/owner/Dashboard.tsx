'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';
import { Bar, Doughnut, rupee } from '../../lib/charts';
import { RupeeIcon, BoxIcon, EyeIcon, ReserveIcon, BoltIcon, BarChartIcon, StoreIcon } from '../../lib/icons';

const MONTHLY = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  data: [42000, 55000, 48000, 61000, 58000, 72000, 79000, 84320, 84320],
};
const WEEKLY = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  data: [8200, 12400, 9800, 11200, 14500, 18000, 10200],
};

export default function Dashboard() {
  const { reservations, ownerInventory, setOwnerSection, openModal, setEditProduct, promotions } = useApp();
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');

  const chartData = period === 'monthly' ? MONTHLY : WEEKLY;
  const activePromos = promotions.filter((p) => p.active).length;
  const totalRevenue = 84320;

  const kpis = [
    { icon: <RupeeIcon size={18} />, val: '₹84,320', lbl: 'REVENUE THIS MONTH', chg: '+12.4% vs last month', cls: 'purple' },
    { icon: <BoxIcon size={18} />, val: String(ownerInventory.length), lbl: 'PRODUCTS LISTED', chg: '+8 this week', cls: 'dark' },
    { icon: <EyeIcon size={18} />, val: '1,834', lbl: 'PLATFORM VIEWS', chg: '+23% this week', cls: 'light' },
    { icon: <ReserveIcon size={18} />, val: String(reservations.length), lbl: 'ACTIVE RESERVATIONS', chg: '2 new today', cls: 'white' },
  ];

  const lowStock = ownerInventory.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock);

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
              <option value="weekly">WEEKLY</option>
            </select>
          </div>
          <div style={{ height: 260 }}>
            <Bar
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    label: 'Revenue (₹)',
                    data: chartData.data,
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
          </div>
        </div>
        <div className="chart-card-boxy">
          <div className="ccard-top">
            <h3>Category Split</h3>
          </div>
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut
              data={{
                labels: ['Notebooks', 'Pens', 'Math', 'Electronics', 'Paper', 'Office'],
                datasets: [
                  {
                    data: [30, 25, 15, 10, 12, 8],
                    backgroundColor: ['#8B5CF6', '#A78BFA', '#7C3AED', '#5B21B6', '#C4B5FD', '#4C1D95'],
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
          </div>
        </div>
      </div>

      <div className="dash-two-boxy">
        <div className="dash-block-boxy">
          <div className="dbb-title">
            Recent Reservations <span className="count-tag">{reservations.length}</span>
          </div>
          {reservations.slice(0, 5).map((r) => (
            <div className="res-item-boxy" key={r.id}>
              <div>
                <div className="ri-name">{r.customer}</div>
                <div className="ri-prod">
                  {r.product} × {r.qty}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`ri-status ${r.status}`}>{r.status.toUpperCase()}</span>
                <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', marginTop: 3, letterSpacing: '0.04em' }}>{r.time}</div>
              </div>
            </div>
          ))}
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