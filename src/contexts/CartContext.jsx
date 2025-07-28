import React, { createContext, useContext, useState, useEffect } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCart()
  }, [user])

  const loadCart = async () => {
    try {
      setLoading(true)

      if (!user) {
        // For unauthenticated users, load from localStorage
        try {
          const savedCart = localStorage.getItem('cart')
          if (savedCart) {
            setCartItems(JSON.parse(savedCart))
          } else {
            setCartItems([])
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
          setCartItems([])
        }
        setLoading(false)
        return
      }

      // Set up real-time listener for authenticated users
      const cartRef = doc(db, 'carts', user.uid)
      const unsubscribe = onSnapshot(cartRef, (doc) => {
        if (doc.exists()) {
          const cartData = doc.data()
          setCartItems(cartData.items || [])
        } else {
          setCartItems([])
        }
        setLoading(false)
      }, (error) => {
        console.error('Error loading cart:', error)
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error('Error setting up cart listener:', error)
      setLoading(false)
    }
  }

  const saveCart = async (items) => {
    if (!user) {
      // For unauthenticated users, save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(items))
        console.log('Cart saved to localStorage:', items.length, 'items')
        return { success: true }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
        throw new Error('Failed to save cart locally')
      }
    }

    try {
      const cartRef = doc(db, 'carts', user.uid)
      await setDoc(cartRef, {
        items,
        updatedAt: new Date(),
        userId: user.uid
      }, { merge: true })
      console.log('Cart saved to Firebase:', items.length, 'items')
      return { success: true }
    } catch (error) {
      console.error('Error saving cart to Firebase:', error)
      // Fallback to localStorage if Firebase fails
      try {
        localStorage.setItem('cart', JSON.stringify(items))
        console.log('Cart saved to localStorage as fallback')
        return { success: true }
      } catch (localError) {
        console.error('Error saving cart to localStorage fallback:', localError)
        throw new Error('Failed to save cart')
      }
    }
  }

  const addToCart = async (product, quantity = 1, orderType = 'unit', selectedQuantityOption = null) => {
    try {
      // Handle both product.id and product.productId for flexibility
      const productId = product.productId || product.id
      if (!productId) {
        throw new Error('Product ID is required')
      }

      // Create a unique key for cart items based on product, order type, and selected quantity
      const cartKey = selectedQuantityOption
        ? `${productId}-${orderType}-${selectedQuantityOption}`
        : `${productId}-${orderType}`

      const existingItemIndex = cartItems.findIndex(
        item => item.cartKey === cartKey
      )

      let newCartItems
      if (existingItemIndex >= 0) {
        // Update existing item
        newCartItems = [...cartItems]
        newCartItems[existingItemIndex].quantity += quantity
      } else {
        // Add new item with flexible property mapping
        let itemPrice = product.price
        let itemUnit = product.unit
        let displayName = product.name
        let bulkMultiplier = 1
        let actualQuantity = quantity
        let pricePerUnit = itemPrice

        // Handle selected quantity option (bulk orders with specific quantities)
        if (selectedQuantityOption && product.quantityPrices && product.quantityPrices[selectedQuantityOption]) {
          const selectedPrice = product.quantityPrices[selectedQuantityOption]
          const selectedQuantityNumber = parseInt(selectedQuantityOption.split(' ')[0]) || 1

          // Calculate the multiplier for bulk orders
          bulkMultiplier = selectedQuantityNumber
          actualQuantity = quantity * bulkMultiplier
          pricePerUnit = selectedPrice / selectedQuantityNumber
          itemPrice = selectedPrice // Price per bulk unit (e.g., per 5kg pack)
          itemUnit = selectedQuantityOption
          displayName = `${product.name} (${selectedQuantityOption})`

          console.log(`Bulk order: ${quantity} × ${selectedQuantityOption} = ${actualQuantity} pieces`)
          console.log(`Price: ₹${selectedPrice} per ${selectedQuantityOption} (₹${pricePerUnit.toFixed(2)} per piece)`)
          console.log(`Total for this item: ₹${(pricePerUnit * actualQuantity).toFixed(2)}`)
        } else if (product.selectedPrice && product.selectedQuantity) {
          // Use quantity-based pricing (from product detail/listing pages)
          const quantityNumber = parseInt(product.selectedQuantity.split(' ')[0]) || 1
          bulkMultiplier = quantityNumber
          actualQuantity = quantity * bulkMultiplier
          pricePerUnit = product.selectedPrice / quantityNumber
          itemPrice = product.selectedPrice // Price per bulk unit
          itemUnit = product.selectedQuantity
          displayName = `${product.name} (${product.selectedQuantity})`

          console.log(`Selected bulk: ${quantity} × ${product.selectedQuantity} = ${actualQuantity} pieces`)
          console.log(`Price: ₹${product.selectedPrice} per ${product.selectedQuantity} (₹${pricePerUnit.toFixed(2)} per piece)`)
          console.log(`Total for this item: ₹${(pricePerUnit * actualQuantity).toFixed(2)}`)
        } else if (orderType === 'bulk') {
          // Use bulk pricing
          itemPrice = product.bulkPrice || product.unitPrice || product.price
          itemUnit = product.bulkUnit || product.unit
          bulkMultiplier = product.minBulkQuantity || 1
          actualQuantity = quantity * bulkMultiplier
          pricePerUnit = itemPrice / bulkMultiplier
          displayName = `${product.name} (Bulk: ${bulkMultiplier} ${product.unit})`

          console.log(`Bulk pricing: ${quantity} × ${bulkMultiplier} = ${actualQuantity} pieces`)
          console.log(`Price: ₹${itemPrice} per bulk unit (₹${pricePerUnit.toFixed(2)} per piece)`)
          console.log(`Total for this item: ₹${(pricePerUnit * actualQuantity).toFixed(2)}`)
        } else {
          // Use unit pricing
          itemPrice = product.unitPrice || product.price
          itemUnit = product.unit
          pricePerUnit = itemPrice
          actualQuantity = quantity // For unit orders, actual quantity = quantity

          console.log(`Unit pricing: ${quantity} × ₹${itemPrice} = ₹${(itemPrice * quantity).toFixed(2)}`)
        }

        const cartItem = {
          productId: productId,
          cartKey: cartKey,
          name: displayName,
          price: itemPrice,
          pricePerUnit: pricePerUnit,
          quantity,
          actualQuantity: actualQuantity, // Total pieces including bulk multiplier
          bulkMultiplier: bulkMultiplier,
          orderType,
          unit: itemUnit,
          originalUnit: product.unit,
          image: product.image || '/api/placeholder/150/150',
          supplierId: product.supplierId || 'unknown',
          supplierName: product.supplierName || product.supplier || 'Unknown Supplier',
          category: product.category || 'general',
          description: product.description || '',
          originalPrice: product.originalPrice,
          selectedQuantity: selectedQuantityOption || product.selectedQuantity,
          selectedPrice: product.selectedPrice,
          addedAt: new Date()
        }
        newCartItems = [...cartItems, cartItem]
      }

      setCartItems(newCartItems)

      try {
        await saveCart(newCartItems)
      } catch (saveError) {
        // If save fails, revert the cart state
        setCartItems(cartItems)
        throw saveError
      }

      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(error.message || 'Failed to add item to cart')
      return { success: false, error: error.message }
    }
  }

  const removeFromCart = async (cartKey) => {
    try {
      const newCartItems = cartItems.filter(item => item.cartKey !== cartKey)

      setCartItems(newCartItems)
      await saveCart(newCartItems)

      toast.success('Item removed from cart!')
      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item from cart')
      return { success: false, error: error.message }
    }
  }

  const updateQuantity = async (cartKey, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        return await removeFromCart(cartKey)
      }

      const newCartItems = cartItems.map(item => {
        if (item.cartKey === cartKey) {
          // Recalculate actual quantity based on bulk multiplier
          const newActualQuantity = newQuantity * (item.bulkMultiplier || 1)

          console.log(`Updating quantity for ${item.name}:`)
          console.log(`  - New quantity: ${newQuantity}`)
          console.log(`  - Bulk multiplier: ${item.bulkMultiplier || 1}`)
          console.log(`  - New actual quantity: ${newActualQuantity}`)
          console.log(`  - New total: ₹${getItemTotal({...item, quantity: newQuantity, actualQuantity: newActualQuantity}).toFixed(2)}`)

          return {
            ...item,
            quantity: newQuantity,
            actualQuantity: newActualQuantity
          }
        }
        return item
      })

      setCartItems(newCartItems)
      await saveCart(newCartItems)

      return { success: true }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
      return { success: false, error: error.message }
    }
  }

  const clearCart = async () => {
    try {
      setCartItems([])
      await saveCart([])
      
      toast.success('Cart cleared!')
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
      return { success: false, error: error.message }
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = getItemTotal(item)

      console.log(`Cart item: ${item.name}`)
      console.log(`  - Order type: ${item.orderType}`)
      console.log(`  - Price: ₹${item.price}, Quantity: ${item.quantity}`)
      console.log(`  - Bulk multiplier: ${item.bulkMultiplier}`)
      console.log(`  - Actual quantity: ${item.actualQuantity}`)
      console.log(`  - Price per unit: ₹${item.pricePerUnit || 'N/A'}`)
      console.log(`  - Item total: ₹${itemTotal.toFixed(2)}`)

      return total + itemTotal
    }, 0)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  // Helper function to get correct item total
  const getItemTotal = (item) => {
    if (item.bulkMultiplier > 1 && item.pricePerUnit) {
      // For bulk orders: use pricePerUnit × actualQuantity
      return item.pricePerUnit * item.actualQuantity
    } else {
      // For regular orders: use price × quantity
      return item.price * item.quantity
    }
  }

  const getTaxAmount = (subtotal) => {
    // GST calculation (18% for most items, can be customized per product)
    return subtotal * 0.18
  }

  const getCartSummary = () => {
    const subtotal = getCartTotal()
    const tax = getTaxAmount(subtotal)
    const total = subtotal + tax

    return {
      subtotal,
      tax,
      total,
      itemCount: getCartItemCount()
    }
  }

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getItemTotal,
    getTaxAmount,
    getCartSummary,
    isEmpty: cartItems.length === 0
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
