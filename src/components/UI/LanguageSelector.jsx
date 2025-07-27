import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

const LanguageSelector = ({ onClose }) => {
  const { i18n, t } = useTranslation()
  const dropdownRef = useRef(null)

  const languages = [
    { code: 'en', name: t('language.english'), nativeName: 'English' },
    { code: 'hi', name: t('language.hindi'), nativeName: 'हिंदी' },
    { code: 'te', name: t('language.telugu'), nativeName: 'తెలుగు' },
    { code: 'ta', name: t('language.tamil'), nativeName: 'தமிழ்' },
    { code: 'kn', name: t('language.kannada'), nativeName: 'ಕನ್ನಡ' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode)
      localStorage.setItem('baazar-dost-language', languageCode)
      onClose()
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const getFontClass = (languageCode) => {
    const fontMap = {
      'hi': 'font-hindi',
      'te': 'font-telugu',
      'ta': 'font-tamil',
      'kn': 'font-kannada'
    }
    return fontMap[languageCode] || ''
  }

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
    >
      <div className="py-1">
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
          {t('language.select')}
        </div>
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              i18n.language === language.code 
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium">{language.name}</span>
              <span className={`text-xs text-gray-500 dark:text-gray-400 ${getFontClass(language.code)}`}>
                {language.nativeName}
              </span>
            </div>
            {i18n.language === language.code && (
              <Check size={16} className="text-primary-600 dark:text-primary-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSelector
