'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';
import { Bar, Doughnut, rupee } from '../../lib/charts';
import { ANALYTICS_DATA, BEST_SELLERS, SLOW_MOVERS } from '../../lib/data';

export default function Analytics() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  const data = ANALYTICS_DATA[period];

  const totalRev = data.revenue.reduce((a, b) => a + b, 0);
  const totalOrd = data.orders.reduce((a, b) => a + b, 0);
  const aov = totalOrd > 0 ? Math.round(totalRev / totalOrd) : 0;

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">Sales Analytics</h2>
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
              onClick={() => setPeriod(t.id as any)}
            >
              {t.label}
            </button>
          ))}
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
          <Bar
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: 'Revenue (₹)',
                  data: data.revenue,
                  backgroundColor: 'rgba(139,92,246,0.8)',
                  borderColor: '#5B21B6',
                  borderWidth: 2,
                  borderRadius: 0,
                  yAxisID: 'y',
                },
                {
                  type: 'line' as const,
                  label: 'Orders',
                  data: data.orders,
                  borderColor: '#0A0A0A',
                  backgroundColor: '#0A0A0A',
                  borderWidth: 2,
                  pointBackgroundColor: '#0A0A0A',
                  tension: 0.3,
                  yAxisID: 'y1',
                }
              ],
            }}
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
              {BEST_SELLERS.map((p, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.sold}</td>
                  <td>₹{p.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
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
                <th>REV (₹)</th>
              </tr>
            </thead>
            <tbody>
              {SLOW_MOVERS.map((p, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.sold}</td>
                  <td>₹{p.revenue.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
