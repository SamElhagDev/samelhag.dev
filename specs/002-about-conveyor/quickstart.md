# Quickstart: Conveyor Belt Timeline Verification

**Branch**: `002-about-conveyor`
**Purpose**: Step-by-step guide to run the app and verify the conveyor belt implementation is correct

---

## 1. Start the App

```bash
dotnet run --project SamElhagPersonalSite.AppHost
```

Navigate to the URL printed by Aspire (typically `https://localhost:7xxx`).

---

## 2. Navigate to the About Page

Go to `/about` (click **About** in the nav bar or type the URL directly).

---

## 3. Visual Checks — Desktop (≥ 1080 px wide)

Scroll down past the Skills section to **"The Path So Far"** heading.

| Check | What to look for | Pass |
|---|---|---|
| Horizontal layout | Tiles arranged **left to right** — not stacked vertically | ☐ |
| Square tiles | Each tile is rectangular with sharp corners (≤ 8 px radius) | ☐ |
| No circles | **Zero** circular containers or dot connectors in the timeline | ☐ |
| Rail visible | A horizontal line or gradient track runs between/behind the tiles | ☐ |
| Chevron direction | Right-facing `›` connectors between tiles (not on the last tile) | ☐ |
| Five milestones | Count: WVU (start) · Core10 · Agile5 · WVU (grad) · Steel Dynamics | ☐ |
| Chronological order | Earliest (Aug 2015) on the left; Current (Steel Dynamics) on the right | ☐ |
| Current role styled | Steel Dynamics tile visually distinct — different border colour or "CURRENT" chip | ☐ |
| Category chips | Each tile shows a chip: Education / CO-OP / Contract / Industry | ☐ |
| Content hierarchy | Role title clearly dominant; org name and date range secondary | ☐ |
| Hover effect | Tiles lift slightly or border brightens on mouse hover | ☐ |
| Dark theme match | Tile background matches Skills card style (glassmorphism, dark blue) | ☐ |

---

## 4. Visual Checks — Tablet (≤ 960 px)

Open browser DevTools → toggle device toolbar → set width to **768 px**.

| Check | What to look for | Pass |
|---|---|---|
| All tiles accessible | Scroll horizontally or layout wraps — no tile clipped or hidden | ☐ |
| Section still readable | No overlapping text; tiles remain legible | ☐ |
| Chronological order kept | Same left-to-right or top-to-bottom order as desktop | ☐ |

---

## 5. Visual Checks — Mobile (≤ 600 px)

Set DevTools width to **375 px** (iPhone SE).

| Check | What to look for | Pass |
|---|---|---|
| Tiles narrow correctly | Tiles around 240 px wide — still readable | ☐ |
| No horizontal overflow | No unintended horizontal scrollbar on the whole page | ☐ |
| Rail adapts | Rail line thinner (2 px) or hidden gracefully | ☐ |

---

## 6. Console & Network Check

Open DevTools → **Console** tab.

| Check | What to look for | Pass |
|---|---|---|
| No JS errors | Zero errors related to About page or MudBlazor | ☐ |
| No 404s | No missing images, fonts, or CSS files in the Network tab | ☐ |

---

## 7. Lighthouse Audit (Optional)

Run Lighthouse on the About page in incognito mode.

| Metric | Target |
|---|---|
| First Contentful Paint | ≤ 1.5 s |
| Time to Interactive | ≤ 2.0 s |
| Performance score | ≥ 90 |

---

## 8. Reference — Five Milestones (exact content)

| # | Role | Organisation | Date | Category | Current |
|---|---|---|---|---|---|
| 1 | Student | West Virginia University | Aug 2015 | Education | No |
| 2 | Application Developer (CO-OP) | Core10 | Jul 2017 → Jun 2018 | CO-OP | No |
| 3 | Application Developer (Contract) | Agile5 Technologies, Inc. | Oct 2018 → Apr 2019 | Contract | No |
| 4 | Student | West Virginia University | Jul 2019 | Education | No |
| 5 | Software Engineer / Analyst | Steel Dynamics | Jul 2019 → Present | Industry | **Yes** |

All five must be present and in the order above (left to right) for the implementation to be considered complete.
