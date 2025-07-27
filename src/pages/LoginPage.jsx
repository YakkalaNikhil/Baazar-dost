import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowRight, UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const LoginPage = () => {
  const { t } = useTranslation()
  const { sendLoginLink, signInWithGoogle, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      return
    }

    const result = await sendLoginLink(email.trim())
    if (result.success) {
      setEmailSent(true)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      const result = await signInWithGoogle('popup')
      if (result.success) {
        // Navigate to appropriate dashboard based on user role
        navigate('/')
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
    } finally {
      setGoogleLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-6">
              <img
                src="/logo.png"
                alt="Baazar Dost Logo"
                className="h-16 w-auto mx-auto object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
              <div className="hidden w-16 h-16 bg-primary-600 rounded-full items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('auth.checkEmail')}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We've sent a login link to <strong>{email}</strong>
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="mt-4 text-primary-600 hover:text-primary-500 text-sm"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-6">
            <img
              src="/logo.png"
              alt="Baazar Dost Logo"
              className="h-20 w-auto mx-auto object-contain"
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.target.style.display = 'none'
                e.target.nextElementSibling.style.display = 'flex'
              }}
            />
            <div className="hidden w-16 h-16 bg-primary-600 rounded-full items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('app.name')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('app.tagline')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              {t('auth.enterEmail')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder={t('auth.enterEmail')}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <span>{t('auth.sendLoginLink')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {googleLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        {/* Register Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <UserPlus className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            New to Baazar Dost?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Join thousands of vendors and suppliers already using our platform
          </p>
          <Link
            to="/register"
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Your Account</span>
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Free registration • No setup fees • Start selling immediately
          </p>
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            We'll send you a secure login link via email.
            <br />
            No passwords required!
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
