using System.ComponentModel.DataAnnotations;

namespace samelhag.dev.Models;

// EmailService validates these attributes before sending. The form's own field-level rules are for
// fast feedback; they are not the enforcement point, because a Blazor circuit can be driven directly.
public class ContactFormModel
{
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name cannot exceed 100 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100, ErrorMessage = "Last name cannot exceed 100 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    [MaxLength(254, ErrorMessage = "Email cannot exceed 254 characters")] // RFC 5321 path limit
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Subject is required")]
    [MaxLength(200, ErrorMessage = "Subject cannot exceed 200 characters")]
    public string Subject { get; set; } = string.Empty;

    [Required(ErrorMessage = "Message is required")]
    [MaxLength(10000, ErrorMessage = "Message cannot exceed 10,000 characters")]
    public string Message { get; set; } = string.Empty;
}
