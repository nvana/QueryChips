# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QueryChips is a framework-agnostic TypeScript library for building filter UI components. It converts user interactions into multiple query language formats (Elasticsearch, SQL, MongoDB, GraphQL). Framework wrappers exist for React (`wrappers/QueryChipsReact.tsx`) and Vue (`wrappers/QueryChipsVue.vue`).

## Commands

```bash
npm run dev          # Rollup watch mode
npm run build        # Clean + rollup (UMD + ESM bundles) + build:css
npm test             # Jest (jsdom)
npm test -- --testPathPattern=querychips.test.ts  # Single test file
npm run test:coverage
npm run test:ci      # Coverage + lint + type-check
npm run lint         # ESLint (src + wrappers)
npm run lint:fix
npm run type-check   # tsc --noEmit
npm run format       # Prettier
```

## Architecture

**Core class**: `src/querychips.ts` — the main orchestrator. Manages filter state, keyboard navigation, dropdown rendering, and delegates DOM work to `QueryChipsDOMManager`.

**Key modules**:
- `src/dom-manager.ts` — DOM abstraction with batched RAF updates. All DOM mutations go through here.
- `src/utils.ts` — Pure functions for data filtering and query generation (Elasticsearch, SQL, MongoDB, GraphQL converters).
- `src/types.ts` — All TypeScript interfaces. New types go here.
- `src/styles.ts` / `src/themes.ts` / `src/translations.ts` — Presentation: CSS injection, theming (CSS variables prefixed `--querychips-`), i18n.

**Data flow**: User interaction → `QueryChips` state update → `QueryChipsDOMManager` renders → query generators in `utils.ts` produce output.

**Filter model**: Simple filters are `Filter` objects (field/operator/value). Advanced mode uses `ConditionGroup` with nested conditions and logical operators (AND/OR). Type guard `isConditionGroup()` distinguishes them at runtime.

**Instance management**: `QueryChips.instances[]` tracks all live instances. A single global click handler manages focus/blur across instances.

## Build Output

Rollup produces `dist/querychips.js` (UMD), `dist/querychips.mjs` (ESM), and `dist/querychips.d.ts`. The `build:css` step (`scripts/build-css.js`) then writes `dist/styles.css` by `require`-ing the `STYLES` constant out of the built UMD bundle — so edit styling in `src/styles.ts`, never in `dist/styles.css` (it is regenerated on every build and depends on the rollup bundle existing first).

## Testing

Tests live in `src/__tests__/`. The jsdom setup file (`src/__tests__/setup.ts`) mocks `matchMedia`, `ResizeObserver`, and `IntersectionObserver`. Tests use arrange-act-assert with sample datasets.

## Conventions

- Conventional commits: `type(scope): description` (feat, fix, docs, style, refactor, test, chore)
- CSS classes use `querychips-` prefix with BEM-inspired naming
- Field types are auto-inferred from data; enum detection uses a threshold to distinguish from free-text strings
- Do not build the project after every change — only build when explicitly needed
