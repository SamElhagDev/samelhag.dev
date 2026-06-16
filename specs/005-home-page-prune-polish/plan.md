# Home Page Prune & Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home page surface real engineering signal in one scroll by rewriting the hero, replacing the 30-logo technology wall with three honest tiers, and promoting the live CFD simulation to directly under the hero.

**Architecture:** Pure Razor markup edits to a single file ([Home.razor](../../SamElhagPersonalSite/Components/Pages/Home.razor)), reusing the existing Copper & Black design-system utility classes ([app.css](../../SamElhagPersonalSite/wwwroot/app.css)) and MudBlazor components. No new logic, dependencies, routes, or styles beyond what already exists. The deep pages (`ProjectShowcase.razor`, `HeatTransfer.razor`) and the maze background are left untouched.

**Tech Stack:** .NET 10, Blazor Server (Interactive Server render mode), MudBlazor 8.x.

**Verification approach:** No test project exists and this is presentational markup, so each task is verified by (a) `dotnet build` succeeding and (b) visual confirmation via the browser-preview tools. **Commits are deferred** — per the user's standing preference, do all work on `main` and do not commit until the user explicitly approves.

**Final home page order after this plan:** Hero → Featured CFD band → Tiered tech stack → "View All Projects" CTA.

---

### Task 1: Rewrite the hero

**Files:**
- Modify: `SamElhagPersonalSite/Components/Pages/Home.razor` (the hero `MudContainer`, currently lines 9-33)

- [ ] **Step 1: Replace the hero markup**

Replace the entire hero `<MudContainer MaxWidth="MaxWidth.Large" Class="mt-12 mb-12">` block (currently lines 9-33) with:

```razor
<MudContainer MaxWidth="MaxWidth.Large" Class="mt-12 mb-12">
    <MudGrid Justify="Justify.Center">
        <MudItem xs="12" md="10" Class="text-center">
            <MudText Typo="Typo.h1" Class="mb-4" Style="font-weight: 800; font-size: 2.75rem; line-height: 1.2; color: #f5ede0; text-shadow: 0 0 30px rgba(249, 115, 22, 0.12);">
                Sam Elhag
            </MudText>
            <MudText Typo="Typo.h4" Class="mb-6" Style="color: #f5ede0; font-weight: 600;">
                Mechanical engineer who writes software — and the solvers that run inside it.
            </MudText>
            <MudText Typo="Typo.h6" Class="mb-10 text-muted-65" Style="font-weight: 400; line-height: 1.8; max-width: 800px; margin-left: auto; margin-right: auto;">
                I move between numerical methods and production code: finite-difference CFD one day, a .NET service the next. The simulation below runs live in your browser — not a screenshot.
            </MudText>
            <MudStack Row="true" Justify="Justify.Center" Spacing="4" Class="mb-4">
                <MudButton Variant="Variant.Filled" Size="Size.Large" Href="/projects" StartIcon="@Icons.Material.Filled.Work"
                          Class="btn-gradient" Style="padding: 10px 28px; font-size: 0.95rem;">
                    View My Work
                </MudButton>
                <MudButton Variant="Variant.Outlined" Size="Size.Large" Href="/contact" StartIcon="@Icons.Material.Filled.Email"
                          Class="btn-outlined-blue" Style="padding: 10px 28px; font-size: 0.95rem;">
                    Get In Touch
                </MudButton>
            </MudStack>
        </MudItem>
    </MudGrid>
</MudContainer>
```

Notes: the `🚀` emoji and the generic "brings clarity to complexity" body are removed. The old subhead used a gradient text-clip whose three color stops were all `#f5ede0` (i.e. it rendered as solid `#f5ede0`); this is simplified to a plain color with identical visual result.

- [ ] **Step 2: Build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors.

- [ ] **Step 3: Visual check**

Start the preview (preview_start) if not running, navigate to `/`, and take a preview_snapshot.
Expected: H1 reads "Sam Elhag" (no emoji); subhead is the "Mechanical engineer who writes software…" line; body is the two-sentence numerical-methods line; both CTA buttons present.

