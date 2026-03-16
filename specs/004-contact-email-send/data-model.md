# Data Model: Contact Page Email Send

**Feature Branch**: `004-contact-email-send`
**Date**: 2026-03-15

## Entities

### ContactFormModel

Represents the visitor's form submission. Already exists inline in `Contact.razor` — will be extracted to `Models/ContactFormModel.cs`.

| Field     | Type   | Required | Validation                        |
|-----------|--------|----------|-----------------------------------|
| FirstName | string | Yes      | Non-empty                         |
| LastName  | string | Yes      | Non-empty                         |
| Email     | string | Yes      | Valid email format (`EmailAddressAttribute`) |
| Subject   | string | Yes      | Non-empty                         |
| Message   | string | Yes      | Non-empty, max 10,000 characters  |

**State transitions**: None — this is a transient data transfer object. Created when the visitor fills the form, consumed by the email service, then discarded.

---

### EmailSettings

Configuration object bound from `appsettings.json`. Represents SMTP connection details and email metadata.

| Field        | Type   | Required | Description                                  | Secret? |
|--------------|--------|----------|----------------------------------------------|---------|
| Host         | string | Yes      | SMTP server hostname (e.g., `smtp.gmail.com`) | No      |
| Port         | int    | Yes      | SMTP port (e.g., `587` for STARTTLS)          | No      |
| SenderEmail  | string | Yes      | The "from" address for outgoing emails        | No      |
| SenderName   | string | Yes      | Display name for the sender (e.g., "Portfolio Contact Form") | No |
| Username     | string | Yes      | SMTP authentication username                  | Yes     |
| Password     | string | Yes      | SMTP authentication password (App Password)   | Yes     |
| RecipientEmail | string | Yes   | Where contact form emails are delivered        | No      |

**Note**: `Username` and `Password` MUST be stored in user secrets (dev) or environment variables (prod), never in `appsettings.json`.

---

## Relationships

```
ContactFormModel  ──sends via──▶  IEmailService  ──uses──▶  EmailSettings
                                       │
                                       ▼
                                  SMTP Server (Gmail)
                                       │
                                       ▼
                                Sam's Inbox (RecipientEmail)
```

There is no database persistence. `ContactFormModel` is a transient DTO that flows from the Blazor component through the email service to the SMTP server.
