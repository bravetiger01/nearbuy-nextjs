'use client';

import { useApp } from '../../lib/store-context';
import { BellIcon, MenuIcon, StoreIcon } from '../../lib/icons';

export default function OwnerTopbar() {
  const { toggleSidebar, showToast, ownerSection, ownerLogout, switchMode } = useApp();
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    listings: 'My Listings',
    storefront: 'Storefront Preview',
    inventory: 'Stock Manager',
    scanner: 'AI Bill Scanner',
    analytics: 'Sales Analytics',
    promotions: 'Promotions',
    payments: 'Payments & Reconciliation',
    assistant: 'AI Business Assistant',
    invoice: 'Purchase Invoice',
    proforma: 'Proforma Invoice',
    quotation: 'Quotation',
    ledger: 'Bank Ledger',
    expenses: 'Expenses',
    pnl: 'P&L Report',
    bank: 'Bank Details',
    settings: 'Store Settings',
  };
  return (
    <div className="owner-topbar-boxy">
      <button className="topbar-menu" onClick={toggleSidebar}>
        <MenuIcon size={18} />
      </button>
      <h2 className="topbar-ttl">{titles[ownerSection] ?? 'Dashboard'}</h2>
      <div className="topbar-r">
        <button className="icon-btn-dark" onClick={() => showToast('2 new reservation requests', 'info')}>
          <BellIcon size={15} />
          <span className="notif-badge">2</span>
        </button>
        <div className="owner-avatar" title="SVIT Stationery Mart — Admin">SM</div>
        <button
          onClick={ownerLogout}
          style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', padding: '5px 12px', border: 'var(--brd)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: 'var(--gray-500)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#B91C1C'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-500)'; }}
        >
          <StoreIcon size={12} /> EXIT
        </button>
        <button
          onClick={() => switchMode('customer')}
          style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', padding: '5px 12px', border: 'var(--brd)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: 'var(--lav-700)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--lav-100)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <StoreIcon size={12} /> CUSTOMER APP
        </button>
      </div>
    </div>
  );
}