import { auth, db } from '../config/firebase';
import { signInAnonymously, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  const results = {
    auth: false,
    firestore: false,
    errors: []
  };

  try {
    // Test Authentication
    console.log('🔍 Testing Firebase Authentication...');
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Anonymous auth successful:', userCredential.user.uid);
    
    // Test Firestore
    console.log('🔍 Testing Firestore...');
    const testDoc = doc(db, 'test', 'connection-test');
    await setDoc(testDoc, { 
      timestamp: new Date().toISOString(),
      test: 'Firebase connection test'
    });
    
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      console.log('✅ Firestore write/read successful');
      results.firestore = true;
      
      // Clean up test document
      await deleteDoc(testDoc);
      console.log('🧹 Test document cleaned up');
    }
    
    // Sign out
    await signOut(auth);
    console.log('✅ Sign out successful');
    results.auth = true;
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    results.errors.push(error.message);
  }

  return results;
};

export const getFirebaseStatus = () => {
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  const status = {
    environment: import.meta.env.NODE_ENV || 'development',
    host: typeof window !== 'undefined' ? window.location.host : 'server',
    envVarsSet: Object.entries(envVars).map(([key, value]) => ({
      key,
      set: !!value,
      value: value ? `${value.substring(0, 10)}...` : 'Not set'
    })),
    authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: envVars.VITE_FIREBASE_PROJECT_ID
  };

  console.log('🔧 Firebase Status:', status);
  return status;
};
