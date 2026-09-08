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

  return (
    <nav className="c-nav" id="cNav">
      <div className="c-nav-inner">
        <a href="#" className="nb-logo">
          <LogoMark />
        </a>
        <div className="c-nav-links">
          <a href="#featSection" className="nav-link">
            Features
          </a>
          <a href="#fashionSection" className="nav-link">
            Shop Live
          </a>
          <a href="#resultsSection" className="nav-link">
            Search
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
  );
}