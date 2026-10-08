import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { TRANSLATIONS } from '../i18n/translations';

export const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'hi', label: 'हिन्दी', short: 'हिं' },
  { code: 'te', label: 'తెలుగు', short: 'తె' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('deeptrace_lang');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'te')) {
        return saved;
      }
    } catch {
      // ignore localStorage errors (e.g. incognito/sandboxed)
    }
    return 'en';
  });

  const setLang = (nextLang) => {
    if (nextLang === 'en' || nextLang === 'hi' || nextLang === 'te') {
      setLangState(nextLang);
      try {
        localStorage.setItem('deeptrace_lang', nextLang);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    // Set html lang attribute for correct hyphenation and font fallback
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Translation lookup function supporting dot-notation keys: t('hero.titleLine1')
  const t = useMemo(() => {
    return (path, fallback = '') => {
      const keys = path.split('.');
      
      // 1. Try current language
      let curr = TRANSLATIONS[lang];
      for (const k of keys) {
        if (curr && typeof curr === 'object' && k in curr) {
          curr = curr[k];
        } else {
          curr = undefined;
          break;
        }
      }
      if (typeof curr === 'string') return curr;

      // 2. Fallback to English
      let enVal = TRANSLATIONS.en;
      for (const k of keys) {
        if (enVal && typeof enVal === 'object' && k in enVal) {
          enVal = enVal[k];
        } else {
          enVal = undefined;
          break;
        }
      }
      if (typeof enVal === 'string') return enVal;

      // 3. Fallback to provided fallback or key path
      return fallback || path;
    };
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    languages: LANGUAGES,
  }), [lang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
