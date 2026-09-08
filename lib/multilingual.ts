/**
 * NearBuy Multilingual Dictionary & Query Intent Engine
 * Supports Gujarati (Native script & Romanized), Hindi (Devanagari & Romanized), and English.
 */

export interface MultilingualEntry {
  canonicalEnglish: string;       // e.g. "Notebook"
  category: string;               // e.g. "Notebooks", "Medicine", "Pens"
  guScript: string;               // e.g. "ચોપડી"
  guRoman: string;                // e.g. "chopdi"
  hiScript: string;               // e.g. "किताब"
  hiRoman: string;                // e.g. "kitab"
  synonyms: string[];             // variations & plurals
  spokenExplanation: {
    gu: string;                   // "ચોપડી એટલે નોટબુક"
    hi: string;                   // "किताब यानी नोटबुक"
    en: string;                   // "Chopdi means Notebook"
  };
}

export interface TranslationMatch {
  rawQuery: string;
  matchedWord: string;
  phoneticLabel: string;
  resolvedTerm: string;
  language: 'gu' | 'hi' | 'en';
  languageName: string;
  explanation: string;
  spokenSummary: string;
}

export const MULTILINGUAL_DICTIONARY: MultilingualEntry[] = [
  {
    canonicalEnglish: 'Notebook',
    category: 'Notebooks',
    guScript: 'ચોપડી',
    guRoman: 'chopdi',
    hiScript: 'किताब',
    hiRoman: 'kitab',
    synonyms: [
      'ચોપડી', 'ચોપડીઓ', 'ચોપડો', 'પુસ્તક', 'પુસ્તકો', 'દફતર', 'નોટબુક',
      'chopdi', 'chopadi', 'chpdi', 'chopdo', 'chodi', 'pustak', 'daftar', 'notebook', 'notes',
      'किताब', 'किताबें', 'कापी', 'कॉपी', 'नोटबुक', 'बही', 'kitab', 'kopy', 'copy'
    ],
    spokenExplanation: {
      gu: 'ચોપડી એટલે નોટબુક',
      hi: 'किताब यानी नोटबुक',
      en: 'Chopdi means Notebook'
    }
  },
  {
    canonicalEnglish: 'Pen',
    category: 'Pens',
    guScript: 'પેન',
    guRoman: 'pen',
    hiScript: 'कलम',
    hiRoman: 'kalam',
    synonyms: [
      'પેન', 'પેનો', 'કલમ', 'બોલપેન', 'ટાંકણીવાળી પેન',
      'pen', 'kalam', 'bolpen', 'ballpen', 'reynolds', 'cello',
      'कलम', 'पेन', 'लेखनी', 'बॉलपेन', 'kalam', 'pen'
    ],
    spokenExplanation: {
      gu: 'કલમ એટલે પેન',
      hi: 'कलम यानी पेन',
      en: 'Kalam means Pen'
    }
  },
  {
    canonicalEnglish: 'Medicine',
    category: 'Medicine',
    guScript: 'દવા',
    guRoman: 'dawa',
    hiScript: 'दवाई',
    hiRoman: 'dawai',
    synonyms: [
      'દવા', 'દવાઓ', 'ઔષધ', 'ગોળી', 'ગોળીઓ',
      'dawa', 'davai', 'dawai', 'aushadh', 'medicine', 'medicines',
      'दवा', 'दवाई', 'दवाइयां', 'औषधि', 'dawa', 'dawai', 'dawaein'
    ],
    spokenExplanation: {
      gu: 'દવા એટલે મેડિસિન',
      hi: 'दवाई यानी मेडिसिन',
      en: 'Dawa means Medicine'
    }
  },
  {
    canonicalEnglish: 'Tablet',
    category: 'Medicine',
    guScript: 'ગોળી',
    guRoman: 'goli',
    hiScript: 'गोली',
    hiRoman: 'goli',
    synonyms: [
      'ગોળી', 'ગોળીઓ', 'ટેબ્લેટ',
      'goli', 'golio', 'tablet', 'tablets', 'capsule',
      'गोली', 'गोलियां', 'टैबलेट', 'capsule'
    ],
    spokenExplanation: {
      gu: 'ગોળી એટલે ટેબ્લેટ',
      hi: 'गोली यानी टैबलेट',
      en: 'Goli means Tablet'
    }
  },
  {
    canonicalEnglish: 'Paper',
    category: 'Paper',
    guScript: 'કાગળ',
    guRoman: 'kagad',
    hiScript: 'कागज़',
    hiRoman: 'kagaz',
    synonyms: [
      'કાગળ', 'કાગળો', 'પેપર', 'ઝેરોક્ષ કાગળ',
      'kagad', 'kagal', 'kagadho', 'paper', 'ream', 'a4',
      'कागज़', 'कागज', 'पन्ना', 'कागजात', 'kagaz', 'kagas'
    ],
    spokenExplanation: {
      gu: 'કાગળ એટલે પેપર',
      hi: 'कागज़ यानी पेपर',
      en: 'Kagad means Paper'
    }
  },
  {
    canonicalEnglish: 'Calculator',
    category: 'Electronics',
    guScript: 'કેલ્ક્યુલેટર',
    guRoman: 'calculator',
    hiScript: 'कैलकुलेटर',
    hiRoman: 'calculator',
    synonyms: [
      'કેલ્ક્યુલેટર', 'ગણક યંત્ર',
      'calculator', 'calc', 'casio', 'ganak',
      'कैलकुलेटर', 'गिनती यंत्र'
    ],
    spokenExplanation: {
      gu: 'કેલ્ક્યુલેટર એટલે કેલ્સી',
      hi: 'कैलकुलेटर यानी कैल्सी',
      en: 'Calculator'
    }
  },
  {
    canonicalEnglish: 'Scale',
    category: 'Math',
    guScript: 'માપપટ્ટી',
    guRoman: 'maappatti',
    hiScript: 'पैमाना',
    hiRoman: 'scale',
    synonyms: [
      'માપપટ્ટી', 'સ્કેલ', 'પટ્ટી',
      'maappatti', 'scale', 'patti', 'ruler',
      'पैमाना', 'स्केल', 'पटरी', 'paimani'
    ],
    spokenExplanation: {
      gu: 'માપપટ્ટી એટલે સ્કેલ',
      hi: 'पैमाना यानी स्केल',
      en: 'Maappatti means Scale'
    }
  },
  {
    canonicalEnglish: 'Pencil',
    category: 'Pens',
    guScript: 'પેન્સિલ',
    guRoman: 'pencil',
    hiScript: 'पेंसिल',
    hiRoman: 'pencil',
    synonyms: [
      'પેન્સિલ', 'સીસપેન',
      'pencil', 'apsara', 'natraj', 'pencile',
      'पेंसिल', 'लेड पेंसिल'
    ],
    spokenExplanation: {
      gu: 'પેન્સિલ',
      hi: 'पेंसिल',
      en: 'Pencil'
    }
  },
  {
    canonicalEnglish: 'Eraser',
    category: 'Office',
    guScript: 'રબર',
    guRoman: 'rabar',
    hiScript: 'रबर',
    hiRoman: 'rubber',
    synonyms: [
      'રબર', 'ઇરેઝર', 'છૂંદણી',
      'rabar', 'rubber', 'eraser',
      'रबर', 'इरेज़र'
    ],
    spokenExplanation: {
      gu: 'રબર એટલે ઇરેઝર',
      hi: 'रबर यानी इरेज़र',
      en: 'Rabar means Eraser'
    }
  },
  {
    canonicalEnglish: 'Fevicol',
    category: 'Office',
    guScript: 'ગુંદર',
    guRoman: 'gundar',
    hiScript: 'गोंद',
    hiRoman: 'gond',
    synonyms: [
      'ગુંદર', 'ફેવિકોલ', 'ગ્લૂ',
      'gundar', 'fevicol', 'glue', 'adhesive',
      'गोंद', 'फेविकोल'
    ],
    spokenExplanation: {
      gu: 'ગુંદર એટલે ફેવિકોલ',
      hi: 'गोंद यानी फेविकोल',
      en: 'Gundar means Fevicol / Glue'
    }
  }
];

