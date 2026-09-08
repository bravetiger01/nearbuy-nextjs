'use client';

import { useState } from 'react';
import { useApp } from '../../lib/store-context';
import { LockIcon, FingerprintIcon, BarcodeIcon, BadgeIcon, GeoUpIcon } from '../../lib/icons';
import Image from 'next/image';

export default function RiderLogin() {
  const { loginRider, switchMode, showToast } = useApp();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    if (phone.length < 10) {
      showToast('Please enter a valid 10-digit number');
      return;
    }
    if (pin.length < 4) {
      showToast('Please enter your 4-digit PIN');
      return;
    }
    showToast('OTP verified. Welcome Runner!');
    loginRider();
  };



  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        backgroundColor: '#f5f0e6',
        color: '#000',
        fontFamily: 'monospace',
        position: 'relative',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderBottom: '4px solid #000',
          backgroundColor: '#f5f0e6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800 }}>
          <Image src="/logo.jpg" alt="Logo" width={24} height={24} style={{ mixBlendMode: 'multiply' }} />
          NEARBUY // SYS
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem', fontWeight: 800 }}>
          <div style={{ backgroundColor: '#9b8fe3', border: '2px solid #000', padding: '4px 8px' }}>
            [ FLEET_PORTAL ]
          </div>
          <div style={{ backgroundColor: '#fff', border: '2px solid #000', padding: '4px 8px' }}>
            ROLE [::]
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', paddingBottom: '200px', overflowX: 'hidden' }}>
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Hero Banner */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '6px 8px', fontSize: '0.75rem', fontWeight: 700, width: 'fit-content' }}>
              [ ROLE: HYPERLOCAL COURIER RUNNER ] GRID // BLR-01
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1, margin: 0 }}>
              RIDE YOUR HOOD.<br/>GET PAID PER DROP.
            </h1>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, opacity: 0.8 }}>
              Zero surge commissions, 15-min sub-2km short runs, and instant UPI cashouts after every completed handover.
            </p>
            <div style={{ backgroundColor: '#d92662', color: '#fff', border: '4px solid #000', boxShadow: '4px 4px 0px #000', padding: '10px', fontWeight: 800, fontSize: '0.75rem' }}>
              ₹500 JOINING BONUS ON FIRST 10 RUNS TODAY [ACTIVE]
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginTop: 10, flexWrap: 'wrap' }}>
            <button style={{ flex: 1, minWidth: '140px', backgroundColor: '#9b8fe3', border: '4px solid #000', boxShadow: '4px 4px 0px #000', padding: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>
              [ RUNNER LOGIN ]
            </button>
            <button style={{ flex: 1, minWidth: '140px', backgroundColor: '#fff', border: '4px solid #000', padding: '12px', fontWeight: 800, cursor: 'pointer', boxShadow: '4px 4px 0px #000', fontSize: '0.85rem' }}>
              [ APPLY TO FLEET ]
            </button>
          </div>

          {/* Auth Form */}
          <div style={{ border: '4px solid #000', backgroundColor: '#fff', boxShadow: '6px 6px 0px #000', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px solid #000', paddingBottom: '12px', alignItems: 'center' }}>
              <div style={{ width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/logo.jpg" alt="NEARBUY" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
              </div>
              <div style={{ fontWeight: 800 }}>DISPATCH BEACON<br/>AUTHENTICATION</div>
              <div style={{ backgroundColor: '#9b8fe3', border: '2px solid #000', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 800 }}>
                2FA // REQ
              </div>
            </div>

            {/* Mobile Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                <span>RIDER MOBILE NUMBER // -01</span>
                <span>[ AUTO-DETECT ]</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ border: '4px solid #000', backgroundColor: '#f5f0e6', padding: '10px', fontWeight: 800 }}>+91</div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  style={{ flex: 1, border: '4px solid #000', padding: '10px', fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', outline: 'none', width: '100%' }}
                />
              </div>
            </div>

            {/* PIN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LockIcon size={12} /> RUNNER BADGE PIN (ON-BIKE PASS)</span>
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>FORGOT PIN?</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="pin-input"
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  style={{ 
                    flex: 1, 
                    border: '4px solid #000', 
                    height: '50px', 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    fontWeight: 900, 
                    fontFamily: 'monospace', 
                    outline: 'none',
                    letterSpacing: '0.5em',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <button 
              onClick={handleLogin}
              style={{ backgroundColor: '#d92662', color: '#fff', border: '4px solid #000', boxShadow: '4px 4px 0px #000', padding: '16px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}
            >
              [ PING FLEET DISPATCH & SEND OTP -{'>'} ]
            </button>
            
            <button 
              onClick={handleLogin}
              style={{ backgroundColor: '#9b8fe3', color: '#000', border: '4px solid #000', boxShadow: '4px 4px 0px #000', padding: '12px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}
            >
              <FingerprintIcon size={16} /> QUICK BIOMETRIC THUMBPRINT / FACE SCAN
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, opacity: 0.7 }}>
              // GLOVE & HELMET FRIENDLY PASSKEY VERIFICATION
            </div>
          </div>

          {/* Specs & Criteria */}
          <div style={{ border: '4px solid #000', backgroundColor: '#fff', boxShadow: '6px 6px 0px #000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#000', color: '#fff', padding: '8px', fontWeight: 800, fontSize: '0.8rem' }}>
              <span>METRIC // RUNNER SPECIFICATIONS</span>
              <span style={{ backgroundColor: '#d92662', padding: '2px 6px', border: '1px solid #fff' }}>LIVE INDEX</span>
            </div>
            <div style={{ display: 'flex', borderBottom: '4px solid #000', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 50%', minWidth: '150px', padding: '12px', borderRight: '4px solid #000', boxSizing: 'border-box' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>AVG. PAY PER RUN</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>₹45 - ₹90</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>[ 15-min sub-2km drops ]</div>
              </div>
              <div style={{ flex: '1 1 50%', minWidth: '150px', padding: '12px', boxSizing: 'border-box' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>SETTLEMENT VELOCITY</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#d92662' }}>INSTANT UPI</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.7 }}>[ Auto cashout per drop ]</div>
              </div>
            </div>
            
            <div style={{ padding: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
              <div style={{ marginBottom: 10 }}>MANDATORY ON-BOARDING CRITERIA:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 8, height: 8, backgroundColor: '#d92662', marginTop: 4 }}></div>
                  <span>Valid Driving License & Aadhaar Card</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 8, height: 8, backgroundColor: '#d92662', marginTop: 4 }}></div>
                  <span>Two-wheeler EV / Petrol Scooter or Cargo Pedal Cycle</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 8, height: 8, backgroundColor: '#d92662', marginTop: 4 }}></div>
                  <span>Smartphone running Android 10+ / GPS high-accuracy chip</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 8, height: 8, backgroundColor: '#d92662', marginTop: 4 }}></div>
                  <span>100% direct customer tip retention (Zero fee cut)</span>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#000', color: '#fff', padding: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.75rem' }}>
              <span>FLEET KIT INCLUDED</span>
              <span>BAG + RADAR BADGE</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Actions */}
      <footer
        style={{
          backgroundColor: '#fff',
          borderTop: '4px solid #000',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '2px solid #000', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>NOT A RIDER?</div>
          <button 
            onClick={() => switchMode('customer')}
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 800, textDecoration: 'underline', padding: 0 }}
          >
            [ CUSTOMER / SHOP LOGIN {'>'} ]
          </button>
        </div>
        
        <div style={{ display: 'flex', padding: '8px 16px', gap: '12px', alignItems: 'center', borderBottom: '4px solid #000', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>VOICE HUD:</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <span style={{ border: '2px solid #000', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800 }}>ENG</span>
            <span style={{ border: '2px solid #000', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#000', color: '#fff' }}>KAN</span>
            <span style={{ border: '2px solid #000', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800 }}>HIN</span>
          </div>
          <div style={{ marginLeft: 'auto' }}><BarcodeIcon size={20} /></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', backgroundColor: '#d92662', padding: '10px 16px', color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>
          <span>EMERGENCY SOS:</span>
          <span style={{ backgroundColor: '#000', padding: '2px 6px' }}>DISPATCH HOTLINE [24/7]</span>
        </div>
        
        <div style={{ backgroundColor: '#f5f0e6', padding: '6px', textAlign: 'center', fontSize: '0.6rem', fontWeight: 700, opacity: 0.6 }}>
          LATENCY: 12MS // BLUETOOTH BEACON ACTIVE // SECURE FLEET V4
        </div>
      </footer>
    </div>
  );
}
