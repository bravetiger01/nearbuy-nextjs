'use client';

import { LockIcon, TruckIcon, StoreIcon } from '../../lib/icons';

export default function ProtocolSection() {
  return (
    <section style={{ padding: '0 20px', marginBottom: '20px' }}>
      <div style={{ border: '4px solid #000', backgroundColor: '#f5f0e6', padding: '16px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 14, border: '2px solid #000', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: 4, height: 4, backgroundColor: '#000', borderRadius: '50%' }} />
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>THE NEARBUY HYPERLOCAL PROTOCOL</span>
        </div>

        {/* Box 1 */}
        <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ color: '#d92662', marginTop: 2 }}>
              <LockIcon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '4px' }}>10% Instant Escrow Hold</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444', lineHeight: 1.4 }}>
                Merchant locks product behind register immediately. Zero stockout guarantee or full 100% credit = $10 penalty bonus.
              </div>
            </div>
          </div>
        </div>

        {/* Box 2 */}
        <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ color: '#9b8fe3', marginTop: 2 }}>
              <TruckIcon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '4px' }}>15-Min Hyperlocal Courier Ring</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444', lineHeight: 1.4 }}>
                Dedicated cargo bike couriers stationed within 500m of every commercial zone for sub-15 minute doorstep arrivals.
              </div>
            </div>
          </div>
        </div>

        {/* Box 3 */}
        <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ color: '#000', marginTop: 2 }}>
              <StoreIcon size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '4px' }}>POS & Vision Live Ingestion</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#444', lineHeight: 1.4 }}>
                We sync directly to local checkout terminals and overhead inventory vision nodes to guarantee stock before you walk or buy.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
