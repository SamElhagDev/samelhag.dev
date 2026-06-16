# Home Page Prune & Polish — Design

**Date:** 2026-06-15
**Status:** Approved (design), pending implementation plan
**Scope:** Home page (`Home.razor`) primarily; optional light touch on `Projects.razor`

## Goal

The site reads as "vibe coded" — not because it lacks substance, but because generic
scaffolding (a 30-logo technology wall, emoji-laden generic hero copy) buries the three
things that genuinely set it apart. This change makes the home page surface real
engineering signal in a single scroll.

**Primary audience:** technical peers (engineers). Optimize for demonstrated depth and
authored detail, not breadth-of-logos.

**Appetite:** prune & polish. Subtract the generic; amplify what already exists. No
re-theme, no new interactive features, no new dependencies.

## Key finding driving this design

The deep technical content **already exists and is excellent**:

- `/projects/heat-transfer` ([ProjectShowcase.razor](../../SamElhagPersonalSite/Components/Pages/ProjectShowcase.razor))
  is a full case study: Problem Statement → Solution Approach (with governing PDE) →
  Technology Stack with rationale → live-sim CTA → Outcomes (Re 1.3M–20.5M, Mach 0.3,
  134,400 nodes) → Key Concepts → source link.
- `/HeatSimulation` ([HeatTransfer.razor](../../SamElhagPersonalSite/Components/Pages/HeatTransfer.razor))
  is the live solver with six KaTeX-rendered equations and live Re/Pr/Nu statistics.

Therefore **no new technical writing is required.** The entire job is hierarchy and copy
on the home page so an engineer reaches the gold immediately instead of three clicks deep.

## Changes

### 1. Rewrite the hero (Home.razor:8-33)

Remove the `🚀` emoji and the generic body paragraph ("turning complex problems into clean,
scalable applications… brings clarity to complexity"). Replace with identity-forward copy:

> **H1:** Sam Elhag
> **Subhead:** Mechanical engineer who writes software — and the solvers that run inside it.
> **Body:** I move between numerical methods and production code: finite-difference CFD one
> day, a .NET service the next.

- Keep the two existing CTAs (`View My Work` → `/projects`, `Get In Touch` → `/contact`).
- The body may optionally add one sentence pointing at the simulation band directly below
  (e.g., "The simulation below runs live, not as a screenshot."), reinforcing the funnel.
- Preserve existing typography classes and the copper/black palette.

### 2. Replace the 30-logo technology wall (Home.razor:35-230)

Delete the ~200-line `Technologies & Tools` grid (≈30 equal-weight glass cards). Replace
with a compact, **tiered** stack that tells the real story. Render each tier as a labeled
group of pills/chips using the existing `chip-*` utility classes (not 30 individual
glass cards):

- **Build with daily:** C#, .NET, Blazor, ASP.NET, SQL Server / T-SQL, TypeScript, Azure
- **Comfortable in:** Rust, F#, Angular, EF Core, Docker, Redis
- **Engineering side:** MATLAB, SolidWorks, AutoCAD

Peripheral items (Google Earth API, SSRS, WinForms, Kubernetes, Terraform, GraphQL, IIS,
WPF, SQLite, .NET Aspire, Razor, HTML/CSS, JavaScript) are dropped, or collapsed into a
single muted "also worked with: …" line if retaining them feels important.

Rationale: a tiered, honest list reads as authored and credible; the engineering tools
(MATLAB/SolidWorks/AutoCAD) are a genuine differentiator that a flat logo grid hides.

### 3. Promote the simulation to the top (reorder Home.razor)

Move the featured-project band (Home.razor:232-269) to sit **directly under the hero**.
Enlarge it from the current small inline card and lead with the real metrics:

> 134,400 nodes · Re 1.3M–20.5M · Mach 0.3 · live in-browser

Keep its existing CTA to `/projects/heat-transfer` ("Learn More" / "View All Projects").
The showcase and simulation pages are **unchanged** — this band simply points at them
sooner and more prominently.

**New home order:** Hero → CFD featured band → tiered stack → footer.
**Current order:** Hero → 30-logo wall → small CFD card → footer.

### 4. (Optional) Tighten the funnel — Projects.razor

`Projects.razor` currently re-describes the same project as the home featured card. It can
be slimmed (remove duplicate copy, keep the two CTAs) or left as-is. Out of the critical
path; decide during implementation.

## Out of scope (explicitly do not touch)

- `HeatTransfer.razor` (`/HeatSimulation`) content, math, or simulation logic.
- `ProjectShowcase.razor` (`/projects/heat-transfer`) content.
- Routing / URLs.
- The animated maze background ([maze-background.js](../../SamElhagPersonalSite/wwwroot/js/maze-background.js)).
- Re-theming, glassmorphism overhaul, or a command palette (deferred — Approaches B & C
  from brainstorming were not selected).
- The About page interface concept (`Anatomy of a Sam.E`) — already strong, leave it.

## Non-functional requirements

- Preserve the Copper & Black design system ([app.css](../../SamElhagPersonalSite/wwwroot/app.css))
  and MudBlazor component usage.
- No new NuGet or JS dependencies.
- Maintain responsive behavior (xs/sm/md breakpoints) for the new hero, tiered stack, and
  promoted featured band.
- No regressions to the maze background or KaTeX rendering on other pages.

## Success criteria

1. The home page no longer contains the 30-card technology wall.
2. The hero uses the approved Option B copy; no emoji, no generic "clarity to complexity"
   line.
3. The CFD simulation band appears above the fold / directly under the hero and leads with
   concrete metrics.
4. The technology stack is presented as three honest tiers.
5. No visual regressions to the design system, responsiveness, background, or the deep
   project/simulation pages.
