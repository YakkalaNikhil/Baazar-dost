import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

console.log('🚀 Starting Baazar Dost server...');
console.log('📁 Current directory:', __dirname);
console.log('🌐 Port:', port);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Check if dist directory exists
const distPath = join(__dirname, 'dist');
console.log('📂 Dist path:', distPath);
console.log('📂 Dist exists:', existsSync(distPath));

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files from dist directory
if (existsSync(distPath)) {
  console.log('✅ Serving static files from dist directory');
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
    lastModified: true
  }));
} else {
  console.error('❌ Dist directory not found!');
}

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    distExists: existsSync(join(__dirname, 'dist')),
    indexExists: existsSync(join(__dirname, 'dist', 'index.html'))
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint requested');
  res.json({
    message: 'Baazar Dost API is working!',
    timestamp: new Date().toISOString()
  });
});

// API endpoint for basic info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Baazar Dost',
    version: '1.0.0',
    description: 'Street Vendor Marketplace with Voice Navigation',
    features: [
      'Voice Navigation (5 languages)',
      'Voice Ordering with Quantity',
      'Bulk Order System',
      'Supplier Dashboard',
      'Multi-language Support'
    ]
  });
});

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html');
  console.log('📄 Serving index.html for:', req.path);

  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('❌ index.html not found at:', indexPath);
    res.status(500).send('Application not built properly. Please check build process.');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Baazar Dost server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Access your app at: http://localhost:${port}`);
  console.log(`💡 Health check: http://localhost:${port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
