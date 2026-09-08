'use client';

import { useMemo } from 'react';
import { useApp } from '../../lib/store-context';
import { Line } from '../../lib/charts';
import { GeoUpIcon, GeoDownIcon, BoltIcon, BarChartIcon } from '../../lib/icons';

const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PAID_STATUSES = ['delivered', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'];
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export default function PnL() {
  const { ownerOrders, ownerExpenses, expenses } = useApp();

  const revenueOrders = ownerOrders.filter(
    (o) => PAID_STATUSES.includes(o.status) && o.payment_status === 'paid'
  );

  const { totalRevenue, totalExpenses, netProfit, margin, chart } = useMemo(() => {
    const now = new Date();
    const revenueByMonth: Record<string, number> = {};
    const expensesByMonth: Record<string, number> = {};
    let rev = 0, exp = 0;

    revenueOrders.forEach((o) => {
      const k = o.created_at.substring(0, 7);
      const amt = Number(o.total_amount);
      revenueByMonth[k] = (revenueByMonth[k] ?? 0) + amt;
      rev += amt;
    });
    ownerExpenses.forEach((e) => {
      const k = e.expense_date.substring(0, 7);
      const amt = Number(e.amount);
      expensesByMonth[k] = (expensesByMonth[k] ?? 0) + amt;
      exp += amt;
    });

    const labels: string[] = [];
    const revenueData: number[] = [];
    const expensesData: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = monthKey(d);
      labels.push(MONTH_KEYS[d.getMonth()]);
      revenueData.push(revenueByMonth[k] ?? 0);
      expensesData.push(expensesByMonth[k] ?? 0);
    }

    const profit = rev - exp;
    const marginPct = rev > 0 ? Math.round((profit / rev) * 1000) / 10 : 0;

    return {
      totalRevenue: rev,
      totalExpenses: exp,
      netProfit: profit,
      margin: marginPct,
      chart: { labels, revenueData, expensesData },
    };
  }, [revenueOrders, ownerExpenses]);

  // `expenses` (mapped list) used only for a fallback when ownerExpenses is empty
  const fallbackExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const kpis = [
    { icon: <GeoUpIcon size={20} />, val: `₹${totalRevenue.toLocaleString('en-IN')}`, lbl: 'TOTAL REVENUE', cls: 'green' },
    { icon: <GeoDownIcon size={20} />, val: `₹${totalExpenses.toLocaleString('en-IN')}`, lbl: 'TOTAL EXPENSES', cls: 'red' },
    { icon: <BoltIcon size={20} />, val: `₹${netProfit.toLocaleString('en-IN')}`, lbl: 'NET PROFIT', cls: 'lavender' },
    { icon: <BarChartIcon size={20} />, val: `${margin}%`, lbl: 'PROFIT MARGIN', cls: 'dark' },
  ];

  return (
    <div className="o-section active">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 className="o-title" style={{ marginBottom: 0 }}>Profit & Loss Report</h2>
        <button className="btn-owner-outline" onClick={() => window.print()}>
          EXPORT TO PDF
        </button>
      </div>
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
              labels: chart.labels,
              datasets: [
                {
                  label: 'Revenue',
                  data: chart.revenueData,
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139,92,246,0.06)',
                  fill: true,
                  tension: 0.3,
                  pointBackgroundColor: '#8B5CF6',
                  borderWidth: 2,
                },
                {
                  label: 'Expenses',
                  data: chart.expensesData,
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
      {totalRevenue === 0 && ownerExpenses.length === 0 && fallbackExpenses === 0 && (
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 16 }}>
          No revenue or expenses recorded yet.
        </p>
      )}
    </div>
  );
}