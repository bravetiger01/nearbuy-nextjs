'use client';

import CustomerNav from './CustomerNav';
import HeroSection from './HeroSection';
import LocationBar from './LocationBar';
import FeaturesSection from './FeaturesSection';
import FashionSection from './FashionSection';
import ResultsSection from './ResultsSection';
import SeasonalBanner from './SeasonalBanner';
import StoreMap from './StoreMap';
import Footer from './Footer';
import TeamSection from './TeamSection';

export default function CustomerView() {
  return (
    <div id="customerView" className="app-view">
      <CustomerNav />
      <HeroSection />
      <LocationBar />
      <SeasonalBanner />
      <FeaturesSection />
      <FashionSection />
      <StoreMap />
      <ResultsSection />
      <TeamSection />
    </div>
  );
}