namespace samelhag.dev.Services;

/// <summary>
/// Site-wide cap on outbound contact emails, sized far above real traffic so it only trips under
/// automated abuse. The asset being protected is the SMTP account's sending reputation, so the
/// limit is deliberately global rather than per-client: rotating IPs must not buy more quota.
/// </summary>
/// <remarks>
/// This cannot be ASP.NET Core's rate-limiting middleware. Interactive Blazor Server delivers the
/// submit as a message on the existing SignalR circuit, not as an HTTP request, so middleware never
/// sees it. The limit has to live at the point of send.
/// </remarks>
public sealed class ContactRateLimiter
{
    private const int MaxPerWindow = 10;
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(10);

    private readonly Queue<DateTimeOffset> _sends = new();
    private readonly Lock _gate = new();

    /// <summary>
    /// Records a send against the current window. Returns false once the window is full, in which
    /// case nothing is recorded and the caller must not send.
    /// </summary>
    public bool TryAcquire()
    {
        var now = DateTimeOffset.UtcNow;

        lock (_gate)
        {
            while (_sends.TryPeek(out var oldest) && now - oldest >= Window)
            {
                _sends.Dequeue();
            }

            if (_sends.Count >= MaxPerWindow)
            {
                return false;
            }

            _sends.Enqueue(now);
            return true;
        }
    }
}
