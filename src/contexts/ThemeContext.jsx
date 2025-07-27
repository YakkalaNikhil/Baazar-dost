import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [isSystemTheme, setIsSystemTheme] = useState(false)

  useEffect(() => {
    try {
      // Load theme from localStorage or system preference
      const savedTheme = localStorage.getItem('baazar-dost-theme')

      // Check if system theme detection is supported
      const supportsSystemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
      const systemTheme = supportsSystemTheme?.matches ? 'dark' : 'light'

      let initialTheme = 'light' // Default fallback

      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        initialTheme = savedTheme
        setIsSystemTheme(false)
      } else if (supportsSystemTheme) {
        initialTheme = systemTheme
        setIsSystemTheme(true)
      }

      setTheme(initialTheme)
      applyTheme(initialTheme)

      // Listen for system theme changes only if using system theme
      if (supportsSystemTheme) {
        const handleSystemThemeChange = (e) => {
          // Only update if user hasn't manually set a theme
          if (isSystemTheme || !localStorage.getItem('baazar-dost-theme')) {
            const newTheme = e.matches ? 'dark' : 'light'
            setTheme(newTheme)
            applyTheme(newTheme)
          }
        }

        supportsSystemTheme.addEventListener('change', handleSystemThemeChange)
        return () => supportsSystemTheme.removeEventListener('change', handleSystemThemeChange)
      }
    } catch (error) {
      console.error('Error initializing theme:', error)
      // Fallback to light theme
      setTheme('light')
      applyTheme('light')
    }
  }, [])

  const applyTheme = (newTheme) => {
    try {
      // Validate theme value
      if (newTheme !== 'light' && newTheme !== 'dark') {
        console.warn('Invalid theme value:', newTheme, 'Falling back to light theme')
        newTheme = 'light'
      }

      const root = document.documentElement

      if (newTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }

      // Update meta theme-color for mobile browsers with error handling
      try {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        const themeColor = newTheme === 'dark' ? '#111827' : '#ffffff'

        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', themeColor)
        } else {
          const meta = document.createElement('meta')
          meta.name = 'theme-color'
          meta.content = themeColor
          document.head.appendChild(meta)
        }
      } catch (metaError) {
        console.warn('Could not update meta theme-color:', metaError)
      }

      // Update CSS custom properties for better theme support
      try {
        root.style.setProperty('--theme-mode', newTheme)
        root.style.setProperty('--bg-primary', newTheme === 'dark' ? '#111827' : '#ffffff')
        root.style.setProperty('--text-primary', newTheme === 'dark' ? '#ffffff' : '#111827')
      } catch (cssError) {
        console.warn('Could not update CSS custom properties:', cssError)
      }
    } catch (error) {
      console.error('Error applying theme:', error)
    }
  }

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      applyTheme(newTheme)
      setIsSystemTheme(false) // User manually changed theme

      try {
        localStorage.setItem('baazar-dost-theme', newTheme)
      } catch (storageError) {
        console.warn('Could not save theme to localStorage:', storageError)
      }
    } catch (error) {
      console.error('Error toggling theme:', error)
    }
  }

  const setThemeMode = (newTheme) => {
    try {
      if (newTheme !== 'light' && newTheme !== 'dark') {
        console.warn('Invalid theme mode. Use "light" or "dark"')
        return false
      }

      setTheme(newTheme)
      applyTheme(newTheme)
      setIsSystemTheme(false) // User manually set theme

      try {
        localStorage.setItem('baazar-dost-theme', newTheme)
      } catch (storageError) {
        console.warn('Could not save theme to localStorage:', storageError)
      }

      return true
    } catch (error) {
      console.error('Error setting theme mode:', error)
      return false
    }
  }

  const resetToSystemTheme = () => {
    try {
      localStorage.removeItem('baazar-dost-theme')
      setIsSystemTheme(true)

      const supportsSystemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
      const systemTheme = supportsSystemTheme?.matches ? 'dark' : 'light'

      setTheme(systemTheme)
      applyTheme(systemTheme)
    } catch (error) {
      console.error('Error resetting to system theme:', error)
    }
  }

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    resetToSystemTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isSystemTheme,
    supportsSystemTheme: !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)'))
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
