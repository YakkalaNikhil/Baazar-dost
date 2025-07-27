// Store locations data for map feature
export const stores = [
  {
    id: 'store-1',
    name: 'Mumbai Central Wholesale Market',
    type: 'wholesale',
    address: 'Crawford Market, Mumbai Central, Mumbai, Maharashtra 400001',
    coordinates: [19.0596, 72.8295],
    phone: '+91 98765 43210',
    rating: 4.5,
    specialties: ['grains', 'spices', 'vegetables'],
    openHours: '6:00 AM - 10:00 PM',
    verified: true,
    distance: 0.8, // km from user
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  },
  {
    id: 'store-2',
    name: 'Dadar Vegetable Market',
    type: 'vegetable_market',
    address: 'Dadar West, Mumbai, Maharashtra 400028',
    coordinates: [19.0178, 72.8478],
    phone: '+91 98765 43211',
    rating: 4.2,
    specialties: ['vegetables', 'fruits'],
    openHours: '5:00 AM - 11:00 PM',
    verified: true,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop'
  },
  {
    id: 'store-3',
    name: 'Andheri Spice Bazaar',
    type: 'spice_market',
    address: 'Andheri East, Mumbai, Maharashtra 400069',
    coordinates: [19.1136, 72.8697],
    phone: '+91 98765 43212',
    rating: 4.7,
    specialties: ['spices', 'oils', 'dairy'],
    openHours: '7:00 AM - 9:00 PM',
    verified: true,
    distance: 2.1,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop'
  },
  {
    id: 'store-4',
    name: 'Bandra Street Food Supplies',
    type: 'street_food_supplier',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    coordinates: [19.0544, 72.8181],
    phone: '+91 98765 43213',
    rating: 4.3,
    specialties: ['panipuri_supplies', 'waffle_supplies', 'packaging'],
    openHours: '8:00 AM - 8:00 PM',
    verified: true,
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop'
  },
  {
    id: 'store-5',
    name: 'Kurla Dairy Products Hub',
    type: 'dairy_supplier',
    address: 'Kurla East, Mumbai, Maharashtra 400024',
    coordinates: [19.0728, 72.8826],
    phone: '+91 98765 43214',
    rating: 4.1,
    specialties: ['dairy', 'beverages'],
    openHours: '6:00 AM - 10:00 PM',
    verified: true,
    distance: 3.2,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop'
  },
  {
    id: 'store-6',
    name: 'Thane Wholesale Center',
    type: 'wholesale',
    address: 'Thane West, Thane, Maharashtra 400601',
    coordinates: [19.2183, 72.9781],
    phone: '+91 98765 43215',
    rating: 4.4,
    specialties: ['grains', 'oils', 'cleaning'],
    openHours: '6:00 AM - 9:00 PM',
    verified: true,
    distance: 4.8,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop'
  },
  {
    id: 'store-7',
    name: 'Powai Fresh Mart',
    type: 'fresh_market',
    address: 'Powai, Mumbai, Maharashtra 400076',
    coordinates: [19.1197, 72.9089],
    phone: '+91 98765 43216',
    rating: 4.6,
    specialties: ['vegetables', 'fruits', 'dairy'],
    openHours: '6:00 AM - 11:00 PM',
    verified: true,
    distance: 2.8,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop'
  },
  {
    id: 'store-8',
    name: 'Goregaon Packaging Solutions',
    type: 'packaging_supplier',
    address: 'Goregaon West, Mumbai, Maharashtra 400062',
    coordinates: [19.1646, 72.8493],
    phone: '+91 98765 43217',
    rating: 4.0,
    specialties: ['packaging', 'cleaning'],
    openHours: '9:00 AM - 7:00 PM',
    verified: false,
    distance: 5.1,
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop'
  }
]

// Store types with icons and colors
export const storeTypes = {
  wholesale: {
    name: 'Wholesale Market',
    icon: '🏪',
    color: '#3B82F6',
    description: 'Large wholesale markets with bulk supplies'
  },
  vegetable_market: {
    name: 'Vegetable Market',
    icon: '🥕',
    color: '#10B981',
    description: 'Fresh vegetables and fruits'
  },
  spice_market: {
    name: 'Spice Bazaar',
    icon: '🌶️',
    color: '#F59E0B',
    description: 'Spices, masalas, and cooking ingredients'
  },
  street_food_supplier: {
    name: 'Street Food Supplier',
    icon: '🍛',
    color: '#EF4444',
    description: 'Street food ingredients and supplies'
  },
  dairy_supplier: {
    name: 'Dairy Supplier',
    icon: '🥛',
    color: '#8B5CF6',
    description: 'Milk, dairy products, and beverages'
  },
  fresh_market: {
    name: 'Fresh Market',
    icon: '🛒',
    color: '#06B6D4',
    description: 'General fresh produce and groceries'
  },
  packaging_supplier: {
    name: 'Packaging Supplier',
    icon: '📦',
    color: '#6B7280',
    description: 'Packaging materials and disposables'
  }
}

// Function to calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

// Function to get stores sorted by distance
export const getStoresByDistance = (userLat, userLon) => {
  return stores.map(store => ({
    ...store,
    distance: calculateDistance(userLat, userLon, store.coordinates[0], store.coordinates[1])
  })).sort((a, b) => a.distance - b.distance)
}

// Function to filter stores by type
export const getStoresByType = (type) => {
  return stores.filter(store => store.type === type)
}

// Function to get stores by specialty
export const getStoresBySpecialty = (specialty) => {
  return stores.filter(store => store.specialties.includes(specialty))
}
