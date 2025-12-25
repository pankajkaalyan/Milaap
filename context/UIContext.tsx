import React, { createContext, useCallback, ReactNode, useState, useEffect } from 'react';
import { Language, ToastMessage, AppEventStatus } from '../types';
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

    // Listen to global show_toast events (used by non-React code paths)
    const showToastListener = (e: Event) => {
      const payload = (e as CustomEvent)?.detail;
      if (!payload) return;
      const { message, type } = payload;
      addToast(message, type);
    };
    window.addEventListener(AppEventStatus.SHOW_TOAST, showToastListener as EventListener);

    // Forward generic tracking events to telemetry (best-effort)
    const trackEventListener = async (e: Event) => {
      const payload = (e as CustomEvent)?.detail;
      if (!payload) return;
      try {
        const { logEvent } = await import('@/utils/telemetry');
        await logEvent(payload.name, payload.props);
      } catch (err) {
        // ignore telemetry errors
      }
    };
    window.addEventListener(AppEventStatus.TRACK_EVENT, trackEventListener as EventListener);

    return () => {
      window.removeEventListener(AppEventStatus.SHOW_TOAST, showToastListener as EventListener);
      window.removeEventListener(AppEventStatus.TRACK_EVENT, trackEventListener as EventListener);
    };
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
    // console.log('Analytics Event:', eventName, eventProperties);
    // window.gtag('event', eventName, eventProperties);
    // Provide a lightweight bridge for non-React code to send events via window
    try {
      window.dispatchEvent(new CustomEvent(AppEventStatus.TRACK_EVENT, { detail: { name: eventName, props: eventProperties } }));
    } catch (e) {
      /* ignore */
    }
  };
  
  const value: UIContextType = { language, setLanguage: handleSetLanguage, t, toasts, addToast, trackEvent };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
