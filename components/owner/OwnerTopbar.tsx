'use client';

import { useApp } from '../../lib/store-context';
import { BellIcon, MenuIcon } from '../../lib/icons';

export default function OwnerTopbar() {
  const { toggleSidebar, showToast, ownerSection } = useApp();
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    listings: 'My Listings',
    inventory: 'Stock Manager',
    scanner: 'AI Bill Scanner',
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
        <div className="owner-avatar">SM</div>
      </div>
    </div>
  );
}