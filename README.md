# Ledgerly

Ledgerly is a premium tax-collaboration platform for CPA firms and their clients — bringing document collection, AI-assisted review, and return preparation into one connected workspace.

## Overview

Tax preparation today is split across email threads, shared drives, and disconnected portals — clients don't know what's happening with their return, and preparers spend as much time chasing documents as reviewing them. Ledgerly puts the whole engagement in one place: clients see exactly where their return stands and what's needed from them, while preparers and reviewers get a fast, trustworthy way to work through hundreds of fields, documents, and AI findings without losing track of context.

## Key Experiences

- **Source document traceability** — every value on a return traces back to the source document it came from, with confidence scoring, validation results, and a full review history.
- **Client and CPA collaboration** — threaded conversations, document requests, and internal notes tied directly to the return they're about.
- **Guided client onboarding** — a step-by-step first-time experience that turns a blank return into a completed intake without overwhelming the client.
- **Context-aware navigation** — breadcrumbs, a persistent context bar, and deep links that keep client, return, and document context intact as you move through the app.
- **Role-aware experiences** — clients, business owners, preparers, reviewers, administrators, and seasonal staff each see a workspace scoped to what they need and are permitted to do.
- **Return status and progress** — a single lifecycle model drives the status a client sees and the stage a preparer works from, so the two views never drift apart.
- **Actionable CPA dashboard** — a prioritized work queue instead of a static report, ranking what actually needs attention today.
- **Clear interaction affordances** — a consistent visual language for what's clickable, editable, AI-generated, verified, locked, or awaiting approval.
- **Complex return navigation** — hundreds of fields, documents, and issues made navigable through search, filtering, grouping, and progressive disclosure rather than one long list.
- **Trustworthy AI review** — every AI finding comes with evidence, a plain-language explanation, a confidence breakdown, and a clear human-in-the-loop path to accept, correct, or dismiss it.

## Product Highlights

- **AI transparency** — Ledgerly never asks a user to simply trust an AI-generated number. Every finding shows what the AI found, why, how confident it is, and what evidence supports it.
- **Human-in-the-loop review** — AI can suggest and flag, but consequential changes always require an explicit human decision, recorded in the review history.
- **Source traceability** — extracted values stay connected to the document, page, and field they were read from, so a reviewer can always verify the source.
- **Role-aware workflows** — the same return looks different to a client, a preparer, and a reviewer, each seeing the right level of detail for their role.
- **Contextual navigation** — moving between a finding, a field, a document, and a task preserves the surrounding context instead of dropping the user into an unrelated screen.
- **Progressive disclosure** — summaries lead, detail follows on demand — nothing forces a user to absorb more information than the moment calls for.
- **Actionable work queues** — dashboards surface ranked, specific next actions instead of raw activity feeds.

## Technology

- **React 19** + **TypeScript** (strict) on **Vite**
- **TanStack Router** for routing, **TanStack Table** for data grids
- **Tailwind CSS v4** (CSS-first `@theme` design tokens) + **shadcn/ui** (Radix UI primitives)
- **Zustand** for state management
- **React Hook Form** + **Zod** for forms and validation
- **Framer Motion** for animation, **Lucide** for icons
- **Recharts** for charts, **React PDF Viewer** for document previews, **Sonner** for toasts
- **ESLint** (flat config) + **Prettier** for linting and formatting
- No backend — the app reads from a realistic, deterministic mock data layer

## Project Structure

```
src/
  app/          # Router configuration and app composition
  components/
    ui/         # shadcn/ui primitives
    shared/     # Reusable, feature-agnostic components (badges, cards, data grid, timeline, ...)
    layout/     # Application shell (sidebar, top nav, breadcrumbs, context bar, ...)
  features/     # Feature-specific modules (return review, dashboard, AI review, collaboration, ...)
  hooks/        # Reusable hooks (role/permissions, debouncing, keyboard shortcuts, ...)
  lib/          # Cross-cutting logic (navigation helpers, animation variants, permissions, ...)
  mock/         # Deterministic mock data for clients, returns, documents, tasks, and AI findings
  pages/        # Route-level page components
  providers/    # App-level providers (theme)
  services/     # Async data-access layer over the mock data
  store/        # Zustand stores (navigation, workspace, traceability, AI review, ...)
  styles/       # Design tokens and global CSS
  types/        # Domain model
  utils/        # Formatters and status/tone mappings
```

## Getting Started

Ledgerly uses npm (see `package-lock.json`).

```bash
npm install
npm run dev
```

The app runs entirely on local mock data — no environment variables or backend setup required.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and produce a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with automatic fixes |
| `npm run typecheck` | Run the TypeScript compiler in check-only mode |
| `npm run format` | Format the codebase with Prettier |
| `npm run format:check` | Check formatting without writing changes |

## Product Architecture

**Frontend architecture.** Ledgerly is a client-rendered React application with no backend — every route reads from a deterministic mock data layer under `src/mock`, accessed through a thin service layer (`src/services`) so the data-access pattern would carry over cleanly to a real API.

**Routing.** TanStack Router drives navigation, with routes composed around a persistent application shell (sidebar, top nav, breadcrumbs, and a context bar that always shows the active client, return, and document).

**State management.** Zustand stores hold UI and session state: navigation history and context, the active workspace/role, in-progress traceability review, and AI review decisions. Server-shaped data lives in the mock layer rather than in global state.

**Mock data.** Clients, returns, documents, tasks, and AI findings are modeled as realistic, interconnected records — including a large generated dataset layered onto a flagship return so the interface can be evaluated at real professional scale, not just with a handful of curated rows.

**Reusable design system.** Typography, color, spacing, radius, and motion are defined as design tokens and consumed through a shared component library — status badges, confidence indicators, timelines, empty states, and a full field-affordance system (editable, read-only, clickable, AI-generated, verified, locked, needs-approval) used consistently across every feature.

**Feature organization.** Feature-specific UI lives under `src/features/*`, composed into full pages under `src/pages`. Shared primitives are never duplicated per feature — new experiences build on the existing design system and navigation model rather than introducing parallel patterns.

## Design Principles

- **Clarity** — every screen should make it obvious what the user is looking at, what changed, and what happens next.
- **Trust** — nothing claims more certainty than it has; AI output is always shown with its evidence and confidence, never as an unqualified fact.
- **Progressive disclosure** — start with a summary, let the user drill into detail on their own terms.
- **AI transparency** — AI is a visible, reviewable assistant, not a black box authority.
- **Role-aware UX** — access and detail are shaped by who's looking, not hidden behind a single generic view.
- **Context preservation** — navigating deeper into a return, document, or finding never costs the user their place.

## Future Development

Planned areas of continued investment include firm-wide analytics and reporting, workspace and billing settings, real document upload and e-signature flows, and expanded automation around the AI review workflow.
