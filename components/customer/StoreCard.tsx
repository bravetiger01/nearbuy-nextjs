'use client';

import type { MouseEvent } from 'react';
import type { StoreResult } from '../../lib/types';
import { useApp } from '../../lib/store-context';
import { BoxIcon, ClockIcon, PinIcon } from '../../lib/icons';
import Image from 'next/image';

export default function StoreCard({ store }: { store: StoreResult }) {
  const { openProductModal, setRiderCtx, setReserveCtx, openModal } = useApp();
  const first = store.matchedProducts[0] ?? store.products[0];
  const unitTotal = store.matchedProducts.reduce((t, p) => t + p.stock, 0);
  const shown = store.matchedProducts.slice(0, 3);

  const stop = (e: MouseEvent<Element>) => e.stopPropagation();

  const doReserve = (e: MouseEvent<Element>) => {
    stop(e);
    setReserveCtx({ storeId: store.id, productName: first.name, price: first.price, storeName: store.name });
    openModal('reserve');
  };

  const doRider = (e: MouseEvent<Element>) => {
    stop(e);
    setRiderCtx({ storeId: store.id, productName: first.name, price: first.price, storeName: store.name });
    openModal('rider');
  };

  const doView = (e: MouseEvent<Element>) => {
    stop(e);
    openProductModal(store.id);
  };

  return (
    <div className="store-card-boxy" onClick={() => openProductModal(store.id)}>
      {/* Color accent bar */}
      <div className="sc-top-bar" style={{ background: store.color }} />

      <div className="sc-body">
        {/* Store header */}
        <div className="sc-head">
          <div>
            <div className="sc-name">{store.name}</div>
            <div className="sc-cat">{store.category}</div>
          </div>
          <div className="sc-badges">
            <span className={`sc-open ${store.openNow ? 'open' : 'closed'}`}>
              {store.openNow ? '● OPEN' : '● CLOSED'}
            </span>
            <span className="sc-rating">★ {store.rating}</span>
          </div>
        </div>

        {/* Info chips */}
        <div className="sc-chips">
          <div className="sc-chip dist">
            <PinIcon size={12} />
            {store.distText}
          </div>
          <div className="sc-chip">
            <ClockIcon size={12} />
            {store.hours}
          </div>
          <div className="sc-chip">
            <BoxIcon size={12} />
            {unitTotal} units
          </div>
        </div>

        {/* Products — with image + selling price badge */}
        <div className="sc-products">
          <div className="sc-prod-label">MATCHING PRODUCTS</div>
          {shown.map((p) => (
            <div className="sc-prod-item" key={p.name}>
              {/* Product image or category fallback */}
              {p.image ? (
                <div className="sc-prod-img-wrap">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={36}
                    height={36}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <div className="sc-prod-img-fallback">
                  {p.category?.slice(0, 3).toUpperCase() || 'PRD'}
                </div>
              )}

              {/* Name */}
              <span className="sc-prod-name">{p.name}</span>

              {/* Stock + Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <span className="sc-stock-badge">{p.stock} left</span>
                <span className="sc-price-badge">₹{p.price}</span>
              </div>
            </div>
          ))}
          {store.matchedProducts.length > 3 && (
            <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', fontWeight: 700, letterSpacing: '0.04em', marginTop: 6 }}>
              +{store.matchedProducts.length - 3} more products
            </div>
          )}
        </div>

        <div className="sc-updated">UPDATED {store.lastUpdated.toUpperCase()}</div>

        {/* Action buttons */}
        <div className="sc-actions">
          <button className="sc-act-btn" onClick={doView}>
            VIEW ALL
          </button>
          <button className="sc-act-btn reserve" onClick={doReserve}>
            RESERVE
          </button>
          <button className="sc-act-btn rider" onClick={doRider}>
            BOOK RIDER
          </button>
        </div>
      </div>
    </div>
  );
}