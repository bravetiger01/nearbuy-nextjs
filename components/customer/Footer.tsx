'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--white)', borderTop: 'var(--brd)', padding: '40px 20px', marginTop: '40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Logo and Tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <Image
            src="/logo.jpg"
            alt="nearbuy"
            width={48}
            height={48}
            style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
          />
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', maxWidth: 400 }}>
            Discover local stores, search inventory in real-time, and get items delivered instantly. Your neighborhood marketplace.
          </p>
        </div>

        {/* Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, textAlign: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontWeight: 800, color: 'var(--black)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>COMPANY</h4>
            <Link href="/about" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>About Us</Link>
            <Link href="/contact" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>Contact</Link>
            <Link href="/faq" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>FAQ</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontWeight: 800, color: 'var(--black)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>LEGAL</h4>
            <Link href="#" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="#" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="#" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>Refund Policy</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4 style={{ fontWeight: 800, color: 'var(--black)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>FOR STORES</h4>
            <Link href="#" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>Partner with us</Link>
            <Link href="#" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>Shopkeeper Login</Link>
            <Link href="#" style={{ color: 'var(--gray-600)', fontSize: '0.85rem', textDecoration: 'none' }}>Seller Guidelines</Link>
          </div>

        </div>

        {/* Copyright */}
        <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 24, textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.75rem', marginTop: 16 }}>
          © {new Date().getFullYear()} Nearbuy Inc. All rights reserved. Made with ❤️ in Vasad.
        </div>

      </div>
    </footer>
  );
}
