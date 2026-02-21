# Tasks: About Page — Conveyor Belt Timeline

**Input**: Design documents from `/specs/002-about-conveyor/`
**Branch**: `002-about-conveyor`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in all task descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the new CSS file and data model — both are shared by all three user stories and must exist before any story work begins.

- [x] T001 Create `SamElhagPersonalSite/Components/Pages/About.razor.css` (empty file — Blazor CSS isolation for the conveyor belt section)
- [x] T002 Add the `TimelineMilestone` private record and `_milestones` list to the `@code` block of `SamElhagPersonalSite/Components/Pages/About.razor`

**T002 details — exact record and list to add in `@code`**:
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

**Checkpoint**: CSS file exists; data model compiles. No visual changes yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Replace the existing `MudTimeline` markup with the conveyor belt skeleton — the container divs and `@foreach` loop. This is the structural foundation that all three user stories render into.

- [x] T003 In `SamElhagPersonalSite/Components/Pages/About.razor`, delete the entire `<MudTimeline>…</MudTimeline>` block (lines 194–272) and replace it with the conveyor belt container structure and `@foreach` loop rendering a `<div class="conveyor-tile">` per milestone

**T003 replacement markup**:
```razor
<div class="conveyor-section">
    <div class="conveyor-wrapper">
        <div class="conveyor-track">
            @for (int idx = 0; idx < _milestones.Count; idx++)
            {
                var milestone = _milestones[idx];
                var isLast = idx == _milestones.Count - 1;

                <div class="conveyor-tile">
                    <MudPaper Elevation="0"
                              Class="@($"conveyor-tile-paper{(milestone.IsCurrent ? " is-current" : "")}")"
                              Style="background: rgba(22, 33, 62, 0.6); backdrop-filter: blur(20px);">

                        @* Top row: category chip + optional Current chip *@
                        <MudStack Row="true" Justify="Justify.SpaceBetween" AlignItems="AlignItems.Center" Class="mb-2">
                            <MudChip T="string" Size="Size.Small" Variant="Variant.Outlined"
                                     Class="conveyor-chip-category">
                                @milestone.Category
                            </MudChip>
                            @if (milestone.IsCurrent)
                            {
                                <MudChip T="string" Size="Size.Small" Color="Color.Success"
                                         Variant="Variant.Filled" Class="conveyor-chip-current">
                                    CURRENT
                                </MudChip>
                            }
                        </MudStack>

                        @* Role title *@
                        <MudText Typo="Typo.h6" Class="conveyor-tile-title">
                            @milestone.Role
                        </MudText>

                        <MudDivider Class="conveyor-tile-divider" />

                        @* Organisation *@
                        <MudText Typo="Typo.body2" Class="conveyor-tile-org">
                            @milestone.Organisation
                        </MudText>

                        @* Date range *@
                        <MudText Typo="Typo.caption" Class="conveyor-tile-date">
                            @milestone.DateRange
                        </MudText>

                        @* Description — grows to fill remaining height *@
                        <MudText Typo="Typo.body2" Class="conveyor-tile-description">
                            @milestone.Description
                        </MudText>

                    </MudPaper>
                </div>

                @* Chevron connector — rendered between tiles, not after the last *@
                @if (!isLast)
                {
                    <div class="conveyor-connector">
                        <svg class="conveyor-chevron" viewBox="0 0 24 24"
                             fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                }
            }
        </div>
    </div>
</div>
```

**Checkpoint**: Page renders five tiles in a row (unstyled). No CSS yet — tiles may overlap or wrap oddly. That is expected at this point.

---

## Phase 3: User Story 1 — Horizontal Conveyor Belt Layout (Priority: P1) ⭐ MVP

**Goal**: Deliver the left-to-right horizontal layout with the CSS rail, square tiles, and chevron connectors. This is the core visual deliverable.

**Independent Test**: Navigate to `/about`, scroll to "The Path So Far", and confirm five square-cornered tiles run left-to-right with a horizontal rail and right-facing chevrons between them.

- [x] T004 [US1] Add track container + rail CSS to `SamElhagPersonalSite/Components/Pages/About.razor.css`

**T004 CSS to add**:
```css
/* ── Conveyor section wrapper ─────────────────────────────────────────── */
.conveyor-section {
    position: relative;
    margin: 3rem 0 2rem;
}

/* ── Scroll container ─────────────────────────────────────────────────── */
.conveyor-wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 1rem;
}

/* ── Tile row + rail pseudo-element ───────────────────────────────────── */
.conveyor-track {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0;                        /* gap handled by connector divs */
    padding: 3rem 2rem;
    position: relative;
    min-width: max-content;
    scroll-snap-type: x mandatory;
}

.conveyor-track::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 2rem;
    right: 2rem;
    height: 3px;
    transform: translateY(-50%);
    z-index: 0;
    background: linear-gradient(90deg,
        transparent 0%,
        rgba(91, 141, 239, 0.5) 10%,
        rgba(91, 141, 239, 0.5) 90%,
        transparent 100%
    );
    pointer-events: none;
}
```

- [x] T005 [US1] Add tile + notch accent CSS to `SamElhagPersonalSite/Components/Pages/About.razor.css`

**T005 CSS to add**:
```css
/* ── Individual tile ──────────────────────────────────────────────────── */
.conveyor-tile {
    flex: 0 0 300px;
    position: relative;
    z-index: 1;
    scroll-snap-align: start;
    display: flex;
    align-items: stretch;
}

/* Top-right industrial notch accent */
.conveyor-tile::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    border-left: 2px solid rgba(91, 141, 239, 0.35);
    border-bottom: 2px solid rgba(91, 141, 239, 0.35);
    border-radius: 0 8px 0 0;
    pointer-events: none;
    z-index: 2;
}
```

- [x] T006 [US1] Add tile paper (glassmorphism, 8 px radius, left accent stripe) CSS to `SamElhagPersonalSite/Components/Pages/About.razor.css`

**T006 CSS to add**:
```css
/* ── Tile surface ─────────────────────────────────────────────────────── */
.conveyor-tile-paper {
    border: 1px solid rgba(91, 141, 239, 0.2) !important;
    border-radius: 8px !important;       /* SC-003: ≤ 8px — industrial geometry */
    border-left: 3px solid rgba(91, 141, 239, 0.4) !important;
    padding: 1.25rem !important;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.conveyor-tile-paper.is-current {
    border-left-color: rgba(192, 192, 192, 0.65) !important;
    box-shadow: 0 4px 30px rgba(192, 192, 192, 0.12) !important;
}

.conveyor-tile-paper:hover {
    border-color: rgba(91, 141, 239, 0.45) !important;
    box-shadow: 0 8px 36px rgba(91, 141, 239, 0.2) !important;
}
```

- [x] T007 [US1] Add chevron connector CSS to `SamElhagPersonalSite/Components/Pages/About.razor.css`

**T007 CSS to add**:
```css
/* ── Chevron connector (between tiles) ────────────────────────────────── */
.conveyor-connector {
    flex: 0 0 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    position: relative;
}

.conveyor-chevron {
    width: 20px;
    height: 20px;
    stroke: rgba(91, 141, 239, 0.45);
    stroke-width: 2.5;
    transition: stroke 0.25s ease;
}

.conveyor-tile:hover ~ .conveyor-connector .conveyor-chevron,
.conveyor-connector:hover .conveyor-chevron {
    stroke: rgba(91, 141, 239, 0.9);
}
```

**Checkpoint**: Navigate to `/about` — five square-cornered tiles run horizontally with a gradient rail and chevron connectors. US1 is independently testable.

---

## Phase 4: User Story 2 — Milestone Tile Content & Rich UI Elements (Priority: P2)

**Goal**: Style the content inside each tile — role title, org name, date, description, and MudBlazor chips — so that each tile is information-dense with clear visual hierarchy.