// Conversational filler words to remove when extracting intent
const GU_FILLERS = [
  'મને', 'આપો', 'જોઈએ', 'જોઈએ છે', 'છે', 'ક્યાં', 'મળશે', 'કઈ', 'દુકાને', 'મળે',
  'નજીક', 'માં', 'એક', 'બે', 'કોઈ', 'માટે', 'કૃપા', 'કરીને', 'પ્લીઝ'
];

const HI_FILLERS = [
  'मुझे', 'चाहिए', 'दीजिए', 'दो', 'कहाँ', 'मिलेगी', 'मिलेगा', 'दुकान', 'पास',
  'में', 'एक', 'दो', 'कोई', 'के', 'लिए', 'कृपया', 'प्लीज'
];

const EN_FILLERS = [
  'i', 'need', 'want', 'looking', 'for', 'where', 'can', 'get', 'a', 'an', 'the',
  'nearby', 'store', 'shop', 'please', 'show', 'me'
];

/**
 * Detects if a text contains Gujarati characters (Unicode range \u0A80-\u0AFF)
 */
export function isGujaratiScript(text: string): boolean {
  return /[\u0A80-\u0AFF]/.test(text);
}

/**
 * Detects if a text contains Devanagari/Hindi characters (Unicode range \u0900-\u097F)
 */
