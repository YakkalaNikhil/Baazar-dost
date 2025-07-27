import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import VoiceSearchButton from './VoiceSearchButton'

const SearchBar = ({ onSearch, onResults, className = '', placeholder = '' }) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  // Popular search terms for street vendors
  const popularSearches = [
    'rice', 'wheat flour', 'onions', 'tomatoes', 'potatoes', 
    'cooking oil', 'spices', 'lentils', 'sugar', 'salt',
    'चावल', 'आटा', 'प्याज', 'टमाटर', 'आलू',
    'అన్నం', 'పిండి', 'ఉల్లిపాయలు', 'టమాటాలు', 'బంగాళాదుంపలు',
    'அரிசி', 'மாவு', 'வெங்காயம்', 'தக்காளி', 'உருளைக்கிழங்கு',
    'ಅಕ್ಕಿ', 'ಹಿಟ್ಟು', 'ಈರುಳ್ಳಿ', 'ಟೊಮೇಟೊ', 'ಆಲೂಗಡ್ಡೆ'
  ]

  // Load search history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('baazar-dost-search-history')
      if (savedHistory) {
        const history = JSON.parse(savedHistory)
        setSearchHistory(history)
        setRecentSearches(history.slice(0, 5)) // Show only recent 5
      }
    } catch (error) {
      console.error('Error loading search history:', error)
    }
  }, [])

  // Save search to history
  const saveToHistory = useCallback((searchTerm) => {
    try {
      const newHistory = [
        searchTerm,
        ...searchHistory.filter(item => item !== searchTerm)
      ].slice(0, 20) // Keep only 20 recent searches

      setSearchHistory(newHistory)
      setRecentSearches(newHistory.slice(0, 5))
      localStorage.setItem('baazar-dost-search-history', JSON.stringify(newHistory))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }, [searchHistory])

  // Generate search suggestions
  const generateSuggestions = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    const term = searchTerm.toLowerCase()
    
    // Combine popular searches and history
    const allSuggestions = [...popularSearches, ...searchHistory]
    
    // Filter suggestions based on search term
    const filtered = allSuggestions
      .filter(item => item.toLowerCase().includes(term))
      .filter((item, index, self) => self.indexOf(item) === index) // Remove duplicates
      .slice(0, 8) // Limit to 8 suggestions

    setSuggestions(filtered)
  }, [searchHistory])

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    generateSuggestions(value)
    setShowSuggestions(true)
  }

  // Handle search execution
  const executeSearch = useCallback(async (searchTerm) => {
    const trimmedQuery = searchTerm.trim()
    
    if (!trimmedQuery) {
      toast.warning(t('search.placeholder'))
      return
    }

    setIsSearching(true)
    setShowSuggestions(false)
    
    try {
      // Save to history
      saveToHistory(trimmedQuery)
      
      // Simulate search delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock search results for demonstration
      const mockResults = generateMockResults(trimmedQuery)
      
      // Call parent callbacks
      if (onSearch) {
        onSearch(trimmedQuery)
      }
      
      if (onResults) {
        onResults(mockResults)
      }
      
      toast.success(`${t('search.searchResults')}: ${mockResults.length} items found`)
      
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
      
      if (onResults) {
        onResults([])
      }
    } finally {
      setIsSearching(false)
    }
  }, [onSearch, onResults, saveToHistory, t])

  // Generate mock search results
  const generateMockResults = (searchTerm) => {
    const mockProducts = [
      { id: 1, name: 'Premium Basmati Rice', category: 'Grains', price: 120, unit: 'kg' },
      { id: 2, name: 'Wheat Flour', category: 'Grains', price: 45, unit: 'kg' },
      { id: 3, name: 'Fresh Onions', category: 'Vegetables', price: 30, unit: 'kg' },
      { id: 4, name: 'Tomatoes', category: 'Vegetables', price: 40, unit: 'kg' },
      { id: 5, name: 'Cooking Oil', category: 'Oil', price: 150, unit: 'liter' },
    ]

    // Filter based on search term
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    executeSearch(query)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    executeSearch(suggestion)
  }

  // Handle voice search result
  const handleVoiceResult = (result) => {
    setQuery(result.transcript)
    executeSearch(result.transcript)
  }

  // Handle voice search error
  const handleVoiceError = (error) => {
    console.error('Voice search error:', error)
    // Error is already handled by VoiceSearchButton component
  }

  // Clear search
  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          {/* Search Input */}
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            className="
              w-full pl-12 pr-32 py-4 text-lg
              border border-gray-300 dark:border-gray-600 
              rounded-lg bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100 
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
              transition-colors duration-200
            "
            placeholder={placeholder || t('search.placeholder')}
            disabled={isSearching}
          />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-20 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          )}
          
          {/* Voice Search Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <VoiceSearchButton
              onResult={handleVoiceResult}
              onError={handleVoiceError}
              disabled={isSearching}
              className="h-10"
            />
          </div>
        </div>
        
        {/* Loading Indicator */}
        {isSearching && (
          <div className="absolute inset-y-0 left-12 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent Searches
                </span>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="block w-full text-left px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
          
          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Suggestions
                </span>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left px-2 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <span className="font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
