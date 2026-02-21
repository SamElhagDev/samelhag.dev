# Quickstart: CFD Simulation Performance Improvements

**Feature**: `001-cfd-simulation-performance`
**Date**: 2026-02-20

---

## What Is Changing

This feature improves the runtime performance of the NACA 0012 heat transfer simulation.
Only two files are modified:

| File | Change Type |
|---|---|
| `SamElhagPersonalSite/wwwroot/js/heatSimulation.js` | Core optimisations (7 changes) |
| `SamElhagPersonalSite/Components/Pages/HeatTransferMudBlazor.razor` | Remove reload hack |

No new dependencies, no new pages, no Blazor component changes beyond the reload removal.

---

## Prerequisites

- .NET 10 SDK installed
- Node.js not required (no build step for JS)
- Repo cloned and on branch `001-cfd-simulation-performance`

---

## Running the App Locally

```bash
dotnet run --project SamElhagPersonalSite.AppHost
```

Navigate to the URL printed in the console (typically `https://localhost:7xxx`).
Go to **Heat Transfer Simulation** via the nav or `/HeatSimulation`.

---

## Verifying Each Optimisation

### 1. Pixel Buffer (ImageData) — Visual Check
- Open the simulation page
- Open browser DevTools → Performance tab
- Record 5 seconds of animation
- Confirm the frame time for `render` has dropped vs the baseline
- Visual output must be identical (same colour gradient, same airfoil shape)

### 2. Float64Array Grids — No Visual Change Expected
- This is an internal data structure change only
- Verify the simulation starts and runs without console errors
- Stats values must be unchanged for the same parameter inputs

### 3. Stats Throttling — DOM Update Rate
- Open browser DevTools → Elements panel
- Watch the `#heatFlux`, `#reynolds`, `#nusselt` elements
- Confirm they update approximately 6× per second (every ~167 ms), not 60× per second
- Values must match the pre-optimisation values for the same parameters

### 4. Visibility Pause — Background Tab
- Open the simulation page and let it run
- Switch to a different browser tab
- Open Task Manager / Activity Monitor
- Confirm CPU usage from the browser drops significantly while the tab is hidden
- Return to the simulation tab — animation resumes immediately from its prior state

### 5. Edge Cache — No Visual Change Expected
- The airfoil outline (white boundary) must appear identical
- Verify in DevTools Performance that the outline drawing time per frame has decreased

### 6. Batched Particle Trails — No Visual Change Expected
- Streamlines must appear identical (same colour, opacity, trail length)
- Verify in DevTools Performance that particle rendering time per frame has decreased

### 7. No Page Reload
- Open the simulation page in a fresh browser session (Ctrl+Shift+N in Chrome for incognito)
- Confirm the page does NOT reload itself
- Confirm the canvas starts animating within 2 seconds
- Scroll to the Mathematical Formulation section — all KaTeX equations must be rendered

---

## Validating Stats Consistency (SC-002)

Use these reference values at **default parameters** (alpha=0.5, airspeed=100, surfaceTemp=500, AoA=5°):

| Stat | Expected Value | Formula |
|---|---|---|
| Reynolds Number | `6.77e+6` | Re = 1.225 × 100 × 1.0 / 1.81e-5 |
| Prandtl Number | `0.71` | Fixed material constant |
| Nusselt Number | `1.72e+3` (approx, laminar) | Nu = 0.664 × Re^0.5 × Pr^(1/3) |
| Heat Flux | Varies with simulation state | W/m², exponential notation |

If these values differ after the optimisation, a physical constant or formula has been
inadvertently changed — this must be corrected before the feature is considered done.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Blank canvas on load | JS error in `init` | Check browser console; verify `Float64Array` index math |
| Wrong stats values | Physical constant modified | Cross-check `k`, `rho`, `cp`, `mu` against research.md invariants |
| KaTeX shows raw LaTeX | Promise polling timeout | Check CDN availability; increase polling timeout |
| Simulation still reloads | Old session flag in `sessionStorage` | Clear site data in DevTools → Application → Storage |
| Airfoil outline missing | Edge cache not populated | Ensure `buildEdgeCache()` is called at end of `initializeSimulation()` |
| Particle trails invisible | Batching broke path state | Ensure each particle trail starts with `moveTo()` not `lineTo()` |
