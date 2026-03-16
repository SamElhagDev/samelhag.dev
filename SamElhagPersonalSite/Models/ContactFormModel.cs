using System.ComponentModel.DataAnnotations;

namespace SamElhagPersonalSite.Models;

public class ContactFormModel
{
    [Required(ErrorMessage = "First name is required")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subject is required")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Message is required")]
    [MaxLength(10000, ErrorMessage = "Message cannot exceed 10,000 characters")]
    public string Message { get; set; } = string.Empty;
}
