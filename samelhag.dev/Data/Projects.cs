using MudBlazor;

namespace samelhag.dev.Data;

/// <summary>Decorative artwork a featured project card can show beside its details.</summary>
public enum ProjectIllustration
{
    None,
    Airfoil,
}

/// <summary>A call to action on a project card.</summary>
public sealed record ProjectLink(string Label, string Href, bool External = false);

/// <summary>A portfolio entry. To publish a project, add it to <see cref="ProjectCatalog.All"/>.</summary>
public sealed record Project(
    string Slug,
    string Title,
    string Summary,
    string Icon,
    IReadOnlyList<string> Metrics,
    IReadOnlyList<string> Tags,
    ProjectLink Primary,
    ProjectLink? Secondary = null,
    bool Featured = false,
    ProjectIllustration Illustration = ProjectIllustration.None);

public static class ProjectCatalog
{
    public static readonly IReadOnlyList<Project> All =
    [
        new(
            Slug: "heat-transfer",
            Title: "NACA 0012 Airfoil Heat Transfer Simulation",
            Summary: "A transient finite-difference heat-transfer solver — written from the governing PDE up and rendered live, not pre-recorded.",
            Icon: Icons.Material.Outlined.Air,
            Metrics: ["134,400 nodes", "Re 1.3M–20.5M", "Mach 0.3", "live"],
            Tags: [".NET 10", "Blazor Server", "Canvas API", "KaTeX", "CFD"],
            Primary: new("Read the case study", "/projects/heat-transfer"),
            Secondary: new("Launch simulation", "/heatsimulation"),
            Featured: true,
            Illustration: ProjectIllustration.Airfoil),
    ];

    /// <summary>The project promoted on the home page and at the top of /projects.</summary>
    public static Project? Featured => All.FirstOrDefault(p => p.Featured);

    /// <summary>Everything except the featured project, for the projects grid.</summary>
    public static IEnumerable<Project> Others => All.Where(p => !p.Featured);
}
