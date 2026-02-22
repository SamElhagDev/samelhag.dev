# Research: About Page – "Path So Far" Timeline Redesign

**Feature**: `003-about-timeline-cleanup`
**Date**: 2026-02-22

---

## Decision 1 — Layout Pattern: Left-Aligned Vertical Timeline

**Decision**: Full-width left-aligned vertical timeline. A vertical rail runs down the left side; milestone cards occupy the right with consistent left-padding to clear the rail and dot nodes.

**Rationale**: This is the dominant pattern on contemporary developer portfolios (GitHub profiles, personal sites, LinkedIn mobile view). It is inherently single-column and therefore perfectly responsive without needing a layout shift at any breakpoint. Centre-split alternating (LinkedIn desktop) was considered but rejected — it requires more horizontal space, breaks on mobile without a layout change, and is more complex to implement cleanly in Blazor's flex model.

**Alternatives Considered**:
- Centre-split alternating (LinkedIn style) — rejected: mobile layout change required, more Razor complexity.
- Horizontal conveyor (current) — being replaced: horizontal scroll is unfamiliar on desktop, broken on mobile.

---

## Decision 2 — Vertical Rail Implementation: `::before` on Track Container

**Decision**: Draw the vertical rail using a `::before` pseudo-element on the `.timeline-track` container. Set explicit `top` and `bottom` values (e.g., `top: 1.5rem; bottom: 1.5rem`) so the line does not overshoot the first or last dot node.

**Rationale**: A single pseudo-element on the container is the most efficient approach — one render, no extra HTML, easily controlled. Using `border-left` on each `timeline-item` was evaluated but rejected: it produces multiple separate border segments, can't be styled with a gradient across the full height, and requires `border-left: transparent` on the last child to prevent overshoot (fragile).

**CSS Pattern**:
```css
.timeline-track {
    position: relative;
    padding-left: 3.5rem;  /* clearance for line + dot */
}

.timeline-track::before {
    content: '';
    position: absolute;
    left: 1.1rem;          /* centres on the 24px dot (12px radius + ~6px left offset) */
    top: 1.5rem;
    bottom: 1.5rem;
    width: 2px;
    background: linear-gradient(180deg,
        rgba(91, 141, 239, 0.5) 0%,
        rgba(91, 141, 239, 0.2) 100%
    );
    pointer-events: none;
}
```

**Blazor CSS Isolation Note**: Blazor's scoped CSS correctly places the `[b-xxxxxx]` attribute on the host element (`.timeline-track`), not on `::before` itself. Pseudo-elements on scoped elements work as expected with no `::deep` required. Verified by checking compiled output in `obj/Debug/scopedcss/` — the generated selector is `.timeline-track[b-xxxxx]::before`, which is valid.

**Alternatives Considered**:
- `border-left` on each `.timeline-item` — rejected: multiple renders, no gradient, fragile `:last-child` fix.
- SVG line — overkill, no benefit over CSS for a straight line.

---

## Decision 3 — Milestone Dot Nodes: `::before` on Each Item

**Decision**: Each `.timeline-item` gets a circular dot via its `::before` pseudo-element. The dot is absolutely positioned on the left edge, overlapping the vertical rail. It is coloured by category using CSS custom properties (`--cat-r`, `--cat-g`, `--cat-b`) — the same pattern used on this site elsewhere.

**Rationale**: No extra HTML markup needed; the dot sits on top of the rail line (higher z-index); category colour is applied via CSS custom properties set on the `.cat-*` class on the tile, cascading into the pseudo-element colour.

**CSS Pattern**:
```css
.timeline-item {
    position: relative;
}

.timeline-item::before {
    content: '';
    position: absolute;
    left: -2.4rem;         /* pull left to overlap the rail */
    top: 1.25rem;          /* vertically aligns with the role title row */
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(var(--cat-r, 91), var(--cat-g, 141), var(--cat-b, 239), 1.0);
    border: 2px solid rgba(22, 33, 62, 0.9);   /* cuts through the rail visually */
    box-shadow: 0 0 8px rgba(var(--cat-r, 91), var(--cat-g, 141), var(--cat-b, 239), 0.5);
    z-index: 2;
}
```

**Alternatives Considered**:
- Inline `<div>` dot element in Razor — rejected: extra markup, no cleaner than pseudo-element.
- SVG dots — overkill for a simple circle.

