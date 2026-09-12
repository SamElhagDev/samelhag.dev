using Microsoft.AspNetCore.Components.Routing;
using MudBlazor;

namespace samelhag.dev.Data;

/// <summary>
/// Site-wide identity, contact details, and navigation. The layout, footer, SEO tags, and
/// pages all read from here so a link or address only ever changes in one place.
/// </summary>
public static class SiteInfo
{
    public const string Name = "Sam Elhag";
    public const string Alias = "Sam.E";
    public const string Role = "Mechanical & Software Engineer";
    public const string Tagline = "Always Learning, Always Building.";

    /// <summary>Canonical production origin, used for canonical and Open Graph URLs.</summary>
    public const string BaseUrl = "https://samelhag.dev";
    public const string OgImageUrl = BaseUrl + "/images/og-image.png";
    public const string OgImageAlt = "Sam Elhag, Mechanical & Software Engineer: a NACA 0012 airfoil with streamlines on a dark background.";

    public const string Email = "sami.eltaj.elhag@gmail.com";
    public const string Phone = "+1 (304) 435-8767";
    public const string PhoneHref = "tel:+13044358767";
    public const string Location = "Pittsburgh, PA";

    public const string GitHubUrl = "https://github.com/SamElhagDev";
    public const string LinkedInUrl = "https://www.linkedin.com/in/sam-elhag-b82312102/";
    public const string XUrl = "https://x.com/SamEElhag";
    public const string XHandle = "@SamEElhag";
    public const string SourceUrl = "https://github.com/SamElhagDev/samelhag.dev";

    public static readonly IReadOnlyList<NavItem> Navigation =
    [
        new("Home", "/", NavLinkMatch.All),
        new("About", "/about"),
        new("Interests", "/interests"),
        new("Projects", "/projects"),
        new("Contact", "/contact"),
    ];

    public static readonly IReadOnlyList<SocialLink> Social =
    [
        new("GitHub", GitHubUrl, Icons.Custom.Brands.GitHub),
        new("LinkedIn", LinkedInUrl, Icons.Custom.Brands.LinkedIn),
        new("X (Twitter)", XUrl, Icons.Custom.Brands.X),
    ];
}

public sealed record NavItem(string Label, string Href, NavLinkMatch Match = NavLinkMatch.Prefix);

public sealed record SocialLink(string Label, string Url, string Icon);
