'use client';

import dynamic from 'next/dynamic';
import { useApp, type SortBy } from '../../lib/store-context';
import StoreCard from './StoreCard';
import StorePreview from './StorePreview';
import { BoltIcon, ListIcon, MapIcon, SearchIcon } from '../../lib/icons';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

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

  const searched = currentQuery !== '';
  const noResults = searched && currentResults.length === 0;

  return (
    <section className="results-section" id="resultsSection" ref={resultsRef}>
      <div className="section-wrap">
        {searched && (
          <div className="results-header-boxy">
            <div className="rh-left">
              <h2 className="rh-title">&quot;{currentQuery}&quot;</h2>
              <div className="rh-sub">
                {noResults
                  ? 'No stores found near SVIT Vasad'
                  : `${currentResults.length} store${currentResults.length > 1 ? 's' : ''} found · within 2 km of SVIT Vasad`}
              </div>
            </div>
            <div className="rh-right">
              <div className="view-toggle-boxy">
                <button
                  className={`vtb ${currentResultView === 'list' ? 'active' : ''}`}
                  onClick={() => setCurrentResultView('list')}
                >
                  <ListIcon size={14} />
                  LIST
                </button>
                <button
                  className={`vtb ${currentResultView === 'map' ? 'active' : ''}`}
                  onClick={() => setCurrentResultView('map')}
                >
                  <MapIcon size={14} />
                  MAP
                </button>
              </div>
              <select
                className="sort-boxy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
              >
                <option value="distance">NEAREST FIRST</option>
                <option value="stock">MOST STOCK</option>
                <option value="updated">RECENTLY UPDATED</option>
                <option value="rating">HIGHEST RATED</option>
              </select>
            </div>
          </div>
        )}

        {searched && aiRecs.length > 0 && (
          <div className="ai-rec-boxy">
            <div className="ai-rec-icon">
              <BoltIcon size={20} />
            </div>
            <div>
              <div className="ai-rec-label">AI RECOMMENDATION</div>
              <div className="ai-rec-text">
                People also search for these with &quot;{currentQuery}&quot;:
              </div>
            </div>
            <div className="ai-tags-row">
              {aiRecs.map((r) => (
                <button key={r} className="ai-tag-boxy" onClick={() => quickSearch(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {searched && !noResults && currentResultView === 'list' && (
          <div className="store-grid-boxy">
            {currentResults.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        )}

        {searched && !noResults && currentResultView === 'map' && <MapView stores={currentResults} />}

        {searched && noResults && (
          <div className="empty-boxy">
            <div className="empty-icon-box">
              <SearchIcon size={32} />
            </div>
            <h3>No results found</h3>
            <p>
              No registered stores have <strong>&quot;{currentQuery}&quot;</strong> in stock within 2 km.
            </p>
          </div>
        )}

        {!searched && <StorePreview />}
      </div>
    </section>
  );
}