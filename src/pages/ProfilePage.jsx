import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Globe,
  Moon,
  Sun,
  Bell,
  Shield,
  LogOut,
  Calendar
} from 'lucide-react'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const { t, i18n } = useTranslation()
  const { user, userProfile, updateUserProfile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    businessName: userProfile?.businessName || '',
    businessType: userProfile?.businessType || 'street_vendor',
    deliveryAddress: userProfile?.deliveryAddress || {
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    }
  })

  const handleSave = async () => {
    try {
      const result = await updateUserProfile(formData)
      if (result.success) {
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      businessName: userProfile?.businessName || '',
      businessType: userProfile?.businessType || 'street_vendor',
      deliveryAddress: userProfile?.deliveryAddress || {
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
      }
    })
    setIsEditing(false)
  }

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode)
      localStorage.setItem('baazar-dost-language', languageCode)
      toast.success('Language updated!')
    } catch (error) {
      toast.error('Failed to change language')
    }
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut()
    }
  }

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'हिंदी', nativeName: 'हिंदी' },
    { code: 'te', name: 'తెలుగు', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்', nativeName: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ', nativeName: 'ಕನ್ನಡ' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('navigation.profile')}
          </h1>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {formData.name || 'Street Vendor'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formData.businessName || 'Business Name'}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{formData.name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="input-field"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{formData.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Type
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        className="input-field"
                      >
                        <option value="street_vendor">Street Vendor</option>
                        <option value="small_shop">Small Shop</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="catering">Catering Service</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span>{formData.businessType?.replace('_', ' ').toUpperCase() || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        className="input-field"
                        placeholder="Enter your business name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span>{formData.businessName || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Business Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="input-field"
                        rows="3"
                        placeholder="Enter your business address"
                      />
                    ) : (
                      <div className="flex items-start space-x-2 text-gray-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <span>{formData.address || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Delivery Address Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Address
                    </label>
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.deliveryAddress.street}
                          onChange={(e) => setFormData({
                            ...formData,
                            deliveryAddress: {...formData.deliveryAddress, street: e.target.value}
                          })}
                          className="input-field"
                          placeholder="Street Address"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={formData.deliveryAddress.city}
                            onChange={(e) => setFormData({
                              ...formData,
                              deliveryAddress: {...formData.deliveryAddress, city: e.target.value}
                            })}
                            className="input-field"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            value={formData.deliveryAddress.state}
                            onChange={(e) => setFormData({
                              ...formData,
                              deliveryAddress: {...formData.deliveryAddress, state: e.target.value}
                            })}
                            className="input-field"
                            placeholder="State"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={formData.deliveryAddress.pincode}
                            onChange={(e) => setFormData({
                              ...formData,
                              deliveryAddress: {...formData.deliveryAddress, pincode: e.target.value}
                            })}
                            className="input-field"
                            placeholder="Pincode"
                          />
                          <input
                            type="text"
                            value={formData.deliveryAddress.landmark}
                            onChange={(e) => setFormData({
                              ...formData,
                              deliveryAddress: {...formData.deliveryAddress, landmark: e.target.value}
                            })}
                            className="input-field"
                            placeholder="Landmark (Optional)"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2 text-gray-900 dark:text-white">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                          {formData.deliveryAddress.street ? (
                            <div className="space-y-1">
                              <div>{formData.deliveryAddress.street}</div>
                              <div>{formData.deliveryAddress.city}, {formData.deliveryAddress.state} {formData.deliveryAddress.pincode}</div>
                              {formData.deliveryAddress.landmark && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Near: {formData.deliveryAddress.landmark}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span>Not provided</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                      <span className="text-gray-900 dark:text-white">
                        {userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Account status:</span>
                      <span className="text-green-600 dark:text-green-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Language Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Language
              </h3>
              <div className="space-y-2">
                {languages.map(language => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      i18n.language === language.code
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {language.nativeName}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                {theme === 'dark' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
                Theme
              </h3>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>

            {/* Notifications */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Order updates
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    New deals & offers
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Marketing emails
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
