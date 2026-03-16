# Tasks: Contact Page Email Send

**Feature Branch**: `004-contact-email-send`
**Date**: 2026-03-15
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Phase 1: Setup

- [x] **T1**: Add MailKit NuGet package to `SamElhagPersonalSite.csproj`
- [x] **T2**: Add `EmailSettings` configuration section to `appsettings.json` (non-secret values only)
- [x] **T3**: Add `EmailSettings` placeholder to `appsettings.Development.json`

## Phase 2: Core Implementation

- [x] **T4**: Create `Models/ContactFormModel.cs` — extract model from `Contact.razor` inline class
- [x] **T5**: Create `Services/EmailSettings.cs` — configuration POCO for SMTP settings
- [x] **T6**: Create `Services/IEmailService.cs` — email service interface
- [x] **T7**: Create `Services/EmailService.cs` — MailKit SMTP implementation [depends: T5, T6]
- [x] **T8**: Register email service and options binding in `Program.cs` [depends: T5, T6, T7]

## Phase 3: Integration

- [x] **T9**: Update `Contact.razor` — inject `IEmailService`, replace `Task.Delay` stub with real service call, reference extracted `ContactFormModel`, retain form input on error [depends: T4, T8]

## Phase 4: Validation

- [x] **T10**: Build the project and verify no compilation errors
- [x] **T11**: Verify user secrets documentation in quickstart.md is accurate
