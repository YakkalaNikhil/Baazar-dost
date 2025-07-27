import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Mic,
  Globe,
  Moon,
  Sun,
  Search,
  ShoppingCart,
  MapPin,
  FileText,
  Smartphone,
  Wifi,
  Database
} from 'lucide-react'

const FeatureStatus = ({ className = '' }) => {
  const { t } = useTranslation()
  const [systemStatus, setSystemStatus] = useState({})

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = async () => {
    const status = {}

    // Check voice search support
    status.voiceSearch = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    
    // Check geolocation support
    status.geolocation = 'geolocation' in navigator
    
    // Check local storage
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
      status.localStorage = true
    } catch {
      status.localStorage = false
    }

    // Check network status
    status.online = navigator.onLine

    // Check device capabilities
    status.mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    status.touchScreen = 'ontouchstart' in window

    // Check browser features
    status.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches !== undefined
    status.notifications = 'Notification' in window

    setSystemStatus(status)
  }

  const features = [
    {
      name: 'Multi-language Support',
      description: '5 Indian languages with native fonts',
      status: 'working',
      icon: Globe,
      details: 'English, Hindi, Telugu, Tamil, Kannada'
    },
    {
      name: 'Voice Search',
      description: 'Speech recognition in multiple languages',
      status: systemStatus.voiceSearch ? 'working' : 'not-supported',
      icon: Mic,
      details: systemStatus.voiceSearch ? 'Web Speech API supported' : 'Not supported in this browser'
    },
    {
      name: 'Dark/Light Theme',
      description: 'Automatic theme switching',
      status: 'working',
      icon: systemStatus.darkMode ? Moon : Sun,
      details: 'System preference detection and manual toggle'
    },
    {
      name: 'Responsive Design',
      description: 'Mobile-first vendor-friendly UI',
      status: 'working',
      icon: Smartphone,
      details: `${systemStatus.mobile ? 'Mobile' : 'Desktop'} device detected`
    },
    {
      name: 'Search & Suggestions',
      description: 'Smart search with history and suggestions',
      status: 'working',
      icon: Search,
      details: 'Text and voice search with autocomplete'
    },
    {
      name: 'Geolocation Services',
      description: 'Find nearby suppliers',
      status: systemStatus.geolocation ? 'ready' : 'not-supported',
      icon: MapPin,
      details: systemStatus.geolocation ? 'GPS location services available' : 'Location services not supported'
    },
    {
      name: 'Shopping Cart',
      description: 'Unit and bulk ordering system',
      status: 'in-progress',
      icon: ShoppingCart,
      details: 'Basic cart functionality implemented'
    },
    {
      name: 'PDF Invoices',
      description: 'GST-compliant invoice generation',
      status: 'planned',
      icon: FileText,
      details: 'jsPDF integration planned'
    },
    {
      name: 'Offline Support',
      description: 'Works without internet connection',
      status: systemStatus.online ? 'online' : 'offline',
      icon: Wifi,
      details: systemStatus.online ? 'Currently online' : 'Offline mode active'
    },
    {
      name: 'Data Persistence',
      description: 'Local storage for user preferences',
      status: systemStatus.localStorage ? 'working' : 'not-supported',
      icon: Database,
      details: systemStatus.localStorage ? 'Local storage available' : 'Storage not available'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'working':
        return 'text-green-600 dark:text-green-400'
      case 'ready':
        return 'text-blue-600 dark:text-blue-400'
      case 'in-progress':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'planned':
        return 'text-gray-600 dark:text-gray-400'
      case 'not-supported':
        return 'text-red-600 dark:text-red-400'
      case 'online':
        return 'text-green-600 dark:text-green-400'
      case 'offline':
        return 'text-orange-600 dark:text-orange-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'working':
      case 'ready':
      case 'online':
        return <CheckCircle className="w-5 h-5" />
      case 'in-progress':
        return <Clock className="w-5 h-5" />
      case 'planned':
        return <Clock className="w-5 h-5" />
      case 'not-supported':
      case 'offline':
        return <XCircle className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'working': return 'Working'
      case 'ready': return 'Ready'
      case 'in-progress': return 'In Progress'
      case 'planned': return 'Planned'
      case 'not-supported': return 'Not Supported'
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      default: return 'Unknown'
    }
  }

  const workingCount = features.filter(f => f.status === 'working' || f.status === 'ready' || f.status === 'online').length
  const totalCount = features.length

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Feature Status
        </h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {workingCount}/{totalCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Features Ready
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {feature.name}
                  </h3>
                  <div className={`flex items-center space-x-1 ${getStatusColor(feature.status)}`}>
                    {getStatusIcon(feature.status)}
                    <span className="text-xs font-medium">
                      {getStatusText(feature.status)}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {feature.description}
                </p>
                
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {feature.details}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* System Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          System Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-blue-700 dark:text-blue-300">Device:</span>
            <span className="ml-1 text-blue-900 dark:text-blue-100">
              {systemStatus.mobile ? 'Mobile' : 'Desktop'}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Touch:</span>
            <span className="ml-1 text-blue-900 dark:text-blue-100">
              {systemStatus.touchScreen ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Network:</span>
            <span className="ml-1 text-blue-900 dark:text-blue-100">
              {systemStatus.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <div>
            <span className="text-blue-700 dark:text-blue-300">Storage:</span>
            <span className="ml-1 text-blue-900 dark:text-blue-100">
              {systemStatus.localStorage ? 'Available' : 'Limited'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureStatus
