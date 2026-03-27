# Saronic Compliance Dashboard — Refactoring Plan (Deepened)

**Deepened on:** 2026-03-26
**Sections enhanced:** 6 major sections + 2 new cross-cutting sections
**Research agents used:** 15 (6 research, 7 review, 2 skill/flow)

## Enhancement Summary

### Key Improvements Over Original Plan
1. **Critical bug discovered:** SPRS `toggleControl` mutates a local const AND is never wired to any click handler — the simulator is completely non-functional
2. **Regulatory requirement surfaced:** CUI/ITAR banner marking is mandatory (DFARS 252.204-7012), even for mock data
3. **TypeScript justified:** Domain data has regulatory weight — literal unions for SPRS weights (1|3|5), readonly modifiers prevent the mutation class of bugs
4. **Architecture consensus:** useReducer in a custom hook, lifted to parent to survive tab switches, CSS Modules for responsive design, feature-grouped file structure
5. **SPRS scoring fully mapped:** 42 controls at -5, 14 at -3, 54 at -1; CMMC L2 conditional requires score >= 88 with only 1-point POA&Ms
6. **OSCAL reality check:** RFC-0024 mandates machine-readable packages by Sept 2026, but zero OSCAL submissions accepted in 2025; panel should be honest about readiness
7. **FedRAMP equivalency is stricter than authorization:** Zero open POA&Ms required, 3PAO validation mandatory, self-attestation prohibited

