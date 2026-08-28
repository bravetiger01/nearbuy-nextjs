'use client';

import { useApp } from '../../lib/store-context';
import { Bar } from '../../lib/charts';

export default function Expenses() {
  const { expenses, openModal } = useApp();

  const thisMonth = expenses.filter((e) => e.date.startsWith('2026-08')).reduce((s, e) => s + e.amount, 0);
  const byCat = (name: string) => expenses.filter((e) => e.category === name).reduce((s, e) => s + e.amount, 0);

  const cats = ['Rent', 'Electricity', 'Stock Purchase', 'Staff Salary', 'Transport', 'Miscellaneous'];
  const values = cats.map(byCat);

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
          <div className="ekv">{`₹${thisMonth.toLocaleString('en-IN')}`}</div>
          <div className="ekl">THIS MONTH</div>
        </div>
        <div className="exp-kpi-boxy">
          <div className="ekv">₹8,200</div>
          <div className="ekl">THIS WEEK</div>
        </div>
        <div className="exp-kpi-boxy">
          <div className="ekv">₹1,840</div>
          <div className="ekl">TODAY</div>
        </div>
      </div>
      <div className="chart-card-boxy" style={{ marginBottom: 24 }}>
        <div className="ccard-top">
          <h3>Expenses by Category</h3>
        </div>
        <div style={{ height: 260 }}>
          <Bar
            data={{
              labels: cats,
              datasets: [
                {
                  label: 'Amount (₹)',
                  data: values,
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
        </div>
      </div>
      {expenses.map((e) => (
        <div className="exp-item-boxy" key={`${e.date}-${e.name}`}>
          <div className="eib-left">
            <div className="eib-name">{e.name}</div>
            <div className="eib-meta">
              {e.category.toUpperCase()} · {e.date}
            </div>
          </div>
          <div className="eib-amt">-₹{e.amount.toLocaleString('en-IN')}</div>
        </div>
      ))}
    </div>
  );
}