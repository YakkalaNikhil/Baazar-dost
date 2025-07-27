import React, { useState } from 'react'
import { getProductImage, getProductImageCount } from '../../data/productImages'

const ProductImage = ({ 
  productId, 
  productName, 
  className = '', 
  showImageCount = true,
  imageIndex = 0,
  fallbackSrc = '/images/placeholder.svg'
}) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const imageSrc = getProductImage(productId, imageIndex)
  const imageCount = getProductImageCount(productId)

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  // If no image or error, show placeholder
  if (!imageSrc || imageError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-2xl mb-1">📦</div>
          <div className="text-xs">No Image</div>
        </div>
        {showImageCount && imageCount > 1 && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            +{imageCount - 1}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      )}
      
      {/* Main Image */}
      <img
        src={imageSrc}
        alt={productName}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />

      {/* Multiple Images Indicator */}
      {showImageCount && imageCount > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
          +{imageCount - 1}
        </div>
      )}

      {/* Brand/Quality Badge */}
      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full opacity-90">
        ✓ Quality
      </div>
    </div>
  )
}

export default ProductImage
