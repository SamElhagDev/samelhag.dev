# Implementation Plan: Contact Page Email Send

**Branch**: `004-contact-email-send` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-contact-email-send/spec.md`

## Summary

Wire the existing contact form's `SubmitForm()` method to a real email delivery service. The form UI, validation, and feedback mechanisms are already built — the only missing piece is server-side email sending. The approach uses MailKit (the recommended .NET email library) with SMTP configuration stored in `appsettings.json` / user secrets, injected into a service that the Contact page calls directly via Blazor Server's DI.

## Technical Context

**Language/Version**: C# 13 / .NET 10
**Primary Dependencies**: MudBlazor 8.x (existing), MailKit (new — industry-standard .NET email library, replaces obsolete `System.Net.Mail.SmtpClient`)
**Storage**: N/A — no database; emails are delivered directly via SMTP
**Testing**: Manual integration test (submit form → verify email arrives); unit tests optional for service isolation
**Target Platform**: Azure via Aspire AppHost (existing deployment pipeline)
**Project Type**: Web (Blazor Server — single project with Aspire orchestration)
**Performance Goals**: Email sent within 30 seconds of form submission (SC-001)
**Constraints**: No secrets in source control (SC-005); credentials via `dotnet user-secrets` in dev, Azure configuration in prod
**Scale/Scope**: Personal portfolio site — low volume (<10 messages/day expected)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| P1 — Blazor-First Architecture | **PASS** | Email service is a C# service injected into a Blazor component. No JavaScript involved. No new UI frameworks. |
| P2 — Performance by Default | **PASS** | Email send is async and non-blocking. No impact on page load (FCP/TTI). |
| P3 — Single Stellar Showcase | **PASS** | Contact page is not a showcase page. No conflict. |
| P4 — Personal Authenticity | **PASS** | Contact form sends real emails to Sam's real inbox. Fulfills constitution requirement for "a working contact form." |
| P5 — Maintainability and Simplicity | **PASS** | One new NuGet package (MailKit — justified: it's the standard .NET email library, `SmtpClient` is obsolete). One new service file + one config section. Contact.razor stays under 300 lines. |
| Non-Goals | **PASS** | No auth, no CMS, no database, no new JS. Email service uses built-in DI, not a separate API backend. |

**Gate result: ALL PASS — no violations.**

## Project Structure

### Documentation (this feature)

```text
specs/004-contact-email-send/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── email-service-contract.md
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
SamElhagPersonalSite/
├── Components/
│   └── Pages/
│       └── Contact.razor          # MODIFY — replace Task.Delay stub with service call
├── Services/
│   ├── IEmailService.cs           # NEW — email service interface
│   └── EmailService.cs            # NEW — MailKit SMTP implementation
├── Models/
│   └── ContactFormModel.cs        # NEW — extract from Contact.razor @code block
├── Program.cs                     # MODIFY — register email service + options binding
├── appsettings.json               # MODIFY — add EmailSettings section (no secrets)
└── appsettings.Development.json   # MODIFY — add EmailSettings placeholder
```

**Structure Decision**: The existing project has no `Services/` or `Models/` directories. These are standard .NET conventions and will be created. The `ContactFormModel` class currently lives inline in `Contact.razor` — extracting it to `Models/` follows the constitution's maintainability principle and allows the service to reference it.
