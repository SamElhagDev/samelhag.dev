# Implementation Plan: About Page — Conveyor Belt Timeline

**Branch**: `002-about-conveyor` | **Date**: 2026-02-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-about-conveyor/spec.md`

---

## Summary

Replace the existing vertical `MudTimeline` in the "The Path So Far" section of `About.razor`
with a horizontal conveyor belt layout. The belt runs left to right, connecting five career
milestone tiles with a CSS pseudo-element rail and SVG chevron directional connectors. Each tile
is a square-cornered `MudPaper` using `border-radius: 8px`, containing MudBlazor `MudText`,
`MudChip`, and `MudIcon` components for content richness. CSS isolation via `About.razor.css`
keeps all new styles scoped. No JavaScript changes. No new NuGet packages.

---

## Technical Context

**Language/Version**: C# 13 / .NET 10 — Blazor Server (Interactive Server render mode)
**Primary Dependencies**: MudBlazor 8.x — `MudPaper`, `MudText`, `MudChip`, `MudChipSet`, `MudIcon`; Bootstrap 5.x grid utilities for responsive wrapper
**Storage**: N/A — all milestone data is static, code-managed in `About.razor @code` block
**Testing**: Manual visual inspection in browser + Lighthouse audit; no automated test framework required for a pure UI change
**Target Platform**: Modern browser (Blazor Server over SignalR); CSS features used (flexbox, scroll-snap, `backdrop-filter`) have ≥ 95% browser coverage
**Project Type**: Single Blazor Server web application
**Performance Goals**: No degradation to page FCP/TTI; conveyor section adds only CSS and markup, zero new JS
**Constraints**: `border-radius ≤ 8px` on tiles (SC-003); no circles; no new JavaScript modules; Blazor CSS isolation (`.razor.css`) for all new styles; About.razor must remain ≤ 300 lines or extract to code-behind (Principle 5)
**Scale/Scope**: Single page modification — `About.razor` + new `About.razor.css`; five hardcoded milestone entries

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design — all pass.*

| Principle | Requirement | Status | Notes |
|---|---|---|---|
| P1 — Blazor-First | All UI in `.razor` files; JS only via approved modules | ✅ Pass | No new JS; uses existing MudBlazor components only |
| P1 — No new JS modules | Only three approved modules permitted | ✅ Pass | No JS changes at all |
| P1 — MudBlazor sole library | MudBlazor is sole component library | ✅ Pass | Only MudBlazor components used in tiles |
| P2 — Performance | FCP ≤ 1.5 s; TTI ≤ 2.0 s | ✅ Pass | Pure markup + CSS; no new network requests |
| P2 — Animation cap | Maze bg ≤ 30 fps; heat sim ≤ 60 fps | ✅ Pass | No animation added; hover transitions only |
| P3 — Single showcase | NACA 0012 is only primary showcase | ✅ Pass | About page is not a showcase page |
| P4 — Authenticity | No placeholder content in production | ✅ Pass | Five real career entries preserved verbatim |
| P5 — Line limit | Standard pages ≤ 300 lines | ⚠️ Monitor | Current About.razor is 274 lines; new timeline section will replace ~80 lines with ~70 lines — stays within limit |
| P5 — No dead code | No commented-out blocks in production | ✅ Pass | Old MudTimeline block fully removed, not commented out |
| P5 — Minimal dependencies | New NuGet requires justification | ✅ Pass | No new packages |
| P5 — Single build command | `dotnet run --project SamElhagPersonalSite.AppHost` | ✅ Pass | Unaffected |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-about-conveyor/
├── plan.md              ← This file
├── research.md          ← Phase 0 complete
├── quickstart.md        ← Phase 1 output
├── checklists/
│   └── requirements.md  ← Spec quality checklist
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
SamElhagPersonalSite/
└── Components/
    └── Pages/
        ├── About.razor          ← Primary file: replace MudTimeline section; add @code record
        └── About.razor.css      ← NEW: scoped CSS for conveyor belt styles (created by this feature)
```

No other files are modified. No new projects, services, or routes.

