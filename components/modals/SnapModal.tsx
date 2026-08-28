'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';
import { SNAP_PRODUCTS } from '../../lib/data';
import type { SnapProduct } from '../../lib/types';

type Phase = 'upload' | 'camera' | 'analyzing' | 'result';

const STEPS = ['ANALYZING IMAGE…', 'DETECTING OBJECT EDGES…', 'MATCHING PRODUCT DB…', 'FINDING NEARBY STOCK…'];

export default function SnapModal() {
  const { showToast, closeModal, quickSearch, setReserveCtx, openModal } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>('upload');
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState<SnapProduct | null>(null);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => () => stopCamera(), []);

  const openCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        streamRef.current = stream;
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setPhase('camera');
          }
        }, 0);
      })
      .catch(() => showToast('Camera not accessible — try uploading a photo', 'error'));
  };

  const runSnapAI = () => {
    setPhase('analyzing');
    setStepIdx(0);
    const iv = setInterval(() => setStepIdx((i) => (i + 1) % STEPS.length), 600);
    setTimeout(() => {
      clearInterval(iv);
      setResult(SNAP_PRODUCTS[Math.floor(Math.random() * SNAP_PRODUCTS.length)]);
      setPhase('result');
    }, 2400);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    runSnapAI();
  };

  return (
    <Modal
      name="snap"
      title="SNAP & SEARCH"
      width="wide"
      onClose={() => stopCamera()}
    >
      {phase === 'upload' && (
        <div className="snap-drop-boxy">
          <div className="snap-icon-box">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <h3>TAKE OR UPLOAD A PHOTO</h3>
          <p>AI identifies the product and finds it nearby</p>
          <div className="snap-btns-row">
            <button className="btn-modal-solid" onClick={openCamera}>
              OPEN CAMERA
            </button>
            <button className="btn-modal-outline" onClick={() => document.getElementById('snapFileInp')?.click()}>
              UPLOAD PHOTO
            </button>
          </div>
          <input type="file" id="snapFileInp" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
        </div>
      )}

      {phase === 'camera' && (
        <div className="snap-camera-wrap">
          <video ref={videoRef} autoPlay playsInline className="snap-vid" />
          <button className="capture-boxy" onClick={() => runSnapAI()}>
            CAPTURE PHOTO
          </button>
        </div>
      )}

      {phase === 'analyzing' && (
        <div className="snap-analyzing-boxy">
          <div className="ai-scan-box">
            <div className="ai-scan-line" />
            <div className="ai-scan-line" style={{ animationDelay: '0.3s' }} />
            <div className="ai-scan-line" style={{ animationDelay: '0.6s' }} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
            </svg>
          </div>
          <p className="snap-status-txt">{STEPS[stepIdx]}</p>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="snap-result-boxy" style={{ padding: 20 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--lav-600)', marginBottom: 12, borderLeft: '3px solid var(--lav-500)', paddingLeft: 8 }}>
            AI IDENTIFIED PRODUCT
          </div>
          <div style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>{result.name}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 16 }}>{result.desc}</div>
          <div style={{ background: 'var(--lav-50)', border: 'var(--brd)', padding: 14, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontFamily: 'var(--display)' }}>{result.store}</div>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: 'var(--gray-500)', marginTop: 2 }}>
                {result.dist} AWAY · {result.stock} IN STOCK
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', background: 'var(--lav-500)', color: 'var(--white)', border: 'var(--brd)', padding: '3px 10px' }}>
              IN STOCK
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-modal-solid" style={{ flex: 1 }} onClick={() => { closeModal('snap'); quickSearch(result.name); }}>
              SEARCH NEARBY
            </button>
            <button className="btn-modal-outline" onClick={() => { closeModal('snap'); setReserveCtx({ storeId: 1, productName: result.name, price: 0, storeName: result.store }); setTimeout(() => openModal('reserve'), 50); }}>
              RESERVE
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}