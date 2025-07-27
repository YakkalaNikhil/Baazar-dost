# 🚀 Baazar Dost - Complete Setup Guide for Beginners

## 📋 What You'll Build
A complete e-commerce platform for street vendors with:
- **Vendor Registration & Login** (Panipuri vendors, juice shops, waffle counters, etc.)
- **Supplier Dashboard** with order management and payment tracking
- **Real Product Database** with 50+ items for all vendor types
- **Voice Search** in 5 Indian languages
- **Complete Order Management** with Firebase backend

---

## 🔥 Step 1: Firebase Setup (IMPORTANT!)

### **1.1 Create Firebase Project**
1. Go to: https://console.firebase.google.com
2. Click "Create a project"
3. Project name: `baazar-dost-app`
4. Enable Google Analytics: ✅ Yes
5. Click "Create project"

### **1.2 Add Web App**
1. Click the web icon `</>`
2. App nickname: `Baazar Dost Web`
3. ✅ Check "Set up Firebase Hosting"
4. Click "Register app"
5. **COPY THE CONFIG** - You'll need this!

### **1.3 Enable Authentication**
1. Go to "Authentication" in left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable these methods:
   - ✅ **Email/Password**
   - ✅ **Email link (passwordless sign-in)**

### **1.4 Set up Firestore Database**
1. Go to "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location closest to you (e.g., asia-south1 for India)

### **1.5 Configure Environment Variables**
✅ **ALREADY CONFIGURED!** Your Firebase credentials are already set up in the `.env` file:

```bash
# Your actual Firebase configuration (already configured)
VITE_FIREBASE_API_KEY=AIzaSyCf26KYPMRzoYp_iSHRE3ZLeXphD_RHtKk
VITE_FIREBASE_AUTH_DOMAIN=baazar-dost.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=baazar-dost
VITE_FIREBASE_STORAGE_BUCKET=baazar-dost.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1064183964926
VITE_FIREBASE_APP_ID=1:1064183964926:web:d612eb76031251ddd871af
VITE_FIREBASE_MEASUREMENT_ID=G-H82SF43N80
```

**Note:** The `.env` file is already created with your Firebase project credentials!

---

## 💻 Step 2: Local Development Setup

### **2.1 Install Node.js**
1. Go to: https://nodejs.org
2. Download **LTS version** (recommended)
3. Run the installer
4. ✅ Check "Add to PATH"
5. Restart your computer

### **2.2 Verify Installation**
Open Command Prompt/Terminal and run:
```bash
node --version
npm --version
```
You should see version numbers.

### **2.3 Install Dependencies**
In your project folder:
```bash
npm install
```

### **2.4 Start Development Server**
```bash
npm run dev
```
Your app will be available at: http://localhost:5173

---

## 🏪 Step 3: Understanding the Vendor System

### **Vendor Types Supported:**
1. **🥟 Panipuri Vendors** - Puris, masala, chutneys, sev
2. **🍛 Street Food Vendors** - Spices, oils, vegetables, packaging
3. **🧇 Waffle Counters** - Waffle mix, syrups, toppings
4. **🥤 Juice Shops** - Fresh fruits, ice, cups, straws
5. **🏪 Street Shops** - Grains, general items
6. **🍽️ Small Restaurants** - Bulk ingredients

### **Supplier Features:**
- **Order Management** - View and manage vendor orders
- **Payment Tracking** - Track payment status
- **Inventory Management** - Manage product availability
- **Analytics Dashboard** - Sales and revenue tracking

---

## 🛒 Step 4: Product Database

### **Categories Available:**
- **Grains & Cereals** (Rice, wheat flour, etc.)
- **Fresh Vegetables** (Onions, tomatoes, potatoes)
- **Fresh Fruits** (Oranges, sugarcane for juice)
- **Spices & Masalas** (Turmeric, chili powder, panipuri masala)
- **Cooking Oils** (Sunflower, mustard oil)
- **Dairy Products** (Milk, paneer, butter)
- **Street Snacks** (Panipuri kits, sev, chutneys)
- **Beverages** (Tea, coffee, ice)
- **Waffle Supplies** (Mix, syrups, toppings)
- **Panipuri Supplies** (Complete kits, puris, masala)
- **Packaging Materials** (Plates, cups, bags)
- **Cleaning Supplies** (For all vendor types)

---

## 🎯 Step 5: Testing the Application

### **5.1 Register as Vendor**
1. Go to `/register`
2. Choose "Vendor"
3. Select your vendor type (e.g., Panipuri Vendor)
4. Complete registration
5. Check email for login link

### **5.2 Register as Supplier**
1. Go to `/register`
2. Choose "Supplier"
3. Select business type (e.g., Wholesale)
4. Complete registration

### **5.3 Test Core Features**
1. **Browse Products** - `/products`
2. **Add to Cart** - Unit and bulk ordering
3. **Place Orders** - Complete checkout process
4. **View Orders** - `/orders` for order history
5. **Voice Search** - Use microphone in search bar

### **5.4 Supplier Dashboard**
1. Login as supplier
2. View incoming orders
3. Update order status
4. Track payments

---

## 🔧 Step 6: Customization

### **6.1 Add More Products**
Edit `src/data/products.js`:
```javascript
{
  id: 'your-product-id',
  name: 'Product Name',
  category: 'category_id',
  description: 'Product description',
  unitPrice: 100,
  bulkPrice: 90,
  unit: 'kg',
  bulkUnit: '10kg pack',
  vendorTypes: ['panipuri_vendor', 'street_vendor'],
  // ... more fields
}
```

### **6.2 Add New Vendor Types**
Edit `src/data/products.js`:
```javascript
export const vendorTypes = [
  { id: 'your_vendor_type', name: 'Your Vendor Type', icon: '🏪' },
  // ... existing types
]
```

### **6.3 Customize Categories**
Edit categories in `src/data/products.js` to match your market needs.

---

## 🚀 Step 7: Deployment

### **7.1 Build for Production**
```bash
npm run build
```

### **7.2 Deploy to Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🆘 Troubleshooting

### **Common Issues:**

**1. "Firebase not configured"**
- Check your `.env` file
- Make sure all Firebase config values are correct
- Restart the development server

**2. "Authentication failed"**
- Enable Email/Password and Email Link in Firebase Console
- Check Firebase Authentication settings

**3. "Orders not showing"**
- Check Firestore rules
- Make sure database is in test mode
- Verify user permissions

**4. "Voice search not working"**
- Use Chrome browser (best support)
- Allow microphone permissions
- Check if HTTPS is enabled (required for voice)

---

## 📞 Support

If you need help:
1. Check the browser console for errors (F12)
2. Verify Firebase configuration
3. Make sure all dependencies are installed
4. Check that the development server is running

---

## 🎉 You're Ready!

Your Baazar Dost application is now ready with:
- ✅ Complete vendor-supplier ecosystem
- ✅ Real Firebase backend
- ✅ 50+ products for all vendor types
- ✅ Voice search in 5 languages
- ✅ Order management system
- ✅ Payment tracking
- ✅ Mobile-optimized UI

**Happy coding! 🚀**
