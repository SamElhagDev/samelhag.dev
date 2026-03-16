using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SamElhagPersonalSite.Models;

namespace SamElhagPersonalSite.Services;

public class EmailService(IOptions<EmailSettings> options, ILogger<EmailService> logger) : IEmailService
{
    private readonly EmailSettings _settings = options.Value;

    public async Task SendContactEmailAsync(ContactFormModel model)
    {
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
            logger.LogInformation("Contact email sent successfully from {Email}", model.Email);
        }
        finally
        {
            await client.DisconnectAsync(true);
        }
    }
}
