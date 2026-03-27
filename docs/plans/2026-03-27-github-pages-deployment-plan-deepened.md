# GitHub Pages Deployment Plan — Deepened

**Created:** 2026-03-27
**Deepened on:** 2026-03-27
**Research agents used:** 8 (GitHub Pages/Vite deployment, OSS README best practices, GitHub Actions CI/CD patterns, security sentinel, deployment verification, architecture strategist, code simplicity reviewer, skills/agents discovery)
**Status:** Ready for implementation

---

## Enhancement Summary

### Key Improvements
1. **Single-job workflow** — architecture and simplicity reviews agreed: split jobs add complexity with zero benefit for a solo-developer demo project
2. **Base path via CLI flag** — `npm run build -- --base=/saronic-job-dossier/` keeps `vite.config.ts` clean; no env var coupling
3. **Branch rename `masta` → `main`** — zero cost now (3 commits, no remote); avoids friction with GitHub defaults and workflow templates
4. **No 404.html SPA hack needed** — project uses React state for tab navigation, not URL routing; no deep links exist
5. **Minimal README** — lead with live demo link, screenshot, and three commands; avoid badge bloat and essay-length domain context

### New Considerations Discovered
- `lint` and `test` scripts in `package.json` are non-functional (no eslint or vitest in devDependencies) — these should be removed or the dependencies added before portfolio review
- `dist/` directory exists in the working tree from a prior local build — should be cleaned before first push
- CSP meta tag recommended by security review — adds credibility for a compliance-themed project
- `saronic_compliance_dashboard.jsx` (39KB legacy single-file version) should be excluded or removed before going public

---

## Phase 0: Pre-Flight Preparation

### 0.1 Rename branch `masta` → `main`

**Why:** GitHub Actions templates, `actions/checkout`, and most tooling default to `main`. Using a non-standard name means explicitly specifying `branches: [masta]` everywhere and creates friction for portfolio reviewers in DoD-adjacent space.

**Cost:** Zero — 3 commits, no remote, no open PRs, no CI references.

```bash
git branch -m masta main
```

### 0.2 Clean up working tree

```bash
# Remove build artifacts (already in .gitignore but may be cached)
rm -rf dist

# Consider removing legacy single-file version
# This 39KB JSX file predates the TypeScript refactor
rm saronic_compliance_dashboard.jsx
```

### 0.3 Remove non-functional scripts from package.json

**Research insight:** Dead scripts (`lint`, `test`) in a portfolio project suggest incomplete work to reviewers. Either add the dependencies or remove the scripts.

**Recommendation:** Remove both for now. Add them back when ESLint and Vitest are actually configured.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

### 0.4 Strengthen .gitignore

**Security insight:** Explicitly block `.env` files to prevent accidental credential commits if environment variables are added later.

Add to `.gitignore`:
```
.env
.env.*
!.env.example
```

---

## Phase 1: README.md & LICENSE

### 1.1 Create LICENSE file (MIT)

Create `LICENSE` at project root with standard MIT text, copyright `2026 Gibran Iqbal`.

**Research insight:** No license = legally ambiguous = nobody will fork or contribute. MIT is the path of least friction.

### 1.2 Create README.md

**Research findings on what makes OSS-quality vs amateur:**

| OSS-Quality | Amateur |
|---|---|
| Opens with screenshot | No visual for a visual project |
| Live demo link | No way to see it running |
| Copy-pasteable install that works first try | Vague or broken instructions |
| Honest about scope (demo/mock data) | Pretends to be production |
| Appropriate length | Walls of text or boilerplate |
| License file present | Missing license |

**Recommended structure** (cognitive funneling — broad to specific):

```markdown
# Saronic Compliance Dashboard

[One-sentence description]

[Badges: License, TypeScript, React, Vite, Live Demo link]

[Hero screenshot — full-width, ~1200px, showing Overview tab]

## About

[2-3 paragraphs: what it does, who it's for, why it exists]
[Mock data disclaimer]

## Features

[Bulleted list of 7 tabs with brief descriptions]

## Built With

[Tech stack with rationale — signals intentionality]
- React 19 — hooks-based state management
- TypeScript 6 — full type safety across domain and UI types
- Vite 8 — fast build with HMR
- CSS Modules — scoped styling with custom properties for theming
- No external UI library — all components built from scratch

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+

### Installation
[Numbered, copy-pasteable steps: clone, install, dev]

### Build for Production
[npm run build + npm run preview]

## Project Structure
[Directory tree showing architecture]

## License
Distributed under the MIT License. See LICENSE for full text.
```

**What to skip** (per simplicity review):
- No badges for services not configured (no fake build-passing badges)
- No CONTRIBUTING.md (solo project, inline note is sufficient)
- No CODE_OF_CONDUCT or SECURITY.md (over-engineered for a demo)
- No domain context essay — the dashboard speaks for itself; define acronyms inline
- No `<details>` screenshot galleries initially — one hero screenshot is enough

**Screenshot:** Take a screenshot of the running dashboard (Overview tab) and save to `docs/screenshots/overview.png`. Use relative path in README.

