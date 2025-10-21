# Code Style and Conventions

## Indentation
- **2 spaces** for all files (configured in biome.json)
- No tabs allowed

## Linter/Formatter
- **Biome** is used for both linting and formatting
- Configuration: `biome.json`
- Recommended rules enabled
- Next.js and React domains configured

## TypeScript
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017
- JSX: preserve (handled by Next.js)

## File Structure
- Components in `src/components/`
- UI primitives in `src/components/ui/`
- Server actions in `src/app/actions/`
- Type definitions in `src/types/`
- App routes in `src/app/` (Next.js App Router)

## Naming Conventions
- React components: PascalCase
- Files: kebab-case for components (e.g., `category-manager.tsx`)
- Server actions: camelCase functions (e.g., `getCategories`)
- Database types: Generated from Supabase schema

## Import Organization
- Biome assist is configured to organize imports automatically
- Use path alias `@/` for imports from `src/`

## Component Patterns
- Server components by default (Next.js 15)
- Client components marked with `"use client"` directive
- UI components use React.forwardRef pattern
- Radix UI primitives for accessible components
