'use client';

import { useEffect, useRef, useState } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';

const KEYWORDS: Record<string, string> = {
  chpdi: 'Notebook',
  chopdi: 'Notebook',
  pen: 'Pen',
  kitab: 'Notebook',
};

interface SpeechRecogResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecog {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: SpeechRecogResult[] }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export default function VoiceModal() {
  const { showToast, closeModal, quickSearch, lang } = useApp();
  const [listening, setListening] = useState(true);
  const [heard, setHeard] = useState('');
  const [error, setError] = useState(false);
  const [unsupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecog;
      webkitSpeechRecognition?: new () => SpeechRecog;
    };
    return !(w.SpeechRecognition ?? w.webkitSpeechRecognition);
  });
  const recRef = useRef<SpeechRecog | null>(null);

  const langNames: Record<string, string> = {
    'en-US': 'ENGLISH',
    'hi-IN': 'HINDI (हिंदी)',
    'gu-IN': 'GUJARATI (ગુજ.)',
  };

  useEffect(() => {
    if (unsupported) {
      showToast('Voice search requires Chrome or Edge', 'error');
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecog;
      webkitSpeechRecognition?: new () => SpeechRecog;
    };
    const SR = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as new () => SpeechRecog;
    const rec = new SR();
    recRef.current = rec;
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e) => {
      const results = e.results;
      const t = Array.from(results)
        .map((r) => r[0].transcript)
        .join(' ');
      setHeard(`"${t}"`);
      const lowerT = t.toLowerCase().trim();
      const mapped = KEYWORDS[lowerT];
      const finalText = mapped ?? t;
      const last = results[results.length - 1];
      if (last.isFinal) {
        setTimeout(() => {
          closeModal('voice');
          quickSearch(finalText);
        }, 500);
      }
    };
    rec.onerror = () => setError(true);
    rec.onend = () => setListening(false);
    rec.start();

    return () => {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    };
  }, [unsupported, lang, closeModal, quickSearch, showToast]);

  return (
    <Modal name="voice" title="VOICE SEARCH" width="voice">
      <div className="voice-modal-body">
        <div className="voice-viz">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div className="vbar" key={i} />
          ))}
        </div>
        <div className="voice-mic-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0014 0M12 19v4M8 23h8" />
          </svg>
        </div>
        <p className="voice-status-txt">{error || unsupported ? 'COULD NOT HEAR — TRY AGAIN' : listening ? 'LISTENING…' : 'DONE'}</p>
        <p className="voice-heard-txt">{heard}</p>
        <p className="voice-lang-txt">
          LANGUAGE: <span>{langNames[lang] ?? 'ENGLISH'}</span>
        </p>
      </div>
    </Modal>
  );
}