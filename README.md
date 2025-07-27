# 🛒 Baazar Dost - Street Vendor's Best Friend

A modern web application empowering Indian street vendors to order raw materials from nearby grocery suppliers. Built with React, Firebase, and Tailwind CSS.

## 🌟 Features

- **🔐 Gmail OTP Authentication** - Secure login via Firebase Auth email links
- **🌍 Multi-language Support** - Hindi, Telugu, Tamil, Kannada, and English
- **🎤 Voice Search** - Search products using Web Speech API
- **🌙 Dark/Light Mode** - Automatic theme switching with system preference
- **📱 Responsive Design** - Optimized for mobile devices and low-end Android browsers
- **📍 Location-based Suppliers** - Find nearby grocery suppliers using geolocation
- **🛒 Smart Cart Management** - Unit and bulk ordering with dynamic pricing
- **📄 PDF Invoices** - GST-compliant invoices with jsPDF
- **📊 Order History** - Track and reorder previous purchases
- **🎯 Daily Deals** - Special offers and discounts

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd baazar-dost
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Email/Password and Email Link
   - Create a Firestore database
   - Copy your Firebase config

4. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Header, Footer, Navigation
│   └── UI/             # Buttons, Forms, Modals
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   ├── ThemeContext.jsx # Theme management
│   └── CartContext.jsx # Shopping cart state
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication hook
│   ├── useVoiceSearch.js # Voice search functionality
│   └── useGeolocation.js # Location services
├── i18n/               # Internationalization
│   ├── config.js       # i18next configuration
│   └── locales/        # Translation files
├── pages/              # Page components
├── config/             # Configuration files
│   └── firebase.js     # Firebase setup
└── utils/              # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Supported Languages

- **English** - Default language
- **हिंदी (Hindi)** - Full translation with Devanagari fonts
- **తెలుగు (Telugu)** - Complete Telugu localization
- **தமிழ் (Tamil)** - Tamil language support
- **ಕನ್ನಡ (Kannada)** - Kannada translation

## 📱 Browser Support

- Chrome 60+ (recommended for voice search)
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (Android Chrome, iOS Safari)

## 🔒 Security Features

- Firebase Authentication with email links
- Firestore security rules
- Input validation and sanitization
- HTTPS enforcement in production

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Alternative Deployment Options

- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **Render**: Connect your repository for continuous deployment

## 🛠️ Development

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes with proper TypeScript types
3. Add translations for all supported languages
4. Test on mobile devices
5. Submit pull request

### Testing

- Test voice search in different languages
- Verify responsive design on various screen sizes
- Check Firebase security rules
- Test offline functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@baazardost.com

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling
- Lucide React for icons
- i18next for internationalization
- React ecosystem for the foundation

---

**Made with ❤️ for Indian Street Vendors**
