import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getRecommendedAuthMethod, getPopupBlockerHelp, isMobileDevice } from '../../utils/popupUtils';

const GoogleSignInButton = ({ className = '', onSuccess = () => {} }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [recommendedMethod, setRecommendedMethod] = useState('popup');

  const handleGoogleSignIn = async (method = 'popup') => {
    try {
      setLoading(true);
      const result = await signInWithGoogle(method);
      
      if (result.success) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      toast.error('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
      setShowOptions(false);
    }
  };

  useEffect(() => {
    const { method } = getRecommendedAuthMethod();
    setRecommendedMethod(method);
  }, []);

  return (
    <div className="relative">
      {!showOptions ? (
        <div className="space-y-2">
          {/* Primary Google Sign-In Button */}
          <button
            onClick={() => handleGoogleSignIn(recommendedMethod)}
            disabled={loading}
            className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                Signing in...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Trouble signing in? link */}
          <button
            onClick={() => setShowOptions(true)}
            className="w-full text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Trouble signing in?
          </button>
        </div>
      ) : (
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900">Choose sign-in method:</h3>
          
          <button
            onClick={() => handleGoogleSignIn('popup')}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Popup Window {!isMobile() && '(Recommended)'}
          </button>

          <button
            onClick={() => handleGoogleSignIn('redirect')}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Redirect {isMobile() && '(Recommended for mobile)'}
          </button>

          <button
            onClick={() => setShowOptions(false)}
            className="w-full text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>

          <div className="text-xs text-gray-500 mt-2">
            <p><strong>Popup:</strong> Faster, but may be blocked by browsers</p>
            <p><strong>Redirect:</strong> More reliable, but redirects to Google</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;
