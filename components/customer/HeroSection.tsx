'use client';

import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { GlobeIcon, MicIcon, CameraIcon, SearchIcon, PinIcon } from '../../lib/icons';

const QUICK_TAGS = ['Notebook', 'Pen', 'Calculator', 'A4 Paper', 'Geometry Box'];

export default function HeroSection() {
  const { searchTerm, handleSearchInput, doSearch, quickSearch, suggestions, openModal, lang, setLang } = useApp();

  return (
    <section className="hero-section" id="heroSection">
      <div className="geo-dec geo-tl" />
      <div className="geo-dec geo-tr" />
      <div className="geo-dec geo-br" />
      <div className="geo-line geo-line-h" />
      <div className="geo-line geo-line-v" />

      <div className="hero-inner">
        <div className="hero-text-col">
          <div className="hero-label">
            <span className="hero-label-dot" />
            PRODUCT DISCOVERY · OFFLINE STORES · LIVE INVENTORY
          </div>
          <h1 className="hero-title">
            FIND ANY
            <br />
            PRODUCT
            <br />
            <span className="title-accent">NEARBY</span>
          </h1>
          <p className="hero-sub">
            Real-time stock from local shops around you. Reserve it. Book a rider. Or shop fashion live with your personal
            guide.
          </p>

          <div className="lang-row">
            <span className="lang-label">
              <GlobeIcon size={14} />
              LANGUAGE
            </span>
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
              }}
            >
              <option value="en-US">English</option>
              <option value="hi-IN">हिंदी</option>
              <option value="gu-IN">ગુજરાતી</option>
            </select>
          </div>

          <div className="search-outer">
            <div className="search-box-boxy" id="searchBox">
              <div className="search-icon-wrap">
                <SearchIcon size={18} />
              </div>
              <input
                type="text"
                className="search-inp"
                placeholder="Search notebooks, charger, medicine…"
                value={searchTerm}
                autoComplete="off"
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') doSearch();
                }}
              />
              <div className="search-icon-btns">
                <button className="si-btn" title="Voice Search" onClick={() => openModal('voice')}>
                  <MicIcon size={16} />
                </button>
                <button className="si-btn snap-si" title="Snap & Search" onClick={() => openModal('snap')}>
                  <CameraIcon size={16} />
                </button>
                <button className="search-go-boxy" onClick={() => doSearch()}>
                  SEARCH
                </button>
              </div>
            </div>
            {suggestions.length > 0 && (
              <div className="sug-drop" id="suggestionsDrop">
                {suggestions.map((n) => (
                  <div className="sug-item" key={n} onClick={() => quickSearch(n)}>
                    <SearchIcon size={14} />
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="quick-tags">
            <span className="qt-lbl">QUICK SEARCH —</span>
            {QUICK_TAGS.map((t) => (
              <button className="qt-tag" key={t} onClick={() => quickSearch(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-img-col">
          <div className="hero-img-frame">
            <Image src="/hero.png" alt="nearbuy product discovery illustration" className="hero-img" width={500} height={500} />
            <div className="hero-img-badge top-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#8B5CF6">
                <circle cx="12" cy="12" r="10" />
              </svg>
              LIVE INVENTORY
            </div>
            <div className="hero-img-badge bot-badge">
              <PinIcon size={12} />
              5 STORES NEARBY
            </div>
          </div>
        </div>
      </div>

      <div className="hero-stats-bar">
        <div className="stat-item">
          <span className="stat-num">5,000+</span>
          <span className="stat-lbl">Products Listed</span>
        </div>
        <div className="stat-div" />
        <div className="stat-item">
          <span className="stat-num">120+</span>
          <span className="stat-lbl">Registered Stores</span>
        </div>
        <div className="stat-div" />
        <div className="stat-item">
          <span className="stat-num">SVIT Area</span>
          <span className="stat-lbl">Now Serving Vasad</span>
        </div>
        <div className="stat-div" />
        <div className="stat-item">
          <span className="stat-num">2 km</span>
          <span className="stat-lbl">Search Radius</span>
        </div>
      </div>
    </section>
  );
}