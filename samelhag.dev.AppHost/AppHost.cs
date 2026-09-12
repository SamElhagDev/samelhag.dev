var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.samelhag_dev>("samelhag-dev");

builder.Build().Run();
