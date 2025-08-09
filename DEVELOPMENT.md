# Development Guide

This guide will help you set up and contribute to the Fride project.

## Prerequisites

- **Node.js**: Version 18.x or 20.x (check with `node --version`)
- **npm**: Version 8.x or higher (check with `npm --version`)
- **Git**: For version control
- **Supabase Account**: For database and authentication
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fride
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 3. Environment Configuration

Create your local environment file:

```bash
# Copy the example environment file
cp apps/web/env.local.example apps/web/.env.local

# Edit the file with your actual values
nano apps/web/.env.local
```

Required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Voice Signaling Server
NEXT_PUBLIC_SIGNALING_SERVER_URL=ws://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_VOICE=true
NEXT_PUBLIC_ENABLE_TICKETS=true
NEXT_PUBLIC_ENABLE_ADMIN=true
```

### 4. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys
3. Update your `.env.local` file
4. Run the database setup:

```bash
cd apps/web
npm run setup-db
```

#### Option B: Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `fride`
3. Update your `.env.local` file with local database URL
4. Run migrations:

```bash
cd apps/web
npm run db:migrate
npm run seed
```

### 5. Start Development Servers

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
│   ├── web/                 # Next.js frontend application
│   │   ├── app/            # App Router pages and API routes
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities, stores, and configurations
│   │   ├── scripts/       # Database and utility scripts
│   │   └── __tests__/     # Test files
│   └── signaling/          # WebRTC signaling server
├── packages/
│   ├── ui/                # Shared UI components
│   ├── design/            # Design tokens and CSS variables
│   ├── types/             # Shared TypeScript types
│   └── utils/             # Shared utilities
├── infra/
│   └── migrations/        # Database migrations
└── docs/                  # Documentation
```

## Development Workflow

### 1. Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### 2. Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test -- --watch
```

### 3. Building

```bash
# Build all packages
npm run build

# Build specific packages
npm run build:web
npm run build:packages
```

### 4. Database Changes

When making database changes:

1. Create a new migration file in `infra/migrations/`
2. Update the types in `packages/types/src/index.ts`
3. Test the migration locally
4. Update the seed script if needed

```bash
# Create new migration
cd infra/migrations
# Create new file: 002_your_changes.sql

# Apply migrations
npm run db:migrate

# Seed database
npm run seed
```

## Component Development

### Creating New Components

1. Create the component file in `apps/web/components/`
2. Add TypeScript interfaces in `packages/types/src/index.ts`
3. Create tests in `apps/web/__tests__/components/`
4. Update the component index if needed

### Component Guidelines

- Use TypeScript for all components
- Follow the existing naming conventions
- Use Tailwind CSS for styling
- Include proper accessibility attributes
- Write tests for all components
- Use the shared UI components when possible

## API Development

### Creating New API Routes

1. Create the route file in `apps/web/app/api/`
2. Add proper error handling
3. Include input validation
4. Write tests for the API route
5. Update documentation

### API Guidelines

- Use Next.js App Router API routes
- Include proper HTTP status codes
- Validate all inputs
- Handle errors gracefully
- Use TypeScript for request/response types
- Include rate limiting for public endpoints

## State Management

The project uses **Zustand** for state management:

- **Auth Store**: User authentication and session
- **App Store**: Application state and UI
- **Messages Store**: Chat messages and real-time updates
- **Channels Store**: Channel management
- **Voice Store**: Voice chat state
- **Tickets Store**: Support ticket management

### Adding New Stores

1. Create the store file in `apps/web/lib/`
2. Define the store interface in `packages/types/src/index.ts`
3. Implement the store logic
4. Add tests for the store

## Testing Strategy

### Test Types

- **Unit Tests**: Individual components and functions
- **Integration Tests**: API routes and database operations
- **E2E Tests**: Full user workflows (future)

### Testing Guidelines

- Use Jest and React Testing Library
- Mock external dependencies (Supabase, WebRTC)
- Test both success and error scenarios
- Maintain good test coverage
- Use descriptive test names

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- components/AuthForm.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test -- --watch
```

## Debugging

### Common Issues

1. **Environment Variables**: Ensure all required variables are set
2. **Database Connection**: Check Supabase credentials and policies
3. **TypeScript Errors**: Run `npm run build` to check for type issues
4. **Linting Errors**: Run `npm run lint` to identify code style issues

### Debug Tools

- **React DevTools**: For component debugging
- **Redux DevTools**: For state management debugging
- **Network Tab**: For API request debugging
- **Console Logs**: For general debugging

## Performance Optimization

### Frontend

- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size with dynamic imports
- Use Next.js Image component for images

### Backend

- Implement proper caching strategies
- Use database indexes for queries
- Implement rate limiting
- Monitor API response times

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Signaling Server (Railway/Render)

1. Push to Railway or Render
2. Set environment variables
3. Get the WebSocket URL and update frontend config

### Environment Variables for Production

Ensure these are set in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SIGNALING_SERVER_URL=wss://your-signaling-server.railway.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Contributing

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the coding guidelines
3. Write or update tests
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

### Code Review

All code changes require review:
- Ensure code follows project guidelines
- Verify tests are included and passing
- Check for security implications
- Validate performance impact

### Commit Messages

Use conventional commit format:

```
feat: add new authentication feature
fix: resolve voice chat connection issue
docs: update API documentation
style: format code with prettier
refactor: restructure component hierarchy
test: add tests for new component
```

## Getting Help

- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check the README and other docs
- **Community**: Join the project's community channels

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

Happy coding! 🚀
