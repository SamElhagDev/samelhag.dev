# Feature Specification — [FEATURE_NAME]

**Feature ID:** [FEATURE_ID]
**Spec Version:** [SPEC_VERSION]
**Created:** [SPEC_DATE]
**Status:** Draft / Under Review / Approved
**Author:** Sam Elhag

---

## 1. Summary

[One-paragraph description of what this feature is and what problem it solves for
the site's visitors or owner.]

---

## 2. Goals

- [Goal 1 — measurable outcome]
- [Goal 2]

## 3. Non-Goals

- [Explicit exclusion 1 — what this feature intentionally does NOT do]
- [Explicit exclusion 2]

---

## 4. Constraints (from Constitution)

The following constraints from the Project Constitution apply to this feature:

- **P1 (Blazor-First):** All UI implemented as .razor components; no JS UI frameworks.
- **P2 (Performance):** FCP ≤ 1.5 s, TTI ≤ 2 s; animations ≤ 30 fps.
- **P3 (Single Showcase):** [Applicable / N/A — reason]
- **P4 (Authenticity):** No placeholder content in production.
- **P5 (Simplicity):** Components ≤ 300 lines; no dead code.

---

## 5. User Stories

### Story 1 — [Short Title]

**As a** [visitor / recruiter / Sam],
**I want** [capability],
**So that** [value delivered].

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## 6. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | [Requirement description] | Must Have |
| FR-02 | [Requirement description] | Should Have |
| FR-03 | [Requirement description] | Nice to Have |

---

## 7. Non-Functional Requirements

| ID | Requirement | Measure |
|---|---|---|
| NFR-01 | Page load performance | FCP ≤ 1.5 s (Lighthouse) |
| NFR-02 | Accessibility | WCAG 2.1 AA — no critical violations |
| NFR-03 | [Additional NFR] | [Measure] |

---

## 8. UI / UX Notes

[Description of the intended look and feel, referencing MudBlazor components
where applicable. Mention glass-morphism theme, Inter/Space Grotesk fonts, dark
palette as defaults.]

---

## 9. Out of Scope

Per the Constitution's Non-Goals (§4), the following are explicitly excluded:

- Authentication / user accounts
- Database-backed dynamic content
- Payment or e-commerce flows

---

## 10. Open Questions

| # | Question | Owner | Due |
|---|---|---|---|
| 1 | [Question] | Sam | [date] |

---

## 11. Revision History

| Version | Date | Summary |
|---|---|---|
| 1.0.0 | [date] | Initial draft |
