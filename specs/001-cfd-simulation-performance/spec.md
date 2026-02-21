# Feature Specification: CFD Simulation Performance Improvements

**Feature Branch**: `001-cfd-simulation-performance`
**Created**: 2026-02-20
**Status**: Draft
**Input**: User description: "Improve the general performance of the CFD simulation on the website while staying consistent with the existing stats display"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Smooth, Responsive Simulation at All Parameter Settings (Priority: P1)

A visitor navigates to the Heat Transfer simulation page and immediately sees a fluid,
responsive animation. As they drag sliders (thermal diffusivity, airspeed, surface
temperature, angle of attack), the canvas updates without stuttering, dropping frames,
or feeling sluggish — even at high airspeed or large angle-of-attack values.

**Why this priority**: This is the primary interactive experience of the showcase. A
jank-free simulation is the difference between the page feeling impressive and feeling
broken. It is the highest-value improvement and independently deliverable.

**Independent Test**: Open the simulation page, drag each slider to its extreme values in
sequence, and observe that the canvas animation remains visually smooth throughout without
perceptible frame drops or lag.

**Acceptance Scenarios**:

1. **Given** the simulation is running at default parameters, **When** a visitor watches
   for 10 seconds, **Then** the animation appears continuous and fluid with no visible
   stuttering or freezing.
2. **Given** the airspeed slider is moved to its maximum value, **When** the simulation
   continues running, **Then** the frame rate remains visually smooth and the stats cards
   update correctly within one second.
3. **Given** the angle of attack is changed, **When** the simulation reinitialises,
   **Then** the canvas refreshes within 500 ms and animation resumes smoothly.
4. **Given** the simulation tab is in the background and the user returns to it, **When**
   the tab regains focus, **Then** the animation resumes immediately without accumulated
   lag or visual corruption.

---

### User Story 2 — Stats Cards Remain Accurate and Consistent (Priority: P2)

A technically-minded visitor uses the stats cards (Average Heat Flux, Reynolds Number,
Prandtl Number, Nusselt Number) to observe how changing parameters affects the
aerothermal characteristics of the airfoil. The values must remain numerically identical
to the current implementation — only the timing and frequency of updates may change.

**Why this priority**: The user explicitly asked to stay consistent with the existing
stats. Numerical correctness is non-negotiable. Improving rendering performance must not
alter the physical values displayed.

**Independent Test**: Record the stats values shown for a fixed set of parameters in the
current implementation. Apply the same parameters after the change and verify the
displayed values match to the same precision (exponential notation for heat flux, 2
decimal places for Prandtl, 1 decimal place for Nusselt).

**Acceptance Scenarios**:

1. **Given** airspeed = 100 m/s, **When** the simulation has been running for 5 seconds,
   **Then** the Reynolds Number displayed matches the value produced by `Re = ρ·U∞·L/μ`
   using the same physical constants (ρ=1.225, μ=1.81×10⁻⁵, L=1.0) to exponential
   precision.
2. **Given** the Prandtl Number card, **When** any slider is adjusted, **Then** the
   Prandtl Number continues to display `0.71` (it is a material constant and does not
   change with parameters).
3. **Given** a surface temperature of 500 K and ambient of 288 K, **When** the simulation
   runs, **Then** the Average Heat Flux is displayed in W/m² using exponential notation
   (e.g. `2.34e+3 W/m²`) as it does today.
4. **Given** Re < 5×10⁵ (laminar regime), **When** the Nusselt number is displayed,
   **Then** it uses the Blasius correlation (`Nu = 0.664·Re^0.5·Pr^(1/3)`) to 1 decimal
   place, matching the current formula exactly.

---

### User Story 3 — Fast Initial Load with No Forced Page Reload (Priority: P3)

A visitor lands on the simulation page and the simulation starts playing within 2 seconds
of the page becoming visible — without an intermediate forced page reload. The KaTeX
mathematical equations below the canvas render in place without the page resetting.

**Why this priority**: The current implementation forces a full page reload to ensure
KaTeX is available before the simulation initialises. This causes a jarring UX flash and
adds noticeable load latency. Eliminating it improves first impressions and load time.

**Independent Test**: Open the simulation page in a fresh browser tab (no cached session
flags). Observe whether the page reloads itself. The simulation and equations should both
be fully rendered within 2 seconds of first navigation, with no reload.

**Acceptance Scenarios**:

