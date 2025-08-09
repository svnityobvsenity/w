# Fride - Discord-like Chat App

A single-server Discord-like app with real-time text, voice, and admin dashboard. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Secure Authentication**: Email + password registration and sign-in
- 💬 **Real-time Text Chat**: Multi-channel text communication with typing indicators
- 🎤 **Voice Channels**: WebRTC-based voice communication with peer-to-peer connections
- 🎫 **Ticket System**: Support ticket management for staff and users
- 👑 **Admin Dashboard**: Role management, staff info, and server statistics
- 🌙 **Dark Mode UI**: Beautiful Discord-inspired dark theme
- 📱 **PWA Support**: Desktop-first with responsive mobile design
- 🔒 **Row Level Security**: Secure data access with Supabase RLS policies

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Voice**: WebRTC with custom signaling server
- **State Management**: Zustand
- **Deployment**: Vercel (Frontend), Railway/Render (Signaling)

## Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Supabase account
- Railway or Render account (for signaling server)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd fride
npm ci
```

### 2. Environment Setup

```bash
# Copy the web app environment file
cp apps/web/env.local.example apps/web/.env.local

# Edit with your actual values
nano apps/web/.env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Signaling Server (WebRTC)
NEXT_PUBLIC_SIGNALING_SERVER_URL=wss://your-signaling-server.railway.app
SIGNALING_SERVER_PORT=3001
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database setup script:

```bash
cd apps/web
npm run setup-db
```

This will:
- Create initial channels (general, announcements, tickets, voice)
- Set up admin user (admin@fride.com / admin123456)
- Create user roles and permissions

Alternatively, you can run migrations manually:

```bash
npm run db:migrate
npm run seed
```

This creates:
- Admin user: `admin@fride.com` / `admin123456`
- Sample channels (general, announcements, tickets)
- Sample roles and permissions

### 4. Start Development

```bash
# Start both web app and signaling server
npm run dev

# Or start individually:
npm run dev:web        # Next.js app on :3000
npm run dev:signaling  # Signaling server on :3001
```

## Project Structure

```
fride/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities and configs
│   │   ├── app/            # App Router pages
│   │   └── public/         # Static assets
│   └── signaling/          # WebRTC signaling server
├── packages/
│   ├── ui/                 # Shared UI components
│   └── utils/              # Shared utilities and types
├── infra/
│   └── migrations/         # Database migrations
└── .github/
    └── workflows/          # CI/CD workflows
```

## Database Schema

### Core Tables

- **users**: User profiles with roles and online status
- **channels**: Text and voice channels
- **messages**: Chat messages with attachments
- **voice_rooms**: Active voice channel participants
- **tickets**: Support ticket system
- **roles**: User roles and permissions

### Security Features

- Row Level Security (RLS) enabled on all tables
- User authentication via Supabase Auth
- Role-based access control
- Secure API endpoints

## Voice Communication

### WebRTC Signaling Server

The signaling server handles WebRTC connection establishment:

- **Join Room**: Connect to voice channels
- **Offer/Answer**: Exchange connection offers
- **ICE Candidates**: Network traversal information
- **User Presence**: Track who's in each channel

### Deployment

Deploy to Railway (recommended) or Render:

```bash
# Railway
railway login
railway init
railway up

# Render
# Use the Dockerfile in apps/signaling/
```

## Admin Dashboard

Access admin features with admin role:

- **User Management**: View and manage user accounts
- **Role Management**: Create and assign user roles
- **Channel Management**: Create and configure channels
- **Ticket System**: Handle support requests
- **Server Statistics**: Monitor activity and usage

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Signaling Server (Railway/Render)

1. Push to Railway or Render
2. Set environment variables
3. Get the WebSocket URL and update frontend config

### Environment Variables

#### Vercel
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SIGNALING_SERVER_URL`

#### Railway/Render
- `SIGNALING_SERVER_PORT`

## Development

### Available Scripts

```bash
npm run dev          # Start both apps
npm run dev:web      # Start Next.js app
npm run dev:signaling # Start signaling server
npm run build        # Build all packages
npm run lint         # Run ESLint
npm run test         # Run tests
npm run format       # Format code with Prettier
npm run setup-db     # Set up database with initial data
```

For detailed development information, see [DEVELOPMENT.md](./DEVELOPMENT.md).

### Adding New Features

1. **Components**: Add to `apps/web/components/`
2. **Types**: Update `packages/utils/types.ts`
3. **Database**: Create migrations in `infra/migrations/`
4. **API**: Add endpoints in `apps/web/app/api/`

## Testing

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test:unit
npm run test:integration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

**Voice not working?**
- Check signaling server is running
- Verify WebSocket URL in environment
- Check browser console for errors

**Database connection issues?**
- Verify Supabase credentials
- Check RLS policies
- Ensure migrations are applied

**Build failures?**
- Clear node_modules and reinstall
- Check Node.js version (18.x or 20.x)
- Verify TypeScript compilation

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Supabase and Next.js documentation

---

Built with ❤️ using modern web technologies
