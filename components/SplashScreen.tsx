'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Phase 1: logo enters (1s), phase 2: hold (2.5s), phase 3: exit (0.8s)
    const t1 = setTimeout(() => setPhase('hold'), 1000);
    const t2 = setTimeout(() => setPhase('exit'), 3800);
    const t3 = setTimeout(() => onDone(), 4600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a0a12',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.8s ease-in-out' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Animated background blobs */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-20%',
        width: '60%', height: '60%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
        animation: 'blobPulse 4s ease-in-out infinite alternate',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%',
        width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
        animation: 'blobPulse 5s ease-in-out infinite alternate-reverse',
        borderRadius: '50%',
        filter: 'blur(50px)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: '15%',
        width: '200px', height: '200px',
        background: 'radial-gradient(circle, rgba(82,39,255,0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
      }} />



      {/* Logo — hero of the splash */}
      <div style={{
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'scale(0.7) translateY(30px)' : 'scale(1) translateY(0)',
        transition: 'opacity 0.7s ease 0.3s, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.3s',
        marginBottom: '20px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Glow ring */}
        <div style={{
          position: 'absolute', inset: '-18px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 70%)',
          animation: phase === 'hold' ? 'glowPulse 2.5s ease-in-out infinite' : 'none',
          filter: 'blur(12px)',
        }} />
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 48px rgba(124,58,237,0.5)' }}>
          <Image
            src="/logo.jpg"
            alt="nearbuy"
            width={130}
            height={130}
            style={{ objectFit: 'contain', display: 'block' }}
            priority
          />
          {/* Logo shimmer sweep */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: phase === 'hold' ? 'shimmer 2.5s ease-in-out infinite' : 'none',
          }} />
        </div>
      </div>

      {/* Tagline */}
      <p style={{
        color: 'rgba(255,255,255,0.45)',
        fontSize: '0.65rem',
        fontWeight: 800,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '48px',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.6s ease 0.7s',
      }}>
        LOCAL FINDS · CLOSER DAYS
      </p>

      {/* Tagline message */}
      <p style={{
        color: 'rgba(255,255,255,0.65)',
        fontSize: '1rem',
        fontWeight: 400,
        textAlign: 'center',
        maxWidth: '280px',
        lineHeight: 1.6,
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.6s ease 0.9s',
        marginBottom: '48px',
      }}>
        Everything you need<br />might already be near you.
      </p>

      {/* Moving cart progress bar */}
      <div style={{
        width: '200px',
        height: '3px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '99px',
        overflow: 'visible',
        position: 'relative',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.4s ease 1s',
      }}>
        {/* Track */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          height: '100%',
          background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
          borderRadius: '99px',
          animation: 'progressFill 2.8s ease forwards',
          animationDelay: '1s',
        }} />
        {/* Cart emoji on progress */}
        <div style={{
          position: 'absolute', top: '-10px',
          fontSize: '20px',
          animation: 'cartSlide 2.8s ease forwards',
          animationDelay: '1s',
        }}>
          🛒
        </div>
      </div>

      <style>{`
        @keyframes blobPulse {
          from { transform: scale(1) rotate(0deg); }
          to { transform: scale(1.15) rotate(10deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes cartSlide {
          from { left: -10px; }
          to { left: calc(100% - 10px); }
        }
      `}</style>
    </div>
  );
}
