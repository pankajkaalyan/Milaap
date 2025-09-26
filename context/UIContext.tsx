import React, { createContext, useCallback, ReactNode, useState, useEffect } from 'react';
import { Language, ToastMessage } from '../types';
import { en } from '../i18n/en';
import { hi } from '../i18n/hi';
import { useToasts } from '../hooks/useToasts';

const translations = { en, hi };

export interface UIContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  trackEvent: (eventName: string, eventProperties?: Record<string, string | number | boolean | null>) => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const { toasts, addToast } = useToasts();
  
  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang && (storedLang === 'en' || storedLang === 'hi')) {
      setLanguage(storedLang);
    }
  }, []);

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let translation = keys.reduce((acc, currentKey) => {
        // Check if acc is a valid object and has the key
        if (acc && typeof acc === 'object' && !Array.isArray(acc) && currentKey in acc) {
            return (acc as Record<string, unknown>)[currentKey];
        }
        return undefined;
    }, translations[language] as unknown);

    if (typeof translation !== 'string') {
        console.warn(`Translation for key '${key}' not found.`);
        return key; // Fallback to the key itself
    }

    let result = translation;
    if (options) {
        Object.entries(options).forEach(([optionKey, value]) => {
            result = result.replace(new RegExp(`\\{${optionKey}\\}`, 'g'), String(value));
        });
    }
    return result;
  }, [language]);


  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const trackEvent = (eventName: string, eventProperties?: Record<string, string | number | boolean | null>) => {
    console.log('Analytics Event:', eventName, eventProperties);
    // window.gtag('event', eventName, eventProperties);
  };
  
  const value: UIContextType = { language, setLanguage: handleSetLanguage, t, toasts, addToast, trackEvent };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
