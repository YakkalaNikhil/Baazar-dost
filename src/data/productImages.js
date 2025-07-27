// Product image mappings - ONLY exact matches, no misplaced images
// Only mapping products that have actual matching images
export const productImages = {
  // PANIPURI SUPPLIES - Exact matches only
  'panipuri-kit-complete': [
    '/images/panipuri kit.jpg',
    '/images/panipuri chips.jpg'
  ],
  'panipuri-puris-fresh': ['/images/panipuri chips.jpg'],
  'pani-puri-kit': [
    '/images/panipuri kit.jpg',
    '/images/panipuri chips.jpg'
  ],

  // WAFFLE SUPPLIES - Only chocolate syrup has exact match
  'chocolate-syrup-waffle': ['/images/chocolate syrup.jpg'],

  // GRAINS & CEREALS - Only wheat flour has exact images
  'wheat-flour-10kg': [
    '/images/wheat flour 1.jpg',
    '/images/wheat flour2.webp',
    '/images/wheat flour 3.avif'
  ],
  // New products for existing images
  'maida-flour': ['/images/maida.webp'],
  'corn-flour': ['/images/CORN-FLOUR.jpg'],

  // VEGETABLES - Exact matches only
  'onions-red': ['/images/onion.webp'],
  'tomatoes-fresh': ['/images/tomata.jpg'],
  'potatoes-fresh': ['/images/potato.jpg'],
  'green-chillies-fresh': ['/images/green chilles.jpeg'],
  'curry-leaves-fresh': ['/images/CurryLeaves.webp'],
  'coriander-leaves-fresh': ['/images/coriander leaves.jpg'],
  'green-peas-fresh': ['/images/green peas.avif'],

  // SPICES & MASALAS - Exact matches only
  'red-chili-powder': [
    '/images/red chilli.jpg',
    '/images/RedChilliPowder.webp'
  ],
  'garam-masala-powder': ['/images/garam masala.webp'],

  // DAIRY PRODUCTS - Exact match
  'milk-packets': ['/images/milk.jpg'],

  // BEVERAGES & TEA - Exact match
  'tea-powder': ['/images/tea cups.webp'],

  // PACKAGING MATERIALS - Exact matches
  'paper-plates': [
    '/images/disposable plates 1.jpg',
    '/images/disposable-paper-plates.webp'
  ],
  'plastic-cups-disposable': ['/images/tea cups.webp'],

  // SAUCE PRODUCTS - New products for existing sauce images
  'chilli-sauce': ['/images/chilli sauces.webp'],
  'chinese-sauce-kit': ['/images/chinesse sauce kit.webp'],

  // SALT PRODUCTS - Exact matches
  'tata-salt': ['/images/tata salt.jpg'],
  'regular-salt': ['/images/salt1.avif'],

  // SWEET CORN - New product for existing image
  'sweet-corn-fresh': ['/images/sweet corn.jpg']
}

// Function to get image URL(s) for a product
export const getProductImage = (productId, index = 0) => {
  const images = productImages[productId]
  if (!images) return null

  // If it's an array, return the specific index or first image
  if (Array.isArray(images)) {
    return images[index] || images[0]
  }

  // If it's a single string, return it
  return images
}

// Function to get all images for a product
export const getProductImages = (productId) => {
  const images = productImages[productId]
  if (!images) return []

  // If it's an array, return it
  if (Array.isArray(images)) {
    return images
  }

  // If it's a single string, return it as an array
  return [images]
}

// Function to get the number of images for a product
export const getProductImageCount = (productId) => {
  const images = productImages[productId]
  if (!images) return 0

  return Array.isArray(images) ? images.length : 1
}
