# Railway Deployment Guide for Signaling Server

## Prerequisites
1. Install Railway CLI: `npm install -g @railway/cli`
2. Have a Railway account (free tier available)
3. Node.js 18+ installed locally

## Step 1: Login to Railway
```bash
railway login
```

## Step 2: Initialize Railway Project
```bash
cd apps/signaling
railway init
```

## Step 3: Set Environment Variables
```bash
railway variables set CORS_ORIGIN=https://your-vercel-domain.vercel.app
railway variables set SIGNALING_SERVER_PORT=3001
railway variables set LOG_LEVEL=info
```

## Step 4: Deploy to Railway
```bash
railway up
```

## Step 5: Get Public URL
```bash
railway domain
```

## Step 6: Update Environment Variables
After deployment, copy the Railway domain and update your Vercel environment:

```bash
# In your Vercel dashboard or .env.production:
NEXT_PUBLIC_SIGNALING_SERVER_URL=wss://your-signaling-server.railway.app
```

## Alternative: Deploy via Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Create new project
3. Connect your GitHub repository
4. Select the `apps/signaling` directory
5. Set environment variables in the dashboard
6. Deploy

## Health Check
Test your deployed signaling server:
```bash
curl https://your-signaling-server.railway.app/health
```

## Monitoring
- Railway provides built-in monitoring and logs
- Check connection status in Railway dashboard
- Monitor WebSocket connections and room usage

## Troubleshooting
- Ensure CORS_ORIGIN matches your Vercel domain exactly
- Check Railway logs for connection issues
- Verify WebSocket connections are using `wss://` protocol
