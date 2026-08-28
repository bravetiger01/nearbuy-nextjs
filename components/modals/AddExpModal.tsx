'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

const CATS = ['Electricity', 'Rent', 'Staff Salary', 'Transport', 'Stock Purchase', 'Miscellaneous'];

export default function AddExpModal() {
  const { showToast, closeModal, addExpense } = useApp();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('Electricity');
  const [amount, setAmount] = useState('');

  const save = () => {
    const amt = parseInt(amount) || 0;
    if (!desc.trim() || !amt) {
      showToast('FILL IN ALL FIELDS', 'error');
      return;
    }
    addExpense({ date, name: desc.trim(), category: cat, amount: amt });
    closeModal('addExp');
    showToast('EXPENSE RECORDED', 'success');
  };

  return (
    <Modal
      name="addExp"
      title="ADD EXPENSE"
      footer={
        <>
          <button className="btn-modal-outline" onClick={() => closeModal('addExp')}>
            CANCEL
          </button>
          <button className="btn-modal-solid" onClick={save}>
            SAVE
          </button>
        </>
      }
    >
      <div className="form-g">
        <label>DATE</label>
        <input type="date" className="f-inp" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="form-g">
        <label>EXPENSE NAME</label>
        <input type="text" className="f-inp" placeholder="e.g. Electricity Bill" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <div className="form-g">
        <label>CATEGORY</label>
        <select className="f-inp" value={cat} onChange={(e) => setCat(e.target.value)}>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-g">
        <label>AMOUNT (₹)</label>
        <input type="number" className="f-inp" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
    </Modal>
  );
}