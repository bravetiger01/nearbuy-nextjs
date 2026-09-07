'use client';

import { useMemo } from 'react';
import { useApp } from '../../lib/store-context';
import { Bar } from '../../lib/charts';

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function Expenses() {
  const { expenses, openModal } = useApp();

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 6);

  const { thisMonthTotal, thisWeekTotal, todayTotal, chart } = useMemo(() => {
    let month = 0, week = 0, today = 0;
    const byCat: Record<string, number> = {};
    expenses.forEach((e) => {
      if (e.date.startsWith(thisMonth)) month += e.amount;
      if (new Date(e.date) >= thisWeekStart) week += e.amount;
      if (e.date === dayKey(now)) today += e.amount;
      byCat[e.category] = (byCat[e.category] ?? 0) + e.amount;
    });

    const knownCats = ['Rent', 'Electricity', 'Stock Purchase', 'Staff Salary', 'Transport', 'Miscellaneous', 'Packaging', 'Internet'];
    const cats = knownCats.filter((c) => byCat[c]);
    // include any others
    Object.keys(byCat).forEach((c) => { if (!cats.includes(c)) cats.push(c); });

    return {
      thisMonthTotal: month,
      thisWeekTotal: week,
      todayTotal: today,
      chart: { cats, values: cats.map((c) => byCat[c]) },
    };
  }, [expenses, thisMonth, now]);

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">Expenses</h2>
        <button className="btn-owner-solid" onClick={() => openModal('addExp')}>
          + ADD EXPENSE
        </button>
      </div>
      <div className="exp-kpi-row">
        <div className="exp-kpi-boxy">
          <div className="ekv">{`₹${thisMonthTotal.toLocaleString('en-IN')}`}</div>
          <div className="ekl">THIS MONTH</div>
        </div>
        <div className="exp-kpi-boxy">
          <div className="ekv">{`₹${thisWeekTotal.toLocaleString('en-IN')}`}</div>
          <div className="ekl">LAST 7 DAYS</div>
        </div>
        <div className="exp-kpi-boxy">
          <div className="ekv">{`₹${todayTotal.toLocaleString('en-IN')}`}</div>
          <div className="ekl">TODAY</div>
        </div>
      </div>
      <div className="chart-card-boxy" style={{ marginBottom: 24 }}>
        <div className="ccard-top">
          <h3>Expenses by Category</h3>
        </div>
        <div style={{ height: 260 }}>
          {chart.cats.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              No expenses recorded yet.
            </div>
          ) : (
            <Bar
              data={{
                labels: chart.cats,
                datasets: [
                  {
                    label: 'Amount (₹)',
                    data: chart.values,
                    backgroundColor: 'rgba(139,92,246,0.7)',
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
                scales: { y: { beginAtZero: true, ticks: { callback: (v) => `₹${Number(v).toLocaleString()}` } } },
              }}
            />
          )}
        </div>
      </div>
      {expenses.length === 0 ? (
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No expenses yet.</p>
      ) : (
        expenses.map((e) => (
          <div className="exp-item-boxy" key={e.supabaseId ?? `${e.date}-${e.name}`}>
            <div className="eib-left">
              <div className="eib-name">{e.name}</div>
              <div className="eib-meta">
                {e.category.toUpperCase()} · {e.date}
              </div>
            </div>
            <div className="eib-amt">-₹{e.amount.toLocaleString('en-IN')}</div>
          </div>
        ))
      )}
    </div>
  );
}