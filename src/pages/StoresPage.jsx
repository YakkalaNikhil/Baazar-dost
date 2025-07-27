import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import StoreMap from '../components/Maps/StoreMap'
import SimpleStoreMap from '../components/Maps/SimpleStoreMap'
import { 
  stores, 
  storeTypes, 
  getStoresByDistance, 
  getStoresByType,
  calculateDistance 
} from '../data/stores'
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Filter,
  Navigation,
  Verified,
  Search,
  List,
  Map as MapIcon,
  Target
} from 'lucide-react'

const StoresPage = () => {
  const { t } = useTranslation()
  const { userProfile } = useAuth()
  const [selectedStore, setSelectedStore] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [filteredStores, setFilteredStores] = useState(stores)
  const [selectedType, setSelectedType] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('both') // 'map', 'list', 'both'
  const [sortBy, setSortBy] = useState('distance')
  const [locationError, setLocationError] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [mapError, setMapError] = useState(false)

  // Get user location
  const getUserLocation = () => {
    setLoadingLocation(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      setLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setUserLocation(location)
        setLoadingLocation(false)
        
        // Update store distances
        const storesWithDistance = stores.map(store => ({
          ...store,
          distance: calculateDistance(
            location.lat, 
            location.lng, 
            store.coordinates[0], 
            store.coordinates[1]
          )
        }))
        setFilteredStores(storesWithDistance)
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enable location services.')
        setLoadingLocation(false)
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // Filter and sort stores
  useEffect(() => {
    let filtered = stores

    // Filter by type
    if (selectedType) {
      filtered = getStoresByType(selectedType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Add distance if user location is available
    if (userLocation) {
      filtered = filtered.map(store => ({
        ...store,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          store.coordinates[0],
          store.coordinates[1]
        )
      }))
    }

    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 999) - (b.distance || 999)
        case 'rating':
          return b.rating - a.rating
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredStores(filtered)
  }, [selectedType, searchQuery, userLocation, sortBy])

  // Auto-get location on component mount
  useEffect(() => {
    getUserLocation()
  }, [])

  const StoreCard = ({ store }) => (
    <div 
      className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selectedStore?.id === store.id ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={() => setSelectedStore(store)}
    >
      {/* Store Image */}
      <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
        <img 
          src={store.image} 
          alt={store.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
          }}
        />
      </div>

      {/* Store Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {store.name}
          </h3>
          {store.verified && (
            <Verified className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2" />
          )}
        </div>

        {/* Store Type */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">{storeTypes[store.type]?.icon}</span>
          <span className="text-sm font-medium text-gray-600">
            {storeTypes[store.type]?.name}
          </span>
        </div>

        {/* Rating and Distance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{store.rating}</span>
          </div>
          {store.distance && (
            <span className="text-sm text-gray-500">{store.distance} km away</span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 leading-tight line-clamp-2">
            {store.address}
          </span>
        </div>

        {/* Contact */}
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{store.phone}</span>
        </div>

        {/* Hours */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{store.openHours}</span>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {store.specialties.slice(0, 3).map((specialty, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {t(`categories.${specialty}`, specialty)}
            </span>
          ))}
          {store.specialties.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{store.specialties.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <a
            href={`tel:${store.phone}`}
            className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${store.coordinates[0]},${store.coordinates[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Navigation className="w-4 h-4" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  )

  // Restrict access for suppliers
  if (userProfile?.role === 'supplier') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <MapIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Suppliers cannot access the store locator. Please use your supplier dashboard to manage your business.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('navigation.suppliers')}
          </h1>
          
          {/* Location Status */}
          <div className="mb-4">
            {loadingLocation && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Getting your location...</span>
              </div>
            )}
            
            {locationError && (
              <div className="flex items-center space-x-2 text-red-600">
                <span className="text-sm">{locationError}</span>
                <button 
                  onClick={getUserLocation}
                  className="text-sm underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            )}
            
            {userLocation && !loadingLocation && (
              <div className="flex items-center space-x-2 text-green-600">
                <Target className="w-4 h-4" />
                <span className="text-sm">Location found - showing nearest stores</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stores, locations, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                <MapIcon className="w-4 h-4 inline mr-1" />
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4 inline mr-1" />
                List
              </button>
              <button
                onClick={() => setViewMode('both')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'both' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                }`}
              >
                Both
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Store Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Store Types</option>
                {Object.entries(storeTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary-500"
            >
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
            </select>

            {/* Get Location Button */}
            <button
              onClick={getUserLocation}
              disabled={loadingLocation}
              className="btn-secondary text-sm px-3 py-1 flex items-center space-x-1"
            >
              <Target className="w-4 h-4" />
              <span>{loadingLocation ? 'Getting...' : 'Get Location'}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`grid gap-6 ${
          viewMode === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'
        }`}>
          {/* Map */}
          {(viewMode === 'map' || viewMode === 'both') && (
            <div className="order-1 lg:order-1">
              {!mapError ? (
                <div className="relative">
                  <StoreMap
                    selectedStore={selectedStore}
                    userLocation={userLocation}
                    height={viewMode === 'both' ? '500px' : '600px'}
                    filteredStores={filteredStores}
                  />
                  {/* Fallback button if map fails */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setMapError(true)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Switch to Simple View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Store Locations</h3>
                    <button
                      onClick={() => setMapError(false)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Try Interactive Map
                    </button>
                  </div>
                  <SimpleStoreMap
                    selectedStore={selectedStore}
                    userLocation={userLocation}
                    height={viewMode === 'both' ? '500px' : '600px'}
                    filteredStores={filteredStores}
                  />
                </div>
              )}
            </div>
          )}

          {/* Store List */}
          {(viewMode === 'list' || viewMode === 'both') && (
            <div className="order-2 lg:order-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Nearby Stores ({filteredStores.length})
                </h2>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredStores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
                
                {filteredStores.length === 0 && (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No stores found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoresPage
