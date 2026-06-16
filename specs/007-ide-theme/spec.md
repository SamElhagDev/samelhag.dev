# IDE / Terminal-Dark Re-theme — Design

**Date:** 2026-06-15
**Status:** Approved (design), pending implementation plan
**Scope:** Site-wide visual re-theme, driven mostly through the shared design system in `app.css`
**Relates to:** Approach C from the home-page brainstorm ("technical-document re-theme"). Direction A (IDE/terminal dark) was selected over light-paper (B) and blueprint (C-variant).

## Goal

Replace the "premium AI dark" aesthetic — glassmorphism (backdrop-blur translucent cards)
and copper glow (gradient text, drop-shadows, glowing borders) — with a flat, precise,
IDE/terminal-dark language: solid panels, hairline borders, one flat copper "syntax" accent,
and monospace for labels. Audience is technical peers; the look should read as a code editor
or technical document, not a marketing site.

## Direction decisions (from brainstorm)

- **Direction:** IDE / terminal dark. Keep the dark base, the maze background, and the copper
  accent; remove glass and glow; flatten everything.
- **Background (maze):** tone it down — dimmer glows, calmer/sparser motion — so it reads as a
  quiet technical grid behind flat UI. Not removed.
- **Type:** monospace (`JetBrains Mono`) for labels only — eyebrows, metadata, metrics, nav
  hints. Headings stay `Space Grotesk`; prose stays `Inter`.
- **Accent:** keep copper (`--bc-accent` `#f97316`), but used flat — solid fills and hairline
  accent borders, never gradients or glow.

## North star (already in the codebase)

Two existing pieces are already in the target language and serve as the reference:
- The **command palette** ([command-palette.js](../../SamElhagPersonalSite/wwwroot/js/command-palette.js)
  + its styles in [app.css](../../SamElhagPersonalSite/wwwroot/app.css)): flat panel, hairline
  border, monospace keycaps, a single solid copper accent.
- The **About "Anatomy of a Sam.E" code blocks**
  ([About.razor](../../SamElhagPersonalSite/Components/Pages/About.razor)): syntax-highlighted,
  monospace, IDE-flavored.

The re-theme is, in effect, "make the rest of the site look like those two."

## Approach — token-first, then sweep

Most styling flows through shared utility classes and `--bc-*` tokens in `app.css`, so
redefining those cascades site-wide from one file. Then a targeted pass fixes the inline
`style="..."` attributes that don't go through any class, and the maze is dimmed.

1. **Design tokens + shared classes** in `app.css` (the bulk of the work).
2. **MudTheme palette + app-bar** inline styles in `MainLayout.razor`.
3. **Inline-style hotspots** in the Razor pages.
4. **Maze dimming** in `maze-background.js`.

## The translation (current → IDE-dark)

| Element | Now | IDE-dark |
|---|---|---|
| Panels (`.glass-card*`) | translucent + 20px blur, 16–20px radius, copper-glow borders | solid `var(--bc-bg-surface)`, no blur, `--bc-radius-lg` (8px), 1px hairline `var(--bc-border)` |
| Featured panel (`.glass-card--featured`) | copper border + glow shadow | solid surface, 1px `var(--bc-accent-border)`, no shadow |
| Filled buttons (`.btn-gradient`) | copper gradient + glow shadow, 10px radius | solid `var(--bc-accent)`, no shadow, `--bc-radius` (6px), darken on hover |
| Outlined buttons (`.btn-outlined-blue/cyan`) | 2px copper border + translucent fill + blur | 1px `var(--bc-border)`, transparent fill, no blur; border → `--bc-accent` on hover |
| Brand / hero glow (`.text-gradient-brand`, hero `text-shadow`) | gradient clip + glow | solid `var(--bc-accent-light)` / parchment, no glow |
| Icon boxes (`.icon-box--*`) | copper gradients | solid flat `var(--bc-accent)` fill (white icon retained) |
| Chips (`.chip-*`) | translucent copper/tinted fills + copper borders | solid `var(--bc-bg-elevated)`, 1px `var(--bc-border)`, `--accent` variants get copper text — mono |
| Bands / panels (`.section-band`, `.expansion-panel-glass`, `.footer-social-btn`) | blur + translucent | solid surface + 1px hairline, no blur |
| Eyebrows / metadata / metrics | mixed | `JetBrains Mono`, uppercase, muted |
| Radius scale (`--bc-radius`/`-lg`/`-xl`) | 8 / 14 / 20px | 6 / 8 / 10px |

