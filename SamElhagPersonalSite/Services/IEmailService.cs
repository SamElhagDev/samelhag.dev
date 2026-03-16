using SamElhagPersonalSite.Models;

namespace SamElhagPersonalSite.Services;

public interface IEmailService
{
    Task SendContactEmailAsync(ContactFormModel model);
}
