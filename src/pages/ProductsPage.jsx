import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  MapPin
} from 'lucide-react'
import { toast } from 'react-toastify'
import SearchBar from '../components/Search/SearchBar'
import ProductImage from '../components/UI/ProductImage'
import BulkOrderSelector from '../components/Products/BulkOrderSelector'
import { categories, products as staticProducts, searchProducts, getProductsByCategory } from '../data/products'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../config/firebase'
import { calculateDistance, formatDistance } from '../utils/location'

const ProductsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { addToCart, cartItems } = useCart()
  const { userProfile } = useAuth()
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('name')
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    loadAllProducts()
    getUserLocation()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [selectedCategory, sortBy, allProducts])

  const getUserLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
          },
          (error) => {
            console.log('Location access denied or unavailable')
          }
        )
      }
    } catch (error) {
      console.log('Error getting user location:', error)
    }
  }

  const loadAllProducts = async () => {
    try {
      setLoading(true)

      // Load supplier products from Firebase
      const supplierProductsRef = collection(db, 'supplier_products')
      const supplierQuery = query(supplierProductsRef, where('isActive', '==', true))
      const supplierSnapshot = await getDocs(supplierQuery)

      const supplierProducts = []
      supplierSnapshot.forEach((doc) => {
        const productData = { id: doc.id, ...doc.data(), source: 'supplier' }

        // Add distance if user location is available
        if (userLocation && productData.supplierLocation) {
          const distance = calculateDistance(userLocation, productData.supplierLocation)
          productData.distance = distance
          productData.distanceText = formatDistance(distance)
        }

        supplierProducts.push(productData)
      })

      // Combine with static products (mark them as platform products)
      const platformProducts = staticProducts.map(product => ({
        ...product,
        source: 'platform',
        id: product.id || `platform_${product.name.replace(/\s+/g, '_').toLowerCase()}`
      }))

      const combinedProducts = [...supplierProducts, ...platformProducts]
      setAllProducts(combinedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
      // Fallback to static products
      setAllProducts(staticProducts.map(product => ({
        ...product,
        source: 'platform',
        id: product.id || `platform_${product.name.replace(/\s+/g, '_').toLowerCase()}`
      })))
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    if (!allProducts.length) return

    let filtered = selectedCategory
      ? allProducts.filter(p => p.category === selectedCategory && (p.inStock || p.source === 'platform'))
      : allProducts.filter(p => p.inStock || p.source === 'platform')

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.unitPrice - b.unitPrice
        case 'price-high':
          return b.unitPrice - a.unitPrice
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
    setLoading(false)
  }

  const handleSearch = (query) => {
    setLoading(true)
    const results = searchProducts(query, selectedCategory)
    setFilteredProducts(results)
    setLoading(false)
  }

  const handleAddToCart = async (product, orderType = 'unit') => {
    try {
      const result = await addToCart(product, 1, orderType)
      if (result.success) {
        toast.success(`${product.name} added to cart!`)
      }
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId)
  }

  const ProductCard = ({ product }) => {
    const productName = t(`productNames.${product.id}`, { defaultValue: product.name })
    const [selectedQuantity, setSelectedQuantity] = useState(product.availableQuantities?.[0] || product.unit)
    const [selectedPrice, setSelectedPrice] = useState(
      product.quantityPrices?.[product.availableQuantities?.[0]] || product.unitPrice
    )
    const [showBulkSelector, setShowBulkSelector] = useState(false)

    const handleQuantityChange = (quantity) => {
      setSelectedQuantity(quantity)
      setSelectedPrice(product.quantityPrices?.[quantity] || product.unitPrice)
    }

    const handleBulkOrder = (e) => {
      e.stopPropagation()
      setShowBulkSelector(true)
    }

    return (
      <div
        className="card hover:shadow-lg transition-all duration-300 group cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {/* Product Image */}
        <div className="relative mb-4">
          <div className="w-full h-48 rounded-lg overflow-hidden">
            {product.fileType === 'application/pdf' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-red-500 mb-2">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  PDF Document
                </p>
                <button
                  onClick={() => window.open(product.image, '_blank')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  View PDF
                </button>
              </div>
            ) : (
              <ProductImage
                productId={product.id}
                productName={productName}
                className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                showImageCount={true}
              />
            )}
          </div>
        {product.rating >= 4.5 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {product.rating}
          </div>
        )}
        {isInCart(product.id) && (
          <div className="absolute top-2 right-2 bg-primary-500 text-white p-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
            {productName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Supplier Info */}
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Truck className="w-4 h-4 mr-1" />
            <span>{product.source === 'supplier' ? product.supplierName : 'Baazar Dost'}</span>
          </div>
          {product.source === 'supplier' && product.distanceText && (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{product.distanceText} away</span>
            </div>
          )}
          {product.source === 'supplier' && (
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Local Supplier
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
              {product.rating}
            </span>
          </div>
          <span className="text-xs text-gray-500">({product.reviews} {t('common.reviews')})</span>
        </div>

        {/* Quantity Selector & Pricing */}
        <div className="space-y-3">
          {/* Quantity Options */}
          {product.availableQuantities && product.availableQuantities.length > 1 && (
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Select Quantity:
              </label>
              <select
                value={selectedQuantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {product.availableQuantities.map((quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity} - ₹{product.quantityPrices?.[quantity] || product.unitPrice}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Current Price */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{selectedPrice}
              </span>
              <span className="text-sm text-gray-500 ml-1">/{selectedQuantity}</span>
              {product.quantityPrices && selectedQuantity !== product.unit && (
                <div className="text-xs text-green-600 mt-1">
                  ₹{(selectedPrice / parseFloat(selectedQuantity.replace(/[^\d.]/g, '')) || 1).toFixed(1)}/unit
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart({
                  ...product,
                  selectedQuantity,
                  selectedPrice,
                  displayName: `${productName} (${selectedQuantity})`
                }, 'custom')
              }}
              className="btn-primary text-sm px-4 py-2 flex items-center space-x-1"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t('products.addToCart')}</span>
            </button>
          </div>

          {/* Bulk Order Options */}
          {product.availableQuantities && product.availableQuantities.length > 1 && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleBulkOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors"
                disabled={!product.inStock}
              >
                <Package className="w-4 h-4" />
                <span>Bulk Order Options</span>
              </button>
            </div>
          )}

          {/* Legacy Bulk Option (if no quantity options available) */}
          {(!product.availableQuantities || product.availableQuantities.length <= 1) && product.bulkPrice && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-md font-semibold text-green-600 dark:text-green-400">
                  ₹{product.bulkPrice}
                </span>
                <span className="text-xs text-gray-500 ml-1">/{product.bulkUnit}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToCart(product, 'bulk')
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md flex items-center space-x-1"
                disabled={!product.inStock}
              >
                <Package className="w-3 h-3" />
                <span>{t('common.bulk')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Bulk Order Selector Modal */}
        {showBulkSelector && (
          <BulkOrderSelector
            product={product}
            onClose={() => setShowBulkSelector(false)}
          />
        )}

        {/* Stock Status */}
        <div className="flex items-center text-xs">
          {product.inStock ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>In Stock ({product.stockQuantity} available)</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>Out of Stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
    )
  }

  // Restrict access for suppliers
  if (userProfile?.role === 'supplier') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Suppliers cannot access the products page for purchasing. Please use your supplier dashboard to manage your products.
            </p>
            <button
              onClick={() => navigate('/')}
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
            {t('products.title')}
          </h1>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search products, categories, or suppliers..."
            className="mb-6"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories & Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Categories */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                {t('products.categories')}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    !selectedCategory
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {t('products.allProducts', 'All Products')}
                </button>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <span className="text-sm">{t(`categories.${category.id}`, { defaultValue: category.name })}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {t('products.sortBy')}
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full input-field"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} products
                {selectedCategory && (
                  <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
