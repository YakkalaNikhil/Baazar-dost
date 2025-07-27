// Location utility functions for Baazar Dost

/**
 * Get current user location using browser geolocation API
 * @param {Object} options - Geolocation options
 * @returns {Promise<Object>} Location object with latitude, longitude, and accuracy
 */
export const getCurrentLocation = (options = {}) => {
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
    ...options
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        })
      },
      (error) => {
        let errorMessage = 'Unknown location error'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        reject(new Error(errorMessage))
      },
      defaultOptions
    )
  })
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {Object} point1 - First point with latitude and longitude
 * @param {Object} point2 - Second point with latitude and longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2 || !point1.latitude || !point1.longitude || !point2.latitude || !point2.longitude) {
    return null
  }

  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c

  return distance
}

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return 'Unknown distance'
  }
  
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)}m`
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km`
  } else {
    return `${distance.toFixed(0)}km`
  }
}

/**
 * Check if location is within a certain radius
 * @param {Object} center - Center point with latitude and longitude
 * @param {Object} point - Point to check with latitude and longitude
 * @param {number} radius - Radius in kilometers
 * @returns {boolean} True if point is within radius
 */
export const isWithinRadius = (center, point, radius) => {
  const distance = calculateDistance(center, point)
  return distance !== null && distance <= radius
}

/**
 * Find nearest suppliers to a given location
 * @param {Object} userLocation - User's location with latitude and longitude
 * @param {Array} suppliers - Array of supplier objects with location property
 * @param {number} maxDistance - Maximum distance in kilometers (default: 50)
 * @returns {Array} Sorted array of suppliers with distance property
 */
export const findNearestSuppliers = (userLocation, suppliers, maxDistance = 50) => {
  if (!userLocation || !suppliers || !Array.isArray(suppliers)) {
    return []
  }

  return suppliers
    .map(supplier => {
      const distance = calculateDistance(userLocation, supplier.location)
      return {
        ...supplier,
        distance
      }
    })
    .filter(supplier => supplier.distance !== null && supplier.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Get location name from coordinates using reverse geocoding
 * Note: This is a placeholder - in production, you'd use a real geocoding service
 * @param {Object} location - Location with latitude and longitude
 * @returns {Promise<string>} Location name
 */
export const getLocationName = async (location) => {
  try {
    // In a real app, you'd use Google Maps Geocoding API or similar
    // For now, return a formatted coordinate string
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
  } catch (error) {
    console.error('Error getting location name:', error)
    return 'Unknown location'
  }
}

/**
 * Validate location object
 * @param {Object} location - Location object to validate
 * @returns {boolean} True if location is valid
 */
export const isValidLocation = (location) => {
  return (
    location &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  )
}

/**
 * Get delivery zones based on supplier location
 * @param {Object} supplierLocation - Supplier's location
 * @returns {Array} Array of delivery zone objects
 */
export const getDeliveryZones = (supplierLocation) => {
  if (!isValidLocation(supplierLocation)) {
    return []
  }

  return [
    {
      name: 'Immediate Area',
      radius: 2,
      deliveryTime: '30-45 minutes',
      deliveryFee: 0,
      color: '#10B981'
    },
    {
      name: 'Local Area',
      radius: 5,
      deliveryTime: '45-60 minutes',
      deliveryFee: 20,
      color: '#F59E0B'
    },
    {
      name: 'Extended Area',
      radius: 10,
      deliveryTime: '1-2 hours',
      deliveryFee: 50,
      color: '#EF4444'
    }
  ]
}

/**
 * Check if delivery is available to a location
 * @param {Object} supplierLocation - Supplier's location
 * @param {Object} customerLocation - Customer's location
 * @param {number} maxDeliveryRadius - Maximum delivery radius in km (default: 10)
 * @returns {Object} Delivery info object
 */
export const checkDeliveryAvailability = (supplierLocation, customerLocation, maxDeliveryRadius = 10) => {
  if (!isValidLocation(supplierLocation) || !isValidLocation(customerLocation)) {
    return {
      available: false,
      reason: 'Invalid location data'
    }
  }

  const distance = calculateDistance(supplierLocation, customerLocation)
  const zones = getDeliveryZones(supplierLocation)
  
  if (distance > maxDeliveryRadius) {
    return {
      available: false,
      reason: 'Outside delivery area',
      distance: formatDistance(distance)
    }
  }

  // Find the appropriate delivery zone
  const zone = zones.find(z => distance <= z.radius) || zones[zones.length - 1]

  return {
    available: true,
    distance: formatDistance(distance),
    zone: zone.name,
    deliveryTime: zone.deliveryTime,
    deliveryFee: zone.deliveryFee,
    estimatedTime: zone.deliveryTime
  }
}

/**
 * Generate Google Maps URL for directions
 * @param {Object} from - Starting location
 * @param {Object} to - Destination location
 * @returns {string} Google Maps URL
 */
export const getDirectionsUrl = (from, to) => {
  if (!isValidLocation(from) || !isValidLocation(to)) {
    return null
  }

  const baseUrl = 'https://www.google.com/maps/dir/'
  return `${baseUrl}${from.latitude},${from.longitude}/${to.latitude},${to.longitude}`
}

/**
 * Location constants for Indian cities
 */
export const INDIAN_CITIES = {
  MUMBAI: { latitude: 19.0760, longitude: 72.8777, name: 'Mumbai' },
  DELHI: { latitude: 28.7041, longitude: 77.1025, name: 'Delhi' },
  BANGALORE: { latitude: 12.9716, longitude: 77.5946, name: 'Bangalore' },
  HYDERABAD: { latitude: 17.3850, longitude: 78.4867, name: 'Hyderabad' },
  CHENNAI: { latitude: 13.0827, longitude: 80.2707, name: 'Chennai' },
  KOLKATA: { latitude: 22.5726, longitude: 88.3639, name: 'Kolkata' },
  PUNE: { latitude: 18.5204, longitude: 73.8567, name: 'Pune' },
  AHMEDABAD: { latitude: 23.0225, longitude: 72.5714, name: 'Ahmedabad' }
}
