# Command Palette (⌘K) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a client-side ⌘K / Ctrl+K command palette that fuzzy-filters and jumps to any page, opens socials, or copies the email — themed to match Copper & Black, with zero impact on the existing navbar.

**Architecture:** A single self-contained vanilla-JS module loaded with a `<script>` tag (like the maze background), so keystroke→filter→paint stays entirely client-side with no Blazor Server SignalR round-trip. Blazor is involved only at the final navigation hop. Styles live in `app.css` reusing existing `--bc-*` tokens; a small trigger chip is added to the app bar.

**Tech Stack:** Vanilla JS (ES5-compatible), CSS custom properties, .NET 10 / Blazor Server, MudBlazor 8.x.

**Verification approach:** No test project exists; verify with `dotnet build` plus the browser-preview tools (synthetic `keydown` to trigger, DOM assertions via `preview_eval`, snapshots). **Commits deferred** — work on `main`, do not commit until the user explicitly approves.

**Files:** Create `wwwroot/js/command-palette.js`; modify `Components/App.razor`, `wwwroot/app.css`, `Components/Layout/MainLayout.razor`.

---

### Task 1: Create the command-palette JS module

**Files:**
- Create: `SamElhagPersonalSite/wwwroot/js/command-palette.js`

- [ ] **Step 1: Write the module**

Create `SamElhagPersonalSite/wwwroot/js/command-palette.js` with exactly:

