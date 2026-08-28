'use client';

import { useApp } from '../lib/store-context';
import { StoreIcon } from '../lib/icons';

export default function ModeSwitcher() {
  const { mode, switchMode } = useApp();
  return (
    <div className="mode-switcher-wrap">
      <div className="mode-switcher">
        <button className={`mode-btn ${mode === 'customer' ? 'active' : ''}`} onClick={() => switchMode('customer')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          Customer
        </button>
        <button className={`mode-btn ${mode === 'owner' ? 'active' : ''}`} onClick={() => switchMode('owner')}>
          <StoreIcon size={14} strokeWidth={2.5} />
          Shop Owner
        </button>
      </div>
    </div>
  );
}