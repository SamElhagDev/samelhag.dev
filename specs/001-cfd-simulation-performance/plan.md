# Implementation Plan: CFD Simulation Performance Improvements

**Branch**: `001-cfd-simulation-performance` | **Date**: 2026-02-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-cfd-simulation-performance/spec.md`

## Summary

The NACA 0012 heat transfer simulation currently makes ~134,400 individual canvas draw calls per
frame, scans the entire grid on every frame to compute stats and find airfoil edge pixels, issues
300 separate GPU state flushes for particle trails, and forces a full page reload to sequence KaTeX
initialisation. These compound bottlenecks cause perceptible frame drops, unnecessary background
CPU burn, and a jarring first-load experience.

The plan replaces the per-cell `fillRect()` loop with a single `putImageData()` call using a
pre-allocated pixel buffer; migrates all five simulation grids from `Array`-of-`Array` to flat
`Float64Array`; throttles stat computation to every 10 frames; caches airfoil edge pixels on init;
batches all particle trail paths into one GPU stroke; adds a Page Visibility API pause; and removes
the forced page-reload KaTeX hack. All physical constants, grid dimensions, formulas, DOM element
IDs, and visual output are preserved exactly.

## Technical Context

**Language/Version**: JavaScript (ES2020+) + C# / .NET 10 (Blazor Server)
**Primary Dependencies**: Browser Canvas API (`CanvasRenderingContext2D`, `ImageData`,
`Float64Array`), Page Visibility API, MudBlazor 8.x, KaTeX 0.16.9 (CDN)
**Storage**: N/A — all state is in-memory JavaScript arrays within the simulation loop
**Testing**: Manual browser verification (DevTools Performance panel, visual regression,
stats value comparison against reference table in quickstart.md)
**Target Platform**: Modern desktop browsers (Chrome, Firefox, Edge, Safari); rendered via
Blazor Interactive Server on .NET 10
**Project Type**: Web (single Blazor Server app with JS interop)
**Performance Goals**: Visually smooth animation (no perceptible frame drops) at 60 fps
target; stats update ≥ 6×/s; fully interactive within 2 s of navigation (no reload)
**Constraints**: Grid MUST remain 560 × 240; physical constants MUST NOT change; all stats
DOM IDs and numerical values MUST be preserved; no new NuGet or npm dependencies
**Scale/Scope**: Two files only — `heatSimulation.js` and `HeatTransferMudBlazor.razor`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| **P1 — Blazor-First Architecture** | ✅ PASS | All changes are within the pre-approved `heatSimulation.js` module and its Razor host. No new JS frameworks introduced. JS interop scope unchanged. |
| **P2 — Performance by Default** | ✅ PASS | This feature IS the performance improvement. Animation capped at 60 fps; background tab paused; ImageData batch replaces 134 k draw calls. |
| **P3 — Single Stellar Showcase** | ✅ PASS | Only the simulation page is modified. Showcase narrative, KaTeX equations, and all visual elements are preserved. |
| **P4 — Personal Authenticity** | ✅ PASS | No copy or content changes. Stats values remain physically accurate. |
| **P5 — Maintainability and Simplicity** | ✅ PASS | `heatSimulation.js` is a single self-contained module. Changes are refactors within it. No new dependencies. `HeatTransferMudBlazor.razor` shrinks (reload hack removed). |

**Constitution gate: PASSED. No violations. No complexity justifications required.**

## Project Structure

### Documentation (this feature)

```text
specs/001-cfd-simulation-performance/
├── plan.md              ← This file
├── spec.md              ← Feature specification
├── research.md          ← Phase 0: all 7 performance decisions with rationale
├── quickstart.md        ← Phase 1: verification steps and reference values
├── checklists/
│   └── requirements.md  ← Spec quality checklist (all passing)
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

*Note: No `data-model.md` or `contracts/` directory — this feature has no data entities or
API endpoints. It is a pure client-side performance refactor.*

### Source Code (files modified)

```text
SamElhagPersonalSite/
└── wwwroot/
│   └── js/
│       └── heatSimulation.js        ← All 7 simulation optimisations
└── Components/
    └── Pages/
        └── HeatTransferMudBlazor.razor  ← Remove reload hack; add waitForKaTeX call
```

**Structure Decision**: This is a targeted refactor of two existing files within the
established Blazor web project structure. No new directories, projects, or services are
required. The single-project layout (`SamElhagPersonalSite/`) is unchanged.

## Phase 0: Research Findings Summary

*Full details in [research.md](research.md)*

All 7 performance decisions resolved with no clarifications outstanding:

