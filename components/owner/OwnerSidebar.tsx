'use client';

import Image from 'next/image';
import { useApp } from '../../lib/store-context';
import {
  BarChartIcon,
  StoreIcon,
  BoxIcon,
  BoltIcon,
  FileIcon,
  ChessKnightIcon,
  BankIcon,
  RupeeIcon,
  TrendUpIcon,
  CardIcon,
  GearIcon,
  EyeIcon,
  ReserveIcon,
  UserIcon,
  BellIcon,
} from '../../lib/icons';

const SECTIONS = [
  { cat: 'OVERVIEW', items: [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChartIcon size={15} /> },
    { id: 'listings', label: 'My Listings', icon: <StoreIcon size={15} /> },
    { id: 'storefront', label: 'Storefront', icon: <EyeIcon size={15} /> },
  ]},
  { cat: 'INVENTORY', items: [
    { id: 'inventory', label: 'Stock Manager', icon: <BoxIcon size={15} /> },
    { id: 'scanner', label: 'AI Bill Scanner', icon: <BoltIcon size={15} /> },
  ]},
  { cat: 'SALES', items: [
    { id: 'analytics', label: 'Analytics', icon: <BarChartIcon size={15} /> },
    { id: 'promotions', label: 'Promotions', icon: <ReserveIcon size={15} /> },
    { id: 'payments', label: 'Payments', icon: <CardIcon size={15} /> },
  ]},
  { cat: 'AI', items: [
    { id: 'assistant', label: 'AI Assistant', icon: <BellIcon size={15} /> },
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
  const { ownerSection, setOwnerSection, sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar, ownerLogout } = useApp();

  return (
    <aside className={`sidebar-boxy ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'open' : ''}`}>
      <div className="sb-top">
        <div className="sb-logo-wrap">
          <div className="nb-logo-shine-wrap" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
              <Image src="/logo.jpg" alt="nearbuy" width={36} height={36} style={{ objectFit: 'contain', display: 'block' }} priority />
              <div className="nb-logo-shimmer" />
            </div>
            {!sidebarCollapsed && (
              <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.03em', color: 'var(--black)' }}>nearbuy</span>
            )}
          </div>
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
                {item.id === 'assistant' && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.58rem', fontWeight: 800, background: 'var(--lav-500)', color: '#fff', padding: '1px 6px', letterSpacing: '0.06em' }}>AI</span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ borderTop: 'var(--brd)', padding: '10px 12px' }}>
        <button
          onClick={ownerLogout}
          style={{
            width: '100%', padding: '8px 12px', background: 'transparent',
            border: 'var(--brd)', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#B91C1C'; e.currentTarget.style.borderColor = '#FECACA'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-500)'; e.currentTarget.style.borderColor = 'var(--black)'; }}
        >
          <UserIcon size={14} />
          {!sidebarCollapsed && <span>LOGOUT</span>}
        </button>
      </div>
      <button className="sb-collapse" onClick={toggleSidebar}>
        ‹
      </button>
    </aside>
  );
}