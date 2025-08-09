# Contributing to Fride

Thank you for your interest in contributing to Fride! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Git

### Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/fride.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running the Application
```bash
# Start both web app and signaling server
npm run dev

# Start only the web app
npm run dev:web

# Start only the signaling server
npm run dev:signaling
```

### Database Setup
```bash
# Start database services
make db-up

# Seed the database
npm run seed

# Reset database
make db-reset
```

### Testing
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Code Style

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use explicit return types for public functions
- Avoid `any` type when possible

### React Components
- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript for all component props
- Follow React best practices

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow the design system tokens
- Use CSS variables for theming
- Ensure responsive design

## Commit Guidelines

Use conventional commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat(auth): add OAuth login support
fix(voice): resolve WebRTC connection issues
docs(readme): update installation instructions
```

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Ensure all tests pass
5. Update the CHANGELOG.md if applicable
6. Submit a pull request with a clear description

## Issue Reporting

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node.js version)
- Screenshots if applicable

## Questions or Need Help?

- Check the README.md and SETUP.md files
- Review existing issues and pull requests
- Create a new issue for questions or problems

## License

By contributing to Fride, you agree that your contributions will be licensed under the MIT License.
