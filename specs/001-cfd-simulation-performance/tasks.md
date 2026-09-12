# Tasks: CFD Simulation Performance Improvements

**Input**: Design documents from `/specs/001-cfd-simulation-performance/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅
**Tests**: Not requested — manual verification via browser DevTools (see quickstart.md)
**Mode**: Guided self-implementation — each task describes exactly what to change and why,
so you can make the edits yourself and learn the codebase as you go.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can be done in any order relative to other [P] tasks in the same phase
- **[Story]**: US1 = smooth animation, US2 = stats consistency, US3 = no reload
- All changes are in two files:
  - `samelhag.dev/wwwroot/js/heatSimulation.js`
  - `samelhag.dev/Components/Pages/HeatTransferMudBlazor.razor`

---

## Phase 1: Understand the Baseline

**Purpose**: Get oriented before touching anything. No edits in this phase.

- [ ] T001 Read `heatSimulation.js` lines 46–50 — note the 5 grid arrays (`T`, `Tnew`, `u`, `v`, `airfoilMask`) and how they're created as `Array(height).fill(null).map(() => Array(width).fill(0))`. This is what you'll replace with typed arrays in T004.

- [ ] T002 Read `heatSimulation.js` lines 203–226 — the `render()` function's inner loop. Count: it calls `ctx.fillRect()` once per cell = 560 × 240 = **134,400 draw calls per frame**. This is the primary bottleneck you'll fix in T006.

- [ ] T003 Read `heatSimulation.js` lines 324–359 — `calculateStats()`. Note it's called from inside `render()` (line 321), meaning it runs at full frame rate. You'll throttle this in T008.

---

## Phase 2: Foundational — Typed Array Migration

**Purpose**: Migrate all 5 grid arrays to typed arrays. This underpins every other
optimisation — the solver, render loop, and edge cache all benefit from contiguous memory.
Complete this phase before any other code changes.

- [ ] T004 **Migrate grid arrays to typed arrays** in `heatSimulation.js` lines 46–50.

  **What to change**: Replace the 5 `Array`-of-`Array` declarations with flat typed arrays.
  The access pattern changes from `T[i][j]` to `T[i * gridWidth + j]` throughout the file.

  **Current code (lines 46–50)**:
  ```js
  let T = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(params.ambientTemp));
  let Tnew = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(params.ambientTemp));
  let u = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(0));
  let v = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(0));
  let airfoilMask = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(false));
  ```

  **Replace with**:
  ```js
  const N = gridWidth * gridHeight;
  let T        = new Float64Array(N).fill(params.ambientTemp);
  let Tnew     = new Float64Array(N).fill(params.ambientTemp);
  let u        = new Float64Array(N);
  let v        = new Float64Array(N);
  let airfoilMask = new Uint8Array(N); // 0 = air, 1 = airfoil
  ```

  **Why**: Contiguous memory → fewer cache misses in the tight solver loop. V8 can also
  apply SIMD-style optimisations on typed arrays. The `Uint8Array` replaces the boolean
  array (0/1 instead of false/true — works identically with `if (airfoilMask[idx])` checks).

- [ ] T005 **Update all `[i][j]` access patterns** in `heatSimulation.js` to `[i * gridWidth + j]`.

  After T004, the file will have many broken `T[i][j]` references. Go through each function
  and update them. Here's a map of every location:

  **`initializeSimulation()` (lines 103–155)** — update these patterns:
  ```js
  // OLD pattern:
  T[i][j] = params.ambientTemp;
  airfoilMask[i][j] = false;
  u[i][j] = params.airspeed;

  // NEW pattern (add idx before the inner loop body):
  const idx = i * gridWidth + j;
  T[idx]    = params.ambientTemp;
  airfoilMask[idx] = 0;
  u[idx]    = params.airspeed;
  ```

  **`updateHeatTransfer()` (lines 158–179)** — the most critical to get right:
  ```js
  // Inside the loop, add at the top:
  const idx  = i * gridWidth + j;
  const idxL = i * gridWidth + (j - 1);
  const idxR = i * gridWidth + (j + 1);
  const idxU = (i - 1) * gridWidth + j;
  const idxD = (i + 1) * gridWidth + j;

  // Then replace T[i][j] → T[idx], T[i][j+1] → T[idxR], etc.
  if (airfoilMask[idx]) {
      Tnew[idx] = params.surfaceTemp;
  } else {
      const d2Tdx2 = (T[idxR] - 2 * T[idx] + T[idxL]) / (dx * dx);
      const d2Tdy2 = (T[idxD] - 2 * T[idx] + T[idxU]) / (dy * dy);
      const dTdx   = u[idx] > 0 ? (T[idx] - T[idxL]) / dx : (T[idxR] - T[idx]) / dx;
      const dTdy   = v[idx] > 0 ? (T[idx] - T[idxU]) / dy : (T[idxD] - T[idx]) / dy;
      const diffusion  = params.alpha * (d2Tdx2 + d2Tdy2);
      const convection = -u[idx] * dTdx - v[idx] * dTdy;
      Tnew[idx] = T[idx] + params.dt * (diffusion + convection * 0.1);
  }
  ```

  **Array swap** (line 178) — `Float64Array` can't be swapped by reference the same way,
  but you can still swap the variable references:
  ```js
  // This still works identically — just swapping which variable points to which buffer:
  var tmp = T; T = Tnew; Tnew = tmp;
  ```

  **`updateParticles()` (lines 181–201)** — only reads `u`, `v`, `airfoilMask`:
  ```js
  const idx = i * gridWidth + j;
  if (i >= 0 && i < gridHeight && j >= 0 && j < gridWidth && !airfoilMask[idx]) {
      // ... (u[idx], v[idx] instead of u[i][j], v[i][j])
  ```

  **`calculateStats()` (lines 328–338)** — reads `T` and `airfoilMask`:
  ```js
  const idx = i * gridWidth + j;
  if (!airfoilMask[idx] && (airfoilMask[(i+1)*gridWidth+j] || airfoilMask[(i-1)*gridWidth+j] ||
      airfoilMask[i*gridWidth+(j+1)] || airfoilMask[i*gridWidth+(j-1)])) {
      const dT = params.surfaceTemp - T[idx];
      totalFlux += k * dT / dx;
      count++;
  }
  ```

  **Mouse hover handler (lines 57–73)** — reads `T` and `airfoilMask`:
  ```js
  const idx = i * gridWidth + j;
  if (i >= 0 && i < gridHeight && j >= 0 && j < gridWidth && T[idx] !== undefined) {
      const temp    = T[idx].toFixed(1);
      const isAirfoil = airfoilMask[idx] ? ' (Airfoil Surface)' : '(Air)';
  ```

  **`render()` temperature loop (lines 204–227)** — reads `T`:
  ```js
  // In the render loop:
  const temp = T[i * gridWidth + j];
  ```

  **Verify**: After updating all references, run the app. The simulation should behave
  identically to before — same colours, same movement, same stats.

---

## Phase 3: User Story 1 — Smooth Animation

**Goal**: Eliminate the 134,400-fillRect bottleneck, cache the airfoil outline, batch
particle trails, and add the background-tab pause.

**Independent Test**: Open the simulation, drag all sliders to extremes, watch for 30 s —
no stutter. Switch tabs and back — resumes instantly. Check DevTools Performance: frame time
should be significantly lower than before T004–T005.

- [ ] T006 [US1] **Replace `fillRect` loop with `putImageData` pixel buffer** in `heatSimulation.js`.

  **Step 1** — allocate the pixel buffer once, right after the grids are declared (after line 50):
  ```js
  // Add after typed array declarations:
  const imageData = ctx.createImageData(width, height);
  const pixels    = imageData.data; // Uint8ClampedArray, length = width * height * 4
  ```

  **Step 2** — replace the entire `render()` temperature loop (lines 204–227) with:
  ```js
  // Build pixel buffer
  for (let i = 0; i < gridHeight; i++) {
      for (let j = 0; j < gridWidth; j++) {
          const temp       = T[i * gridWidth + j];
          const normalized = Math.max(0, Math.min(1,
              (temp - params.ambientTemp) / (params.surfaceTemp - params.ambientTemp)
          ));
          let r, g, b;
          if (normalized < 0.25) {
              const t = normalized / 0.25;
              r = 0; g = Math.floor(t * 255); b = 255;
          } else if (normalized < 0.5) {
              const t = (normalized - 0.25) / 0.25;
              r = 0; g = 255; b = Math.floor((1 - t) * 255);
          } else if (normalized < 0.75) {
              const t = (normalized - 0.5) / 0.25;
              r = Math.floor(t * 255); g = 255; b = 0;
          } else {
              const t = (normalized - 0.75) / 0.25;
              r = 255; g = Math.floor((1 - t) * 255); b = 0;
          }
          // Each pixel = 4 bytes (R, G, B, A) in the flat Uint8ClampedArray
          // Canvas pixel index maps (i, j) → row-major with width = canvas pixel width,
          // but our grid is gridWidth × gridHeight mapped onto canvas width × height.
          // We write one grid cell per canvas "super-pixel" block:
          const px = Math.floor(j * dx);
          const py = Math.floor(i * dy);
          const bw = Math.ceil(dx) + 1; // block width
          const bh = Math.ceil(dy) + 1; // block height
          for (let by = py; by < Math.min(py + bh, height); by++) {
              for (let bx = px; bx < Math.min(px + bw, width); bx++) {
                  const pidx = (by * width + bx) * 4;
                  pixels[pidx]     = r;
                  pixels[pidx + 1] = g;
                  pixels[pidx + 2] = b;
                  pixels[pidx + 3] = 255;
              }
          }
      }
  }
  ctx.putImageData(imageData, 0, 0);
  ```

  **Why**: One `putImageData()` call instead of 134,400 `fillRect()` calls. The pixel buffer
  (`imageData.data`) is the same `Uint8ClampedArray` each frame — no new allocations.

  > **Note on canvas coordinates**: The canvas element is 2800×1200 px but the grid is
  > 560×240 cells, so `dx = 2800/560 = 5` and `dy = 1200/240 = 5`. Each grid cell maps to
  > a 5×5 block of canvas pixels. The inner `bx`/`by` loops fill those blocks directly into
  > the pixel buffer. If you want to simplify (at identical visual output), you can also
  > set `imageSmoothingEnabled = false` and use a 560×240 ImageData then `drawImage()` it
  > scaled — but the block-fill approach above is clearest to read.

- [ ] T007 [P] [US1] **Pre-compute and cache the airfoil edge pixel list** in `heatSimulation.js`.

  **Step 1** — declare the cache array near the other grid declarations:
  ```js
  let edgePixels = []; // Each entry: { j, i } in grid coordinates
  ```

  **Step 2** — add a `buildEdgeCache()` function (place it near `initializeSimulation`):
  ```js
  function buildEdgeCache() {
      edgePixels = [];
      for (let i = 1; i < gridHeight - 1; i++) {
          for (let j = 1; j < gridWidth - 1; j++) {
              const idx = i * gridWidth + j;
              if (airfoilMask[idx] && (
                  !airfoilMask[idx + 1] ||
                  !airfoilMask[idx - 1] ||
                  !airfoilMask[idx + gridWidth] ||
                  !airfoilMask[idx - gridWidth]
              )) {
                  edgePixels.push({ j, i });
              }
          }
      }
  }
  ```

  **Step 3** — call `buildEdgeCache()` at the end of `initializeSimulation()`:
  ```js
  // Last line of initializeSimulation():
  buildEdgeCache();
  ```

  **Step 4** — replace the airfoil outline loop in `render()` (lines 250–266) with:
  ```js
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth   = 3;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  for (const { j, i } of edgePixels) {
      ctx.moveTo(j * dx, i * dy);
      ctx.lineTo((j + 1) * dx, i * dy);
  }
  ctx.stroke();
  ```

  **Why**: The full 134,400-cell scan to find ~2,000 edge pixels happens once at init;
  each frame just replays the ~2,000-entry cached list. Airfoil geometry only changes when
  parameters change (which already calls `initializeSimulation()`).

- [ ] T008 [P] [US1] **Batch all particle trail draw calls** into a single path in `heatSimulation.js`.

  Find the `if (params.showStreamlines)` block in `render()` (lines 229–248) and replace it:

  **Current** (300 separate `beginPath/stroke` calls):
  ```js
  particles.forEach(function (p) {
      if (p.trail.length > 1) {
          ctx.strokeStyle = 'rgba(200, 230, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          // ... moveTo / lineTo loop ...
          ctx.stroke();
      }
      ctx.fillStyle = 'rgba(220, 240, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
  });
  ```

  **Replace with** (2 total GPU calls — one stroke for all trails, one fill for all dots):
  ```js
  if (params.showStreamlines) {
      // --- Batch all trails into one stroke ---
      ctx.strokeStyle = 'rgba(200, 230, 255, 0.5)';
      ctx.lineWidth   = 2;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      for (let pi = 0; pi < particles.length; pi++) {
          const p = particles[pi];
          if (p.trail.length > 1) {
              ctx.moveTo(p.trail[0].x, p.trail[0].y);
              for (let ti = 1; ti < p.trail.length; ti++) {
                  ctx.lineTo(p.trail[ti].x, p.trail[ti].y);
              }
          }
      }
      ctx.stroke();

      // --- Batch all particle dots into one fill ---
      ctx.fillStyle = 'rgba(220, 240, 255, 0.85)';
      ctx.beginPath();
      for (let pi = 0; pi < particles.length; pi++) {
          const p = particles[pi];
          ctx.moveTo(p.x + 3, p.y); // moveTo avoids connecting dots to trails
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      }
      ctx.fill();
  }
  ```

  **Why**: 300 `stroke()` calls → 1. The `ctx.moveTo()` at the start of each trail breaks
  the path so trails don't connect to each other. The dots use `moveTo(p.x+3, p.y)` before
  `arc()` for the same reason — prevents a stray line connecting from the last trail point
  to the dot position.

- [ ] T009 [P] [US1] **Add Page Visibility API pause** in `heatSimulation.js`.

  **Step 1** — add a hidden flag near the `params` object (line 23):
  ```js
  let isHidden = false;
  ```

  **Step 2** — register the visibility listener inside `init()`, after the event listeners
  section (around line 441, before `initializeSimulation()`):
  ```js
  document.addEventListener('visibilitychange', function () {
      isHidden = document.hidden;
  });
  ```

  **Step 3** — update the `animate()` function (lines 361–368) to skip simulation work
  when hidden:
  ```js
  function animate() {
      if (!params.paused && !isHidden) {
          updateHeatTransfer();
          updateParticles();
      }
      if (!isHidden) {
          render();
      }
      self._animationId = requestAnimationFrame(animate);
  }
  ```

  **Why**: The browser already throttles `requestAnimationFrame` in hidden tabs, but
  `updateHeatTransfer()` and `render()` still run at that reduced rate. Skipping them
  entirely drops CPU to near-zero in the background while keeping the RAF loop alive
  so it resumes instantly when the tab becomes visible again.

---

## Phase 4: User Story 2 — Stats Accuracy & Throttling

**Goal**: Keep stats numerically identical but stop computing them 60× per second.

**Independent Test**: Set airspeed=100, alpha=0.5, surfaceTemp=500, AoA=5. Compare stats
values against the reference table in `quickstart.md`. Values must match. Watch the DOM
elements in DevTools Elements panel — they should update ~6× per second, not 60×.

- [ ] T010 [US2] **Throttle `calculateStats()` to run every 10 frames** in `heatSimulation.js`.

  **Step 1** — add a frame counter near `isHidden`:
  ```js
  let frameCounter = 0;
  ```

  **Step 2** — update `animate()` to only call `calculateStats()` every 10th frame
  (note: `calculateStats()` was previously called inside `render()` at line 321 —
  remove it from there and move it here):
  ```js
  function animate() {
      if (!params.paused && !isHidden) {
          updateHeatTransfer();
          updateParticles();
      }
      if (!isHidden) {
          render(); // render() no longer calls calculateStats()
      }
      frameCounter++;
      if (frameCounter % 10 === 0) {
          calculateStats();
      }
      self._animationId = requestAnimationFrame(animate);
  }
  ```

  **Step 3** — remove the `calculateStats()` call from the bottom of `render()` (line 321):
  ```js
  // DELETE this line at the end of render():
  calculateStats();
  ```

  **Why**: Stats scan the full grid (134,400 cells) to compute average heat flux. Doing this
  60×/s is wasteful when ~6×/s is indistinguishable to the user. The formulas and constants
  are completely unchanged — only the call frequency changes.

---

## Phase 5: User Story 3 — No Forced Page Reload

**Goal**: Remove the session-flag reload hack. KaTeX and the simulation both initialise
on first load using a promise-based sequencing approach.

**Independent Test**: Open the simulation in an incognito window (no cached session flags).
Confirm the page does NOT reload. Within 2 s: canvas is animating, all KaTeX equations
are rendered.

- [ ] T011 [US3] **Add `waitForKaTeX()` helper** to `heatSimulation.js`.

  Add this function to the `window.HeatSimulation` object, alongside `renderKatex`:
  ```js
  waitForKaTeX: function (maxWaitMs) {
      maxWaitMs = maxWaitMs || 5000;
      return new Promise(function (resolve, reject) {
          var waited = 0;
          var check = setInterval(function () {
              if (window.katex && typeof window.renderMathInElement === 'function') {
                  clearInterval(check);
                  resolve();
              } else if (waited >= maxWaitMs) {
                  clearInterval(check);
                  // Resolve anyway — simulation can still run without KaTeX
                  resolve();
              }
              waited += 100;
          }, 100);
      });
  },
  ```

  **Why**: Instead of reloading the page to guarantee KaTeX is loaded, this polls every
  100 ms until `window.katex` and `renderMathInElement` are available (they will be, since
  they're `defer`-loaded in the same Razor page). It resolves after at most 5 s regardless,
  so the simulation always starts even if KaTeX CDN is slow.

- [ ] T012 [US3] **Replace the reload hack in `HeatTransferMudBlazor.razor`**.

  Find the `OnAfterRenderAsync` method in the `@code` block (lines 313–334) and replace it:

  **Current code** (forces reload):
  ```csharp
  protected override async Task OnAfterRenderAsync(bool firstRender)
  {
      if (firstRender)
      {
          var hasLoaded = await JS.InvokeAsync<bool>("siteInterop.getSessionFlag", "katexLoaded");
          if (!hasLoaded)
          {
              await JS.InvokeVoidAsync("siteInterop.setSessionFlag", "katexLoaded");
              await JS.InvokeVoidAsync("siteInterop.reloadPage");
          }
          else
          {
              await JS.InvokeVoidAsync("HeatSimulation.init");
              await JS.InvokeVoidAsync("renderKatexInDocument");
          }
      }
  }
  ```

  **Replace with** (no reload, sequenced via promise):
  ```csharp
  protected override async Task OnAfterRenderAsync(bool firstRender)
  {
      if (firstRender)
      {
          // Wait for KaTeX deferred scripts to be available, then init both together.
          // waitForKaTeX() polls every 100ms and resolves within 5s regardless.
          await JS.InvokeVoidAsync("HeatSimulation.waitForKaTeX");
          await JS.InvokeVoidAsync("HeatSimulation.init");
          await JS.InvokeVoidAsync("renderKatexInDocument");
      }
  }
  ```

  > **Note**: `InvokeVoidAsync` with a Promise-returning JS function will `await` the
  > promise automatically. Blazor's JS interop handles this correctly for functions that
  > return a `Promise<void>` (which `waitForKaTeX` does after resolving).

  **Why**: The reload was needed because `OnAfterRenderAsync` fired before KaTeX `defer`
  scripts had executed. Now `waitForKaTeX()` bridges that gap without a full page reset.
  The `siteInterop` calls (`getSessionFlag`, `setSessionFlag`, `reloadPage`) are no longer
  needed on this page.

---

## Phase 6: Polish & Verification

- [ ] T013 **Run the app and do a full visual check** using `quickstart.md` as your checklist.

  ```bash
  dotnet run --project samelhag.dev.AppHost
  ```

  Work through every verification step in `quickstart.md` in order:
  1. Visual smoothness with sliders at extremes
  2. Stats values against reference table (SC-002)
  3. No page reload in incognito (SC-003)
  4. Background tab pause/resume (SC-004)
  5. Extended run for 5 minutes — no degradation (SC-005)
  6. Rapid slider changes — no crash or corruption (SC-006)

- [ ] T014 [P] **Open DevTools Performance tab and record 5 seconds** of simulation.

  Compare the frame timing flamechart before and after. Key things to look for:
  - Scripting time per frame should be noticeably shorter
  - `putImageData` should appear as a single short GPU call, not 134,400 `fillRect` blips
  - `calculateStats` should appear only every ~10th frame, not every frame

- [ ] T015 [P] **Check browser console for errors** after all changes.

  Any `TypeError` on typed array access is likely an `[i][j]` reference that wasn't updated
  in T005. Search the file for remaining `][` patterns — any `T[i][j]`-style access will
  throw at runtime.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (T001–T003): Read-only orientation — no dependencies, start here
- **Phase 2** (T004–T005): MUST complete before phases 3, 4, 5 — typed arrays are the foundation
- **Phase 3** (T006–T009): Depends on Phase 2; T006/T007/T008/T009 are independent of each other [P]
- **Phase 4** (T010): Depends on Phase 2; independent of Phase 3 [P]
- **Phase 5** (T011–T012): Independent of Phases 3 & 4; only needs Phase 2 complete [P]
- **Phase 6** (T013–T015): Depends on all prior phases complete

### Story Dependencies

- **US1 (T006–T009)**: Depends on foundational Phase 2
- **US2 (T010)**: Depends on Phase 2 only; can be done at same time as US1
- **US3 (T011–T012)**: Depends on Phase 2 only; entirely independent of US1 and US2

### Parallel Opportunities Within Phase 3

Once Phase 2 is done, these four tasks are fully independent:

```
T006 — pixel buffer render   (heatSimulation.js — render() function)
T007 — edge cache            (heatSimulation.js — new buildEdgeCache() function)
T008 — particle batching     (heatSimulation.js — streamline drawing block)
T009 — visibility pause      (heatSimulation.js — animate() + event listener)
```

---

## Implementation Strategy

### Recommended Order (Learning-Friendly)

1. **T001–T003** — Read the existing code. Understand the data flow before changing anything.
2. **T004** — Make the typed array declarations. The file will be broken until T005 is done.
3. **T005** — Update all `[i][j]` accesses. Test — simulation should work identically.
4. **T009** — Add the visibility pause (smallest change, big win, easiest to verify).
5. **T010** — Throttle stats (one-line change in `animate()`, one deletion in `render()`).
6. **T011** — Add `waitForKaTeX` to the JS module.
7. **T012** — Update the Razor page (remove reload hack).
8. **T007** — Add edge cache (new function + one call at end of `initializeSimulation()`).
9. **T008** — Batch particle trails (replace the `forEach` block).
10. **T006** — Replace `fillRect` with `putImageData` (biggest change, most satisfying win).
11. **T013–T015** — Full verification pass.

### MVP Scope

If you want to make one change and feel the difference immediately:
- **T004 + T005** (typed arrays) → measurable solver speedup, zero visual change
- **T006** alone (ImageData) → most dramatic frame-rate improvement

### Notes

- After T005, always test in the browser before moving on — typed array index bugs show
  up as NaN values or blank canvases, which are easy to spot immediately.
- The `showMath` overlay (`toggleMathBtn`) draws directly to canvas using `ctx.fillText` —
  this is unaffected by the ImageData change since it draws on top after `putImageData`.
- `dx` and `dy` (5.0 each, since 2800/560 and 1200/240) are integer values in this project,
  which simplifies the pixel block-fill math in T006.
