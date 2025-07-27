import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/Search/SearchBar'
import LanguageSwitcher from '../components/UI/LanguageSwitcher'
import { toast } from 'react-toastify'

import {
  ShoppingCart,
  MapPin,
  Map,
  Percent,
  Package,
  History,
  Globe,
  Sun,
  Moon,
  Star,
  Clock,
  TrendingUp,
  Users,
  Phone
} from 'lucide-react'

const HomePage = () => {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { getCartItemCount, addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const cartItemCount = getCartItemCount()

  const handleSearch = (query) => {
    setIsSearching(true)
    console.log('Searching for:', query)
    // Search logic will be implemented here
  }

  const handleSearchResults = (results) => {
    setSearchResults(results)
    setIsSearching(false)
  }

  const quickActions = [
    {
      title: t('navigation.products'),
      description: 'Browse and order raw materials',
      icon: Package,
      href: '/products',
      color: 'bg-blue-500',
      badge: '50+ Items',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      title: t('navigation.cart'),
      description: 'Review your cart and checkout',
      icon: ShoppingCart,
      href: '/cart',
      color: 'bg-green-500',
      badge: cartItemCount > 0 ? `${cartItemCount} Items` : 'Empty',
      badgeColor: cartItemCount > 0
        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    },
    {
      title: t('navigation.suppliers'),
      description: 'Find nearby stores with GPS & directions',
      icon: Map,
      href: '/stores',
      color: 'bg-purple-500',
      badge: '8 Stores',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      title: t('navigation.orders'),
      description: 'View your order history',
      icon: History,
      href: '/orders',
      color: 'bg-orange-500',
      badge: 'Track Orders',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.welcome')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            {t('home.subtitle')}
          </p>

          {/* Enhanced Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            onResults={handleSearchResults}
            className="mb-8"
          />

          {/* New User Call-to-Action */}
          {!user && (
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-8 mb-8 border border-primary-200 dark:border-primary-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Your Business Journey?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Join thousands of vendors and suppliers already using Baazar Dost.
                Get access to wholesale prices, bulk discounts, and a trusted marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary px-8 py-3 text-lg font-medium"
                >
                  Start Selling Today
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  I Have an Account
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search Results ({searchResults.length} items)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <div key={product.id} className="card hover:shadow-lg transition-shadow">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold text-primary-600">₹{product.price}/{product.unit}</span>
                      <button
                        onClick={async () => {
                          try {
                            const result = await addToCart({
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              unit: product.unit,
                              category: product.category,
                              image: '/api/placeholder/150/150',
                              description: product.description || `${product.name} - ${product.category}`
                            }, 1, 'unit')

                            if (result.success) {
                              toast.success(`${product.name} added to cart!`)
                            }
                          } catch (error) {
                            toast.error('Failed to add item to cart')
                            console.error('Error adding to cart:', error)
                          }
                        }}
                        className="btn-primary text-sm px-3 py-1 hover:bg-primary-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Grid - Vendor Friendly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div
                key={index}
                className="relative card hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:scale-105 border-l-4 border-primary-500"
                onClick={() => navigate(action.href)}
              >
                {/* Badge */}
                {action.badge && (
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${action.badgeColor}`}>
                    {action.badge}
                  </div>
                )}

                <div className="flex items-center space-x-4 p-2">
                  <div className={`${action.color} p-4 rounded-xl group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base">
                      {action.description}
                    </p>
                    <div className="flex items-center mt-2 text-primary-600 dark:text-primary-400">
                      <span className="text-sm font-medium">Tap to explore</span>
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Today's Deals Section - Enhanced */}
        <div className="card mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Percent className="w-6 h-6 mr-2 text-primary-600" />
              {t('deals.title')}
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Limited Time
              </span>
            </h2>
            <button
              onClick={() => navigate('/products')}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              {t('deals.viewAll')}
              <TrendingUp className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Real deals data */}
            {[
              {
                id: 1,
                name: 'Premium Basmati Rice',
                description: 'High quality aged basmati rice',
                originalPrice: 1200,
                salePrice: 960,
                discount: 20,
                unit: '25kg bag',
                supplier: 'Raj Traders',
                rating: 4.8,
                timeLeft: '2 hours'
              },
              {
                id: 2,
                name: 'Fresh Onions',
                description: 'Farm fresh red onions',
                originalPrice: 40,
                salePrice: 32,
                discount: 20,
                unit: 'per kg',
                supplier: 'Green Valley',
                rating: 4.6,
                timeLeft: '5 hours'
              },
              {
                id: 3,
                name: 'Cooking Oil',
                description: 'Refined sunflower oil',
                originalPrice: 180,
                salePrice: 153,
                discount: 15,
                unit: '1 liter',
                supplier: 'Oil Mart',
                rating: 4.7,
                timeLeft: '1 day'
              }
            ].map((deal) => (
              <div key={deal.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                    {deal.discount}% OFF
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs ml-1 text-gray-600 dark:text-gray-400">{deal.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-lg">
                  {deal.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {deal.description}
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mb-3">
                  by {deal.supplier}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹{deal.salePrice}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">₹{deal.originalPrice}</span>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{deal.unit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-red-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{deal.timeLeft} left</span>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        console.log('Adding to cart:', deal.name)
                        const productData = {
                          productId: deal.id,
                          name: deal.name,
                          price: deal.salePrice,
                          originalPrice: deal.originalPrice,
                          unit: deal.unit,
                          supplier: deal.supplier,
                          image: '/api/placeholder/150/150',
                          category: 'deals',
                          description: deal.description
                        }
                        console.log('Product data:', productData)

                        const result = await addToCart(productData, 1, 'unit')
                        console.log('Add to cart result:', result)

                        if (result.success) {
                          toast.success(`${deal.name} added to cart!`)
                        } else {
                          toast.error(result.error || 'Failed to add item to cart')
                        }
                      } catch (error) {
                        toast.error('Failed to add item to cart')
                        console.error('Error adding to cart:', error)
                      }
                    }}
                    className="btn-primary text-sm px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Support Section */}
        <div className="card mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Need Help? We're Here for You!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              24/7 support for street vendors in your language
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Call Support</span>
            </button>
            <button className="flex items-center justify-center space-x-3 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-medium">Community</span>
            </button>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Voice Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Search for products using your voice in Hindi, Telugu, Tamil, Kannada, or English. Just speak naturally!
            </p>
            <div className="mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium">
              ✓ Works offline • ✓ 5 languages supported
            </div>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Nearby Suppliers
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Find verified grocery suppliers within 5km of your location. Compare prices and ratings instantly.
            </p>
            <div className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ GPS enabled • ✓ Verified suppliers only
            </div>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Smart Ordering
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              Order in units or bulk with special vendor pricing. Get GST invoices and track deliveries in real-time.
            </p>
            <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium">
              ✓ Bulk discounts • ✓ GST compliant • ✓ Live tracking
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default HomePage
