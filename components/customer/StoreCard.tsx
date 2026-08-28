'use client';

import type { Product, StoreResult } from '../../lib/types';
import { useApp } from '../../lib/store-context';
import { ClockIcon, PinIcon, ReserveIcon, TruckIcon } from '../../lib/icons';

export default function StoreCard({ store, query }: { store: StoreResult; query: string }) {
  const { openProductModal, setRiderCtx, setReserveCtx, openModal } = useApp();
  const ql = query.toLowerCase();

  const highlight = (name: string) => {
    const idx = name.toLowerCase().indexOf(ql);
    if (idx === -1) return name;
    return (
      <>
        {name.slice(0, idx)}
        <mark className="hl">{name.slice(idx, idx + ql.length)}</mark>
        {name.slice(idx + ql.length)}
      </>
    );
  };

  const doReserve = (p: Product) => {
    setReserveCtx({ storeId: store.id, productName: p.name, price: p.price, storeName: store.name });
    openModal('reserve');
  };

  const doRider = (p: Product) => {
    setRiderCtx({ storeId: store.id, productName: p.name, price: p.price, storeName: store.name });
    openModal('rider');
  };

  return (
    <div className="store-card-boxy">
      <div className="store-card-top">
        <div className="store-monogram" style={{ background: store.color }}>
          {store.name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>
        <div className="store-card-info">
          <div className="store-name-row">
            <h3 className="store-name">{store.name}</h3>
            {store.openNow ? <span className="open-chip">OPEN</span> : <span className="closed-chip">CLOSED</span>}
          </div>
          <div className="store-meta">
            <span className="svchip">
              <ClockIcon size={12} /> {store.lastUpdated}
            </span>
            <span className="svchip">
              <PinIcon size={12} /> {store.distText}
            </span>
            <span className="svchip">★ {store.rating.toFixed(1)}</span>
          </div>
          <div className="store-cats">
            {store.products.slice(0, 4).map((p) => (
              <span className="cat-chip" key={p.name}>
                {p.category}
              </span>
            ))}
          </div>
        </div>
        <div className="store-time">
          <small>Hours</small>
          {store.hours}
        </div>
      </div>

      <div className="store-products">
        {store.matchedProducts.map((p) => {
          const low = p.stock < 10;
          return (
            <div className="sp-row" key={p.name}>
              <div className="sp-name">{highlight(p.name)}</div>
              <div className="sp-price">
                ₹{p.price.toLocaleString('en-IN')}
                <small>/unit</small>
              </div>
              <div className={`sp-stock ${low ? 'low' : ''}`}>{p.stock} left</div>
              <button className="btn-sm reserve-sm" onClick={() => doReserve(p)}>
                <ReserveIcon size={12} />
                RESERVE
              </button>
              <button className="btn-sm rider-sm" onClick={() => doRider(p)}>
                <TruckIcon size={12} />
                RIDER
              </button>
            </div>
          );
        })}
      </div>

      <div className="store-card-foot">
        <button className="btn-viewmore" onClick={() => openProductModal(store.id)}>
          VIEW FULL CATALOG →
        </button>
        <span className="store-phone">📞 {store.phone}</span>
      </div>
    </div>
  );
}