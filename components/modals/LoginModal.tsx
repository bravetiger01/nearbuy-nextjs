'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

type Role = 'select' | 'customer' | 'owner';
type AuthMode = 'login' | 'signup';

export default function LoginModal() {
  const { showToast, closeModal, supabase, switchMode, loginDemo } = useApp();
  const [role, setRole] = useState<Role>('select');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async (expectedRole: 'customer' | 'shop_owner') => {
    if (!supabase) {
      showToast('Supabase is not configured yet. Set up .env.local', 'error');
      return;
    }
    if (!email.trim() || !password.trim()) {
      showToast('Please enter email and password', 'error');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setLoading(false);
      // Full error logged to browser console for debugging
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = error as any;
      const errStatus  = anyErr?.status  ?? anyErr?.code_number;
      const errMessage = anyErr?.message ?? String(error);
      const errCode    = anyErr?.code;
      console.error('[NearBuy] signInWithPassword error:', errStatus, errMessage, errCode, error);

      // --- Demo fallback ---------------------------------------------------
      // Supabase GoTrue returns 500 "Database error querying schema" when the
      // auth.users row was seeded via raw SQL and GoTrue can't process it.
      // For demo / hackathon use: if status is 500 OR the message matches,
      // bypass GoTrue and log in via local state.
      const isGoTrueDown =
        errStatus === 500 ||
        errMessage.toLowerCase().includes('database error');
      const emailNorm   = email.trim().toLowerCase();
      const isDemoAdmin    = emailNorm === 'admin@gmail.com'    && password === 'admin123';
      const isDemoCustomer = emailNorm === 'customer@gmail.com' && password === 'customer123';

      if (isGoTrueDown && (isDemoAdmin || isDemoCustomer)) {
        const demoRole = isDemoAdmin ? 'shop_owner' : 'customer';
        if (demoRole !== expectedRole) {
          showToast(
            expectedRole === 'shop_owner'
              ? 'This account is not a Shop Owner'
              : 'This account is not a Customer account',
            'error'
          );
          return;
        }
        loginDemo(demoRole);
        if (expectedRole === 'shop_owner') switchMode('owner');
        showToast(
          expectedRole === 'shop_owner'
            ? 'Welcome! Shop Owner Dashboard loaded.'
            : 'Logged in as Customer!',
          'success'
        );
        closeModal('login');
        return;
      }
      // ---------------------------------------------------------------------

      const detail = [errMessage, errCode && `code: ${errCode}`, errStatus && `status: ${errStatus}`]
        .filter(Boolean).join(' | ');
      showToast(detail || 'Login failed', 'error');
      return;
    }
    if (!data.user) {
      setLoading(false);
      showToast('Login failed. Please try again.', 'error');
      return;
    }
    // Verify the account's role against the intended role.
    const { data: prof } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();
    const roleVal = prof?.role;
    if (expectedRole === 'shop_owner' && roleVal !== 'shop_owner') {
      await supabase.auth.signOut();
      setLoading(false);
      showToast('This account is not a Shop Owner', 'error');
      return;
    }
    if (expectedRole === 'customer' && roleVal && roleVal !== 'customer') {
      await supabase.auth.signOut();
      setLoading(false);
      showToast('This account is not a Customer account', 'error');
      return;
    }
    setLoading(false);
    if (expectedRole === 'shop_owner') {
      switchMode('owner');
      showToast('Welcome back! Shop Owner Dashboard loaded.', 'success');
    } else {
      showToast('Logged in as Customer!', 'success');
    }
    closeModal('login');
  };

  const signUp = async (expectedRole: 'customer' | 'shop_owner') => {
    if (!supabase) {
      showToast('Supabase is not configured yet. Set up .env.local', 'error');
      return;
    }
    if (!email.trim() || !password.trim()) {
      showToast('Please enter email and password', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) {
      setLoading(false);
      console.error('[NearBuy] signUp error:', {
        message: error.message,
        status: (error as { status?: number }).status,
        code: (error as { code?: string }).code,
        full: error,
      });
      const code = (error as { code?: string }).code;
      const status = (error as { status?: number }).status;
      const detail = [error.message, code && `code: ${code}`, status && `status: ${status}`]
        .filter(Boolean).join(' | ');
      showToast(detail || 'Sign up failed', 'error');
      return;
    }
    if (data.user) {
      // Create/update the profile with the chosen role.
      const { error: profError } = await supabase.from('profiles').upsert(
        { id: data.user.id, email: email.trim().toLowerCase(), role: expectedRole },
        { onConflict: 'id' }
      );
      if (profError) {
        setLoading(false);
        showToast('Account created but profile update failed: ' + profError.message, 'error');
        return;
      }
    }
    setLoading(false);
    if (!data.session) {
      showToast('Sign up successful! Check your email to confirm, then sign in.', 'success');
      closeModal('login');
      return;
    }
    if (expectedRole === 'shop_owner') switchMode('owner');
    showToast('Account created and signed in!', 'success');
    closeModal('login');
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
          <button className="btn-modal-outline" onClick={() => { setRole('select'); setAuthMode('login'); setEmail(''); setPassword(''); }}>
            BACK
          </button>
          <button
            className="btn-modal-solid"
            onClick={() => (authMode === 'login' ? signIn('customer') : signUp('customer'))}
            disabled={loading}
          >
            {loading ? 'PLEASE WAIT…' : authMode === 'login' ? 'SIGN IN →' : 'CREATE ACCOUNT →'}
          </button>
        </>
      )}
      {role === 'owner' && (
        <>
          <button className="btn-modal-outline" onClick={() => { setRole('select'); setAuthMode('login'); setEmail(''); setPassword(''); }}>
            BACK
          </button>
          <button
            className="btn-modal-solid"
            onClick={() => (authMode === 'login' ? signIn('shop_owner') : signUp('shop_owner'))}
            disabled={loading}
          >
            {loading ? 'PLEASE WAIT…' : authMode === 'login' ? 'SIGN IN →' : 'CREATE ACCOUNT →'}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: 'var(--lav-50)', border: 'var(--brd-lav)' }}>
            <span style={{ fontSize: '1rem' }}>🛍️</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--lav-700)' }}>
              {authMode === 'login' ? 'Customer Sign In' : 'Create a Customer Account'}
            </span>
          </div>
          <div className="form-g">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              className="f-inp"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (authMode === 'login' ? signIn('customer') : signUp('customer'))}
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
              onKeyDown={(e) => e.key === 'Enter' && (authMode === 'login' ? signIn('customer') : signUp('customer'))}
            />
          </div>
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--lav-700)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </>
      )}

      {role === 'owner' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: 'var(--lav-50)', border: 'var(--brd-lav)' }}>
            <span style={{ fontSize: '1rem' }}>🏪</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--lav-700)' }}>
              {authMode === 'login' ? 'Shop Owner Portal — Sign In' : 'Shop Owner Portal — Create Account'}
            </span>
          </div>
          <div className="form-g">
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              className="f-inp"
              placeholder="owner@shop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (authMode === 'login' ? signIn('shop_owner') : signUp('shop_owner'))}
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
              onKeyDown={(e) => e.key === 'Enter' && (authMode === 'login' ? signIn('shop_owner') : signUp('shop_owner'))}
            />
          </div>
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--lav-700)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {authMode === 'login' ? "Don't have a shop account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}