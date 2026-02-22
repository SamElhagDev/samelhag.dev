# Tasks: About Page – "Path So Far" Timeline Redesign

**Input**: Design documents from `/specs/003-about-timeline-cleanup/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: No automated tests requested — visual verification via `quickstart.md`.

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in every description

---

## Phase 1: Setup (Read Current State)

**Purpose**: Read and understand all files that will be modified before touching anything. These tasks are read-only and must complete before any edits begin.

- [ ] T001 Read current `SamElhagPersonalSite/Components/Pages/About.razor` in full to understand existing Razor structure, class names, and loop logic
- [ ] T002 [P] Read current `SamElhagPersonalSite/Components/Pages/About.razor.css` in full to capture all existing rule names and patterns before rewriting
- [ ] T003 [P] Read current `SamElhagPersonalSite/Components/Pages/About.razor.cs` to confirm `GetCategoryClass()` switch and `_milestones` list — verify no changes needed

**Checkpoint**: All three source files fully read and understood. Implementation can begin.

---

## Phase 2: Foundational (Blocking Prerequisite — CSS Category Palette)

**Purpose**: Establish the category colour palette in CSS before any other CSS or Razor work, since all subsequent rules depend on the `--cat-r/g/b` custom properties being defined.

**⚠️ CRITICAL**: Phase 3–5 CSS work requires this to be in place first.

- [ ] T004 In `SamElhagPersonalSite/Components/Pages/About.razor.css`, replace the entire file content with the new timeline CSS foundation: section comment header, and the 5 category colour palette classes (`.cat-education` cyan 111/201/215, `.cat-coop` blue 91/141/239, `.cat-contract` purple 156/39/176, `.cat-industry` steel-blue 91/141/239, `.cat-unknown` grey 120/120/120) using `--cat-r/g/b` custom properties — identical pattern to what existed before

**Checkpoint**: CSS file has category palette only. Build should still pass (old classes gone, but Razor still references them — that is expected at this stage; build will be verified at end).

---

## Phase 3: User Story 1 – Readable Vertical Timeline (Priority: P1) 🎯 MVP

**Goal**: Replace the horizontal conveyor with a vertical left-aligned timeline. All milestones stack top-to-bottom, connected by a left rail. No horizontal scroll at any viewport width.

**Independent Test**: Navigate to `/about`, scroll to "The Path So Far" — confirm all 5 milestones appear vertically stacked with a visible left rail and dot nodes, with no horizontal scrollbar. Full description text visible on each card.

### Implementation for User Story 1

- [ ] T005 [US1] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append the timeline section wrapper and track rules: `.timeline-section` (margin 3rem 0 2rem), `.timeline-wrapper` (width 100%, padding-bottom 1rem), `.timeline-track` (display flex, flex-direction column, align-items stretch, gap 0, position relative, padding 1rem 0 1rem 3.5rem), and `.timeline-track::before` (vertical rail: position absolute, left 1.1rem, top 1.5rem, bottom 1.5rem, width 2px, linear-gradient 180deg from rgba(var(--cat-r,91),var(--cat-g,141),var(--cat-b,239),0.5) to 0.2, pointer-events none, z-index 0)

- [ ] T006 [US1] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append the `.timeline-item` rules: position relative, padding-bottom 2rem; `.timeline-item:last-child` padding-bottom 0; `.timeline-item::before` (dot node: content '', position absolute, left -2.4rem, top 1.25rem, width 14px, height 14px, border-radius 50%, background rgba(var(--cat-r),...,1.0), border 2px solid rgba(22,33,62,0.9), box-shadow 0 0 8px rgba(var(--cat-r),...,0.5), z-index 2)

- [ ] T007 [US1] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append the `.timeline-card` glass-morphism card rules: width 100%, display flex, flex-direction column, gap 0.4rem, border 1px solid rgba(var(--cat-r),...,0.2) !important, border-radius 12px !important, border-left 3px solid rgba(var(--cat-r),...,0.7) !important, padding 1.25rem !important, background rgba(22,33,62,0.6), backdrop-filter blur(20px), box-shadow 0 4px 24px rgba(var(--cat-r),...,0.12) !important, transition border-color 0.25s ease, box-shadow 0.25s ease

- [ ] T008 [US1] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append `.timeline-card:hover` rule (border-color rgba(var(--cat-r),...,0.45) !important, box-shadow 0 8px 40px rgba(var(--cat-r),...,0.3) !important)

- [ ] T009 [US1] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append typography rules: `.timeline-title` (color white, font-weight 700, line-height 1.3, font-size 1rem), `.timeline-divider` (margin 0.35rem 0, border-color rgba(var(--cat-r),...,0.2)), `.timeline-org` (gradient text #7CB8FF→#5B8DEF, background-clip text, -webkit-text-fill-color transparent, font-weight 600, font-size 0.9rem), `.timeline-date` (color rgba(var(--cat-r),...,0.75), font-size 0.78rem, letter-spacing 0.02em), `.timeline-description` (color rgba(255,255,255,0.8), font-size 0.85rem, line-height 1.6, flex-grow 1, margin-top 0.25rem)

- [ ] T010 [US1] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append chip rules: `.timeline-chip-category` (background rgba(var(--cat-r),...,0.15) !important, color rgba(var(--cat-r),...,1.0) !important, border-color rgba(var(--cat-r),...,0.4) !important, font-size 0.7rem, height 22px, font-weight 600), `.timeline-chip-current` (font-size 0.7rem, height 22px, font-weight 700, letter-spacing 0.04em)

- [ ] T011 [US1] Rewrite the "Path So Far" section in `SamElhagPersonalSite/Components/Pages/About.razor`: replace `<div class="conveyor-section">...<div class="conveyor-wrapper">...<div class="conveyor-track">` wrapper with `<div class="timeline-section"><div class="timeline-wrapper"><div class="timeline-track">`; replace the `@for` loop body: each iteration is now `<div class="timeline-item @GetCategoryClass(milestone.Category)@(milestone.IsCurrent ? " is-current" : "")">` containing a single `<MudPaper Class="timeline-card@(milestone.IsCurrent ? " is-current" : "")" ...>` with inner content using class names `timeline-title`, `timeline-divider`, `timeline-org`, `timeline-date`, `timeline-description`, `timeline-chip-category`, `timeline-chip-current`; remove the `<div class="conveyor-connector">` SVG chevron divs entirely (no connectors needed in vertical layout)

**Checkpoint**: US1 complete. Run `dotnet build` (0 errors). Navigate to `/about` — vertical timeline visible, all cards stack top-to-bottom, no horizontal scrollbar. All 5 milestone descriptions readable in full.

---

## Phase 4: User Story 2 – Visual Hierarchy + Current Role Highlight (Priority: P2)

**Goal**: Add the pulsing glow animation on the current role's dot node and a stronger card accent for the current entry. Categories visually distinct.

**Independent Test**: On the rendered timeline, the Steel Dynamics entry's dot visibly pulses. The Steel Dynamics card has a brighter left border than the other cards. The "CURRENT" chip badge is visible.

### Implementation for User Story 2

- [ ] T012 [US2] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append the `@keyframes glow-pulse` animation (0%/100%: box-shadow 0 0 8px rgba(var(--cat-r),...,0.5); 50%: box-shadow 0 0 20px rgba(var(--cat-r),...,0.9))

- [ ] T013 [US2] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append `.timeline-item.is-current::before` rule overriding dot to 18px × 18px, left -2.5rem, and applying `animation: glow-pulse 2s ease-in-out infinite`

- [ ] T014 [US2] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append `.timeline-card.is-current` rule: border-left-color rgba(var(--cat-r),...,1.0) !important, box-shadow 0 4px 32px rgba(var(--cat-r),...,0.25) !important — making the current card's left accent brighter than resting cards

**Checkpoint**: US2 complete. Steel Dynamics dot pulses. Card left border is visibly brighter than others. CURRENT chip already present in markup from US1.

---

## Phase 5: User Story 3 – Responsive on All Devices (Priority: P3)

**Goal**: Ensure the timeline renders cleanly at 375px mobile without horizontal overflow. Rail and dots remain visible but use tighter spacing. Reduced-motion preference honoured.

**Independent Test**: Resize browser to 375px — no horizontal scrollbar, single-column stack, rail and dot nodes still visible and correctly aligned. Enable OS "Reduce Motion" — pulsing animation stops.

### Implementation for User Story 3

- [ ] T015 [US3] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append `@media (max-width: 600px)` block: `.timeline-track` padding-left 2.5rem; `.timeline-track::before` left 0.75rem; `.timeline-item::before` left -1.85rem; `.timeline-item` padding-bottom 1.5rem

- [ ] T016 [US3] In `SamElhagPersonalSite/Components/Pages/About.razor.css`, append `@media (prefers-reduced-motion: reduce)` block: `.timeline-item::before` animation none !important; `.timeline-card` transition none !important

**Checkpoint**: US3 complete. All three user stories now fully implemented.

---

## Phase 6: Polish & Build Verification

**Purpose**: Final line count check, build gate, and browser verification against quickstart.md.

- [ ] T017 [P] Verify `SamElhagPersonalSite/Components/Pages/About.razor` line count is ≤ 300 lines (Constitution Principle 5 gate)
- [ ] T018 [P] Verify `SamElhagPersonalSite/Components/Pages/About.razor.css` contains no leftover `conveyor-*` class references (grep/search to confirm clean rename)
- [ ] T019 Run `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj` — must produce **0 errors, 0 warnings**
- [ ] T020 Run the app (`dotnet run --project SamElhagPersonalSite.AppHost`), navigate to `/about`, and verify all items in `specs/003-about-timeline-cleanup/quickstart.md` visually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — read-only, start immediately; T002 and T003 can run in parallel with T001
- **Phase 2 (Foundational)**: Depends on Phase 1 complete — blocks all CSS work
- **Phase 3 (US1)**: Depends on Phase 2 — T005–T010 (CSS rules) can be appended sequentially; T011 (Razor rewrite) can be done in any order relative to T005–T010 but should be done last so CSS is ready to review alongside markup
- **Phase 4 (US2)**: Depends on Phase 3 (T011 Razor must be done, and base CSS written)
- **Phase 5 (US3)**: Depends on Phase 3 CSS base being written (can technically be done after T010, before T011)
- **Phase 6 (Polish)**: Depends on all phases complete; T017 and T018 can run in parallel

### User Story Dependencies

- **US1 (P1)**: Requires Phase 2 complete. No dependency on other stories.
- **US2 (P2)**: Requires US1 CSS base (T005–T010) to be written. Appends on top — no Razor changes.
- **US3 (P3)**: Requires US1 CSS base (T005–T010) to be written. Appends responsive media queries — no Razor changes.

### Parallel Opportunities

- T002 and T003 (Phase 1) can run in parallel with T001
- T005–T010 (CSS appends) must be sequential within the same file
- T012–T014 (US2 CSS) are sequential appends to the same file
- T015–T016 (US3 CSS) are sequential appends to the same file
- T017 and T018 (Phase 6 verification) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Read all files (T001–T003)
2. Complete Phase 2: Category palette (T004)
3. Complete Phase 3: Vertical layout CSS + Razor rewrite (T005–T011)
4. **STOP and VALIDATE**: Visual check — vertical timeline, no horizontal scroll, all descriptions readable
5. Continue to US2 and US3 if US1 looks good

### Incremental Delivery

1. Phase 1+2: Read + palette → Foundation ready
2. Phase 3: US1 → Vertical timeline works → **MVP shippable**
3. Phase 4: US2 → Current role pulses → Enhanced
4. Phase 5: US3 → Responsive + reduced motion → Production ready
5. Phase 6: Build gate + browser verify → Commit

---

## Notes

- **20 tasks total** across 6 phases
- **No automated tests** — visual verification only per `quickstart.md`
- **2 files change**: `About.razor` (Razor rename + remove connectors) and `About.razor.css` (full rewrite)
- **`About.razor.cs` unchanged** — confirmed in T003
- All CSS tasks are sequential appends to the same file (no parallelism within CSS phases)
- Commit after Phase 3 checkpoint (US1 MVP), then again after Phase 6 (final)
