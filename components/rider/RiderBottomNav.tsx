'use client';

export default function RiderBottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'jobs' | 'map' | 'profile';
  setActiveTab: (tab: 'jobs' | 'map' | 'profile') => void;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'var(--white)',
        borderTop: 'var(--brd)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <button
        onClick={() => setActiveTab('jobs')}
        style={{
          background: 'none',
          border: 'none',
          color: activeTab === 'jobs' ? 'var(--lav-700)' : 'var(--gray-500)',
          fontWeight: activeTab === 'jobs' ? 700 : 500,
          cursor: 'pointer',
          flex: 1,
          height: '100%',
        }}
      >
        Jobs
      </button>
      <button
        onClick={() => setActiveTab('map')}
        style={{
          background: 'none',
          border: 'none',
          color: activeTab === 'map' ? 'var(--lav-700)' : 'var(--gray-500)',
          fontWeight: activeTab === 'map' ? 700 : 500,
          cursor: 'pointer',
          flex: 1,
          height: '100%',
        }}
      >
        Map
      </button>
      <button
        onClick={() => setActiveTab('profile')}
        style={{
          background: 'none',
          border: 'none',
          color: activeTab === 'profile' ? 'var(--lav-700)' : 'var(--gray-500)',
          fontWeight: activeTab === 'profile' ? 700 : 500,
          cursor: 'pointer',
          flex: 1,
          height: '100%',
        }}
      >
        Profile
      </button>
    </div>
  );
}
