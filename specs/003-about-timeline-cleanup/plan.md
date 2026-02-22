# Implementation Plan: About Page – "Path So Far" Timeline Redesign

**Branch**: `003-about-timeline-cleanup` | **Date**: 2026-02-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-about-timeline-cleanup/spec.md`

---

## Summary

Replace the horizontally-scrolling conveyor belt in the "Path So Far" section with a clean, modern left-aligned vertical timeline. The vertical rail runs down the left side; circular category-coloured dot nodes mark each milestone; glass-morphism cards span full width to the right. The current role pulses. No data model changes, no new dependencies — pure CSS + minimal Razor class-name updates.

---

## Technical Context

**Language/Version**: C# 13 / .NET 10 — Blazor Server (Interactive Server render mode)
**Primary Dependencies**: MudBlazor 8.x — `MudPaper`, `MudText`, `MudChip`, `MudDivider`, `MudStack`; Bootstrap 5.x grid utilities
**Storage**: N/A — all milestone data is static, code-managed in `About.razor @code` block (via `About.razor.cs`)
**Testing**: Visual browser verification per `quickstart.md`; `dotnet build` 0-error gate
**Target Platform**: Blazor Server — rendered as HTML/CSS; Aspire AppHost
**Project Type**: Web application (single Blazor Server project)
**Performance Goals**: FCP ≤ 1.5s, TTI ≤ 2.0s (unchanged — CSS-only change has no meaningful perf impact)
**Constraints**: Standard page ≤ 300 lines Razor markup (About is currently well under limit); no new JS modules; no new NuGet packages
**Scale/Scope**: 5 milestone entries (static); single About page

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| P1 — Blazor-First Architecture | ✅ PASS | Pure Razor + scoped CSS. No new JS. No third-party component library. MudBlazor used throughout. |
| P2 — Performance by Default | ✅ PASS | CSS-only change. Pulsing animation uses `box-shadow` only (GPU composited). `prefers-reduced-motion` honoured. No new assets, no new network requests. |
| P3 — Single Stellar Showcase | ✅ PASS | About page is unchanged in purpose; timeline is presentation only. No new showcase pages. |
| P4 — Personal Authenticity | ✅ PASS | All 5 milestones reflect Sam's real background. No placeholder text introduced. |
| P5 — Maintainability and Simplicity | ✅ PASS | About.razor stays well under 300 lines. No new abstractions. Category helper already exists. No dead code. |

**Gate result**: ✅ All principles satisfied. No exceptions required.

---

## Project Structure

### Documentation (this feature)

```text
specs/003-about-timeline-cleanup/
├── spec.md              ✅ created
├── plan.md              ✅ this file
├── research.md          ✅ created
├── quickstart.md        ✅ created
├── checklists/
│   └── requirements.md  ✅ created
└── tasks.md             (Phase 2 — /speckit.tasks)
```

### Source Code (files to modify)

```text
SamElhagPersonalSite/Components/Pages/
├── About.razor          # Razor markup — rename CSS classes, remove scroll wrapper + connector divs
├── About.razor.css      # Full rewrite — conveyor → vertical timeline styles
└── About.razor.cs       # Minor — add IsCurrent to tile class; GetCategoryClass() unchanged
```

No other files require changes.

---

## Design

### HTML Structure (new)

```
<div class="timeline-section">
  <div class="timeline-track">           ← ::before = vertical rail
    <div class="timeline-item cat-education">   ← ::before = dot node; cat class sets colours
      <MudPaper class="timeline-card [is-current]">
        ... chip row (category + CURRENT badge) ...
        ... role title ...
        ... divider ...
        ... org name ...
        ... date range ...
        ... description ...
      </MudPaper>
    </div>
    <!-- repeat for each milestone, no connector divs needed -->
  </div>
</div>
```

### CSS Architecture (new — `About.razor.css`)

**Section 1 — Category colour palette** (same `--cat-r/g/b` pattern as before):
```css
.cat-education { --cat-r: 111; --cat-g: 201; --cat-b: 215; }  /* cyan  #6FC9D7 */
.cat-coop      { --cat-r: 91;  --cat-g: 141; --cat-b: 239; }  /* blue  #5B8DEF */
.cat-contract  { --cat-r: 156; --cat-g: 39;  --cat-b: 176; }  /* purple #9C27B0 */
.cat-industry  { --cat-r: 91;  --cat-g: 141; --cat-b: 239; }  /* steel #5B8DEF */
.cat-unknown   { --cat-r: 120; --cat-g: 120; --cat-b: 120; }  /* grey  */
```

**Section 2 — Timeline track** (vertical flex column + rail `::before`):
```css
.timeline-section  { margin: 3rem 0 2rem; }
.timeline-track    { display: flex; flex-direction: column; gap: 0; position: relative;
                     padding: 1rem 0 1rem 3.5rem; }
.timeline-track::before { /* vertical rail */ left: 1.1rem; top: 1.5rem; bottom: 1.5rem;
                           width: 2px; background: linear-gradient(180deg, ...); }
