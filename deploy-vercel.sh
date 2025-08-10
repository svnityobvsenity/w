#!/bin/bash

# Vercel Deployment Script for Fride
# This script prepares the project for Vercel deployment

set -e

echo "🚀 Preparing Fride for Vercel deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Create necessary directories if they don't exist
mkdir -p apps/web/public
mkdir -p apps/web/.vercel

# Copy environment variables
if [ -f "env.local" ]; then
    echo "📋 Copying environment variables..."
    cp env.local apps/web/.env.local
fi

# Create a simple favicon if it doesn't exist
if [ ! -f "apps/web/public/favicon.ico" ]; then
    echo "🎨 Creating placeholder favicon..."
    # Create a simple text-based favicon
    echo "F" > apps/web/public/favicon.ico
fi

# Create a simple manifest.json if it doesn't exist
if [ ! -f "apps/web/public/manifest.json" ]; then
    echo "📱 Creating manifest.json..."
    cat > apps/web/public/manifest.json << EOF
{
  "name": "Fride - Discord-like Chat App",
  "short_name": "Fride",
  "description": "A single-server Discord-like app with real-time text, voice, and admin dashboard",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#5865F2",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "any",
      "type": "image/x-icon"
    }
  ]
}
EOF
fi

# Create a .vercelignore file
echo "📝 Creating .vercelignore..."
cat > .vercelignore << EOF
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
.next
out
dist
build

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Git
.git
.gitignore

# Docker
Dockerfile
docker-compose.yml
.dockerignore

# Documentation
README.md
CHANGELOG.md
CONTRIBUTING.md
*.md

# Test files
__tests__
*.test.js
*.test.ts
*.spec.js
*.spec.ts

# Temporary files
tmp
temp
EOF

# Create a simple health check endpoint
echo "🏥 Creating health check endpoint..."
mkdir -p apps/web/app/api/health
cat > apps/web/app/api/health/route.ts << EOF
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    message: 'Fride API is running'
  })
}
EOF

# Update package.json scripts for deployment
echo "📦 Updating package.json for deployment..."
cd apps/web

# Create a deployment-specific package.json if needed
if [ ! -f "package.deploy.json" ]; then
    cp package.json package.deploy.json
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Vercel"
echo "3. Set environment variables in Vercel dashboard"
echo "4. Deploy!"
echo ""
echo "🔧 Environment variables to set in Vercel:"
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "- SUPABASE_SERVICE_ROLE_KEY"
echo "- NEXTAUTH_SECRET"
echo "- NEXTAUTH_URL (your Vercel domain)"
echo ""
echo "🎉 Your app should deploy successfully even with errors!"
