import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Store, 
  ArrowRight,
  CheckCircle,
  Navigation
} from 'lucide-react'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { vendorTypes } from '../data/products'
import { getCurrentLocation } from '../utils/location'

const RegisterPage = () => {
  const { t } = useTranslation()
  const { sendLoginLink, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    businessName: '',
    businessType: '',
    vendorType: '',
    address: '',
    role: 'vendor' // vendor or supplier
  })
  const [emailSent, setEmailSent] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  // Get current location for suppliers
  useEffect(() => {
    if (formData.role === 'supplier') {
      getLocation()
    }
  }, [formData.role])

  const getLocation = async () => {
    setLocationLoading(true)
    try {
      const locationData = await getCurrentLocation()
      setLocation(locationData)
      toast.success('Location detected successfully!')
    } catch (error) {
      console.error('Error getting location:', error)
      setLocationLoading(false)
      toast.error(error.message || 'Could not get your location. Please enable location services.')
    } finally {
      setLocationLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.name || !formData.role) {
        toast.error('Please fill in all required fields')
        return
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        return
      }
    } else if (step === 2) {
      if (formData.role === 'supplier') {
        if (!formData.businessName || !formData.businessType) {
          toast.error('Please fill in all business details')
          return
        }
      } else {
        if (!formData.businessName || !formData.vendorType) {
          toast.error('Please fill in all business details')
          return
        }
      }
    }
    setStep(step + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Comprehensive validation
    if (!formData.address || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number')
      return
    }

    // Validate required fields based on role
    if (formData.role === 'supplier') {
      if (!formData.businessName || !formData.businessType) {
        toast.error('Please fill in all business details')
        return
      }
      if (!location) {
        toast.error('Location is required for suppliers. Please enable location services.')
        return
      }
    } else {
      if (!formData.businessName || !formData.vendorType) {
        toast.error('Please fill in all business details')
        return
      }
    }

    try {
      // Include location data for suppliers
      const registrationData = {
        ...formData,
        ...(formData.role === 'supplier' && location && { location })
      }

      // Store registration data in localStorage for completion after email verification
      localStorage.setItem('pendingRegistration', JSON.stringify(registrationData))

      const result = await sendLoginLink(formData.email.trim())
      if (result.success) {
        setEmailSent(true)
        toast.success('Registration link sent! Check your email to complete registration.')
      } else {
        toast.error(result.error || 'Failed to send registration link')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
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
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Check Your Email
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We've sent a registration link to <strong>{formData.email}</strong>
            </p>
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                What happens next?
              </h3>
              <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1 text-left">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the secure registration link</li>
                <li>• Your account will be activated automatically</li>
                <li>• Start browsing products immediately</li>
              </ul>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Click the link in your email to complete your registration as a {formData.role}.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="mt-4 text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              Use a different email address
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
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
            Join {t('app.name')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Register as a vendor or supplier
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNum ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            {/* Step 1: Role & Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    I want to register as:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('role', 'vendor')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        formData.role === 'vendor'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Store className="w-6 h-6 text-primary-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Vendor</div>
                          <div className="text-sm text-gray-500">Street vendor, shop owner</div>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleInputChange('role', 'supplier')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        formData.role === 'supplier'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <User className="w-6 h-6 text-primary-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">Supplier</div>
                          <div className="text-sm text-gray-500">Wholesale supplier</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Business Details
                </h3>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="input-field"
                    placeholder="Enter your business name"
                  />
                </div>

                {/* Vendor Type (only for vendors) */}
                {formData.role === 'vendor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      What type of vendor are you? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {vendorTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleInputChange('vendorType', type.id)}
                          className={`p-3 border-2 rounded-lg text-left transition-colors ${
                            formData.vendorType === type.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{type.icon}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {type.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Business Type (for suppliers) */}
                {formData.role === 'supplier' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type *
                    </label>
                    <select
                      required
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select business type</option>
                      <option value="wholesale">Wholesale Supplier</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="distributor">Distributor</option>
                      <option value="farmer">Farmer/Producer</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Contact Details */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Contact Details
                </h3>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Business Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="input-field pl-10"
                      rows="3"
                      placeholder="Enter your complete business address"
                    />
                  </div>
                </div>

                {/* Location for Suppliers */}
                {formData.role === 'supplier' && (
                  <div className={`p-4 rounded-lg border-2 ${
                    location
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Navigation className={`w-5 h-5 ${
                          location ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                        }`} />
                        <div>
                          <h4 className={`text-sm font-medium ${
                            location ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {location ? 'Location Detected' : 'Location Required'}
                          </h4>
                          <p className={`text-xs ${
                            location ? 'text-green-600 dark:text-green-300' : 'text-yellow-600 dark:text-yellow-300'
                          }`}>
                            {location
                              ? `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`
                              : 'We need your location to help customers find you'
                            }
                          </p>
                        </div>
                      </div>
                      {!location && (
                        <button
                          type="button"
                          onClick={getLocation}
                          disabled={locationLoading}
                          className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-md hover:bg-yellow-700 disabled:opacity-50"
                        >
                          {locationLoading ? 'Getting...' : 'Enable Location'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Registration Summary
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>Role:</strong> {formData.role}</p>
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Business:</strong> {formData.businessName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary ml-auto flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary ml-auto flex items-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Google Sign-In - Only show on step 1 */}
        {step === 1 && (
          <>
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
                  <span>Sign up with Google</span>
                </>
              )}
            </button>
          </>
        )}

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
