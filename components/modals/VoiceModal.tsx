'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Modal from '../Modal';
import { useApp } from '../../lib/store-context';
import { parseMultilingualQuery, LANGUAGE_TEST_PHRASES, type TranslationMatch } from '../../lib/multilingual';

interface SpeechRecogResult {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecog {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: SpeechRecogResult[] }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export default function VoiceModal() {
  const { closeModal, quickSearch, lang, setLang } = useApp();
  const [listening, setListening] = useState(true);
  const [heard, setHeard] = useState('');
  const [detectedTranslation, setDetectedTranslation] = useState<TranslationMatch | null>(null);
  const [error, setError] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [unsupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecog;
      webkitSpeechRecognition?: new () => SpeechRecog;
    };
    return !(w.SpeechRecognition ?? w.webkitSpeechRecognition);
  });
  const recRef = useRef<SpeechRecog | null>(null);

  const langOptions = [
    { code: 'gu-IN', label: 'ગુજરાતી', short: 'GU', badge: 'Gujarati' },
    { code: 'hi-IN', label: 'हिंदी', short: 'HI', badge: 'Hindi' },
    { code: 'en-US', label: 'English', short: 'EN', badge: 'English' },
  ];

  const handleVoiceCompleted = useCallback(
    (transcript: string) => {
      const clean = transcript.trim();
      if (!clean) return;

      const translation = parseMultilingualQuery(clean, lang);
      if (translation) {
        setDetectedTranslation(translation);
      }

      setListening(false);

      // Transition smoothly into search and trigger voice readout
      setTimeout(() => {
        closeModal('voice');
        quickSearch(clean, { isVoice: true, autoSpeak: true });
      }, 700);
    },
    [closeModal, quickSearch, lang]
  );

  const restartRecognition = useCallback(
    (langCode: string) => {
      if (unsupported) return;
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }

      const w = window as unknown as {
        SpeechRecognition?: new () => SpeechRecog;
        webkitSpeechRecognition?: new () => SpeechRecog;
      };
      const SR = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as new () => SpeechRecog;
      const rec = new SR();
      recRef.current = rec;
      rec.lang = langCode;
      rec.continuous = false;
      rec.interimResults = true;

      setListening(true);
      setError(false);
      setHeard('');
      setDetectedTranslation(null);

      rec.onresult = (e) => {
        const results = e.results;
        const t = Array.from(results)
          .map((r) => r[0].transcript)
          .join(' ');
        setHeard(`"${t}"`);

        const trans = parseMultilingualQuery(t, langCode);
        if (trans) {
          setDetectedTranslation(trans);
        }

        const last = results[results.length - 1];
        if (last.isFinal) {
          handleVoiceCompleted(t);
        }
      };

      rec.onerror = () => {
        setError(true);
        setListening(false);
      };

      rec.onend = () => {
        setListening(false);
      };

      try {
        rec.start();
      } catch {
        setError(true);
      }
    },
    [unsupported, handleVoiceCompleted]
  );

  useEffect(() => {
    restartRecognition(lang);

    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, [lang, restartRecognition]);

  // Direct trigger for testing across languages without mic requirement
  const handleTestPhrase = (phraseText: string) => {
    setHeard(`"${phraseText}"`);
    const trans = parseMultilingualQuery(phraseText, lang);
    if (trans) {
      setDetectedTranslation(trans);
    }
    handleVoiceCompleted(phraseText);
  };

  const currentLangTestGroup =
    LANGUAGE_TEST_PHRASES.find((g) => g.lang === lang) ?? LANGUAGE_TEST_PHRASES[0];

  return (
    <Modal name="voice" title="VOICE SEARCH & INTENT" width="wide" bodyClass="voice-modal-body-enhanced">
      {/* Language Selector Tabs */}
      <div className="voice-lang-tabs">
        <span className="vlt-label">LANGUAGE:</span>
        <div className="vlt-btns">
          {langOptions.map((opt) => (
            <button
              key={opt.code}
              type="button"
              className={`vlt-btn ${lang === opt.code ? 'active' : ''}`}
              onClick={() => {
                setLang(opt.code);
              }}
            >
              <span className="vlt-badge">{opt.short}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visualizer & Mic Box */}
      <div className="voice-mic-container">
        <div className="voice-viz">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div className={`vbar ${listening ? 'active' : ''}`} key={i} id={`vb${i}`} />
          ))}
        </div>

        <button
          type="button"
          className={`voice-mic-box ${listening ? 'listening' : ''}`}
          onClick={() => restartRecognition(lang)}
          title="Click to restart listening"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0014 0M12 19v4M8 23h8" />
          </svg>
        </button>

        <p className="voice-status-txt">
          {detectedTranslation
            ? '✨ INTENT IDENTIFIED'
            : error
            ? 'COULD NOT HEAR — TRY TESTING BELOW'
            : listening
            ? `LISTENING IN ${langOptions.find((l) => l.code === lang)?.badge.toUpperCase()}…`
            : 'PROCESSING RESULT…'}
        </p>

        <div className="voice-heard-box">
          <p className="voice-heard-txt">{heard || (listening ? 'Speak now into your microphone…' : 'Ready')}</p>
        </div>

        {/* Live Detected Translation Card */}
        {detectedTranslation && (
          <div className="voice-meaning-pill">
            <span className="vmp-icon">🌐</span>
            <div className="vmp-content">
              <strong>{detectedTranslation.languageName} detected:</strong>{' '}
              <span>{detectedTranslation.explanation}</span>
            </div>
          </div>
        )}
      </div>

      {/* Language Testing Bench */}
      <div className="voice-test-bench">
        <div className="vtb-header">
          <span className="vtb-title">🧪 TEST IN DIFFERENT LANGUAGES</span>
          <span className="vtb-subtitle">Click any phrase to simulate speaking in {currentLangTestGroup.label}:</span>
        </div>

        <div className="voice-chips-grid">
          {currentLangTestGroup.phrases.map((p) => (
            <button
              key={p.text}
              type="button"
              className="voice-chip-btn"
              onClick={() => handleTestPhrase(p.text)}
            >
              <span className="vc-mic">🎙️</span>
              <span className="vc-text">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Manual Test Input */}
        <form
          className="voice-sim-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (testInput.trim()) {
              handleTestPhrase(testInput.trim());
              setTestInput('');
            }
          }}
        >
          <input
            type="text"
            className="voice-sim-input"
            placeholder={
              lang === 'gu-IN'
                ? 'Type in Gujarati or Romanized (e.g. ચોપડી, chopdi, દવા)'
                : lang === 'hi-IN'
                ? 'Type in Hindi or Romanized (e.g. किताब, kitab, दवाई)'
                : 'Type any product in English (e.g. Notebook, Pen, Medicine)'
            }
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
          />
          <button type="submit" className="voice-sim-submit">
            TEST VOICE
          </button>
        </form>
      </div>
    </Modal>
  );
}