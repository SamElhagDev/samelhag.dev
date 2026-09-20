using System.ComponentModel.DataAnnotations;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using samelhag.dev.Models;

namespace samelhag.dev.Services;

public class EmailService(
    IOptions<EmailSettings> options,
    ContactRateLimiter rateLimiter,
    ILogger<EmailService> logger) : IEmailService
{
    private readonly EmailSettings _settings = options.Value;

    public async Task<ContactSendResult> SendContactEmailAsync(ContactFormModel model)
    {
        // The component validates too, but a Blazor Server circuit can be driven directly, so the
        // component's check is not authoritative. This is the boundary that has to hold.
        Validate(model);

        if (!rateLimiter.TryAcquire())
        {
            logger.LogWarning("Contact email not sent: site-wide send window is full.");
            return ContactSendResult.RateLimited;
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
        message.To.Add(MailboxAddress.Parse(_settings.RecipientEmail));
        message.ReplyTo.Add(MailboxAddress.Parse(model.Email));
        message.Subject = $"Contact Form: {model.Subject}";

        message.Body = new TextPart("plain")
        {
            Text = $"""
                New contact form submission from samelhag.dev.

                Name: {model.FirstName} {model.LastName}
                Email: {model.Email}
                Subject: {model.Subject}

                Message:
                {model.Message}
                """
        };

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_settings.Username, _settings.Password);
            await client.SendAsync(message);
            logger.LogInformation("Contact email sent successfully.");
            return ContactSendResult.Sent;
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }

    // Only the attributes' own messages are surfaced, never the submitted values.
    private static void Validate(ContactFormModel model)
    {
        var results = new List<ValidationResult>();
        if (Validator.TryValidateObject(model, new ValidationContext(model), results, validateAllProperties: true))
        {
            return;
        }

        throw new ValidationException(
            "Contact form failed server-side validation: " +
            string.Join("; ", results.Select(result => result.ErrorMessage)));
    }
}
