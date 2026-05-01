using MediCab.Api.Contracts.Settings;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class SettingsEndpoints
{
    public static IEndpointRouteBuilder MapSettingsReadEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/settings", GetSettingsAsync)
            .WithTags("Settings")
            .WithName("GetSettings");

        return app;
    }

    private static async Task<Results<Ok<SettingsDto>, NotFound>> GetSettingsAsync(
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var clinic = await dbContext.Clinics
            .AsNoTracking()
            .Include(item => item.Schedules)
            .Include(item => item.Settings)
            .OrderBy(item => item.Name)
            .FirstOrDefaultAsync(cancellationToken);

        if (clinic?.Settings is null)
        {
            return TypedResults.NotFound();
        }

        var schedule = clinic.Schedules
            .OrderBy(item => item.DayOfWeek)
            .Select(item => new ClinicScheduleDto(
                item.DayOfWeek,
                DayLabel(item.DayOfWeek),
                item.IsOpen,
                item.StartTime,
                item.EndTime))
            .ToList();

        var dto = new SettingsDto(
            new ClinicSummaryDto(
                clinic.Id,
                clinic.Name,
                clinic.AddressLine1,
                clinic.AddressLine2,
                clinic.PostalCode,
                clinic.City,
                clinic.Phone,
                clinic.Email,
                clinic.Website,
                clinic.Siret,
                clinic.Rpps,
                schedule),
            new AppointmentSettingsDto(
                clinic.Settings.DefaultAppointmentDurationMinutes,
                clinic.Settings.NewPatientDurationMinutes,
                clinic.Settings.ProcedureDurationMinutes,
                clinic.Settings.EmailReminderHours,
                clinic.Settings.AllowWalkInConsultations),
            new BillingSettingsDto(
                clinic.Settings.AutoPrepareInvoice,
                clinic.Settings.ShowDebtAlerts,
                clinic.Settings.PaymentDelayDays,
                clinic.Settings.OverdueReminderDays),
            new SecuritySettingsDto(
                clinic.Settings.MinPasswordLength,
                clinic.Settings.SessionTimeoutMinutes,
                clinic.Settings.ForceTwoFactor,
                clinic.Settings.AuditConnections,
                clinic.Settings.BackupFrequency,
                clinic.Settings.BackupRetentionDays));

        return TypedResults.Ok(dto);
    }

    private static string DayLabel(int dayOfWeek) => dayOfWeek switch
    {
        1 => "Lundi",
        2 => "Mardi",
        3 => "Mercredi",
        4 => "Jeudi",
        5 => "Vendredi",
        6 => "Samedi",
        7 => "Dimanche",
        _ => "Inconnu"
    };
}
