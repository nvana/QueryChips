# Contributing to QueryChips

Thanks for your interest in contributing. This guide covers how to set up the project, make changes, and submit them.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Getting Started

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/your-username/querychips.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Common Commands

```bash
npm run dev          # Rollup watch mode
npm run build        # Build UMD + ESM bundles and the stylesheet
npm test             # Run the test suite (Jest, jsdom)
npm run test:coverage
npm run lint         # ESLint over src and wrappers
npm run type-check   # tsc --noEmit
npm run format       # Prettier
```

### Project Structure

```
src/
├── __tests__/          # Test files
├── index.ts            # Public entry point and re-exports
├── querychips.ts       # Core QueryChips class
├── dom-manager.ts      # Batched DOM updates
├── types.ts            # TypeScript type definitions
├── utils.ts            # Data filtering and query generators
├── styles.ts           # CSS injected at runtime
├── themes.ts           # Built-in themes
└── translations.ts     # Built-in translations
wrappers/
├── QueryChipsReact.tsx # React wrapper
└── QueryChipsVue.vue   # Vue wrapper
examples/               # Runnable example apps
```

## Making Changes

### Code Style

- Match the existing style; ESLint and Prettier are enforced.
- Write all new code in TypeScript and avoid `any` where a concrete type is available.
- Add new types to `src/types.ts` and export them.
- Add JSDoc comments for public APIs.

### Where things live

- DOM mutations go through `QueryChipsDOMManager` (`src/dom-manager.ts`).
- Query generators (Elasticsearch, SQL, MongoDB, GraphQL) live in `src/utils.ts`.
- Edit styling in `src/styles.ts`. `dist/styles.css` is generated from the build and should never be edited by hand.

## Testing

Tests live in `src/__tests__/` and run under Jest with a jsdom environment.

```bash
npm test                                           # Run all tests
npm run test:watch                                 # Watch mode
npm run test:coverage                              # With coverage
npm test -- --testPathPattern=querychips.test.ts   # A single file
```

Please add tests for new features and bug fixes, and cover both success and error paths.

## Submitting Changes

1. Make sure `npm run test:ci` passes (coverage, lint, and type-check).
2. Add or update tests for your change.
3. Update the documentation and `CHANGELOG.md` if the change is user-facing.
4. Open a pull request with a clear description of what changed and why.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

### Pull Request Checklist

- [ ] `npm run test:ci` passes
- [ ] Tests added or updated
- [ ] Documentation updated where relevant
- [ ] `CHANGELOG.md` updated for user-facing changes
- [ ] Breaking changes are called out

## Release Process

This project follows [Semantic Versioning](https://semver.org/):

- `MAJOR` — breaking changes
- `MINOR` — backward-compatible features
- `PATCH` — backward-compatible fixes

Releases are cut from `main`:

1. Update the version in `package.json` and `CHANGELOG.md`.
2. Confirm `npm run test:ci` and `npm run build` succeed.
3. Tag the release; the CI workflow publishes to npm on tag push.

## Getting Help

Open an issue for bugs or feature requests, and check existing issues and pull requests before starting work.
