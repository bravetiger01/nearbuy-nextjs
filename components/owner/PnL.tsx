'use client';

import { Line } from '../../lib/charts';
import { GeoUpIcon, GeoDownIcon, BoltIcon, BarChartIcon } from '../../lib/icons';

export default function PnL() {
  const kpis = [
    { icon: <GeoUpIcon size={20} />, val: '₹84,320', lbl: 'TOTAL REVENUE', cls: 'green' },
    { icon: <GeoDownIcon size={20} />, val: '₹51,870', lbl: 'TOTAL EXPENSES', cls: 'red' },
    { icon: <BoltIcon size={20} />, val: '₹32,450', lbl: 'NET PROFIT', cls: 'lavender' },
    { icon: <BarChartIcon size={20} />, val: '38.5%', lbl: 'PROFIT MARGIN', cls: 'dark' },
  ];

  return (
    <div className="o-section active">
      <h2 className="o-title">Profit & Loss Report</h2>
      <div className="pnl-kpi-row">
        {kpis.map((k) => (
          <div className={`pnl-kpi-boxy ${k.cls}`} key={k.lbl}>
            <div className="pk-ic">{k.icon}</div>
            <div className="pk-val">{k.val}</div>
            <div className="pk-lbl">{k.lbl}</div>
          </div>
        ))}
      </div>
      <div className="chart-card-boxy">
        <div className="ccard-top">
          <h3>Revenue vs Expenses (Monthly)</h3>
        </div>
        <div style={{ height: 320 }}>
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              datasets: [
                {
                  label: 'Revenue',
                  data: [42000, 55000, 48000, 61000, 58000, 72000, 79000, 84320],
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139,92,246,0.06)',
                  fill: true,
                  tension: 0.3,
                  pointBackgroundColor: '#8B5CF6',
                  borderWidth: 2,
                },
                {
                  label: 'Expenses',
                  data: [28000, 32000, 29000, 35000, 33000, 40000, 48000, 51870],
                  borderColor: '#0A0A0A',
                  backgroundColor: 'rgba(10,10,10,0.04)',
                  fill: true,
                  tension: 0.3,
                  pointBackgroundColor: '#0A0A0A',
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top', labels: { font: { weight: 'bold' } } } },
              scales: { y: { beginAtZero: false, ticks: { callback: (v) => `₹${Number(v).toLocaleString()}` } } },
            }}
          />
        </div>
      </div>
    </div>
  );
}