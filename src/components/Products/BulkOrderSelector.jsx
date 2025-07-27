import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../contexts/CartContext'
import { Package, ShoppingCart, Calculator, Percent } from 'lucide-react'
import { toast } from 'react-toastify'

const BulkOrderSelector = ({ product, onClose }) => {
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [selectedQuantity, setSelectedQuantity] = useState('')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  // Calculate savings percentage
  const calculateSavings = (bulkPrice, unitPrice, bulkQuantity) => {
    const unitTotal = unitPrice * bulkQuantity
    const savings = ((unitTotal - bulkPrice) / unitTotal) * 100
    return Math.round(savings)
  }

  // Calculate total pieces and price
  const calculateTotals = () => {
    if (!selectedQuantity || !product.quantityPrices) {
      return { totalPieces: 0, totalPrice: 0, pricePerPiece: 0 }
    }

    const quantityNumber = parseInt(selectedQuantity.split(' ')[0]) || 1
    const priceForSelectedQuantity = product.quantityPrices[selectedQuantity]
    const totalPieces = quantityNumber * orderQuantity
    const totalPrice = priceForSelectedQuantity * orderQuantity
    const pricePerPiece = priceForSelectedQuantity / quantityNumber

    return { totalPieces, totalPrice, pricePerPiece }
  }

  const handleAddToCart = async () => {
    if (!selectedQuantity) {
      toast.error('Please select a quantity option')
      return
    }

    setLoading(true)
    try {
      const result = await addToCart(product, orderQuantity, 'bulk', selectedQuantity)
      if (result.success) {
        const { totalPieces, totalPrice } = calculateTotals()
        toast.success(
          `Added ${orderQuantity} × ${selectedQuantity} (${totalPieces} pieces) for ₹${totalPrice}`
        )
        onClose?.()
      }
    } catch (error) {
      console.error('Error adding bulk order:', error)
    } finally {
      setLoading(false)
    }
  }

  const { totalPieces, totalPrice, pricePerPiece } = calculateTotals()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Package className="text-primary-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bulk Order Options
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {product.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          </div>

          {/* Quantity Options */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Quantity Package:
            </label>
            <div className="space-y-2">
              {product.availableQuantities?.map((quantity) => {
                const price = product.quantityPrices?.[quantity]
                const quantityNumber = parseInt(quantity.split(' ')[0]) || 1
                const unitPrice = product.unitPrice || product.price
                const savings = calculateSavings(price, unitPrice, quantityNumber)
                const pricePerPiece = price / quantityNumber

                return (
                  <label
                    key={quantity}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedQuantity === quantity
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="quantity"
                        value={quantity}
                        checked={selectedQuantity === quantity}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                        className="text-primary-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {quantity}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{pricePerPiece.toFixed(2)} per piece
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ₹{price}
                      </div>
                      {savings > 0 && (
                        <div className="flex items-center text-green-600 text-sm">
                          <Percent size={12} className="mr-1" />
                          {savings}% off
                        </div>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Order Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of packages:
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={orderQuantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => setOrderQuantity(orderQuantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Order Summary */}
          {selectedQuantity && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="text-primary-600" size={16} />
                <h5 className="font-medium text-gray-900 dark:text-white">
                  Order Summary
                </h5>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Packages:</span>
                  <span className="text-gray-900 dark:text-white">
                    {orderQuantity} × {selectedQuantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total pieces:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {totalPieces} pieces
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Price per piece:</span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{pricePerPiece.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span className="font-medium text-gray-900 dark:text-white">Total:</span>
                  <span className="font-bold text-primary-600 text-lg">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!selectedQuantity || loading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart size={16} />
              <span>{loading ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkOrderSelector
