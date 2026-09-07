'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { GlobeIcon, MicIcon, CameraIcon, SearchIcon, PinIcon } from '../../lib/icons';

const QUICK_TAGS = ['Notebook', 'Pen', 'Medicine', 'Calculator', 'Chopdi', 'Dawai'];

export default function HeroSection() {
  const { searchTerm, handleSearchInput, doSearch, quickSearch, suggestions, openModal, lang, setLang } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated floating particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; r: number; vx: number; vy: number; opacity: number }[] = [];
    const N = Math.min(40, Math.floor(canvas.width / 20));
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.opacity})`;
        ctx.fill();
      });
      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(167,139,250,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="hero-section" id="heroSection">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />

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