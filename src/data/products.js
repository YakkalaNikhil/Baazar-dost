// Real product data for street vendors
import { getProductImage } from './productImages'

export const categories = [
  { id: 'grains', name: 'Grains & Cereals', icon: '🌾', vendors: ['street_shop', 'restaurant'] },
  { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥕', vendors: ['street_vendor', 'juice_shop', 'restaurant'] },
  { id: 'fruits', name: 'Fresh Fruits', icon: '🍎', vendors: ['juice_shop', 'street_vendor'] },
  { id: 'spices', name: 'Spices & Masalas', icon: '🌶️', vendors: ['street_vendor', 'restaurant', 'street_shop'] },
  { id: 'oils', name: 'Cooking Oils', icon: '🛢️', vendors: ['street_vendor', 'restaurant', 'street_shop'] },
  { id: 'dairy', name: 'Dairy Products', icon: '🥛', vendors: ['juice_shop', 'waffle_counter', 'restaurant'] },
  { id: 'snacks', name: 'Street Snacks', icon: '🍿', vendors: ['panipuri_vendor', 'street_vendor'] },
  { id: 'beverages', name: 'Beverages', icon: '🥤', vendors: ['juice_shop', 'street_vendor'] },
  { id: 'waffle_supplies', name: 'Waffle Supplies', icon: '🧇', vendors: ['waffle_counter'] },
  { id: 'panipuri_supplies', name: 'Panipuri Supplies', icon: '🥟', vendors: ['panipuri_vendor'] },
  { id: 'packaging', name: 'Packaging Materials', icon: '📦', vendors: ['all'] },
  { id: 'cleaning', name: 'Cleaning Supplies', icon: '🧽', vendors: ['all'] }
]

export const vendorTypes = [
  { id: 'panipuri_vendor', name: 'Panipuri Vendor', icon: '🥟' },
  { id: 'street_vendor', name: 'Street Food Vendor', icon: '🍛' },
  { id: 'waffle_counter', name: 'Waffle Counter', icon: '🧇' },
  { id: 'juice_shop', name: 'Juice Shop', icon: '🥤' },
  { id: 'street_shop', name: 'Street Shop', icon: '🏪' },
  { id: 'restaurant', name: 'Small Restaurant', icon: '🍽️' }
]

export const products = [
  // Panipuri Supplies
  {
    id: 'panipuri-kit-complete',
    name: 'Complete Panipuri Kit',
    category: 'panipuri_supplies',
    description: 'Everything needed for panipuri: puris, masala, chutneys, and sev',
    unitPrice: 150,
    bulkPrice: 135, // 10% discount for bulk (10+ kits)
    unit: 'kit (100 pieces)',
    bulkUnit: '10 kits',
    minBulkQuantity: 10,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['50 pieces', '100 pieces', '200 pieces', '500 pieces', '1000 pieces'],
    quantityPrices: {
      '50 pieces': 80,
      '100 pieces': 150,
      '200 pieces': 290, // ₹145 per 100 pieces (3% discount)
      '500 pieces': 700, // ₹140 per 100 pieces (7% discount)
      '1000 pieces': 1350 // ₹135 per 100 pieces (10% discount)
    },
    supplierId: 'panipuri-master',
    supplierName: 'Panipuri Master',
    image: getProductImage('panipuri-kit-complete'),
    tags: ['panipuri', 'golgappa', 'puchka', 'पानी पूरी', 'పానీపూరీ', 'பானிபூரி', 'ಪಾನಿಪೂರಿ'],
    gst: 5,
    rating: 4.9,
    reviews: 312,
    vendorTypes: ['panipuri_vendor']
  },
  {
    id: 'panipuri-puris-fresh',
    name: 'Fresh Panipuri Puris',
    category: 'panipuri_supplies',
    description: 'Crispy, fresh panipuri puris made daily',
    unitPrice: 3,
    bulkPrice: 2.5,
    unit: 'piece',
    bulkUnit: '500 pieces',
    minBulkQuantity: 500,
    inStock: true,
    stockQuantity: 5000,
    availableQuantities: ['100 pieces', '200 pieces', '500 pieces', '1000 pieces', '2000 pieces'],
    quantityPrices: {
      '100 pieces': 300,
      '200 pieces': 580,
      '500 pieces': 1400,
      '1000 pieces': 2700,
      '2000 pieces': 5200
    },
    supplierId: 'panipuri-master',
    supplierName: 'Panipuri Master',
    image: getProductImage('panipuri-puris-fresh'),
    tags: ['puris', 'panipuri', 'crispy', 'पूरी', 'పూరీ', 'பூரி', 'ಪೂರಿ'],
    gst: 5,
    rating: 4.8,
    reviews: 245,
    vendorTypes: ['panipuri_vendor']
  },
  {
    id: 'panipuri-masala-powder',
    name: 'Panipuri Masala Powder',
    category: 'panipuri_supplies',
    description: 'Special spice mix for authentic panipuri taste',
    unitPrice: 180,
    bulkPrice: 160,
    unit: 'kg',
    bulkUnit: '5kg pack',
    minBulkQuantity: 5,
    inStock: true,
    stockQuantity: 100,
    availableQuantities: ['250g', '500g', '1kg', '2kg', '5kg'],
    quantityPrices: {
      '250g': 50,
      '500g': 95,
      '1kg': 180,
      '2kg': 340,
      '5kg': 800
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('garam-masala-powder'),
    tags: ['masala', 'spice', 'panipuri', 'मसाला', 'మసాలా', 'மசாலா', 'ಮಸಾಲೆ'],
    gst: 5,
    rating: 4.7,
    reviews: 189,
    vendorTypes: ['panipuri_vendor', 'street_vendor']
  },

  // Waffle Supplies
  {
    id: 'waffle-mix-ready',
    name: 'Ready Waffle Mix',
    category: 'waffle_supplies',
    description: 'Pre-made waffle batter mix, just add water',
    unitPrice: 250,
    bulkPrice: 230,
    unit: 'kg',
    bulkUnit: '10kg pack',
    minBulkQuantity: 10,
    inStock: true,
    stockQuantity: 150,
    availableQuantities: ['500g', '1kg', '2kg', '5kg', '10kg'],
    quantityPrices: {
      '500g': 140,
      '1kg': 250,
      '2kg': 480,
      '5kg': 1150,
      '10kg': 2200
    },
    supplierId: 'baking-pro',
    supplierName: 'Baking Pro',
    image: getProductImage('maida-flour'),
    tags: ['waffle', 'mix', 'batter', 'वैफल', 'వాఫిల్', 'வாஃபிள்', 'ವಾಫಲ್'],
    gst: 18,
    rating: 4.6,
    reviews: 98,
    vendorTypes: ['waffle_counter']
  },
  {
    id: 'chocolate-syrup-waffle',
    name: 'Chocolate Syrup for Waffles',
    category: 'waffle_supplies',
    description: 'Rich chocolate syrup perfect for waffle toppings',
    unitPrice: 120,
    bulkPrice: 110,
    unit: 'bottle (500ml)',
    bulkUnit: '12 bottles',
    minBulkQuantity: 12,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['250ml', '500ml', '1L', '6 bottles', '12 bottles'],
    quantityPrices: {
      '250ml': 70,
      '500ml': 120,
      '1L': 220,
      '6 bottles': 650,
      '12 bottles': 1250
    },
    supplierId: 'sweet-treats',
    supplierName: 'Sweet Treats',
    image: getProductImage('chocolate-syrup-waffle'),
    tags: ['chocolate', 'syrup', 'waffle', 'topping', 'चॉकलेट', 'చాక్లెట్', 'சாக்லேட்', 'ಚಾಕ್ಲೇಟ್'],
    gst: 18,
    rating: 4.5,
    reviews: 76,
    vendorTypes: ['waffle_counter']
  },

  // Juice Shop Supplies
  {
    id: 'oranges-fresh-juice',
    name: 'Fresh Oranges for Juice',
    category: 'fruits',
    description: 'Sweet, juicy oranges perfect for fresh juice',
    unitPrice: 80,
    bulkPrice: 70, // 12.5% discount for bulk (50kg+)
    unit: 'kg',
    bulkUnit: '50kg crate',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 500,
    availableQuantities: ['1kg', '5kg', '10kg', '25kg', '50kg crate'],
    quantityPrices: {
      '1kg': 80,
      '5kg': 390, // ₹78/kg (2.5% discount)
      '10kg': 760, // ₹76/kg (5% discount)
      '25kg': 1875, // ₹75/kg (6.25% discount)
      '50kg crate': 3500 // ₹70/kg (12.5% discount)
    },
    supplierId: 'fresh-fruits',
    supplierName: 'Fresh Fruits Co',
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000027_18-fresho-orange.jpg',
    tags: ['orange', 'juice', 'fresh', 'संतरा', 'నారింజ', 'ஆரஞ்சு', 'ಕಿತ್ತಳೆ'],
    gst: 0,
    rating: 4.7,
    reviews: 156,
    vendorTypes: ['juice_shop']
  },
  {
    id: 'sugarcane-fresh',
    name: 'Fresh Sugarcane',
    category: 'fruits',
    description: 'Fresh sugarcane for making natural juice',
    unitPrice: 25,
    bulkPrice: 22,
    unit: 'piece',
    bulkUnit: '100 pieces',
    minBulkQuantity: 100,
    inStock: true,
    stockQuantity: 1000,
    availableQuantities: ['10 pieces', '25 pieces', '50 pieces', '100 pieces', '200 pieces'],
    quantityPrices: {
      '10 pieces': 250,
      '25 pieces': 600,
      '50 pieces': 1150,
      '100 pieces': 2200,
      '200 pieces': 4200
    },
    supplierId: 'fresh-fruits',
    supplierName: 'Fresh Fruits Co',
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000028_17-fresho-sugarcane.jpg',
    tags: ['sugarcane', 'juice', 'natural', 'गन्ना', 'చెరకు', 'கரும்பு', 'ಕಬ್ಬು'],
    gst: 0,
    rating: 4.8,
    reviews: 234,
    vendorTypes: ['juice_shop']
  },
  {
    id: 'ice-cubes-bulk',
    name: 'Ice Cubes',
    category: 'beverages',
    description: 'Fresh ice cubes for cold beverages',
    unitPrice: 15,
    bulkPrice: 12, // 20% discount for bulk (50kg+)
    unit: 'kg',
    bulkUnit: '50kg bag',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 500,
    availableQuantities: ['5kg', '10kg', '25kg', '50kg bag', '100kg'],
    quantityPrices: {
      '5kg': 75, // ₹15/kg (no discount)
      '10kg': 145, // ₹14.5/kg (3% discount)
      '25kg': 350, // ₹14/kg (7% discount)
      '50kg bag': 600, // ₹12/kg (20% discount)
      '100kg': 1150 // ₹11.5/kg (23% discount)
    },
    supplierId: 'ice-factory',
    supplierName: 'Ice Factory',
    image: 'https://m.media-amazon.com/images/I/51VQJ7XJQQL._SL1500_.jpg',
    tags: ['ice', 'cold', 'beverage', 'बर्फ', 'మంచు', 'பனி', 'ಮಂಜುಗಡ್ಡೆ'],
    gst: 18,
    rating: 4.4,
    reviews: 89,
    vendorTypes: ['juice_shop', 'street_vendor']
  },

  // Grains & Cereals
  {
    id: 'rice-basmati-25kg',
    name: 'Premium Basmati Rice',
    category: 'grains',
    description: 'High quality aged basmati rice, perfect for biryanis and pulao',
    unitPrice: 120,
    bulkPrice: 105, // 12.5% discount for bulk (25kg+)
    unit: 'kg',
    bulkUnit: '25kg bag',
    minBulkQuantity: 25,
    inStock: true,
    stockQuantity: 500,
    availableQuantities: ['1kg', '5kg', '10kg', '25kg bag', '50kg'],
    quantityPrices: {
      '1kg': 120,
      '5kg': 590, // ₹118/kg (1.7% discount)
      '10kg': 1150, // ₹115/kg (4.2% discount)
      '25kg bag': 2625, // ₹105/kg (12.5% discount)
      '50kg': 5000 // ₹100/kg (16.7% discount)
    },
    supplierId: 'raj-traders',
    supplierName: 'Raj Traders',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40011905_9-india-gate-basmati-rice-classic.jpg',
    tags: ['rice', 'basmati', 'premium', 'चावल', 'అన్నం', 'அரிசி', 'ಅಕ್ಕಿ'],
    gst: 5,
    rating: 4.8,
    reviews: 156,
    vendorTypes: ['street_shop', 'restaurant']
  },
  {
    id: 'wheat-flour-10kg',
    name: 'Whole Wheat Flour',
    category: 'grains',
    description: 'Fresh ground whole wheat flour for rotis and bread',
    unitPrice: 45,
    bulkPrice: 42,
    unit: 'kg',
    bulkUnit: '10kg bag',
    minBulkQuantity: 10,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['1kg', '2kg', '5kg', '10kg bag', '25kg'],
    quantityPrices: {
      '1kg': 45,
      '2kg': 88,
      '5kg': 215,
      '10kg bag': 420,
      '25kg': 1000
    },
    supplierId: 'grain-master',
    supplierName: 'Grain Master',
    image: getProductImage('wheat-flour-10kg'),
    tags: ['wheat', 'flour', 'atta', 'आटा', 'పిండి', 'மாவு', 'ಹಿಟ್ಟು'],
    gst: 5,
    rating: 4.6,
    reviews: 89,
    vendorTypes: ['street_shop', 'restaurant']
  },

  // Vegetables
  {
    id: 'onions-red',
    name: 'Fresh Red Onions',
    category: 'vegetables',
    description: 'Farm fresh red onions, essential for Indian cooking',
    unitPrice: 35,
    bulkPrice: 32,
    unit: 'kg',
    bulkUnit: '50kg bag',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 1000,
    availableQuantities: ['1kg', '5kg', '10kg', '25kg', '50kg bag'],
    quantityPrices: {
      '1kg': 35,
      '5kg': 170,
      '10kg': 330,
      '25kg': 800,
      '50kg bag': 1550
    },
    supplierId: 'green-valley',
    supplierName: 'Green Valley Farms',
    image: getProductImage('red-onions-fresh'),
    tags: ['onions', 'vegetables', 'प्याज', 'ఉల్లిపాయలు', 'வெங்காயம்', 'ಈರುಳ್ಳಿ'],
    gst: 0,
    rating: 4.5,
    reviews: 234,
    vendorTypes: ['street_vendor', 'restaurant', 'juice_shop']
  },
  {
    id: 'tomatoes-fresh',
    name: 'Fresh Tomatoes',
    category: 'vegetables',
    description: 'Ripe, juicy tomatoes perfect for curries and salads',
    unitPrice: 40,
    bulkPrice: 35, // 12.5% discount for bulk (20kg+)
    unit: 'kg',
    bulkUnit: '20kg crate',
    minBulkQuantity: 20,
    inStock: true,
    stockQuantity: 500,
    availableQuantities: ['1kg', '3kg', '5kg', '10kg', '20kg crate'],
    quantityPrices: {
      '1kg': 40,
      '3kg': 117, // ₹39/kg (2.5% discount)
      '5kg': 195, // ₹39/kg (2.5% discount)
      '10kg': 380, // ₹38/kg (5% discount)
      '20kg crate': 700 // ₹35/kg (12.5% discount)
    },
    supplierId: 'fresh-farms',
    supplierName: 'Fresh Farms',
    image: getProductImage('tomatoes-fresh'),
    tags: ['tomatoes', 'vegetables', 'टमाटर', 'టమాటాలు', 'தக்காளி', 'ಟೊಮೇಟೊ'],
    gst: 0,
    rating: 4.3,
    reviews: 178,
    vendorTypes: ['street_vendor', 'restaurant', 'juice_shop']
  },
  {
    id: 'potatoes-fresh',
    name: 'Fresh Potatoes',
    category: 'vegetables',
    description: 'High quality potatoes for various cooking needs',
    unitPrice: 25,
    bulkPrice: 23, // 8% discount for bulk (50kg+)
    unit: 'kg',
    bulkUnit: '50kg bag',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 800,
    availableQuantities: ['1kg', '5kg', '10kg', '25kg', '50kg bag'],
    quantityPrices: {
      '1kg': 25,     // ₹25/kg (base price)
      '5kg': 123,    // ₹24.6/kg (1.6% discount)
      '10kg': 245,   // ₹24.5/kg (2% discount)
      '25kg': 600,   // ₹24/kg (4% discount)
      '50kg bag': 1150 // ₹23/kg (8% discount)
    },
    supplierId: 'green-valley',
    supplierName: 'Green Valley Farms',
    image: getProductImage('potatoes-fresh'),
    tags: ['potatoes', 'vegetables', 'आलू', 'బంగాళాదుంపలు', 'உருளைக்கிழங்கு', 'ಆಲೂಗಡ್ಡೆ'],
    gst: 0,
    rating: 4.4,
    reviews: 145
  },

  // Spices & Masalas
  {
    id: 'turmeric-powder',
    name: 'Pure Turmeric Powder',
    category: 'spices',
    description: 'Pure, organic turmeric powder with high curcumin content',
    unitPrice: 180,
    bulkPrice: 160, // 11% discount for bulk (5kg+)
    unit: 'kg',
    bulkUnit: '5kg pack',
    minBulkQuantity: 5,
    inStock: true,
    stockQuantity: 100,
    availableQuantities: ['100g', '250g', '500g', '1kg', '5kg pack'],
    quantityPrices: {
      '100g': 20, // ₹200/kg (premium for small pack)
      '250g': 48, // ₹192/kg (7% discount)
      '500g': 95, // ₹190/kg (5% discount)
      '1kg': 180, // ₹180/kg (base price)
      '5kg pack': 800 // ₹160/kg (11% discount)
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('garam-masala-powder'),
    tags: ['turmeric', 'spices', 'haldi', 'हल्दी', 'పసుపు', 'மஞ்சள்', 'ಅರಿಶಿನ'],
    gst: 5,
    rating: 4.9,
    reviews: 267,
    vendorTypes: ['street_vendor', 'restaurant', 'street_shop']
  },
  {
    id: 'red-chili-powder',
    name: 'Red Chili Powder',
    category: 'spices',
    description: 'Hot and flavorful red chili powder for authentic taste',
    unitPrice: 220,
    bulkPrice: 195, // 11% discount for bulk (5kg+)
    unit: 'kg',
    bulkUnit: '5kg pack',
    minBulkQuantity: 5,
    inStock: true,
    stockQuantity: 80,
    availableQuantities: ['100g', '250g', '500g', '1kg', '5kg pack'],
    quantityPrices: {
      '100g': 25, // ₹250/kg (premium for small pack)
      '250g': 60, // ₹240/kg (9% premium)
      '500g': 115, // ₹230/kg (5% premium)
      '1kg': 220, // ₹220/kg (base price)
      '5kg pack': 975 // ₹195/kg (11% discount)
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('red-chili-powder'),
    tags: ['chili', 'spices', 'mirchi', 'मिर्च', 'మిర్చి', 'மிளகாய்', 'ಮೆಣಸಿನಕಾಯಿ'],
    gst: 5,
    rating: 4.7,
    reviews: 198,
    vendorTypes: ['street_vendor', 'restaurant', 'street_shop']
  },

  // Cooking Oils
  {
    id: 'sunflower-oil',
    name: 'Refined Sunflower Oil',
    category: 'oils',
    description: 'Pure refined sunflower oil for healthy cooking',
    unitPrice: 150,
    bulkPrice: 145,
    unit: 'liter',
    bulkUnit: '15L tin',
    minBulkQuantity: 15,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['500ml', '1L', '2L', '5L', '15L tin'],
    quantityPrices: {
      '500ml': 80,
      '1L': 150,
      '2L': 290,
      '5L': 720,
      '15L tin': 2100
    },
    supplierId: 'oil-mart',
    supplierName: 'Oil Mart',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40000516_13-fortune-sunflower-oil.jpg',
    tags: ['oil', 'sunflower', 'cooking', 'तेल', 'నూనె', 'எண்ணெய்', 'ಎಣ್ಣೆ'],
    gst: 5,
    rating: 4.5,
    reviews: 123
  },

  // Dairy Products
  {
    id: 'milk-packets',
    name: 'Fresh Milk Packets',
    category: 'dairy',
    description: 'Fresh pasteurized milk in 500ml packets',
    unitPrice: 25,
    bulkPrice: 24, // ₹24 per packet for bulk (20+ packets)
    unit: '500ml packet',
    bulkUnit: '20 packets',
    minBulkQuantity: 20,
    inStock: true,
    stockQuantity: 500,
    availableQuantities: ['1 packet', '5 packets', '10 packets', '20 packets', '50 packets'],
    quantityPrices: {
      '1 packet': 25,    // ₹25 per packet (unit price)
      '5 packets': 123,  // ₹24.6 per packet (2% discount)
      '10 packets': 245, // ₹24.5 per packet (2% discount)
      '20 packets': 480, // ₹24 per packet (4% discount) - as requested
      '50 packets': 1175 // ₹23.5 per packet (6% discount)
    },
    supplierId: 'dairy-fresh',
    supplierName: 'Dairy Fresh',
    image: getProductImage('milk-packets'),
    tags: ['milk', 'dairy', 'दूध', 'పాలు', 'பால்', 'ಹಾಲು'],
    gst: 0,
    rating: 4.6,
    reviews: 89
  },

  // Snack Items
  {
    id: 'pani-puri-kit',
    name: 'Pani Puri Making Kit',
    category: 'snacks',
    description: 'Complete kit with puris, masala, and chutneys for pani puri',
    unitPrice: 80,
    bulkPrice: 75, // 6.25% discount for bulk (10+ kits)
    unit: 'kit (50 pieces)',
    bulkUnit: '10 kits',
    minBulkQuantity: 10,
    inStock: true,
    stockQuantity: 150,
    availableQuantities: ['1 kit', '3 kits', '5 kits', '10 kits', '20 kits'],
    quantityPrices: {
      '1 kit': 80,      // ₹80/kit (base price)
      '3 kits': 237,    // ₹79/kit (1.25% discount)
      '5 kits': 390,    // ₹78/kit (2.5% discount)
      '10 kits': 750,   // ₹75/kit (6.25% discount)
      '20 kits': 1460   // ₹73/kit (8.75% discount)
    },
    supplierId: 'snack-master',
    supplierName: 'Snack Master',
    image: 'https://m.media-amazon.com/images/I/81QJ7X8XJQL._SL1500_.jpg',
    tags: ['panipuri', 'golgappa', 'snacks', 'पानी पूरी', 'పానీపూరీ', 'பானிபூரி', 'ಪಾನಿಪೂರಿ'],
    gst: 5,
    rating: 4.8,
    reviews: 312
  },

  // Beverages
  {
    id: 'tea-powder',
    name: 'Premium Tea Powder',
    category: 'beverages',
    description: 'Strong and aromatic tea powder for perfect chai',
    unitPrice: 320,
    bulkPrice: 285, // 11% discount for bulk (5kg+)
    unit: 'kg',
    bulkUnit: '5kg pack',
    minBulkQuantity: 5,
    inStock: true,
    stockQuantity: 100,
    availableQuantities: ['250g', '500g', '1kg', '2kg', '5kg pack'],
    quantityPrices: {
      '250g': 85, // ₹340/kg (6% premium for small pack)
      '500g': 165, // ₹330/kg (3% premium)
      '1kg': 320, // ₹320/kg (base price)
      '2kg': 630, // ₹315/kg (1.5% discount)
      '5kg pack': 1425 // ₹285/kg (11% discount)
    },
    supplierId: 'tea-garden',
    supplierName: 'Tea Garden',
    image: getProductImage('tea-powder'),
    tags: ['tea', 'chai', 'चाय', 'టీ', 'தேநீர்', 'ಚಹಾ'],
    gst: 5,
    rating: 4.7,
    reviews: 156
  },

  // Packaging Materials
  {
    id: 'paper-plates',
    name: 'Disposable Paper Plates',
    category: 'packaging',
    description: 'Eco-friendly disposable paper plates for food service',
    unitPrice: 2,
    bulkPrice: 1.8, // ₹1.8/piece for bulk (50+ pieces)
    unit: 'piece',
    bulkUnit: '50 pieces',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 5000,
    availableQuantities: ['10 pieces', '25 pieces', '50 pieces', '100 pieces', '500 pieces'],
    quantityPrices: {
      '10 pieces': 20, // ₹2.0/piece (base price)
      '25 pieces': 48, // ₹1.92/piece (4% discount)
      '50 pieces': 90, // ₹1.8/piece (10% discount) - matches your example
      '100 pieces': 170, // ₹1.7/piece (15% discount)
      '500 pieces': 800 // ₹1.6/piece (20% discount)
    },
    supplierId: 'pack-pro',
    supplierName: 'Pack Pro',
    image: getProductImage('paper-plates'),
    tags: ['plates', 'disposable', 'packaging', 'प्लेट', 'ప్లేట్', 'தட்டு', 'ತಟ್ಟೆ'],
    gst: 18,
    rating: 4.2,
    reviews: 78,
    vendorTypes: ['all']
  },

  // Additional Products for Better Variety
  {
    id: 'plastic-cups-disposable',
    name: 'Disposable Plastic Cups',
    category: 'packaging',
    description: 'Clear plastic cups perfect for juice and beverages',
    unitPrice: 1.5,
    bulkPrice: 1.1, // 27% discount for bulk (1000+ pieces)
    unit: 'piece',
    bulkUnit: '1000 pieces',
    minBulkQuantity: 1000,
    inStock: true,
    stockQuantity: 10000,
    availableQuantities: ['100 pieces', '250 pieces', '500 pieces', '1000 pieces', '5000 pieces'],
    quantityPrices: {
      '100 pieces': 150, // ₹1.5/piece (base price)
      '250 pieces': 350, // ₹1.4/piece (7% discount)
      '500 pieces': 650, // ₹1.3/piece (13% discount)
      '1000 pieces': 1100, // ₹1.1/piece (27% discount)
      '5000 pieces': 5000 // ₹1.0/piece (33% discount)
    },
    supplierId: 'pack-pro',
    supplierName: 'Pack Pro',
    image: getProductImage('plastic-cups-disposable'),
    tags: ['cups', 'plastic', 'disposable', 'juice', 'कप', 'కప్', 'கப்', 'ಕಪ್'],
    gst: 18,
    rating: 4.3,
    reviews: 145,
    vendorTypes: ['juice_shop', 'street_vendor']
  },

  {
    id: 'lemons-fresh',
    name: 'Fresh Lemons',
    category: 'fruits',
    description: 'Fresh lemons for lemonade and juice preparation',
    unitPrice: 60,
    bulkPrice: 55, // 8.3% discount for bulk (25kg+)
    unit: 'kg',
    bulkUnit: '25kg crate',
    minBulkQuantity: 25,
    inStock: true,
    stockQuantity: 300,
    availableQuantities: ['1kg', '5kg', '10kg', '25kg crate', '50kg'],
    quantityPrices: {
      '1kg': 60,        // ₹60/kg (base price)
      '5kg': 295,       // ₹59/kg (1.7% discount)
      '10kg': 580,      // ₹58/kg (3.3% discount)
      '25kg crate': 1375, // ₹55/kg (8.3% discount)
      '50kg': 2650      // ₹53/kg (11.7% discount)
    },
    supplierId: 'fresh-fruits',
    supplierName: 'Fresh Fruits Co',
    image: 'https://www.bigbasket.com/media/uploads/p/l/10000029_16-fresho-lemon.jpg',
    tags: ['lemon', 'citrus', 'juice', 'नींबू', 'నిమ్మకాయ', 'எலுமிச்சை', 'ನಿಂಬೆ'],
    gst: 0,
    rating: 4.6,
    reviews: 198,
    vendorTypes: ['juice_shop', 'street_vendor']
  },

  {
    id: 'garam-masala-powder',
    name: 'Garam Masala Powder',
    category: 'spices',
    description: 'Authentic garam masala blend for Indian cooking',
    unitPrice: 200,
    bulkPrice: 175, // 12.5% discount for bulk (5kg+)
    unit: 'kg',
    bulkUnit: '5kg pack',
    minBulkQuantity: 5,
    inStock: true,
    stockQuantity: 80,
    availableQuantities: ['50g', '100g', '250g', '500g', '1kg', '5kg pack'],
    quantityPrices: {
      '50g': 12, // ₹240/kg (20% premium for small pack)
      '100g': 22, // ₹220/kg (10% premium)
      '250g': 52, // ₹208/kg (4% premium)
      '500g': 105, // ₹210/kg (5% premium)
      '1kg': 200, // ₹200/kg (base price)
      '5kg pack': 875 // ₹175/kg (12.5% discount)
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('garam-masala-powder'),
    tags: ['garam masala', 'spices', 'blend', 'गरम मसाला', 'గరం మసాలా', 'கரம் மசாலா', 'ಗರಂ ಮಸಾಲೆ'],
    gst: 5,
    rating: 4.8,
    reviews: 267,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'honey-natural',
    name: 'Pure Natural Honey',
    category: 'waffle_supplies',
    description: 'Pure natural honey perfect for waffle toppings',
    unitPrice: 300,
    bulkPrice: 280, // 6.7% discount for bulk (12+ bottles)
    unit: 'bottle (500ml)',
    bulkUnit: '12 bottles',
    minBulkQuantity: 12,
    inStock: true,
    stockQuantity: 100,
    availableQuantities: ['250ml', '500ml', '1L', '6 bottles', '12 bottles'],
    quantityPrices: {
      '250ml': 160,      // ₹320/L (6.7% premium for small bottle)
      '500ml': 300,      // ₹300/bottle (base price)
      '1L': 580,         // ₹290/bottle equivalent (3.3% discount)
      '6 bottles': 1740, // ₹290/bottle (3.3% discount)
      '12 bottles': 3360 // ₹280/bottle (6.7% discount)
    },
    supplierId: 'sweet-treats',
    supplierName: 'Sweet Treats',
    image: 'https://www.bigbasket.com/media/uploads/p/l/40000519_18-dabur-honey.jpg',
    tags: ['honey', 'natural', 'sweet', 'waffle', 'शहद', 'తేనె', 'தேன்', 'ಜೇನುತುಪ್ಪ'],
    gst: 5,
    rating: 4.9,
    reviews: 156,
    vendorTypes: ['waffle_counter']
  },

  // Additional products to utilize available images
  {
    id: 'green-chillies-fresh',
    name: 'Fresh Green Chillies',
    category: 'vegetables',
    description: 'Fresh green chillies for spicy Indian cooking',
    unitPrice: 80,
    bulkPrice: 75, // ₹75 per kg when buying 10kg+ (bulk discount)
    unit: 'kg',
    bulkUnit: '10kg box',
    minBulkQuantity: 10,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['250g', '500g', '1kg', '2kg', '5kg', '10kg'],
    quantityPrices: {
      '250g': 20,    // ₹80/kg * 0.25kg = ₹20
      '500g': 40,    // ₹80/kg * 0.5kg = ₹40
      '1kg': 80,     // ₹80/kg * 1kg = ₹80
      '2kg': 160,    // ₹80/kg * 2kg = ₹160
      '5kg': 400,    // ₹80/kg * 5kg = ₹400
      '10kg': 750    // ₹75/kg * 10kg = ₹750 (bulk price)
    },
    supplierId: 'green-valley',
    supplierName: 'Green Valley Farms',
    image: getProductImage('green-chillies-fresh'),
    tags: ['chillies', 'green', 'spicy', 'vegetables', 'हरी मिर्च', 'పచ్చిమిర్చి', 'பச்சை மிளகாய்', 'ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ'],
    gst: 0,
    rating: 4.5,
    reviews: 167,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'curry-leaves-fresh',
    name: 'Fresh Curry Leaves',
    category: 'vegetables',
    description: 'Fresh curry leaves for authentic South Indian cooking',
    unitPrice: 400, // ₹400 per kg (₹40 per 100g)
    bulkPrice: 350, // ₹350 per kg when buying 1kg+ (bulk discount)
    unit: '100g bunch',
    bulkUnit: '1kg box',
    minBulkQuantity: 1,
    inStock: true,
    stockQuantity: 150,
    availableQuantities: ['50g', '100g', '250g', '500g', '1kg'],
    quantityPrices: {
      '50g': 20,     // ₹400/kg * 0.05kg = ₹20
      '100g': 40,    // ₹400/kg * 0.1kg = ₹40
      '250g': 100,   // ₹400/kg * 0.25kg = ₹100
      '500g': 200,   // ₹400/kg * 0.5kg = ₹200
      '1kg': 350     // ₹350/kg * 1kg = ₹350 (bulk price)
    },
    supplierId: 'green-valley',
    supplierName: 'Green Valley Farms',
    image: getProductImage('curry-leaves-fresh'),
    tags: ['curry leaves', 'fresh', 'aromatic', 'कड़ी पत्ता', 'కరివేపాకు', 'கறிவேப்பிலை', 'ಕರಿಬೇವು'],
    gst: 0,
    rating: 4.7,
    reviews: 89,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'coriander-leaves-fresh',
    name: 'Fresh Coriander Leaves',
    category: 'vegetables',
    description: 'Fresh coriander leaves for garnishing and cooking',
    unitPrice: 30,
    bulkPrice: 28,
    unit: '100g bunch',
    bulkUnit: '1kg',
    minBulkQuantity: 10,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['50g', '100g', '250g', '500g'],
    quantityPrices: {
      '50g': 18,
      '100g': 30,
      '250g': 70,
      '500g': 135
    },
    supplierId: 'green-valley',
    supplierName: 'Green Valley Farms',
    image: getProductImage('coriander-leaves-fresh'),
    tags: ['coriander', 'dhania', 'fresh', 'garnish', 'धनिया', 'కొత్తిమీర', 'கொத்தமல்லி', 'ಕೊತ್ತಂಬರಿ'],
    gst: 0,
    rating: 4.4,
    reviews: 123,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'green-peas-fresh',
    name: 'Fresh Green Peas',
    category: 'vegetables',
    description: 'Fresh green peas perfect for curries and rice dishes',
    unitPrice: 60,
    bulkPrice: 52, // 13% discount for bulk (25kg+)
    unit: 'kg',
    bulkUnit: '25kg',
    minBulkQuantity: 25,
    inStock: true,
    stockQuantity: 300,
    availableQuantities: ['500g', '1kg', '2kg', '5kg', '10kg', '25kg'],
    quantityPrices: {
      '500g': 32, // ₹64/kg (7% premium for small pack)
      '1kg': 60, // ₹60/kg (base price)
      '2kg': 116, // ₹58/kg (3% discount)
      '5kg': 285, // ₹57/kg (5% discount)
      '10kg': 550, // ₹55/kg (8% discount)
      '25kg': 1300 // ₹52/kg (13% discount)
    },
    supplierId: 'green-valley',
    supplierName: 'Green Valley Farms',
    image: getProductImage('green-peas-fresh'),
    tags: ['peas', 'green', 'fresh', 'vegetables', 'मटर', 'బఠాణీలు', 'பட்டாணி', 'ಬಟಾಣಿ'],
    gst: 0,
    rating: 4.6,
    reviews: 145,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'maida-flour',
    name: 'Refined Wheat Flour (Maida)',
    category: 'grains',
    description: 'Fine refined wheat flour for baking and cooking',
    unitPrice: 40,
    bulkPrice: 38,
    unit: 'kg',
    bulkUnit: '50kg',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 500,
    availableQuantities: ['1kg', '2kg', '5kg', '10kg', '25kg'],
    quantityPrices: {
      '1kg': 40,
      '2kg': 78,
      '5kg': 190,
      '10kg': 370,
      '25kg': 900
    },
    supplierId: 'grain-master',
    supplierName: 'Grain Master',
    image: getProductImage('maida-flour'),
    tags: ['maida', 'flour', 'refined', 'baking', 'मैदा', 'మైదా', 'மைதா', 'ಮೈದಾ'],
    gst: 5,
    rating: 4.5,
    reviews: 167,
    vendorTypes: ['street_shop', 'restaurant', 'waffle_counter']
  },

  {
    id: 'corn-flour',
    name: 'Corn Flour',
    category: 'grains',
    description: 'Pure corn flour for thickening and cooking',
    unitPrice: 60,
    bulkPrice: 55,
    unit: 'kg',
    bulkUnit: '25kg',
    minBulkQuantity: 25,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['500g', '1kg', '2kg', '5kg'],
    quantityPrices: {
      '500g': 32,
      '1kg': 60,
      '2kg': 115,
      '5kg': 275
    },
    supplierId: 'grain-master',
    supplierName: 'Grain Master',
    image: getProductImage('corn-flour'),
    tags: ['corn flour', 'starch', 'thickening', 'मक्का आटा', 'మొక్కజొన్న పిండి', 'சோள மாவு', 'ಜೋಳದ ಹಿಟ್ಟು'],
    gst: 5,
    rating: 4.3,
    reviews: 89,
    vendorTypes: ['street_shop', 'restaurant']
  },

  // New products for existing images that don't have products yet
  {
    id: 'chilli-sauce',
    name: 'Spicy Chilli Sauce',
    category: 'spices',
    description: 'Hot and tangy chilli sauce for street food and snacks',
    unitPrice: 80,
    bulkPrice: 70, // 12.5% discount for bulk (12+ bottles)
    unit: 'bottle (200ml)',
    bulkUnit: '12 bottles',
    minBulkQuantity: 12,
    inStock: true,
    stockQuantity: 150,
    availableQuantities: ['200ml', '500ml', '1L', '12 bottles'],
    quantityPrices: {
      '200ml': 80, // ₹400/L (base price)
      '500ml': 190, // ₹380/L (5% discount)
      '1L': 360, // ₹360/L (10% discount)
      '12 bottles': 840 // ₹70/bottle (12.5% discount)
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('chilli-sauce'),
    tags: ['chilli sauce', 'hot sauce', 'spicy', 'condiment', 'मिर्च सॉस', 'మిర్చి సాస్', 'மிளகாய் சாஸ்', 'ಮೆಣಸಿನಕಾಯಿ ಸಾಸ್'],
    gst: 12,
    rating: 4.4,
    reviews: 123,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'chinese-sauce-kit',
    name: 'Chinese Sauce Kit',
    category: 'spices',
    description: 'Complete kit with soy sauce, vinegar, and Chinese seasonings',
    unitPrice: 150,
    bulkPrice: 140,
    unit: 'kit',
    bulkUnit: '10 kits',
    minBulkQuantity: 10,
    inStock: true,
    stockQuantity: 80,
    availableQuantities: ['1 kit', '3 kits', '5 kits'],
    quantityPrices: {
      '1 kit': 150,
      '3 kits': 420,
      '5 kits': 675
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('chinese-sauce-kit'),
    tags: ['chinese sauce', 'soy sauce', 'vinegar', 'chinese cooking', 'चाइनीज सॉस', 'చైనీస్ సాస్', 'சீன சாஸ்', 'ಚೈನೀಸ್ ಸಾಸ್'],
    gst: 12,
    rating: 4.6,
    reviews: 87,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'sweet-corn-fresh',
    name: 'Fresh Sweet Corn',
    category: 'vegetables',
    description: 'Fresh sweet corn kernels perfect for salads and street food',
    unitPrice: 40,
    bulkPrice: 38,
    unit: 'kg',
    bulkUnit: '25kg',
    minBulkQuantity: 25,
    inStock: true,
    stockQuantity: 200,
    availableQuantities: ['500g', '1kg', '2kg', '5kg'],
    quantityPrices: {
      '500g': 22,
      '1kg': 40,
      '2kg': 76,
      '5kg': 180
    },
    supplierId: 'green-valley',
    supplierName: 'Green Valley Farms',
    image: getProductImage('sweet-corn-fresh'),
    tags: ['sweet corn', 'corn kernels', 'fresh', 'vegetables', 'मक्का', 'మొక్కజొన్న', 'சோளம்', 'ಜೋಳ'],
    gst: 0,
    rating: 4.5,
    reviews: 156,
    vendorTypes: ['street_vendor', 'restaurant']
  },

  {
    id: 'tata-salt',
    name: 'Tata Salt',
    category: 'spices',
    description: 'Premium iodized salt from Tata brand',
    unitPrice: 25,
    bulkPrice: 21, // 16% discount for bulk (50kg+)
    unit: 'kg',
    bulkUnit: '50kg',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 500,
    availableQuantities: ['1kg', '2kg', '5kg', '10kg', '25kg', '50kg'],
    quantityPrices: {
      '1kg': 25, // ₹25/kg (base price)
      '2kg': 49, // ₹24.5/kg (2% discount)
      '5kg': 120, // ₹24/kg (4% discount)
      '10kg': 230, // ₹23/kg (8% discount)
      '25kg': 550, // ₹22/kg (12% discount)
      '50kg': 1050 // ₹21/kg (16% discount)
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('tata-salt'),
    tags: ['tata salt', 'iodized salt', 'premium', 'नमक', 'ఉప్పు', 'உப்பு', 'ಉಪ್ಪು'],
    gst: 5,
    rating: 4.8,
    reviews: 234,
    vendorTypes: ['street_shop', 'restaurant', 'street_vendor']
  },

  {
    id: 'regular-salt',
    name: 'Regular Salt',
    category: 'spices',
    description: 'Pure white salt for everyday cooking',
    unitPrice: 20,
    bulkPrice: 16, // 20% discount for bulk (50kg+)
    unit: 'kg',
    bulkUnit: '50kg',
    minBulkQuantity: 50,
    inStock: true,
    stockQuantity: 600,
    availableQuantities: ['1kg', '2kg', '5kg', '10kg', '25kg', '50kg'],
    quantityPrices: {
      '1kg': 20, // ₹20/kg (base price)
      '2kg': 39, // ₹19.5/kg (2.5% discount)
      '5kg': 95, // ₹19/kg (5% discount)
      '10kg': 180, // ₹18/kg (10% discount)
      '25kg': 425, // ₹17/kg (15% discount)
      '50kg': 800 // ₹16/kg (20% discount)
    },
    supplierId: 'spice-king',
    supplierName: 'Spice King',
    image: getProductImage('regular-salt'),
    tags: ['salt', 'white salt', 'cooking', 'नमक', 'ఉప్పు', 'உப்பு', 'ಉಪ್ಪು'],
    gst: 5,
    rating: 4.3,
    reviews: 145,
    vendorTypes: ['street_shop', 'restaurant', 'street_vendor']
  }
]

export const suppliers = [
  {
    id: 'raj-traders',
    name: 'Raj Traders',
    address: 'Shop 15, Grain Market, Delhi',
    phone: '+91 98765 43210',
    email: 'raj@rajtraders.com',
    rating: 4.8,
    reviews: 156,
    location: { latitude: 28.6139, longitude: 77.2090 },
    specialties: ['grains', 'cereals'],
    verified: true,
    deliveryTime: '2-4 hours',
    minOrder: 500
  },
  {
    id: 'green-valley',
    name: 'Green Valley Farms',
    address: 'Vegetable Market, Sector 12, Gurgaon',
    phone: '+91 98765 43211',
    email: 'info@greenvalley.com',
    rating: 4.6,
    reviews: 234,
    location: { latitude: 28.4595, longitude: 77.0266 },
    specialties: ['vegetables', 'fresh produce'],
    verified: true,
    deliveryTime: '1-2 hours',
    minOrder: 300
  },
  {
    id: 'spice-king',
    name: 'Spice King',
    address: 'Spice Market, Old Delhi',
    phone: '+91 98765 43212',
    email: 'orders@spiceking.com',
    rating: 4.9,
    reviews: 267,
    location: { latitude: 28.6562, longitude: 77.2410 },
    specialties: ['spices', 'masalas'],
    verified: true,
    deliveryTime: '3-5 hours',
    minOrder: 200
  },
  {
    id: 'oil-mart',
    name: 'Oil Mart',
    address: 'Industrial Area, Phase 1, Noida',
    phone: '+91 98765 43213',
    email: 'sales@oilmart.com',
    rating: 4.5,
    reviews: 123,
    location: { latitude: 28.5355, longitude: 77.3910 },
    specialties: ['oils', 'cooking oils'],
    verified: true,
    deliveryTime: '4-6 hours',
    minOrder: 1000
  },
  {
    id: 'dairy-fresh',
    name: 'Dairy Fresh',
    address: 'Dairy Complex, Faridabad',
    phone: '+91 98765 43214',
    email: 'fresh@dairyfresh.com',
    rating: 4.6,
    reviews: 89,
    location: { latitude: 28.4089, longitude: 77.3178 },
    specialties: ['dairy', 'milk products'],
    verified: true,
    deliveryTime: '1-3 hours',
    minOrder: 250
  }
]

// Search function
export const searchProducts = (query, category = null) => {
  const searchTerm = query.toLowerCase()
  
  return products.filter(product => {
    const matchesCategory = !category || product.category === category
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    
    return matchesCategory && matchesSearch && product.inStock
  })
}

// Get products by category
export const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.category === categoryId && product.inStock)
}

// Get product by ID
export const getProductById = (productId) => {
  return products.find(product => product.id === productId)
}

// Get supplier by ID
export const getSupplierById = (supplierId) => {
  return suppliers.find(supplier => supplier.id === supplierId)
}
