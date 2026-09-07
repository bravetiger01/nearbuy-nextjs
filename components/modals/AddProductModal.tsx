'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

const CATS = ['Notebooks', 'Pens', 'Math', 'Electronics', 'Paper', 'Office'];

export default function AddProductModal() {
  const { showToast, closeModal, saveProduct, editProduct, setEditProduct } = useApp();
  const ep = editProduct;
  const [name, setName] = useState(ep?.name ?? '');
  const [stock, setStock] = useState(ep ? String(ep.stock) : '0');
  const [price, setPrice] = useState(ep ? String(ep.price) : '0');
  const [costPrice, setCostPrice] = useState(ep?.costPrice ? String(ep.costPrice) : '0');
  const [cat, setCat] = useState(ep?.category ?? 'Notebooks');
  const [sku, setSku] = useState(ep?.sku ?? '');
  const [minThreshold, setMinThreshold] = useState(ep?.minThreshold ? String(ep.minThreshold) : '10');
  const [supplier, setSupplier] = useState(ep?.supplier ?? '');
  const [description, setDescription] = useState(ep?.description ?? '');
  const [listed, setListed] = useState(ep?.listed !== false ? 'yes' : 'no');

  const save = () => {
    const n = name.trim();
    const s = parseInt(stock) || 0;
    const p = parseInt(price) || 0;
    if (!n) { showToast('Enter product name', 'error'); return; }
    saveProduct({
      id: ep?.id,
      supabaseId: ep?.supabaseId,
      name: n,
      stock: s,
      price: p,
      costPrice: parseInt(costPrice) || 0,
      category: cat,
      sku: sku.trim() || `SKU-${Date.now()}`,
      minThreshold: parseInt(minThreshold) || 10,
      supplier: supplier.trim(),
      description: description.trim(),
      listed: listed === 'yes',
    });
    setEditProduct(null);
    closeModal('addProduct');
    showToast(ep ? 'PRODUCT UPDATED' : 'PRODUCT ADDED TO INVENTORY', 'success');
  };

  return (
    <Modal
      name="addProduct"
      title={ep ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
      footer={
        <>
          <button className="btn-modal-outline" onClick={() => closeModal('addProduct')}>CANCEL</button>
          <button className="btn-modal-solid" onClick={save}>{ep ? 'SAVE CHANGES' : 'ADD PRODUCT'}</button>
        </>
      }
    >
      <div className="form-g">
        <label>PRODUCT NAME *</label>
        <input type="text" className="f-inp" placeholder="e.g. Classmate Notebook A4" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      <div className="form-grid-2">
        <div className="form-g">
          <label>CATEGORY *</label>
          <select className="f-inp" value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-g">
          <label>SKU</label>
          <input type="text" className="f-inp" placeholder="e.g. STN-NB-001" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
      </div>
      <div className="form-grid-2">
        <div className="form-g">
          <label>SELLING PRICE (₹) *</label>
          <input type="number" className="f-inp" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="form-g">
          <label>COST PRICE (₹)</label>
          <input type="number" className="f-inp" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
        </div>
      </div>
      <div className="form-grid-2">
        <div className="form-g">
          <label>CURRENT STOCK</label>
          <input type="number" className="f-inp" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <div className="form-g">
          <label>MIN THRESHOLD</label>
          <input type="number" className="f-inp" placeholder="10" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} />
        </div>
      </div>
      <div className="form-g">
        <label>SUPPLIER</label>
        <input type="text" className="f-inp" placeholder="e.g. Classmate Corp" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
      </div>
      <div className="form-g">
        <label>DESCRIPTION</label>
        <input type="text" className="f-inp" placeholder="Short product description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-g">
        <label>LIST ON PLATFORM</label>
        <select className="f-inp" value={listed} onChange={(e) => setListed(e.target.value)}>
          <option value="yes">YES — Visible to customers</option>
          <option value="no">NO — Hidden from platform</option>
        </select>
      </div>
    </Modal>
  );
}