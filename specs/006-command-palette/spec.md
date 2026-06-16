# Command Palette (⌘K) — Design

**Date:** 2026-06-15
**Status:** Approved (design), pending implementation plan
**Scope:** New client-side command palette overlay; small additions to `App.razor`, `app.css`, `MainLayout.razor`
**Relates to:** Approach B ("Authored craft") from the home-page brainstorm. The technical-document re-theme (Approach C) is a separate, later spec.

## Goal

Add a keyboard-driven command palette (⌘K / Ctrl+K) that lets a visitor jump anywhere on
the site instantly. The audience is technical peers; a fast, native-feeling palette is a
high-signal "this developer gets it" detail. It is purely additive — the existing navbar
and all navigation continue to work unchanged.

## Architecture decision

Implemented as a **single vanilla-JS module** loaded with a plain `<script>` tag (the same
way [maze-background.js](../../SamElhagPersonalSite/wwwroot/js/maze-background.js) is
loaded), **not** as a Blazor component.

Rationale: this is Blazor **Server**. A Razor component handling `@onkeydown`/`@bind` would
send every keystroke over the SignalR circuit and await a server re-render before the
filtered list repaints — visibly laggy. A client-side module keeps keystroke → filter →
paint entirely in the browser with zero circuit chatter, and works even before the circuit
connects. Blazor is only involved at the final navigation hop.

Alternatives rejected: MudBlazor dialog component (per-keystroke round-trip); hybrid
server-rendered action list (unnecessary wiring for ~11 static actions — YAGNI).

## Files

- **Create** `SamElhagPersonalSite/wwwroot/js/command-palette.js` — the entire feature:
  builds the overlay DOM on first open, the global `keydown` listener, fuzzy filtering,
  keyboard navigation, and action execution. Actions are defined as a static array in this
  file.
- **Modify** `SamElhagPersonalSite/Components/App.razor` — add
  `<script src="js/command-palette.js"></script>` alongside the existing scripts (after
  `maze-background.js`).
- **Modify** `SamElhagPersonalSite/wwwroot/app.css` — palette styles, reusing existing
  design tokens (`--bc-bg-surface`, `--bc-bg-elevated`, `--bc-accent`, `--bc-border`,
  `--bc-text-*`, glass blur) and fonts (`Space Grotesk` for labels, `JetBrains Mono` for
  shortcut hints/keycaps).
- **Modify** `SamElhagPersonalSite/Components/Layout/MainLayout.razor` — add a subtle,
  clickable `Ctrl K` hint chip in the `MudAppBar` (between the brand and the nav links, or
  just left of the nav group). Clicking it opens the palette. No existing app-bar element
  is removed.

## Action list (11 actions)

**Navigation (internal, 7)** — execute by synthesizing an `<a href>` click so Blazor
enhanced navigation handles it smoothly; fall back to `location.assign(href)`:

| Label | Href |
|---|---|
| Home | `/` |
| About | `/about` |
| Interests | `/interests` |
| Projects | `/projects` |
| Contact | `/contact` |
| Heat Transfer — Case Study | `/projects/heat-transfer` |
| Heat Transfer — Live Simulation | `/HeatSimulation` |

**External (open in new tab via `window.open(url, '_blank', 'noopener')`, 3):**

| Label | URL |
|---|---|
| GitHub | `https://github.com/SamElhagDev` |
| LinkedIn | `https://www.linkedin.com/in/sam-elhag-b82312102/` |
| X (Twitter) | `https://x.com/SamEElhag` |

**Utility (1):**

| Label | Action |
|---|---|
| Copy email address | `navigator.clipboard.writeText("sami.eltaj.elhag@gmail.com")`, then show a transient "Copied!" state in the row and close shortly after |

Each action carries: `label`, `type` (`nav` \| `external` \| `copy`), `value` (href/url/text),
optional `hint` (e.g. "Page", "External", "⌘C"), and an icon glyph (Font Awesome / emoji-free;
use existing FA classes already loaded site-wide, or a small inline SVG — keep it monochrome
to the copper palette).

## Behavior

**Open / close:**
- `⌘K` (Mac) or `Ctrl+K` (Win/Linux) toggles the palette. The handler calls
  `preventDefault()` so the browser's built-in shortcut is suppressed **only while the page
  has focus**.
- Clicking the navbar `Ctrl K` chip opens it.
- `Esc`, clicking the backdrop, or selecting an action closes it.

**Search & navigation:**
- The text input is autofocused on open.
- Filtering is a case-insensitive **subsequence fuzzy match** on the label; matched actions
  are ranked (e.g. earlier/contiguous matches rank higher), unmatched are hidden. Empty
  query shows all actions in declared order.
- `↑` / `↓` move the highlighted row (wrapping); `Enter` activates the highlighted row;
  mouse hover also highlights and click activates.
- After a `nav`/`external`/`copy` action runs, the palette closes (copy closes after a brief
  "Copied!" confirmation).

**Platform display:** detect Mac (`navigator.platform` / `userAgentData`) and render the
keycap hint as `⌘K` on Mac, `Ctrl K` elsewhere. Both `metaKey+k` and `ctrlKey+k` are
accepted as triggers regardless, so either OS works.

**Accessibility & polish:**
- Overlay container has `role="dialog"` and `aria-label="Command palette"`.
- Focus is trapped within the palette while open; on close, focus returns to the element
  that had focus before opening (or the navbar chip if opened via click).
- Respect `prefers-reduced-motion`: skip the open/close transition when set.
- The palette is a single top-level element appended to `document.body`, created lazily on
  first open and reused thereafter.

## Theming

Match the Copper & Black system: dark elevated surface (`--bc-bg-elevated`) with backdrop
blur, copper accent (`--bc-accent`) for the highlighted row and focus ring, `--bc-border`
hairlines, `Space Grotesk` labels, `JetBrains Mono` keycaps. The backdrop is a dimmed,
slightly blurred scrim over the page (the maze background stays visible behind it).

## Out of scope

- No changes to routing, the deep project/simulation pages, the maze background, or the
  home-page work from the prior spec.
- No server-side state, no new NuGet or JS/CSS dependencies (Font Awesome is already loaded).
- No search over page *content* — this navigates between known destinations only.
- Approach C (technical-document re-theme) — separate spec.

## Non-functional requirements

- Keystroke → filter → repaint happens entirely client-side (no SignalR round-trip).
- Self-contained and removable: deleting the script tag + the CSS block + the navbar chip
  fully removes the feature with no other code changes.
- No regression to existing navbar use (mouse or keyboard), the maze background, or KaTeX on
  other pages.
- Works on first paint before the Blazor circuit connects.

## Success criteria

1. `⌘K` / `Ctrl+K` (and the navbar chip) open a themed palette overlay; `Esc`/backdrop close it.
2. Typing filters the 11 actions; `↑`/`↓`/`Enter` and mouse both work.
3. Navigation actions land on the correct routes; external actions open in a new tab;
   "Copy email" writes the address to the clipboard with visible confirmation.
4. The existing navbar still works exactly as before; the only visible addition is the
   `Ctrl K` hint chip.
5. No new console errors; no regressions to the maze background or other pages.
6. The feature is contained to the four files listed above.
