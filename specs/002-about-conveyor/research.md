# Research: About Page — Conveyor Belt Timeline

**Branch**: `002-about-conveyor`
**Date**: 2026-02-20
**Purpose**: Resolve all design decisions before Phase 1 implementation planning

---

## Decision 1: Timeline Rendering Strategy — MudTimeline vs Custom Layout

**Decision**: Use a **custom CSS flexbox layout** (not `MudTimeline`) for the conveyor belt.

**Rationale**: `MudTimeline` with `TimelineOrientation.Horizontal` is supported in MudBlazor 8.x,
but it produces circular dot connectors on a centre line — the exact aesthetic the spec explicitly
prohibits (no circles). Overriding the MudTimeline CSS deeply enough to produce square tiles with
an industrial rail requires more `::deep` overrides than simply building a flexbox row of `MudPaper`
tiles with a `::before` pseudo-element rail. The custom flexbox approach:
- Uses MudBlazor's `MudPaper`, `MudChip`, `MudText`, `MudIcon` components inside each tile
- Uses native CSS for the horizontal track/connector (no circles anywhere in the DOM)
- Gives precise control over border-radius (≤ 8 px per SC-003) and the industrial aesthetic
- Avoids deep CSS overrides that could break on MudBlazor version updates

**Alternatives considered**:
- `MudTimeline` (Horizontal) — rejected because its dot connectors are circular by design; requires extensive `::deep` CSS to remove them
- `MudStepper` (Horizontal) — rejected because it is semantically a form wizard, not a content timeline
- `MudCarousel` — rejected because it hides items; all five tiles must be scannable without interaction

---

## Decision 2: Horizontal Rail Visual

**Decision**: CSS `::before` pseudo-element on the track container — a 3 px horizontal gradient
line running the full width of the tile row, centred vertically on the tile connector zone.

**Rationale**: A pseudo-element rail requires zero extra DOM nodes, has no runtime cost, and is
fully compatible with the existing glassmorphism palette (`rgba(91, 141, 239, …)`). The gradient
fades at both ends to avoid a harsh cut.

**Rail spec**:
```css
.conveyor-track::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg,
        transparent 0%,
        rgba(91, 141, 239, 0.5) 15%,
        rgba(91, 141, 239, 0.5) 85%,
        transparent 100%
    );
    transform: translateY(-50%);
    z-index: 0;
}
```

**Directionality**: Each tile (except the last) gets a right-facing SVG chevron connector
positioned between it and the next tile. This satisfies FR-004 without animation.

---

## Decision 3: Tile Shape & Corner Radius

**Decision**: `border-radius: 8px` on all `MudPaper` tiles.

**Rationale**: SC-003 explicitly caps corner rounding at 8 px to maintain sharp, industrial
geometry. The existing skills cards use 16 px; the timeline tiles will use 8 px — a visible
reduction that signals the deliberate industrial theme shift in that section.

**Prohibited**: Any `border-radius` value above 8 px on the tile containers.
**Prohibited**: `border-radius: 50%` or any circular `MudAvatar` / dot connectors.

---

## Decision 4: Rich UI Elements Per Tile

**Decision**: Each tile uses the following MudBlazor components:
1. `MudText` — role title (h6, bold, white)
2. `MudText` — organisation name (body2, gradient accent colour)
3. `MudText` — date range (caption, monospace-style, muted blue)
4. `MudText` — description (body2, 0.8 opacity white)
5. `MudChip` — category badge ("Education" / "Industry" / "Contract") from `MudChipSet`
6. **Current-only**: a "CURRENT" chip with `Color.Success` and a distinct border colour

This satisfies FR-005 (minimum content) and FR-006 (at least one rich UI element) for
all five tiles.

**Category assignments**:
| Entry | Category chip | IsCurrent |
|---|---|---|
| WVU (Aug 2015, start) | Education | false |
| Core10 CO-OP | CO-OP | false |
| Agile5 (Contract) | Contract | false |
| WVU (Jul 2019, graduate) | Education | false |
| Steel Dynamics | Industry | true |

---

## Decision 5: Horizontal Scroll & Responsive Behaviour

**Decision**: Two-tier responsive strategy:
- **≥ 960 px (desktop)**: All five tiles visible in a single row; the container uses
  `overflow-x: auto` + `scroll-snap-type: x mandatory` as a fallback if tiles overflow.
  On a 1080 p monitor (common portfolio viewer) the five tiles fit without scrolling.
- **< 960 px (tablet/mobile)**: Container switches to `overflow-x: auto` with
  `scroll-snap-align: center` on each tile, creating a swipeable horizontal strip.
  A subtle "→" indicator pulses at the right edge on narrower viewports.
- **< 600 px**: Tiles narrow to 240 px min-width to remain readable on phone screens.

This satisfies FR-009 and SC-005 without any JS — pure CSS media queries.

---

## Decision 6: CSS Isolation Strategy

**Decision**: Scoped styles in a co-located `About.razor.css` file (Blazor CSS isolation).

**Rationale**: The timeline section needs custom CSS that must not bleed into the rest of
the page. Blazor's built-in CSS isolation (`.razor.css` files) generates a unique scope
attribute automatically. The few `MudBlazor` internal classes that need targeting use
`::deep` inside scoped selectors. This is the established pattern in this codebase
(no global stylesheet changes needed).

---

## Decision 7: Data Model — Static C# List vs Inline Razor

**Decision**: Define milestones as a `private record` + `List<TimelineMilestone>` in the
`@code` block of `About.razor`.

**Rationale**: There is no database or CMS. Milestone entries are static content embedded
in the Razor component, consistent with Principle 4 (all content is code-managed in
`.razor` files, per Non-Goals §4). A typed record makes each milestone's fields explicit
and testable. Crucially, the `@foreach` loop over the list means adding a new milestone
in the future requires only appending one `new(...)` line to the list — no layout, CSS,
or markup changes needed. The tile count is never hardcoded.

**Record shape**:
```csharp
private record TimelineMilestone(
    string Role,
    string Organisation,
    string DateRange,
    string Description,
    bool IsCurrent,
    string Category
);
```

---

## Decision 8: Industrial Aesthetic Details

**Decision**: Three visual cues applied in CSS to communicate "manufacturing":

1. **Square tile geometry** — `border-radius: 8px` (vs 16–24 px elsewhere on the page)
2. **Top-right notch accent** — a small `::after` element in the top-right corner of each
   tile using two border sides to form an L-shaped angular accent
3. **Left accent stripe** — a 3 px left border with a vertical gradient on each tile
   (top: primary blue, bottom: transparent) providing a machined-edge appearance

These cues are CSS-only, require no extra DOM nodes beyond one `::after` pseudo-element,
and do not conflict with MudBlazor's design system.

---

## Summary — All Unknowns Resolved

| Unknown | Resolution |
|---|---|
| MudTimeline vs custom layout | Custom flexbox — MudTimeline circles conflict with spec |
| Rail rendering technique | CSS `::before` pseudo-element gradient line |
| Corner radius cap | 8 px — satisfies SC-003 |
| Rich UI components | MudChip (category) + MudText hierarchy + current chip |
| Responsive strategy | CSS-only overflow-x + scroll-snap; stacks to 240 px on mobile |
| CSS isolation | Blazor `About.razor.css` scoped file |
| Data model | Static `record` list in `@code` block |
| Industrial aesthetic | Border-radius reduction + notch accent + left stripe |
