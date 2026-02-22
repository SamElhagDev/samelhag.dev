# Quickstart: About Page Timeline Redesign (003-about-timeline-cleanup)

## Run the App

```bash
dotnet run --project SamElhagPersonalSite.AppHost
```

Navigate to: `http://localhost:[port]/about` — scroll past the Skills section to **"The Path So Far"**.

---

## What to Verify

### Layout
- [ ] Timeline is **vertical** — no horizontal scrollbar at any viewport width
- [ ] All 5 milestone cards are stacked top-to-bottom in chronological order
- [ ] A vertical rail line runs down the left side connecting all dots
- [ ] Each milestone has a circular dot node on the rail
- [ ] The rail line does NOT extend above the first dot or below the last dot

### Category Colours
- [ ] **WVU (Education)** — cyan dot + chip border (`#6FC9D7`)
- [ ] **Core10 (CO-OP)** — blue dot + chip border (`#5B8DEF`)
- [ ] **Agile5 (Contract)** — purple dot + chip border (`#9C27B0`)
- [ ] **WVU Graduation (Education)** — cyan dot (same as entry 1)
- [ ] **Steel Dynamics (Industry)** — steel-blue dot + chip border

### Current Role Highlight
- [ ] Steel Dynamics card has a brighter/stronger left border accent
- [ ] The Steel Dynamics dot on the rail **pulses** (glow animation)
- [ ] "CURRENT" chip badge is visible on the Steel Dynamics card

### Content Legibility
- [ ] Role title fully visible on all 5 cards
- [ ] Organisation name fully visible
- [ ] Date range fully visible
- [ ] Description text fully visible — **no ellipsis / truncation**
- [ ] Category chip visible on every card

### Responsive Checks
| Viewport | What to check |
|----------|---------------|
| 1440px desktop | Cards use available width; layout looks balanced |
| 768px tablet | Cards still left-aligned; no overflow |
| 375px mobile | Single column, rail/dots still visible; no horizontal scroll |

### Accessibility
- [ ] Enable OS "Reduce Motion" setting → pulsing dot animation stops
- [ ] Page still fully usable with motion disabled

### Build
```bash
dotnet build SamElhagPersonalSite/SamElhagPersonalSite.csproj
```
- [ ] **0 errors, 0 warnings**
