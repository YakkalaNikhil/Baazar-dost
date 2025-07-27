import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard'
import ProductManagement from '../components/Supplier/ProductManagement'
import OrderManagement from '../components/Supplier/OrderManagement'
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter,
  TrendingUp,
  Users,
  ShoppingCart,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { collection, query, where, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-toastify'
import { createTestOrder, createMultipleTestOrders } from '../utils/createTestOrder'
import { processFirestoreDoc, formatOrderDate } from '../utils/dateUtils'

const SupplierDashboard = () => {
  const { t } = useTranslation()
  const { user, userProfile } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    completedOrders: 0
  })
  const [creatingTestOrders, setCreatingTestOrders] = useState(false)

  useEffect(() => {
    if (user && userProfile?.role === 'supplier') {
      loadOrders()
    }
  }, [user, userProfile])

  const loadOrders = async () => {
    try {
      setLoading(true)

      // Get all orders and filter client-side since Firestore doesn't support array-contains with complex objects
      const ordersRef = collection(db, 'orders')
      const q = query(
        ordersRef,
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const allOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...processFirestoreDoc(doc.data(), ['createdAt', 'updatedAt'])
      }))

      // Filter orders that contain products from this supplier
      const supplierOrders = allOrders.filter(order => {
        if (!order.items || !Array.isArray(order.items)) return false

        return order.items.some(item => {
          // Check multiple possible supplier identifiers
          const supplierMatches = [
            item.supplierId === user?.uid,
            item.supplierId === userProfile?.supplierId,
            item.supplierName === userProfile?.businessName,
            item.supplierName === userProfile?.name,
            // Also check if the supplier created products that match
            item.supplierId === 'platform' && userProfile?.businessName // For platform products managed by this supplier
          ]

          return supplierMatches.some(match => match)
        })
      })

      console.log('All orders:', allOrders.length)
      console.log('Supplier orders:', supplierOrders.length)
      console.log('User profile:', userProfile)
      console.log('User UID:', user?.uid)

      // Debug: Show sample order items to understand structure
      if (allOrders.length > 0) {
        console.log('Sample order items:', allOrders[0].items)
      }

      setOrders(supplierOrders)
      calculateStats(supplierOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error(`Failed to load orders: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (ordersList) => {
    const stats = {
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter(o => o.status === 'pending').length,
      completedOrders: ordersList.filter(o => o.status === 'delivered').length,
      totalRevenue: ordersList
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + (order.summary?.total || 0), 0)
    }
    setStats(stats)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      })
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      ))
      
      toast.success(`Order ${newStatus} successfully!`)
      calculateStats(orders)
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    }
  }

  // Test order creation functions
  const handleCreateTestOrder = async () => {
    setCreatingTestOrders(true)
    try {
      const result = await createTestOrder(userProfile)
      if (result.success) {
        toast.success('Test order created successfully!')
        loadOrders() // Reload orders
      } else {
        toast.error(`Failed to create test order: ${result.error}`)
      }
    } catch (error) {
      toast.error('Error creating test order')
    } finally {
      setCreatingTestOrders(false)
    }
  }

  const handleCreateMultipleTestOrders = async () => {
    setCreatingTestOrders(true)
    try {
      const results = await createMultipleTestOrders(userProfile)
      const successCount = results.filter(r => r.success).length
      toast.success(`Created ${successCount} test orders successfully!`)
      loadOrders() // Reload orders
    } catch (error) {
      toast.error('Error creating test orders')
    } finally {
      setCreatingTestOrders(false)
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

  const getPaymentStatus = (order) => {
    // Mock payment status based on order status
    if (order.status === 'delivered') return 'paid'
    if (order.status === 'confirmed') return 'pending'
    return 'unpaid'
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 dark:text-green-400'
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'unpaid':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  if (userProfile?.role !== 'supplier') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              This page is only accessible to registered suppliers.
            </p>
          </div>
        </div>
      </div>
    )
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Supplier Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {userProfile?.businessName || userProfile?.name}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp },
                { id: 'orders', name: 'Orders', icon: ShoppingCart },
                { id: 'products', name: 'Products', icon: Package }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
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
            <p className="text-gray-600 dark:text-gray-400">
              Orders will appear here when vendors place them.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const paymentStatus = getPaymentStatus(order)
              const supplierItems = order.items.filter(item => 
                item.supplierId === userProfile?.supplierId || 
                item.supplierName === userProfile?.businessName
              )
              const supplierTotal = supplierItems.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
              )

              return (
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
                          <span>{formatOrderDate(order.createdAt, 'list')}</span>
                          <span>₹{supplierTotal.toFixed(2)}</span>
                          <span>{supplierItems.length} items</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </span>
                      <span className={`text-sm font-medium ${getPaymentStatusColor(paymentStatus)}`}>
                        Payment: {paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Customer: {order.userEmail}
                      </span>
                    </div>
                  </div>

                  {/* Supplier Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Your Items ({supplierItems.length}):
                    </h4>
                    <div className="space-y-1">
                      {supplierItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
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
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm Order</span>
                      </button>
                    )}
                    
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Package className="w-4 h-4" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Payment Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>₹{supplierTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>GST (18%):</span>
                              <span>₹{(supplierTotal * 0.18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span>Total:</span>
                              <span>₹{(supplierTotal * 1.18).toFixed(2)}</span>
                            </div>
                            <div className={`flex justify-between pt-2 ${getPaymentStatusColor(paymentStatus)}`}>
                              <span>Payment Status:</span>
                              <span className="font-medium">{paymentStatus.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Timeline</h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div>Order placed: {formatOrderDate(order.createdAt, 'detail')}</div>
                            <div>Last updated: {formatOrderDate(order.updatedAt, 'detail')}</div>
                            <div>Payment method: {order.paymentMethod?.replace('_', ' ').toUpperCase() || 'Cash on Delivery'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Test Order Creation Buttons */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                🧪 Test Order Creation (Development)
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCreateTestOrder}
                  disabled={creatingTestOrders}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Package size={16} />
                  <span>{creatingTestOrders ? 'Creating...' : 'Create Single Test Order'}</span>
                </button>
                <button
                  onClick={handleCreateMultipleTestOrders}
                  disabled={creatingTestOrders}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Package size={16} />
                  <span>{creatingTestOrders ? 'Creating...' : 'Create Multiple Test Orders'}</span>
                </button>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                These buttons create test orders to help you test the supplier dashboard functionality.
              </p>
            </div>

            <OrderManage