'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

const CATS = ['Notebooks', 'Pens', 'Math', 'Electronics', 'Paper', 'Office'];

export default function AddProductModal() {
  const { showToast, closeModal, saveProduct, editProduct, setEditProduct } = useApp();
  const [name, setName] = useState(editProduct?.name ?? '');
  const [stock, setStock] = useState(editProduct ? String(editProduct.stock) : '0');
  const [price, setPrice] = useState(editProduct ? String(editProduct.price) : '0');
  const [cat, setCat] = useState(editProduct?.category ?? 'Notebooks');
  const [listed, setListed] = useState(editProduct?.listed ? 'yes' : 'no');

  const save = () => {
    const n = name.trim();
    const s = parseInt(stock) || 0;
    const p = parseInt(price) || 0;
    if (!n) {
      showToast('Enter product name', 'error');
      return;
    }
    saveProduct({ id: editProduct?.id, name: n, stock: s, price: p, category: cat, listed: listed === 'yes' });
    setEditProduct(null);
    closeModal('addProduct');
    showToast(editProduct ? 'PRODUCT UPDATED' : 'PRODUCT ADDED TO INVENTORY', 'success');
  };

  return (
    <Modal
      name="addProduct"
      title={editProduct ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
      footer={
        <>
          <button className="btn-modal-outline" onClick={() => closeModal('addProduct')}>
            CANCEL
          </button>
          <button className="btn-modal-solid" onClick={save}>
            {editProduct ? 'SAVE CHANGES' : 'ADD PRODUCT'}
          </button>
        </>
      }
    >
      <div className="form-g">
        <label>PRODUCT NAME</label>
        <input type="text" className="f-inp" id="newProdName" placeholder="e.g. Classmate Notebook A4" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-g">
        <label>CATEGORY</label>
        <select className="f-inp" id="newProdCat" value={cat} onChange={(e) => setCat(e.target.value)}>
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-grid-2">
        <div className="form-g">
          <label>STOCK</label>
          <input type="number" className="f-inp" id="newProdStock" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <div className="form-g">
          <label>PRICE (₹)</label>
          <input type="number" className="f-inp" id="newProdPrice" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      <div className="form-g">
        <label>LIST ON PLATFORM</label>
        <select className="f-inp" id="newProdListed" value={listed} onChange={(e) => setListed(e.target.value)}>
          <option value="yes">YES</option>
          <option value="no">NO</option>
        </select>
      </div>
    </Modal>
  );
}