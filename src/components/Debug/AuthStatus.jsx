import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthStatus = () => {
  const { user, userProfile, loading } = useAuth();

  // Component disabled - return null to never show
  return null;

  return (
    <div className="fixed top-4 left-4 bg-blue-900 text-white p-3 rounded-lg shadow-lg max-w-sm text-xs z-50">
      <h3 className="font-bold mb-2">🔐 Auth Status</h3>
      
      <div className="space-y-1">
        <div>
          <strong>Loading:</strong> {loading ? '⏳ Yes' : '✅ No'}
        </div>
        
        <div>
          <strong>User:</strong> {user ? '✅ Signed In' : '❌ Not Signed In'}
        </div>
        
        {user && (
          <div className="ml-2 text-blue-200">
            <div>UID: {user.uid.substring(0, 8)}...</div>
            <div>Email: {user.email}</div>
            <div>Name: {user.displayName || 'No name'}</div>
          </div>
        )}
        
        <div>
          <strong>Profile:</strong> {userProfile ? '✅ Loaded' : '❌ Not Loaded'}
        </div>
        
        {userProfile && (
          <div className="ml-2 text-blue-200">
            <div>Role: {userProfile.role || 'No role'}</div>
            <div>Name: {userProfile.name || 'No name'}</div>
          </div>
        )}

        {!loading && user && !userProfile && (
          <div className="mt-2 p-2 bg-yellow-800 rounded text-yellow-200">
            ⚠️ User signed in but profile not loaded
          </div>
        )}

        {!loading && !user && (
          <div className="mt-2 p-2 bg-red-800 rounded text-red-200">
            ❌ User not signed in - should show login
          </div>
        )}

        {!loading && user && userProfile && (
          <div className="mt-2 p-2 bg-green-800 rounded text-green-200">
            ✅ Ready - should show app interface
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStatus;
