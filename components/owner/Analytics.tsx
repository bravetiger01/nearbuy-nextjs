'use client';

import { useState } from 'react';
import type { ChartData } from 'chart.js';
import { Bar, rupee } from '../../lib/charts';
import { useApp } from '../../lib/store-context';

const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PAID_STATUSES = ['delivered', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'];
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

type Period = 'today' | 'week' | 'month' | 'quarter';

export default function Analytics() {
  const { ownerOrders, ownerOrderItems, ownerInventory } = useApp();
  const [period, setPeriod] = useState<Period>('week');

  const now = new Date();
  const paidOrders = ownerOrders.filter((o) => PAID_STATUSES.includes(o.status));

  // Filter orders by period
  const orders = paidOrders.filter((o) => {
    const diffDays = (now.getTime() - new Date(o.created_at).getTime()) / 86400000;
    if (period === 'today') return diffDays < 1;
    if (period === 'week') return diffDays < 7;
    if (period === 'month') return diffDays < 30;
    return diffDays < 90;
  });

  const orderIds = new Set(orders.map((o) => o.id));
  const items = ownerOrderItems.filter((it) => orderIds.has(it.order_id));

  const totalRev = orders.reduce((s, o) => s + Number(o.total_amount), 0);
  const totalOrd = orders.length;
  const aov = totalOrd > 0 ? Math.round(totalRev / totalOrd) : 0;

  // ─── Sales trend buckets ───────────────────────────────────────────────────
  let labels: string[] = [];
  let revData: number[] = [];
  let orderData: number[] = [];

  if (period === 'today') {
    for (let h = 0; h < 24; h += 3) {
      labels.push(`${String(h).padStart(2, '0')}:00`);
      const bucket = orders.filter((o) => new Date(o.created_at).getHours() >= h && new Date(o.created_at).getHours() < h + 3);
      revData.push(bucket.reduce((s, o) => s + Number(o.total_amount), 0));
      orderData.push(bucket.length);
    }
  } else if (period === 'week') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = dayKey(d);
      labels.push(`${MONTH_KEYS[d.getMonth()].slice(0, 3)} ${d.getDate()}`);
      const bucket = orders.filter((o) => o.created_at.startsWith(key));
      revData.push(bucket.reduce((s, o) => s + Number(o.total_amount), 0));
      orderData.push(bucket.length);
    }
  } else if (period === 'month') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      labels.push(`${MONTH_KEYS[d.getMonth()].slice(0, 3)} ${d.getDate()}`);
      const bucket = orders.filter((o) => o.created_at.startsWith(dayKey(d)));
      revData.push(bucket.reduce((s, o) => s + Number(o.total_amount), 0));
      orderData.push(bucket.length);
    }
  } else {
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(`${MONTH_KEYS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`);
      const bucket = orders.filter((o) => o.created_at.startsWith(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`));
      revData.push(bucket.reduce((s, o) => s + Number(o.total_amount), 0));
      orderData.push(bucket.length);
    }
  }

  // ─── Best sellers & slow movers ────────────────────────────────────────────
  const byProduct: Record<string, { name: string; sold: number; revenue: number }> = {};
  items.forEach((it) => {
    const entry = byProduct[it.product_name] ?? { name: it.product_name, sold: 0, revenue: 0 };
    entry.sold += it.quantity;
    entry.revenue += Number(it.subtotal);
    byProduct[it.product_name] = entry;
  });
  const bestSellers = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 6);

  // Products with no sales in the period, lowest stock first
  const soldNames = new Set(items.map((it) => it.product_name));
  const slowMovers = ownerInventory
    .filter((p) => p.listed && p.stock > 0 && !soldNames.has(p.name))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
    .map((p) => ({ name: p.name, sold: 0, revenue: 0, stock: p.stock }));

  return (
    <div className="o-section active">
      <div className="o-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="o-title" style={{ marginBottom: 0 }}>Sales Analytics</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="time-tabs">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: '7 Days' },
            { id: 'month', label: '30 Days' },
            { id: 'quarter', label: '3 Months' },
          ].map((t) => (
            <button
              key={t.id}
              className={`time-tab ${period === t.id ? 'active' : ''}`}
              onClick={() => setPeriod(t.id as Period)}
            >
              {t.label}
            </button>
          ))}
          </div>
          <button className="btn-owner-outline print-include" onClick={() => window.print()} style={{ height: 34, padding: '0 16px' }}>
            EXPORT PDF
          </button>
        </div>
      </div>

      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="kpi-boxy white">
          <div className="kpi-lbl">TOTAL REVENUE</div>
          <div className="kpi-val" style={{ color: 'var(--lav-600)' }}>₹{totalRev.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-boxy white">
          <div className="kpi-lbl">NUMBER OF ORDERS</div>
          <div className="kpi-val">{totalOrd.toLocaleString()}</div>
        </div>
        <div className="kpi-boxy white">
          <div className="kpi-lbl">AVERAGE ORDER VALUE</div>
          <div className="kpi-val">₹{aov.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="chart-card-boxy" style={{ marginBottom: 24 }}>
        <div className="ccard-top">
          <h3>Sales Trend</h3>
        </div>
        <div style={{ height: 300 }}>
          {totalOrd === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              No orders in this period.
            </div>
          ) : (
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: 'Revenue (₹)',
                    type: 'bar' as const,
                    data: revData,
                    backgroundColor: 'rgba(139,92,246,0.8)',
                    borderColor: '#5B21B6',
                    borderWidth: 2,
                    borderRadius: 0,
                    yAxisID: 'y',
                  },
                  {
                    type: 'line' as const,
                    label: 'Orders',
                    data: orderData,
                    borderColor: '#0A0A0A',
                    backgroundColor: '#0A0A0A',
                    borderWidth: 2,
                    pointBackgroundColor: '#0A0A0A',
                    tension: 0.3,
                    yAxisID: 'y1',
                  }
                ],
              } as unknown as ChartData<'bar'>}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                  y: { type: 'linear', display: true, position: 'left', ticks: { callback: (v) => rupee(Number(v)) } },
                  y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } },
                },
              }}
            />
          )}
        </div>
      </div>

      <div className="dash-two-boxy">
        <div className="dash-block-boxy">
          <div className="dbb-title" style={{ color: '#059669' }}>Top Performers</div>
          <table className="o-table-boxy" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SOLD</th>
                <th>REV (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16, color: 'var(--gray-400)' }}>No sales yet.</td></tr>
              ) : (
                bestSellers.map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.sold}</td>
                    <td>₹{p.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="dash-block-boxy">
          <div className="dbb-title" style={{ color: '#DC2626' }}>Slow Movers</div>
          <table className="o-table-boxy" style={{ fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SOLD</th>
                <th>STOCK</th>
              </tr>
            </thead>
            <tbody>
              {slowMovers.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16, color: 'var(--gray-400)' }}>All products are selling.</td></tr>
              ) : (
                slowMovers.map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.sold}</td>
                    <td>{p.stock} left</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}