**Badge examples:**
```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit-green?logo=github)](https://Jibbscript.github.io/saronic-job-dossier/)
```

---

## Phase 2: Create Remote Repository

### 2.1 Create GitHub repo via `gh` CLI

```bash
gh repo create saronic-job-dossier \
  --public \
  --source=. \
  --remote=origin \
  --description="Saronic Compliance Dashboard — DoD/federal security compliance posture visualization"
```

**This does NOT push yet.** We need the workflow file committed first.

### 2.2 Set repository topics for discoverability

```bash
gh repo edit saronic-job-dossier \
  --add-topic "react,typescript,compliance,fedramp,nist,cmmc,dashboard,vite"
```

---

## Phase 3: GitHub Actions Workflow

### 3.1 Design Decisions (Research-Informed)

| Decision | Choice | Rationale |
|---|---|---|
| Single vs split workflow | **Single** | Solo dev, no tests, one target. Split adds coordination complexity with no benefit. |
| SHA-pinned actions | **No** — use version tags | SHA pinning is for production infrastructure. Demo project. Maintenance cost of updating hashes not justified. |
| Concurrency groups | **Yes** | Two lines of YAML, prevents overlapping deployments. Zero cost, real protection. |
| Split build/deploy jobs | **No** — single job | Eliminates artifact upload/download overhead, less YAML, faster runs. |
| npm caching | **Yes** — via `setup-node` `cache: 'npm'` | One line, built-in. No separate caching step needed. |
| Separate typecheck step | **No** | `npm run build` already runs `tsc -b` then `vite build`. Type errors fail the build. |
| 404.html SPA routing | **No** | No URL routing exists. Tab navigation is `useState`-based. No deep links. |
| `.nvmrc` file | **No** | Solo developer. Hardcode `node-version: '22'` in workflow. |
| Environment protection | **No** | Solo developer. No one to protect against. |
| Dependabot | **No** (initially) | Demo project. Manual `npm update` when revisiting. Avoids PR noise. |
| `workflow_dispatch` trigger | **Yes** | Allows manual re-deploy from GitHub UI without pushing a commit. |

### 3.2 Base Path Strategy

**Architecture review recommendation:** Pass `base` via Vite CLI flag, not environment variable.

```yaml
- run: npm run build -- --base=/saronic-job-dossier/
```

**Why this is better than modifying `vite.config.ts`:**
- Local `npm run dev` works at `/` (no base path needed)
- Local `npm run build` + `npm run preview` works at `/`
- Only CI sets the subpath, which is the only context where it matters
- Zero changes to existing source code

**Gotcha:** If a custom domain is added later, change the CLI flag to `--base=/` or remove it entirely.

### 3.3 The Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci

      - run: npm run build -- --base=/saronic-job-dossier/

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - uses: actions/deploy-pages@v4
        id: deployment
```

**Key design choices:**
- **`concurrency.cancel-in-progress: false`** — for deploys, let the last-started job complete rather than canceling mid-deploy
- **`npm ci`** — deterministic installs from lockfile, faster than `npm install`, fails if lockfile is out of sync
- **Node 22 LTS** — stable in GitHub Actions runners; local machine runs Node 24 but Vite/esbuild bundling is version-tolerant
- **`actions/configure-pages@v5`** — enables Pages and gathers site metadata for downstream actions
- **No `workflow_dispatch` inputs needed** — the only deploy target is the current branch head

### 3.4 Security Considerations

**From security sentinel review — applicable hardening for a demo project:**

1. **CSP meta tag in `index.html`** (recommended):
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none';" />
```
- `connect-src 'none'` — no API calls exist (confirmed: zero `fetch()` or `XMLHttpRequest` usage)
- `'unsafe-inline'` on `style-src` — required by Vite's CSS modules injection
- Adds credibility for a compliance-themed project

2. **No secrets present** — confirmed clean scan. No `.env` files, no hardcoded tokens, no `VITE_` prefixed vars.

3. **Repository settings after creation:**
   - Settings > Actions > General > "Read repository contents and packages permissions" (restrictive default)
   - Settings > Pages > Source > "GitHub Actions"

---

## Phase 4: Push & Deploy

### 4.1 Commit all changes

```bash
git add LICENSE README.md .github/workflows/deploy.yml .gitignore
# Also stage any cleanup: removed scripts, removed legacy file, etc.
git commit -m "add README, LICENSE, and GitHub Pages deployment workflow"
```

### 4.2 Push to GitHub

```bash
git push -u origin main
```

### 4.3 Enable GitHub Pages

```bash
# Enable Pages with GitHub Actions as the build source
gh api repos/Jibbscript/saronic-job-dossier/pages -X POST \
  -f build_type=workflow \
  -f source.branch=main \
  -f source.path=/
```

Or: Settings > Pages > Source > "GitHub Actions"

### 4.4 Monitor deployment

```bash
# Watch the workflow run
gh run list --limit 1
gh run watch

# Check for specific failures
gh run view --log-failed
```

---

## Phase 5: Verification

### 5.1 Pre-Deployment Checklist

