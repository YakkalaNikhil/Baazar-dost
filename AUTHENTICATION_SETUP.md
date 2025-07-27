# 🔐 Authentication & Authorization Setup Guide

## 🚨 CRITICAL: Firebase Console Setup Required

Your Firebase project `baazar-dost` is connected, but you need to enable services in the Firebase Console.

---

## 🔥 Step 1: Enable Authentication

### **1.1 Go to Firebase Console**
Open: https://console.firebase.google.com/project/baazar-dost/authentication

### **1.2 Enable Authentication**
1. Click **"Get started"** button
2. Go to **"Sign-in method"** tab
3. Enable these methods:

**✅ Email/Password:**
- Click "Email/Password"
- Toggle "Enable" to ON
- Click "Save"

**✅ Email link (passwordless sign-in):**
- Click "Email link (passwordless sign-in)"
- Toggle "Enable" to ON
- Click "Save"

---

## 🗄️ Step 2: Enable Firestore Database

### **2.1 Go to Firestore Console**
Open: https://console.firebase.google.com/project/baazar-dost/firestore

### **2.2 Create Database**
1. Click **"Create database"** button
2. Choose **"Start in test mode"** (for development)
3. Select location: **"asia-south1"** (for India)
4. Click "Done"

### **2.3 Update Security Rules**
1. Go to "Rules" tab
2. Replace the default rules with the content from `firestore.rules` file
3. Click "Publish"

---

## 🧪 Step 3: Test Authentication

### **3.1 Run the Auth Test**
1. Start your app: `npm run dev`
2. Go to: http://localhost:5173/auth-test
3. This will test all Firebase connections

### **3.2 Test Registration Flow**
1. Go to: http://localhost:5173/register
2. Choose "Vendor" or "Supplier"
3. Complete registration form
4. Check your email for login link
5. Click the link to complete registration

### **3.3 Test Login Flow**
1. Go to: http://localhost:5173/login
2. Enter your email
3. Check email for login link
4. Click link to sign in

---

## 🔧 Step 4: Verify Everything Works

### **4.1 Check Firebase Console**

**Authentication Users:**
- Go to: https://console.firebase.google.com/project/baazar-dost/authentication/users
- You should see registered users

**Firestore Data:**
- Go to: https://console.firebase.google.com/project/baazar-dost/firestore/data
- You should see collections: `users`, `orders`, `test`

### **4.2 Test App Features**
1. **Register as Vendor** → Complete profile setup
2. **Browse Products** → Should see 50+ products
3. **Add to Cart** → Should work without errors
4. **Place Order** → Should create order in Firestore
5. **Register as Supplier** → Should access supplier dashboard

---

## 🚨 Troubleshooting

### **"Firebase not configured" Error**
**Solution:**
1. Check that Authentication is enabled in Firebase Console
2. Check that Firestore is created
3. Restart development server: `npm run dev`

### **"Permission denied" Error**
**Solution:**
1. Update Firestore rules from `firestore.rules` file
2. Make sure you're authenticated
3. Check browser console for detailed errors

### **"Invalid action code" Error**
**Solution:**
1. Make sure Email Link authentication is enabled
2. Use the same browser/device for registration and email link
3. Don't use incognito mode

### **Email not received**
**Solution:**
1. Check spam folder
2. Make sure email address is correct
3. Try with Gmail (best compatibility)
4. Check Firebase Console → Authentication → Templates

### **"Auth domain not authorized" Error**
**Solution:**
1. Go to Firebase Console → Authentication → Settings
2. Add your domain to "Authorized domains"
3. For development, add: `localhost`

---

## 🔒 Security Rules Explanation

The `firestore.rules` file contains:

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Orders can be read/written by order owner
match /orders/{orderId} {
  allow read, write: if request.auth.uid == resource.data.userId;
}

// Products are read-only for all authenticated users
match /products/{productId} {
  allow read: if request.auth != null;
  allow write: if false; // Admin only
}
```

---

## 📱 Mobile Testing

### **Test on Mobile Device:**
1. Connect phone to same WiFi
2. Find your computer's IP address
3. Open: `http://YOUR_IP:5173`
4. Test registration and login

### **Common Mobile Issues:**
- **Voice search:** Requires HTTPS (use ngrok for testing)
- **Email links:** May open in different browser
- **Notifications:** Need HTTPS for push notifications

---

## 🚀 Production Deployment

### **Before Deploying:**
1. Update Firestore rules to production mode
2. Set up proper email templates
3. Configure authorized domains
4. Enable Firebase Analytics
5. Set up monitoring

### **Deploy Commands:**
```bash
npm run build
firebase deploy
```

---

## ✅ Verification Checklist

- [ ] Firebase Authentication enabled
- [ ] Email/Password sign-in enabled
- [ ] Email link sign-in enabled
- [ ] Firestore database created
- [ ] Security rules updated
- [ ] Auth test passes all checks
- [ ] Registration flow works
- [ ] Login flow works
- [ ] User profiles are created
- [ ] Orders can be placed
- [ ] Supplier dashboard accessible

---

## 🆘 Still Having Issues?

1. **Check Browser Console** (F12) for detailed errors
2. **Check Firebase Console** for authentication logs
3. **Run Auth Test** at `/auth-test` for diagnostics
4. **Verify Environment Variables** in `.env` file
5. **Check Network Tab** for failed API calls

**Your Firebase project is ready - just enable the services in the console!** 🔥
