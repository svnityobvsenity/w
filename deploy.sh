#!/bin/bash

echo "🚀 Deploying Fride Chat App..."

# Build all packages
echo "📦 Building packages..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Vercel (if configured)
if [ -n "$VERCEL_TOKEN" ]; then
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod --token $VERCEL_TOKEN
else
    echo "⚠️  VERCEL_TOKEN not set. Skipping Vercel deployment."
fi

# Deploy signaling server (if configured)
if [ -n "$RAILWAY_TOKEN" ]; then
    echo "🚂 Deploying signaling server to Railway..."
    npx @railway/cli login --token $RAILWAY_TOKEN
    npx @railway/cli up --service signaling
elif [ -n "$RENDER_TOKEN" ]; then
    echo "🎨 Deploying signaling server to Render..."
    # Add Render deployment logic here
else
    echo "⚠️  No deployment tokens found. Please set RAILWAY_TOKEN or RENDER_TOKEN."
fi

echo "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Update your environment variables in Vercel"
echo "2. Update your signaling server URL in the frontend"
echo "3. Test the application"
