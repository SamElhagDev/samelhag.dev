# Research: Contact Page Email Send

**Feature Branch**: `004-contact-email-send`
**Date**: 2026-03-15

## R1: Email Library for .NET 10

**Decision**: Use **MailKit** (via NuGet package `MailKit`)

**Rationale**:
- `System.Net.Mail.SmtpClient` has been marked obsolete by Microsoft since .NET 6. Microsoft's official documentation recommends MailKit as the replacement.
- MailKit is the de-facto standard for email in .NET — actively maintained, battle-tested, and used across the ecosystem.
- Supports SMTP with STARTTLS and SSL/TLS, which is required by Gmail and most modern SMTP servers.
- Lightweight — adds only MailKit + MimeKit (its dependency) to the project.

**Alternatives considered**:
- `System.Net.Mail.SmtpClient`: Obsolete, lacks modern TLS support, Microsoft recommends against it.
- FluentEmail: Higher-level abstraction over MailKit. Adds unnecessary complexity for a single email use case. Last maintained less actively.
- SendGrid SDK: Vendor-specific, requires a SendGrid account. Overkill for a personal site; SMTP is more portable.
- Azure Communication Services Email: Requires Azure resource provisioning and additional SDK. Too heavy for this use case.

---

## R2: SMTP Provider for Personal Portfolio

**Decision**: Use **Gmail SMTP** with an App Password

**Rationale**:
- Sam's contact email is `sami.eltaj.elhag@gmail.com` (displayed on the contact page). Using Gmail SMTP allows sending from the same address that receives replies, maintaining consistency.
- Gmail SMTP is free for low-volume use (<500 emails/day), well within the expected <10 messages/day.
- App Passwords work with Google accounts that have 2FA enabled (which should be the case for security).
- SMTP settings: `smtp.gmail.com`, port `587` (STARTTLS) or `465` (SSL).

**Alternatives considered**:
- SendGrid Free Tier (100 emails/day): Good option but requires account setup, API key management, and domain verification. More moving parts for minimal benefit at this volume.
- Mailgun: Similar to SendGrid — requires account, domain verification. Better for higher-volume transactional email.
- Self-hosted SMTP: Requires server infrastructure, DNS records (SPF/DKIM/DMARC). Not practical for a portfolio site.

**Note**: If Gmail's SMTP limitations become an issue (rate limits, delivery problems), switching to SendGrid or another provider requires only changing the SMTP configuration values — no code changes needed, since the implementation is provider-agnostic SMTP.

---

## R3: Secret Management for SMTP Credentials

**Decision**: Use **.NET User Secrets** in development, **Azure App Configuration / Environment Variables** in production

**Rationale**:
- `dotnet user-secrets` is the built-in .NET mechanism for keeping secrets out of source control during development. It stores values in `%APPDATA%\Microsoft\UserSecrets\<app-id>\secrets.json`.
- In production (Azure via Aspire), secrets are injected via environment variables or Azure Key Vault references, which Aspire supports natively.
- `appsettings.json` will contain the configuration section structure with non-secret values (host, port, sender name) but no passwords.
- The `.gitignore` already excludes standard secret files. User Secrets are never in the project directory.

**Alternatives considered**:
- Hardcoding in `appsettings.json`: Violates SC-005 (no secrets in source control). Rejected.
- Azure Key Vault directly: Requires additional NuGet packages and Azure setup. Aspire can handle this at deployment time without extra code.
- Environment variables only: Works but `dotnet user-secrets` provides a better dev experience with structured JSON.

---

## R4: Email Formatting Approach

**Decision**: Use a **plain-text email body with structured layout** (not HTML templates)

**Rationale**:
- For a contact form notification email, plain text is sufficient and more maintainable than HTML templates.
- The email is only seen by Sam — it doesn't need brand styling or rich formatting.
- Plain text avoids spam filter issues that can arise from HTML emails sent via personal SMTP.
- Content structure: sender name, sender email, subject, and message body clearly separated with labels.

**Alternatives considered**:
- HTML email with inline CSS: Over-engineered for a notification to a single recipient. Adds template maintenance burden.
- Razor-rendered email templates: Requires `RazorLight` or similar templating engine. Adds dependency for no real benefit.

---

## R5: Error Handling Strategy

**Decision**: **Catch SMTP exceptions in the service, log details server-side, return a simple success/failure result to the component**

**Rationale**:
- Blazor Server runs on the server, so exceptions in the email service don't expose stack traces to the client automatically.
- The Contact.razor component already has try/catch with a generic error snackbar — the service just needs to throw or return a result.
- Logging the exception details (via `ILogger`) allows Sam to diagnose delivery issues without exposing them to visitors.
- On failure, the form retains the visitor's input so they can retry (spec acceptance scenario US2-3).

**Alternatives considered**:
- Retry with Polly: Adds complexity. For a personal site, a simple "try again" message to the visitor is sufficient.
- Queue-based send with background worker: Over-engineered for <10 messages/day. Direct synchronous send is fine.