---

## Phase 0: Research Summary

All design decisions resolved — see [research.md](./research.md) for full rationale.

| Decision | Resolution |
|---|---|
| Layout engine | Custom CSS flexbox — MudTimeline circular dots conflict with spec |
| Rail rendering | CSS `::before` pseudo-element gradient line (3 px, primary blue) |
| Tile corner radius | `border-radius: 8px` — satisfies SC-003 (industrial, not round) |
| Rich UI components | `MudChip` (category) + `MudText` hierarchy + "CURRENT" status chip |
| Responsive | CSS `overflow-x: auto` + `scroll-snap` — no JS required |
| CSS isolation | `About.razor.css` scoped file — no global style changes |
| Data model | Static `private record TimelineMilestone` list in `@code` block |
| Industrial cues | 8 px radius reduction + top-right notch `::after` + left accent stripe |

---

## Phase 1: Design

### Component Architecture

The existing `MudTimeline` block (lines 194–272 of `About.razor`) is fully replaced with:

```
<div class="conveyor-section">            ← outer section wrapper
  <div class="conveyor-wrapper">          ← scroll container (overflow-x: auto)
    <div class="conveyor-track">          ← flexbox row + ::before rail
      @foreach milestone                  ← rendered from C# list
        <div class="conveyor-tile">       ← tile + notch ::after accent
          <MudPaper>                      ← glassmorphism tile surface
            MudChip (category)            ← top-left category badge
            MudChip (CURRENT, conditional)← top-right status (current role only)
            MudText (role)                ← h6, white, bold
            MudDivider (thin)             ← horizontal separator
            MudText (organisation)        ← body2, gradient accent colour
            MudText (date range)          ← caption, muted blue
            MudText (description)         ← body2, 0.8 opacity, flex-grow fills space
          </MudPaper>
          <svg chevron />                 ← directional connector (hidden on last tile)
        </div>
    </div>
  </div>
</div>
```

### Data Model

Defined in `@code` block of `About.razor`:

```csharp
private record TimelineMilestone(
    string Role,
    string Organisation,
    string DateRange,
    string Description,
    bool IsCurrent,
    string Category
);

private readonly List<TimelineMilestone> _milestones = new()
{
    new("Student",
        "West Virginia University",
        "Aug 2015",
        "Started B.S. in Mechanical Engineering.",
        false,
        "Education"),

    new("Application Developer (CO-OP)",
        "Core10",
        "Jul 2017 → Jun 2018",
        "Leveraged OOP design patterns to write clean and maintainable code for client reporting in C#, with a heavy emphasis on API module integration. Utilised Agile methodologies to meet dynamic client requirements.",
        false,
        "CO-OP"),

    new("Application Developer (Contract)",
        "Agile5 Technologies, Inc.",
        "Oct 2018 → Apr 2019",
        "Created and tested clean, maintainable code for client dashboards in Java with a strong emphasis on OOP and API module integration. Team used Agile to meet dynamic client requirements.",
        false,
        "Contract"),

    new("Student",
        "West Virginia University",
        "Jul 2019",
        "Graduated — B.S. in Mechanical Engineering.",
        false,
        "Education"),

    new("Software Engineer / Analyst",
        "Steel Dynamics",
        "Jul 2019 → Present",
        "Leverage OOP design patterns to write clean and maintainable C# code enhancing SDI Flat Roll systems. Heavy emphasis on Entity Framework, Prism (WPF), SQL, WebAPI, IIS, and MVVM.",
        true,
        "Industry"),
};
```

### CSS Scoped Styles (`About.razor.css`)

Key sections:

