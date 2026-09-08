'use client';

import { useApp } from '../../lib/store-context';
import { MicIcon, CameraIcon, SearchIcon, PinIcon } from '../../lib/icons';

const RADAR_FILTERS = ['ELECTRONICS', '24/7 PHARMACY', 'GROCERY', 'FASHION'];

export default function HeroSection() {
  const { searchTerm, handleSearchInput, doSearch, quickSearch, suggestions, openModal } = useApp();

  return (
    <section style={{ backgroundColor: '#f5f0e6', paddingBottom: '32px' }}>
      
      {/* Ticker Bar */}
      <div style={{ backgroundColor: '#ffef00', borderBottom: '4px solid #000', padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'ticker 15s linear infinite', fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
          HYPERLOCAL RADAR V4.2 // 4,821 VERIFIED MERCHANTS ONLINE // ESCROW LOCK ACTIVE // COURIER PING: 18ms
        </div>
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        
        {/* Headline */}
        <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '16px' }}>
          FIND IT.<br/>
          CHECK IT.<br/>
          GET IT.<br/>
          <span style={{ backgroundColor: '#9b8fe3', display: 'inline-block', padding: '0 8px', border: '4px solid #000', marginTop: '4px' }}>NEARBY.</span>
        </h1>
        
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#333', lineHeight: 1.4, marginBottom: '24px' }}>
          Live in-store shelf verification across your city. Delivered in 15 minutes or locked down with 10% instant reservation escrow.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <div style={{ flex: 1, backgroundColor: '#fff', border: '4px solid #000', padding: '12px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>4,821</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#555' }}>LIVE MERCHANTS</div>
          </div>
          <div style={{ flex: 1, backgroundColor: '#fff', border: '4px solid #000', padding: '12px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>142</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#555' }}>RIDERS ON DUTY</div>
          </div>
        </div>

        {/* Command Console (Search) */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em' }}>COMMAND CONSOLE // V3.0</div>
            <div style={{ flex: 1, height: '4px', backgroundColor: '#000' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            <button style={{ flex: 1, padding: '8px', backgroundColor: '#000', color: '#fff', fontWeight: 900, fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}>KEYWORD</button>
            <button onClick={() => openModal('snap')} style={{ flex: 1, padding: '8px', backgroundColor: '#fff', color: '#000', border: '2px solid #000', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer' }}>CAMERA VISION</button>
            <button onClick={() => openModal('voice')} style={{ flex: 1, padding: '8px', backgroundColor: '#fff', color: '#000', border: '2px solid #000', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer' }}>MIC SPEECH</button>
          </div>

          <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: '4px', boxShadow: '4px 4px 0px #000' }}>
            <div style={{ display: 'flex' }}>
              <input 
                type="text" 
                placeholder="INPUT PARAMETERS..."
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSearch();
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  backgroundColor: 'transparent'
                }}
              />
              <button 
                onClick={() => doSearch()}
                style={{
                  backgroundColor: '#d92662',
                  color: '#fff',
                  border: '4px solid #000',
                  padding: '0 20px',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  margin: '4px'
                }}
              >
                [ EXECUTE ]
              </button>
            </div>
            {suggestions.length > 0 && (
              <div style={{ borderTop: '4px solid #000', backgroundColor: '#fff' }}>
                {suggestions.map((n) => (
                  <div 
                    key={n} 
                    onClick={() => quickSearch(n)}
                    style={{ padding: '12px', fontWeight: 800, borderBottom: '2px solid #000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <SearchIcon size={14} />
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rapid Filters */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, marginBottom: '8px' }}>RAPID RADAR FILTERS:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {RADAR_FILTERS.map((filter) => (
              <button 
                key={filter}
                onClick={() => quickSearch(filter)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#fff',
                  border: '2px solid #000',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  borderRadius: '20px'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}