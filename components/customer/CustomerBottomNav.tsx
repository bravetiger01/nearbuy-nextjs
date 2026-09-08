'use client';

import { useApp } from '../../lib/store-context';
import { SearchIcon, BoxIcon, PinIcon, UserIcon } from '../../lib/icons';

export default function CustomerBottomNav() {
  const { openModal } = useApp();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#fff',
      borderTop: '4px solid #000',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#000', backgroundColor: '#bfb5ff', border: '2px solid #000', padding: '6px 12px' }}>
        <SearchIcon size={20} />
        <span style={{ fontSize: '0.6rem', fontWeight: 900, marginTop: '2px' }}>DISCOVER</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', padding: '6px 12px' }}>
        <BoxIcon size={20} />
        <span style={{ fontSize: '0.6rem', fontWeight: 900, marginTop: '2px' }}>ORDERS</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', padding: '6px 12px' }}>
        <PinIcon size={20} />
        <span style={{ fontSize: '0.6rem', fontWeight: 900, marginTop: '2px' }}>RADAR</span>
      </div>

      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666', padding: '6px 12px', cursor: 'pointer' }}
        onClick={() => openModal('login')}
      >
        <UserIcon size={20} />
        <span style={{ fontSize: '0.6rem', fontWeight: 900, marginTop: '2px' }}>PROFILE</span>
      </div>
    </div>
  );
}
