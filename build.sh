#!/bin/bash

# Build script for Render deployment

echo "🚀 Starting Baazar Dost build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output directory: dist"
    ls -la dist/
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "🎉 Build process completed!"
