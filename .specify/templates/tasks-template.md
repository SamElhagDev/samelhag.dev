# Task List — [FEATURE_NAME]

**Feature ID:** [FEATURE_ID]
**Generated:** [TASKS_DATE]
**Total Tasks:** [TASK_COUNT]

> Tasks are ordered by dependency. Complete earlier tasks before starting later ones
> unless explicitly marked as parallelizable.

---

## Setup / Scaffolding Tasks

- [ ] **T-01** — [Task title]
  - **Description:** [What to do]
  - **Acceptance:** [How to verify done]
  - **Principle:** P5 (Simplicity)
  - **Parallelizable:** No

---

## UI Component Tasks (P1 — Blazor-First)

- [ ] **T-02** — Create [ComponentName].razor
  - **Description:** Implement [component] using MudBlazor primitives.
    Component MUST stay under 300 lines of Razor markup.
  - **Acceptance:** Component renders correctly; logic > 50 lines extracted to .razor.cs
  - **Principle:** P1, P5
  - **Parallelizable:** Yes (after T-01)

- [ ] T026 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T027 [US3] Implement [Service] in src/services/[service].py
- [ ] T028 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

## Performance Tasks (P2 — Performance by Default)

- [ ] **T-03** — Verify performance targets
  - **Description:** Run Lighthouse against the feature page/section. Confirm
    FCP ≤ 1.5 s and TTI ≤ 2 s. If animations added, cap at 30 fps.
  - **Acceptance:** Lighthouse report attached to PR; no regression from baseline.
  - **Principle:** P2
  - **Parallelizable:** No (after all UI tasks)

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Content / Authenticity Tasks (P4 — Personal Authenticity)

- [ ] **T-04** — Replace all placeholder copy
  - **Description:** Ensure no "Lorem ipsum" or TODO copy exists in production markup.
    All content reflects Sam's actual background and accurate contact details.
  - **Acceptance:** Manual review passes; grep for "TODO\|lorem\|placeholder" returns 0
    matches in production Razor files.
  - **Principle:** P4
  - **Parallelizable:** Yes

---

## Testing Tasks

- [ ] **T-05** — Write smoke/unit test for [ComponentName]
  - **Description:** Add bUnit test confirming component renders without exceptions
    and key UI elements are present.
  - **Acceptance:** `dotnet test` passes; new test file added under Tests/ project.
  - **Principle:** P5
  - **Parallelizable:** Yes (alongside T-02)

---

## Cleanup / Definition of Done

- [ ] **T-06** — Final checklist
  - [ ] No commented-out code blocks remain
  - [ ] No new NuGet packages without PR justification
  - [ ] `dotnet run` works from clean clone
  - [ ] Constitution compliance section completed in plan.md
  - [ ] All tasks above marked complete

---

## Notes

[Any additional implementation notes or context for the implementer.]
