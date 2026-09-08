'use client';

import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { GlobeIcon, MicIcon, CameraIcon, SearchIcon, PinIcon } from '../../lib/icons';

const QUICK_TAGS = ['Notebook', 'Pen', 'Avil', 'Cetirizine', 'Dulcolax', 'Cremaffin', 'Calculator', 'Zyrtec'];

export default function HeroSection() {
  const { searchTerm, handleSearchInput, doSearch, quickSearch, suggestions, openModal, lang, setLang } = useApp();

  return (
    <section className="hero-section" id="heroSection">
      {/* Geometric decorations */}
      <div className="geo-dec geo-tl" />
      <div className="geo-dec geo-tr" />
      <div className="geo-dec geo-br" />
      <div className="geo-line geo-line-h" />

      <div className="hero-inner-centered">
        {/* Official logo with shine */}
        <div className="hero-logo-wrap">
          <div className="hero-logo-glow" />
          <div className="hero-logo-shine-container">
            <Image
              src="/logo.jpg"
              alt="nearbuy — find anything nearby"
              width={56}
              height={56}
              className="hero-logo-img"
              style={{ mixBlendMode: 'multiply' }}
              priority
            />
            <div className="hero-logo-shimmer-bar" />
          </div>
          <div className="hero-logo-badge">
            <span className="hero-label-dot" />
            LIVE INVENTORY · 2 KM RADIUS
          </div>
        </div>

        {/* Headline */}
        <h1 className="hero-title-centered">
          Find Any Product
          <br />
          <span className="title-accent">Nearbuy</span> — Instantly
        </h1>
        <p className="hero-sub-centered">
          Real-time stock from local shops around you. Reserve it, book
          <br />
          a rider, or shop live.
        </p>

        {/* Language selector */}
        <div className="hero-lang-row">
          <span className="lang-label">
            <GlobeIcon size={13} />
            LANGUAGE
          </span>
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">हिंदी</option>
            <option value="gu-IN">ગુજરાતી</option>
          </select>
        </div>

        {/* Search bar — CENTERED and prominent */}
        <div className="hero-search-wrap">
          <div className="search-outer">
            <div className="search-box-boxy" id="searchBox">
              <div className="search-icon-wrap">
                <SearchIcon size={18} />
              </div>
              <input
                type="text"
                className="search-inp"
                placeholder={
                  lang === 'gu-IN'
                    ? 'ચોપડી, દવા, પેન શોધો… (Try "chopdi")'
                    : lang === 'hi-IN'
                    ? 'किताब, दवाई, पेन खोजें… (Try "kitab")'
                    : 'Search notebooks, medicine, charger…'
                }
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

          {/* Central Phone Illustration */}
          <div className="hero-phone-wrap">
            <Image
              src="/hero.png"
              alt="Nearbuy Delivery"
              width={250}
              height={250}
              className="hero-phone-img"
              priority
            />
          </div>

          {/* Quick tags */}
          <div className="quick-tags-centered">
            <span className="qt-lbl">QUICK —</span>
            <div className="qt-scroll">
              {QUICK_TAGS.map((t) => (
                <button className="qt-tag" key={t} onClick={() => quickSearch(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="hero-pills-row">
          <button className="hero-pill" onClick={() => openModal('snap')}>
            <CameraIcon size={14} />
            Snap &amp; Search
          </button>
          <button className="hero-pill" onClick={() => openModal('voice')}>
            <MicIcon size={14} />
            Voice Search
          </button>
          <div className="hero-pill static">
            <PinIcon size={14} />
            SVIT · Vasad
          </div>
        </div>
      </div>
    </section>
  );
}