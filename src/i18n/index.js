import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import en from '../locales/en.json'
import hi from '../locales/hi.json'
import te from '../locales/te.json'
import ta from '../locales/ta.json'
import kn from '../locales/kn.json'

const resources = {
  en: {
    translation: en
  },
  hi: {
    translation: hi
  },
  te: {
    translation: te
  },
  ta: {
    translation: ta
  },
  kn: {
    translation: kn
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'baazar-dost-language'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  })

export default i18n
