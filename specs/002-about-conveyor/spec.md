# Feature Specification: About Page — Conveyor Belt Timeline

**Feature Branch**: `002-about-conveyor`
**Created**: 2026-02-20
**Status**: Draft
**Input**: User description: "Let's start with the About me page, I want the `Path So Far` section to move left to right down the page, I want it to have the appearance of a manufacturing style conveyer belt, I want it to use squares instead of circles, and it should feature rich web UI elements that are in line with MudBlazor."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Recruiter Reads the Career Timeline at a Glance (Priority: P1)

A recruiter or collaborator visits the About page and scrolls to the "Path So Far" section.
They see a horizontal conveyor belt running left to right across the page, with each career
milestone presented as a square tile. The belt gives the impression of forward industrial
motion — work moving purposefully through a pipeline — which reinforces Sam's dual identity
as a software and aerospace/manufacturing engineer. The recruiter can read each milestone
in order without hunting for a thread or jumping back up a vertical column.

**Why this priority**: This is the core deliverable. The visual metaphor and the left-to-right
horizontal layout are the defining requirements. Everything else supports this experience.

**Independent Test**: Navigate to the About page, scroll to "Path So Far", and confirm that
career milestones are arranged horizontally from left to right in chronological order, displayed
as square (not circular) tiles, with a visual belt or track connecting them.

**Acceptance Scenarios**:

1. **Given** the About page loads, **When** a visitor scrolls to "Path So Far", **Then** they
   see milestone tiles arranged in a left-to-right horizontal flow with a connecting belt or
   track element running beneath or between them.
2. **Given** the timeline is visible, **When** a visitor inspects the milestone containers,
   **Then** each container is square or rectangular — not circular — in shape.
3. **Given** five career entries exist (two student entries, two developer entries, one current
   role), **When** the timeline renders, **Then** all five appear in correct chronological order
   from left (earliest) to right (most recent/current).
4. **Given** the current role (Steel Dynamics, ongoing), **When** it is displayed, **Then** it
   is visually distinguished from completed milestones (e.g., highlighted, labelled "Current",
   or differently styled).

---

### User Story 2 — Visitor Reads Milestone Detail Without Leaving the Page (Priority: P2)

A visitor wants to learn more about a specific entry — for example, the co-op at Core10 or
the degree at West Virginia University. Each tile contains enough information inline (role,
organisation, date range, brief description) to understand the milestone without any modal,
navigation, or extra click. Rich UI elements (chips, badges, icons, dividers) make the tile
feel polished and information-dense rather than plain text.

**Why this priority**: The content richness is the second key requirement. Tiles must convey
professional credibility through visual hierarchy, not just label and date pairs.

**Independent Test**: Read a single tile in isolation and confirm it contains: role/title,
organisation name, date range, and at least one additional rich element (e.g., a chip, badge,
or icon). All information must be legible without any interaction.

**Acceptance Scenarios**:

1. **Given** a milestone tile is rendered, **When** a visitor reads it, **Then** it displays
   at minimum: the role or programme name, the organisation name, and the date range.
2. **Given** a milestone tile is rendered, **When** a visitor inspects it, **Then** it includes
   at least one rich UI element beyond plain text — such as a status chip ("Current" /
   "Completed"), a category badge (e.g., "Education", "Industry", "Contract"), or an icon
   representing the type of milestone.
3. **Given** all tiles are visible, **When** a visitor scans them, **Then** visual hierarchy
   within each tile clearly separates the primary label (role) from supporting information
   (dates, organisation) using size, weight, or colour contrast.

---

### User Story 3 — Timeline Remains Readable on Smaller Screens (Priority: P3)

A visitor on a tablet or narrower viewport navigates to the About page. The conveyor belt
timeline adapts gracefully — either by scrolling horizontally within its container, or by
wrapping into a stacked arrangement — so that no content is clipped or hidden.

**Why this priority**: The horizontal layout is inherently desktop-first. Responsive behaviour
prevents the feature from breaking the page on common device widths.

**Independent Test**: Resize the browser viewport to a tablet width (960 px or narrower).
Confirm the timeline section is readable — either via horizontal scroll within the section
or via a gracefully adapted layout — with no milestone tiles clipped outside the viewport
boundary.

