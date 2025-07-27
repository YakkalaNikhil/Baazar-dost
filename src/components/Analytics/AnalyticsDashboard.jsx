import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  IndianRupee,
  ShoppingCart,
  Star,
  Calendar,
  Filter,
  Download,
  Eye,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const AnalyticsDashboard = () => {
  const { t } = useTranslation()
  const { user, userProfile } = useAuth()
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    revenue: { current: 0, previous: 0, change: 0, trend: 'up' },
    orders: { current: 0, previous: 0, change: 0, trend: 'up' },
    customers: { current: 0, previous: 0, change: 0, trend: 'up' },
    avgOrder: { current: 0, previous: 0, change: 0, trend: 'up' }
  })
  const [realTimeData, setRealTimeData] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    topProducts: [],
    recentOrders: []
  })

  useEffect(() => {
    if (user && userProfile?.role === 'supplier') {
      loadRealTimeAnalytics()
    }
  }, [user, userProfile, timeRange])

  const loadRealTimeAnalytics = async () => {
    try {
      setLoading(true)

      // Get supplier's products
      const productsRef = collection(db, 'supplier_products')
      const productsQuery = query(productsRef, where('supplierId', '==', user.uid))
      const productsSnapshot = await getDocs(productsQuery)

      const products = []
      productsSnapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() })
      })

      // Get orders containing supplier's products
      const ordersRef = collection(db, 'orders')
      const ordersQuery = query(ordersRef, orderBy('createdAt', 'desc'))
      const ordersSnapshot = await getDocs(ordersQuery)

      const allOrders = []
      ordersSnapshot.forEach(doc => {
        const orderData = { id: doc.id, ...doc.data() }
        // Filter to only include orders with this supplier's products
        const supplierItems = orderData.items?.filter(item =>
          item.supplierId === user.uid ||
          item.supplierName === userProfile?.businessName
        ) || []

        if (supplierItems.length > 0) {
          allOrders.push({
            ...orderData,
            items: supplierItems,
            createdAt: orderData.createdAt?.toDate() || new Date()
          })
        }
      })

      // Calculate metrics
      const now = new Date()
      const timeRangeMs = getTimeRangeMs(timeRange)
      const currentPeriodStart = new Date(now.getTime() - timeRangeMs)
      const previousPeriodStart = new Date(now.getTime() - (timeRangeMs * 2))

      const currentOrders = allOrders.filter(order => order.createdAt >= currentPeriodStart)
      const previousOrders = allOrders.filter(order =>
        order.createdAt >= previousPeriodStart && order.createdAt < currentPeriodStart
      )

      const currentRevenue = currentOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.items.reduce((itemSum, item) =>
          itemSum + (item.price * item.quantity), 0), 0)

      const previousRevenue = previousOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.items.reduce((itemSum, item) =>
          itemSum + (item.price * item.quantity), 0), 0)

      const uniqueCustomers = new Set(currentOrders.map(order => order.userId)).size
      const previousUniqueCustomers = new Set(previousOrders.map(order => order.userId)).size

      const avgOrderValue = currentOrders.length > 0 ? currentRevenue / currentOrders.length : 0
      const previousAvgOrderValue = previousOrders.length > 0 ? previousRevenue / previousOrders.length : 0

      // Calculate product performance
      const productSales = {}
      allOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              name: item.name,
              quantity: 0,
              revenue: 0
            }
          }
          productSales[item.productId].quantity += item.quantity
          productSales[item.productId].revenue += item.price * item.quantity
        })
      })

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      setMetrics({
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          change: previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0,
          trend: currentRevenue >= previousRevenue ? 'up' : 'down'
        },
        orders: {
          current: currentOrders.length,
          previous: previousOrders.length,
          change: previousOrders.length > 0 ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100 : 0,
          trend: currentOrders.length >= previousOrders.length ? 'up' : 'down'
        },
        customers: {
          current: uniqueCustomers,
          previous: previousUniqueCustomers,
          change: previousUniqueCustomers > 0 ? ((uniqueCustomers - previousUniqueCustomers) / previousUniqueCustomers) * 100 : 0,
          trend: uniqueCustomers >= previousUniqueCustomers ? 'up' : 'down'
        },
        avgOrder: {
          current: avgOrderValue,
          previous: previousAvgOrderValue,
          change: previousAvgOrderValue > 0 ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100 : 0,
          trend: avgOrderValue >= previousAvgOrderValue ? 'up' : 'down'
        }
      })

      setRealTimeData({
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive && p.inStock).length,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter(o => o.status === 'pending').length,
        completedOrders: allOrders.filter(o => o.status === 'delivered').length,
        totalRevenue: allOrders
          .filter(o => o.status === 'delivered')
          .reduce((sum, order) => sum + order.items.reduce((itemSum, item) =>
            itemSum + (item.price * item.quantity), 0), 0),
        topProducts,
        recentOrders: allOrders.slice(0, 5)
      })

    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeRangeMs = (range) => {
    switch (range) {
      case '24h': return 24 * 60 * 60 * 1000
      case '7d': return 7 * 24 * 60 * 60 * 1000
      case '30d': return 30 * 24 * 60 * 60 * 1000
      case '90d': return 90 * 24 * 60 * 60 * 1000
      default: return 7 * 24 * 60 * 60 * 1000
    }
  }

  const topProducts = [
    { name: 'Basmati Rice (25kg)', sales: 45, revenue: 8750, growth: 12.5 },
    { name: 'Turmeric Powder (1kg)', sales: 38, revenue: 3420, growth: 8.3 },
    { name: 'Red Chili Powder (500g)', sales: 32, revenue: 2880, growth: -2.1 },
    { name: 'Cumin Seeds (1kg)', sales: 28, revenue: 4200, growth: 15.7 },
    { name: 'Garam Masala (250g)', sales: 25, revenue: 1875, growth: 5.2 }
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'Raj Kumar', amount: 450, status: 'delivered', time: '2 hours ago' },
    { id: 'ORD-002', customer: 'Priya Sharma', amount: 320, status: 'processing', time: '4 hours ago' },
    { id: 'ORD-003', customer: 'Mohammed Ali', amount: 680, status: 'shipped', time: '6 hours ago' },
    { id: 'ORD-004', customer: 'Sunita Devi', amount: 290, status: 'delivered', time: '8 hours ago' },
    { id: 'ORD-005', customer: 'Vikram Singh', amount: 520, status: 'processing', time: '10 hours ago' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'shipped': return 'text-blue-600 bg-blue-100'
      case 'processing': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const MetricCard = ({ title, value, change, trend, icon: Icon, prefix = '', suffix = '' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {prefix}{value.toLocaleString()}{suffix}
          </p>
        </div>
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your business performance and insights</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={metrics.revenue.current}
          change={metrics.revenue.change}
          trend={metrics.revenue.trend}
          icon={IndianRupee}
          prefix="₹"
        />
        <MetricCard
          title="Total Orders"
          value={metrics.orders.current}
          change={metrics.orders.change}
          trend={metrics.orders.trend}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Active Customers"
          value={metrics.customers.current}
          change={metrics.customers.change}
          trend={metrics.customers.trend}
          icon={Users}
        />
        <MetricCard
          title="Avg Order Value"
          value={metrics.avgOrder.current}
          change={metrics.avgOrder.change}
          trend={metrics.avgOrder.trend}
          icon={TrendingUp}
          prefix="₹"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Products</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {product.sales} sales • ₹{product.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${
                    product.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {order.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {order.customer} • {order.time}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">
                    ₹{order.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <BarChart3 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Revenue chart will be displayed here</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Integration with charting library needed</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="card hover:shadow-lg transition-shadow text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Add Product</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add new products to catalog</p>
            </div>
          </div>
        </button>
        
        <button className="card hover:shadow-lg transition-shadow text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Customer Insights</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">View customer analytics</p>
            </div>
          </div>
        </button>
        
        <button className="card hover:shadow-lg transition-shadow text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Reviews</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage customer reviews</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
