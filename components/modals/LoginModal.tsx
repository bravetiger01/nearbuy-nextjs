'use client';

import { useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

type Role = 'owner' | 'customer';
type AuthMode = 'login' | 'signup';

export default function LoginModal() {
  const { showToast, closeModal, supabase, switchMode, loginDemo } = useApp();
  const [role, setRole] = useState<Role>('owner');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    if (role === 'owner') {
      setEmail('admin@gmail.com');
      setPassword('admin123');
    } else {
      setEmail('customer@gmail.com');
      setPassword('customer123');
    }
  };

  const signIn = async (expectedRole: 'customer' | 'shop_owner') => {
    if (!email.trim() || !password.trim()) {
      showToast('Please enter email and password', 'error');
      return;
    }

    const emailNorm = email.trim().toLowerCase();
    const isDemoAdmin = (emailNorm === 'admin@gmail.com' || emailNorm === 'admin@demo.com') && password === 'admin123';
    const isDemoCustomer = (emailNorm === 'customer@gmail.com' || emailNorm === 'customer@demo.com') && password === 'customer123';


    if (!supabase) {
      // No supabase — use local demo mode for known demo accounts
      if (isDemoAdmin && expectedRole === 'shop_owner') {
        loginDemo('shop_owner'); switchMode('owner');
        showToast('Welcome! Shop Owner Dashboard loaded. (offline demo)', 'success');
        closeModal('login'); return;
      }
      if (isDemoCustomer && expectedRole === 'customer') {
        loginDemo('customer');
        showToast('Logged in as Customer! (offline demo)', 'success');
        closeModal('login'); return;
      }
      showToast('Supabase is not configured. Use demo credentials.', 'error');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailNorm,
      password,
    });

    if (error) {
      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = error as any;
      const errStatus = anyErr?.status ?? anyErr?.code_number;
      const errMessage = anyErr?.message ?? String(error);
      const errCode = anyErr?.code;
      console.error('[NearBuy] signInWithPassword error:', errStatus, errMessage, errCode, error);

      // Demo fallback if GoTrue schema error or any Supabase error for known demo accounts
      const isGoTrueDown = errStatus === 500 || errMessage.toLowerCase().includes('database error');
      if ((isGoTrueDown || true) && (isDemoAdmin || isDemoCustomer)) {
        const demoRole = isDemoAdmin ? 'shop_owner' : 'customer';
        if (demoRole !== expectedRole) {
          showToast(expectedRole === 'shop_owner' ? 'This account is not a Shop Owner' : 'This account is not a Customer account', 'error');
          return;
        }
        loginDemo(demoRole);
        if (expectedRole === 'shop_owner') switchMode('owner');
        showToast(expectedRole === 'shop_owner' ? 'Welcome! Shop Owner Dashboard loaded.' : 'Logged in as Customer!', 'success');
        closeModal('login'); return;
      }

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

    // Verify account role against intended role
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
      console.error('[NearBuy] signUp error:', error);
      showToast(error.message || 'Sign up failed', 'error');
      return;
    }
    if (data.user) {
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

  const isOwnerMode = role === 'owner';
  const currentExpectedRole = isOwnerMode ? 'shop_owner' : 'customer';

  const footer = (
    <>
      <button className="btn-modal-outline" onClick={() => closeModal('login')}>
        CANCEL
      </button>
      <button
        className="btn-modal-solid"
        onClick={() => (authMode === 'login' ? signIn(currentExpectedRole) : signUp(currentExpectedRole))}
        disabled={loading}
      >
        {loading ? 'PLEASE WAIT…' : authMode === 'login' ? 'SIGN IN →' : 'CREATE ACCOUNT →'}
      </button>
    </>
  );

  return (
    <Modal name="login" title="SIGN IN TO NEARBUY" footer={footer}>
      {/* Role Toggle Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => { setRole('owner'); setEmail(''); setPassword(''); }}
          style={{
            padding: '10px 14px',
            border: isOwnerMode ? '2px solid var(--black)' : '1px solid var(--gray-200)',
            background: isOwnerMode ? 'var(--black)' : 'var(--white)',
            color: isOwnerMode ? 'var(--white)' : 'var(--gray-700)',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: isOwnerMode ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🏪</span> SHOP OWNER
        </button>
        <button
          type="button"
          onClick={() => { setRole('customer'); setEmail(''); setPassword(''); }}
          style={{
            padding: '10px 14px',
            border: !isOwnerMode ? '2px solid var(--black)' : '1px solid var(--gray-200)',
            background: !isOwnerMode ? 'var(--black)' : 'var(--white)',
            color: !isOwnerMode ? 'var(--white)' : 'var(--gray-700)',
            fontWeight: 800,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: !isOwnerMode ? 'var(--shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🛍️</span> CUSTOMER
        </button>
      </div>

      {/* Role Title Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginBottom: 20,
          padding: '10px 14px',
          background: 'var(--lav-50)',
          border: 'var(--brd-lav)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.1rem' }}>{isOwnerMode ? '🏪' : '🛍️'}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--lav-700)' }}>
            {isOwnerMode
              ? authMode === 'login'
                ? 'Shop Owner Portal — Sign In'
                : 'Shop Owner Portal — Create Account'
              : authMode === 'login'
              ? 'Customer Account — Sign In'
              : 'Customer Account — Create Account'}
          </span>
        </div>
        <button
          type="button"
          onClick={fillDemo}
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'var(--lav-100)',
            color: 'var(--lav-700)',
            border: '1px solid var(--lav-200)',
            padding: '3px 8px',
            cursor: 'pointer',
            borderRadius: '2px',
          }}
          title="Fill demo credentials"
        >
          ⚡ Auto-Fill Demo
        </button>
      </div>

      {/* Email Input */}
      <div className="form-g">
        <label>EMAIL ADDRESS</label>
        <input
          type="email"
          className="f-inp"
          placeholder={isOwnerMode ? 'admin@gmail.com' : 'customer@gmail.com'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            (authMode === 'login' ? signIn(currentExpectedRole) : signUp(currentExpectedRole))
          }
          autoFocus
        />
      </div>

      {/* Password Input */}
      <div className="form-g" style={{ marginTop: 14 }}>
        <label>PASSWORD</label>
        <input
          type="password"
          className="f-inp"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            (authMode === 'login' ? signIn(currentExpectedRole) : signUp(currentExpectedRole))
          }
        />
      </div>

      {/* Helper text with demo credentials */}
      <div
        style={{
          marginTop: 12,
          padding: '8px 12px',
          background: 'var(--gray-50)',
          border: '1px dashed var(--gray-200)',
          fontSize: '0.74rem',
          color: 'var(--gray-500)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          Demo: <strong>{isOwnerMode ? 'admin@gmail.com' : 'customer@gmail.com'}</strong> /{' '}
          <code>{isOwnerMode ? 'admin123' : 'customer123'}</code>
        </span>
      </div>

      {/* Toggle between Login and Signup */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--lav-700)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {authMode === 'login'
            ? isOwnerMode
              ? "Don't have a shop account? Sign up"
              : "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </Modal>
  );
}