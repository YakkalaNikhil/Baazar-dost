import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  Package,
  MapPin,
  Clock,
  TrendingUp,
  History,
  ArrowRight
} from 'lucide-react'
import { products } from '../../data/products'
import { stores } from '../../data/stores'

const GlobalSearch = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ products: [], stores: [], suggestions: [] })
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('baazar-dost-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search functionality
  useEffect(() => {
    if (query.length < 2) {
      setResults({ products: [], stores: [], suggestions: [] })
      return
    }

    const searchProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5)

    const searchStores = stores.filter(store =>
      store.name.toLowerCase().includes(query.toLowerCase()) ||
      store.address.toLowerCase().includes(query.toLowerCase()) ||
      store.specialties.some(s => s.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 3)

    const suggestions = [
      'Basmati Rice',
      'Turmeric Powder',
      'Red Chili Powder',
      'Cumin Seeds',
      'Garam Masala',
      'Coriander Seeds',
      'Black Pepper',
      'Cardamom'
    ].filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4)

    setResults({ products: searchProducts, stores: searchStores, suggestions })
    setSelectedIndex(-1)
  }, [query])

  const saveRecentSearch = (searchQuery) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('baazar-dost-recent-searches', JSON.stringify(updated))
  }

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    const totalResults = results.products.length + results.stores.length + results.suggestions.length
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % totalResults)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev <= 0 ? totalResults - 1 : prev - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0) {
        // Handle selection based on index
        if (selectedIndex < results.products.length) {
          const product = results.products[selectedIndex]
          navigate(`/products?search=${encodeURIComponent(product.name)}`)
        } else if (selectedIndex < results.products.length + results.stores.length) {
          navigate('/stores')
        } else {
          const suggestionIndex = selectedIndex - results.products.length - results.stores.length
          handleSearch(results.suggestions[suggestionIndex])
        }
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('baazar-dost-recent-searches')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, stores, or categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.length < 2 ? (
              /* Recent Searches & Suggestions */
              <div className="p-4">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <History className="w-4 h-4 mr-2" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Popular Searches
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Rice', 'Spices', 'Oil', 'Flour', 'Pulses', 'Vegetables'].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(item)}
                        className="text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Search Results */
              <div className="p-4 space-y-4">
                {/* Products */}
                {results.products.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Products ({results.products.length})
                    </h3>
                    <div className="space-y-2">
                      {results.products.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            navigate(`/products?search=${encodeURIComponent(product.name)}`)
                            onClose()
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            selectedIndex === index
                              ? 'bg-primary-50 dark:bg-primary-900/20'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ₹{product.price} • {product.category}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stores */}
                {results.stores.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Stores ({results.stores.length})
                    </h3>
                    <div className="space-y-2">
                      {results.stores.map((store, index) => (
                        <button
                          key={store.id}
                          onClick={() => {
                            navigate('/stores')
                            onClose()
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            selectedIndex === results.products.length + index
                              ? 'bg-primary-50 dark:bg-primary-900/20'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {store.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {store.address.split(',')[0]}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {results.suggestions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Suggestions
                    </h3>
                    <div className="space-y-2">
                      {results.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(suggestion)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedIndex === results.products.length + results.stores.length + index
                              ? 'bg-primary-50 dark:bg-primary-900/20'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-gray-600 dark:text-gray-400">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {results.products.length === 0 && results.stores.length === 0 && results.suggestions.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try different keywords or browse our categories
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearch
