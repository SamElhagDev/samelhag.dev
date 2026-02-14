var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.SamElhagPersonalSite>("samelhagpersonalsite");

builder.Build().Run();
