/**
 * NearBuy Speech Synthesis (Text-to-Speech) Engine
 * Audibly speaks search results in Gujarati, Hindi, or English.
 */

import type { TranslationMatch } from './multilingual';

export interface SpokenResultOptions {
  translation?: TranslationMatch | null;
  productName: string;
  storeCount: number;
  lowestPrice?: number;
  lang?: string; // 'gu-IN', 'hi-IN', 'en-US'
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

/**
 * Checks if browser supports SpeechSynthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Cancels any currently playing speech.
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* noop */
    }
  }
}

/**
 * Finds the most suitable voice for the requested language code.
 */
function findBestVoice(langCode: string): SpeechSynthesisVoice | null {
  if (!isSpeechSynthesisSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetLang = langCode.toLowerCase().replace('_', '-');
  const targetPrefix = targetLang.split('-')[0];

  // 1. Exact match (e.g. 'gu-IN', 'hi-IN', 'en-IN', 'en-US')
  const exact = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === targetLang);
  if (exact) return exact;

  // 2. Prefix match (e.g. 'gu', 'hi', 'en')
  const prefix = voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
  if (prefix) return prefix;

  // 3. Indian English / Indian voice fallback for regional accents
  const inVoice = voices.find((v) => v.lang.toLowerCase().includes('in'));
  if (inVoice) return inVoice;

  // 4. Default voice
  return voices.find((v) => v.default) ?? voices[0] ?? null;
}

/**
 * Formulates the spoken script based on the search result, detected translation, and language.
 */
export function buildSpokenSentence(opts: SpokenResultOptions): { text: string; langCode: string } {
  const { translation, productName, storeCount, lowestPrice, lang = 'en-US' } = opts;
  const isGu = lang.startsWith('gu') || translation?.language === 'gu';
  const isHi = lang.startsWith('hi') || translation?.language === 'hi';

  const voices = isSpeechSynthesisSupported() ? window.speechSynthesis.getVoices() : [];
  const hasNativeGujaratiVoice = voices.some((v) => v.lang.toLowerCase().startsWith('gu'));

  // 1. GUJARATI
  if (isGu) {
    if (storeCount === 0) {
      if (hasNativeGujaratiVoice) {
        return {
          text: translation
            ? `${translation.matchedWord} એટલે ${translation.resolvedTerm}. વાસદમાં કોઈ સ્ટોર મળ્યો નથી.`
            : `વાસદમાં ${productName} માટે કોઈ સ્ટોર મળ્યો નથી.`,
          langCode: 'gu-IN',
        };
      } else {
        // Phonetic English/Indian fallback so the user always hears clear audio
        return {
          text: translation
            ? `${translation.matchedWord} means ${translation.resolvedTerm}. No stores found near SVIT Vasad.`
            : `No stores found for ${productName} near SVIT Vasad.`,
          langCode: 'en-IN',
        };
      }
    }

    const priceText = lowestPrice ? ` ભાવ ₹${lowestPrice} થી શરૂ.` : '';
    if (hasNativeGujaratiVoice) {
      const mainSentence = translation
        ? `${translation.matchedWord} એટલે ${translation.resolvedTerm}. વાસદમાં ${storeCount} ${storeCount === 1 ? 'દુકાન' : 'દુકાનો'} મળી છે.${priceText}`
        : `વાસદમાં ${productName} માટે ${storeCount} દુકાનો મળી છે.${priceText}`;
      return { text: mainSentence, langCode: 'gu-IN' };
    } else {
      // Clear bilingual explanation when OS lacks native Gujarati TTS voice pack
      const phoneticWord = translation?.phoneticLabel ?? translation?.matchedWord ?? productName;
      const resolved = translation?.resolvedTerm ?? productName;
      const mainSentence = translation
        ? `${phoneticWord} means ${resolved}. Found ${storeCount} ${storeCount === 1 ? 'store' : 'stores'} near SVIT Vasad with prices starting from ${lowestPrice ? 'rupees ' + lowestPrice : 'live stock'}.`
        : `Found ${storeCount} ${storeCount === 1 ? 'store' : 'stores'} for ${resolved} near SVIT Vasad.`;
      return { text: mainSentence, langCode: 'en-IN' };
    }
  }

  // 2. HINDI
  if (isHi) {
    if (storeCount === 0) {
      return {
        text: translation
          ? `${translation.matchedWord} यानी ${translation.resolvedTerm}। वासद में कोई दुकान नहीं मिली।`
          : `વાસદ में ${productName} के लिए कोई दुकान नहीं मिली।`,
        langCode: 'hi-IN',
      };
    }

    const priceText = lowestPrice ? ` कीमत ₹${lowestPrice} से शुरू।` : '';
    const mainSentence = translation
      ? `${translation.matchedWord} यानी ${translation.resolvedTerm}। वासद में ${storeCount} ${storeCount === 1 ? 'दुकान' : 'दुकानें'} मिलीं।${priceText}`
      : `વાસદ में ${productName} के लिए ${storeCount} दुकानें मिलीं।${priceText}`;

    return { text: mainSentence, langCode: 'hi-IN' };
  }

  // 3. ENGLISH (Default)
  if (storeCount === 0) {
    return {
      text: translation
        ? `${translation.matchedWord} means ${translation.resolvedTerm}. No nearby stores have it in stock.`
        : `No stores found for ${productName} near SVIT Vasad.`,
      langCode: 'en-US',
    };
  }

  const pricePart = lowestPrice ? ` starting at ₹${lowestPrice}` : '';
  const sentence = translation
    ? `${translation.matchedWord} means ${translation.resolvedTerm}. Found ${storeCount} ${storeCount === 1 ? 'store' : 'stores'} near SVIT Vasad${pricePart}.`
    : `Found ${storeCount} ${storeCount === 1 ? 'store' : 'stores'} with ${productName} near SVIT Vasad${pricePart}.`;

  return { text: sentence, langCode: 'en-US' };
}

/**
 * Speaks out the search result.
 */
export function speakSearchResult(opts: SpokenResultOptions): void {
  if (!isSpeechSynthesisSupported()) {
    opts.onError?.('SpeechSynthesis is not supported in this browser.');
    return;
  }

  stopSpeaking();

  const { text, langCode } = buildSpokenSentence(opts);
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = langCode;
  utterance.rate = 0.95; // Slightly slower for clarity
  utterance.pitch = 1.0;

  const voice = findBestVoice(langCode);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    opts.onStart?.();
  };

  utterance.onend = () => {
    opts.onEnd?.();
  };

  utterance.onerror = (e) => {
    opts.onError?.(e);
    opts.onEnd?.();
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    opts.onError?.(err);
  }
}