```javascript
(function () {
  'use strict';

  // ── Action definitions (11) ──
  var ACTIONS = [
    { label: 'Home',                            type: 'nav',      value: '/',                       hint: 'Page',     icon: 'fa-solid fa-house' },
    { label: 'About',                           type: 'nav',      value: '/about',                  hint: 'Page',     icon: 'fa-solid fa-user' },
    { label: 'Interests',                       type: 'nav',      value: '/interests',              hint: 'Page',     icon: 'fa-solid fa-compass' },
    { label: 'Projects',                        type: 'nav',      value: '/projects',               hint: 'Page',     icon: 'fa-solid fa-folder-open' },
    { label: 'Contact',                         type: 'nav',      value: '/contact',                hint: 'Page',     icon: 'fa-solid fa-envelope' },
    { label: 'Heat Transfer — Case Study', type: 'nav',      value: '/projects/heat-transfer', hint: 'Project',  icon: 'fa-solid fa-wind' },
    { label: 'Heat Transfer — Live Sim',   type: 'nav',      value: '/HeatSimulation',         hint: 'Project',  icon: 'fa-solid fa-play' },
    { label: 'GitHub',                          type: 'external', value: 'https://github.com/SamElhagDev',                   hint: 'External', icon: 'fa-brands fa-github' },
    { label: 'LinkedIn',                        type: 'external', value: 'https://www.linkedin.com/in/sam-elhag-b82312102/', hint: 'External', icon: 'fa-brands fa-linkedin' },
    { label: 'X (Twitter)',                     type: 'external', value: 'https://x.com/SamEElhag',                          hint: 'External', icon: 'fa-brands fa-x-twitter' },
    { label: 'Copy email address',              type: 'copy',     value: 'sami.eltaj.elhag@gmail.com',                       hint: 'Utility',  icon: 'fa-solid fa-at' }
  ];

  var isMac = /Mac|iPhone|iPad/.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '');

  var overlay = null, input = null, list = null;
  var rows = [], activeIndex = 0, lastFocused = null, isOpen = false;

  // ── Fuzzy subsequence match: score, or -1 if not all chars matched ──
  function fuzzyScore(query, text) {
    if (!query) return 0;
    query = query.toLowerCase(); text = text.toLowerCase();
    var qi = 0, score = 0, streak = 0, firstIndex = -1;
    for (var ti = 0; ti < text.length && qi < query.length; ti++) {
      if (text[ti] === query[qi]) {
        if (firstIndex < 0) firstIndex = ti;
        streak++; score += streak; qi++;
      } else { streak = 0; }
    }
    if (qi < query.length) return -1;
    return score - firstIndex * 0.1;
  }

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'cmdk-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Command palette');
    overlay.hidden = true;

    var panel = document.createElement('div');
    panel.className = 'cmdk-panel';

    var inputWrap = document.createElement('div');
    inputWrap.className = 'cmdk-input-wrap';
    var searchIcon = document.createElement('i');
    searchIcon.className = 'fa-solid fa-magnifying-glass cmdk-search-icon';
    input = document.createElement('input');
    input.className = 'cmdk-input';
    input.type = 'text';
    input.setAttribute('placeholder', 'Jump to…  (type to filter)');
    input.setAttribute('aria-label', 'Search commands');
    input.autocomplete = 'off';
    input.spellcheck = false;
    inputWrap.appendChild(searchIcon);
    inputWrap.appendChild(input);

    list = document.createElement('ul');
    list.className = 'cmdk-list';
    list.setAttribute('role', 'listbox');

    var footer = document.createElement('div');
    footer.className = 'cmdk-footer';
    footer.innerHTML =
      '<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
      '<span><kbd>↵</kbd> select</span>' +
      '<span><kbd>esc</kbd> close</span>';

    panel.appendChild(inputWrap);
    panel.appendChild(list);
    panel.appendChild(footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', onInputKeydown);
  }

  function render(query) {
    query = query || '';
    var scored = [];
    for (var i = 0; i < ACTIONS.length; i++) {
      var s = fuzzyScore(query, ACTIONS[i].label);
      if (s >= 0) scored.push({ action: ACTIONS[i], score: s });
    }
    if (query) scored.sort(function (a, b) { return b.score - a.score; });

    list.innerHTML = '';
    rows = [];
    if (scored.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'cmdk-empty';
      empty.textContent = 'No matches';
      list.appendChild(empty);
      return;
    }
    for (var j = 0; j < scored.length; j++) {
      (function (idx, action) {
        var li = document.createElement('li');
        li.className = 'cmdk-row';
        li.setAttribute('role', 'option');
        li.innerHTML =
          '<i class="' + action.icon + ' cmdk-row-icon"></i>' +
          '<span class="cmdk-row-label"></span>' +
          '<span class="cmdk-row-hint"></span>';
        li.querySelector('.cmdk-row-label').textContent = action.label;
        li.querySelector('.cmdk-row-hint').textContent = action.hint || '';
        li.addEventListener('mousemove', function () { setActive(idx); });
        li.addEventListener('click', function () { runAction(action, li); });
        list.appendChild(li);
        rows.push({ action: action, el: li });
      })(j, scored[j].action);
    }
    activeIndex = 0;
    paintActive();
  }

  function paintActive() {
    for (var i = 0; i < rows.length; i++) {
      var on = (i === activeIndex);
      rows[i].el.classList.toggle('cmdk-row--active', on);
      rows[i].el.setAttribute('aria-selected', on ? 'true' : 'false');
    }
    if (rows[activeIndex]) rows[activeIndex].el.scrollIntoView({ block: 'nearest' });
  }

  function setActive(i) { if (i >= 0 && i < rows.length) { activeIndex = i; paintActive(); } }

  function onInputKeydown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (rows.length) setActive((activeIndex + 1) % rows.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (rows.length) setActive((activeIndex - 1 + rows.length) % rows.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (rows[activeIndex]) runAction(rows[activeIndex].action, rows[activeIndex].el); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); } // keep focus within the palette
  }

  function runAction(action, el) {
    if (action.type === 'nav') {
      close();
      var a = document.createElement('a');
      a.href = action.value;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (action.type === 'external') {
      window.open(action.value, '_blank', 'noopener');
      close();
    } else if (action.type === 'copy') {
      var done = function () {
        if (el) {
          var hint = el.querySelector('.cmdk-row-hint');
          if (hint) hint.textContent = 'Copied!';
          el.classList.add('cmdk-row--copied');
        }
        setTimeout(close, 650);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(action.value).then(done, done);
      } else { done(); }
    }
  }

  function open() {
    // Blazor enhanced navigation morphs the DOM and removes our injected overlay
    // (no data-permanent marker), so rebuild it if detached and reconcile stale state.
    if (!overlay || !document.body.contains(overlay)) { overlay = null; isOpen = false; build(); }
    if (isOpen) return;
    lastFocused = document.activeElement;
    isOpen = true;
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('cmdk-overlay--open'); });
    input.value = '';
    render('');
    input.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('cmdk-overlay--open');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { overlay.hidden = true; } else { setTimeout(function () { if (!isOpen) overlay.hidden = true; }, 180); }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function toggle() { if (isOpen) close(); else open(); }

  // ── Global trigger: Cmd/Ctrl + K (page-focus only) ──
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      toggle();
    }
  });

  // Expose for the navbar chip
  window.commandPalette = { open: open, close: close, toggle: toggle, isMac: isMac };

  // Wire the navbar trigger chip(s): set keycap text + click handler
  function wireChips() {
    var triggers = document.querySelectorAll('.cmdk-trigger');
    for (var i = 0; i < triggers.length; i++) {
      var btn = triggers[i];
      var cap = btn.querySelector('[data-cmdk-keycap]');
      if (cap) cap.textContent = isMac ? '⌘K' : 'Ctrl K';
      if (!btn.dataset.cmdkBound) {
        btn.dataset.cmdkBound = '1';
        btn.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
      }
    }
  }

  // Run now + after Blazor interactive render / enhanced navigation (app bar renders after circuit connect)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireChips); else wireChips();
  [300, 1000, 2500].forEach(function (t) { setTimeout(wireChips, t); });
  if (window.Blazor) window.Blazor.addEventListener('enhancednavigationend', wireChips);
})();
```

