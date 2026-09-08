'use client';

import CustomerNav from './CustomerNav';
import HeroSection from './HeroSection';
import ResultsSection from './ResultsSection';
import ProtocolSection from './ProtocolSection';
import TelemetryFooter from './TelemetryFooter';
import CustomerBottomNav from './CustomerBottomNav';

export default function CustomerView() {
  return (
    <div id="customerView" style={{ backgroundColor: '#f5f0e6', minHeight: '100vh', paddingBottom: '60px' }}>
      <CustomerNav />
      <HeroSection />
      <ResultsSection />
      <ProtocolSection />
      <TelemetryFooter />
      <CustomerBottomNav />
    </div>
  );
}