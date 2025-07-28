import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../config/firebase'
import { toast } from 'react-toastify'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  // Action code settings for email link
  const actionCodeSettings = {
    url: window.location.origin + '/login',
    handleCodeInApp: true,
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log('🔄 Auth state changed:', firebaseUser ? 'User signed in' : 'User signed out')

        if (firebaseUser) {
          console.log('👤 User details:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          })

          setUser(firebaseUser)
          console.log('📋 Loading user profile...')
          await loadUserProfile(firebaseUser.uid)
          console.log('✅ User profile loaded successfully')
        } else {
          console.log('👋 User signed out')
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error)
        toast.error('Authentication error occurred')
      } finally {
        setLoading(false)
        console.log('🏁 Auth loading completed')
      }
    })

    // Check if user is signing in with email link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      handleEmailLinkSignIn()
    } else {
      // Check for Google redirect result
      checkGoogleRedirectResult()
      setLoading(false)
    }

    return unsubscribe
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        const profileData = userDoc.data()
        setUserProfile(profileData)
        console.log('✅ User profile loaded:', profileData)
      } else {
        console.log('⚠️ No user profile found for:', userId)
        setUserProfile(null) // Set to null to trigger account setup
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      toast.error('Failed to load user profile')
      setUserProfile(null)
    }
  }

  const createUserProfile = async (profileData) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user')
      }

      const userId = auth.currentUser.uid
      const completeProfile = {
        ...profileData,
        uid: userId,
        email: profileData.email || auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
        provider: auth.currentUser.providerData[0]?.providerId || 'email',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: true
        },
        accountSetupCompleted: true
      }

      await setDoc(doc(db, 'users', userId), completeProfile)
      setUserProfile(completeProfile)
      console.log('✅ User profile created successfully')

      return { success: true }
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  const createOrUpdateGoogleUserProfile = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))

      if (userDoc.exists()) {
        // Update existing profile with latest Google data
        const updateData = {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          updatedAt: serverTimestamp()
        }

        await setDoc(doc(db, 'users', user.uid), updateData, { merge: true })
        console.log('✅ Updated existing user profile with Google data')

        // Load the updated profile
        await loadUserProfile(user.uid)
      } else {
        // Don't automatically create profile - let user go through setup
        console.log('⚠️ New Google user - will need account setup')
        setUserProfile(null) // This will trigger account setup flow
      }
    } catch (error) {
      console.error('Error handling Google user profile:', error)
      toast.error('Failed to load user profile')
      setUserProfile(null)
    }
  }

  const sendLoginLink = async (email) => {
    try {
      setLoading(true)
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      
      // Save email to localStorage for the sign-in process
      localStorage.setItem('emailForSignIn', email)
      
      toast.success('Login link sent to your email!')
      return { success: true }
    } catch (error) {
      console.error('Error sending login link:', error)
      let errorMessage = 'Failed to send login link'
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later'
          break
        default:
          errorMessage = error.message || 'Failed to send login link'
      }
      
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLinkSignIn = async () => {
    try {
      setLoading(true)
      let email = localStorage.getItem('emailForSignIn')

      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }

      if (email) {
        const result = await signInWithEmailLink(auth, email, window.location.href)
        localStorage.removeItem('emailForSignIn')

        // Check if this is a new user registration
        const pendingRegistration = localStorage.getItem('pendingRegistration')
        if (pendingRegistration && result.user) {
          try {
            const registrationData = JSON.parse(pendingRegistration)

            // Validate registration data
            if (!registrationData.name || !registrationData.role || !registrationData.businessName) {
              throw new Error('Missing required registration data')
            }

            // Create user profile with registration data
            const userProfile = {
              uid: result.user.uid,
              email: result.user.email,
              name: registrationData.name,
              phone: registrationData.phone,
              businessName: registrationData.businessName,
              businessType: registrationData.businessType,
              vendorType: registrationData.vendorType,
              address: registrationData.address,
              role: registrationData.role,
              isActive: true,
              profileComplete: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              preferences: {
                language: 'en',
                theme: 'light',
                notifications: true
              }
            }

            await setDoc(doc(db, 'users', result.user.uid), userProfile)
            localStorage.removeItem('pendingRegistration')

            toast.success(`Welcome to Baazar Dost! Registered as ${registrationData.role}`)
          } catch (profileError) {
            console.error('Error creating user profile:', profileError)
            toast.error('Registration completed but failed to save profile')
          }
        } else {
          toast.success('Successfully signed in!')
        }

        // Clear the URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    } catch (error) {
      console.error('Error signing in with email link:', error)
      let errorMessage = 'Failed to sign in'

      switch (error.code) {
        case 'auth/invalid-action-code':
          errorMessage = 'Invalid or expired login link'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          break
        default:
          errorMessage = error.message || 'Failed to sign in'
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (method = 'popup', retryWithRedirect = true) => {
    try {
      setLoading(true)
      let result

      if (method === 'popup') {
        console.log('🚀 Starting Google Sign-In with Popup...')

        // Add timeout for popup
        const popupPromise = signInWithPopup(auth, googleProvider)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('popup-timeout')), 30000)
        )

        result = await Promise.race([popupPromise, timeoutPromise])
      } else {
        console.log('🔄 Starting Google Sign-In with Redirect...')
        await signInWithRedirect(auth, googleProvider)
        return { success: true, message: 'Redirecting...' }
      }

      const user = result.user

      // Log user information to console
      console.log('✅ Google Sign-In Successful!')
      console.log('👤 Display Name:', user.displayName)
      console.log('📧 Email:', user.email)
      console.log('🖼️ Photo URL:', user.photoURL)
      console.log('🆔 UID:', user.uid)
      console.log('🔍 Full User Object:', user)

      // Create or update user profile with Google data
      await createOrUpdateGoogleUserProfile(user)

      toast.success(`Welcome ${user.displayName}! Successfully signed in with Google.`)
      return { success: true, user }

    } catch (error) {
      console.error('❌ Google Sign-In Error:', error)

      // Auto-retry with redirect for popup issues
      if (method === 'popup' && retryWithRedirect && (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.message === 'popup-timeout'
      )) {
        console.log('🔄 Popup failed, trying redirect method...')
        toast.info('Popup blocked or closed. Trying redirect method...')
        return await signInWithGoogle('redirect', false)
      }

      let errorMessage = 'Failed to sign in with Google'

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in popup was closed. Trying redirect method...'
          break
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked by browser. Trying redirect method...'
          break
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in was cancelled. Trying redirect method...'
          break
        case 'popup-timeout':
          errorMessage = 'Popup timed out. Trying redirect method...'
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
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const checkGoogleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        console.log('🔄 Google Redirect Sign-In Successful!')
        console.log('👤 Display Name:', user.displayName)

        // Create or update user profile with Google data
        await createOrUpdateGoogleUserProfile(user)

        toast.success(`Welcome ${user.displayName}! Signed in via redirect.`)
        return { success: true, user }
      }
    } catch (error) {
      console.error('❌ Google redirect sign-in error:', error)
      toast.error(`Redirect sign-in failed: ${error.message}`)
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await firebaseSignOut(auth)
      setUser(null)
      setUserProfile(null)
      localStorage.removeItem('emailForSignIn')
      toast.success('Successfully signed out!')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const updatedProfile = {
        ...userProfile,
        ...updates,
        updatedAt: serverTimestamp()
      }
      
      await setDoc(doc(db, 'users', user.uid), updatedProfile, { merge: true })
      setUserProfile(updatedProfile)
      
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    sendLoginLink,
    signInWithGoogle,
    createUserProfile,
    checkGoogleRedirectResult,
    signOut,
    updateUserProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
