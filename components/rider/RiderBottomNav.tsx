'use client';

export default function RiderBottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'jobs' | 'profile';
  setActiveTab: (tab: 'jobs' | 'profile') => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#fff',
        borderTop: '4px solid #000',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => setActiveTab('jobs')}
        style={{
          background: activeTab === 'jobs' ? '#ffea00' : '#fff',
          border: 'none',
          borderRight: '4px solid #000',
          color: '#000',
          fontWeight: 900,
          textTransform: 'uppercase',
          cursor: 'pointer',
          flex: 1,
          fontFamily: 'monospace',
          fontSize: '1rem',
        }}
      >
        Jobs
      </button>
      <button
        onClick={() => setActiveTab('profile')}
        style={{
          background: activeTab === 'profile' ? '#ffea00' : '#fff',
          border: 'none',
          color: '#000',
          fontWeight: 900,
          textTransform: 'uppercase',
          cursor: 'pointer',
          flex: 1,
          fontFamily: 'monospace',
          fontSize: '1rem',
        }}
      >
        Profile
      </button>
    </div>
  );
}
