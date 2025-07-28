import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import ProductImage from '../components/UI/ProductImage'
import BulkOrderSummary from '../components/Cart/BulkOrderSummary'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'
import { toast } from 'react-toastify'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

const CartPage = () => {
  const { t } = useTranslation()
  const { user, userProfile } = useAuth()
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartSummary,
    getItemTotal,
    isEmpty
  } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const summary = getCartSummary()

  const handleQuantityChange = async (cartKey, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(cartKey)
    } else {
      await updateQuantity(cartKey, newQuantity)
    }
  }

  const handleRemoveItem = async (cartKey) => {
    await removeFromCart(cartKey)
    toast.success('Item removed from cart')
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
      toast.success('Cart cleared')
    }
  }

  const handleCheckout = async () => {
    if (isEmpty) {
      toast.error('Your cart is empty')
      return
    }

    setIsCheckingOut(true)

    try {
      // Create order in Firebase
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems.map(item => ({
          productId: item.productId,
          cartKey: item.cartKey,
          name: item.name,
          price: item.price,
          pricePerUnit: item.pricePerUnit,
          quantity: item.quantity,
          actualQuantity: item.actualQuantity,
          bulkMultiplier: item.bulkMultiplier,
          orderType: item.orderType,
          unit: item.unit,
          originalUnit: item.originalUnit,
          selectedQuantity: item.selectedQuantity,
          supplierId: item.supplierId,
          supplierName: item.supplierName
        })),
        summary: {
          subtotal: summary.subtotal,
          tax: summary.tax,
          total: summary.total,
          itemCount: summary.itemCount
        },
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deliveryAddress: 'Default Address', // In real app, get from user profile
        paymentMethod: 'cash_on_delivery',
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }

      const docRef = await addDoc(collection(db, 'orders'), orderData)

      // Clear cart after successful order
      await clearCart()

      setOrderPlaced(true)
      toast.success(`Order placed successfully! Order ID: ${docRef.id.slice(-6)}`)

    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your order. You will receive a confirmation shortly.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/orders'}
                className="btn-primary w-full"
              >
                View Order History
              </button>
              <button
                onClick={() => window.location.href = '/products'}
                className="btn-secondary w-full"
              >
                Continue Shopping
              </button>
            </div>
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
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Suppliers cannot access the shopping cart. Please use your supplier dashboard to manage your business.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add some products to your cart to get started
            </p>
            <button
              onClick={() => window.location.href = '/products'}
              className="btn-primary"
            >
              Browse Products
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('cart.title')} ({summary.itemCount} items)
          </h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 flex items-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Bulk Order Summary */}
        <BulkOrderSummary cartItems={cartItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.cartKey} className="card">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <ProductImage
                      productId={item.productId}
                      productName={item.name}
                      className="w-full h-full"
                      showImageCount={false}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {item.supplierName}
                    </p>
                    <div className="flex flex-col space-y-1 mt-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.orderType === 'bulk'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {item.orderType === 'bulk' ? 'Bulk Order' : 'Unit Order'}
                        </span>
                        <span className="text-sm text-gray-500">
                          ₹{item.price}/{item.unit}
                        </span>
                      </div>
                      {/* Show bulk details */}
                      {item.bulkMultiplier > 1 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.quantity} × {item.unit} = {item.actualQuantity} {item.originalUnit}
                          {item.pricePerUnit && (
                            <span className="ml-2">
                              (₹{item.pricePerUnit.toFixed(2)} per {item.originalUnit})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.cartKey, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(item.cartKey, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Show total pieces for bulk orders */}
                    {item.bulkMultiplier > 1 && (
                      <div className="text-xs text-gray-500 text-center">
                        Total: {item.actualQuantity} pieces
                      </div>
                    )}
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                      ₹{getItemTotal(item).toFixed(2)}
                    </div>
                    {/* Show price breakdown for bulk orders */}
                    {item.bulkMultiplier > 1 && item.pricePerUnit && (
                      <div className="text-xs text-gray-500">
                        ₹{item.pricePerUnit.toFixed(2)} × {item.actualQuantity} pieces
                      </div>
                    )}
                    {/* Show unit price breakdown for regular orders */}
                    {item.bulkMultiplier <= 1 && (
                      <div className="text-xs text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.cartKey)}
                      className="text-red-600 hover:text-red-700 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">₹{summary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                  <span className="font-medium">₹{summary.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary-600">
                      ₹{summary.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Delivery Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Free delivery on orders above ₹500</span>
                </div>

                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <Truck className="w-4 h-4 mr-2" />
                  <span>Estimated delivery: 2-4 hours</span>
                </div>

                <div className="flex items-center text-orange-600 dark:text-orange-400">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>Cash on delivery available</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || isEmpty}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center space-x-2"
            >
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Place Order</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
