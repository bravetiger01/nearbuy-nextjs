'use client';

import CustomerNav from './CustomerNav';
import HeroSection from './HeroSection';
import LocationBar from './LocationBar';
import FeaturesSection from './FeaturesSection';
import FashionSection from './FashionSection';
import TeamSection from './TeamSection';
import ResultsSection from './ResultsSection';

export default function CustomerView() {
  return (
    <div id="customerView" className="app-view">
      <CustomerNav />
      <HeroSection />
      <LocationBar />
      <FeaturesSection />
      <FashionSection />
      <ResultsSection />
      <TeamSection />
    </div>
  );
}