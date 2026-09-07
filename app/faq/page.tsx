'use client';

import { AppProvider } from '../../lib/store-context';
import CustomerNav from '../../components/customer/CustomerNav';
import Footer from '../../components/customer/Footer';

export default function FAQPage() {
  const faqs = [
    { q: 'How do I search for a product?', a: 'Just type what you are looking for in the home search bar. You can also use voice search or snap a photo!' },
    { q: 'How do reservations work?', a: 'Once you reserve an item, the shopkeeper sets it aside for you. You have a few hours to pick it up and pay at the store.' },
    { q: 'Is rider delivery available everywhere?', a: 'Currently, our rider network operates within a 2km radius of SVIT College in Vasad.' },
    { q: 'I am a shop owner, how do I join?', a: 'Click on "Shop Owner Login" from the menu. You can manage your live inventory directly from your dashboard.' },
  ];

  return (
    <AppProvider>
      <div className="app-view">
        <CustomerNav />
        <div style={{ paddingTop: '100px', minHeight: 'calc(100vh - 300px)', paddingBottom: '60px' }}>
          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>Frequently Asked Questions</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ border: 'var(--brd)', padding: '20px', borderRadius: 'var(--r-sm)', background: 'var(--white)' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--black)' }}>{faq.q}</h3>
                  <p style={{ color: 'var(--gray-600)', lineHeight: '1.5' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}