Additionally: remove all `text-shadow`, `filter: drop-shadow(...)`, and glow `box-shadow`
rules wherever they appear (class or inline). Single-sided flat accents like the KaTeX
container's `border-left: 4px solid #f97316` may stay — they read as precise, not glow.

## MudTheme palette + app bar (`MainLayout.razor`)

- `_theme.PaletteDark.AppbarBackground`: `#131110e6` (translucent) → solid `#131110`.
- `_theme.LayoutProperties.DefaultBorderRadius`: `8px` → `6px`.
- App-bar inline style: remove `backdrop-filter: blur(10px)`; solid background; bottom border
  `1px solid var(--bc-border)` (neutral, not copper glow).
- Contact nav button inline gradient → solid `var(--bc-accent)`, `--bc-radius`, no glow shadow.
- Footer panel inline (`backdrop-filter: blur`, translucent) → solid surface + 1px hairline top
  border.

## Inline-style hotspots (per file)

- **`Home.razor`** — hero `text-shadow` glow removed; featured band and chips already use shared
  classes (re-themed via `app.css`).
- **`About.razor`** — the outer `MudPaper` and `.wia-inner-card` backgrounds use `backdrop-filter:
  blur` + copper-glow borders → solid + 1px hairline. The syntax-highlight color palette
  (`.syn-*`) stays unchanged (it is the IDE motif).
- **`ProjectShowcase.razor` / `HeatTransfer.razor`** — inline `background: rgba(19,17,16,0.95)`
  panels with copper borders → solid + hairline; remove any blur/glow. KaTeX `border-left`
  accent stays.
- **`Projects.razor` / `Contact.razor` / `Interests.razor`** — flatten any inline glass/gradient/
  glow to the shared flat treatment; otherwise rely on the re-themed shared classes.

## Maze dimming (`maze-background.js`)

Keep the structure; reduce intensity so it reads as a quiet technical grid:
- Lower `palette.glow` alphas and the `drawGlows()` radial-gradient opacity.
- Reduce particle glow (`glowSize`, glow alpha) and trail opacity.
- Reduce `drawCorridorArrows()` `globalAlpha`.
- Optionally reduce particle/pulse counts and slow `time` increment slightly for calmer motion.
- Keep the maze line work, basis vectors, and floating math glyphs (they fit the technical feel),
  just dimmer. Preserve the existing enhanced-navigation self-heal logic untouched.

## What stays / out of scope

- **Stays:** copper accent (flat), the maze (dimmed), all content/copy, `Space Grotesk` headings
  + `Inter` prose, the About code-interface concept, the command palette, the `005`/`006` work.
- **Out of scope:** no content/copy rewrites, no layout/structure changes, no routing changes, no
  new dependencies, no light-mode/paper variant, no changes to simulation logic or the home-page
  information architecture.

## Non-functional requirements

- Achieve the bulk of the change through `app.css` tokens/classes (DRY cascade); inline edits
  only where no class governs the style.
- No new NuGet/JS/CSS dependencies; reuse existing fonts (already loaded).
- Preserve responsiveness and the existing component structure (MudBlazor).
- No regressions to the maze background's navigation self-heal, KaTeX rendering, the simulation,
  or the command palette's behavior.

## Success criteria

1. No `backdrop-filter: blur`, gradient text, gradient buttons, or glow `box-shadow`/`text-shadow`
   remain in the themed surfaces; panels are solid with hairline borders.
2. Copper appears only as a flat accent (solid fills, hairline/active borders) — no gradients.
3. Eyebrows, metadata, and metrics render in `JetBrains Mono`; headings/prose unchanged.
4. The maze background is visibly calmer/dimmer but still present and animating.
5. Every page (Home, About, Interests, Projects, Project Showcase, Heat Simulation, Contact)
   reads in the consistent flat IDE-dark language with no leftover glass/glow.
6. No regressions: maze self-heal, KaTeX (6 equations), the live simulation, and the command
   palette all still work; no new console errors.
