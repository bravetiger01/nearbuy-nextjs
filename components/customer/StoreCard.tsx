'use client';

import type { MouseEvent } from 'react';
import type { StoreResult } from '../../lib/types';
import { useApp } from '../../lib/store-context';
import Image from 'next/image';
import { CheckIcon } from '../../lib/icons';

export default function StoreCard({ store }: { store: StoreResult }) {
  const { openProductModal, setRiderCtx, setReserveCtx, openModal } = useApp();
  const first = store.matchedProducts[0] ?? store.products[0];
  const shown = store.matchedProducts.slice(0, 1); // Only show the top matched product for brutalist layout

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

  return (
    <div style={{ border: '4px solid #000', backgroundColor: '#fff' }}>
      
      {/* Product Area */}
      {shown.map((p) => (
        <div key={p.name} style={{ display: 'flex', borderBottom: '4px solid #000' }}>
          
          {/* Image */}
          <div style={{ width: '120px', borderRight: '4px solid #000', backgroundColor: '#e2e2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p.image ? (
              <Image src={p.image} alt={p.name} width={100} height={100} style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#666' }}>{p.category?.slice(0,3).toUpperCase() || 'IMG'}</div>
            )}
          </div>
          
          {/* Details */}
          <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#bfb5ff', border: '2px solid #000', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 900, marginBottom: '8px' }}>
                <CheckIcon size={10} /> AI VISION CONFIRMED
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 4px 0', lineHeight: 1.1 }}>{p.name}</h3>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555' }}>₹{p.price} // {p.stock} IN STOCK</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '12px' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 900 }}>STORE: {store.name.toUpperCase()}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#d92662' }}>{store.distText} // 7 MIN RIDE</div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div style={{ display: 'flex' }}>
        <button 
          onClick={doReserve}
          style={{ 
            flex: 1, 
            backgroundColor: '#ffef00', 
            border: 'none', 
            borderRight: '4px solid #000', 
            padding: '12px', 
            fontWeight: 900, 
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          [ LOCK & RESERVE → ]
        </button>
        <button 
          onClick={doRider}
          style={{ 
            flex: 1, 
            backgroundColor: '#fff', 
            border: 'none', 
            padding: '12px', 
            fontWeight: 900, 
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          [ DISPATCH RIDER → ]
        </button>
      </div>

    </div>
  );
}