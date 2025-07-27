import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { auth, db } from '../../config/firebase'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader, 
  Database,
  Shield,
  Mail,
  User
} from 'lucide-react'
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore'

const AuthTest = () => {
  const { user, userProfile, loading, sendLoginLink, signOut } = useAuth()
  const [testResults, setTestResults] = useState({})
  const [testEmail, setTestEmail] = useState('')
  const [isRunningTests, setIsRunningTests] = useState(false)

  const runTests = async () => {
    setIsRunningTests(true)
    const results = {}

    // Test 1: Firebase Configuration
    try {
      results.firebaseConfig = {
        status: 'success',
        message: `Connected to project: ${auth.app.options.projectId}`,
        details: {
          projectId: auth.app.options.projectId,
          authDomain: auth.app.options.authDomain,
          apiKey: auth.app.options.apiKey ? 'Configured' : 'Missing'
        }
      }
    } catch (error) {
      results.firebaseConfig = {
        status: 'error',
        message: 'Firebase configuration error',
        error: error.message
      }
    }

    // Test 2: Authentication Service
    try {
      const authUser = auth.currentUser
      results.authService = {
        status: 'success',
        message: authUser ? `Authenticated as: ${authUser.email}` : 'Authentication service ready',
        details: {
          isSignedIn: !!authUser,
          email: authUser?.email,
          uid: authUser?.uid,
          emailVerified: authUser?.emailVerified
        }
      }
    } catch (error) {
      results.authService = {
        status: 'error',
        message: 'Authentication service error',
        error: error.message
      }
    }

    // Test 3: Firestore Connection
    try {
      const testQuery = query(collection(db, 'test'), limit(1))
      await getDocs(testQuery)
      results.firestoreConnection = {
        status: 'success',
        message: 'Firestore connection successful'
      }
    } catch (error) {
      results.firestoreConnection = {
        status: 'error',
        message: 'Firestore connection failed',
        error: error.message,
        suggestion: 'Check Firestore rules and ensure database is created'
      }
    }

    // Test 4: Write Permission Test (if authenticated)
    if (user) {
      try {
        const testDoc = {
          test: true,
          timestamp: new Date(),
          userId: user.uid
        }
        await addDoc(collection(db, 'test'), testDoc)
        results.writePermission = {
          status: 'success',
          message: 'Write permissions working'
        }
      } catch (error) {
        results.writePermission = {
          status: 'error',
          message: 'Write permission failed',
          error: error.message,
          suggestion: 'Check Firestore security rules'
        }
      }
    } else {
      results.writePermission = {
        status: 'warning',
        message: 'Not authenticated - cannot test write permissions'
      }
    }

    setTestResults(results)
    setIsRunningTests(false)
  }

  const handleTestLogin = async (e) => {
    e.preventDefault()
    if (!testEmail.trim()) return
    
    await sendLoginLink(testEmail.trim())
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Loader className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20'
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  useEffect(() => {
    runTests()
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🔐 Authentication & Authorization Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testing Firebase connection and authentication system
        </p>
      </div>

      {/* Current Auth Status */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <User className="w-6 h-6 mr-2" />
          Current Authentication Status
        </h2>
        
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Loading authentication state...</span>
          </div>
        ) : user ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Authenticated</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">UID:</span> {user.uid}
              </div>
              <div>
                <span className="font-medium">Email Verified:</span> {user.emailVerified ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Profile Loaded:</span> {userProfile ? 'Yes' : 'No'}
              </div>
            </div>
            <button
              onClick={signOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <XCircle className="w-5 h-5" />
              <span>Not authenticated</span>
            </div>
            
            <form onSubmit={handleTestLogin} className="flex space-x-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email to test login"
                className="flex-1 input-field"
                required
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
              >
                <Mail className="w-4 h-4" />
                <span>Send Login Link</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            System Tests
          </h2>
          <button
            onClick={runTests}
            disabled={isRunningTests}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
          >
            {isRunningTests ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{isRunningTests ? 'Running Tests...' : 'Run Tests'}</span>
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <div
              key={testName}
              className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {result.message}
                  </p>
                  
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-400">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.suggestion && (
                    <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-400">
                      <strong>Suggestion:</strong> {result.suggestion}
                    </div>
                  )}
                  
                  {result.details && (
                    <div className="mt-2">
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-600 dark:text-gray-400">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Firebase Console Links */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Database className="w-6 h-6 mr-2" />
          Firebase Console Links
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://console.firebase.google.com/project/baazar-dost/authentication"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="font-medium text-gray-900 dark:text-white">Authentication</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Manage users and sign-in methods</div>
          </a>
          
          <a
            href="https://console.firebase.google.com/project/baazar-dost/firestore"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="font-medium text-gray-900 dark:text-white">Firestore Database</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">View data and security rules</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AuthTest
