'use client';

import Modal from '../Modal';
import { useApp } from '../../lib/store-context';
import { STORES } from '../../lib/data';
import { ReserveIcon, TruckIcon } from '../../lib/icons';

export default function ProductModal() {
  const { productStoreId, closeModal, setReserveCtx, setRiderCtx, openModal, showToast } = useApp();
  const store = STORES.find((s) => s.id === productStoreId);

  return (
    <Modal name="product" title="STORE PRODUCTS" width="wide">
      {store ? (
        <>
          <div className="pm-store-hdr">
            <div className="pm-store-color-bar" style={{ background: store.color }} />
            <div>
              <div className="pm-store-nm">{store.name}</div>
              <div className="pm-store-meta">
                {store.distText} away · ★ {store.rating} · {store.openNow ? <span style={{ color: 'var(--lav-600)' }}>OPEN</span> : <span style={{ color: 'var(--gray-400)' }}>CLOSED</span>}
              </div>
              <div className="pm-store-meta">UPDATED {store.lastUpdated.toUpperCase()}</div>
            </div>
          </div>
          <div className="pm-prod-list">
            {store.products.map((p) => (
              <div className="pm-prod-item" key={p.name}>
                <div className="pm-prod-nm">{p.name}</div>
                <div className="pm-prod-pr">₹{p.price.toLocaleString('en-IN')}</div>
                <div className="pm-prod-stk">{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</div>
                <div className="pm-acts-row">
                  <button
                    className="pm-btn rsv"
                    onClick={() => {
                      closeModal('product');
                      setReserveCtx({ storeId: store.id, productName: p.name, price: p.price, storeName: store.name });
                      openModal('reserve');
                    }}
                  >
                    <ReserveIcon size={12} />
                    RSV
                  </button>
                  <button
                    className="pm-btn"
                    onClick={() => {
                      closeModal('product');
                      setRiderCtx({ storeId: store.id, productName: p.name, price: p.price, storeName: store.name });
                      openModal('rider');
                    }}
                  >
                    <TruckIcon size={12} />
                    RIDER
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: 'var(--brd)' }}>
            <a
              className="btn-modal-solid"
              style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
              href={`https://www.google.com/maps/dir/22.4671,72.8847/${store.lat},${store.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              GET DIRECTIONS
            </a>
            <button className="btn-modal-outline" onClick={() => showToast(`Calling ${store.phone}…`, 'info')}>
              CALL STORE
            </button>
          </div>
        </>
      ) : (
        <p style={{ padding: 20 }}>Select a store to view its catalog.</p>
      )}
    </Modal>
  );
}