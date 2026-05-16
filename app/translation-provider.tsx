'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  dir: 'ltr' | 'rtl';
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

let translations: { [key: string]: any } = {};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load translations on mount
    const loadTranslations = async () => {
      try {
        const en = await fetch('/locales/en/common.json').then(r => r.json());
        const ar = await fetch('/locales/ar/common.json').then(r => r.json());
        
        translations = { en, ar };
        
        // Get saved language preference
        const saved = localStorage.getItem('language') as Language;
        if (saved && (saved === 'en' || saved === 'ar')) {
          setLanguage(saved);
        }
        
        setLoaded(true);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setLoaded(true);
      }
    };

    loadTranslations();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string, defaultValue: string = key): string => {
    try {
      const keys = key.split('.');
      let value = translations[language];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return defaultValue;
        }
      }
      
      return typeof value === 'string' ? value : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      {loaded ? children : <div className="flex items-center justify-center h-screen">Loading...</div>}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
