namespace SamElhagPersonalSite.Components.Pages;

public partial class About
{
    private record TimelineMilestone(
        string Role,
        string Organisation,
        string DateRange,
        string Description,
        bool IsCurrent,
        string Category
    );

    private readonly List<TimelineMilestone> _milestones = new()
    {
        new("Student",
            "West Virginia University",
            "Aug 2015",
            "Started B.S. in Mechanical Engineering.",
            false,
            "Education"),

        new("Application Developer (CO-OP)",
            "Core10",
            "Jul 2017 → Jun 2018",
            "Leveraged OOP design patterns to write clean and maintainable code for client reporting in C#, with a heavy emphasis on API module integration. Utilised Agile methodologies to meet dynamic client requirements.",
            false,
            "CO-OP"),

        new("Application Developer (Contract)",
            "Agile5 Technologies, Inc.",
            "Oct 2018 → Apr 2019",
            "Created and tested clean, maintainable code for client dashboards in Java with a strong emphasis on OOP and API module integration. Team used Agile to meet dynamic client requirements.",
            false,
            "Contract"),

        new("Student",
            "West Virginia University",
            "Jul 2019",
            "Graduated — B.S. in Mechanical Engineering.",
            false,
            "Education"),

        new("Software Engineer / Analyst",
            "Steel Dynamics",
            "Jul 2019 → Present",
            "Leverage OOP design patterns to write clean and maintainable C# code enhancing SDI Flat Roll systems. Heavy emphasis on Entity Framework, Prism (WPF), SQL, WebAPI, IIS, and MVVM.",
            true,
            "Industry"),

    };
}