- [ ] **Step 2: Build (confirms no syntax issues surface at app build)**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors. (JS isn't compiled, but this confirms the file landed and nothing else broke.)

- [ ] **Step 3: Checkpoint (do NOT commit)**

Leave the new file in the working tree on `main`.

---

### Task 2: Register the script in App.razor

**Files:**
- Modify: `SamElhagPersonalSite/Components/App.razor` (script block near the end, after `maze-background.js` at line 48)

- [ ] **Step 1: Add the script tag**

Find:

```razor
    <script src="@Assets["js/maze-background.js"]"></script>
```

Add immediately after it:

```razor
    <script src="@Assets["js/command-palette.js"]"></script>
```

- [ ] **Step 2: Build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors.

- [ ] **Step 3: Visual check — palette opens (unstyled is fine here)**

Start/refresh the preview, then in `preview_eval` run:
`document.dispatchEvent(new KeyboardEvent('keydown', {key:'k', ctrlKey:true, bubbles:true})); document.querySelectorAll('.cmdk-row').length`
Expected: `11` (the overlay built and rendered 11 actions). Then close: `window.commandPalette.close()`.

- [ ] **Step 4: Checkpoint (do NOT commit)**

---

### Task 3: Add palette styles to app.css

**Files:**
- Modify: `SamElhagPersonalSite/wwwroot/app.css` (append at end of file)

- [ ] **Step 1: Append the styles**

Append to the very end of `SamElhagPersonalSite/wwwroot/app.css`:

```css
/* ═══════════════════════════════════════════════════════
   Command Palette (⌘K)
   ═══════════════════════════════════════════════════════ */
.cmdk-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 14vh;
    background: rgba(8, 7, 6, 0.55);
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 0.18s ease;
}
.cmdk-overlay--open { opacity: 1; }

.cmdk-panel {
    width: min(92vw, 560px);
    max-height: 60vh;
    display: flex;
    flex-direction: column;
    background: rgba(35, 31, 27, 0.96);
    border: 1px solid var(--bc-accent-border);
    border-radius: var(--bc-radius-lg);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
    overflow: hidden;
    transform: translateY(-8px);
    transition: transform 0.18s ease;
}
.cmdk-overlay--open .cmdk-panel { transform: translateY(0); }

.cmdk-input-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-bottom: 1px solid var(--bc-border);
}
.cmdk-search-icon { color: var(--bc-accent-light); font-size: 1rem; }
.cmdk-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--bc-text-primary);
    font-family: 'Space Grotesk', 'Inter', sans-serif;
    font-size: 1.05rem;
}
.cmdk-input::placeholder { color: var(--bc-text-muted); }

.cmdk-list { list-style: none; margin: 0; padding: 8px; overflow-y: auto; }
.cmdk-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 14px;
    border-radius: 10px;
    cursor: pointer;
    color: var(--bc-text-secondary);
}
.cmdk-row--active {
    background: var(--bc-accent-dim);
    color: var(--bc-text-primary);
    box-shadow: inset 0 0 0 1px var(--bc-accent-border);
}
.cmdk-row-icon { width: 20px; text-align: center; color: var(--bc-accent-light); }
.cmdk-row-label { flex: 1; font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 500; }
.cmdk-row-hint {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--bc-text-muted);
    text-transform: uppercase;
}
.cmdk-row--copied .cmdk-row-hint { color: var(--bc-accent-light); }
.cmdk-empty { padding: 20px; text-align: center; color: var(--bc-text-muted); font-size: 0.9rem; }

.cmdk-footer {
    display: flex;
    gap: 18px;
    padding: 10px 18px;
    border-top: 1px solid var(--bc-border);
    font-size: 0.72rem;
    color: var(--bc-text-muted);
}
.cmdk-footer kbd {
    font-family: 'JetBrains Mono', monospace;
    background: var(--bc-bg-deep);
    border: 1px solid var(--bc-border);
    border-radius: 4px;
    padding: 1px 5px;
    margin-right: 3px;
    color: var(--bc-text-secondary);
}

/* Navbar trigger chip */
.cmdk-trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 12px;
    background: rgba(168, 144, 112, 0.08);
    border: 1px solid var(--bc-border);
    border-radius: 8px;
    color: var(--bc-text-secondary);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s;
}
.cmdk-trigger:hover { border-color: var(--bc-accent-border); color: var(--bc-text-primary); }
.cmdk-trigger-keys { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: var(--bc-text-muted); }

@media (prefers-reduced-motion: reduce) {
    .cmdk-overlay, .cmdk-panel { transition: none; }
}
@media (max-width: 600px) {
    .cmdk-trigger-keys { display: none; }
}
```

- [ ] **Step 2: Build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors.

- [ ] **Step 3: Visual check — themed palette**

Refresh `/`, open via `preview_eval`: `window.commandPalette.open()`, take a `preview_screenshot`.
Expected: a centered dark glass panel with copper accents, search input, 11 rows with icons + uppercase hint tags, and a footer of keycaps. Close with `window.commandPalette.close()` after.

- [ ] **Step 4: Checkpoint (do NOT commit)**

---

### Task 4: Add the navbar trigger chip to MainLayout.razor

**Files:**
- Modify: `SamElhagPersonalSite/Components/Layout/MainLayout.razor` (the `MudAppBar`, lines 10-25)

- [ ] **Step 1: Insert the chip between the spacer and the nav stack**

Find:

```razor
        <MudSpacer />
        <MudStack Row="true" Spacing="1" Class="mr-3">
```

Replace with:

```razor
        <MudSpacer />
        <button type="button" class="cmdk-trigger mr-3" aria-label="Open command palette">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span class="cmdk-trigger-keys" data-cmdk-keycap>Ctrl K</span>
        </button>
        <MudStack Row="true" Spacing="1" Class="mr-3">
```

Notes: the chip is a plain `<button>` (not a MudButton) so the JS can attach its own click handler cleanly; `wireChips()` in the module binds the click and swaps the keycap text to `⌘K` on Mac. No existing app-bar element is removed.

- [ ] **Step 2: Build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors.

- [ ] **Step 3: Visual check — chip present and wired**

Refresh `/`. In `preview_eval`:
`(() => { const b = document.querySelector('.cmdk-trigger'); return { present: !!b, keycap: b && b.querySelector('[data-cmdk-keycap]').textContent, bound: b && b.dataset.cmdkBound }; })()`
Expected: `{ present: true, keycap: "Ctrl K", bound: "1" }`. Then click it: `document.querySelector('.cmdk-trigger').click(); !!document.querySelector('.cmdk-overlay:not([hidden])')` → `true`. Close after.

- [ ] **Step 4: Checkpoint (do NOT commit)**

---

### Task 5: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Clean build**

Run: `dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj`
Expected: Build succeeded, 0 errors, no new warnings from the changed files.

- [ ] **Step 2: Keyboard trigger + count**

`preview_eval`: `document.dispatchEvent(new KeyboardEvent('keydown', {key:'k', ctrlKey:true, bubbles:true})); document.querySelectorAll('.cmdk-row').length`
Expected: `11`.

- [ ] **Step 3: Fuzzy filter**

`preview_eval`: `(() => { const i=document.querySelector('.cmdk-input'); i.value='git'; i.dispatchEvent(new Event('input',{bubbles:true})); return [...document.querySelectorAll('.cmdk-row-label')].map(e=>e.textContent); })()`
Expected: `["GitHub"]`.

- [ ] **Step 4: Keyboard nav + Escape**

`preview_eval`: clear and reopen, then `(() => { const i=document.querySelector('.cmdk-input'); i.value=''; i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true})); const a=document.querySelector('.cmdk-row--active .cmdk-row-label').textContent; i.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); return { active:a, closed: document.querySelector('.cmdk-overlay').hidden }; })()`
Expected: `active` is `"About"` (second row after ArrowDown); `closed` becomes `true` after the close transition (re-check after ~250ms if needed).

- [ ] **Step 5: Navigation action**

`preview_eval`: open, set query `about`, press Enter, then verify route:
`(() => { window.commandPalette.open(); const i=document.querySelector('.cmdk-input'); i.value='about'; i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); return 'submitted'; })()`
Then, in a separate `preview_eval`: `window.location.pathname` → Expected: `/about`. Navigate back: `window.location.assign('/')`.

- [ ] **Step 6: Copy action does not error**

`preview_eval`: open, filter `copy`, Enter; confirm no exception and the row shows confirmation:
`(() => { window.commandPalette.open(); const i=document.querySelector('.cmdk-input'); i.value='copy'; i.dispatchEvent(new Event('input',{bubbles:true})); const li=document.querySelector('.cmdk-row'); li.click(); return document.querySelector('.cmdk-row-hint') ? document.querySelector('.cmdk-row-hint').textContent : 'closed'; })()`
Expected: `"Copied!"` (or `"closed"` if the row already removed) — no thrown error either way.

- [ ] **Step 7: Navbar untouched + regression**

Snapshot `/` (`preview_snapshot`): confirm the five nav links + Contact button are still present and the `Ctrl K` chip appears. Navigate to `/HeatSimulation`: confirm `document.querySelectorAll('.katex').length` is `6` and `preview_console_logs` (level error) is empty. Confirm the maze canvas `#bg` still exists.

- [ ] **Step 8: Responsive**

`preview_resize` mobile (375px); open the palette and `preview_screenshot`.
Expected: panel fits within the viewport; navbar chip shows just the magnifier icon (keys hidden under 600px).

- [ ] **Step 9: Capture proof + hold for commit**

`preview_screenshot` of the open palette on desktop for the user. Report completion. **Do not commit** — wait for explicit approval.

---

## Self-Review

**Spec coverage:**
- Spec "Architecture decision" (vanilla JS module) → Task 1 ✓
- Spec "Files" (4 files) → Task 1 (create js), Task 2 (App.razor), Task 3 (app.css), Task 4 (MainLayout) ✓
- Spec "Action list" (7 nav + 3 external + 1 copy, exact hrefs/URLs/email) → Task 1 `ACTIONS` array ✓
- Spec "Behavior" (open/close, ⌘K & Ctrl+K, fuzzy filter, ↑/↓/Enter, nav via synthesized anchor, external new tab, copy + confirmation, Tab focus-trap, Esc/backdrop) → Task 1 module; verified Tasks 2-6 ✓
- Spec "Platform display" (⌘K on Mac / Ctrl K else, both accepted) → `isMac`, trigger accepts `metaKey||ctrlKey`, `wireChips` swaps keycap ✓
- Spec "A11y/polish" (role=dialog, focus restore, prefers-reduced-motion, lazy single element) → present in `build`/`open`/`close` ✓
- Spec "Discoverability" (navbar chip) → Task 4 ✓
- Spec "Theming" (tokens, Space Grotesk / JetBrains Mono, maze visible behind) → Task 3 CSS ✓
- Spec "Out of scope" / "Non-functional" (no deps, removable, no regressions, works pre-circuit) → Task 1 is plain script; Task 5 Step 7 verifies regressions ✓
- Spec "Success criteria" 1-6 → Task 5 Steps 2-8 map to each ✓

**Placeholder scan:** No TBD/TODO/vague steps; every code step contains complete code; every verification step has an exact command + expected result. ✓

**Type/name consistency:** CSS classes used by the JS (`cmdk-overlay`, `cmdk-overlay--open`, `cmdk-panel`, `cmdk-input`, `cmdk-list`, `cmdk-row`, `cmdk-row--active`, `cmdk-row--copied`, `cmdk-row-label`, `cmdk-row-hint`, `cmdk-row-icon`, `cmdk-empty`, `cmdk-footer`, `cmdk-trigger`, `cmdk-trigger-keys`) are all defined in Task 3 CSS. `data-cmdk-keycap` attribute set in Task 4 markup is read by `wireChips` in Task 1. `window.commandPalette.{open,close,toggle}` defined in Task 1, used in Tasks 4-6. Design tokens (`--bc-accent-border`, `--bc-accent-dim`, `--bc-accent-light`, `--bc-radius-lg`, `--bc-bg-deep`, `--bc-border`, `--bc-text-*`) all exist in app.css `:root`. ✓
