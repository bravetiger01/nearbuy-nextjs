'use client';

import { useApp } from '../../lib/store-context';

export default function RiderHeader({
  isOnline,
  setIsOnline,
}: {
  isOnline: boolean;
  setIsOnline: (v: boolean) => void;
}) {
  const { riderLogout } = useApp();

  return (
    <div
      style={{
        padding: '15px 20px',
        backgroundColor: 'var(--black)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: 'var(--brd)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Rider Mode</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
          <span style={{ color: isOnline ? '#10B981' : '#9CA3AF' }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <div
            onClick={() => setIsOnline(!isOnline)}
            style={{
              width: 40,
              height: 20,
              borderRadius: 10,
              backgroundColor: isOnline ? '#10B981' : '#4B5563',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#fff',
                position: 'absolute',
                top: 2,
                left: isOnline ? 22 : 2,
                transition: 'left 0.2s',
              }}
            />
          </div>
        </label>
        
        <button
          onClick={riderLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#EF4444',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 'bold',
          }}
        >
          EXIT
        </button>
      </div>
    </div>
  );
}
