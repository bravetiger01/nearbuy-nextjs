'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';

type Role = 'customer' | 'owner';
type AuthMode = 'login' | 'signup';

export default function LoginModal() {
  const { showToast, closeModal, supabase, switchMode, loginDemo } = useApp();
  // Role defaults to customer now
  const [role, setRole] = useState<Role>('customer');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputType, setInputType] = useState<'phone' | 'email'>('phone');

  const signIn = async () => {
    if (!supabase) {
      showToast('Supabase is not configured yet. Set up .env.local', 'error');
      return;
    }
    const identifier = inputType === 'phone' ? (phone.trim() ? `${phone}@demo.com` : '') : email.trim();
    const pass = password || 'customer123'; // Demo fallback password for phone OTP simulation
    
    if (!identifier) {
      showToast('Please enter your details', 'error');
      return;
    }
    
    setLoading(true);
    // Simulate OTP / actual sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier.toLowerCase(),
      password: pass,
    });
    if (error) {
      setLoading(false);
      // Demo fallback
      const anyErr = error as any;
      const errStatus = anyErr?.status ?? anyErr?.code_number;
      const errMessage = anyErr?.message ?? String(error);
      const isGoTrueDown = errStatus === 500 || errMessage.toLowerCase().includes('database error');
      
      const emailNorm = identifier.toLowerCase();
      const isDemoAdmin = emailNorm === 'admin@demo.com' || emailNorm === 'admin@gmail.com';
      const isDemoCustomer = emailNorm === 'customer@demo.com' || emailNorm === 'customer@gmail.com' || inputType === 'phone';

      if (isGoTrueDown || isDemoCustomer || isDemoAdmin) {
        const demoRole = role === 'owner' ? 'shop_owner' : 'customer';
        loginDemo(demoRole);
        if (demoRole === 'shop_owner') switchMode('owner');
        showToast(
          demoRole === 'shop_owner'
            ? 'Welcome! Shop Owner Dashboard loaded.'
            : 'Logged in as Customer!',
          'success'
        );
        closeModal('login');
        return;
      }

      showToast('Login failed', 'error');
      return;
    }
    
    setLoading(false);
    if (role === 'owner') {
      switchMode('owner');
      showToast('Welcome back! Shop Owner Dashboard loaded.', 'success');
    } else {
      showToast('Logged in as Customer!', 'success');
    }
    closeModal('login');
  };

  const handleRoleSwitch = () => {
    setRole(role === 'customer' ? 'owner' : 'customer');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: '#f5efe6', zIndex: 9999, overflowY: 'auto',
      fontFamily: 'monospace', color: '#000', display: 'flex', flexDirection: 'column'
    }}>
      {/* Top Black Bar */}
      <div style={{ backgroundColor: '#111', color: '#fff', fontSize: '0.7rem', padding: '4px 10px', display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase' }}>
        <div style={{display: 'flex', gap: 10}}>
          <span style={{color: '#999'}}>■ SYS ONLINE // 15-MIN MESH ACTIVE</span>
        </div>
        <div style={{display: 'flex', gap: 10}}>
          <span>PIN [868801]</span>
          <span style={{color: '#ff3366'}}>:: LATENCY 8MS</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/brand/nearbuy_logo.jpg" alt="NEARBUY" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.2rem', lineHeight: 1 }}>NEARBUY // SYS</div>
            <div style={{ fontSize: '0.6rem', color: '#666', marginTop: 2 }}>HYPERLOCAL COMMERCE PROTOCOL</div>
          </div>
        </div>
        <button 
          onClick={() => closeModal('login')}
          style={{ border: '3px solid #000', padding: '6px 12px', background: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}
        >
          CLOSE [X]
        </button>
      </div>

      {/* Sub header role switcher */}
      <div style={{ backgroundColor: '#c8b6ff', padding: '8px 20px', borderBottom: '4px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
        <span>[ ROLE: {role === 'customer' ? 'CUSTOMER / SHOPPER' : 'MERCHANT / SHOP OWNER'} ]</span>
        <span 
          onClick={handleRoleSwitch}
          style={{ color: '#d92662', textDecoration: 'underline', cursor: 'pointer' }}
        >
          SWITCH TO {role === 'customer' ? 'MERCHANT / RIDER' : 'CUSTOMER'} -{'>'}
        </span>
      </div>

      <div style={{ padding: '0px', maxWidth: 600, margin: '0 auto', width: '100%', boxSizing: 'border-box', paddingBottom: 40 }}>
        
        {role === 'customer' ? (
          <div style={{ padding: '20px' }}>
            {/* Terminal Box */}
            <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: 20, boxShadow: '6px 6px 0px #000', marginBottom: 20, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -14, left: 16, display: 'flex', gap: 10 }}>
                <div style={{ backgroundColor: '#111', color: '#fff', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 800 }}>
                  <span style={{color: '#9b82ff'}}>■</span> SHOPPER ACCESS TERMINAL
                </div>
                <div style={{ backgroundColor: '#d92662', color: '#fff', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 800 }}>
                  [ HOLD ESCROW ACTIVE ]
                </div>
              </div>

              <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, margin: '20px 0 10px 0', letterSpacing: '-1px' }}>
                GET IT NEARBY<br/>
                <span style={{ backgroundColor: '#ffd6e0', padding: '0 10px', display: 'inline-block', border: '3px solid #000', color: '#d92662', marginTop: 10 }}>
                  IN 15 MINS
                </span>
              </h1>
              
              <p style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5, marginTop: 15 }}>
                <span style={{fontWeight: 800}}>Zero-latency</span> hyper-local discovery, live verified shelf stocks, and 10% reserve guarantee at your neighborhood storefronts.
              </p>
            </div>

            {/* Auth Box */}
            <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: 20, boxShadow: '6px 6px 0px #000' }}>
              
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button 
                  onClick={() => setAuthMode('login')}
                  style={{ flex: 1, padding: '12px', border: '3px solid #000', backgroundColor: authMode === 'login' ? '#9b82ff' : '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                  [ LOGIN ]
                </button>
                <button 
                  onClick={() => setAuthMode('signup')}
                  style={{ flex: 1, padding: '12px', border: '3px solid #000', backgroundColor: authMode === 'signup' ? '#9b82ff' : '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                  [ SIGN UP ]
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, marginBottom: 10, textTransform: 'uppercase' }}>
                <span>Auth Identifier:</span>
                <span>
                  <span 
                    onClick={() => setInputType('phone')}
                    style={{ color: inputType === 'phone' ? '#d92662' : '#000', textDecoration: inputType === 'phone' ? 'underline' : 'none', cursor: 'pointer' }}
                  >PHONE</span> // <span 
                    onClick={() => setInputType('email')}
                    style={{ color: inputType === 'email' ? '#d92662' : '#000', textDecoration: inputType === 'email' ? 'underline' : 'none', cursor: 'pointer' }}
                  >EMAIL</span>
                </span>
              </div>

              {inputType === 'phone' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, marginBottom: 5 }}>
                    <span>REGISTERED MOBILE NUMBER</span>
                    <span style={{ color: '#d92662' }}>[ OTP READY ]</span>
                  </div>
                  <div style={{ display: 'flex', gap: 0, marginBottom: 10 }}>
                    <div style={{ backgroundColor: '#9b82ff', border: '3px solid #000', borderRight: 'none', padding: '12px', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                      +91-
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter 10-digit mobile" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{ flex: 1, border: '3px solid #000', padding: '12px', outline: 'none', fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', width: '100%', minWidth: 0 }} 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, marginBottom: 5 }}>
                    <span>REGISTERED EMAIL</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', border: '3px solid #000', padding: '12px', outline: 'none', fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', marginBottom: 10 }} 
                    />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      style={{ width: '100%', boxSizing: 'border-box', border: '3px solid #000', padding: '12px', outline: 'none', fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace' }} 
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: '0.7rem', color: '#666' }}>* 6-digit handshake token dispatched</span>
                <button style={{ border: '2px solid #000', background: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '4px 8px', cursor: 'pointer', boxShadow: '2px 2px 0px #000' }}>
                  [ + USE CURRENT SIM ]
                </button>
              </div>

              <button 
                onClick={signIn}
                disabled={loading}
                style={{ width: '100%', backgroundColor: '#9b82ff', color: '#000', border: '4px solid #000', padding: '15px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', boxShadow: '4px 4px 0px #000', marginBottom: 20 }}
              >
                {loading ? 'PROCESSING...' : '⚡ DISPATCH ACCESS OTP ->'}
              </button>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: '#9b82ff', marginTop: 2 }} />
                <span>Auto-bind 10% Local Escrow Ledger & Accept 15-Minute Mesh Order Dispatch Rules.</span>
              </label>

              <div style={{ textAlign: 'center', position: 'relative', margin: '20px 0', fontSize: '0.8rem', fontWeight: 800 }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: '#000', zIndex: 1 }}></div>
                <span style={{ backgroundColor: '#fff', padding: '0 10px', position: 'relative', zIndex: 2 }}>// OR FAST HANDSHAKE //</span>
              </div>

              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <button style={{ flex: 1, padding: '12px', border: '3px solid #000', backgroundColor: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>
                  G [ GOOGLE ]
                </button>
                <button style={{ flex: 1, padding: '12px', border: '3px solid #000', backgroundColor: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '3px 3px 0px #000' }}>
                  @ [ PASSKEY ]
                </button>
              </div>

              <div style={{ border: '2px dashed #000', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 800, marginBottom: 20 }}>
                <span style={{color: '#d92662'}}>🎟️ HAVE A NEIGHBOR REFERRAL?</span>
                <span style={{ cursor: 'pointer' }}>[+ ENTER]</span>
              </div>

              <div style={{ backgroundColor: '#d92662', border: '3px solid #000', padding: '15px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎁</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>NEW SHOPPER BONUS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>₹100 ESCROW CREDIT</div>
                  </div>
                </div>
                <div style={{ border: '2px solid #fff', backgroundColor: '#111', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 800 }}>
                  AUTO-APPLIED
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#9b82ff', border: '3px solid #000', padding: '8px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', gap: 10, margin: '20px 0', textTransform: 'uppercase' }}>
              <span>LIVE STORES READY:</span>
              <span>#01 APEX PHARMACY [350M // VERIFIED]</span>
            </div>

            <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', backgroundColor: '#fff', border: '4px solid #000', padding: 15, boxShadow: '4px 4px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#9b82ff', fontSize: '1.2rem' }}>🔒</span>
                  <span style={{ backgroundColor: '#c8b6ff', border: '2px solid #000', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 800 }}>PLEDGE</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 10px 0' }}>10% ESCROW<br/>HOLD</h3>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#555', marginBottom: 20 }}>
                  Secure offline items for 45 mins with 10% pledge. Balance settled at store pick or drop.
                </p>
                <div style={{ borderTop: '2px solid #000', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#d92662' }}>
                  <span>[ GUARANTEED ]</span>
                  <span>🛡️</span>
                </div>
              </div>

              <div style={{ flex: '1 1 200px', backgroundColor: '#fff', border: '4px solid #000', padding: 15, boxShadow: '4px 4px 0px #000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#9b82ff', fontSize: '1.2rem' }}>⚡</span>
                  <span style={{ backgroundColor: '#c8b6ff', border: '2px solid #000', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 800 }}>{'<'} 500M</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1.2, margin: '0 0 10px 0' }}>15-MIN FLEET<br/>RUN</h3>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#555', marginBottom: 20 }}>
                  Runners stationed immediately adjacent to local merchant doors. Direct transit.
                </p>
                <div style={{ borderTop: '2px solid #000', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#d92662' }}>
                  <span>[ ACTIVE RADAR ]</span>
                  <span>🎯</span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 40, fontSize: '0.7rem', fontWeight: 600, color: '#555' }}>
              <div style={{ fontWeight: 800, color: '#000', marginBottom: 10 }}>🛡️ SHA-256 ZERO KNOWLEDGE HANDSHAKE</div>
              <p style={{ maxWidth: 400, margin: '0 auto 10px auto' }}>
                NearBuy Protocol operates under Local Commerce Escrow Rules 2025. P2P merchant holds are collateral-backed in real-time.
              </p>
              <div style={{ color: '#999', fontSize: '0.6rem', textTransform: 'uppercase' }}>NEARBUY // SYS-ID: BLR-680001-CUST-AUTH-NODE</div>
            </div>
          </div>
        ) : (
          <div>
            {/* Network Stats */}
            <div style={{ backgroundColor: '#c8b6ff', padding: '8px 20px', borderBottom: '4px solid #000', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
              // NETWORK STAT: 8,000 SHOPS CURRENTLY BROADCASTING LIVE
            </div>

            <div style={{ padding: '20px' }}>
              {/* Hero Section Box */}
              <div style={{ border: '4px solid #000', backgroundColor: '#f5efe6', padding: 20 }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                  <span style={{ backgroundColor: '#111', color: '#fff', padding: '4px 8px', fontSize: '0.65rem', fontWeight: 800 }}>[ ROLE: VERIFIED MERCHANT & STORE OWNER ]</span>
                  <span style={{ backgroundColor: '#d92662', color: '#fff', padding: '4px 8px', fontSize: '0.65rem', fontWeight: 800 }}>[ B2B-SECURE ]</span>
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, margin: '0 0 10px 0', letterSpacing: '-1px' }}>
                  SYNC YOUR SHELF.<br/>
                  <span style={{ backgroundColor: '#c8b6ff', display: 'inline-block', marginTop: 5, padding: '0 5px' }}>SELL TO YOUR</span><br/>
                  <span style={{ backgroundColor: '#c8b6ff', display: 'inline-block', padding: '0 5px' }}>PINCODE.</span>
                </h1>
                
                <p style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4, margin: '15px 0' }}>
                  Connect your POS, scan paper bills with AI in 30 seconds, and unlock 10% instant reserve INR deposits from neighborhood shoppers.
                </p>

                <div style={{ borderTop: '2px solid #000', margin: '15px 0' }}></div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, border: '2px solid #000', backgroundColor: '#fff', padding: '10px 5px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#d92662', marginBottom: 5 }}>[ ZERO<br/>COMMISSION ]</div>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#555' }}>ON PICKUP<br/>ORDERS</div>
                  </div>
                  <div style={{ flex: 1, border: '2px solid #000', backgroundColor: '#fff', padding: '10px 5px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#9b82ff', marginBottom: 5 }}>[ INSTANT<br/>UPI PAYOUT ]</div>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#555' }}>DIRECT TO QR/VPA</div>
                  </div>
                  <div style={{ flex: 1, border: '2px solid #000', backgroundColor: '#fff', padding: '10px 5px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 5 }}>[ ADD<br/>INVENTORY<br/>FASTER ]</div>
                    <div style={{ fontSize: '0.55rem', fontWeight: 700, color: '#555' }}>VIA CAMERA SCAN</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
                <button style={{ flex: 1, padding: '12px', border: '3px solid #000', backgroundColor: '#c8b6ff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span>⌨️</span> [ TERMINAL LOGIN ]
                </button>
                <button style={{ flex: 1, padding: '12px', border: '3px solid #000', backgroundColor: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <span>🏬</span> [ REGISTER STORE ]
                </button>
              </div>

              {/* Form Box */}
              <div style={{ border: '4px solid #000', backgroundColor: '#fff', padding: 15, marginTop: 10, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 800, marginBottom: 15 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, backgroundColor: '#00cc66' }}></div>
                    TERMINAL STANDBY: ENTER MERCHANT CREDENTIALS V.8.2
                  </span>
                  <span style={{ color: '#d92662' }}>[SYS_RDY]</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, marginBottom: 5 }}>
                  <span>MOBILE NO. / TERMINAL ID *</span>
                  <span style={{ color: '#9b82ff' }}>[AUTH_PRIMARY]</span>
                </div>
                <div style={{ display: 'flex', border: '3px solid #000', marginBottom: 5 }}>
                  <div style={{ backgroundColor: '#c8b6ff', borderRight: '3px solid #000', padding: '12px', fontWeight: 800, display: 'flex', alignItems: 'center' }}>
                    +91
                  </div>
                  <input 
                    type="text" 
                    placeholder="98765 43210" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ flex: 1, border: 'none', padding: '12px', outline: 'none', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace', width: '100%', minWidth: 0, backgroundColor: '#f5efe6' }} 
                  />
                  <div style={{ padding: '12px', borderLeft: '3px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#f5efe6' }}>
                    ⛶
                  </div>
                </div>
                <div style={{ fontSize: '0.6rem', color: '#555', fontWeight: 700, textTransform: 'uppercase', marginBottom: 15 }}>
                  INSERT 6-DIGIT OTP WILL ROUTE TO STORE MANAGER DEVICE
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, marginBottom: 5 }}>
                  <span>GSTIN / TRADE LICENSE / FSSAI (OPTIONAL)</span>
                  <span style={{ color: '#00cc66' }}>[INSTANT_KYC]</span>
                </div>
                <div style={{ display: 'flex', border: '3px solid #000', marginBottom: 5, backgroundColor: '#f5efe6' }}>
                  <input 
                    type="text" 
                    placeholder="27AAAAA0000A1Z5" 
                    style={{ flex: 1, border: 'none', padding: '12px', outline: 'none', fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace', width: '100%', minWidth: 0, backgroundColor: 'transparent', color: '#888' }} 
                  />
                  <button style={{ backgroundColor: '#c8b6ff', borderLeft: '3px solid #000', border: 'none', padding: '0 15px', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer', borderLeftStyle: 'solid', borderLeftWidth: 3, borderLeftColor: '#000' }}>
                    AUTO-VERIFY
                  </button>
                </div>
                <div style={{ fontSize: '0.6rem', color: '#555', fontWeight: 700, textTransform: 'uppercase', marginBottom: 15 }}>
                  SKIP FOR UNVERIFIED STORES (MAX ₹500 TICKET NO PAYOUT)
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginBottom: 15, backgroundColor: '#f5efe6', padding: 10, border: '2px solid #000' }}>
                  <input type="checkbox" defaultChecked style={{ width: 16, height: 16, accentColor: '#c8b6ff', marginTop: 2 }} />
                  <span>I confirm operational control of this storefront. Authorize NearBuy POS Protocol to fetch local catalog metadata.</span>
                </label>

                <button 
                  onClick={signIn}
                  disabled={loading}
                  style={{ width: '100%', backgroundColor: '#d92662', color: '#fff', border: '3px solid #000', padding: '15px', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '4px 4px 0px #000', marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>[ {loading ? 'PROCESSING...' : 'SEND MERCHANT AUTH OTP'} ]</span>
                  <span>{'>'}</span>
                </button>

                <button style={{ width: '100%', backgroundColor: '#fff', color: '#000', border: '3px solid #000', padding: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '2px 2px 0px #000', marginBottom: 15, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.2rem' }}>⍙</span> [ SYNC POS TERMINAL / QR SCAN ]
                </button>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: 800, borderTop: '2px dashed #000', paddingTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, backgroundColor: '#00cc66', borderRadius: '50%' }}></div>
                    <span style={{ color: '#00cc66' }}>POS CONNECTION: ONLINE<br/>[SECURE]</span>
                  </div>
                  <div style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    TERMINAL<br/>RECOVERY?
                  </div>
                </div>
              </div>

              {/* Capabilities Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: '1.1rem' }}>
                  <span style={{ color: '#d92662' }}>⚡</span> MERCHANT ENGINE CORE
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#555' }}>[SYS_CAPABILITIES]</div>
              </div>

              {/* Capability 1 */}
              <div style={{ border: '3px solid #000', backgroundColor: '#f5efe6', padding: 15, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ backgroundColor: '#d92662', color: '#fff', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem' }}>01</div>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>AI BILL SCANNER</div>
                  </div>
                  <div style={{ backgroundColor: '#c8b6ff', border: '2px solid #000', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 800 }}>30 SEC INGEST</div>
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: 15, lineHeight: 1.4 }}>
                  Turn paper distributor bills and GST invoices into live in-stock app items in under 30 seconds. Zero manual entry. Supports thermal & A4 invoices.
                </p>
                <div style={{ border: '2px solid #000', backgroundColor: '#fff', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.7rem', fontWeight: 800 }}>
                    <span style={{ fontSize: '1.2rem', color: '#9b82ff' }}>📄</span>
                    <div>
                      <div>PARSING:</div>
                      <div>GST_INV_4099.PDF</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00cc66', textAlign: 'right' }}>
                    <div>● 45 ITEMS</div>
                    <div>MATCHED</div>
                  </div>
                </div>
              </div>

              {/* Capability 2 */}
              <div style={{ border: '3px solid #000', backgroundColor: '#f5efe6', padding: 15, marginBottom: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ backgroundColor: '#9b82ff', color: '#fff', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem' }}>02</div>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>INSTANT CASHOUTS</div>
                  </div>
                  <div style={{ backgroundColor: '#d92662', color: '#fff', border: '2px solid #000', padding: '2px 8px', fontSize: '0.6rem', fontWeight: 800 }}>T-0 REALTIME</div>
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: 15, lineHeight: 1.4 }}>
                  Every customer reserve fee & store pickup checkout settles immediately to your registered merchant UPI / IMPS. T+0 realtime settlements.
                </p>
                <div style={{ border: '2px solid #000', backgroundColor: '#fff', padding: '10px', fontSize: '0.7rem', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                  <span>MERCHANT VPA: paji@merchantpos</span>
                  <span style={{ color: '#d92662' }}>0.00% MDR FEE</span>
                </div>
              </div>

              {/* Onboarding Checklist */}
              <div style={{ border: '3px solid #000', backgroundColor: '#c8b6ff', padding: 15, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '1.5rem' }}>☑️</span>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>ONBOARDING<br/>CHECKLIST</div>
                  </div>
                  <div style={{ backgroundColor: '#f5efe6', border: '2px solid #000', padding: '4px 8px', fontSize: '0.65rem', fontWeight: 800 }}>3 ITEMS<br/>ONLY</div>
                </div>
                
                <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 15 }}>
                  Have these 3 documents handy for 5-minute merchant activation after OTP login:
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ backgroundColor: '#fff', border: '2px solid #000', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', fontWeight: 800 }}>
                      <div style={{ backgroundColor: '#111', color: '#fff', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</div>
                      GSTIN or FSSAI License
                    </div>
                    <span style={{ color: '#00cc66', fontSize: '0.65rem', fontWeight: 800 }}>[PDF/JPG]</span>
                  </div>
                  <div style={{ backgroundColor: '#fff', border: '2px solid #000', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', fontWeight: 800 }}>
                      <div style={{ backgroundColor: '#111', color: '#fff', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</div>
                      Cancelled Cheque / Passbook
                    </div>
                    <span style={{ color: '#00cc66', fontSize: '0.65rem', fontWeight: 800 }}>[UPI/NEFT]</span>
                  </div>
                  <div style={{ backgroundColor: '#fff', border: '2px solid #000', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', fontWeight: 800 }}>
                      <div style={{ backgroundColor: '#111', color: '#fff', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</div>
                      Storefront & Shelf Photo
                    </div>
                    <span style={{ color: '#00cc66', fontSize: '0.65rem', fontWeight: 800 }}>[CAM_SNAP]</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ border: '3px solid #000', backgroundColor: '#f5efe6', padding: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#555', lineHeight: 1.2 }}>
                    MERCHANT ONBOARDING<br/>HELPLINE
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#d92662', lineHeight: 1.2 }}>
                    LIVE 08:00 -<br/>22:00
                  </div>
                </div>
                <div style={{ backgroundColor: '#fff', border: '3px solid #000', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 900, fontSize: '1.2rem' }}>
                    <span>🎧</span> 1800-NEARBUY-OPS
                  </div>
                  <div style={{ backgroundColor: '#c8b6ff', border: '2px solid #000', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 800 }}>TOLL FREE</div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', fontWeight: 800, marginBottom: 15 }}>
                  <span>LANGUAGE SUPPORT:</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <span style={{ backgroundColor: '#111', color: '#fff', border: '2px solid #000', padding: '2px 6px' }}>EN</span>
                    <span style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000', padding: '2px 6px' }}>हिन्दी</span>
                    <span style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000', padding: '2px 6px' }}>ಕನ್ನಡ</span>
                    <span style={{ backgroundColor: '#fff', color: '#000', border: '2px solid #000', padding: '2px 6px' }}>मराठी</span>
                  </div>
                </div>
                
                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#555', display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: '1rem' }}>ⓘ</span>
                  <p style={{ margin: 0 }}>
                    NEARBUY CATALOG ENCRYPTION PROTOCOL: P-2-P ROUTING LOCAL TRAFFIC. NO PROPRIETARY INVENTORY LEAK TO AGGREGATORS.<br/><br/>
                    <span style={{ textAlign: 'center', display: 'block', width: '100%', marginTop: 5 }}>NEARBUY LOCAL COMMERCE PROTOCOL // SYS_RELEASE_2026.04.02</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}