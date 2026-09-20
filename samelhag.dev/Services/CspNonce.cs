namespace samelhag.dev.Services;

/// <summary>Carries the per-request CSP nonce from the header middleware to App.razor's inline scripts.</summary>
public static class CspNonce
{
    public const string ItemKey = "csp-nonce";

    /// <summary>The nonce for the current request, or null outside an HTTP request.</summary>
    public static string? From(HttpContext? context) => context?.Items[ItemKey] as string;
}