export function isHindiScript(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Analyzes query text and identifies if it maps to any known local-language item.
 */
export function parseMultilingualQuery(input: string, preferredLang: string = 'en-US'): TranslationMatch | null {
  if (!input || !input.trim()) return null;

  const rawClean = input.trim();
  const lowerClean = rawClean.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'–—]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = lowerClean.split(' ').filter(Boolean);

  // 1. Exact match check
  for (const entry of MULTILINGUAL_DICTIONARY) {
    for (const syn of entry.synonyms) {
      const synLower = syn.toLowerCase();
      if (lowerClean === synLower) {
        const lang: 'gu' | 'hi' | 'en' = isGujaratiScript(syn)
          ? 'gu'
          : isHindiScript(syn)
          ? 'hi'
          : synLower === entry.guRoman || synLower === 'chopdi' || synLower === 'chpdi' || synLower === 'daftar' || synLower === 'kalam' || synLower === 'kagad'
          ? 'gu'
          : synLower === entry.hiRoman
          ? 'hi'
          : 'en';

        return buildMatch(rawClean, syn, entry, lang);
      }
    }
  }

  // 2. Tokenized word-level match (e.g. "mane chopdi joiye" or "મને ચોપડી આપો")
  for (const word of words) {
    if (GU_FILLERS.includes(word) || HI_FILLERS.includes(word) || EN_FILLERS.includes(word)) continue;

    for (const entry of MULTILINGUAL_DICTIONARY) {
      for (const syn of entry.synonyms) {
        const synLower = syn.toLowerCase();
        if (word === synLower) {
          const lang: 'gu' | 'hi' | 'en' = isGujaratiScript(syn)
            ? 'gu'
            : isHindiScript(syn)
            ? 'hi'
            : synLower === entry.guRoman || synLower === 'chopdi' || synLower === 'chpdi' || synLower === 'daftar' || synLower === 'kalam' || synLower === 'kagad'
            ? 'gu'
            : synLower === entry.hiRoman
            ? 'hi'
            : 'en';

          return buildMatch(rawClean, word, entry, lang);
        }
      }
    }
  }

  // 3. Substring match (e.g., compound phrase like "chopdi-notebook")
  for (const entry of MULTILINGUAL_DICTIONARY) {
    for (const syn of entry.synonyms) {
      const synLower = syn.toLowerCase();
      if (lowerClean.includes(synLower) && synLower.length >= 3) {
        const lang: 'gu' | 'hi' | 'en' = isGujaratiScript(syn)
          ? 'gu'
          : isHindiScript(syn)
          ? 'hi'
          : synLower === entry.guRoman || synLower === 'chopdi' || synLower === 'chpdi' || synLower === 'daftar' || synLower === 'kalam'
          ? 'gu'
          : synLower === entry.hiRoman
          ? 'hi'
          : 'en';

        return buildMatch(rawClean, syn, entry, lang);
      }
    }
  }

  // If no match but language was explicitly Gujarati/Hindi
  if (preferredLang.startsWith('gu') && isGujaratiScript(rawClean)) {
    return {
      rawQuery: rawClean,
      matchedWord: rawClean,
      phoneticLabel: rawClean,
      resolvedTerm: rawClean,
      language: 'gu',
      languageName: 'Gujarati',
      explanation: `ગુજરાતીમાં શોધ્યું: "${rawClean}"`,
      spokenSummary: `વાસદમાં ${rawClean} માટે દુકાનો શોધી રહ્યા છીએ.`
    };
  }

  return null;
}

function buildMatch(
  rawInput: string,
  matchedWord: string,
  entry: MultilingualEntry,
  lang: 'gu' | 'hi' | 'en'
): TranslationMatch {
  const isGu = lang === 'gu';
  const isHi = lang === 'hi';

  const phonetic = isGu
    ? entry.guRoman
    : isHi
    ? entry.hiRoman
    : entry.canonicalEnglish.toLowerCase();

  const explanation = isGu
    ? `"${matchedWord}" (${entry.guRoman}) means "${entry.canonicalEnglish}"`
    : isHi
    ? `"${matchedWord}" (${entry.hiRoman}) means "${entry.canonicalEnglish}"`
    : `"${matchedWord}" means "${entry.canonicalEnglish}"`;

  const spokenSummary = isGu
    ? `${entry.guScript} એટલે ${entry.canonicalEnglish}.`
    : isHi
    ? `${entry.hiScript} यानी ${entry.canonicalEnglish}.`
    : `${entry.canonicalEnglish} search results.`;

  return {
    rawQuery: rawInput,
    matchedWord,
    phoneticLabel: phonetic,
    resolvedTerm: entry.canonicalEnglish,
    language: lang,
    languageName: isGu ? 'Gujarati' : isHi ? 'Hindi' : 'English',
    explanation,
    spokenSummary
  };
}

/**
 * Pre-defined test phrases for testing across different languages.
 */
export const LANGUAGE_TEST_PHRASES = [
  {
    lang: 'gu-IN',
    label: 'Gujarati',
    flag: '🇬🇺',
    phrases: [
      { text: 'ચોપડી', label: 'ચોપડી (Chopdi → Notebook)', meaning: 'Notebook' },
      { text: 'મને ચોપડી જોઈએ છે', label: 'મને ચોપડી જોઈએ છે (I need Notebook)', meaning: 'Notebook' },
      { text: 'દવા', label: 'દવા (Dawa → Medicine)', meaning: 'Medicine' },
      { text: 'પેન', label: 'પેન (Pen)', meaning: 'Pen' },
      { text: 'કાગળ', label: 'કાગળ (Kagad → Paper)', meaning: 'Paper' }
    ]
  },
  {
    lang: 'hi-IN',
    label: 'Hindi',
    flag: '🇮🇳',
    phrases: [
      { text: 'किताब', label: 'किताब (Kitab → Notebook)', meaning: 'Notebook' },
      { text: 'दवाई चाहिए', label: 'दवाई चाहिए (Need Medicine)', meaning: 'Medicine' },
      { text: 'कलम', label: 'कलम (Kalam → Pen)', meaning: 'Pen' },
      { text: 'कागज़', label: 'कागज़ (Kagaz → Paper)', meaning: 'Paper' }
    ]
  },
  {
    lang: 'en-US',
    label: 'English',
    flag: '🇬🇧',
    phrases: [
      { text: 'Notebook', label: 'Notebook', meaning: 'Notebook' },
      { text: 'Avil Tablet', label: 'Avil Tablet', meaning: 'Medicine' },
      { text: 'Reynolds Pen', label: 'Reynolds Pen', meaning: 'Pen' }
    ]
  }
];
