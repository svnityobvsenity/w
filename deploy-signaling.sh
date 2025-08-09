#!/bin/bash

# Railway Deployment Script for Signaling Server
# Run this script from the root directory

echo "🚀 Deploying Signaling Server to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to signaling server directory
cd apps/signaling

# Check if Railway project is initialized
if [ ! -f "railway.json" ]; then
    echo "❌ Railway project not initialized. Please run 'railway init' first."
    exit 1
fi

# Set environment variables
echo "🔧 Setting environment variables..."
railway variables set CORS_ORIGIN=https://your-vercel-domain.vercel.app
railway variables set SIGNALING_SERVER_PORT=3001
railway variables set LOG_LEVEL=info

# Deploy
echo "🚀 Deploying to Railway..."
railway up

# Get the public URL
echo "🌐 Getting public URL..."
railway domain

echo "✅ Deployment complete!"
echo "📝 Don't forget to update your Vercel environment variables with the new signaling server URL"
echo "🔗 Update NEXT_PUBLIC_SIGNALING_SERVER_URL in your Vercel dashboard"
