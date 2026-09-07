'use client';

import { useApp } from '../../lib/store-context';
import OwnerSidebar from './OwnerSidebar';
import OwnerTopbar from './OwnerTopbar';
import Dashboard from './Dashboard';
import Listings from './Listings';
import Inventory from './Inventory';
import Scanner from './Scanner';
import Docs from './Docs';
import Ledger from './Ledger';
import Expenses from './Expenses';
import PnL from './PnL';
import Bank from './Bank';
import SettingsView from './SettingsView';
import Analytics from './Analytics';
import Promotions from './Promotions';
import Payments from './Payments';
import AIAssistant from './AIAssistant';
import Storefront from './Storefront';

export default function OwnerView() {
  const { sidebarCollapsed, ownerSection, mobileSidebarOpen, closeMobileSidebar } = useApp();
  return (
    <div id="ownerView" style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-100)' }}>
      <OwnerSidebar />
      {mobileSidebarOpen && <div className="sb-overlay" onClick={closeMobileSidebar} />}
      <main className={`owner-main-boxy ${sidebarCollapsed ? 'sb-collapsed' : ''}`}>
        <OwnerTopbar />
        <DashboardKey ownerSection={ownerSection} />
      </main>
    </div>
  );
}

function DashboardKey({ ownerSection }: { ownerSection: string }) {
  switch (ownerSection) {
    case 'dashboard':
      return <Dashboard />;
    case 'listings':
      return <Listings />;
    case 'storefront':
      return <Storefront />;
    case 'inventory':
      return <Inventory />;
    case 'scanner':
      return <Scanner />;
    case 'analytics':
      return <Analytics />;
    case 'promotions':
      return <Promotions />;
    case 'payments':
      return <Payments />;
    case 'assistant':
      return <AIAssistant />;
    case 'invoice':
    case 'proforma':
    case 'quotation':
      return <Docs />;
    case 'ledger':
      return <Ledger />;
    case 'expenses':
      return <Expenses />;
    case 'pnl':
      return <PnL />;
    case 'bank':
      return <Bank />;
    case 'settings':
      return <SettingsView />;
    default:
      return <Dashboard />;
  }
}