'use client';

import { AppProvider } from '../../lib/store-context';
import CustomerNav from '../../components/customer/CustomerNav';
import Footer from '../../components/customer/Footer';

export default function ContactPage() {
  return (
    <AppProvider>
      <div className="app-view">
        <CustomerNav />
        <div style={{ paddingTop: '100px', minHeight: 'calc(100vh - 300px)', paddingBottom: '40px' }}>
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', textAlign: 'center' }}>Contact Us</h1>
            <p style={{ textAlign: 'center', color: 'var(--gray-500)', marginBottom: '32px' }}>
              Have a question or want to list your store? Send us a message!
            </p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => e.preventDefault()}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Name</label>
                <input type="text" style={{ width: '100%', padding: '12px', border: 'var(--brd)', borderRadius: 'var(--r-sm)' }} placeholder="Your name" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Email</label>
                <input type="email" style={{ width: '100%', padding: '12px', border: 'var(--brd)', borderRadius: 'var(--r-sm)' }} placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Message</label>
                <textarea rows={5} style={{ width: '100%', padding: '12px', border: 'var(--brd)', borderRadius: 'var(--r-sm)' }} placeholder="How can we help?"></textarea>
              </div>
              <button style={{ background: 'var(--lav-500)', color: 'white', padding: '14px', border: 'none', borderRadius: 'var(--r-sm)', fontWeight: 800, cursor: 'pointer', marginTop: '8px' }}>
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}
