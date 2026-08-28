'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

export default function AddTxnModal() {
  const { showToast, closeModal, addTransaction } = useApp();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('');

  const save = () => {
    const amt = parseInt(amount) || 0;
    if (!desc.trim() || !amt) {
      showToast('FILL IN ALL FIELDS', 'error');
      return;
    }
    addTransaction({ date, desc: desc.trim(), type, amount: amt });
    closeModal('addTxn');
    showToast('TRANSACTION SAVED', 'success');
  };

  return (
    <Modal
      name="addTxn"
      title="ADD TRANSACTION"
      footer={
        <>
          <button className="btn-modal-outline" onClick={() => closeModal('addTxn')}>
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
        <label>DESCRIPTION</label>
        <input type="text" className="f-inp" placeholder="e.g. Sales — Stationery" value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>
      <div className="form-g">
        <label>TYPE</label>
        <select className="f-inp" value={type} onChange={(e) => setType(e.target.value as 'credit' | 'debit')}>
          <option value="credit">CREDIT (Money in)</option>
          <option value="debit">DEBIT (Money out)</option>
        </select>
      </div>
      <div className="form-g">
        <label>AMOUNT (₹)</label>
        <input type="number" className="f-inp" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
    </Modal>
  );
}