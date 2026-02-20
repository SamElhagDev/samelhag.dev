# Implementation Plan — [FEATURE_NAME]

**Feature ID:** [FEATURE_ID]
**Plan Version:** [PLAN_VERSION]
**Created:** [PLAN_DATE]
**Author:** Sam Elhag

---

## 1. Overview

[Brief description of what this plan covers and why it is being built.]

---

## 2. Constitution Compliance

Map each active principle to this feature:

| Principle | Status | Notes |
|---|---|---|
| P1 — Blazor-First Architecture | ✅ / ⚠ Exception | [statement] |
| P2 — Performance by Default | ✅ / ⚠ Exception | [statement] |
| P3 — Single Stellar Showcase | ✅ / ⚠ Exception | [statement or N/A] |
| P4 — Personal Authenticity | ✅ / ⚠ Exception | [statement or N/A] |
| P5 — Maintainability and Simplicity | ✅ / ⚠ Exception | [statement] |

> Exceptions require owner approval before implementation.

---

## 3. Design Decisions

### 3.1 Approach

[Describe the chosen implementation approach and why it was selected over alternatives.]

### 3.2 Alternatives Considered

| Alternative | Why Rejected |
|---|---|
| [Alt 1] | [Reason] |

### 3.3 Data / State Model

[Describe any data structures, state management, or models introduced.]

---

## 4. Component Design

### New Components

| Component | Path | Responsibility |
|---|---|---|
| [ComponentName].razor | Components/[path] | [single responsibility] |

### Modified Components

| Component | Path | Change Summary |
|---|---|---|
| [ComponentName].razor | Components/[path] | [what changes and why] |

---

## 5. Performance Considerations

- [ ] FCP target ≤ 1.5 s maintained
- [ ] No synchronous JS blocking the render pipeline
- [ ] Images lazy-loaded if added
- [ ] Animation throttled to ≤ 30 fps if added
- [ ] Static assets cached appropriately

---

## 6. Testing Plan

| Test Type | Description | Tool |
|---|---|---|
| Smoke | App starts and page loads | Manual / bUnit |
| Functional | [key user flow] works end-to-end | bUnit / Playwright |
| Performance | Lighthouse score regression | Lighthouse CI |

---

## 7. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk description] | Low/Med/High | Low/Med/High | [mitigation] |

---

## 8. Open Questions

- [ ] [Question requiring owner decision before implementation]

---

## 9. Definition of Done

- [ ] All new components under 300 lines of Razor
- [ ] No dead code or commented-out blocks merged
- [ ] Constitution compliance verified (§2 above)
- [ ] Performance targets confirmed (§5 above)
- [ ] Tests passing (§6 above)
- [ ] PR description includes NuGet justification for any new packages
