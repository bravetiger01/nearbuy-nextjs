'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

export default function ReserveModal() {
  const { showToast, closeModal, reserveCtx, addReservation } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);

  const confirm = () => {
    if (!name.trim() || !phone.trim()) {
      showToast('Enter your name and phone', 'error');
      return;
    }
    if (!reserveCtx) return;
    closeModal('reserve');
    showToast(`RESERVED — ${reserveCtx.storeName} has been notified`, 'success');
    addReservation({
      id: `R${Date.now()}`,
      customer: name.trim(),
      product: reserveCtx.productName,
      qty,
      time: 'Now',
      status: 'pending',
    });
  };

  return (
    <Modal
      name="reserve"
      title="RESERVE PRODUCT"
      footer={
        <>
          <button className="btn-modal-outline" onClick={() => closeModal('reserve')}>
            CANCEL
          </button>
          <button className="btn-modal-solid" onClick={confirm}>
            CONFIRM RESERVE
          </button>
        </>
      }
    >
      <div className="reserve-disp">
        <strong>{reserveCtx?.productName ?? '—'}</strong>
        <br />
        <span style={{ fontSize: '0.78rem', letterSpacing: '0.04em' }}>
          {reserveCtx?.storeName ?? ''} · ₹{reserveCtx?.price.toLocaleString('en-IN') ?? 0}
        </span>
      </div>
      <div className="form-g">
        <label>YOUR NAME</label>
        <input type="text" className="f-inp" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-g">
        <label>PHONE</label>
        <input type="tel" className="f-inp" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="form-grid-2">
        <div className="form-g">
          <label>QUANTITY</label>
          <input type="number" className="f-inp" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} />
        </div>
        <div className="form-g">
          <label>PICK-UP BY</label>
          <input type="time" className="f-inp" />
        </div>
      </div>
      <div className="modal-note">
        Shopkeeper notified instantly. Hold valid for <strong>2 hours</strong>.
      </div>
    </Modal>
  );
}