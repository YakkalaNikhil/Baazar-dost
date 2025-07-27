import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

// Utility function to create test orders for supplier dashboard testing
export const createTestOrder = async (userProfile) => {
  try {
    const testOrder = {
      userId: 'test-user-123',
      userEmail: 'testuser@example.com',
      status: 'pending',
      items: [
        {
          productId: 'panipuri-kit-complete',
          cartKey: 'panipuri-kit-complete-bulk-100 pieces',
          name: 'Complete Panipuri Kit (100 pieces)',
          price: 150,
          pricePerUnit: 1.5,
          quantity: 2,
          actualQuantity: 200,
          bulkMultiplier: 100,
          orderType: 'bulk',
          unit: '100 pieces',
          originalUnit: 'piece',
          selectedQuantity: '100 pieces',
          supplierId: userProfile?.supplierId || userProfile?.uid || 'platform',
          supplierName: userProfile?.businessName || userProfile?.name || 'Test Supplier',
          category: 'panipuri_supplies',
          description: 'Everything needed for panipuri: puris, masala, chutneys, and sev',
          image: '/images/panipuri kit.jpg'
        },
        {
          productId: 'wheat-flour-10kg',
          cartKey: 'wheat-flour-10kg-unit',
          name: 'Whole Wheat Flour',
          price: 450,
          pricePerUnit: 45,
          quantity: 1,
          actualQuantity: 10,
          bulkMultiplier: 10,
          orderType: 'unit',
          unit: '10kg bag',
          originalUnit: 'kg',
          supplierId: userProfile?.supplierId || userProfile?.uid || 'platform',
          supplierName: userProfile?.businessName || userProfile?.name || 'Test Supplier',
          category: 'grains',
          description: 'Premium quality whole wheat flour',
          image: '/images/wheat flour 1.jpg'
        },
        {
          productId: 'red-onions-fresh',
          cartKey: 'red-onions-fresh-bulk-5kg',
          name: 'Fresh Red Onions (5kg)',
          price: 120,
          pricePerUnit: 24,
          quantity: 3,
          actualQuantity: 15,
          bulkMultiplier: 5,
          orderType: 'bulk',
          unit: '5kg',
          originalUnit: 'kg',
          selectedQuantity: '5kg',
          supplierId: userProfile?.supplierId || userProfile?.uid || 'platform',
          supplierName: userProfile?.businessName || userProfile?.name || 'Test Supplier',
          category: 'vegetables',
          description: 'Fresh red onions, perfect for cooking',
          image: '/images/onion.webp'
        }
      ],
      summary: {
        subtotal: 870, // (150*2) + 450 + (120*3)
        tax: 156.6, // 18% GST
        total: 1026.6,
        itemCount: 6 // 2 + 1 + 3
      },
      customerInfo: {
        name: 'Test Customer',
        phone: '+91 9876543210',
        email: 'testuser@example.com',
        address: '123 Test Street, Test City, Test State - 123456',
        vendorType: 'panipuri_vendor'
      },
      deliveryInfo: {
        address: '123 Test Street, Test City, Test State - 123456',
        landmark: 'Near Test Market',
        deliveryTime: 'morning',
        specialInstructions: 'Please call before delivery'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      orderNumber: `ORD-${Date.now()}`,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending'
    }

    const docRef = await addDoc(collection(db, 'orders'), testOrder)
    console.log('Test order created with ID:', docRef.id)
    return { success: true, orderId: docRef.id }
  } catch (error) {
    console.error('Error creating test order:', error)
    return { success: false, error: error.message }
  }
}

// Create multiple test orders with different statuses
export const createMultipleTestOrders = async (userProfile) => {
  const statuses = ['pending', 'confirmed', 'delivered', 'cancelled']
  const results = []

  for (let i = 0; i < 4; i++) {
    try {
      const testOrder = {
        userId: `test-user-${i + 1}`,
        userEmail: `testuser${i + 1}@example.com`,
        status: statuses[i],
        items: [
          {
            productId: 'panipuri-kit-complete',
            cartKey: `panipuri-kit-complete-bulk-${i + 1}`,
            name: 'Complete Panipuri Kit (50 pieces)',
            price: 80,
            pricePerUnit: 1.6,
            quantity: i + 1,
            actualQuantity: (i + 1) * 50,
            bulkMultiplier: 50,
            orderType: 'bulk',
            unit: '50 pieces',
            originalUnit: 'piece',
            selectedQuantity: '50 pieces',
            supplierId: userProfile?.supplierId || userProfile?.uid || 'platform',
            supplierName: userProfile?.businessName || userProfile?.name || 'Test Supplier',
            category: 'panipuri_supplies',
            description: 'Everything needed for panipuri',
            image: '/images/panipuri kit.jpg'
          }
        ],
        summary: {
          subtotal: 80 * (i + 1),
          tax: 80 * (i + 1) * 0.18,
          total: 80 * (i + 1) * 1.18,
          itemCount: i + 1
        },
        customerInfo: {
          name: `Test Customer ${i + 1}`,
          phone: `+91 987654321${i}`,
          email: `testuser${i + 1}@example.com`,
          address: `${i + 1}23 Test Street, Test City, Test State - 12345${i}`,
          vendorType: 'panipuri_vendor'
        },
        deliveryInfo: {
          address: `${i + 1}23 Test Street, Test City, Test State - 12345${i}`,
          landmark: `Near Test Market ${i + 1}`,
          deliveryTime: i % 2 === 0 ? 'morning' : 'evening',
          specialInstructions: `Test order ${i + 1} instructions`
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        orderNumber: `ORD-${Date.now()}-${i + 1}`,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: statuses[i] === 'delivered' ? 'completed' : 'pending'
      }

      const docRef = await addDoc(collection(db, 'orders'), testOrder)
      results.push({ success: true, orderId: docRef.id, status: statuses[i] })
      console.log(`Test order ${i + 1} created with ID:`, docRef.id, 'Status:', statuses[i])
    } catch (error) {
      console.error(`Error creating test order ${i + 1}:`, error)
      results.push({ success: false, error: error.message, status: statuses[i] })
    }
  }

  return results
}

// Helper function to clear test orders (for cleanup)
export const clearTestOrders = async () => {
  try {
    // This would require admin privileges or a cloud function
    // For now, just log the instruction
    console.log('To clear test orders, use Firebase Console or delete manually')
    return { success: true, message: 'Check console for instructions' }
  } catch (error) {
    console.error('Error clearing test orders:', error)
    return { success: false, error: error.message }
  }
}
