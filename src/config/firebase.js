import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase configuration - Your actual Firebase project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCf26KYPMRzoYp_iSHRE3ZLeXphD_RHtKk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "baazar-dost.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "baazar-dost",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "baazar-dost.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1064183964926",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1064183964926:web:d612eb76031251ddd871af",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H82SF43N80"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Test Firebase connection
console.log('🔥 Firebase initialized with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-4) : 'missing',
  environment: import.meta.env.NODE_ENV || 'development',
  host: typeof window !== 'undefined' ? window.location.host : 'server'
})

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
]

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName])
if (missingVars.length > 0) {
  console.error('❌ Missing required Firebase environment variables:', missingVars)
} else {
  console.log('✅ All required Firebase environment variables are set')
}

// Initialize Analytics (only in production)
let analytics = null
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.warn('Analytics initialization failed:', error)
  }
}
export { analytics }

// Connect to emulators in development (disabled for production Firebase)
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    // Only connect if not already connected
    if (!auth._delegate._config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    }
    if (!db._delegate._databaseId.projectId.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
    if (!storage._delegate._host.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199)
    }
    console.log('🔧 Connected to Firebase emulators')
  } catch (error) {
    console.log('Firebase emulators already connected or not available')
  }
} else {
  console.log('🔥 Using production Firebase project: baazar-dost')
}

export default app
