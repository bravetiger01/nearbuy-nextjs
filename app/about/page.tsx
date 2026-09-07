'use client';

import { AppProvider } from '../../lib/store-context';
import CustomerNav from '../../components/customer/CustomerNav';
import Footer from '../../components/customer/Footer';
import TeamSection from '../../components/customer/TeamSection';

export default function AboutPage() {
  return (
    <AppProvider>
      <div className="app-view">
        <CustomerNav />
        <div style={{ paddingTop: '80px', minHeight: 'calc(100vh - 300px)' }}>
          <TeamSection />
          <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 800 }}>About Nearbuy</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--gray-600)', lineHeight: '1.6' }}>
              Nearbuy is your local marketplace, designed to connect you with the shops right around the corner. We bring real-time inventory from your favorite Vasad stores straight to your screen. No more wandering from store to store—just search, reserve, or get it delivered instantly!
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}
