'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { languages, type Language, defaultLanguage } from '@/config/languages';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  availableLanguages: typeof languages;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update: updateSession } = useSession();
  const [language, setLanguageState] = useState<Language>(
    (session?.user?.language as Language) || defaultLanguage
  );

  useEffect(() => {
    if (session?.user?.language) {
      setLanguageState(session.user.language as Language);
    }
  }, [session?.user?.language]);

  const setLanguage = async (newLang: Language) => {
    try {
      const response = await fetch('/api/user/language', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLang }),
      });

      if (!response.ok) throw new Error('Failed to update language');

      setLanguageState(newLang);
      await updateSession({ language: newLang });
    } catch (error) {
      console.error('Failed to update language:', error);
      throw error;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        availableLanguages: languages,
      }}
    >
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