- [ ] **Step 4: Checkpoint (do NOT commit)**

Leave changes in the working tree on `main`. Do not run `git commit`.

---

### Task 2: Promote the CFD featured band to directly under the hero

**Files:**
- Modify: `SamElhagPersonalSite/Components/Pages/Home.razor` (insert a new featured band immediately after the hero `MudContainer` from Task 1; the original featured section near the file end will be removed in Task 4)

- [ ] **Step 1: Insert the promoted featured band**

Immediately **after** the closing `</MudContainer>` of the hero (end of Task 1's block) and **before** the existing `<!-- Tech Stack Section -->` comment, insert:

```razor
<!-- Featured Project — promoted directly under hero -->
<MudContainer MaxWidth="MaxWidth.Large" Class="mb-12">
    <MudText Typo="Typo.overline" Align="Align.Center" Class="text-overline-cyan" Style="display:block; letter-spacing: 3px;">
        FEATURED
    </MudText>
    <MudText Typo="Typo.h3" Align="Align.Center" Class="mt-2 mb-3 text-heading">
        Real-time CFD, in your browser
    </MudText>
    <MudText Typo="Typo.body1" Align="Align.Center" Class="mb-8 text-muted-50">
        Computational physics meets modern web development
    </MudText>

    <MudGrid Justify="Justify.Center">
        <MudItem xs="12" md="10">
            <MudPaper Elevation="0" Class="glass-card glass-card--featured pa-8">
                <MudStack Row="true" Wrap="Wrap.Wrap" AlignItems="AlignItems.Center" Spacing="4">
                    <div class="icon-box icon-box--inline icon-box--lg icon-box--blue-cyan" style="flex-shrink: 0;">
                        <MudIcon Icon="@Icons.Material.Filled.Air" Style="color: white; font-size: 2.5rem;" />
                    </div>
                    <div style="flex: 1; min-width: 240px;">
                        <MudText Typo="Typo.h6" Class="text-white-bold" Style="margin-bottom: 6px;">NACA 0012 Heat Transfer Simulation</MudText>
                        <MudText Typo="Typo.body2" Class="text-muted-65" Style="line-height: 1.7;">
                            A transient finite-difference heat-transfer solver — written from the governing PDE up and rendered live, not pre-recorded.
                        </MudText>
                        <MudText Class="mt-3" Style="font-family: 'JetBrains Mono', monospace; color: #fb923c; font-size: 0.9rem;">
                            134,400 nodes · Re 1.3M–20.5M · Mach 0.3 · live
                        </MudText>
                    </div>
                    <MudButton Variant="Variant.Filled" Href="/projects/heat-transfer"
                               Class="btn-gradient" Style="white-space: nowrap; flex-shrink: 0; padding: 10px 24px;">
                        Learn More
                    </MudButton>
                </MudStack>
            </MudPaper>
        </MudItem>
    </MudGrid>
</MudContainer>
```

Notes: metrics line values are sourced from the existing case study ([ProjectShowcase.razor:104-124](../../SamElhagPersonalSite/Components/Pages/ProjectShowcase.razor)) — keep them consistent. `Wrap="Wrap.Wrap"` plus `min-width: 240px` on the middle column lets the row reflow cleanly on small screens.

- [ ] **Step 2: Build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors.

- [ ] **Step 3: Visual check**

Reload `/` (preview_eval `window.location.reload()` or rely on HMR) and take a preview_snapshot.
Expected: a "FEATURED" overline + "Real-time CFD, in your browser" heading + the glass card with the monospace metrics line appear directly below the hero, above the technologies section.

- [ ] **Step 4: Checkpoint (do NOT commit)**

Leave changes in the working tree on `main`. Do not run `git commit`.

---

### Task 3: Replace the 30-logo technology wall with three honest tiers

**Files:**
- Modify: `SamElhagPersonalSite/Components/Pages/Home.razor` (the `<!-- Tech Stack Section -->` `MudContainer`, originally lines 35-230)

- [ ] **Step 1: Replace the entire technologies grid**

Replace the whole `<!-- Tech Stack Section -->` block — from the `<!-- Tech Stack Section -->` comment through the closing `</MudContainer>` that ends the ~30-card `MudGrid` (originally line 230) — with:

```razor
<!-- Tech Stack Section -->
<MudContainer MaxWidth="MaxWidth.Large" Class="my-12">
    <MudText Typo="Typo.h3" Align="Align.Center" Class="mb-3 text-heading">
        Technologies & Tools
    </MudText>
    <MudText Typo="Typo.body1" Align="Align.Center" Class="mb-8 text-muted-50" Style="font-weight: 400;">
        An honest map of what I reach for — grouped by how often I actually use it.
    </MudText>

    <div style="max-width: 900px; margin: 0 auto;">
        <!-- Tier 1: Build with daily -->
        <div class="mb-6">
            <MudText Typo="Typo.overline" Class="text-overline-cyan" Style="display:block; margin-bottom: 8px;">Build with daily</MudText>
            <MudChipSet T="string">
                <MudChip T="string" Class="chip-blue-accent">C#</MudChip>
                <MudChip T="string" Class="chip-blue-accent">.NET</MudChip>
                <MudChip T="string" Class="chip-blue-accent">Blazor</MudChip>
                <MudChip T="string" Class="chip-blue-accent">ASP.NET</MudChip>
                <MudChip T="string" Class="chip-blue-accent">SQL Server / T-SQL</MudChip>
                <MudChip T="string" Class="chip-blue-accent">TypeScript</MudChip>
                <MudChip T="string" Class="chip-blue-accent">Azure</MudChip>
            </MudChipSet>
        </div>

        <!-- Tier 2: Comfortable in -->
        <div class="mb-6">
            <MudText Typo="Typo.overline" Class="text-overline-cyan" Style="display:block; margin-bottom: 8px;">Comfortable in</MudText>
            <MudChipSet T="string">
                <MudChip T="string" Class="chip-cyan-accent">Rust</MudChip>
                <MudChip T="string" Class="chip-cyan-accent">F#</MudChip>
                <MudChip T="string" Class="chip-cyan-accent">Angular</MudChip>
                <MudChip T="string" Class="chip-cyan-accent">EF Core</MudChip>
                <MudChip T="string" Class="chip-cyan-accent">Docker</MudChip>
                <MudChip T="string" Class="chip-cyan-accent">Redis</MudChip>
            </MudChipSet>
        </div>

        <!-- Tier 3: Engineering side -->
        <div class="mb-2">
            <MudText Typo="Typo.overline" Class="text-overline-cyan" Style="display:block; margin-bottom: 8px;">Engineering side</MudText>
            <MudChipSet T="string">
                <MudChip T="string" Class="chip-silver">MATLAB</MudChip>
                <MudChip T="string" Class="chip-silver">SolidWorks</MudChip>
                <MudChip T="string" Class="chip-silver">AutoCAD</MudChip>
            </MudChipSet>
        </div>
    </div>
</MudContainer>
```

Notes: this deletes the ~30 equal-weight glass cards and the peripheral entries (Google Earth API, SSRS, WinForms, WPF, Kubernetes, Terraform, GraphQL, IIS, SQLite, .NET Aspire, Razor, HTML/CSS, JavaScript). The `chip-blue-accent`, `chip-cyan-accent`, and `chip-silver` classes already exist in [app.css:244-249](../../SamElhagPersonalSite/wwwroot/app.css). The `MudChip T="string" Class="...">` usage matches the existing pattern in [ProjectShowcase.razor](../../SamElhagPersonalSite/Components/Pages/ProjectShowcase.razor) / [Projects.razor:32-38](../../SamElhagPersonalSite/Components/Pages/Projects.razor).

- [ ] **Step 2: Build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors.

- [ ] **Step 3: Visual check**

Reload `/` and take a preview_snapshot.
Expected: the wall of ~30 cards is gone; in its place are three labeled rows of chips (Build with daily / Comfortable in / Engineering side).

- [ ] **Step 4: Checkpoint (do NOT commit)**

Leave changes in the working tree on `main`. Do not run `git commit`.

---

### Task 4: Remove the old bottom featured section and add a closing CTA

**Files:**
- Modify: `SamElhagPersonalSite/Components/Pages/Home.razor` (the original `<!-- Featured Projects Section -->` block, originally lines 232-269)

- [ ] **Step 1: Replace the old bottom featured section with a single closing CTA**

The featured project is now shown at the top (Task 2), so the original bottom `<!-- Featured Projects Section -->` `MudContainer` (originally lines 232-269) is redundant. Replace that entire block with just the closing "View All Projects" CTA:

```razor
<!-- Closing CTA -->
<MudContainer MaxWidth="MaxWidth.Large" Class="my-12">
    <MudStack Row="true" Justify="Justify.Center">
        <MudButton Variant="Variant.Outlined" Size="Size.Medium" Href="/projects" EndIcon="@Icons.Material.Filled.ArrowForward"
                   Class="btn-outlined-blue" Style="padding: 12px 32px;">
            View All Projects
        </MudButton>
    </MudStack>
</MudContainer>
```

- [ ] **Step 2: Build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors.

- [ ] **Step 3: Visual check — full page order**

Reload `/`, take a preview_snapshot, and confirm the top-to-bottom order is: Hero → Featured CFD band → three tech tiers → "View All Projects" button. Confirm there is no duplicate featured card.

- [ ] **Step 4: Checkpoint (do NOT commit)**

Leave changes in the working tree on `main`. Do not run `git commit`.

---

### Task 5: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Clean build of the whole site**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 warnings introduced by these changes, 0 errors.

- [ ] **Step 2: Responsive check**

With the preview on `/`, use preview_resize to a narrow width (e.g. 390px) and take a preview_snapshot.
Expected: hero text wraps cleanly; the featured band's row reflows (icon / text / button stack vertically) without overflow; chip tiers wrap.

- [ ] **Step 3: Regression check on untouched pages**

Navigate to `/projects/heat-transfer` and `/HeatSimulation`; take preview_snapshots and check preview_console_logs.
Expected: both pages render unchanged, KaTeX equations still render, the maze background still animates, no new console errors.

- [ ] **Step 4: Capture proof**

Take a preview_screenshot of the new `/` for the user.

- [ ] **Step 5: Hold for commit approval**

Report completion and the screenshot to the user. **Do not commit.** Wait for the user to explicitly approve committing before running any `git` write commands.

---

## Self-Review

**Spec coverage:**
- Spec §1 (rewrite hero) → Task 1 ✓
- Spec §2 (replace 30-logo wall with tiers) → Task 3 ✓
- Spec §3 (promote sim to top + metrics) → Task 2 (+ Task 4 removes the old bottom duplicate and keeps the closing CTA) ✓
- Spec §4 (optional Projects.razor slim) → intentionally deferred; not in critical path, noted in spec as optional. Not implemented here.
- Out-of-scope items (deep pages, maze background, routing, re-theme) → untouched; Task 5 Step 3 actively verifies no regression ✓
- Non-functional (design system reuse, no new deps, responsive, no regressions) → reuses existing utility classes/chips, adds no dependencies, Task 5 Steps 2-3 verify ✓

**Placeholder scan:** No TBD/TODO/"handle edge cases"/vague steps. Every code step shows complete markup. ✓

**Type/name consistency:** `chip-blue-accent` / `chip-cyan-accent` / `chip-silver` all exist in app.css. `MudChip T="string"` matches existing usage. `glass-card--featured`, `icon-box--blue-cyan`, `text-overline-cyan`, `text-heading`, `text-muted-50/65`, `btn-gradient`, `btn-outlined-blue` all exist in app.css. `Wrap="Wrap.Wrap"` is a valid MudStack parameter. ✓
