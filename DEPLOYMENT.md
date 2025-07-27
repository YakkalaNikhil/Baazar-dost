# 🚀 Baazar Dost - Render Deployment Guide

This guide will help you deploy the Baazar Dost application to Render.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Firebase Project**: Set up Firebase project with Authentication and Firestore

## 🔧 Environment Variables

Set these environment variables in your Render dashboard:

### Required Firebase Variables:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Application Variables:
```
NODE_ENV=production
PORT=3000
```

### Optional Variables:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GA_TRACKING_ID=your_google_analytics_id
```

## 🚀 Deployment Steps

### Method 1: Using Render Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `baazar-dost`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

3. **Set Environment Variables**:
   - Go to "Environment" tab
   - Add all the variables listed above

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

### Method 2: Using render.yaml (Infrastructure as Code)

1. **Update render.yaml**:
   - Edit the `render.yaml` file in the root directory
   - Update environment variables with your actual values

2. **Deploy**:
   - Push changes to your repository
   - Render will automatically detect and deploy

## 🔥 Firebase Setup

### 1. Create Firebase Project:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init
```

### 2. Configure Authentication:
- Enable Email/Password authentication
- Enable Google authentication (optional)
- Set up authorized domains (add your Render domain)

### 3. Configure Firestore:
- Create Firestore database
- Set up security rules
- Initialize with sample data (optional)

### 4. Configure Storage:
- Enable Firebase Storage
- Set up storage rules for product images

## 🌐 Domain Configuration

### Custom Domain (Optional):
1. Go to Render Dashboard → Your Service → Settings
2. Add your custom domain
3. Configure DNS records as instructed
4. Update Firebase authorized domains

## 📊 Monitoring & Logs

### View Logs:
- Go to Render Dashboard → Your Service → Logs
- Monitor build and runtime logs

### Health Checks:
- Render automatically monitors your app
- Health check endpoint: `/` (homepage)

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for specific errors

2. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_` for client-side access
   - Restart service after adding variables
   - Check variable names for typos

3. **Firebase Connection Issues**:
   - Verify Firebase configuration
   - Check authorized domains in Firebase Console
   - Ensure Firestore rules allow read/write

4. **Port Issues**:
   - Render automatically sets PORT environment variable
   - Ensure your app uses `process.env.PORT`

### Debug Commands:
```bash
# Test build locally
npm run build

# Test preview locally
npm run preview

# Check environment variables
echo $VITE_FIREBASE_PROJECT_ID
```

## 🚀 Performance Optimization

### Build Optimizations:
- Code splitting enabled
- Minification enabled
- Source maps disabled in production
- Manual chunks for better caching

### Runtime Optimizations:
- Lazy loading for routes
- Image optimization
- Firebase SDK tree-shaking

## 📱 Features Available After Deployment

✅ **Core Features**:
- User authentication (Email/Google)
- Product browsing and search
- Shopping cart functionality
- Order management
- Supplier dashboard

✅ **Advanced Features**:
- Voice navigation (5 languages)
- Voice ordering with quantity
- Bulk order system
- Multi-language support
- Real-time order updates

✅ **Mobile Features**:
- Responsive design
- Touch-friendly interface
- Voice commands on mobile
- Offline-ready (PWA capabilities)

## 🔒 Security Considerations

- Environment variables are secure
- Firebase security rules implemented
- HTTPS enforced by Render
- Input validation and sanitization
- XSS protection enabled

## 📞 Support

If you encounter issues during deployment:

1. Check Render logs for errors
2. Verify Firebase configuration
3. Test locally first
4. Check environment variables
5. Review this deployment guide

## 🎉 Success!

Once deployed, your Baazar Dost application will be available at:
`https://your-app-name.onrender.com`

The application includes:
- 🎤 Voice navigation in 5 languages
- 🛒 Advanced shopping cart with bulk orders
- 📱 Mobile-responsive design
- 🔐 Secure authentication
- 📊 Supplier dashboard
- 🌐 Multi-language support
