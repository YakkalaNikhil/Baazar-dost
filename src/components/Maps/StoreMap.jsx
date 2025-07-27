import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Navigation,
  Verified,
  ExternalLink
} from 'lucide-react'
import { stores, storeTypes } from '../../data/stores'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons for different store types
const createCustomIcon = (storeType) => {
  const typeInfo = storeTypes[storeType] || storeTypes.wholesale
  return L.divIcon({
    html: `
      <div style="
        background-color: ${typeInfo.color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-size: 14px;
      ">
        ${typeInfo.icon}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

// User location marker
const userLocationIcon = L.divIcon({
  html: `
    <div style="
      background-color: #EF4444;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>
  `,
  className: 'user-location-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

// Helper function to create store popup HTML
const createStorePopupHTML = (store, t) => {
  return `
    <div class="p-3 max-w-sm">
      <div class="w-full h-32 mb-3 rounded-lg overflow-hidden">
        <img
          src="${store.image}"
          alt="${store.name}"
          class="w-full h-full object-cover"
          onerror="this.src='https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-start justify-between">
          <h3 class="font-bold text-lg text-gray-900 leading-tight">
            ${store.name}
          </h3>
          ${store.verified ? '<div class="w-5 h-5 text-blue-500 ml-2">✓</div>' : ''}
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-lg">${storeTypes[store.type]?.icon || '🏪'}</span>
          <span class="text-sm font-medium text-gray-600">
            ${storeTypes[store.type]?.name || 'Store'}
          </span>
        </div>

        <div class="flex items-center space-x-1">
          <span class="text-yellow-400">⭐</span>
          <span class="text-sm font-medium">${store.rating}</span>
          <span class="text-xs text-gray-500">(${store.distance || 0} km away)</span>
        </div>

        <div class="flex items-start space-x-2">
          <span class="text-gray-500">📍</span>
          <span class="text-sm text-gray-600 leading-tight">${store.address}</span>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-gray-500">📞</span>
          <a href="tel:${store.phone}" class="text-sm text-blue-600 hover:underline">
            ${store.phone}
          </a>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-gray-500">🕒</span>
          <span class="text-sm text-gray-600">${store.openHours}</span>
        </div>

        <div class="mt-3 pt-2 border-t border-gray-200">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${store.coordinates[0]},${store.coordinates[1]}"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <span>🧭</span>
            <span>Get Directions</span>
          </a>
        </div>
      </div>
    </div>
  `
}

const StoreMap = ({
  selectedStore = null,
  userLocation = null,
  height = '400px',
  showUserLocation = true,
  filteredStores = stores
}) => {
  const { t } = useTranslation()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView([19.0760, 72.8777], 12)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update map when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Add user location marker
    if (showUserLocation && userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userLocationIcon
      }).addTo(mapInstanceRef.current)

      userMarker.bindPopup(`
        <div class="text-center p-2">
          <div class="font-semibold text-red-600">Your Location</div>
          <div class="text-sm text-gray-600">Current position</div>
        </div>
      `)

      markersRef.current.push(userMarker)
    }

    // Add store markers
    filteredStores.forEach(store => {
      const marker = L.marker(store.coordinates, {
        icon: createCustomIcon(store.type)
      }).addTo(mapInstanceRef.current)

      marker.bindPopup(createStorePopupHTML(store, t), {
        maxWidth: 300,
        className: 'store-popup'
      })

      markersRef.current.push(marker)
    })

    // Center map based on selected store or user location
    if (selectedStore) {
      mapInstanceRef.current.setView(selectedStore.coordinates, 15)
    } else if (userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13)
    }

  }, [selectedStore, userLocation, filteredStores, showUserLocation, t])

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className="rounded-lg overflow-hidden border border-gray-200"
    />
  )
}

export default StoreMap