```
[ ] npm run build exits 0 locally
[ ] No hardcoded absolute asset paths in source
[ ] .github/workflows/deploy.yml exists and triggers on main
[ ] package-lock.json is committed
[ ] .gitignore excludes node_modules, dist, .DS_Store, .env*
[ ] No secrets or .env files in the repo
[ ] gh auth status shows workflow scope
[ ] Legacy files cleaned up (saronic_compliance_dashboard.jsx)
```

### 5.2 Post-Deployment Verification

**Automated checks:**
```bash
# Site returns 200
curl -sI https://Jibbscript.github.io/saronic-job-dossier/ | head -5

# JS bundle loads (not 404)
JS_PATH=$(curl -s https://Jibbscript.github.io/saronic-job-dossier/ | grep -oP 'src="[^"]*\.js"' | head -1 | tr -d '"' | sed 's/src=//')
curl -sI "https://Jibbscript.github.io${JS_PATH}" | head -5

# CSS loads
CSS_PATH=$(curl -s https://Jibbscript.github.io/saronic-job-dossier/ | grep -oP 'href="[^"]*\.css"' | head -1 | tr -d '"' | sed 's/href=//')
curl -sI "https://Jibbscript.github.io${CSS_PATH}" | head -5
```

**Visual verification in browser:**
- [ ] Page renders (not blank white page)
- [ ] CUI demo banner visible at top
- [ ] "SARONIC // COMPLIANCE" header renders
- [ ] All 7 tabs navigable and render content
- [ ] SPRS simulator sliders function
- [ ] Fonts load (DM Sans body, JetBrains Mono monospace)
- [ ] No console errors in browser DevTools
- [ ] Responsive: resize to mobile (<768px), verify single-column layout

### 5.3 Common Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| Blank white page | `base` path wrong — assets 404 | Verify `--base=/saronic-job-dossier/` in workflow build step |
| Deploy job 403 | Pages source set to "Deploy from branch" | Change to "GitHub Actions" in Settings > Pages |
| `npm ci` fails | Missing `package-lock.json` | Run `npm install` locally, commit lockfile |
| Assets load but fonts missing | Font files not in build output | Check that `@fontsource-variable` imports are in `main.tsx` |
| Site shows 404 for a few minutes | GitHub Pages propagation delay | Wait 2-5 minutes after deploy job completes |

### 5.4 Rollback Procedures

**Build fails in CI:**
```bash
gh run view --log-failed    # diagnose
# Fix locally, commit, push again
```

**Site deployed but broken:**
```bash
# Revert the problematic commit
git revert HEAD
git push
# GitHub Actions will redeploy the reverted state
```

**Take site down entirely:**
```bash
gh api repos/Jibbscript/saronic-job-dossier/pages -X DELETE
```

---

## Execution Order Summary

```
Phase 0: Prep
  0.1  git branch -m masta main
  0.2  rm -rf dist; rm saronic_compliance_dashboard.jsx
  0.3  Remove lint/test scripts from package.json
  0.4  Add .env patterns to .gitignore

Phase 1: Docs
  1.1  Create LICENSE (MIT)
  1.2  Create README.md (screenshot, demo link, install steps)

Phase 2: Remote
  2.1  gh repo create saronic-job-dossier --public --source=. --remote=origin
  2.2  Set topics

Phase 3: CI/CD
  3.1  Create .github/workflows/deploy.yml (single job, ~30 lines)
  3.4  (Optional) Add CSP meta tag to index.html

Phase 4: Deploy
  4.1  Commit all changes
  4.2  git push -u origin main
  4.3  Enable GitHub Pages (Actions source)
  4.4  Monitor with gh run watch

Phase 5: Verify
  5.1  Pre-flight checklist
  5.2  curl + browser verification
  5.3  Troubleshoot if needed
  5.4  Output live URL: https://Jibbscript.github.io/saronic-job-dossier/
```

---

## Live URL (Expected)

```
https://Jibbscript.github.io/saronic-job-dossier/
```

---

## Agent Review Findings Incorporated

### Security Sentinel
- No secrets in codebase (pass)
- No XSS vectors (pass) — all rendering through React JSX
- Clean `npm audit` (pass)
- CSP meta tag recommended for compliance-themed credibility
- `.gitignore` should explicitly block `.env` patterns

### Architecture Strategist
- Single workflow is correct for solo dev with no tests
- Base path via CLI flag is cleanest approach
- Branch rename to `main` is zero-cost now, friction later
- 404.html hack is unnecessary — no URL routing exists

### Simplicity Reviewer
- Cut SHA pinning (demo project, not production infra)
- Cut split jobs (under 60s total build, no benefit to separation)
- Cut `.nvmrc` (solo developer, hardcode in workflow)
- Cut Dependabot (avoid PR noise for a demo project)
- Cut environment protection (no team to protect against)

### Deployment Verification Agent
- Comprehensive pre/post-deploy checklists incorporated
- Node 22 LTS recommended for CI (local runs 24, but Vite is version-tolerant)
- Rollback procedures documented at three severity levels
- Highest risk item: Vite `base` configuration — if wrong, blank white page
