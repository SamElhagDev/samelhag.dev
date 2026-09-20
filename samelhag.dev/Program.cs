using MudBlazor.Services;
using samelhag.dev.Components;
using samelhag.dev.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMudServices();
builder.Services.Configure<EmailSettings>(options =>
{
    builder.Configuration.GetSection("EmailSettings").Bind(options);
    var smtp = builder.Configuration.GetSection("samelhagdevSMTP");
    if (smtp.Exists())
    {
        options.Username = smtp["Username"] ?? options.Username;
        options.Password = smtp["Password"] ?? options.Password;
    }
});
builder.Services.AddSingleton<ContactRateLimiter>();
builder.Services.AddTransient<IEmailService, EmailService>();

builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Security response headers. Sits after the exception handler so re-executed error responses get
// them too, since UseExceptionHandler clears the response on its way back out.
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;

    // script-src needs no 'unsafe-eval': that is a Blazor WebAssembly requirement, not Server.
    // style-src does need 'unsafe-inline', because MudBlazor and Blazor's own reconnect overlay
    // both set styles directly on elements. jsdelivr is KaTeX, loaded on demand with SRI hashes.
    headers["Content-Security-Policy"] = string.Join("; ",
        "default-src 'self'",
        "script-src 'self' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
        "img-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'");

    headers["X-Content-Type-Options"] = "nosniff";
    headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    // Redundant next to frame-ancestors, kept for browsers that predate it.
    headers["X-Frame-Options"] = "DENY";

    await next();
});

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
