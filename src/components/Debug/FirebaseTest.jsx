import React, { useState, useEffect } from 'react'
import { auth, db } from '../../config/firebase'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { toast } from 'react-toastify'

const FirebaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [authStatus, setAuthStatus] = useState('not-tested')
  const [firestoreStatus, setFirestoreStatus] = useState('not-tested')
  const [testResults, setTestResults] = useState([])

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }])
  }

  const testFirebaseConnection = async () => {
    setConnectionStatus('testing')
    setTestResults([])
    
    try {
      // Test 1: Firebase Config
      addResult('Config', 'success', 'Firebase configuration loaded successfully')
      
      // Test 2: Auth Connection
      setAuthStatus('testing')
      try {
        await new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(auth, 
            (user) => {
              unsubscribe()
              resolve(user)
            },
            (error) => {
              unsubscribe()
              reject(error)
            }
          )
          
          // Timeout after 10 seconds
          setTimeout(() => {
            unsubscribe()
            reject(new Error('Auth connection timeout'))
          }, 10000)
        })
        
        setAuthStatus('success')
        addResult('Auth', 'success', 'Firebase Auth connection successful')
      } catch (authError) {
        setAuthStatus('error')
        addResult('Auth', 'error', `Auth error: ${authError.message}`)
        throw authError
      }

      // Test 3: Firestore Connection
      setFirestoreStatus('testing')
      try {
        // Try to read from a collection (this tests network connectivity)
        const testCollection = collection(db, 'connection_test')
        await getDocs(testCollection)
        
        setFirestoreStatus('success')
        addResult('Firestore', 'success', 'Firestore connection successful')
      } catch (firestoreError) {
        setFirestoreStatus('error')
        addResult('Firestore', 'error', `Firestore error: ${firestoreError.message}`)
        throw firestoreError
      }

      setConnectionStatus('success')
      addResult('Overall', 'success', 'All Firebase services connected successfully')
      toast.success('Firebase connection test passed!')
      
    } catch (error) {
      setConnectionStatus('error')
      addResult('Overall', 'error', `Connection failed: ${error.message}`)
      toast.error(`Firebase connection failed: ${error.message}`)
      console.error('Firebase connection test failed:', error)
    }
  }

  const testAnonymousAuth = async () => {
    try {
      addResult('Anonymous Auth', 'testing', 'Testing anonymous authentication...')
      const userCredential = await signInAnonymously(auth)
      addResult('Anonymous Auth', 'success', `Anonymous user created: ${userCredential.user.uid}`)
      toast.success('Anonymous authentication successful!')
    } catch (error) {
      addResult('Anonymous Auth', 'error', `Anonymous auth failed: ${error.message}`)
      toast.error(`Anonymous auth failed: ${error.message}`)
      console.error('Anonymous auth error:', error)
    }
  }

  const testFirestoreWrite = async () => {
    try {
      addResult('Firestore Write', 'testing', 'Testing Firestore write operation...')
      const testDoc = await addDoc(collection(db, 'connection_test'), {
        test: true,
        timestamp: new Date(),
        message: 'Connection test document'
      })
      addResult('Firestore Write', 'success', `Document written with ID: ${testDoc.id}`)
      toast.success('Firestore write test successful!')
    } catch (error) {
      addResult('Firestore Write', 'error', `Firestore write failed: ${error.message}`)
      toast.error(`Firestore write failed: ${error.message}`)
      console.error('Firestore write error:', error)
    }
  }

  useEffect(() => {
    // Auto-run basic connection test on component mount
    testFirebaseConnection()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'testing': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'testing': return '⏳'
      default: return '⚪'
    }
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        🔥 Firebase Connection Test
      </h2>
      
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-2">{getStatusIcon(connectionStatus)}</div>
          <div className="text-sm font-medium">Overall</div>
          <div className={`text-xs ${getStatusColor(connectionStatus)}`}>
            {connectionStatus}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-2">{getStatusIcon(authStatus)}</div>
          <div className="text-sm font-medium">Auth</div>
          <div className={`text-xs ${getStatusColor(authStatus)}`}>
            {authStatus}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-2">{getStatusIcon(firestoreStatus)}</div>
          <div className="text-sm font-medium">Firestore</div>
          <div className={`text-xs ${getStatusColor(firestoreStatus)}`}>
            {firestoreStatus}
          </div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-2xl mb-2">🌐</div>
          <div className="text-sm font-medium">Network</div>
          <div className="text-xs text-blue-600">
            {navigator.onLine ? 'online' : 'offline'}
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={testFirebaseConnection}
          className="btn-primary"
          disabled={connectionStatus === 'testing'}
        >
          {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
        
        <button
          onClick={testAnonymousAuth}
          className="btn-secondary"
        >
          Test Anonymous Auth
        </button>
        
        <button
          onClick={testFirestoreWrite}
          className="btn-secondary"
        >
          Test Firestore Write
        </button>
      </div>

      {/* Test Results */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Test Results:</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {testResults.map((result, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(result.status)}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {result.test}
                  </div>
                  <div className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.message}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {result.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Network Information:</h4>
        <div className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <div>Online Status: {navigator.onLine ? '✅ Online' : '❌ Offline'}</div>
          <div>Connection Type: {navigator.connection?.effectiveType || 'Unknown'}</div>
          <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
        </div>
      </div>

      {/* Troubleshooting Tips */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">Troubleshooting Tips:</h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
          <li>• Check your internet connection</li>
          <li>• Verify Firebase project settings</li>
          <li>• Check browser console for detailed errors</li>
          <li>• Try disabling browser extensions</li>
          <li>• Check if your network blocks Firebase domains</li>
          <li>• Verify API keys are correct</li>
        </ul>
      </div>
    </div>
  )
}

export default FirebaseTest
