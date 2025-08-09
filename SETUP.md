# Fride Setup Guide

## Quick Setup

### 1. Environment Setup
```bash
# Copy environment file
cp env.local.example .env.local

# Fill in your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run seed
```

### 3. Start Development
```bash
# Install dependencies
npm install

# Start both apps
npm run dev
```

## Detailed Setup

### Supabase Configuration

1. Create a new Supabase project
2. Go to Settings > API
3. Copy your project URL and anon key
4. Go to Settings > Database
5. Copy your database connection string

### Database Schema

The app includes:
- User authentication and profiles
- Text and voice channels
- Real-time messaging
- Voice communication rooms
- Support ticket system
- Role-based permissions

### Voice Communication

1. Deploy signaling server to Railway/Render
2. Update `NEXT_PUBLIC_SIGNALING_SERVER_URL` in environment
3. Test WebRTC connections

### Deployment

#### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### Signaling Server (Railway)
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

## Troubleshooting

### Common Issues

**Build Errors**
- Clear node_modules: `npm run clean`
- Reinstall: `npm install`

**Voice Not Working**
- Check signaling server URL
- Verify WebSocket connection
- Check browser console

**Database Issues**
- Verify RLS policies
- Check migration status
- Verify credentials

## Support

- Check README.md for full documentation
- Review Supabase and Next.js docs
- Create issue in repository
