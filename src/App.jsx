import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

// Components
import LoadingSpinner from './components/UI/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Header from './components/Layout/Header'
import FirebaseDebug from './components/Debug/FirebaseDebug'
import AuthStatus from './components/Debug/AuthStatus'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import SuppliersPage from './pages/SuppliersPage'
import StoresPage from './pages/StoresPage'
import ProfilePage from './pages/ProfilePage'
import SupplierDashboard from './pages/SupplierDashboard'
import HelpPage from './pages/HelpPage'

// Debug Components
import FirebaseTest from './components/Debug/FirebaseTest'
import GoogleSignIn from './components/Auth/GoogleSignIn'
import GoogleSignInDemo from './pages/GoogleSignInDemo'
import AuthTest from './components/Debug/AuthTest'

// Layout Components
import Footer from './components/Layout/Footer'
import VoiceNavigationControl from './components/Voice/VoiceNavigationControl'

// Hooks
import { useAuth } from './contexts/AuthContext'

function AppContent() {
  const { user, userProfile, loading } = useAuth()
  const { i18n } = useTranslation()
  const [isInitialized, setIsInitialized] = useState(false)

  // Debug logging for authentication state
  useEffect(() => {
    console.log('🔍 App Auth State:', {
      user: user ? { uid: user.uid, email: user.email } : null,
      userProfile: userProfile ? { role: userProfile.role, name: userProfile.name } : null,
      loading,
      isInitialized
    })
  }, [user, userProfile, loading, isInitialized])

  useEffect(() => {
    // Initialize app
    const initializeApp = async () => {
      try {
        // Set up language from localStorage or browser
        const savedLanguage = localStorage.getItem('baazar-dost-language')
        if (savedLanguage) {
          await i18n.changeLanguage(savedLanguage)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('App initialization error:', error)
        setIsInitialized(true) // Still initialize even if there's an error
      }
    }

    initializeApp()
  }, [i18n])

  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {user && <Header />}

        <main className={user ? 'pt-16' : ''}>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <RegisterPage />}
            />
            <Route
              path="/"
              element={user ? (
                userProfile?.role === 'supplier' ? <SupplierDashboard /> : <HomePage />
              ) : <Navigate to="/login" replace />}
            />
            <Route
              path="/products"
              element={user ? (
                userProfile?.role === 'supplier' ? <Navigate to="/" replace /> : <ProductsPage />
              ) : <Navigate to="/login" replace />}
            />
            <Route
              path="/product/:productId"
              element={<ProductDetailPage />}
            />
            <Route
              path="/cart"
              element={user ? (
                userProfile?.role === 'supplier' ? <Navigate to="/" replace /> : <CartPage />
              ) : <Navigate to="/login" replace />}
            />
            <Route
              path="/orders"
              element={user ? <OrdersPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/suppliers"
              element={user ? <SuppliersPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/stores"
              element={user ? (
                userProfile?.role === 'supplier' ? <Navigate to="/" replace /> : <StoresPage />
              ) : <Navigate to="/login" replace />}
            />
            <Route
              path="/supplier-dashboard"
              element={user ? <SupplierDashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/help"
              element={<HelpPage />}
            />
            <Route
              path="/auth-test"
              element={<AuthTest />}
            />
            <Route
              path="/firebase-test"
              element={<FirebaseTest />}
            />
            <Route
              path="/google-signin"
              element={<GoogleSignIn />}
            />
            <Route
              path="/google-signin-demo"
              element={<GoogleSignInDemo />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Voice Navigation Control */}
        {user && <VoiceNavigationControl />}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="text-sm"
        />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
            <AuthStatus />
            <FirebaseDebug />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
