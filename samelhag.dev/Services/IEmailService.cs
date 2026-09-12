using samelhag.dev.Models;

namespace samelhag.dev.Services;

public interface IEmailService
{
    Task SendContactEmailAsync(ContactFormModel model);
}
