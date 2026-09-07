'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

type Role = 'select' | 'customer' | 'owner';

export default function LoginModal() {
  const { showToast, closeModal, setLoggedIn, switchMode } = useApp();
  const [role, setRole] = useState<Role>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOwnerLogin = () => {
    if (!email.trim() || !password.trim()) {
      showToast('Please enter email and password', 'error');
      return;
    }
    if (email.trim().toLowerCase() !== 'admin@gmail.com' || password !== 'admin123') {
      showToast('Invalid credentials. Try admin@gmail.com / admin123', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoggedIn(true);
      switchMode('owner');
      closeModal('login');
      showToast('Welcome back! Shop Owner Dashboard loaded.', 'success');
    }, 800);
  };

  const handleCustomerLogin = () => {
    setLoggedIn(true);
    closeModal('login');
    showToast('Logged in as Customer!', 'success');
  };

  const footer = (
    <>
      {role === 'select' && (
        <button className="btn-modal-outline" onClick={() => closeModal('login')}>
          CANCEL
        </button>
      )}
      {role === 'customer' && (
        <>
          <button className="btn-modal-outline" onClick={() => setRole('select')}>BACK</button>
          <button className="btn-modal-solid" onClick={handleCustomerLogin}>
            CONTINUE AS CUSTOMER
          </button>
        </>
      )}
      {role === 'owner' && (
        <>
          <button className="btn-modal-outline" onClick={() => { setRole('select'); setEmail(''); setPassword(''); }}>
            BACK
          </button>
          <button className="btn-modal-solid" onClick={handleOwnerLogin} disabled={loading}>
            {loading ? 'VERIFYING…' : 'SIGN IN →'}
          </button>
        </>
      )}
    </>
  );

  return (
    <Modal name="login" title="SIGN IN TO NEARBUY" footer={footer}>
      {role === 'select' && (
        <>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 20 }}>
            Choose how you want to continue:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => setRole('customer')}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                border: 'var(--brd)',
                background: 'var(--lav-50)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ width: 40, height: 40, background: 'var(--lav-200)', border: 'var(--brd)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                🛍️
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'var(--display)' }}>Customer</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 2 }}>Search products, reserve items, track orders</div>
              </div>
            </button>
            <button
              onClick={() => setRole('owner')}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                border: '2px solid var(--black)',
                background: 'var(--black)',
                color: 'var(--white)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-lg)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ width: 40, height: 40, background: 'var(--lav-500)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                🏪
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'var(--display)' }}>Shop Owner</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Manage inventory, orders, analytics & more</div>
              </div>
            </button>
          </div>
        </>
      )}

      {role === 'customer' && (
        <>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 16 }}>
            Continue as a guest customer or sign in with your account.
          </p>
          <div className="form-g">
            <label>PHONE / EMAIL (OPTIONAL)</label>
            <input type="text" className="f-inp" placeholder="+91 9XXXX XXXXX" />
          </div>
        </>
      )}

      {role === 'owner' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: 'var(--lav-50)', border: 'var(--brd-lav)' }}>
            <span style={{ fontSize: '1rem' }}>🏪</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--lav-700)' }}>Shop Owner Portal — Secure Login</span>
          </div>
          <div className="form-g">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              className="f-inp"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOwnerLogin()}
              autoFocus
            />
          </div>
          <div className="form-g" style={{ marginTop: 12 }}>
            <label>PASSWORD</label>
            <input
              type="password"
              className="f-inp"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOwnerLogin()}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 10 }}>
            Demo credentials: admin@gmail.com / admin123
          </p>
        </>
      )}
    </Modal>
  );
}