using MediCab.Api.Endpoints;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<MediCabDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<MediCabDbContext>();
    await dbContext.Database.MigrateAsync();
    await DevelopmentDataSeeder.SeedAsync(dbContext);

    app.MapOpenApi();
    app.UseCors("LocalDev");
}
else
{
    app.UseHttpsRedirection();
}

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "MediCab.Api",
    database = "configured",
    time = DateTimeOffset.UtcNow
}))
.WithName("GetHealth");

app.MapUsersReadEndpoints();
app.MapPatientsReadEndpoints();
app.MapAppointmentsReadEndpoints();
app.MapConsultationsReadEndpoints();
app.MapInvoicesReadEndpoints();
app.MapSettingsReadEndpoints();
app.MapPrescriptionsReadEndpoints();
app.MapDocumentsReadEndpoints();
app.MapRolesReadEndpoints();
app.MapAuditReadEndpoints();

app.Run();
