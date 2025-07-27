import React from 'react'
import GoogleSignIn from '../components/Auth/GoogleSignIn'

const GoogleSignInDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🔥 Firebase Google Sign-In Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Firebase v9 Modular SDK Integration with Google Authentication
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4">
              📋 Implementation Features:
            </h2>
            <ul className="space-y-2 text-blue-800 dark:text-blue-400">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Firebase v9 Modular SDK integration</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Google Sign-In with popup and redirect methods</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>User display name logged to console after successful sign-in</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Comprehensive error handling and user feedback</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Real-time auth state monitoring</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>User profile display with photo and information</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Sign-out functionality</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Sign-In Component */}
        <div className="mb-12">
          <GoogleSignIn />
        </div>

        {/* Code Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Firebase Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔧 Firebase Configuration
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-gray-800 dark:text-gray-200">
{`// firebase.js
import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider 
} from 'firebase/auth'

const firebaseConfig = {
  // Your Firebase config
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({
  prompt: 'select_account'
})`}
              </code>
            </pre>
          </div>

          {/* Sign-In Implementation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🚀 Sign-In Implementation
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-gray-800 dark:text-gray-200">
{`// Google Sign-In with Popup
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(
      auth, 
      googleProvider
    )
    const user = result.user
    
    // Log user display name
    console.log('Display Name:', user.displayName)
    console.log('Email:', user.email)
    console.log('Photo URL:', user.photoURL)
    
  } catch (error) {
    console.error('Sign-in error:', error)
  }
}`}
              </code>
            </pre>
          </div>

          {/* Auth State Monitoring */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              👁️ Auth State Monitoring
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-gray-800 dark:text-gray-200">
{`// Monitor authentication state
import { onAuthStateChanged } from 'firebase/auth'

useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth, 
    (user) => {
      if (user) {
        console.log('User signed in:', user.displayName)
        setUser(user)
      } else {
        console.log('User signed out')
        setUser(null)
      }
    }
  )
  
  return () => unsubscribe()
}, [])`}
              </code>
            </pre>
          </div>

          {/* Error Handling */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🛡️ Error Handling
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-gray-800 dark:text-gray-200">
{`// Handle specific error cases
switch (error.code) {
  case 'auth/popup-closed-by-user':
    message = 'Popup was closed'
    break
  case 'auth/popup-blocked':
    message = 'Popup was blocked'
    break
  case 'auth/network-request-failed':
    message = 'Network error'
    break
  default:
    message = error.message
}`}
              </code>
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-4">
            📝 Setup Instructions:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800 dark:text-yellow-400">
            <li>Enable Google Sign-In in Firebase Console → Authentication → Sign-in method</li>
            <li>Add your domain (localhost:5173) to authorized domains</li>
            <li>Configure OAuth consent screen in Google Cloud Console</li>
            <li>Ensure popup blockers are disabled in your browser</li>
            <li>Open browser console to see detailed logs</li>
          </ol>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <a
              href="/firebase-test"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🔥 Firebase Test
            </a>
            <a
              href="/"
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              🏠 Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleSignInDemo
