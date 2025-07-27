#!/bin/bash

# Start script for Render deployment

echo "🚀 Starting Baazar Dost application..."

# Set default port if not provided
export PORT=${PORT:-3000}

echo "🌐 Server will start on port: $PORT"

# Start the preview server
npm run preview

echo "✅ Application started successfully!"
