import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

export const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Geolocation is supported
    setIsSupported('geolocation' in navigator)
  }, [])

  const getCurrentLocation = useCallback(() => {
    if (!isSupported) {
      const errorMsg = 'Geolocation is not supported by this browser'
      setError(errorMsg)
      toast.error(errorMsg)
      return Promise.reject(new Error(errorMsg))
    }

    setLoading(true)
    setError(null)

    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 300000 // 5 minutes
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          }
          
          setLocation(locationData)
          setLoading(false)
          setError(null)
          
          toast.success('Location detected successfully!')
          resolve(locationData)
        },
        (error) => {
          setLoading(false)
          
          let errorMessage = 'Failed to get location'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again.'
              break
            default:
              errorMessage = 'An unknown error occurred while retrieving location.'
              break
          }
          
          setError(errorMessage)
          toast.error(errorMessage)
          reject(new Error(errorMessage))
        },
        options
      )
    })
  }, [isSupported])

  const watchLocation = useCallback(() => {
    if (!isSupported) {
      const errorMsg = 'Geolocation is not supported by this browser'
      setError(errorMsg)
      return null
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        }
        
        setLocation(locationData)
        setError(null)
      },
      (error) => {
        let errorMessage = 'Failed to watch location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
          default:
            errorMessage = 'An unknown error occurred while watching location.'
            break
        }
        
        setError(errorMessage)
        console.error('Geolocation watch error:', errorMessage)
      },
      options
    )

    return watchId
  }, [isSupported])

  const clearWatch = useCallback((watchId) => {
    if (watchId && isSupported) {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [isSupported])

  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    // Haversine formula to calculate distance between two points
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c // Distance in kilometers
    
    return distance
  }, [])

  const findNearbySuppliers = useCallback((suppliers, maxDistance = 10) => {
    if (!location || !suppliers) return []

    return suppliers
      .map(supplier => {
        if (!supplier.location || !supplier.location.latitude || !supplier.location.longitude) {
          return null
        }

        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          supplier.location.latitude,
          supplier.location.longitude
        )

        return {
          ...supplier,
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        }
      })
      .filter(supplier => supplier && supplier.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
  }, [location, calculateDistance])

  return {
    location,
    loading,
    error,
    isSupported,
    getCurrentLocation,
    watchLocation,
    clearWatch,
    calculateDistance,
    findNearbySuppliers
  }
}