---

## Decision 4 — Category Colour System: Same CSS Custom Property Pattern

**Decision**: Reuse the `--cat-r/g/b` CSS custom property pattern already established for this project. Each `.cat-*` class sets the three RGB channels; all rgba() uses in the CSS reference `var(--cat-r)` etc. This keeps the colour system consistent with the rest of the site.

**Category Palette** (chosen for distinctiveness on dark navy, matches site palette):

| Category | Class | Colour | R / G / B |
|----------|-------|--------|-----------|
| Education | `.cat-education` | Cyan `#6FC9D7` | 111 / 201 / 215 |
| CO-OP | `.cat-coop` | Blue `#5B8DEF` | 91 / 141 / 239 |
| Contract | `.cat-contract` | Purple `#9C27B0` | 156 / 39 / 176 |
| Industry | `.cat-industry` | Steel Blue `#5B8DEF` (same as CO-OP but brighter in current state) | 91 / 141 / 239 |
| Unknown | `.cat-unknown` | Grey `#787878` | 120 / 120 / 120 |

Note: CO-OP and Industry share the same blue family. Contract gets purple to clearly separate the contract engagement from both education and employed roles.

**Rationale**: Reusing the existing pattern means zero new concepts to learn, consistent with all other About page typography, and easy to add new categories later.

---

## Decision 5 — Current Role Highlight: Pulsing Dot + Stronger Card Accent

**Decision**: The current-role milestone node (`::before` dot) gets a `@keyframes glow-pulse` animation on its `box-shadow`, making it visually throb. The card itself gets a brighter left border and the existing "CURRENT" MudChip badge (already in the Razor markup).

**Rationale**: Pulsing `box-shadow` on a 14px dot is GPU-composited (no layout recalculations) and matches the glassmorphism aesthetic. The badge in the chip already provides an explicit text label, so the animation is purely an attentional aid, not the only differentiator.

**CSS Pattern**:
```css
@keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 8px  rgba(var(--cat-r,91), var(--cat-g,141), var(--cat-b,239), 0.5); }
    50%       { box-shadow: 0 0 20px rgba(var(--cat-r,91), var(--cat-g,141), var(--cat-b,239), 0.9); }
}

.timeline-item.is-current::before {
    animation: glow-pulse 2s ease-in-out infinite;
    width: 18px;
    height: 18px;
}
```

**`prefers-reduced-motion`**: Animation is disabled entirely for users who prefer it.

---

## Decision 6 — Card Layout: Full-Width with Left Accent Border + Glass Morphism

**Decision**: Each card spans the full available width of the right column. The existing `MudPaper` glass-morphism style (dark translucent background, blue accent left border) is preserved. Cards grow to fit their content — no fixed heights, no text truncation (FR-002 requires full legibility).

**Rationale**: The vertical layout eliminates the fixed-width constraint of the old 300px tiles. Cards can now be full-width, making descriptions fully readable. Uniform card height is no longer needed — vertical stacking means varying heights look natural (unlike tiles in a row, which looked uneven when heights differed).

---

## Decision 7 — Responsive Strategy: Inherently Responsive

**Decision**: The vertical left-aligned layout is naturally single-column at all widths. No breakpoint-driven layout changes are needed for the timeline structure itself. The only responsive concern is padding/margin adjustments for small screens (reducing the `padding-left` on `.timeline-track` from `3.5rem` to `2.5rem` on mobile so the rail/dots don't eat into the card content area).

**Rationale**: This is the primary advantage of vertical over horizontal — no layout paradigm shift across breakpoints.

---

## Razor Structure Decision: Keep Existing `@for` Loop, Add CSS Classes

**Decision**: Keep the existing `@for` loop in `About.razor` — it already iterates `_milestones` and renders a `div.conveyor-tile` per entry. Rename CSS classes to `timeline-*` and add category class via `GetCategoryClass()` (already in `About.razor.cs`). Remove the connector divs (chevrons are replaced by the vertical rail). Remove the conveyor-wrapper scroll container div.

**Rationale**: Minimal Razor changes reduce risk of introducing Blazor compilation errors. The loop structure is already correct. The `.conveyor-*` CSS class namespace can be replaced with `.timeline-*` to clarify intent.

**No data model changes**: `TimelineMilestone` record in `About.razor.cs` remains untouched. `GetCategoryClass()` switch expression reused as-is.
