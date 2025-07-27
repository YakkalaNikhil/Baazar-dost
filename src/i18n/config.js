import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation files
import en from './locales/en.json'
import hi from './locales/hi.json'
import te from './locales/te.json'
import ta from './locales/ta.json'
import kn from './locales/kn.json'

// Supported languages with fallback detection
const supportedLanguages = ['en', 'hi', 'te', 'ta', 'kn']
const defaultLanguage = 'en'

// Language validation function
const validateLanguage = (lang) => {
  return supportedLanguages.includes(lang) ? lang : defaultLanguage
}

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  ta: { translation: ta },
  kn: { translation: kn }
}

// Enhanced i18n configuration with error handling
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    debug: process.env.NODE_ENV === 'development',

    // Language detection configuration
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'baazar-dost-language',
      checkWhitelist: true
    },

    // Whitelist supported languages
    whitelist: supportedLanguages,

    // Load missing translations
    load: 'languageOnly',

    interpolation: {
      escapeValue: false, // React already escapes values
      format: function(value, format, lng) {
        // Custom formatting for numbers, dates, etc.
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'INR'
          }).format(value)
        }
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value)
        }
        return value
      }
    },

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em']
    },

    // Error handling
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
      }
    }
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error)
    // Fallback to English if initialization fails
    i18n.changeLanguage(defaultLanguage)
  })

export default i18n
