# Ledgerly

Ledgerly is a premium SaaS platform for CPA firms and their clients to collaborate on tax preparation, review, and filing — from document collection through AI-assisted review to e-filing.

This repository is the frontend product foundation: design system, application shell, reusable component library, mock data layer, and navigation. No case-study features are implemented yet — every route beyond the dashboard is a placeholder that demonstrates the shell.

## Stack

- **React 19** + **TypeScript** (strict) on **Vite**
- **Tailwind CSS v4** (CSS-first `@theme` config) + **shadcn/ui** (`new-york` style, Radix primitives)
- **Framer Motion** for motion, **Lucide** for icons
- **TanStack Router** for routing, **TanStack Table** for data grids
- **Zustand** for global state, **React Hook Form** + **Zod** for forms
- **Sonner** for toasts, **React PDF Viewer** for document previews, **Recharts** for charts
- **ESLint** (flat config) + **Prettier**, no backend — everything reads from `src/mock`

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build       # typecheck + production build
npm run lint         # eslint
npm run format      # prettier --write
```

## Project structure

```
src/
  app/          # router config, App shell composition
  components/
    ui/         # shadcn/ui primitives (vendored — pulled via `npx shadcn add`)
    shared/     # reusable, feature-agnostic components (badges, cards, data grid, ...)
    layout/     # application shell (sidebar, top nav, page header, ...)
  features/     # feature-specific code (empty — foundation only)
  hooks/        # reusable hooks
  lib/          # cn(), animation variants, mock-delay helper
  mock/         # realistic mock datasets
  pages/        # route-level page components
  providers/    # theme provider
  services/     # async data-access layer over the mock data (swap for real API calls later)
  store/        # Zustand stores
  styles/       # design tokens + global CSS
  types/        # domain model
  utils/        # formatters, status/tone mappings
```

## Design system

All colors, spacing, radius, shadows, typography, and motion timing are defined as CSS custom properties in `src/styles/tokens.css`, mapped into Tailwind's theme in `src/styles/globals.css`. Components should never hardcode a color or spacing value — use the semantic tokens (`bg-surface`, `text-foreground-secondary`, `shadow-md`, etc.).

Light and dark themes are both fully defined; the theme toggle in the top nav switches between them (persisted via `next-themes`).