**Acceptance Scenarios**:

1. **Given** the viewport width is 960 px or narrower, **When** the timeline section loads,
   **Then** all milestone content is accessible — either through horizontal scroll within the
   timeline container or a layout change — with no content invisibly clipped.
2. **Given** the viewport width is 600 px or narrower, **When** the timeline section renders,
   **Then** the tiles stack or wrap in a way that remains legible and maintains the
   chronological reading order.

---

### Edge Cases

- What happens if a new career entry is added in the future? The belt must accommodate
  additional tiles without requiring a layout redesign — tile count must not be hardcoded.
- What happens when a milestone has a longer title or description than others? Tile heights
  must remain consistent (or expand uniformly) so the belt track stays visually aligned.
- What happens on very wide viewports (wider than 1600 px)? The timeline should remain
  centred and not stretch to an uncomfortable reading width.
- What happens if the section heading is changed? The heading text must be easy to update
  without touching layout or styling code.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "Path So Far" section MUST display career milestones in a left-to-right
  horizontal sequence, representing chronological progression from earliest (left) to most
  recent (right).
- **FR-002**: Each milestone MUST be contained within a square or rectangular tile. Circular
  containers are explicitly prohibited.
- **FR-003**: A visual belt or track element MUST connect the milestone tiles to reinforce
  the conveyor belt metaphor — this may be a horizontal rail, line, or decorative connector
  running between or beneath the tiles.
- **FR-004**: The belt or track MUST convey a sense of directionality — left to right —
  through visual cues such as arrows, chevrons, gradient direction, or motion-suggesting
  decoration.
- **FR-005**: Each milestone tile MUST display the role or programme name, the organisation
  name, and the date range at minimum.
- **FR-006**: Each milestone tile MUST include at least one rich UI element beyond plain text,
  such as a status indicator ("Current" / "Completed"), a category label ("Education" /
  "Industry" / "Contract"), or a recognisable icon.
- **FR-007**: The current role (Steel Dynamics, ongoing) MUST be visually distinguished from
  completed entries.
- **FR-008**: All five existing career entries MUST be preserved exactly — no data must be
  dropped, merged, or reordered.
- **FR-009**: On viewports 960 px wide or narrower, all milestone content MUST remain
  accessible, either via horizontal scroll within the timeline container or via a responsive
  layout change.
- **FR-010**: The visual style of the conveyor belt section MUST remain consistent with the
  existing About page aesthetic — dark theme, glassmorphism card style, and gradient accents.

### Assumptions

- The five career entries listed in this spec are the initial set. Additional entries will be
  added in the future. The implementation must make adding a new milestone a single-line change
  to the data list — no layout or CSS changes should be required to accommodate more tiles.
- "Manufacturing style" is interpreted visually — through geometry (squares, rails, arrow
  motifs) and colour treatment — not through animation such as a continuously moving belt.
  Subtle hover effects on tiles are acceptable but not required.
- The section heading "The Path So Far:" is retained unchanged.
- The rest of the About page (profile card, skills section) is not modified by this feature.
- "Rich MudBlazor UI elements" means using the MudBlazor component and style system —
  chips, icons, tooltips, dividers — rather than custom CSS-only constructs.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor landing on the About page can identify the left-to-right horizontal
  timeline as a distinct visual section within 3 seconds of scrolling to it, without
  any instruction.
- **SC-002**: All five career milestones are visible and readable in a single horizontal
  scan on a 1080 p desktop viewport — either fully in view or navigable via scroll within
  the section — without any milestone being hidden or cut off.
- **SC-003**: The square tile shape requirement is unambiguous: no tile uses a circular
  container. Slight corner rounding (up to 8 px) is permitted to preserve sharp, industrial
  geometry while allowing minimal softening for legibility.
- **SC-004**: The timeline section passes visual consistency review — colour palette, card
  style, and typography match the existing About page without requiring any changes to global
  styles outside the timeline section.
- **SC-005**: On a 768 px wide viewport, all five milestones are accessible within 2 seconds
  of the section rendering, with no content clipped by the viewport edge.
