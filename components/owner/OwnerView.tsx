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

export default function OwnerView() {
  const { sidebarCollapsed, ownerSection } = useApp();
  return (
    <div id="ownerView" style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-100)' }}>
      <OwnerSidebar />
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
    case 'inventory':
      return <Inventory />;
    case 'scanner':
      return <Scanner />;
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