<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0 (MINOR — enriched identity, clarified JS interop scope,
  named primary showcase, corrected build command, relaxed line-limit for simulation pages)

Modified principles:
  - Principle 1 (Blazor-First Architecture): Clarified render mode (Interactive Server),
    named the three approved JS modules explicitly, added KaTeX as a permitted interop use.
  - Principle 3 (Single Stellar Showcase): Named the primary showcase project (NACA 0012
    Airfoil Heat Transfer Simulation) and enumerated the required showcase sub-pages.
  - Principle 5 (Maintainability and Simplicity): Corrected build/run command to use Aspire
    host; added an exception clause for simulation-heavy pages (≤ 450 lines).

Added sections: none

Removed sections: none

Templates requiring updates:
  - .specify/templates/plan-template.md       ✅ no change required (generic enough)
  - .specify/templates/spec-template.md       ✅ no change required
  - .specify/templates/tasks-template.md      ✅ no change required
  - .claude/commands/*.md                     ✅ no change required

Deferred TODOs: none (all placeholders resolved)
-->

# Project Constitution — Sam Elhag Personal Portfolio

**Version:** 1.1.0
**Ratification Date:** 2026-02-19
**Last Amended:** 2026-02-20
**Status:** Active

---

## 1. Project Identity

**Project Name:** Sam Elhag Personal Portfolio Website

**Mission:** Deliver a fast, elegant, and authentic personal portfolio that presents Sam Elhag
as a skilled software and aerospace engineer, showcases one exemplary interactive project
in depth, and makes it effortless for visitors to learn about and contact him.

**Technology Stack (non-negotiable):**

| Layer | Technology | Version / Notes |
|---|---|---|
| Runtime | .NET | 10 |
| UI Framework | Blazor Server | Interactive Server render mode (`AddInteractiveServerComponents`) |
| Component Library | MudBlazor | 8.x — sole permitted component library |
| CSS Baseline | Bootstrap | 5.x — layout and grid only; MudBlazor governs components |
| Math Rendering | KaTeX | CDN — for mathematical formula display in showcase pages |
| Orchestration | .NET Aspire | 13.x — app host, service defaults, OpenTelemetry |
| Deployment Target | Azure | Via Aspire AppHost provisioning |

**Approved JavaScript Modules (exhaustive list — all others require amendment):**

| Module | File | Purpose |
|---|---|---|
| Maze Background | `wwwroot/js/maze-background.js` | Procedural animated canvas background |
| Heat Simulation | `wwwroot/js/heatSimulation.js` | NACA 0012 finite-difference CFD solver on canvas |
| Site Interop | `wwwroot/js/site-interop.js` | Session storage helpers and page reload utility |

**Primary Showcase Project:** NACA 0012 Airfoil Heat Transfer Simulation

**Site Pages (canonical list):**
- `/` — Home (hero, tech stack cards, featured project teaser)
- `/projects` — Projects (primary showcase card)
- `/project-showcase` — Project Showcase (deep-dive: problem, solution, math, outcomes)
- `/heat-transfer` — Heat Transfer Simulation (live interactive canvas simulation)
- `/about` — About (bio, skills, experience timeline)
- `/contact` — Contact (form, social links, FAQ)
- `/not-found` — 404 fallback

**Audience:** Recruiters, collaborators, engineers, and curious visitors who want to understand
Sam's engineering background across both software and aerospace domains.

---

## 2. Core Principles

### Principle 1 — Blazor-First Architecture

All UI MUST be implemented as Blazor components (`.razor` files) using Interactive Server
render mode. JavaScript interop (`IJSRuntime`) is permitted ONLY for the three approved
modules listed in §1 (maze background, heat simulation, site interop) and for KaTeX formula
rendering. New JavaScript capabilities require a constitution amendment listing the new module
in §1. No third-party JavaScript UI frameworks (React, Vue, Angular, Alpine, htmx, etc.) are
permitted. MudBlazor MUST be the sole component library; Bootstrap is permitted for grid/layout
utilities only. Custom CSS is allowed for theming, dark-mode palette, and layout overrides.

**Rationale:** The stack choice (.NET 10 / Blazor Server / MudBlazor) is a deliberate
architectural signal of Sam's expertise in the Microsoft ecosystem. The canvas-based CFD
simulation legitimately requires JS interop; all other JS is scoped to the pre-approved
modules. Keeping the approved list explicit prevents scope creep.

### Principle 2 — Performance by Default

Every page MUST achieve:
- First Contentful Paint (FCP) ≤ 1.5 s on a mid-range device over a simulated 4G connection
- Time to Interactive (TTI) ≤ 2.0 s under the same conditions
- (Both measured via Lighthouse or WebPageTest)

Response compression (Brotli preferred, Gzip fallback) MUST be enabled in production.
Static assets served via `MapStaticAssets` MUST carry cache headers of at least one year.
The maze background animation MUST be throttled to a maximum of 30 fps; particle count MUST
NOT exceed 100. The heat transfer canvas simulation MUST cap redraws to 60 fps and pause
rendering when the tab is not visible. Image assets MUST use lazy loading and `async` decoding.

**Rationale:** A portfolio site that loads slowly or janks reflects poorly on the engineer
it represents. Performance IS a feature, not an afterthought. The PERFORMANCE.md document
in the repository root tracks implemented optimizations and serves as the living audit log.

### Principle 3 — Single Stellar Showcase

The site MUST feature exactly one primary project showcase: the **NACA 0012 Airfoil Heat
Transfer Simulation**. The showcase MUST be presented across two dedicated pages:

1. **Project Showcase page** (`/project-showcase`) — narrative depth:
   - Clear problem statement (heat transfer over cambered airfoil surface)
   - Solution approach including governing equations (rendered via KaTeX)
   - Technology stack used (finite-difference method, canvas rendering)
   - Measurable outcomes / results (Reynolds number, Mach, grid node stats)

2. **Heat Transfer Simulation page** (`/heat-transfer`) — interactive demonstration:
   - Live canvas simulation with real-time parameter controls
   - Sliders for: thermal diffusivity, airspeed, surface temperature, angle of attack
   - Live statistics display (Reynolds, Prandtl, Nusselt numbers)
   - Mathematical formulation section with KaTeX-rendered equations

Additional projects MAY appear as secondary cards on the `/projects` page but MUST NOT
be given their own dedicated showcase pages without a constitution amendment.

**Rationale:** "One really good project" presented with both narrative depth and live
interactivity is more compelling to evaluators than a shallow grid of many projects.
The dual-page approach (story + simulator) demonstrates both engineering understanding
and frontend craft simultaneously.

### Principle 4 — Personal Authenticity

All copy, biography, and project descriptions MUST reflect Sam's actual background,
skills, and experience. Placeholder or generic content MUST NOT appear in production
builds. The About page MUST include: professional summary, current focus areas, skills
organized by domain, and a work experience timeline. Contact information MUST be accurate
and up-to-date. The Contact page MUST provide: a working contact form, direct email/phone,
social links (GitHub, LinkedIn), and a contextual FAQ section.

**Rationale:** A portfolio is a personal statement. Inauthentic or generic content erodes
trust and fails the site's core purpose.

### Principle 5 — Maintainability and Simplicity

Components MUST be kept small and single-purpose. Standard pages MUST NOT exceed 300 lines
of Razor markup; logic exceeding this SHOULD be extracted to code-behind (`.razor.cs`) files
or services. **Exception:** Simulation and showcase pages (`/project-showcase`,
`/heat-transfer`) MAY extend to 450 lines due to the inherent complexity of rendering
mathematical content and interactive controls inline. No dead code or commented-out blocks
MUST exist in production branches. Dependencies MUST be kept minimal; a new NuGet package
requires justification in the PR description. The codebase MUST remain buildable and runnable
from a clean clone with a single command targeting the Aspire app host:

```
dotnet run --project SamElhagPersonalSite.AppHost
```

**Rationale:** A personal site is maintained by one person. Complexity accumulates quickly;
this principle protects long-term velocity and makes the codebase a positive example if
shown to others. The Aspire host is the correct entry point — it orchestrates the web app
and wires up service defaults, OpenTelemetry, and service discovery.

---

## 3. Governance

### Amendment Procedure

1. Open a GitHub issue titled `[Constitution] <summary of proposed change>`.
2. Describe the motivation, the exact text change, and which principle(s) are affected.
3. Self-review using the Sync Impact Report checklist (see below).
4. Update `CONSTITUTION_VERSION` per the versioning policy (§3.2).
5. Update `LAST_AMENDED` to the date of merge (ISO format: YYYY-MM-DD).
6. Update all dependent templates listed in §3.3 if principles changed.
7. Merge with a commit message following the pattern:
   `docs: amend constitution to vX.Y.Z (<short rationale>)`

### Versioning Policy

| Change Type | Version Bump |
|---|---|
| Principle removed or fundamentally redefined | MAJOR |
| New principle, new mandatory section, or materially expanded guidance added | MINOR |
| Wording clarification, typo fix, non-semantic refinement | PATCH |

### Compliance Review

Each feature specification (`spec.md`) and implementation plan (`plan.md`) produced by
speckit MUST include a "Constitution Compliance" section that maps every principle to
either a confirmed compliance statement or an explicit exception with justification.
Exceptions require owner approval before implementation proceeds.

### Dependent Templates

The following templates MUST be kept consistent with this constitution:

| Template | Path | Governs |
|---|---|---|
| Plan Template | `.specify/templates/plan-template.md` | Design decisions, constitution check |
| Spec Template | `.specify/templates/spec-template.md` | Requirements scope and constraints |
| Tasks Template | `.specify/templates/tasks-template.md` | Task types and principle-driven tasks |
| Command files | `.claude/commands/speckit.*.md` | Agent workflow instructions |

---

## 4. Non-Goals (Explicit Exclusions)

The following are explicitly out of scope and MUST NOT be introduced without a constitution
amendment:

- E-commerce or payment flows of any kind
- User authentication, accounts, or session management
- CMS or database-backed content (all content is code-managed in `.razor` files)
- Server-side API backends beyond Blazor's built-in SignalR hub and `/api` minimal routes
- Multiple language (i18n) or locale support
- Additional JavaScript UI frameworks or component libraries beyond those in §1
- Additional primary showcase projects (only one allowed — NACA 0012)

---

## 5. Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0.0 | 2026-02-19 | Sam Elhag | Initial ratification |
| 1.1.0 | 2026-02-20 | Sam Elhag | Named NACA 0012 showcase; listed approved JS modules; clarified Blazor render mode and build command; added Bootstrap and KaTeX to stack; relaxed line-limit for simulation pages |
