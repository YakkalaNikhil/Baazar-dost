// Sample data for testing supplier features

export const sampleProducts = [
  {
    name: 'Fresh Tomatoes',
    description: 'Premium quality fresh tomatoes, perfect for cooking and salads',
    category: 'vegetables',
    unitPrice: 40,
    bulkPrice: 35,
    unit: 'kg',
    bulkUnit: '10kg crate',
    minBulkQuantity: 10,
    stockQuantity: 500,
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400',
    tags: ['fresh', 'organic', 'local'],
    gst: 0,
    isActive: true,
    inStock: true
  },
  {
    name: 'Basmati Rice',
    description: 'Premium aged basmati rice, aromatic and long grain',
    category: 'grains',
    unitPrice: 120,
    bulkPrice: 110,
    unit: 'kg',
    bulkUnit: '25kg bag',
    minBulkQuantity: 25,
    stockQuantity: 200,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    tags: ['premium', 'aged', 'aromatic'],
    gst: 5,
    isActive: true,
    inStock: true
  },
  {
    name: 'Red Onions',
    description: 'Fresh red onions, essential for Indian cooking',
    category: 'vegetables',
    unitPrice: 30,
    bulkPrice: 25,
    unit: 'kg',
    bulkUnit: '20kg bag',
    minBulkQuantity: 20,
    stockQuantity: 300,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    tags: ['fresh', 'local', 'essential'],
    gst: 0,
    isActive: true,
    inStock: true
  },
  {
    name: 'Turmeric Powder',
    description: 'Pure turmeric powder, freshly ground',
    category: 'spices',
    unitPrice: 200,
    bulkPrice: 180,
    unit: 'kg',
    bulkUnit: '5kg pack',
    minBulkQuantity: 5,
    stockQuantity: 50,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    tags: ['pure', 'fresh', 'ground'],
    gst: 5,
    isActive: true,
    inStock: true
  },
  {
    name: 'Panipuri Shells',
    description: 'Crispy panipuri shells, ready to serve',
    category: 'panipuri_supplies',
    unitPrice: 80,
    bulkPrice: 70,
    unit: 'pack of 100',
    bulkUnit: '10 packs',
    minBulkQuantity: 10,
    stockQuantity: 100,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    tags: ['crispy', 'ready', 'street-food'],
    gst: 12,
    isActive: true,
    inStock: true
  },
  {
    name: 'Waffle Mix',
    description: 'Premium waffle mix for street vendors',
    category: 'waffle_supplies',
    unitPrice: 150,
    bulkPrice: 140,
    unit: 'kg',
    bulkUnit: '10kg bag',
    minBulkQuantity: 10,
    stockQuantity: 80,
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400',
    tags: ['premium', 'easy', 'vendor'],
    gst: 18,
    isActive: true,
    inStock: true
  },
  {
    name: 'Disposable Plates',
    description: 'Eco-friendly disposable plates for food vendors',
    category: 'packaging',
    unitPrice: 120,
    bulkPrice: 100,
    unit: 'pack of 100',
    bulkUnit: '10 packs',
    minBulkQuantity: 10,
    stockQuantity: 200,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    tags: ['eco-friendly', 'disposable', 'vendor'],
    gst: 18,
    isActive: true,
    inStock: true
  },
  {
    name: 'Cleaning Detergent',
    description: 'Heavy-duty cleaning detergent for commercial use',
    category: 'cleaning',
    unitPrice: 180,
    bulkPrice: 160,
    unit: 'liter',
    bulkUnit: '5L container',
    minBulkQuantity: 5,
    stockQuantity: 60,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
    tags: ['heavy-duty', 'commercial', 'effective'],
    gst: 18,
    isActive: true,
    inStock: true
  }
]

export const sampleOrders = [
  {
    customerInfo: {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 9876543210',
      location: {
        latitude: 28.7041,
        longitude: 77.1025
      }
    },
    items: [
      {
        name: 'Fresh Tomatoes',
        quantity: 5,
        price: 40,
        image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400'
      },
      {
        name: 'Red Onions',
        quantity: 3,
        price: 30,
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'
      }
    ],
    status: 'pending',
    paymentMethod: 'cash_on_delivery',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    customerInfo: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543211',
      location: {
        latitude: 28.7041,
        longitude: 77.1025
      }
    },
    items: [
      {
        name: 'Basmati Rice',
        quantity: 2,
        price: 120,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
      }
    ],
    status: 'confirmed',
    paymentMethod: 'upi',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000)
  },
  {
    customerInfo: {
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '+91 9876543212',
      location: {
        latitude: 28.7041,
        longitude: 77.1025
      }
    },
    items: [
      {
        name: 'Panipuri Shells',
        quantity: 10,
        price: 80,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'
      },
      {
        name: 'Turmeric Powder',
        quantity: 1,
        price: 200,
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'
      }
    ],
    status: 'delivered',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
]

export const supplierBusinessTypes = [
  'Wholesale Distributor',
  'Local Farmer',
  'Food Processor',
  'Spice Merchant',
  'Packaging Supplier',
  'Equipment Supplier',
  'Cleaning Supplies',
  'Raw Materials',
  'Specialty Foods',
  'Organic Producer'
]

// Function to create sample data for testing
export const createSampleSupplierData = (supplierId, supplierName, supplierLocation) => {
  return {
    products: sampleProducts.map(product => ({
      ...product,
      supplierId,
      supplierName,
      supplierLocation,
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    orders: sampleOrders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        supplierId
      }))
    }))
  }
}

// Location data for major Indian cities
export const indianCityLocations = {
  'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
  'Delhi': { latitude: 28.7041, longitude: 77.1025 },
  'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
  'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
  'Chennai': { latitude: 13.0827, longitude: 80.2707 },
  'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
  'Pune': { latitude: 18.5204, longitude: 73.8567 },
  'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
  'Jaipur': { latitude: 26.9124, longitude: 75.7873 },
  'Surat': { latitude: 21.1702, longitude: 72.8311 }
}

// Sample supplier profiles
export const sampleSuppliers = [
  {
    name: 'Fresh Farms Pvt Ltd',
    businessType: 'Local Farmer',
    location: indianCityLocations.Delhi,
    specialties: ['vegetables', 'fruits'],
    rating: 4.8,
    totalOrders: 1250
  },
  {
    name: 'Spice Kingdom',
    businessType: 'Spice Merchant',
    location: indianCityLocations.Mumbai,
    specialties: ['spices'],
    rating: 4.9,
    totalOrders: 890
  },
  {
    name: 'Street Food Supplies',
    businessType: 'Specialty Foods',
    location: indianCityLocations.Bangalore,
    specialties: ['panipuri_supplies', 'waffle_supplies'],
    rating: 4.7,
    totalOrders: 650
  }
]
