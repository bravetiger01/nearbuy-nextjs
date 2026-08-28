'use client';

import { useApp } from '../../lib/store-context';
import { LogoMark, BarChartIcon, StoreIcon, BoxIcon, BoltIcon, FileIcon, ChessKnightIcon, BankIcon, RupeeIcon, TrendUpIcon, CardIcon, GearIcon } from '../../lib/icons';

const SECTIONS = [
  { cat: 'OVERVIEW', items: [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChartIcon size={15} /> },
    { id: 'listings', label: 'My Listings', icon: <StoreIcon size={15} /> },
  ]},
  { cat: 'INVENTORY', items: [
    { id: 'inventory', label: 'Stock Manager', icon: <BoxIcon size={15} /> },
    { id: 'scanner', label: 'AI Bill Scanner', icon: <BoltIcon size={15} /> },
  ]},
  { cat: 'DOCUMENTS', items: [
    { id: 'invoice', label: 'Purchase Invoice', icon: <FileIcon size={15} /> },
    { id: 'proforma', label: 'Proforma', icon: <FileIcon size={15} /> },
    { id: 'quotation', label: 'Quotation', icon: <ChessKnightIcon size={15} /> },
  ]},
  { cat: 'FINANCE', items: [
    { id: 'ledger', label: 'Bank Ledger', icon: <BankIcon size={15} /> },
    { id: 'expenses', label: 'Expenses', icon: <RupeeIcon size={15} /> },
    { id: 'pnl', label: 'P&L Report', icon: <TrendUpIcon size={15} /> },
  ]},
  { cat: 'SETTINGS', items: [
    { id: 'bank', label: 'Bank Details', icon: <CardIcon size={15} /> },
    { id: 'settings', label: 'Store Settings', icon: <GearIcon size={15} /> },
  ]},
];

export default function OwnerSidebar() {
  const { ownerSection, setOwnerSection, sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useApp();

  return (
    <aside className={`sidebar-boxy ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'open' : ''}`}>
      <div className="sb-top">
        <div className="sb-logo-wrap">
          <LogoMark width={110} height={28} />
          <span className="sb-pro-tag" style={{ background: '#F59E0B', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', border: '1px solid #B45309', marginLeft: 10 }}>
            GOLD SELLER
          </span>
        </div>
        <div className="sb-store-card">
          <div className="sb-store-avatar">SM</div>
          <div>
            <div className="sb-store-name">SVIT Stationery Mart</div>
            <div className="sb-online">
              <span className="online-pip" />
              ONLINE
            </div>
          </div>
        </div>
      </div>
      <nav className="sb-nav-boxy">
        {SECTIONS.map((group) => (
          <div key={group.cat}>
            <div className="sb-cat">{group.cat}</div>
            {group.items.map((item) => (
              <a
                key={item.id}
                className={`sbl ${ownerSection === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setOwnerSection(item.id);
                  closeMobileSidebar();
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        ))}
      </nav>
      <button className="sb-collapse" onClick={toggleSidebar}>
        ‹
      </button>
    </aside>
  );
}