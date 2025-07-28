import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    environment: import.meta.env.NODE_ENV || 'development',
    host: typeof window !== 'undefined' ? window.location.host : 'unknown',
    envVars: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
    },
    authState: 'Checking...',
    errors: []
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        setDebugInfo(prev => ({
          ...prev,
          authState: user ? `✅ Authenticated: ${user.email}` : '❌ Not authenticated'
        }));
      },
      (error) => {
        setDebugInfo(prev => ({
          ...prev,
          authState: '❌ Auth Error',
          errors: [...prev.errors, error.message]
        }));
      }
    );

    return () => unsubscribe();
  }, []);

  // Only show in development or when there are errors
  if (import.meta.env.PROD && debugInfo.errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔧 Firebase Debug Info</h3>
      
      <div className="space-y-1">
        <div><strong>Environment:</strong> {debugInfo.environment}</div>
        <div><strong>Host:</strong> {debugInfo.host}</div>
        <div><strong>Auth State:</strong> {debugInfo.authState}</div>
      </div>

      <div className="mt-2">
        <strong>Environment Variables:</strong>
        <div className="ml-2">
          {Object.entries(debugInfo.envVars).map(([key, value]) => (
            <div key={key}>{key}: {value}</div>
          ))}
        </div>
      </div>

      {debugInfo.errors.length > 0 && (
        <div className="mt-2">
          <strong className="text-red-400">Errors:</strong>
          <div className="ml-2 text-red-300">
            {debugInfo.errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 text-gray-400">
        <strong>Firebase Config:</strong>
        <div className="ml-2">
          Project: {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not set'}
        </div>
      </div>
    </div>
  );
};

export default FirebaseDebug;