```

**Section 3 — Timeline item** (relative position + dot node `::before`):
```css
.timeline-item       { position: relative; padding-bottom: 2rem; }
.timeline-item:last-child { padding-bottom: 0; }
.timeline-item::before { /* dot node */ left: -2.4rem; top: 1.25rem;
                          width: 14px; height: 14px; border-radius: 50%;
                          background: rgba(var(--cat-r), var(--cat-g), var(--cat-b), 1.0);
                          border: 2px solid rgba(22,33,62,0.9);
                          box-shadow: 0 0 8px rgba(var(--cat-r),var(--cat-g),var(--cat-b),0.5); }
.timeline-item.is-current::before { animation: glow-pulse 2s ease-in-out infinite;
                                    width: 18px; height: 18px; left: -2.5rem; }
```

**Section 4 — Card surface** (glass morphism, category-coloured borders):
```css
.timeline-card { border: 1px solid rgba(var(--cat-r),...,0.2);
                 border-left: 3px solid rgba(var(--cat-r),...,0.7);
                 border-radius: 12px; padding: 1.25rem;
                 background: rgba(22,33,62,0.6); backdrop-filter: blur(20px);
                 box-shadow: 0 4px 24px rgba(var(--cat-r),...,0.12); }
.timeline-card.is-current { border-left-color: rgba(var(--cat-r),...,1.0);
                             box-shadow: 0 4px 32px rgba(var(--cat-r),...,0.25); }
.timeline-card:hover { border-color: rgba(var(--cat-r),...,0.45);
                       box-shadow: 0 8px 40px rgba(var(--cat-r),...,0.3); }
```

**Section 5 — Typography** (largely unchanged from current; org gradient text retained):
- `.timeline-title` — white, 700 weight, 1rem
- `.timeline-org` — gradient text (existing pattern)
- `.timeline-date` — category-coloured, 0.78rem
- `.timeline-description` — white 80%, 0.85rem, flex-grow: 1
- `.timeline-divider` — category-coloured border

**Section 6 — Chips** (existing style, slightly updated class names):
- `.timeline-chip-category` — category colour bg/border
- `.timeline-chip-current` — MudBlazor Color.Success (green chip)

**Section 7 — Glow pulse animation**:
```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 8px  rgba(var(--cat-r),...,0.5); }
  50%       { box-shadow: 0 0 20px rgba(var(--cat-r),...,0.9); }
}
```

**Section 8 — Responsive**:
```css
@media (max-width: 600px) {
  .timeline-track { padding-left: 2.5rem; }  /* tighten rail/dot clearance on mobile */
  .timeline-track::before { left: 0.75rem; }
  .timeline-item::before  { left: -1.85rem; }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-item::before { animation: none !important; }
  .timeline-card         { transition: none !important; }
}
```

### Razor Changes (About.razor)

**Remove**:
- `<div class="conveyor-wrapper">` (scroll container)
- `<div class="conveyor-connector">` + `<svg class="conveyor-chevron">` (chevrons — replaced by CSS rail)
- `class="conveyor-track"`, `class="conveyor-tile"`, `class="conveyor-tile-paper"` etc.

**Add**:
- `<div class="timeline-section">` → `<div class="timeline-track">`
- Per-item: `<div class="timeline-item @GetCategoryClass(milestone.Category) @(milestone.IsCurrent ? "is-current" : "")">`
- Card: `<MudPaper class="timeline-card @(milestone.IsCurrent ? "is-current" : "")">`
- Rename all `conveyor-tile-*` inner classes → `timeline-*`

### C# Changes (About.razor.cs)

**None** — `GetCategoryClass()`, `_milestones` list, and `TimelineMilestone` record are all unchanged.

---

## Files to Modify

| File | Change Summary |
|------|---------------|
| `SamElhagPersonalSite/Components/Pages/About.razor` | Rename CSS classes; remove scroll wrapper + connector divs; add `is-current` to item div |
| `SamElhagPersonalSite/Components/Pages/About.razor.css` | Full rewrite: conveyor styles → vertical timeline styles (same class name conventions) |

**Files NOT changing**: `About.razor.cs`, any other page, any `.js` file, any NuGet reference.

---

## Key Design Decisions

1. **Left-aligned over centre-split**: Simpler, naturally responsive, consistent with modern portfolio standards.
2. **`::before` pseudo-element for rail and dots**: Zero extra HTML markup; efficiently composited by browser.
3. **`--cat-r/g/b` custom properties**: Reuses the existing colour-system pattern; all colours flow from one source per category class.
4. **No text truncation**: Cards are full-width and variable-height in a column — descriptions can wrap freely (FR-002 requires legibility).
5. **`glow-pulse` on dot only**: Animating only `box-shadow` on a 18px element is the cheapest possible animation (GPU-composited). The card itself does not animate — this keeps it subtle.
6. **No new JS, no new packages**: Entirely CSS + Razor. Zero constitution violations.

---

## Verification

1. `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj` — must produce **0 errors, 0 warnings**.
2. `dotnet run --project SamElhagPersonalSite.AppHost` — navigate to `/about`.
3. Follow `quickstart.md` checklist end-to-end.
4. Resize to 375px — confirm no horizontal scrollbar, single-column rail still visible.
5. Enable OS "Reduce Motion" — confirm pulsing dot animation stops.
