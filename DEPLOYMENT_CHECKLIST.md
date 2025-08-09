# Deployment Checklist

## Pre-Deployment Setup
- [ ] Install Node.js 20.10.0 (from .nvmrc)
- [ ] Run `npm run install:all` successfully
- [ ] Verify all dependencies are installed

## Environment Variables
- [ ] Copy `env.production.template` to `.env.production`
- [ ] Fill in actual Supabase credentials
- [ ] Generate and set `NEXTAUTH_SECRET`
- [ ] Set production URLs for your domain
- [ ] Configure ICE servers for WebRTC

## Database Setup
- [ ] Run `npm run db:migrate`
- [ ] Run `npm run seed`
- [ ] Verify database schema matches migrations
- [ ] Test RLS policies

## Signaling Server Deployment (Railway)
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Deploy: `cd apps/signaling && railway up`
- [ ] Get WebSocket URL: `railway status`
- [ ] Set environment variables in Railway
- [ ] Test health endpoint: `/health`

## Frontend Deployment (Vercel)
- [ ] Connect GitHub repository to Vercel
- [ ] Set build command: `npm run build:web`
- [ ] Set output directory: `apps/web/.next`
- [ ] Add all environment variables
- [ ] Deploy and verify build success
- [ ] Update `NEXT_PUBLIC_SIGNALING_SERVER_URL` with Railway URL

## Testing
- [ ] Test authentication flow
- [ ] Test text chat functionality
- [ ] Test voice chat connection
- [ ] Test admin dashboard features
- [ ] Verify all API endpoints work
- [ ] Test on mobile devices

## Security Verification
- [ ] Confirm service role key not exposed to client
- [ ] Verify RLS policies working
- [ ] Check CORS configuration
- [ ] Validate environment variable security

## Final Steps
- [ ] Update production environment variables
- [ ] Test voice chat in production
- [ ] Verify admin dashboard functionality
- [ ] Check error monitoring
- [ ] Document any issues found

## Troubleshooting
- [ ] Check Railway logs: `railway logs`
- [ ] Check Vercel build logs
- [ ] Verify environment variables
- [ ] Test signaling server health endpoint
- [ ] Check browser console for errors
