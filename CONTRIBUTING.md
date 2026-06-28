# Contributing to QueryChips

Thank you for your interest in contributing to QueryChips! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/querychips.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Setup

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Setup Commands

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── __tests__/          # Test files
├── index.ts           # Main entry point
├── querychips.ts         # Core QueryChips class
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
├── styles.ts          # CSS styles
├── themes.ts          # Theme system
└── translations.ts    # Internationalization
wrappers/
├── QueryChipsReact.tsx   # React wrapper
└── QueryChipsVue.vue     # Vue wrapper
examples/              # Example implementations
```

## Making Changes

### Code Style

- Follow the existing code style and formatting
- Use TypeScript for all new code
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Follow ESLint and Prettier configurations

### TypeScript Guidelines

- Use strict TypeScript settings
- Avoid `any` types when possible
- Provide proper type definitions
- Use interfaces for object shapes
- Export types from `types.ts`

### Testing Guidelines

- Write tests for new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=querychips.test.ts
```

### Test Structure

- Unit tests for individual functions
- Integration tests for component interactions
- E2E tests for complete workflows
- Performance tests for critical paths

## Submitting Changes

### Pull Request Process

1. Ensure your code follows the style guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Update CHANGELOG.md with your changes
5. Submit a pull request with a clear description

### Commit Message Format

Use conventional commit format:

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

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No breaking changes (or documented)
- [ ] TypeScript types are correct
- [ ] Bundle size impact considered

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Run full test suite
5. Build and verify bundles
6. Create GitHub release
7. Publish to npm

### Pre-release Checklist

- [ ] All tests pass
- [ ] Documentation is up to date
- [ ] CHANGELOG.md is complete
- [ ] Bundle sizes are reasonable
- [ ] No security vulnerabilities
- [ ] Examples work correctly

## Getting Help

- Create an issue for bugs or feature requests
- Join our community discussions
- Check existing documentation
- Review existing issues and PRs

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to QueryChips! 