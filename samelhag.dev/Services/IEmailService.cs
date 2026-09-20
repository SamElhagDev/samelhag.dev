using samelhag.dev.Models;

namespace samelhag.dev.Services;

/// <summary>Outcome of a contact-form send attempt.</summary>
public enum ContactSendResult
{
    /// <summary>The message was handed to the SMTP server.</summary>
    Sent,

    /// <summary>The site-wide send window is full. Nothing was sent; the caller should ask the visitor to retry later.</summary>
    RateLimited,
}

public interface IEmailService
{
    Task<ContactSendResult> SendContactEmailAsync(ContactFormModel model);
}
