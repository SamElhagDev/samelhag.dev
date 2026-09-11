using MudBlazor;

namespace SamElhagPersonalSite.Components.Layout;

/// <summary>
/// MudBlazor theme mirroring the Copper &amp; Black tokens in wwwroot/app.css, so MudBlazor
/// components (inputs, drawer, snackbars) match the rest of the site. Keep the two in sync.
/// </summary>
public static class SiteTheme
{
    private static readonly string[] Sans = ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"];
    private static readonly string[] Display = ["Space Grotesk", "Inter", "system-ui", "sans-serif"];

    public static readonly MudTheme Theme = new()
    {
        PaletteDark = new PaletteDark
        {
            Black = "#0e0c0a",
            Background = "#00000000", // transparent so the maze canvas shows through
            Surface = "#1c1916",
            AppbarBackground = "#131110",
            AppbarText = "#f5ede0",
            DrawerBackground = "#131110",
            DrawerText = "#f5ede0",
            DrawerIcon = "#a89070",
            Primary = "#f97316",
            PrimaryContrastText = "#0e0c0a", // dark text on copper: 7:1 (white was 2.8:1)
            Secondary = "#a89070",
            SecondaryContrastText = "#0e0c0a",
            Tertiary = "#6e5a48",
            Info = "#fb923c",
            Success = "#22c55e",
            Warning = "#fb923c",
            Error = "#f87171",
            TextPrimary = "#f5ede0",
            TextSecondary = "#a89070",
            TextDisabled = "#6e5a48",
            ActionDefault = "#a89070",
            ActionDisabled = "#6e5a48",
            ActionDisabledBackground = "#231f1b",
            LinesDefault = "#302a23",
            LinesInputs = "#463c31",
            Divider = "#302a23",
            DividerLight = "#302a2344",
            OverlayDark = "rgba(8, 7, 6, 0.6)",
        },
        // Same fluid scale as the --text-* tokens in app.css.
        Typography = new Typography
        {
            Default = new DefaultTypography { FontFamily = Sans },
            H1 = new H1Typography { FontFamily = Display, FontSize = "clamp(2.1rem, 1.6rem + 2.2vw, 3.25rem)", FontWeight = "700", LineHeight = "1.1", LetterSpacing = "-0.03em" },
            H2 = new H2Typography { FontFamily = Display, FontSize = "clamp(1.6rem, 1.3rem + 1.4vw, 2.25rem)", FontWeight = "700", LineHeight = "1.2", LetterSpacing = "-0.025em" },
            H3 = new H3Typography { FontFamily = Display, FontSize = "clamp(1.35rem, 1.2rem + 0.75vw, 1.75rem)", FontWeight = "700", LineHeight = "1.25", LetterSpacing = "-0.02em" },
            H4 = new H4Typography { FontFamily = Display, FontSize = "clamp(1.2rem, 1.1rem + 0.5vw, 1.45rem)", FontWeight = "600", LineHeight = "1.3", LetterSpacing = "-0.015em" },
            H5 = new H5Typography { FontFamily = Display, FontSize = "1.125rem", FontWeight = "600", LineHeight = "1.35", LetterSpacing = "-0.01em" },
            H6 = new H6Typography { FontFamily = Display, FontSize = "1rem", FontWeight = "600", LineHeight = "1.4", LetterSpacing = "0" },
            Subtitle1 = new Subtitle1Typography { FontFamily = Sans },
            Subtitle2 = new Subtitle2Typography { FontFamily = Sans },
            Body1 = new Body1Typography { FontFamily = Sans, FontSize = "1rem", LineHeight = "1.65" },
            Body2 = new Body2Typography { FontFamily = Sans, FontSize = "0.875rem", LineHeight = "1.6" },
            Button = new ButtonTypography { FontFamily = Sans, FontWeight = "600", TextTransform = "none", LetterSpacing = "0" },
            Caption = new CaptionTypography { FontFamily = Sans },
            Overline = new OverlineTypography { FontFamily = Sans },
        },
        LayoutProperties = new LayoutProperties
        {
            AppbarHeight = "64px",
            DefaultBorderRadius = "6px",
            DrawerWidthRight = "300px",
        },
    };
}
