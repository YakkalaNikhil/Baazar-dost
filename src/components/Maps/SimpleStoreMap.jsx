import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  ExternalLink,
  Verified
} from 'lucide-react'
import { stores, storeTypes } from '../../data/stores'

const SimpleStoreMap = ({ 
  selectedStore = null, 
  userLocation = null, 
  height = '400px',
  filteredStores = stores 
}) => {
  const { t } = useTranslation()
  const [selectedStoreId, setSelectedStoreId] = useState(selectedStore?.id || null)

  // Create Google Maps embed URL
  const createMapUrl = () => {
    const center = userLocation 
      ? `${userLocation.lat},${userLocation.lng}`
      : '19.0760,72.8777' // Mumbai center
    
    // Add markers for all stores
    const markers = filteredStores.map(store => 
      `markers=color:red%7Clabel:${store.name.charAt(0)}%7C${store.coordinates[0]},${store.coordinates[1]}`
    ).join('&')
    
    // Add user location marker if available
    const userMarker = userLocation 
      ? `&markers=color:blue%7Clabel:You%7C${userLocation.lat},${userLocation.lng}`
      : ''
    
    return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHHqfeaM&center=${center}&zoom=12&${markers}${userMarker}`
  }

  const StoreCard = ({ store, isSelected }) => (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setSelectedStoreId(store.id)}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: storeTypes[store.type]?.color || '#3B82F6' }}
          >
            {storeTypes[store.type]?.icon || '🏪'}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {store.name}
            </h3>
            {store.verified && (
              <Verified className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
            )}
          </div>
          
          <p className="text-xs text-gray-600 mt-1">
            {storeTypes[store.type]?.name}
          </p>
          
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs">{store.rating}</span>
            </div>
            {store.distance && (
              <span className="text-xs text-gray-500">{store.distance} km</span>
            )}
          </div>
          
          <div className="flex space-x-2 mt-3">
            <a
              href={`tel:${store.phone}`}
              className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3 h-3" />
              <span>Call</span>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${store.coordinates[0]},${store.coordinates[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation className="w-3 h-3" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height }}>
      {/* Map Section */}
      <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Interactive Map
          </h3>
          <p className="text-gray-600 mb-4">
            Click on stores below to see their locations
          </p>
          {userLocation && (
            <div className="text-sm text-green-600 mb-4">
              📍 Your location detected
            </div>
          )}
          <a
            href={`https://www.google.com/maps/search/stores/@${userLocation?.lat || 19.0760},${userLocation?.lng || 72.8777},13z`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>

      {/* Store List */}
      <div className="space-y-3 max-h-full overflow-y-auto">
        <h3 className="font-semibold text-gray-900 mb-3">
          Nearby Stores ({filteredStores.length})
        </h3>
        
        {filteredStores.map((store) => (
          <StoreCard 
            key={store.id} 
            store={store} 
            isSelected={selectedStoreId === store.id}
          />
        ))}
        
        {filteredStores.length === 0 && (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No stores found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleStoreMap
