<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)
Modified principles: N/A — initial creation
Added sections:
  - Project Identity
  - Core Principles (5 principles):
      1. Blazor-First Architecture
      2. Performance by Default
      3. Single Stellar Showcase
      4. Personal Authenticity
      5. Maintainability and Simplicity
  - Governance
Templates requiring updates:
  - .specify/templates/plan-template.md       ✅ pending creation
  - .specify/templates/spec-template.md       ✅ pending creation
  - .specify/templates/tasks-template.md      ✅ pending creation
  - .specify/templates/commands/*.md          ✅ sourced from .claude/commands/
Deferred TODOs:
  - TODO(RATIFICATION_DATE): Exact adoption date unknown; set to initial commit
    date 2026-02-19 (today).
-->

# Project Constitution — Sam Elhag Personal Portfolio

**Version:** 1.0.0
**Ratification Date:** 2026-02-19
**Last Amended:** 2026-02-19
**Status:** Active

---

## 1. Project Identity

**Project Name:** Sam Elhag Personal Portfolio Website

**Mission:** Deliver a fast, elegant, and authentic personal portfolio that presents Sam Elhag
as a skilled engineer, showcases one exemplary project with depth, and makes it effortless
for visitors to learn about and contact him.

**Technology Stack (non-negotiable):**
- Runtime: .NET 10
- UI Framework: Blazor Server with interactive server-side rendering
- Component Library: MudBlazor 8.x
- Deployment Target: Azure (via .NET Aspire)

**Audience:** Recruiters, collaborators, engineers, and curious visitors who want to understand
Sam's engineering background and capabilities.

---

## 2. Core Principles

### Principle 1 — Blazor-First Architecture

All UI MUST be implemented as Blazor components (.razor files). JavaScript interop is
permitted only for capabilities that have no Blazor equivalent (e.g., Canvas animation,
browser APIs). No third-party JavaScript UI frameworks (React, Vue, Angular) are permitted.
MudBlazor MUST be the sole component library; custom CSS is allowed for theming and
layout overrides only.

**Rationale:** The stack choice (.NET 10 / Blazor / MudBlazor) is a deliberate architectural
signal of Sam's expertise in the Microsoft ecosystem. Diluting it with JS frameworks
undermines that message.

### Principle 2 — Performance by Default

Every page MUST achieve a First Contentful Paint ≤ 1.5 s and Time to Interactive ≤ 2 s
on a mid-range device on a 4G connection (measured via Lighthouse). Response compression
(Brotli preferred, Gzip fallback) MUST be enabled. Static assets MUST carry cache headers
of at least one year. Animations MUST be throttled and MUST NOT exceed 30 fps on the
animated background. Image assets MUST use lazy loading and async decoding.

**Rationale:** A portfolio site that loads slowly or janks reflects poorly on the engineer
it represents. Performance IS a feature, not an afterthought.

### Principle 3 — Single Stellar Showcase

The site MUST feature exactly one primary project showcase presented in depth. The
showcase MUST include: a clear problem statement, the solution approach, the technology
used, measurable outcomes or results, and an interactive or visual demonstration where
feasible. Additional projects MAY appear as secondary cards but MUST NOT compete
visually with the primary showcase.

**Rationale:** "One really good project" (per owner intent) presented with depth is more
compelling to evaluators than a shallow grid of many projects. Depth signals engineering
maturity.

### Principle 4 — Personal Authenticity

All copy, biography, and project descriptions MUST reflect Sam's actual background,
skills, and experience. Placeholder or generic content MUST NOT appear in production
builds. The About section MUST include: professional summary, current focus areas,
education or background, and a way to reach Sam. Contact information MUST be accurate
and up-to-date.

**Rationale:** A portfolio is a personal statement. Inauthentic or generic content erodes
trust and fails the site's core purpose.

### Principle 5 — Maintainability and Simplicity

Components MUST be kept small and single-purpose. Pages MUST NOT exceed 300 lines of
Razor markup; logic exceeding this SHOULD be extracted to code-behind (.razor.cs) files
or services. No dead code or commented-out blocks MUST exist in production branches.
Dependencies MUST be kept minimal; a new NuGet package requires justification in the
PR description. The codebase MUST remain buildable and runnable from a clean clone with
a single `dotnet run` command.

**Rationale:** A personal site is maintained by one person. Complexity accumulates quickly;
this principle protects long-term velocity and makes the codebase a positive example if
shown to others.

---

## 3. Governance

### Amendment Procedure

1. Open a GitHub issue titled `[Constitution] <summary of proposed change>`.
2. Describe the motivation, the exact text change, and which principle(s) are affected.
3. Self-review using the Sync Impact Report checklist (see below).
4. Update `CONSTITUTION_VERSION` per semantic versioning rules (see §3.2).
5. Update `LAST_AMENDED` to the date of merge.
6. Update all dependent templates listed in §3.3.
7. Merge with a commit message following the pattern:
   `docs: amend constitution to vX.Y.Z (<short rationale>)`

### Versioning Policy

| Change Type | Version Bump |
|---|---|
| Principle removed or fundamentally redefined | MAJOR |
| New principle or new mandatory section added | MINOR |
| Wording clarification, typo fix, formatting | PATCH |

### Compliance Review

Each feature specification (spec.md) and implementation plan (plan.md) produced by
speckit MUST include a "Constitution Compliance" section that maps every principle to
either a confirmed compliance statement or an explicit exception with justification.
Exceptions require owner approval before implementation proceeds.

### Dependent Templates

The following templates MUST be kept consistent with this constitution:

| Template | Path | Governs |
|---|---|---|
| Plan Template | `.specify/templates/plan-template.md` | Design decisions, constitution check |
| Spec Template | `.specify/templates/spec-template.md` | Requirements scope and constraints |
| Tasks Template | `.specify/templates/tasks-template.md` | Task types and principle-driven tasks |

---

## 4. Non-Goals (Explicit Exclusions)

The following are explicitly out of scope for this project and MUST NOT be introduced
without a constitution amendment:

- E-commerce or payment flows
- User authentication or accounts
- CMS or database-backed content (all content is code-managed)
- Server-side API backends beyond Blazor's built-in SignalR hub
- Multiple language / i18n support

---

## 5. Revision History

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0.0 | 2026-02-19 | Sam Elhag | Initial ratification |