### New Considerations Discovered
- SPRS still uses Rev 2 (not Rev 3) — build for Rev 2 with Rev 3 architecture support
- SRG v1R3 (July 2025) reclassified IL5 as NSS-only, adding 170 CNSSI 1253 controls
- ITAR USML Category XX for UUVs (Sept 2025) directly applies to Saronic's vessels
- `oscal-react-library` was archived March 5, 2026 — do not depend on it
- Muted text color (#5a6a7a) fails WCAG AA contrast (3.8:1, needs 4.5:1)

### Key Tensions Resolved

| Question | Resolution | Rationale |
|---|---|---|
| TypeScript? | **Yes** | Domain data has regulatory weight; `weight: 1\|3\|5` literals, `readonly` prevents mutation bugs, low migration cost |
| Build system? | **Vite 8** | Multi-file decomposition requires a bundler; Vite 8 uses Rolldown/Oxc, zero-config CSS Modules |
| File count? | **~20-25 files** | Feature-grouped structure; not 3-4 (too flat) and not 30+ (over-fragmented) |
| State management? | **useReducer in custom hook, lifted to parent** | Atomic state transitions for SPRS, referentially stable dispatch, survives tab switches |
| CSS approach? | **CSS Modules + CSS custom properties** | Inline styles can't do media queries; CSS Modules are zero-runtime, Vite-native |
| Virtualization? | **No** (for 97-421 rows) | Only warranted at 500+ rows; React.memo rows + stable dispatch handles 97 toggles |
| Barrel exports? | **No** | Direct imports only; Atlassian saw 75% faster builds removing barrel files |

---

## Execution Order (Critical Path)

The refactoring MUST follow this sequence. Steps are ordered by dependency, not priority.

### Phase 0: Bug Fixes (Before Any Structural Changes)
1. Fix SPRS `toggleControl` — move controls into `useState`, wire `onClick` to table rows
2. Remove unused `useEffect` and `useRef` imports
3. Fix muted text contrast (#5a6a7a → #7a8a9a minimum for WCAG AA)
4. Visual screenshot baseline — capture current rendering for regression comparison

### Phase 1: Build Tooling
5. Scaffold Vite 8 + TypeScript project (`npm create vite@latest -- --template react-ts`)
6. Configure CSS Modules, path aliases (`@/`), Fontsource fonts
7. Set up ESLint 9 flat config + Prettier

### Phase 2: Foundation Extraction
8. Create `src/styles/tokens.css` — CSS custom properties from COLORS + design token scale
9. Create `src/types/compliance.ts` — domain types (before component decomposition)
10. Create `src/types/ui.ts` — component prop types

### Phase 3: Component Decomposition
11. Extract shared UI primitives to `src/components/` with CSS Modules (one at a time, verify each)
12. Extract new shared primitives: `FlowDiagram`, `DataTable`
13. Extract mock data into `src/features/<name>/data.ts` files
14. Extract tab components into `src/features/<name>/`
15. Create `src/app/SaronicDashboard.tsx` as root with lifted SPRS state

### Phase 4: New Features
16. Build SPRS interactive simulator (useReducer + useSPRSSimulator hook)
17. Add OSCAL Integration Status tab
18. Add FedRAMP Equivalency Validator tab
19. Add CUI/demo banner and marking system

### Phase 5: Responsive Design
20. Implement CSS custom property responsive tokens
21. Add responsive breakpoints to CSS Modules (mobile/tablet/desktop)
22. Add ARIA attributes to TabBar, tables, toggle controls
23. Visual regression comparison against Phase 0 screenshots

---

## Section 1: Fix Layout Regressions and Ensure Responsive Design

### Current Issues Identified
- `gridTemplateColumns: "repeat(5, 1fr)"` — at 320px, each card is ~50px wide (unusable)
- `gridTemplateColumns: "repeat(4, 1fr)"` — Impact Levels, same problem
- `gridTemplateColumns: "280px 1fr"` — SPRS sidebar consumes 87% of 320px viewport
- All horizontal flow diagrams have `flexWrap: "wrap"` but arrow characters break on wrap
- TabBar with 7 tabs will overflow on mobile
- `transition: "all 0.2s"` on tab buttons transitions font-weight (won't interpolate)

### Research Insights

**Responsive Strategy: Desktop-First Design, Mobile-First CSS**

Design the desktop experience first (compliance officers primarily work on large monitors), but implement CSS starting from mobile base and layering up with `min-width` media queries.

**Three-Tier Breakpoint System:**

| Tier | Range | Layout |
|---|---|---|
| Mobile | 320px - 767px | Single column, cards stacked, tables as cards, scrollable tab pills |
| Tablet | 768px - 1023px | 2-column grid, condensed tables with column hiding |
| Desktop | 1024px+ | Full density: 5-col metrics, 2-col cards, full tables |

**Implementation Pattern: CSS Custom Properties as Responsive Bridge**

Define responsive values in a global stylesheet, reference via `var()`:

```css
:root {
  --dash-grid-cols: 1;
  --dash-gap: 12px;
  --dash-card-padding: 12px;
}
@media (min-width: 768px) {
  :root { --dash-grid-cols: 2; --dash-gap: 16px; }
}
@media (min-width: 1024px) {
  :root { --dash-grid-cols: 4; --dash-gap: 24px; }
}
```

**Metric Card Grid — Zero-Breakpoint Reflow:**
```css
.metricGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: var(--dash-gap);
}
```

The `min(240px, 100%)` prevents overflow on 320px screens. No media queries needed for card layout.

**Responsive Data Tables — Three Progressive Strategies:**
1. **Desktop:** Full table with horizontal scroll wrapper (`role="region"`, `tabIndex={0}`, `aria-label`)
2. **Tablet:** Column priority hiding — priority 1 always visible, priority 2 hidden below 768px, priority 3 hidden below 1024px
3. **Mobile (<768px):** Transform rows into stacked cards via CSS (`display: block` on `<tr>`, `display: flex` on `<td>`)

**TabBar at 7 Tabs:**
- Desktop: horizontal flex (current pattern)
- Mobile: horizontally scrollable pill bar with momentum scrolling (`overflow-x: auto`, `-webkit-overflow-scrolling: touch`)

**Performance Considerations:**
- Use `useSyncExternalStore` for breakpoint detection (not `useState` + `useEffect` + resize listeners)
- CSS custom property changes do NOT trigger React re-renders — only browser repaints
- Memoize style objects if passing inline styles to `React.memo` children
- Never listen to `resize` events — use `matchMedia` listeners that fire only at breakpoint boundaries

**Accessibility Requirements:**
- 44px minimum touch targets on mobile (via `@media (pointer: fine)` reduce to 32px for desktop)
- `prefers-reduced-motion: reduce` — disable all animations
- Color + icon + text label for all status indicators (color alone fails WCAG)
- All tables need `<caption>` or `aria-label`, `scope="col"` on headers
- TabBar needs `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`

**Edge Cases:**
- Flow diagrams: stack vertically on mobile with downward arrows, not horizontal wrap
- CMMC timeline: horizontal scroll with visible scrollbar affordance on mobile
- CRM inline bar charts: switch to text-only percentage display below 768px

---

## Section 2: Decompose into Multi-File Codebase

### Research Insights

**Recommended Structure: Feature-Grouped with Shared Components**

```
saronic-job-dossier/
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  src/
    main.tsx
    vite-env.d.ts

    styles/
      tokens.css                      # CSS custom properties (source of truth)
      global.css                      # Reset, font imports, CUI banner styles

    types/
      compliance.ts                   # Domain types: Control, POAMItem, etc.
      ui.ts                           # Component prop types

    theme/
      tokens.ts                       # JS mirror of CSS tokens (for edge cases)

    lib/
      sprs-scoring.ts                 # Pure function: controls -> score (testable)
      alpha.ts                        # Color utility: alpha(hex, opacity)

    hooks/
      useSPRSSimulator.ts             # useReducer + scoring logic
      useBreakpoint.ts                # useSyncExternalStore breakpoint hook

    components/
      Badge.tsx + Badge.module.css
      Card.tsx + Card.module.css
      MetricBox.tsx + MetricBox.module.css
      ProgressBar.tsx + ProgressBar.module.css
      TabBar.tsx + TabBar.module.css
      FlowDiagram.tsx + FlowDiagram.module.css    # NEW: extract 5 instances
      DataTable.tsx + DataTable.module.css          # NEW: extract 3+ tables

    features/
      overview/
        OverviewTab.tsx + OverviewTab.module.css
        data.ts
      impact-levels/
        ImpactLevelsTab.tsx + ImpactLevelsTab.module.css
        data.ts
      inheritance/
        InheritanceTab.tsx + InheritanceTab.module.css
        data.ts
      sprs/
        SPRSTab.tsx + SPRSTab.module.css
        data.ts                       # All 110 Rev 2 controls with weights
      guardrails/
        GuardrailsTab.tsx + GuardrailsTab.module.css
        data.ts
      oscal/                          # NEW
        OSCALTab.tsx + OSCALTab.module.css
        data.ts
      equivalency/                    # NEW
        EquivalencyTab.tsx + EquivalencyTab.module.css
        data.ts

    app/
      SaronicDashboard.tsx + SaronicDashboard.module.css
```

**Key Principles:**
- **Direct imports only** — no barrel files (index.ts re-exports). Atlassian saw 75% faster builds removing them.
- **Feature co-location** — each tab's component, styles, and data live together. Developer working on SPRS touches 3 files in one folder.
- **Dependency direction:** `components → hooks → lib → data` (no cycles)
- **Shared components** stay flat in `components/` — 7 primitives don't need subdirectories
- **Types defined before components** — they become the shared contract across all modules

**Vite 8 Configuration:**
- Uses Rolldown (Rust bundler, 10-30x faster than Rollup)
- `@vitejs/plugin-react` v6 (Oxc-powered, no Babel)
- CSS Modules native (`*.module.css` auto-detected)
- `resolve.tsconfigPaths: true` for path aliases (no plugin needed in Vite 8)
- Fontsource variable fonts for JetBrains Mono + DM Sans (self-hosted, no GDPR issues)

**Migration Order:**
Each step is independently verifiable — dashboard should render correctly after each extraction.

---

## Section 3: Provide Realistic Mock Data

### Research Insights

**Data Architecture Principle:** Co-locate data with the feature that uses it. Use typed constant arrays, not factory functions. Static display data doesn't need variation.

**TypeScript Domain Types (Tier 1 — highest ROI):**

```typescript
// Union types with regulatory meaning
type ControlFamily = "AC" | "AT" | "AU" | "CA" | "CM" | "CP" | "IA"
  | "IR" | "MA" | "MP" | "PE" | "PL" | "PM" | "PS" | "RA" | "SA" | "SC" | "SI" | "SR";

type RiskLevel = "Low" | "Moderate" | "High" | "Critical";
type POAMStatus = "Planning" | "Scheduled" | "In Progress" | "Complete" | "Delayed";
type ImpactLevel = "IL2" | "IL4" | "IL5" | "IL6";
type BadgeColor = "accent" | "warning" | "danger" | "info" | "purple" | "muted";

interface NISTControl {
  readonly id: string;
  readonly name: string;
  readonly family: ControlFamily;
  readonly weight: 1 | 3 | 5;       // SPRS deduction values — exactly these three
  implemented: boolean;
}

interface POAMItem {
  readonly id: string;
  readonly control: string;
  readonly desc: string;
  readonly risk: RiskLevel;
  readonly due: string;
  readonly status: POAMStatus;
}
```

**SPRS Mock Data:** The current file has 12 controls. The complete Rev 2 dataset is 110 controls across 14 families. Weight distribution: 42 at -5, 14 at -3, 54 at -1. The research agent produced the full mapping — use it for the `features/sprs/data.ts` file.

**OSCAL Mock Data:** Use OSCAL 1.1.2 structures. Type only the subset consumed by the dashboard (don't model the full schema). Key fields per OSCAL model type:
- Catalog metadata (title, version, last-modified)
- SSP system-characteristics (system-name, security-sensitivity-level, authorization-boundary)
- Assessment results (findings with severity, observations, risks)
- POA&M items (with milestone tracking)

**OSCAL Readiness Honesty:** In 2025, FedRAMP processed 100+ Rev5 authorizations with zero OSCAL submissions. The mock data should show partial readiness — some document types complete, others in draft — rather than claiming full integration. This is more credible.

**FedRAMP Equivalency Mock Data:** Control counts by IL level:
- FedRAMP Moderate: ~323 controls (IL2 floor)
- FedRAMP High: ~421 controls
- IL4: ~443 controls (High + 22 FedRAMP+)
- IL5: ~600 controls (High + 21 FedRAMP+ + 178 CNSSI 1253 NSS)

**Security Considerations for Mock Data:**
- Add "DEMONSTRATION DATA ONLY" watermark on all data-displaying components
- Current mock data includes operationally realistic Saronic details (ITAR vessel specs, C2 data, sensor fusion) — an adversary could use this for reconnaissance
- For any external-facing version, replace Saronic-specific references with generic placeholders
- Mark all mock data files with a code-level comment: "FABRICATED VALUES — NOT DERIVED FROM PRODUCTION SYSTEMS"

---

## Section 4: Implement SPRS Interactive Simulator

### Current Bugs (Both Must Be Fixed)

**Bug 1 — State mutation:** `toggleControl` (line 457-464) mutates a local `const controls` array that is re-created every render. The mutation happens, `setSimScore` triggers re-render, but the fresh render discards the mutation. Score display uses locally-computed `score` (line 468), not `simScore`. `simScore` is dead state.

**Bug 2 — Never wired to UI:** `toggleControl` exists but is never bound to any click handler. The table rows have no `onClick`. Users cannot actually toggle anything.

### Research Insights

**State Architecture:**

```typescript
// lib/sprs-scoring.ts — pure function, testable without React
export function calculateSPRSScore(controls: readonly NISTControl[]) {
  const gaps = controls.filter(c => !c.implemented);
  const totalDeduction = gaps.reduce((sum, c) => sum + c.weight, 0);
  return {
    score: 110 - totalDeduction,
    totalDeduction,
    gapCount: gaps.length,
    gaps,
  };
}
```

```typescript
// hooks/useSPRSSimulator.ts — useReducer with derived score
type Action =
  | { type: 'TOGGLE_CONTROL'; id: string }
  | { type: 'RESET' }
  | { type: 'SET_SCENARIO'; controls: NISTControl[] };

function sprsReducer(state: SPRSState, action: Action): SPRSState {
  switch (action.type) {
    case 'TOGGLE_CONTROL': {
      const controls = state.controls.map(c =>
        c.id === action.id ? { ...c, implemented: !c.implemented } : c
      );
      return { ...state, controls, ...calculateSPRSScore(controls) };
    }
    case 'RESET':
      return { ...state, controls: initialControls, ...calculateSPRSScore(initialControls) };
    default:
      return state;
  }
}
```

**Why useReducer, not useState:**
1. Atomic state transitions — `controls` and `score` stay consistent
2. `dispatch` is referentially stable — critical for `React.memo` on 97+ toggle rows
3. Clean place for scoring algorithm that's testable in isolation

**Why lift state to parent (SaronicDashboard):**
Without this, switching tabs unmounts SPRSTab and remounts it — all toggles reset. The race condition reviewer identified this as a trust-destroying UX failure for a compliance tool.

**Rapid Toggle Race Prevention:**
Use the functional updater form. NEVER read `controls` from closure:
```typescript
// BAD — stale closure on rapid clicks
const toggle = (id) => {
  const updated = controls.map(...); // captures stale `controls`
  setControls(updated);
};

// GOOD — functional updater, always reads latest state
dispatch({ type: 'TOGGLE_CONTROL', id });
```

**Performance for 97 Rows:**
- Wrap each control row in `React.memo` — toggling control #47 only re-renders row #47
- Pass `dispatch` directly (stable reference) — no `useCallback` wrapper needed
- Derive score in reducer, not in render
- `useMemo` for family grouping and filtering
- NO virtualization needed — 97 rows is well under the 500-row threshold

**SPRS Scoring Rules (Critical Domain Knowledge):**
- Starting score: 110, floor: -203
- Binary scoring: MET (0 deduction) or NOT MET (full weight)
- Two exceptions: 3.5.3 (MFA) and 3.13.11 (FIPS crypto) can score at 5 or 3
- CMMC L2 conditional: only 1-point controls can have POA&Ms, minimum score 88
- Rev 2 is operative for SPRS — Rev 3 is not accepted
- Scores 95-110 are highly competitive for DoD contracts

**UI Enhancements:**
- Group-by-family accordion with family-level progress bar on each header
- "WHAT-IF SIMULATION — NOT OFFICIAL SCORE" watermark (prevents False Claims Act issues)
- CMMC L2 threshold indicator at score 88
- Score calculation methodology in a collapsible section
- Consider: batch operations ("Mark all AC controls as implemented")
- Consider: diff view ("Close these 3 gaps → score goes from 98 to 110")

**CSS Transition Fix:**
Current `transition: "width 0.8s ease"` on progress bar is too slow for interactive score changes. Use 150ms for user-driven changes, keep 0.8s for initial mount animations only.

---

## Section 5: Add OSCAL Integration Status Panel

### Research Insights

**OSCAL Context:**
- OSCAL 1.1.2 stable, three-layer nine-model architecture (JSON/XML/YAML)
- RFC-0024 makes machine-readable packages mandatory by **September 30, 2026**
- Non-compliant services revoked by September 2027
- In 2025, FedRAMP processed 100+ authorizations with zero OSCAL submissions
- AWS is the only major CSP to have submitted an OSCAL SSP
- `oscal-react-library` archived March 5, 2026 — don't depend on it

**Panel Design: Honest Readiness Dashboard**

The panel should show partial readiness rather than claiming full integration. Structure as a **CI pipeline timeline view** (vertical, not tabular) with four sections:

1. **Document Readiness** — per OSCAL model type (Catalog, Profile, SSP, SAP, SAR, POA&M, Component Definition)
   - Status: Complete / In Draft / Not Started
   - Last validated timestamp
   - Format coverage (JSON/XML/YAML)

2. **Validation Status** — most recent `oscal-cli` results
   - Schema validation pass/fail
   - FedRAMP-specific rule validation
   - Error count, warning count
   - Expandable error/warning details

3. **RFC-0024 Compliance Timeline**
   - Deadline countdown: September 30, 2026
   - Milestone tracker (FedRAMP baselines adopted, SSP converted, assessment results converted)
   - Current readiness percentage

4. **Catalog & Baseline Versions**
   - NIST 800-53r5 catalog version (5.2.0)
   - FedRAMP baselines in use (Moderate, High)
   - NIST 800-171 Rev 2 vs Rev 3 status

**Data Structure:**
```typescript
interface OSCALDocumentStatus {
  readonly modelType: 'catalog' | 'profile' | 'ssp' | 'sap' | 'sar' | 'poam' | 'component-definition';
  readonly status: 'complete' | 'in-draft' | 'not-started';
  readonly lastValidated: string | null;
  readonly format: ('json' | 'xml' | 'yaml')[];
  readonly version: string | null;
  readonly errors: number;
  readonly warnings: number;
}
```

**Security Note:** Never parse OSCAL XML on the client (XXE risk). All OSCAL parsing should occur server-side. The dashboard displays pre-parsed, sanitized JSON only.

---

## Section 6: Add FedRAMP Equivalency Validator

### Research Insights

**January 2024 DoD CIO Memo — Key Requirements:**
- 100% compliance with all FedRAMP baseline controls
- Validated by a FedRAMP-recognized 3PAO
- Zero open control-related POA&Ms (stricter than FedRAMP ATO!)
- Self-attestation explicitly prohibited
- Contractor (not CSP) bears legal liability for verification

**IL5 Gap from FedRAMP High:**
FedRAMP High: 421 controls → IL5: ~600 controls (+179 additional). The gap is driven by:
- 21 FedRAMP+ controls (tighter parameters)
- 178 CNSSI 1253 NSS overlay controls (IL5 reclassified as NSS-only in SRG v1R3, July 2025)
- Heaviest overlay families: SC (+28), SI (+18), AC (+14), SA (+12), AU (+11)

**Panel Design: Four Sub-Views**

1. **Equivalency Overview**
   - CSP cards: AWS GovCloud (FedRAMP High PA — authorized), Saronic Platform (system-specific — in progress)
   - Checklist of equivalency requirements (3PAO assessment, zero POA&Ms, BoE completeness)
   - Overall equivalency determination status

2. **Gap Analysis** (the core view)
   - Two-column comparison: FedRAMP High baseline vs. DoD IL5 requirements
   - Per-family breakdown with severity indicators
   - Gap count and remediation effort estimate
   - Heaviest gap families highlighted

3. **Body of Evidence Tracker**
   - Document status: SSP, SAP, SAR, POA&M (Complete/In Progress/Not Started)
   - DIBCAC submission timeline
   - 3PAO assessment status and findings

4. **Control Baseline Progression**
   - Visual: FedRAMP Mod (323) → FedRAMP High (421) → IL4 (443) → IL5 (600)
   - Per-family stacked bar showing CSP-inherited vs. shared vs. Saronic-owned
   - Use the existing FlowDiagram component for the progression visualization

**Equivalency Determination Logic:**
Use simplified heuristics, NOT real DoD assessment logic. A lookup table mapping FedRAMP levels to approximate DoD equivalency. Label clearly as illustrative/approximate. Real determinations require DIBCAC review (4-6 months).

**Saronic-Specific Context:**
- ITAR USML Category XX for UUVs (September 2025) directly applies
- Supply chain controls for vessel firmware (SR family) are the largest risk area
- Sensor isolation (SC family) requires CNSSI 1253 NSS-level controls
- Personnel security requirements at IL5 now match IL6 (background investigations)

**Security Note:** Equivalency determinations should eventually be server-side with audit trail. Gap analysis output is inherently sensitive — it's a prioritized list of security weaknesses. Apply CUI protections.

---

## Cross-Cutting: Design System Enhancements

### Research Insights

**Aesthetic Direction: Industrial-Utilitarian Military HUD**

Not "cool tech startup dashboard." Think submarine CIC displays, AEGIS combat system readouts.

- **Sharpen border radii:** 6px → 2px (or 0) for a harder, utilitarian feel
- **Replace emoji icons** (☁ 🛡 🏛 ⚓) with monospaced glyphs or simple SVG — emoji looks unserious in DoD context
- **Replace text arrows** (→ ⟶) with styled SVG connectors in FlowDiagram component
- **Add subtle background texture:** 1-2% opacity repeating linear gradient or SVG noise pattern
- **Fix alpha-channel pattern:** Replace fragile `${color}15` hex concatenation with a utility:
  ```typescript
  const alpha = (hex: string, opacity: number) =>
    `${hex}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  ```

**Establish Design Token Scale:**

Current code uses 10+ arbitrary font sizes and spacing values. Standardize:

```
Type scale: 9px / 10px / 11px / 13px / 16px / 22px / 32px / 48px
Spacing (4px base): 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40
Border radius: 0 / 2 / 4 (reserve 50% for dots only)
Letter spacing: 0 / 0.02em (mono data) / 0.05em (uppercase labels)
```

**Color System Fixes:**
- Normalize 8+ orphan hex colors into COLORS: `bgAlt: "#1a2030"`, `bgChrome: "#0d1117"`, `dangerLight: "#ff6b6b"`, `cmmcOrange: "#e07a5f"`
- Remove dead tokens: `bgCardHover`, `borderActive` (never used)
- Unify `color` prop semantics: Badge uses palette keys, MetricBox/ProgressBar use raw hex — pick one approach
- Bump `textMuted` from #5a6a7a to at least #7a8a9a for WCAG AA compliance at small text sizes

**High-Value Component Extractions:**
1. **FlowDiagram** — 5 instances of arrow-chain pattern (~100 duplicated lines)
2. **DataTable** — 3+ inline table implementations with nearly identical header styling
3. **Callout/InfoBox** — 2+ instances of tinted info boxes

---

## Cross-Cutting: Regulatory & Security Requirements

### CUI Banner (Mandatory — DFARS 252.204-7012)

Add a persistent, non-dismissible banner at the top of every screen:

**Production mode:**
```
CUI // SP-CTI — CONTROLLED UNCLASSIFIED INFORMATION
Distribution authorized to U.S. Government agencies and their contractors only.
```

**Demo/mock mode:**
```
DEMONSTRATION DATA ONLY — NOT DERIVED FROM PRODUCTION SYSTEMS
```

Both banners must appear in print output. Use visually distinct styling for demo mode (e.g., amber background vs. production blue).

### SPRS Simulator Fraud Prevention

The simulator must display a persistent "WHAT-IF SIMULATION — NOT OFFICIAL SCORE" watermark. Do not allow export/print from the simulator view without the watermark. SPRS score misrepresentation is a False Claims Act issue.

### ITAR Advisory

Lines referencing "Vessel design specs (ITAR)", "autonomous vessel C2 data", and "classified mission parameters" constitute potentially export-controlled technical data. Before any non-U.S. person access, implement U.S. Person verification at login and display an ITAR advisory splash screen.

### Future Authentication Requirements

When connecting to real backends:
- PIV/CAC or FIDO2 MFA via FedRAMP-authorized IdP
- HttpOnly, Secure, SameSite=Strict session cookies (never localStorage)
- 15-minute idle timeout (NIST 800-53 AC-11)
- RBAC: Read-only Auditor / Compliance Manager / System Administrator
- BFF pattern for AWS API calls (never expose credentials to browser)

### Content Security Policy

Document required CSP for host application:
```
Content-Security-Policy:
  default-src 'none';
  script-src 'self';
  style-src 'self';           # CSS Modules eliminate need for 'unsafe-inline'
  font-src 'self';
  img-src 'self' data:;
  connect-src 'self';
  frame-ancestors 'none';
  form-action 'none';
```

Note: Migrating from inline styles to CSS Modules eliminates the need for `'unsafe-inline'` in `style-src` — a significant CSP improvement.

---

## Setup Instructions

```bash
# Scaffold project
npm create vite@latest saronic-dashboard -- --template react-ts
cd saronic-dashboard

# Install dependencies
npm install react react-dom
npm install -D @vitejs/plugin-react vite typescript \
  @fontsource-variable/jetbrains-mono @fontsource-variable/dm-sans \
  eslint @eslint/js typescript-eslint eslint-plugin-react-hooks \
  eslint-config-prettier prettier vitest @testing-library/react \
  @testing-library/jest-dom jsdom

# Development
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run test     # Run Vitest
npm run lint     # ESLint check
```

---

## References

### Domain / Compliance
- [DoD CIO FedRAMP Equivalency Memo (Jan 2024)](https://dodcio.defense.gov/Portals/0/Documents/Library/FEDRAMP-EquivalencyCloudServiceProviders.pdf)
- [DoD Assessment Methodology (SPRS)](https://www.acq.osd.mil/asda/dpc/cp/cyber/docs/safeguarding/NIST-SP-800-171-Assessment-Methodology-Version-1.2.1-6.24.2020.pdf)
- [NIST OSCAL Official](https://pages.nist.gov/OSCAL/)
- [FedRAMP RFC-0024 (OSCAL mandate)](https://www.fedramp.gov/rfcs/0024/)
- [SRG v1R3: IL5 is Now NSS](https://stackarmor.com/dod-srg-il5-nss-vs-il4/)
- [170 New Controls for IL5](https://38northsecurity.com/article/170-new-controls-now-required-for-il5-cloud-providers-csp-srg-v1r3-explained/)
- [ITAR USML Category XX for UUVs](https://www.klgates.com/ITAR-Final-Rule-Revises-the-USML-and-Adds-New-License-Exemption-for-Covered-Activities-Involving-Unmanned-Underwater-Vehicles-9-10-2025)

### Technical
- [CSS Variables for React Devs — Josh Comeau](https://www.joshwcomeau.com/css/css-variables-for-react-devs/)
- [React Folder Structure in 5 Steps — Robin Wieruch](https://www.robinwieruch.de/react-folder-structure/)
- [Barrel Import Performance — Atlassian](https://www.atlassian.com/blog/atlassian-engineering/faster-builds-when-removing-barrel-files)
- [Responsive Tables — Accessibility Developer Guide](https://www.accessibility-developer-guide.com/examples/tables/responsive/)
- [Vite 8 Documentation](https://vite.dev/guide/)
- [Tailwind CSS v4](https://tailwindcss.com/docs) (reference for future consideration)
