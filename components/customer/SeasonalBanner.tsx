'use client';

import Image from 'next/image';
import { useApp } from '../../lib/store-context';

export default function SeasonalBanner() {
  const { handleSearchInput, doSearch } = useApp();

  const handleSearch = (query: string) => {
    handleSearchInput(query);
    doSearch();
    const resultsSec = document.getElementById('resultsSection');
    if (resultsSec) resultsSec.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '0 16px', margin: '32px auto', maxWidth: 1200, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Navratri / Ganesh Chaturthi Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          borderRadius: 'var(--r)',
          padding: '24px 32px',
          color: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <span style={{ 
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginBottom: '12px'
          }}>UPCOMING FESTIVALS</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
            Navratri & Ganesh Chaturthi 🪔
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', marginBottom: '20px' }}>
            Decorate your home! Get fresh flowers, puja items, and decor instantly.
          </p>
          <button 
            onClick={() => handleSearch('Decor')}
            style={{ 
              background: 'var(--white)', 
              color: '#D97706', 
              border: 'none',
              padding: '12px 24px',
              borderRadius: 'var(--r-sm)',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            SHOP DECOR & PUJA ITEMS
          </button>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '150px' }}>
           <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))' }}>🏵️</div>
        </div>
      </div>

      {/* Marriage Season Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, var(--lav-500) 0%, var(--lav-800) 100%)',
          borderRadius: 'var(--r)',
          padding: '24px 32px',
          color: 'var(--white)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <span style={{ 
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginBottom: '12px'
          }}>SEASONAL SPECIAL</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
            Marriage Season is Here! 🎉
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', marginBottom: '20px' }}>
            Find the best gifts, decor, and more from local Vasad shops.
          </p>
          <button 
            onClick={() => handleSearch('Gift Shop')}
            style={{ 
              background: 'var(--white)', 
              color: 'var(--lav-800)', 
              border: 'none',
              padding: '12px 24px',
              borderRadius: 'var(--r-sm)',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            BROWSE GIFT SHOPS
          </button>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '150px' }}>
           <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))' }}>🎁</div>
        </div>
      </div>

    </div>
  );
}
