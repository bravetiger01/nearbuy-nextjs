'use client';

import dynamic from 'next/dynamic';
import { useApp } from '../../lib/store-context';
import StoreCard from './StoreCard';
import StorePreview from './StorePreview';
import { SearchIcon, BoltIcon } from '../../lib/icons';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export default function ResultsSection() {
  const { currentQuery, currentResults, currentResultView, setCurrentResultView, aiRecs, quickSearch } = useApp();
  const searched = currentQuery !== '';
  const noResults = searched && currentResults.length === 0;

  return (
    <section style={{ padding: '0 20px', marginBottom: '32px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: 12, height: 12, backgroundColor: '#000' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase', margin: 0 }}>VERIFIED LOCAL STASH</h2>
        <div style={{ flex: 1, height: '4px', backgroundColor: '#000', marginLeft: '8px' }} />
      </div>

      {searched && aiRecs.length > 0 && (
        <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: '12px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <BoltIcon size={16} />
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, marginBottom: '8px' }}>AI RECOMMENDATION: People also bought...</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {aiRecs.map((r) => (
                <button key={r} onClick={() => quickSearch(r)} style={{ padding: '4px 8px', backgroundColor: '#bfb5ff', border: '2px solid #000', fontWeight: 800, fontSize: '0.65rem', cursor: 'pointer' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {searched && !noResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {currentResults.map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      )}

      {searched && noResults && (
        <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: '32px', textAlign: 'center' }}>
          <SearchIcon size={32} />
          <h3 style={{ fontWeight: 900, fontSize: '1.2rem', marginTop: '16px', textTransform: 'uppercase' }}>NO MATCHES IN MATRIX</h3>
          <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>No registered merchants have &quot;{currentQuery}&quot; in live stock within 2 km.</p>
        </div>
      )}

      {!searched && <StorePreview />}

    </section>
  );
}