**Independent Test**: Read a single tile and confirm it shows role, org, date, description, and a category chip with clear typographic hierarchy. No interaction required.

- [x] T008 [P] [US2] Add tile content typography CSS (title, divider, org, date, description) to `SamElhagPersonalSite/Components/Pages/About.razor.css`

**T008 CSS to add**:
```css
/* ── Tile content typography ──────────────────────────────────────────── */
.conveyor-tile-title {
    color: white !important;
    font-weight: 700 !important;
    line-height: 1.3;
    font-size: 1rem !important;
}

.conveyor-tile-divider {
    margin: 0.35rem 0 !important;
    border-color: rgba(91, 141, 239, 0.15) !important;
}

.conveyor-tile-org {
    background: linear-gradient(135deg, #7CB8FF 0%, #5B8DEF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
}

.conveyor-tile-date {
    color: rgba(91, 141, 239, 0.75) !important;
    font-size: 0.78rem !important;
    letter-spacing: 0.02em;
}

.conveyor-tile-description {
    color: rgba(255, 255, 255, 0.8) !important;
    font-size: 0.85rem !important;
    line-height: 1.6;
    flex-grow: 1;           /* fills remaining tile height */
    margin-top: 0.25rem;
}
```

- [x] T009 [P] [US2] Add chip styling CSS to `SamElhagPersonalSite/Components/Pages/About.razor.css`

**T009 CSS to add**:
```css
/* ── Chips ────────────────────────────────────────────────────────────── */
.conveyor-chip-category {
    background: rgba(91, 141, 239, 0.12) !important;
    color: rgba(124, 184, 255, 0.9) !important;
    border-color: rgba(91, 141, 239, 0.3) !important;
    font-size: 0.7rem !important;
    height: 22px !important;
}

.conveyor-chip-current {
    font-size: 0.7rem !important;
    height: 22px !important;
    font-weight: 700 !important;
    letter-spacing: 0.04em;
}
```

**Checkpoint**: Each tile shows polished content with clear hierarchy. Category and Current chips are legible. US2 is independently testable alongside US1.

---

## Phase 5: User Story 3 — Responsive Behaviour (Priority: P3)

**Goal**: Ensure all five milestones are accessible on tablet (≤ 960 px) and mobile (≤ 600 px) viewports via horizontal scroll, with no content clipped.

**Independent Test**: Set DevTools to 768 px width — scroll horizontally within the section and confirm all five tiles are reachable without any tile being clipped by the viewport.

- [x] T010 [US3] Add responsive media queries to `SamElhagPersonalSite/Components/Pages/About.razor.css`

**T010 CSS to add**:
```css
/* ── Responsive ───────────────────────────────────────────────────────── */

/* Tablet (≤ 960px): tiles slightly narrower, horizontal scroll retained */
@media (max-width: 960px) {
    .conveyor-tile {
        flex: 0 0 280px;
    }
}

/* Mobile (≤ 600px): narrower tiles, thinner rail */
@media (max-width: 600px) {
    .conveyor-tile {
        flex: 0 0 240px;
    }

    .conveyor-track::before {
        height: 2px;
    }

    .conveyor-track {
        padding: 2rem 1rem;
    }
}

/* Reduced motion: disable transitions and scroll smoothing */
@media (prefers-reduced-motion: reduce) {
    .conveyor-tile-paper,
    .conveyor-chevron {
        transition: none !important;
    }

    .conveyor-wrapper {
        scroll-behavior: auto;
    }
}
```

**Checkpoint**: Test at 768 px and 375 px. All five tiles scrollable. US3 complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency pass, dead-code removal, and quickstart verification.

