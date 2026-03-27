# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Saronic Compliance Dashboard — a standalone React (JSX) component that visualizes DoD/federal security and regulatory compliance posture. It tracks NIST 800-53r5, FedRAMP, NIST 800-171r3, CMMC 2.0, and DoD SRG Impact Levels.

## Architecture

Single-file React application (`saronic_compliance_dashboard.jsx`) with no build system, package manager, or external dependencies beyond React itself.

### Component Structure

- **`SaronicDashboard`** (default export) — main app, renders a five-tab interface
- **Shared UI primitives**: `Badge`, `Card`, `MetricBox`, `ProgressBar`, `TabBar`
- **Tab components**: `OverviewTab`, `ImpactLevelsTab`, `InheritanceTab`, `SPRSTab`, `GuardrailsTab`

### Styling

All styles are inline CSS-in-JS. Dark theme defined via the `COLORS` constant. Two font stacks: `mono` (JetBrains Mono) for data/labels, `sans` (DM Sans) for body text.

### Interactive State

- Tab selection via `useState`
- `SPRSTab` has toggleable control implementation status that dynamically recalculates the SPRS score

## Development Notes

- No build step, test suite, or linter is configured. The JSX file is meant to be imported into a host React application.
- `useEffect` and `useRef` are imported but currently unused.
