'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { GlobeIcon, MicIcon, CameraIcon, SearchIcon, PinIcon } from '../../lib/icons';
import Grainient from '../Grainient';

const QUICK_TAGS = ['Notebook', 'Pen', 'Avil', 'Cetirizine', 'Dulcolax', 'Cremaffin', 'Calculator', 'Zyrtec'];

export default function HeroSection() {
  const { searchTerm, handleSearchInput, doSearch, quickSearch, suggestions, openModal, lang, setLang } = useApp();

  return (
    <section className="hero-section" id="heroSection">
      {/* Grainient Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.55 }}>
        <Grainient
          color1="#7C3AED"
          color2="#340e74"
          color3="#1a0a3c"
          timeSpeed={1.8}
          colorBalance={-0.03}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={2.0}
          warpAmplitude={50.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.1}
          saturation={1.0}
          zoom={0.9}
        />
      </div>

      {/* Geometric decorations */}
      <div className="geo-dec geo-tl" />
      <div className="geo-dec geo-tr" />
      <div className="geo-dec geo-br" />
      <div className="geo-line geo-line-h" />

      <div className="hero-inner-centered" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Official logo with shine */}
        <div className="hero-logo-wrap">
          <div className="hero-logo-glow" />
          <div className="hero-logo-shine-container">
            <Image
              src="/brand/nearbuy_logo.jpg"
              alt="nearbuy — find anything nearby"
              width={240}
              height={80}
              className="hero-logo-img"
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
          <span className="title-accent">Nearby</span>
          {' '}— Instantly
        </h1>
        <p className="hero-sub-centered">
          Real-time stock from local shops around you.
          Reserve it, book a rider, or shop live.
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
                placeholder="Search notebooks, medicine, charger…"
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

          {/* Placed Hero Image correctly in flow */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '32px 0 16px',
            animation: 'float 6s ease-in-out infinite',
          }}>
            <Image
              src="/hero.png"
              alt="Nearbuy Delivery"
              width={250}
              height={250}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.1))' }}
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

      {/* Stats bar */}
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