**1. Track container + rail**
```css
.conveyor-section { position: relative; margin: 4rem 0 2rem; }

.conveyor-wrapper { width: 100%; overflow-x: auto; overflow-y: hidden;
    scroll-behavior: smooth; -webkit-overflow-scrolling: touch;
    padding-bottom: 1rem; /* room for scroll bar */ }

.conveyor-track {
    display: flex; flex-direction: row; align-items: stretch;
    gap: 1.25rem; padding: 3rem 2rem; position: relative;
    min-width: max-content; /* keeps all tiles in one row */
    scroll-snap-type: x mandatory;
}

.conveyor-track::before { /* horizontal rail */
    content: ''; position: absolute; top: 50%; left: 2rem; right: 2rem;
    height: 3px; transform: translateY(-50%); z-index: 0;
    background: linear-gradient(90deg,
        transparent 0%, rgba(91,141,239,0.5) 10%,
        rgba(91,141,239,0.5) 90%, transparent 100%);
}
```

**2. Tile — square, industrial**
```css
.conveyor-tile {
    flex: 0 0 300px; position: relative; z-index: 1;
    scroll-snap-align: start; display: flex; align-items: center;
}

/* Top-right notch accent */
.conveyor-tile::after {
    content: ''; position: absolute; top: 0; right: 0;
    width: 20px; height: 20px;
    border-left: 2px solid rgba(91,141,239,0.35);
    border-bottom: 2px solid rgba(91,141,239,0.35);
    border-radius: 0 8px 0 0; pointer-events: none; z-index: 2;
}
```

**3. Tile paper — glassmorphism, 8 px radius**
```css
.conveyor-tile-paper {
    background: rgba(22,33,62,0.6); backdrop-filter: blur(20px);
    border: 1px solid rgba(91,141,239,0.2); border-radius: 8px;
    border-left: 3px solid rgba(91,141,239,0.4); /* left accent stripe */
    padding: 1.25rem; height: 100%;
    display: flex; flex-direction: column; gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    transition: border-color 0.25s, box-shadow 0.25s;
}
.conveyor-tile-paper.is-current {
    border-left-color: rgba(192,192,192,0.6);
    box-shadow: 0 4px 30px rgba(192,192,192,0.12);
}
.conveyor-tile-paper:hover {
    border-color: rgba(91,141,239,0.45);
    box-shadow: 0 8px 36px rgba(91,141,239,0.2);
}
```

**4. Chevron connector**
```css
.conveyor-connector {
    flex: 0 0 auto; width: 2rem; display: flex;
    align-items: center; justify-content: center; z-index: 1;
}
.conveyor-chevron { width: 20px; height: 20px;
    stroke: rgba(91,141,239,0.45); stroke-width: 2.5;
    fill: none; stroke-linecap: round; stroke-linejoin: round;
    transition: stroke 0.25s;
}
.conveyor-tile:hover + .conveyor-connector .conveyor-chevron,
.conveyor-connector:hover .conveyor-chevron {
    stroke: rgba(91,141,239,0.9);
}
```

**5. Responsive**
```css
@media (max-width: 960px) {
    .conveyor-tile { flex: 0 0 280px; }
}
@media (max-width: 600px) {
    .conveyor-tile { flex: 0 0 240px; }
    .conveyor-track::before { height: 2px; }
}
@media (prefers-reduced-motion: reduce) {
    .conveyor-tile-paper, .conveyor-chevron { transition: none !important; }
}
```

### Constitution Re-check (Post-Design)

All principles still pass. About.razor estimated final line count: ~260 lines (within 300-line limit).

---

## Implementation Decisions

| # | Decision | Choice | Rationale |
|---|---|---|---|
| D1 | Layout engine | Custom CSS flexbox | MudTimeline circles violate FR-002 |
| D2 | Rail | CSS `::before` pseudo-element | Zero DOM overhead |
| D3 | Directional cue | Inline SVG chevrons | Crisp on dark background; no JS |
| D4 | Tile corner radius | 8 px | SC-003 industrial geometry cap |
| D5 | Rich elements | MudChip + MudText hierarchy | MudBlazor-native; no extra deps |
| D6 | Responsive | CSS scroll-snap | No JS required; iOS momentum scroll |
| D7 | CSS isolation | `About.razor.css` | Scoped; no global style pollution |
| D8 | Data model | Static `record` list in `@code` | Principle 4 — content in `.razor` files; `@foreach` means adding a future entry requires only one new list item |