| Decision | Approach | Expected Gain |
|---|---|---|
| Canvas rendering | `putImageData()` + `Uint8ClampedArray` pixel buffer | 5–10× |
| Grid data structures | Flat `Float64Array` (row-major: `T[i*W + j]`) | 2–4× solver |
| Stats computation | Throttle to every 10 frames (~6×/s) | Removes per-frame grid scan |
| Background tab | `document.visibilitychange` pause-flag pattern | Zero background CPU |
| Airfoil outline | Pre-computed edge cache in `initializeSimulation()` | 45–135× outline scan |
| Particle trails | Single batched `beginPath()` / `stroke()` for all 300 | 4–5× trail draw |
| KaTeX initialisation | `waitForKaTeX()` promise poll; remove forced reload | Eliminates reload |

**Invariants confirmed (MUST NOT change in implementation):**
- Grid: 560 × 240
- Constants: k=0.0262, ρ=1.225, cp=1005, μ=1.81e-5, Pr=0.71, dt=0.006, L=1.0
- NACA 0012 polynomial: 5-coefficient form (0.2969, −0.1260, −0.3516, 0.2843, −0.1015)
- Stats DOM IDs: `heatFlux`, `reynolds`, `prandtl`, `nusselt`, `hoverTemp`
- Stats formulas and precision: Re (exponential), Pr (2 dp), Nu (1 dp), flux (exponential)
- Colour gradient: blue→green→yellow→red mapped to normalised temperature 0→1
- Particle count: 300, trail length cap: 40 points
- All slider and button IDs unchanged

## Phase 1: Design

### No Data Model

This feature has no persistent entities, no new state beyond the simulation's existing
in-memory arrays, and no inter-component data contracts. The `data-model.md` artefact is
not applicable and has not been created.

### No API Contracts

This feature has no server-side endpoints, no Blazor component parameters, and no
SignalR channel changes. The `contracts/` artefact is not applicable and has not been
created.

### Design: `heatSimulation.js` Restructured Layout

The module retains its existing `window.HeatSimulation` object shape. Internal structure
after refactoring:

```text
window.HeatSimulation
├── _animationId          (unchanged)
├── dispose()             (unchanged)
├── init()
│   ├── Grid allocation   → Float64Array × 4 + Uint8Array × 1
│   ├── Pixel buffer      → Uint8ClampedArray(W × H × 4) allocated once
│   ├── Edge cache        → edgePixels[] populated by initializeSimulation()
│   ├── initializeSimulation()
│   │   ├── Fill grids (Float64Array indexing)
│   │   ├── Build airfoilMask
│   │   └── buildEdgeCache() ← new: populates edgePixels[]
│   ├── updateHeatTransfer()  (Float64Array indexing, logic unchanged)
│   ├── updateParticles()     (unchanged logic)
│   ├── calculateStats()      (unchanged formulas; called every 10 frames only)
│   ├── render()
│   │   ├── Write pixel buffer (temperature → RGBA inline)
│   │   ├── ctx.putImageData(imageData, 0, 0)   ← replaces 134,400 fillRect calls
│   │   ├── Batch airfoil outline from edgePixels[]
│   │   └── Batch all particle trails (1 beginPath/stroke)
│   ├── visibilitychange listener (pause flag)
│   └── animate()
│       ├── if hidden → skip updateHeatTransfer + updateParticles
│       ├── render() every frame
│       └── frameCounter++ → calculateStats() every 10th frame
└── renderKatex()         (unchanged)
```

### Design: `HeatTransferMudBlazor.razor` Changes

`OnAfterRenderAsync` replaces the session-flag reload pattern with a direct JS interop
call to a `waitForKaTeX()` function that polls until KaTeX is available, then calls
`HeatSimulation.init()` and `renderKatexInDocument()` in sequence. The `siteInterop`
calls (`getSessionFlag`, `setSessionFlag`, `reloadPage`) are removed from this page's
lifecycle. The `waitForKaTeX()` helper is defined in `heatSimulation.js` as a module-level
function accessible from C# interop.

## Constitution Check — Post-Design Re-evaluation

All five principles re-evaluated after Phase 1 design:

| Principle | Post-Design Status | Notes |
|---|---|---|
| P1 — Blazor-First | ✅ PASS | Only `heatSimulation.js` (pre-approved module) and its Razor host modified |
| P2 — Performance | ✅ PASS | All 7 optimisations directly satisfy this principle |
| P3 — Showcase | ✅ PASS | All visual and mathematical content preserved unchanged |
| P4 — Authenticity | ✅ PASS | No content changes |
| P5 — Simplicity | ✅ PASS | Net code reduction in Razor (reload hack removed); JS refactor within the existing module |

**No violations. Implementation may proceed.**