1. **Given** a fresh browser session with no prior visit to the simulation page, **When**
   the page loads, **Then** the page does NOT reload itself — the simulation canvas begins
   animating and KaTeX equations render on the first load.
2. **Given** the page has loaded, **When** the mathematical formulation section is scrolled
   into view, **Then** all KaTeX equations are fully rendered (not raw LaTeX strings).
3. **Given** the user navigates away and back to the simulation page within the same
   session, **When** the page loads again, **Then** the simulation starts immediately
   without any reload.

---

### Edge Cases

- What happens when the simulation runs for an extended period (> 5 minutes)? Frame rate
  must not degrade over time due to memory accumulation or particle trail array growth.
- What happens on a low-end device where the frame budget is tight? The simulation should
  degrade gracefully rather than blocking the main thread.
- What happens when the user rapidly toggles streamlines on and off? The canvas must not
  corrupt or show artefacts from partial render states.
- What happens when the browser tab is hidden (e.g. user switches tabs)? Rendering must
  pause to avoid burning CPU in the background, and resume correctly when the tab becomes
  visible again.
- What happens when the user changes multiple sliders in rapid succession? Each parameter
  change must not queue multiple simultaneous reinitialisation calls.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The simulation canvas MUST maintain visually smooth animation with no
  perceptible frame drops during normal operation on a mid-range device.
- **FR-002**: The stats cards (Average Heat Flux, Reynolds Number, Prandtl Number, Nusselt
  Number) MUST display values that are numerically identical to the current implementation
  for the same parameter inputs, using the same units, precision, and notation.
- **FR-003**: Stats card values MUST update at a frequency that keeps them perceptibly
  current (at least once per second during active simulation) but MUST NOT require
  recalculation on every rendered frame.
- **FR-004**: The simulation MUST pause all rendering and computation when the browser tab
  is not visible, and MUST resume correctly when the tab regains visibility.
- **FR-005**: Streamline particles MUST continue to animate alongside the temperature
  field; their visual appearance (colour, opacity, trail length) MUST NOT change from the
  current implementation.
- **FR-006**: The airfoil outline MUST remain rendered as a white boundary over the
  temperature field; its visual appearance MUST NOT change.
- **FR-007**: The simulation page MUST NOT perform a forced programmatic page reload as
  part of its initialisation sequence.
- **FR-008**: KaTeX mathematical equations MUST render correctly on first page load without
  requiring a reload.
- **FR-009**: The hover temperature display (showing temperature in K and °C at cursor
  position) MUST continue to function correctly and display accurate values.
- **FR-010**: All existing interactive controls (sliders, pause/resume, reset, toggle
  streamlines, toggle math overlay) MUST continue to function identically from the user's
  perspective.
- **FR-011**: The simulation MUST NOT visibly change its physical behaviour or the
  appearance of the temperature colour field as a result of this change.

### Assumptions

- Performance improvements are scoped entirely to the simulation JavaScript module and
  the simulation Razor page. No other pages or components are in scope.
- The grid dimensions (560 × 240 nodes) are fixed and MUST NOT be reduced, as they
  determine visual fidelity and are referenced in the mathematical formulation section.
- The physical constants (thermal conductivity, density, specific heat capacity, dynamic
  viscosity, Prandtl number) and time-step value are fixed and MUST NOT be changed, as
  they determine the numerical values shown in the stats cards.
- The NACA 0012 airfoil geometry equation is fixed and MUST NOT be altered.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The simulation animation runs with no perceptible stuttering when observed
  on a mid-range laptop at any slider combination, for at least 60 continuous seconds.
- **SC-002**: The stats card values (Reynolds, Prandtl, Nusselt, Heat Flux) match the
  values produced by the current implementation for the same parameter inputs, to the same
  decimal/exponential precision currently displayed.
- **SC-003**: The simulation page reaches a fully interactive state (canvas animating,
  KaTeX equations rendered, sliders responsive) within 2 seconds of navigation on a
  standard broadband connection — without any intermediate page reload.
- **SC-004**: When the browser tab is hidden and then restored, the simulation resumes
  from its prior state with no visual corruption within 500 ms of the tab becoming
  visible again.
- **SC-005**: After 5 minutes of continuous operation, the simulation maintains the same
  visual smoothness as in the first 30 seconds, with no frame rate degradation due to
  memory growth or accumulated state.
- **SC-006**: Rapidly dragging any slider through its full range does not cause the
  simulation to freeze, crash, or display corrupted output.
