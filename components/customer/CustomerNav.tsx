'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';
import { BellIcon, LogoMark, MoonIcon, StoreIcon, UserIcon, MenuIcon } from '../../lib/icons';

export default function CustomerNav() {
  const { toggleTheme, openModal, loggedIn, isOwner, switchMode } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="c-nav" id="cNav">
      <div className="c-nav-inner">
        <a
          href="#heroSection"
          className="nb-logo"
          onClick={(e) => { e.preventDefault(); scrollTo('heroSection'); }}
        >
          <LogoMark />
        </a>

        {/* Desktop nav links */}
        <div className="c-nav-links">
          <a
            href="#featSection"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); scrollTo('featSection'); }}
          >
            Features
          </a>
          <a
            href="#fashionSection"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); scrollTo('fashionSection'); }}
          >
            Shop Live
          </a>
          <a
            href="#resultsSection"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); scrollTo('resultsSection'); }}
          >
            Search
          </a>
          <a
            href="#teamSection"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); scrollTo('teamSection'); }}
          >
            Team
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

          {/* Shop Owner Login Button */}
          {isOwner ? (
            <button
              className="user-chip"
              style={{ background: 'var(--black)', borderColor: 'var(--black)', cursor: 'pointer' }}
              onClick={() => switchMode('owner')}
            >
              <StoreIcon size={14} />
              DASHBOARD
            </button>
          ) : (
            <button
              className="user-chip"
              style={{ background: 'var(--black)', cursor: 'pointer', border: 'var(--brd)', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => openModal('login')}
            >
              <StoreIcon size={13} />
              SHOP OWNER
            </button>
          )}

          <div
            className="user-chip"
            style={{ cursor: 'pointer', background: loggedIn ? 'var(--black)' : undefined }}
            onClick={() => (!loggedIn ? openModal('login') : undefined)}
          >
            <UserIcon size={14} />
            {loggedIn ? 'YOU' : 'LOGIN'}
          </div>

          {/* Mobile hamburger */}
          <button
            className="icon-btn c-nav-hamburger"
            title="Menu"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Open mobile menu"
          >
            <MenuIcon size={16} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="c-nav-mobile-drop">
          <a
            href="#featSection"
            className="c-nav-mobile-link"
            onClick={(e) => { e.preventDefault(); scrollTo('featSection'); }}
          >
            Features
          </a>
          <a
            href="#fashionSection"
            className="c-nav-mobile-link"
            onClick={(e) => { e.preventDefault(); scrollTo('fashionSection'); }}
          >
            Shop Live
          </a>
          <a
            href="#resultsSection"
            className="c-nav-mobile-link"
            onClick={(e) => { e.preventDefault(); scrollTo('resultsSection'); }}
          >
            Search
          </a>
          <a
            href="#teamSection"
            className="c-nav-mobile-link"
            onClick={(e) => { e.preventDefault(); scrollTo('teamSection'); }}
          >
            Team
          </a>
        </div>
      )}
    </nav>
  );
}