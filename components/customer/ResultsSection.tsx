'use client';

import dynamic from 'next/dynamic';
import { useApp, type SortBy } from '../../lib/store-context';
import { LANG_KEYWORDS } from '../../lib/data';
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
    activeTranslation,
    isSpeaking,
    speakCurrentResult,
    stopVoice,
  } = useApp();

  const searched = currentQuery !== '';
  const noResults = searched && currentResults.length === 0;

  return (
    <section className="results-section" id="resultsSection" ref={resultsRef}>
      <div className="section-wrap">
        {searched && (
          <>
            {/* Translation Recognition Banner */}
            {activeTranslation && (
              <div className="translation-result-banner">
                <div className="trb-left">
                  <span className="trb-icon">🌐</span>
                  <div>
                    <div className="trb-tag-row">
                      <span className="trb-badge">{activeTranslation.languageName.toUpperCase()} DETECTED</span>
                      <span className="trb-subtext">Local Term Translation</span>
                    </div>
                    <div className="trb-main">
                      <span className="trb-word">&ldquo;{activeTranslation.matchedWord}&rdquo;</span>
                      {activeTranslation.phoneticLabel &&
                        activeTranslation.phoneticLabel.toLowerCase() !==
                          activeTranslation.matchedWord.toLowerCase() && (
                          <span className="trb-phonetic">({activeTranslation.phoneticLabel})</span>
                        )}{' '}
                      <span className="trb-equals">means</span>{' '}
                      <span className="trb-resolved">&ldquo;{activeTranslation.resolvedTerm}&rdquo;</span>
                    </div>
                  </div>
                </div>
                <div className="trb-right">
                  <span className="trb-showing">
                    Showing {currentResults.length} store{currentResults.length !== 1 ? 's' : ''} with live stock for{' '}
                    <strong>{activeTranslation.resolvedTerm}</strong>
                  </span>
                  <button
                    type="button"
                    className={`say-result-btn ${isSpeaking ? 'speaking' : ''}`}
                    onClick={() => (isSpeaking ? stopVoice() : speakCurrentResult())}
                    title="Speak result aloud in local language"
                  >
                    {isSpeaking ? (
                      <>
                        <span className="speaking-wave">
                          <span className="sw-bar" />
                          <span className="sw-bar" />
                          <span className="sw-bar" />
                        </span>
                        <span>STOP AUDIO</span>
                      </>
                    ) : (
                      <>
                        <span className="srb-icon">🔊</span>
                        <span>SAY RESULT</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="results-header-boxy">
              <div className="rh-left">
                <h2 className="rh-title">&quot;{currentQuery}&quot;</h2>
                <div className="rh-sub">
                  {!activeTranslation && LANG_KEYWORDS[currentQuery.toLowerCase()] && (
                    <span className="text-emerald-600 font-medium mr-2">
                      🌐 Showing results for &apos;{LANG_KEYWORDS[currentQuery.toLowerCase()]}&apos;.
                    </span>
                  )}
                  {noResults
                    ? 'No stores found near SVIT Vasad'
                    : `${currentResults.length} store${currentResults.length > 1 ? 's' : ''} found · within 2 km of SVIT Vasad`}
                </div>
              </div>
              <div className="rh-right">
                {/* Audio readout button if no translation banner shown */}
                {!activeTranslation && (
                  <button
                    type="button"
                    className={`say-result-btn ${isSpeaking ? 'speaking' : ''}`}
                    onClick={() => (isSpeaking ? stopVoice() : speakCurrentResult())}
                    title="Speak result aloud"
                  >
                    {isSpeaking ? (
                      <>
                        <span className="speaking-wave">
                          <span className="sw-bar" />
                          <span className="sw-bar" />
                          <span className="sw-bar" />
                        </span>
                        <span>STOP</span>
                      </>
                    ) : (
                      <>
                        <span className="srb-icon">🔊</span>
                        <span>SAY RESULT</span>
                      </>
                    )}
                  </button>
                )}

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
          </>
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