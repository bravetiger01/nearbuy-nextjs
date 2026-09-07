'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { BellIcon, MoonIcon, StoreIcon, UserIcon } from '../../lib/icons';

export default function CustomerNav() {
  const { toggleTheme, openModal, loggedIn, isOwner, switchMode } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Drawer overlay */}
      {drawerOpen && (
        <div
          className="nav-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile slide drawer */}
      <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <div className="nav-drawer-logo">
            <Image
              src="/brand/nearbuy_logo.jpg"
              alt="nearbuy"
              width={120}
              height={40}
              className="drawer-logo-img"
            />
          </div>
          <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="nav-drawer-links">
          <a href="#featSection" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}>
            <span className="ndl-icon">✦</span> Features
          </a>
          <a href="#fashionSection" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}>
            <span className="ndl-icon">▶</span> Shop Live
          </a>
          <a href="#resultsSection" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}>
            <span className="ndl-icon">◎</span> Search
          </a>
        </div>
        <div className="c-nav-right">
          <button className="icon-btn" title="Toggle Dark Mode" onClick={toggleTheme}>
            <MoonIcon size={16} />
          </button>
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" title="Notifications" onClick={() => setNotifOpen((o) => !o)}>
              <BellIcon size={16} />
              <span className="notif-badge">3</span>
            </button>
            {notifOpen && (
              <div className="notif-drop">
                <div className="notif-item unread">
                  <div className="nd-dot" />
                  <div>
                    <strong>Reservation confirmed</strong> at SVIT Stationery Mart
                    <br />
                    <small>2 min ago</small>
                  </div>
                </div>
                <div className="notif-item unread">
                  <div className="nd-dot" />
                  <div>
                    <strong>Rider picked up</strong> your Casio Calculator order
                    <br />
                    <small>15 min ago</small>
                  </div>
                </div>
                <div className="notif-item">
                  <div className="nd-dot read" />
                  <div>
                    <strong>New store opened</strong> near you: New Student Zone
                    <br />
                    <small>1 hr ago</small>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shop Owner / Rider Login Buttons */}
          {isOwner ? (
            <button
              className="drawer-cta-btn owner"
              onClick={() => { switchMode('owner'); setDrawerOpen(false); }}
            >
              <StoreIcon size={15} />
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                className="user-chip"
                style={{ background: 'var(--black)', cursor: 'pointer', border: 'var(--brd)', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => openModal('login')}
              >
                <StoreIcon size={13} />
                SHOP OWNER
              </button>
              <button
                className="user-chip"
                style={{ background: 'var(--black)', cursor: 'pointer', border: 'var(--brd)', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => switchMode('rider')}
              >
                <StoreIcon size={13} />
                RIDER LOGIN
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main nav */}
      <nav className="c-nav" id="cNav">
        <div className="c-nav-inner">
          {/* Hamburger (mobile) */}
          <button
            className="nav-hamburger"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <span /><span /><span />
          </button>

          {/* Logo */}
          <a href="#" className="nb-logo-wrap">
            <div className="nb-logo-shine-wrap">
              <Image
                src="/brand/nearbuy_logo.jpg"
                alt="nearbuy — find anything nearby"
                width={130}
                height={42}
                className="nb-logo-img"
                priority
              />
              <div className="nb-logo-shimmer" />
            </div>
          </a>

          {/* Desktop nav links */}
          <div className="c-nav-links">
            <a href="#featSection" className="nav-link">Features</a>
            <a href="#fashionSection" className="nav-link">Shop Live</a>
            <a href="#resultsSection" className="nav-link">Search</a>
          </div>

          {/* Right actions */}
          <div className="c-nav-right">
            <button className="icon-btn" title="Toggle Dark Mode" onClick={toggleTheme}>
              <MoonIcon size={16} />
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" title="Notifications" onClick={() => setNotifOpen((o) => !o)}>
                <BellIcon size={16} />
                <span className="notif-badge">3</span>
              </button>
              {notifOpen && (
                <div className="notif-drop">
                  <div className="notif-item unread">
                    <div className="nd-dot" />
                    <div>
                      <strong>Reservation confirmed</strong> at SVIT Stationery Mart
                      <br />
                      <small>2 min ago</small>
                    </div>
                  </div>
                  <div className="notif-item unread">
                    <div className="nd-dot" />
                    <div>
                      <strong>Rider picked up</strong> your Casio Calculator order
                      <br />
                      <small>15 min ago</small>
                    </div>
                  </div>
                  <div className="notif-item">
                    <div className="nd-dot read" />
                    <div>
                      <strong>New store opened</strong> near you: New Student Zone
                      <br />
                      <small>1 hr ago</small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shop Owner / Dashboard */}
            {isOwner ? (
              <button
                className="user-chip"
                style={{ background: 'var(--lav-500)', borderColor: 'var(--lav-700)', cursor: 'pointer' }}
                onClick={() => switchMode('owner')}
              >
                <StoreIcon size={14} />
                <span className="chip-txt">DASHBOARD</span>
              </button>
            ) : (
              <button
                className="user-chip"
                style={{ background: 'var(--black)', cursor: 'pointer', border: 'var(--brd)', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => openModal('login')}
              >
                <StoreIcon size={13} />
                <span className="chip-txt">SHOP OWNER</span>
              </button>
            )}

            <div
              className="user-chip"
              style={{ cursor: 'pointer', background: loggedIn ? 'var(--lav-700)' : undefined }}
              onClick={() => (!loggedIn ? openModal('login') : undefined)}
            >
              <UserIcon size={14} />
              <span className="chip-txt">{loggedIn ? 'YOU' : 'LOGIN'}</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}