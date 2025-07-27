import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Sun,
  Moon,
  Globe,
  Home,
  Package,
  History,
  MapPin,
  Map,
  Bell,
  HelpCircle,
  Search
} from 'lucide-react'

import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useCart } from '../../contexts/CartContext'
import NotificationCenter from '../Notifications/NotificationCenter'
import GlobalSearch from '../Search/GlobalSearch'
import LanguageSelector from '../UI/LanguageSelector'
import Logo from '../UI/Logo'

const Header = () => {
  const { t } = useTranslation()
  const { user, userProfile, signOut, signInWithGoogle } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { getCartItemCount } = useCart()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const cartItemCount = getCartItemCount()

  // Filter navigation based on user role
  const getNavigation = () => {
    const baseNavigation = [
      { name: t('navigation.home'), href: '/', icon: Home },
      { name: 'Help', href: '/help', icon: HelpCircle },
    ]

    // Add role-specific navigation
    if (userProfile?.role === 'supplier') {
      // Suppliers only get dashboard and help
      return baseNavigation
    } else {
      // Regular users get full navigation
      return [
        { name: t('navigation.home'), href: '/', icon: Home },
        { name: t('navigation.products'), href: '/products', icon: Package },
        { name: t('navigation.suppliers'), href: '/stores', icon: Map },
        { name: t('navigation.orders'), href: '/orders', icon: History },
        { name: 'Help', href: '/help', icon: HelpCircle },
      ]
    }
  }

  const navigation = getNavigation()

  const isActivePath = (path) => {
    return location.pathname === path
  }

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const result = await signInWithGoogle('popup')
      if (result.success) {
        setIsMenuOpen(false)
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
    } finally {
      setGoogleLoading(false)
    }
  }

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Search Bar */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center"
              aria-label="Baazar Dost Home"
            >
              <Logo size="medium" showText={true} textClassName="hidden md:block" />
            </Link>

            {/* Desktop Search Bar */}
            <button
              onClick={() => setShowSearch(true)}
              className="hidden md:flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 min-w-[200px]"
              aria-label="Open search dialog"
              title="Search products (Ctrl+K)"
            >
              <Search size={16} aria-hidden="true" />
              <span className="text-sm flex-1 text-left">Search products...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs font-mono bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-600 dark:text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg"
              aria-label="Open search"
              title="Search products"
            >
              <Search size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Center Section: Navigation Links */}
          <nav
            className="hidden md:flex items-center justify-center flex-1 max-w-md mx-8"
            role="navigation"
            aria-label="Main navigation"
          >
            <ul className="flex items-center space-x-1 w-full justify-center">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isActivePath(item.href)
                          ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-current={isActivePath(item.href) ? 'page' : undefined}
                    >
                      <Icon size={16} aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Right Section: Action Icons */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg"
              aria-label="View notifications"
              title="Notifications"
            >
              <Bell size={18} aria-hidden="true" />
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                aria-label="2 unread notifications"
              >
                2
              </span>
            </button>

            {/* Cart - Hidden for suppliers */}
            {userProfile?.role !== 'supplier' && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg"
                aria-label={`Shopping cart ${cartItemCount > 0 ? `with ${cartItemCount} items` : '(empty)'}`}
                title="Shopping Cart"
              >
                <ShoppingCart size={18} aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                    aria-label={`${cartItemCount} items in cart`}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg"
                    aria-label="User menu"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                  >
                    <User size={18} aria-hidden="true" />
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.displayName || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </button>

                  {/* Authenticated User Dropdown */}
                  {isMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                          role="menuitem"
                        >
                          {t('navigation.profile')}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          role="menuitem"
                        >
                          {t('auth.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg"
                    aria-label="Sign in menu"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="true"
                  >
                    <User size={18} aria-hidden="true" />
                    <span className="hidden sm:block text-sm font-medium">Sign In</span>
                  </button>

                  {/* Non-authenticated User Dropdown */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 space-y-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Welcome! Please sign in
                        </div>

                        {/* Google Sign-In */}
                        <button
                          onClick={handleGoogleSignIn}
                          disabled={googleLoading}
                          className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          {googleLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-300"></div>
                          ) : (
                            <>
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              <span>Continue with Google</span>
                            </>
                          )}
                        </button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                              or
                            </span>
                          </div>
                        </div>

                        {/* Email Login */}
                        <Link
                          to="/login"
                          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Sign in with Email
                        </Link>

                        {/* Register Link */}
                        <Link
                          to="/register"
                          className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="px-4 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActivePath(item.href)
                          ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isActivePath(item.href) ? 'page' : undefined}
                    >
                      <Icon size={20} aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Global Search */}
      <GlobalSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </header>
  )
}

export default Header
