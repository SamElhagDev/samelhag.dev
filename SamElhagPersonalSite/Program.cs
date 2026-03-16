using MudBlazor.Services;
using SamElhagPersonalSite.Components;
using SamElhagPersonalSite.Services;

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
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
