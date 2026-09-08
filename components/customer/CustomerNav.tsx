'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import { BellIcon, LogoMark, MoonIcon, StoreIcon, TruckIcon, UserIcon } from '../../lib/icons';

function ReservationTimer({ time }: { time: string }) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const calc = () => {
      const expires = new Date(time).getTime() + 2 * 60 * 60 * 1000;
      const diff = expires - Date.now();
      if (diff <= 0) { setRemaining('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setRemaining(`${h}h ${m}m left`);
    };
    calc();
    const iv = setInterval(calc, 30000);
    return () => clearInterval(iv);
  }, [time]);
  return <small style={{ color: remaining === 'Expired' ? '#ef4444' : '#10b981', fontWeight: 700 }}>{remaining}</small>;
}

export default function CustomerNav() {
  const { toggleTheme, openModal, loggedIn, isOwner, switchMode, reservations = [] } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const totalBadge = isOwner ? pendingCount : 3;

  return (
    <>
      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="nav-drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile slide drawer */}
      <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <div className="nav-drawer-logo">
            <Image src="/logo.jpg" alt="nearbuy" width={40} height={40} className="drawer-logo-img" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">✕</button>
        </div>
        <nav className="nav-drawer-links">
          <a href="#featSection" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}>
            <span className="ndl-icon">✦</span> Features
          </a>
          <button
            type="button"
            className="nav-drawer-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }}
            onClick={() => { setDrawerOpen(false); openModal('rider'); }}
          >
            <span className="ndl-icon">🚚</span> Book Rider
          </button>
          <a href="#resultsSection" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}>
            <span className="ndl-icon">🔍</span> Search
          </a>
          <a href="/about" className="nav-drawer-link" onClick={() => setDrawerOpen(false)}>
            <span className="ndl-icon">ℹ</span> About
          </a>
          {isOwner ? (
            <button
              type="button"
              className="nav-drawer-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }}
              onClick={() => { setDrawerOpen(false); switchMode('owner'); }}
            >
              <span className="ndl-icon">🏪</span> Dashboard
            </button>
          ) : (
            <button
              type="button"
              className="nav-drawer-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', width: '100%' }}
              onClick={() => { setDrawerOpen(false); openModal('login'); }}
            >
              <span className="ndl-icon">🏪</span> Shop Owner
            </button>
          )}
        </nav>
      </div>

      {/* Main nav */}
      <nav className="c-nav" id="cNav">
        <div className="c-nav-inner">
          <button className="nav-hamburger" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <span /><span /><span />
          </button>

          <a href="#" className="nb-logo-wrap">
            <div className="nb-logo-shine-wrap">
              <Image
                src="/logo.jpg"
                alt="nearbuy — find anything nearby"
                width={40}
                height={40}
                className="nb-logo-img"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
              <div className="nb-logo-shimmer" />
            </div>
          </a>

          <div className="c-nav-links">
            <a href="#featSection" className="nav-link">Features</a>
            <a href="#" onClick={(e) => { e.preventDefault(); switchMode('rider'); }} className="nav-link">Book Rider</a>
            <a href="#resultsSection" className="nav-link">Search</a>
            <a href="/about" className="nav-link">About</a>
          </div>

          <div className="c-nav-right">
            <button className="icon-btn" title="Toggle Dark Mode" onClick={toggleTheme}>
              <MoonIcon size={16} />
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" title="Notifications" onClick={() => setNotifOpen(o => !o)}>
                <BellIcon size={16} />
                {totalBadge > 0 && (
                  <span className="notif-badge" style={{ animation: 'ping 1.5s ease-in-out infinite' }}>
                    {totalBadge}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="notif-drop">
                  {isOwner && reservations.length > 0 ? (
                    <>
                      <div style={{ padding: '8px 12px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--gray-500)', letterSpacing: '0.08em', borderBottom: '1px solid var(--gray-100)' }}>
                        RESERVATION ALERTS
                      </div>
                      {reservations.slice(0, 5).map(r => (
                        <div key={r.id} className={`notif-item ${r.status === 'pending' ? 'unread' : ''}`}>
                          <div className="nd-dot" style={{ background: r.status === 'pending' ? '#f59e0b' : '#10b981' }} />
                          <div>
                            <strong>🛒 {r.product}</strong><br />
                            <small style={{ color: 'var(--gray-500)' }}>
                              {r.customer} · Qty: {r.qty} ·{' '}
                              <span style={{
                                padding: '1px 6px', borderRadius: '4px',
                                background: r.status === 'pending' ? '#fef3c7' : '#d1fae5',
                                color: r.status === 'pending' ? '#92400e' : '#065f46',
                                fontWeight: 700, fontSize: '0.65rem',
                              }}>
                                {r.status.toUpperCase()}
                              </span>
                            </small><br />
                            {r.status === 'pending' && <ReservationTimer time={r.time} />}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => { switchMode('owner'); setNotifOpen(false); }}
                        style={{ width: '100%', padding: '10px', background: 'var(--lav-50)', border: 'none', fontSize: '0.8rem', fontWeight: 700, color: 'var(--lav-700)', cursor: 'pointer', borderTop: '1px solid var(--gray-100)' }}
                      >
                        View All in Dashboard →
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="notif-item unread">
                        <div className="nd-dot" />
                        <div><strong>Reservation confirmed</strong> at SVIT Stationery Mart<br /><small>2 min ago</small></div>
                      </div>
                      <div className="notif-item unread">
                        <div className="nd-dot" />
                        <div><strong>Rider picked up</strong> your Casio Calculator order<br /><small>15 min ago</small></div>
                      </div>
                      <div className="notif-item">
                        <div className="nd-dot read" />
                        <div><strong>New store opened</strong> near you: New Student Zone<br /><small>1 hr ago</small></div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

          {/* Shop Owner Login Button */}
          {isOwner ? (
            <button
              className="user-chip"
              style={{ background: 'var(--lav-500)', borderColor: 'var(--lav-700)', cursor: 'pointer' }}
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
              SHOP OWNER LOGIN
            </button>
          )}

          <div
            className="user-chip"
            style={{ cursor: 'pointer', background: loggedIn ? 'var(--lav-700)' : undefined }}
            onClick={() => (!loggedIn ? openModal('login') : undefined)}
          >
            <UserIcon size={14} />
            {loggedIn ? 'YOU' : 'LOGIN'}
          </div>
        </div>
      </div>
    </nav>
  </>
);
}