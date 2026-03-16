# Quickstart: Contact Page Email Send

**Feature Branch**: `004-contact-email-send`
**Date**: 2026-03-15

## Prerequisites

1. .NET 10 SDK installed
2. A Gmail account with 2FA enabled
3. A Gmail App Password generated ([Google App Passwords](https://myaccount.google.com/apppasswords))

## Setup Steps

### 1. Install the MailKit package

```bash
cd SamElhagPersonalSite
dotnet add package MailKit
```

### 2. Initialize user secrets (if not already done)

```bash
dotnet user-secrets init
```

### 3. Set SMTP credentials in user secrets

```bash
dotnet user-secrets set "EmailSettings:Username" "sami.eltaj.elhag@gmail.com"
dotnet user-secrets set "EmailSettings:Password" "your-gmail-app-password-here"
```

### 4. Run the application

```bash
dotnet run --project SamElhagPersonalSite.AppHost
```

### 5. Test the contact form

1. Navigate to `https://localhost:<port>/contact`
2. Fill in all fields (first name, last name, email, subject, message)
3. Click "Send Message"
4. Verify: success notification appears and form clears
5. Check Sam's Gmail inbox for the delivered email
6. Verify: reply-to address is the email you entered in the form

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| "An error occurred" on submit | SMTP credentials not set | Run `dotnet user-secrets list` to verify secrets are configured |
| Authentication failure in logs | Wrong App Password | Generate a new App Password in Google Account settings |
| Email not arriving | Gmail blocking "less secure" access | Ensure you're using an App Password, not your account password |
| Connection timeout | Firewall blocking port 587 | Check firewall rules; try port 465 with SSL |
