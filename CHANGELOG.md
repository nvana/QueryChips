# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-07-08

### Changed
- Rewrote the README and contributing guide for clarity and accuracy.
- Corrected the documented Node.js requirement to 18+ to match `package.json`.
- Updated the npm package description.

## [1.0.0] - 2026-06-28

Initial public release.

### Added
- Framework-agnostic filter UI component (works with React, Vue, or vanilla JS)
- Query generation for Elasticsearch, SQL, MongoDB, and GraphQL
- Advanced filtering with nested groups and AND/OR logical operators
- Keyboard navigation (arrow keys, Enter, Escape, Tab, Backspace) and ARIA/accessibility support
- Automatic field-type inference from data, with enum detection
- 12 built-in themes plus custom theming via `--querychips-*` CSS variables
- Internationalization with 16 built-in languages and custom translation support
- React (`querychips/react`) and Vue (`querychips/vue`) wrapper components
- TypeScript types exported for all public interfaces

### Build & packaging
- UMD (`dist/querychips.js`) and ESM (`dist/querychips.mjs`) bundles
- Bundled type declarations (`dist/querychips.d.ts`)
- Standalone stylesheet (`dist/styles.css`) in addition to runtime style injection
