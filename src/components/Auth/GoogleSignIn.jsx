import React, { useState } from 'react'
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from '../../config/firebase'
import { toast } from 'react-toastify'

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [signInMethod, setSignInMethod] = useState('popup') // 'popup' or 'redirect'

  // Listen for auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        console.log('✅ User signed in successfully!')
        console.log('👤 Display Name:', currentUser.displayName)
        console.log('📧 Email:', currentUser.email)
        console.log('🖼️ Photo URL:', currentUser.photoURL)
        console.log('🆔 UID:', currentUser.uid)
        console.log('🔍 Full User Object:', currentUser)
      } else {
        console.log('❌ User signed out')
      }
    })

    // Check for redirect result on component mount
    checkRedirectResult()

    return () => unsubscribe()
  }, [])

  const checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        console.log('🔄 Redirect Sign-In Successful!')
        console.log('👤 Display Name:', user.displayName)
        toast.success(`Welcome ${user.displayName}! Signed in via redirect.`)
      }
    } catch (error) {
      console.error('❌ Redirect sign-in error:', error)
      toast.error(`Redirect sign-in failed: ${error.message}`)
    }
  }

  const handleGoogleSignInPopup = async () => {
    setLoading(true)
    try {
      console.log('🚀 Starting Google Sign-In with Popup...')
      
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Log user information to console
      console.log('✅ Google Sign-In Successful!')
      console.log('👤 Display Name:', user.displayName)
      console.log('📧 Email:', user.email)
      console.log('🖼️ Photo URL:', user.photoURL)
      console.log('🆔 UID:', user.uid)
      console.log('🔑 Access Token:', result._tokenResponse?.oauthAccessToken)
      console.log('🔍 Full User Object:', user)
      console.log('📋 Full Result Object:', result)

      // Show success message
      toast.success(`Welcome ${user.displayName}! Successfully signed in with Google.`)
      
    } catch (error) {
      console.error('❌ Google Sign-In Error:', error)
      console.error('Error Code:', error.code)
      console.error('Error Message:', error.message)
      
      // Handle specific error cases
      let errorMessage = 'Failed to sign in with Google'
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in popup was closed. Please try again.'
          break
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked by browser. Please allow popups and try again.'
          break
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in was cancelled. Please try again.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.'
          break
        default:
          errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignInRedirect = async () => {
    setLoading(true)
    try {
      console.log('🔄 Starting Google Sign-In with Redirect...')
      await signInWithRedirect(auth, googleProvider)
      // Note: The page will redirect, so we won't reach this point
    } catch (error) {
      console.error('❌ Google Sign-In Redirect Error:', error)
      toast.error(`Redirect sign-in failed: ${error.message}`)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      console.log('👋 User signed out successfully')
      toast.success('Signed out successfully!')
    } catch (error) {
      console.error('❌ Sign-out error:', error)
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        🔥 Firebase Google Sign-In
      </h2>

      {user ? (
        // User is signed in
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.displayName || 'Anonymous User'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              UID: {user.uid}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">
              ✅ Sign-In Successful!
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              Check the browser console for detailed user information.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        // User is not signed in
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sign-In Method:
              </label>
              <select
                value={signInMethod}
                onChange={(e) => setSignInMethod(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="popup">Popup</option>
                <option value="redirect">Redirect</option>
              </select>
            </div>

            {signInMethod === 'popup' ? (
              <button
                onClick={handleGoogleSignInPopup}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign in with Google (Popup)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleGoogleSignInRedirect}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Sign in with Google (Redirect)</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              📋 Instructions:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Click the button to trigger Google authentication</li>
              <li>• User display name will be logged to console</li>
              <li>• Choose between popup or redirect method</li>
              <li>• Check browser console for detailed logs</li>
            </ul>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
              ⚠️ Requirements:
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
              <li>• Firebase project must have Google Sign-In enabled</li>
              <li>• Domain must be authorized in Firebase Console</li>
              <li>• Popup blockers should be disabled</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleSignIn
