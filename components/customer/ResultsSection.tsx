'use client';

import dynamic from 'next/dynamic';
import { useApp } from '../../lib/store-context';
import StoreCard from './StoreCard';
import StorePreview from './StorePreview';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

const SORT_OPTIONS = [
  { value: 'distance', label: 'Nearest' },
  { value: 'stock', label: 'Most Stock' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'updated', label: 'Recently Updated' },
] as const;

export default function ResultsSection() {
  const {
    currentQuery,
    currentResults,
    currentResultView,
    setCurrentResultView,
    sortBy,
    setSortBy,
    aiRecs,
    quickSearch,
    resultsRef,
  } = useApp();

  const hasResults = currentQuery !== '' && currentResults.length > 0;
  const noResults = currentQuery !== '' && currentResults.length === 0;

  return (
    <section className="results-section" id="resultsSection" ref={resultsRef}>
      <div className="section-wrap">
        {hasResults && (
          <>
            <div className="results-topbar">
              <div className="res-line">
                <div className="res-title-wrap">
                  <h2 className="res-title">{currentQuery}</h2>
                  <span className="res-count">({currentResults.length} stores)</span>
                </div>
                <div className="res-actions">
                  <div className="view-toggle">
                    <button
                      className={`view-btn ${currentResultView === 'list' ? 'active' : ''}`}
                      onClick={() => setCurrentResultView('list')}
                    >
                      ☰ LIST
                    </button>
                    <button
                      className={`view-btn ${currentResultView === 'map' ? 'active' : ''}`}
                      onClick={() => setCurrentResultView('map')}
                    >
                      🗺 MAP
                    </button>
                  </div>
                  <div className="sort-box">
                    <select
                      className="lang-select sort-select"
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value as (typeof SORT_OPTIONS)[number]['value']);
                      }}
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {aiRecs.length > 0 && (
                <div className="ai-recs-boxy">
                  <div className="ai-recs-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                    AI SUGGESTS
                  </div>
                  <span className="ai-recs-label">People also look for:</span>
                  <div className="ai-tag-list">
                    {aiRecs.map((r) => (
                      <button key={r} className="ai-tag" onClick={() => quickSearch(r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {currentResultView === 'list' ? (
              <div className="results-list">
                {currentResults.map((s) => (
                  <StoreCard key={s.id} store={s} query={currentQuery} />
                ))}
              </div>
            ) : (
              <MapView stores={currentResults} />
            )}
          </>
        )}

        {noResults && (
          <div className="no-res-boxy">
            <div className="no-res-ico">🔍</div>
            <h3>No stores found for “{currentQuery}”</h3>
            <p>Try a different keyword, or check one of these popular searches:</p>
            <div className="ai-tag-list">
              {['Notebook', 'Calculator', 'A4 Paper'].map((t) => (
                <button key={t} className="ai-tag" onClick={() => quickSearch(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentQuery === '' && <StorePreview />}
      </div>
    </section>
  );
}