'use client';

import { LogoMark } from '../../lib/icons';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  return (
    <footer className="nb-footer" id="footer">
      <div className="footer-inner">

        {/* Brand column */}
        <div className="footer-brand">
          <LogoMark width={140} height={32} />
          <p className="footer-tagline">
            Find any product at offline stores near you — real-time stock, live inventory, instant reserve.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">MADE IN INDIA 🇮🇳</span>
            <span className="footer-badge">SVIT · 2025</span>
          </div>
        </div>

        {/* Platform links */}
        <div className="footer-col">
          <div className="footer-col-title">PLATFORM</div>
          <a
            href="#featSection"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('featSection'); }}
          >
            Features
          </a>
          <a
            href="#fashionSection"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('fashionSection'); }}
          >
            Shop Live
          </a>
          <a
            href="#resultsSection"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('resultsSection'); }}
          >
            Search Stores
          </a>
          <a
            href="#heroSection"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('heroSection'); }}
          >
            Home
          </a>
        </div>

        {/* For business links */}
        <div className="footer-col">
          <div className="footer-col-title">FOR BUSINESS</div>
          <a
            href="#"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('heroSection'); }}
          >
            List Your Store
          </a>
          <a
            href="#"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('heroSection'); }}
          >
            Owner Dashboard
          </a>
          <a
            href="#"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('heroSection'); }}
          >
            AI Inventory Scanner
          </a>
          <a
            href="#"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('heroSection'); }}
          >
            Analytics & Reports
          </a>
        </div>

        {/* Team links */}
        <div className="footer-col">
          <div className="footer-col-title">TEAM</div>
          <a
            href="#teamSection"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('teamSection'); }}
          >
            About Us
          </a>
          <a
            href="#teamSection"
            className="footer-link"
            onClick={(e) => { e.preventDefault(); scrollTo('teamSection'); }}
          >
            SVIT College Project
          </a>
          <a
            href="mailto:tithi@nearbuy.in"
            className="footer-link"
          >
            Contact Us
          </a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copy">© 2025 NEARBUY. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privacy</a>
            <a href="#" className="footer-bottom-link">Terms</a>
            <a href="#" className="footer-bottom-link">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
