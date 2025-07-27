import React from 'react'
import { useTranslation } from 'react-i18next'

const Logo = ({ 
  size = 'medium', 
  showText = false, 
  className = '',
  textClassName = '',
  fallbackIcon = 'B'
}) => {
  const { t } = useTranslation()

  const sizeClasses = {
    small: 'h-8 w-auto',
    medium: 'h-10 w-auto',
    large: 'h-16 w-auto',
    xlarge: 'h-20 w-auto'
  }

  const fallbackSizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  }

  const fallbackTextSizes = {
    small: 'text-sm',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl'
  }

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Baazar Dost Logo" 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to text logo if image fails to load
          e.target.style.display = 'none'
          e.target.nextElementSibling.style.display = 'flex'
        }}
      />
      <div className={`hidden ${fallbackSizeClasses[size]} bg-primary-600 rounded-lg items-center justify-center`}>
        <span className={`text-white font-bold ${fallbackTextSizes[size]}`}>
          {fallbackIcon}
        </span>
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 dark:text-white ${textSizes[size]} ${textClassName}`}>
          {t('app.name')}
        </span>
      )}
    </div>
  )
}

export default Logo