- [x] T011 [P] Remove the now-unused `@using MudBlazor` duplicate (if introduced) and verify `About.razor` has no commented-out `MudTimeline` blocks — `SamElhagPersonalSite/Components/Pages/About.razor`
- [x] T012 [P] Verify `About.razor` line count stays at or below 300 (Principle 5) — 261 lines; code-behind extracted to `About.razor.cs`
- [ ] T013 Run through every check in `specs/002-about-conveyor/quickstart.md` — desktop, tablet (768 px), mobile (375 px), DevTools console — and confirm all pass
- [ ] T014 Run `dotnet run --project SamElhagPersonalSite.AppHost` and confirm no build errors, no Blazor circuit errors, and no CSS 404s in the browser network tab

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately; T001 and T002 are [P] parallelizable
- **Phase 2 (Foundational)**: Depends on T001 and T002; T003 must complete before any story work
- **Phase 3 (US1)**: Depends on T003; T004–T007 are purely CSS additions — all four can run in parallel
- **Phase 4 (US2)**: Depends on T003; T008 and T009 are independent CSS files — both [P]
- **Phase 5 (US3)**: Depends on T003; T010 is a single CSS block addition
- **Phase 6 (Polish)**: Depends on all story phases being complete

### User Story Dependencies

- **US1 (P1)**: Requires T001 + T002 + T003 — no dependency on US2 or US3
- **US2 (P2)**: Requires T001 + T002 + T003 — no dependency on US1 (CSS-only, different classes)
- **US3 (P3)**: Requires T001 + T002 + T003 — no dependency on US1 or US2

US1, US2, and US3 can all be worked in parallel once Phase 2 is complete.

### Within Each Phase

- Phase 1: T001 and T002 are both independent of each other [P]
- Phase 3: T004, T005, T006, T007 all target `About.razor.css` — write sequentially as they are additions to the same file
- Phase 4: T008 and T009 both target `About.razor.css` — write sequentially

---

## Parallel Example: Phase 3 (US1)

All four US1 CSS tasks write to the same file, so they are done sequentially. However, the US1 CSS tasks can be worked at the same time as the US2 CSS tasks if working across two editors/sessions since they target distinct CSS class names:

```
Parallel track A (US1): T004 → T005 → T006 → T007
Parallel track B (US2): T008 → T009
```

Both tracks write to `About.razor.css` — merge cleanly since class names do not overlap.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001, T002)
2. Complete Phase 2 (T003)
3. Complete Phase 3 (T004–T007)
4. **STOP and VALIDATE**: Navigate to `/about`, confirm horizontal layout, square tiles, rail, and chevrons
5. Proceed to Phase 4 if US1 passes

### Incremental Delivery

1. T001 + T002 → data model ready
2. T003 → structure renders (unstyled)
3. T004–T007 → US1 complete (conveyor visual) ← demo-able
4. T008–T009 → US2 complete (rich tile content) ← demo-able
5. T010 → US3 complete (responsive) ← demo-able
6. T011–T014 → polish + final verification ← ship-ready

### Total Task Count

| Phase | Tasks | Notes |
|---|---|---|
| Phase 1 — Setup | T001, T002 | Both parallelizable |
| Phase 2 — Foundational | T003 | Blocks all stories |
| Phase 3 — US1 | T004–T007 | 4 CSS additions |
| Phase 4 — US2 | T008–T009 | 2 CSS additions |
| Phase 5 — US3 | T010 | 1 CSS block |
| Phase 6 — Polish | T011–T014 | Verification + cleanup |
| **Total** | **14 tasks** | |

---

## Notes

- All CSS lives in `About.razor.css` — Blazor scopes it automatically via the component attribute selector
- `!important` overrides are required on some properties to win against MudBlazor's own `!important` declarations on `MudPaper` and `MudChip`
- Adding a future milestone requires only one new `new(...)` line in the `_milestones` list — no markup, CSS, or layout changes needed
- The `border-radius: 8px !important` on `.conveyor-tile-paper` is the enforcement point for SC-003 (≤ 8 px, no circles)
- If `About.razor` exceeds 300 lines after T003, extract the `@code` block to `About.razor.cs`
