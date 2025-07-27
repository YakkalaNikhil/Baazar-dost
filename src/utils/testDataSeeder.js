// Test data seeder for supplier products
import { collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { sampleProducts } from './sampleData'

/**
 * Seed sample products for a supplier
 * @param {string} supplierId - The supplier's user ID
 * @param {string} supplierName - The supplier's business name
 * @param {Object} supplierLocation - The supplier's location coordinates
 */
export const seedSupplierProducts = async (supplierId, supplierName, supplierLocation) => {
  try {
    // Check if products already exist for this supplier
    const existingProductsRef = collection(db, 'supplier_products')
    const existingQuery = query(existingProductsRef, where('supplierId', '==', supplierId))
    const existingSnapshot = await getDocs(existingQuery)
    
    if (existingSnapshot.size > 0) {
      console.log('Products already exist for this supplier')
      return { success: true, message: 'Products already exist', count: existingSnapshot.size }
    }

    // Add sample products
    const productsToAdd = sampleProducts.map(product => ({
      ...product,
      supplierId,
      supplierName,
      supplierLocation,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'supplier'
    }))

    const addedProducts = []
    for (const product of productsToAdd) {
      const docRef = await addDoc(collection(db, 'supplier_products'), product)
      addedProducts.push({ id: docRef.id, ...product })
    }

    console.log(`Successfully added ${addedProducts.length} products for supplier ${supplierName}`)
    return { 
      success: true, 
      message: `Added ${addedProducts.length} products`, 
      products: addedProducts 
    }
  } catch (error) {
    console.error('Error seeding supplier products:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create a test supplier with sample products
 * This is useful for development and testing
 */
export const createTestSupplier = async () => {
  const testSupplier = {
    supplierId: 'test_supplier_123',
    supplierName: 'Test Fresh Mart',
    supplierLocation: {
      latitude: 28.7041,
      longitude: 77.1025,
      accuracy: 10
    }
  }

  return await seedSupplierProducts(
    testSupplier.supplierId,
    testSupplier.supplierName,
    testSupplier.supplierLocation
  )
}

/**
 * Helper function to add products from the browser console
 * Usage: window.addTestProducts()
 */
export const setupTestHelpers = () => {
  if (typeof window !== 'undefined') {
    window.addTestProducts = createTestSupplier
    window.seedSupplierProducts = seedSupplierProducts
    console.log('Test helpers available: window.addTestProducts(), window.seedSupplierProducts()')
  }
}

/**
 * Sample product data with different file types for testing
 */
export const sampleProductsWithFiles = [
  {
    name: 'Premium Basmati Rice',
    description: 'High-quality aged basmati rice with certificate',
    category: 'grains',
    unitPrice: 150,
    bulkPrice: 140,
    unit: 'kg',
    bulkUnit: '25kg bag',
    minBulkQuantity: 25,
    stockQuantity: 100,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SaWNlIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
    imageType: 'url',
    tags: ['premium', 'aged', 'certified'],
    gst: 5,
    isActive: true,
    inStock: true
  },
  {
    name: 'Organic Certification Document',
    description: 'Organic vegetables with certification PDF',
    category: 'vegetables',
    unitPrice: 80,
    bulkPrice: 70,
    unit: 'kg',
    bulkUnit: '10kg crate',
    minBulkQuantity: 10,
    stockQuantity: 50,
    image: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihPcmdhbmljIENlcnRpZmljYXRlKSBUagpFVApzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0NSAwMDAwMCBuIAowMDAwMDAwMzIyIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDE0CiUlRU9G',
    imageType: 'file',
    fileType: 'application/pdf',
    fileName: 'organic_certificate.pdf',
    tags: ['organic', 'certified', 'fresh'],
    gst: 0,
    isActive: true,
    inStock: true
  }
]

/**
 * Add sample products with different file types
 */
export const addSampleProductsWithFiles = async (supplierId, supplierName, supplierLocation) => {
  try {
    const productsToAdd = sampleProductsWithFiles.map(product => ({
      ...product,
      supplierId,
      supplierName,
      supplierLocation,
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'supplier'
    }))

    const addedProducts = []
    for (const product of productsToAdd) {
      const docRef = await addDoc(collection(db, 'supplier_products'), product)
      addedProducts.push({ id: docRef.id, ...product })
    }

    return { 
      success: true, 
      message: `Added ${addedProducts.length} products with files`, 
      products: addedProducts 
    }
  } catch (error) {
    console.error('Error adding sample products with files:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Clear all test products for a supplier
 */
export const clearSupplierProducts = async (supplierId) => {
  try {
    const productsRef = collection(db, 'supplier_products')
    const q = query(productsRef, where('supplierId', '==', supplierId))
    const querySnapshot = await getDocs(q)
    
    const deletePromises = []
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref))
    })
    
    await Promise.all(deletePromises)
    
    return { 
      success: true, 
      message: `Cleared ${querySnapshot.size} products for supplier ${supplierId}` 
    }
  } catch (error) {
    console.error('Error clearing supplier products:', error)
    return { success: false, error: error.message }
  }
}

// Auto-setup test helpers when module loads
setupTestHelpers()
