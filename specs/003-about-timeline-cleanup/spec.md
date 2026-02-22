# Feature Specification: About Page – "Path So Far" Timeline Redesign

**Feature Branch**: `003-about-timeline-cleanup`
**Created**: 2026-02-22
**Status**: Draft
**Input**: User description: "I want to change the about page, I want to have the Path so far section UI look cleaner, make this match modern UI standards."

---

## Overview

The "Path So Far" section on the About page currently displays career milestones as a horizontally-scrolling conveyor belt. While functional, it feels dated: horizontal scroll is unfamiliar on desktop, 300px fixed-width tiles are cramped, and the visual style doesn't match modern portfolio conventions. This feature replaces it with a clean, vertical timeline — the dominant pattern on contemporary developer portfolios — that works naturally at all screen sizes without requiring horizontal interaction.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 – Readable Vertical Timeline (Priority: P1)

A visitor (recruiter, hiring manager, or peer developer) lands on the About page and scrolls down to "The Path So Far" section. They want to quickly scan Sam's career progression — roles, organisations, dates, and a short description — without having to scroll sideways or decipher an unconventional UI.

**Why this priority**: This is the primary purpose of the section. If the timeline isn't readable and scannable at a glance, nothing else matters.

**Independent Test**: Navigate to `/about`, scroll to "The Path So Far" heading. All 5 milestones should be visible as a vertically-stacked list without any horizontal scroll bar. Each milestone must show role, organisation, date, category, and description.

**Acceptance Scenarios**:

1. **Given** the About page loads, **When** the user scrolls to "The Path So Far", **Then** all milestones are displayed vertically in chronological order with no horizontal scroll bar present.
2. **Given** a milestone entry, **When** the visitor reads it, **Then** the role title, organisation name, date range, category label, and description are all visible without truncation.
3. **Given** the page on a 1440px desktop viewport, **When** the section is viewed, **Then** the layout uses the available width effectively (not a narrow column squashed to the centre).

---

### User Story 2 – Clear Visual Hierarchy with Active Role Highlight (Priority: P2)

The visitor can immediately identify Sam's current role at a glance, and can distinguish between education, co-op, contract, and industry entries without reading every word.

**Why this priority**: Recruiters spend seconds scanning timelines. Visual differentiation reduces cognitive load and makes the current role immediately obvious.

**Independent Test**: On the rendered timeline, the "Steel Dynamics" (current) entry must be visually distinct from completed entries — via a highlighted border, badge, or accent — and each category type has a distinguishable accent colour or label.

**Acceptance Scenarios**:

1. **Given** the rendered timeline, **When** the visitor glances at the entries, **Then** the current role ("CURRENT" badge) is immediately visually prominent compared to past roles.
2. **Given** entries of different categories (Education, CO-OP, Contract, Industry), **When** viewed together, **Then** each category uses a consistent, distinct accent so the visitor can differentiate types at a glance.
3. **Given** the current role entry, **When** the page renders, **Then** a subtle pulse animation or stronger styling makes it visually distinct from historical entries.

---

### User Story 3 – Responsive on All Devices (Priority: P3)

A visitor viewing on a phone or tablet sees the timeline laid out cleanly without the horizontal scroll that currently breaks mobile usability.

**Why this priority**: Mobile-first is a baseline expectation for modern portfolios. The current horizontal scroll is nearly unusable on phones.

**Independent Test**: Resize the browser to 375px width. The timeline must stack into a single column with all content readable, no overflow, and no horizontal scrollbar.

**Acceptance Scenarios**:

1. **Given** a 375px mobile viewport, **When** the section is viewed, **Then** all milestone entries stack vertically in a single column with no horizontal overflow.
2. **Given** any viewport width from 375px to 1440px, **When** the section is viewed, **Then** no content is clipped or hidden unintentionally.
3. **Given** a user who prefers reduced motion, **When** the page renders, **Then** all animations and transitions are suppressed.

---

### Edge Cases

- What happens when only one milestone exists? The timeline should degrade gracefully to a single entry with no connector lines or orphaned visual elements.
- What if a description is very long? Text should wrap naturally within the card; no truncation that hides critical career information.
- What if a description is very short (e.g., "Started B.S. in Mechanical Engineering.")? Cards should maintain a consistent minimum height so the layout doesn't look uneven.
- What happens on ultra-wide screens (> 1920px)? The section should respect the page's max-width container and not stretch indefinitely.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "Path So Far" section MUST display all career milestones in a vertical layout ordered chronologically (oldest at top, newest at bottom).
- **FR-002**: Each milestone card MUST display: role title, organisation name, date range, category label, and description text — all fully legible with no truncation.
- **FR-003**: The current role MUST be visually distinguished with a prominent "CURRENT" badge and a stronger accent style (e.g., highlighted left border or glowing card edge).
- **FR-004**: Each category (Education, CO-OP, Contract, Industry) MUST use a consistent accent colour to visually differentiate milestone types.
- **FR-005**: The layout MUST be fully responsive — a single-column vertical stack on mobile (≤ 600px), scaling appropriately on tablet and desktop.
- **FR-006**: The section MUST NOT require horizontal scrolling on any viewport width.
- **FR-007**: Transitions and animation effects MUST be suppressed when the operating system's "prefers-reduced-motion" setting is active.
- **FR-008**: A connecting visual element between milestones (vertical line, dot node, or similar) MUST clearly convey ordered progression, not an unordered list.
- **FR-009**: The section heading "The Path So Far" MUST remain visible and consistently styled with the rest of the About page headings.
- **FR-010**: Card visual style MUST match the glass-morphism aesthetic of the rest of the About page (dark translucent background, accent borders, consistent border-radius).

### Key Entities

- **TimelineMilestone**: Represents a single career event. Attributes: Role, Organisation, DateRange, Description, IsCurrent (bool), Category (string: Education | CO-OP | Contract | Industry). No new fields required.
- **Category Colour Map**: A fixed mapping from Category string to a distinct accent colour, applied consistently across borders, labels, and badges within each card.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify Sam's current employer within 5 seconds of the section coming into view, without reading every card.
- **SC-002**: The section renders with no horizontal scrollbar on viewports from 375px to 1920px wide.
- **SC-003**: All 5 milestone entries are fully legible (role, org, date, description visible) at 375px mobile width without zooming or horizontal scrolling.
- **SC-004**: The visual design is indistinguishable in style from the rest of the About page — same dark palette, glass-morphism cards, blue accent family — the section does not look externally sourced or inconsistently themed.
- **SC-005**: The timeline reads as a clear ordered progression: a visitor unfamiliar with the site can determine which role came first and which is current without any prior context.
- **SC-006**: The project builds with zero errors and zero warnings after the change.

---

## Assumptions

- The milestone data (5 entries, IsCurrent fields, Category strings) remains unchanged — only the presentation layer is being redesigned.
- The existing dark background theme and glass-morphism card aesthetic must be preserved and extended into the new timeline layout.
- A vertical timeline with a connecting left-side rail/nodes is the target pattern (industry standard for modern portfolio career sections).
- No new data fields are needed; the existing milestone record structure is sufficient.
- The section stays within the existing Blazor Server + MudBlazor component stack; no external JS timeline libraries.
