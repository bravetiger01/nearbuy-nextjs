'use client';

import { useMemo, useState } from 'react';
import { useApp } from '../../lib/store-context';
import { Bar } from '../../lib/charts';

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function Expenses() {
  const { expenses, openModal, deleteExpense } = useApp();
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - 6);

  // Derive available months from expenses
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    expenses.forEach(e => months.add(e.date.substring(0, 7)));
    return Array.from(months).sort().reverse();
  }, [expenses]);

  const { thisMonthTotal, thisWeekTotal, todayTotal, chart, filteredExpenses } = useMemo(() => {
    let month = 0, week = 0, today = 0;
    const byCat: Record<string, number> = {};
    
    const filtered = filterMonth === 'all' 
      ? expenses 
      : expenses.filter(e => e.date.startsWith(filterMonth));

    filtered.forEach((e) => {
      if (e.date.startsWith(thisMonth)) month += e.amount;
      if (new Date(e.date) >= thisWeekStart) week += e.amount;
      if (e.date === dayKey(now)) today += e.amount;
      byCat[e.category] = (byCat[e.category] ?? 0) + e.amount;
    });

    const knownCats = ['Rent', 'Electricity', 'Stock Purchase', 'Staff Salary', 'Transport', 'Miscellaneous', 'Packaging', 'Internet'];
    const cats = knownCats.filter((c) => byCat[c]);
    Object.keys(byCat).forEach((c) => { if (!cats.includes(c)) cats.push(c); });

    return {
      thisMonthTotal: month,
      thisWeekTotal: week,
      todayTotal: today,
      chart: { cats, values: cats.map((c) => byCat[c]) },
      filteredExpenses: filtered
    };
  }, [expenses, thisMonth, now, filterMonth, thisWeekStart]);

  return (
    <div className="o-section active">
      <div className="o-header-row">
        <h2 className="o-title">Expenses</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{ padding: '8px', border: 'var(--brd)', borderRadius: 'var(--r-sm)' }}
          >
            <option value="all">All Time</option>
            {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button className="btn-owner-solid" onClick={() => openModal('addExp')}>
            + ADD EXPENSE
          </button>
        </div>
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
              No expenses recorded.
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
      {filteredExpenses.length === 0 ? (
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No expenses found.</p>
      ) : (
        filteredExpenses.map((e) => (
          <div className="exp-item-boxy" key={e.supabaseId ?? `${e.date}-${e.name}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="eib-left" style={{ flex: 1 }}>
              <div className="eib-name">{e.name}</div>
              <div className="eib-meta">
                {e.category.toUpperCase()} · {e.date}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="eib-amt">-₹{e.amount.toLocaleString('en-IN')}</div>
              <button 
                onClick={() => deleteExpense(e.supabaseId ?? e.name + e.date)}
                style={{ background: 'transparent', color: 'var(--gray-500)', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '4px 8px' }}
                title="Delete"
              >
                ×
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}