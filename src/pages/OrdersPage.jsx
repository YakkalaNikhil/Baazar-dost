import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Download,
  RefreshCw,
  Calendar,
  IndianRupee,
  Eye,
  Filter,
  MapPin,
  Phone
} from 'lucide-react'
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-toastify'
import { downloadBill, previewBill, downloadSupplierBill } from '../utils/billGenerator'

const OrdersPage = () => {
  const { t } = useTranslation()
  const { user, userProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleDownloadBill = (order) => {
    try {
      let success
      if (userProfile?.role === 'supplier') {
        // For suppliers, download commission statement
        success = downloadSupplierBill(order, userProfile)
      } else {
        // For customers, download regular invoice
        success = downloadBill(order, userProfile)
      }

      if (success) {
        toast.success('Bill downloaded successfully!')
      } else {
        toast.error('Failed to download bill')
      }
    } catch (error) {
      console.error('Error downloading bill:', error)
      toast.error('Failed to download bill')
    }
  }

  const handlePreviewBill = (order) => {
    try {
      const success = previewBill(order, userProfile)
      if (!success) {
        toast.error('Failed to preview bill')
      }
    } catch (error) {
      console.error('Error previewing bill:', error)
      toast.error('Failed to preview bill')
    }
  }

  // Test bill generation function
  const testBillGeneration = () => {
    const testOrder = {
      id: 'test-order-' + Date.now(),
      userId: 'test-customer',
      userEmail: 'customer@test.com',
      items: [
        {
          name: 'Test Product 1',
          quantity: 2,
          unit: 'kg',
          price: 100,
          supplierId: user.uid,
          supplierName: userProfile?.businessName || 'Test Supplier'
        },
        {
          name: 'Test Product 2',
          quantity: 1,
          unit: 'piece',
          price: 50,
          supplierId: user.uid,
          supplierName: userProfile?.businessName || 'Test Supplier'
        }
      ],
      summary: {
        subtotal: 250,
        tax: 12.5,
        total: 262.5,
        itemCount: 3
      },
      status: 'completed',
      createdAt: new Date(),
      deliveryAddress: 'Test Address, Test City',
      paymentMethod: 'cash_on_delivery'
    }

    if (userProfile?.role === 'supplier') {
      handleDownloadBill(testOrder)
    } else {
      handleDownloadBill(testOrder)
    }
  }

  // Temporary function to create test orders for suppliers
  const createTestOrder = async () => {
    try {
      console.log('Creating test order for supplier:', user.uid, userProfile?.businessName)

      const testOrder = {
        userId: 'test-customer-' + Date.now(),
        userEmail: 'customer@test.com',
        items: [
          {
            productId: 'panipuri-kit-complete',
            name: 'Complete Panipuri Kit',
            price: 150,
            quantity: 2,
            orderType: 'unit',
            unit: 'kit (100 pieces)',
            supplierId: user.uid,
            supplierName: userProfile?.businessName || 'Test Supplier'
          },
          {
            productId: 'wheat-flour-10kg',
            name: 'Wheat Flour (10kg)',
            price: 750,
            quantity: 1,
            orderType: 'bulk',
            unit: '10kg',
            supplierId: user.uid,
            supplierName: userProfile?.businessName || 'Test Supplier'
          }
        ],
        summary: {
          subtotal: 1050,
          tax: 52.5,
          total: 1102.5,
          itemCount: 3
        },
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        deliveryAddress: 'Test Address, Test City, Test State - 123456',
        paymentMethod: 'cash_on_delivery',
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }

      console.log('Test order data:', testOrder)
      const docRef = await addDoc(collection(db, 'orders'), testOrder)
      console.log('Test order created with ID:', docRef.id)

      toast.success('Test order created successfully!')

      // Reload orders after a short delay to ensure the order is saved
      setTimeout(() => {
        loadOrders()
      }, 1000)
    } catch (error) {
      console.error('Error creating test order:', error)
      toast.error(`Failed to create test order: ${error.message}`)
    }
  }

  // Debug function to check user profile and Firebase connection
  const debugUserInfo = () => {
    console.log('=== DEBUG USER INFO ===')
    console.log('User:', user)
    console.log('User Profile:', userProfile)
    console.log('User Role:', userProfile?.role)
    console.log('Business Name:', userProfile?.businessName)
    console.log('Firebase DB:', db)
    toast.info('Check console for debug information')
  }

  useEffect(() => {
    if (user && userProfile) {
      console.log('OrdersPage: Loading orders for user:', user.uid, 'Role:', userProfile?.role)
      loadOrders()
    } else {
      console.log('OrdersPage: Waiting for user and userProfile to load')
    }
  }, [user, userProfile])

  const loadOrders = async () => {
    try {
      setLoading(true)
      console.log('Loading orders for user:', user.uid, 'Role:', userProfile?.role)

      const ordersRef = collection(db, 'orders')

      let q
      if (userProfile?.role === 'supplier') {
        // For suppliers, get all orders and filter for their products
        console.log('Loading all orders for supplier filtering')
        // Use simple query without orderBy to avoid index requirement
        q = query(ordersRef)
      } else {
        // For customers, get only their orders (without orderBy to avoid index requirement)
        console.log('Loading customer orders only')
        q = query(
          ordersRef,
          where('userId', '==', user.uid)
        )
      }

      const querySnapshot = await getDocs(q)
      console.log('Raw query results:', querySnapshot.docs.length, 'documents')

      let ordersData = querySnapshot.docs.map(doc => {
        const data = doc.data()
        console.log('Order document:', doc.id, data)
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        }
      })

      // Filter orders for suppliers to only show orders containing their products
      if (userProfile?.role === 'supplier') {
        console.log('Supplier filtering orders. Total orders:', ordersData.length)
        console.log('Supplier ID:', user.uid)
        console.log('Business Name:', userProfile?.businessName)

        ordersData = ordersData.filter(order => {
          const hasSupplierItems = order.items && order.items.some(item =>
            item.supplierId === user.uid ||
            item.supplierName === userProfile?.businessName
          )
          console.log(`Order ${order.id} has supplier items:`, hasSupplierItems)
          return hasSupplierItems
        }).map(order => ({
          ...order,
          // Filter items to only show this supplier's products
          items: order.items.filter(item =>
            item.supplierId === user.uid ||
            item.supplierName === userProfile?.businessName
          )
        }))

        console.log('Filtered orders for supplier:', ordersData.length)
      }

      // Sort orders by creation date (newest first) since we removed orderBy from query
      ordersData.sort((a, b) => {
        const dateA = a.createdAt || new Date(0)
        const dateB = b.createdAt || new Date(0)
        return dateB.getTime() - dateA.getTime()
      })

      setOrders(ordersData)
      console.log('Final orders set:', ordersData.length)
    } catch (error) {
      console.error('Error loading orders:', error)
      console.error('Error details:', error.message)

      // More specific error handling
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check your account access.')
      } else if (error.code === 'unavailable') {
        toast.error('Service temporarily unavailable. Please try again.')
      } else {
        toast.error(`Failed to load orders: ${error.message}`)
      }

      // Set empty array on error to show empty state instead of loading forever
      setOrders([])

      // For development: If it's a supplier and Firebase fails, show mock data
      if (userProfile?.role === 'supplier' && import.meta.env.DEV) {
        console.log('Using mock data for supplier orders')
        const mockOrders = [
          {
            id: 'mock-order-1',
            userId: 'customer-123',
            userEmail: 'customer@example.com',
            items: [
              {
                productId: 'wheat-flour-10kg',
                name: 'Wheat Flour (10kg)',
                price: 750,
                quantity: 2,
                orderType: 'bulk',
                unit: '10kg',
                supplierId: user.uid,
                supplierName: userProfile?.businessName || 'Your Business'
              }
            ],
            summary: {
              subtotal: 1500,
              tax: 75,
              total: 1575,
              itemCount: 2
            },
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            deliveryAddress: 'Mock Address, Test City',
            paymentMethod: 'cash_on_delivery'
          }
        ]
        setOrders(mockOrders)
        toast.info('Showing mock data - Firebase connection failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'confirmed':
        return <Package className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const generateInvoice = (order) => {
    // Simple invoice generation - in real app, use jsPDF
    const invoiceData = {
      orderId: order.id,
      date: order.createdAt.toLocaleDateString(),
      items: order.items,
      summary: order.summary,
      userEmail: order.userEmail
    }

    const invoiceText = `
BAAZAR DOST - INVOICE
Order ID: ${invoiceData.orderId}
Date: ${invoiceData.date}
Customer: ${invoiceData.userEmail}

ITEMS:
${invoiceData.items.map(item =>
  `${item.name} x ${item.quantity} @ ₹${item.price} = ₹${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

SUMMARY:
Subtotal: ₹${invoiceData.summary.subtotal.toFixed(2)}
GST (18%): ₹${invoiceData.summary.tax.toFixed(2)}
Total: ₹${invoiceData.summary.total.toFixed(2)}

Thank you for your business!
    `

    const blob = new Blob([invoiceText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${order.id}.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast.success('Invoice downloaded!')
  }

  const reorder = (order) => {
    // Add all items from this order to cart
    toast.info('Reorder functionality will be implemented with cart integration')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {userProfile?.role === 'supplier' ? 'Product Orders' : t('orders.title')}
            </h1>
            {userProfile?.role === 'supplier' && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Orders containing your products
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {userProfile?.role === 'supplier' && (
              <>
                <button
                  onClick={createTestOrder}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 bg-green-50 px-3 py-2 rounded-lg"
                >
                  <Package className="w-4 h-4" />
                  <span>Create Test Order</span>
                </button>
                <button
                  onClick={debugUserInfo}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>Debug Info</span>
                </button>
                <button
                  onClick={testBillGeneration}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-2 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Test Bill</span>
                </button>
              </>
            )}
            <button
              onClick={loadOrders}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? 'No orders found' : `No ${filter} orders`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {userProfile?.role === 'supplier'
                ? (filter === 'all'
                    ? 'No orders containing your products yet'
                    : `No ${filter} orders for your products`)
                : (filter === 'all'
                    ? 'Start shopping to see your orders here'
                    : `You don't have any ${filter} orders`)
              }
            </p>
            {userProfile?.role !== 'supplier' && (
              <button
                onClick={() => window.location.href = '/products'}
                className="btn-primary"
              >
                Browse Products
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Order #{order.id.slice(-6)}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {order.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          {order.summary.total.toFixed(2)}
                        </div>
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {order.summary.itemCount} items
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Items ({order.items.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {item.name} x {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{selectedOrder === order.id ? 'Hide Details' : 'View Details'}</span>
                  </button>

                  <button
                    onClick={() => handleDownloadBill(order)}
                    className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Bill</span>
                  </button>

                  {order.status === 'delivered' && (
                    <button
                      onClick={() => reorder(order)}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reorder</span>
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedOrder === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Items Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-500 ml-2">x {item.quantity}</span>
                              </div>
                              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{order.summary.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>GST (18%):</span>
                            <span>₹{order.summary.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>Total:</span>
                            <span>₹{order.summary.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Truck className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Payment Method: {order.paymentMethod?.replace('_', ' ').toUpperCase() || 'Cash on Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
