# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MilTech FedRAMP Compliance Dashboard — a React TypeScript dashboard visualizing DoD/federal security and regulatory compliance posture. Tracks NIST 800-53r5, FedRAMP, NIST 800-171r3, CMMC 2.0, DoD SRG Impact Levels, OSCAL integration, and FedRAMP equivalency.

## Commands

```bash
npm run dev      # Start Vite dev server on port 3000
npm run build    # TypeScript check + Vite production build
npm run preview  # Preview production build locally
```

## Architecture

Vite 8 + React 19 + TypeScript. CSS Modules for styling with CSS custom properties for theming/responsive tokens.

### Directory Structure

- `src/types/` — Domain types (`compliance.ts`) and component prop types (`ui.ts`)
- `src/theme/tokens.ts` — JS mirror of CSS custom properties (source of truth is `src/styles/tokens.css`)
- `src/lib/` — Pure functions: `sprs-scoring.ts` (SPRS calculation), `alpha.ts` (hex color utility)
- `src/hooks/useSPRSSimulator.ts` — useReducer-based SPRS simulator state management
- `src/components/` — Shared UI primitives: Badge, Card, MetricBox, ProgressBar, TabBar, FlowDiagram
- `src/features/` — Feature-grouped tabs, each with component `.tsx`, styles `.module.css`, and `data.ts`
- `src/app/MilTechDashboard.tsx` — Root shell: header, CUI banner, tab navigation, content routing

### Key Patterns

- **No barrel files** — all imports are direct (`@/components/Badge`, not `@/components`)
- **Feature co-location** — each tab's component, styles, and data live in one folder
- **SPRS state lifted to root** — survives tab switches via `useSPRSSimulator` hook in `MilTechDashboard`
- **FlowDiagram** is generic — reused across 5+ locations for arrow-chain architecture diagrams
- **Score is derived, never stored** — `calculateSPRSScore()` is a pure function in `lib/`

### Tabs (7)

Overview, Impact Levels, Inheritance, SPRS/CMMC (interactive simulator), Guardrails, OSCAL Integration, FedRAMP Equivalency

### Responsive Breakpoints

- Mobile: < 768px (single column, scrollable tab bar)
- Tablet: 768-1023px (2-column grids)
- Desktop: 1024px+ (full density)

Defined as CSS custom properties in `src/styles/tokens.css`.

## Domain Context

- SPRS scoring uses NIST 800-171 **Rev 2** (not Rev 3) — 110-point scale with weights of 1, 3, or 5
- OSCAL panel is honest about partial readiness (RFC-0024 deadline: Sept 30, 2026)
- FedRAMP equivalency references the Jan 2024 DoD CIO memo — stricter than FedRAMP authorization
- All displayed data is mock/demonstration — marked with a persistent demo banner
