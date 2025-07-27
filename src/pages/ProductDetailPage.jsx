import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { toast } from 'react-toastify'
import ImageGallery from '../components/UI/ImageGallery'
import { products } from '../data/products'
import { getProductImageCount } from '../data/productImages'

const ProductDetailPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { addToCart, cartItems } = useCart()
  
  const [product, setProduct] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState('')
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find product by ID
    const foundProduct = products.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
      const defaultQuantity = foundProduct.availableQuantities?.[0] || foundProduct.unit
      setSelectedQuantity(defaultQuantity)
      setSelectedPrice(foundProduct.quantityPrices?.[defaultQuantity] || foundProduct.unitPrice)
    }
    setLoading(false)
  }, [productId])

  const handleAddToCart = async (orderType = 'unit') => {
    if (!product) return
    
    try {
      const cartProduct = {
        ...product,
        selectedQuantity,
        selectedPrice,
        displayName: `${product.name} (${selectedQuantity})`
      }
      
      const result = await addToCart(cartProduct, 1, orderType)
      if (result.success) {
        toast.success(`${product.name} added to cart!`)
      }
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  const handleQuantityChange = (quantity) => {
    setSelectedQuantity(quantity)
    setSelectedPrice(product.quantityPrices?.[quantity] || product.unitPrice)
  }

  const isInCart = () => {
    return cartItems.some(item => item.productId === productId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  const imageCount = getProductImageCount(productId)
  const productName = t(`productNames.${product.id}`, { defaultValue: product.name })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ImageGallery
              productId={productId}
              productName={productName}
              className="w-full h-96"
            />
            
            {imageCount > 1 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  📸 This product has {imageCount} high-quality images. Use the gallery above to view all angles and details.
                </p>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {productName}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>

            {/* Rating and Reviews */}
            {product.rating && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {product.rating}
                  </span>
                </div>
                {product.reviews && (
                  <span className="text-gray-600 dark:text-gray-400">
                    ({product.reviews} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                {/* Quantity Selector */}
                {product.availableQuantities && product.availableQuantities.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Quantity:
                    </label>
                    <select
                      value={selectedQuantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {product.availableQuantities.map((quantity) => (
                        <option key={quantity} value={quantity}>
                          {quantity} - ₹{product.quantityPrices?.[quantity] || product.unitPrice}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Display */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-primary-600">
                      ₹{selectedPrice}
                    </span>
                    <span className="text-gray-500 ml-2">/{selectedQuantity}</span>
                  </div>
                  {product.bulkPrice && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Bulk Price</div>
                      <div className="text-lg font-semibold text-green-600">
                        ₹{product.bulkPrice}/{product.bulkUnit}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add to Cart Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleAddToCart('custom')}
                    disabled={!product.inStock}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>
                      {isInCart() ? 'Added to Cart' : 'Add to Cart'}
                    </span>
                    {isInCart() && <CheckCircle className="w-5 h-5" />}
                  </button>

                  {product.bulkPrice && (
                    <button
                      onClick={() => handleAddToCart('bulk')}
                      disabled={!product.inStock}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Package className="w-5 h-5" />
                      <span>Order Bulk ({product.bulkUnit})</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">
                    In Stock ({product.stockQuantity} available)
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Supplier Information */}
            {product.supplierName && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Supplier Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {product.supplierName}
                    </span>
                  </div>
                  {product.distance && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {product.distanceText} away
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 6).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
