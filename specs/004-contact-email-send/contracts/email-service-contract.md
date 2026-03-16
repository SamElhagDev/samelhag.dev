# Service Contract: IEmailService

**Feature Branch**: `004-contact-email-send`
**Date**: 2026-03-15

## Interface

```csharp
public interface IEmailService
{
    Task SendContactEmailAsync(ContactFormModel model);
}
```

## Behavior

### `SendContactEmailAsync(ContactFormModel model)`

**Purpose**: Sends a contact form submission as an email to the configured recipient.

**Input**: A validated `ContactFormModel` with all required fields populated.

**Output**: Completes successfully (returns `Task`) if the email was accepted by the SMTP server.

**Errors**: Throws an exception if the email cannot be sent (SMTP connection failure, authentication failure, rejected by server). The caller (`Contact.razor`) catches exceptions and shows a generic error to the visitor.

**Email composition**:
- **From**: `EmailSettings.SenderEmail` with display name `EmailSettings.SenderName`
- **To**: `EmailSettings.RecipientEmail`
- **Reply-To**: `model.Email` (the visitor's email address)
- **Subject**: `Contact Form: {model.Subject}`
- **Body** (plain text):
  ```
  New contact form submission from your portfolio site.

  Name: {model.FirstName} {model.LastName}
  Email: {model.Email}
  Subject: {model.Subject}

  Message:
  {model.Message}
  ```

## Registration

```csharp
// In Program.cs
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();
```

**Lifetime**: Transient — each email send gets a fresh SMTP connection. This is appropriate for low-volume use and avoids connection pooling complexity.

## Configuration Shape

```json
// appsettings.json (non-secret values only)
{
  "EmailSettings": {
    "Host": "smtp.gmail.com",
    "Port": 587,
    "SenderEmail": "sami.eltaj.elhag@gmail.com",
    "SenderName": "Portfolio Contact Form",
    "RecipientEmail": "sami.eltaj.elhag@gmail.com"
  }
}
```

```json
// User Secrets (dev) or Environment Variables (prod)
{
  "EmailSettings:Username": "sami.eltaj.elhag@gmail.com",
  "EmailSettings:Password": "<gmail-app-password>"
}
```
