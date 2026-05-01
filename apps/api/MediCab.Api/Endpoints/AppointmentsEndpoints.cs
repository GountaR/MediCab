using MediCab.Api.Contracts.Appointments;
using MediCab.Api.Contracts.Common;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class AppointmentsEndpoints
{
    public static IEndpointRouteBuilder MapAppointmentsReadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/appointments").WithTags("Appointments");

        group.MapGet("/", GetAppointmentsAsync)
            .WithName("GetAppointments");

        group.MapGet("/{appointmentId:guid}", GetAppointmentByIdAsync)
            .WithName("GetAppointmentById");

        return app;
    }

    private static async Task<Ok<PagedResponse<AppointmentListItemDto>>> GetAppointmentsAsync(
        [AsParameters] AppointmentsQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var appointmentsQuery = dbContext.Appointments
            .AsNoTracking()
            .Include(appointment => appointment.Patient)
            .Include(appointment => appointment.DoctorUser)
            .AsQueryable();

        if (query.Date is not null)
        {
            var start = query.Date.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            var end = query.Date.Value.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            var startOffset = new DateTimeOffset(start, TimeSpan.Zero);
            var endOffset = new DateTimeOffset(end, TimeSpan.Zero);

            appointmentsQuery = appointmentsQuery.Where(appointment =>
                appointment.ScheduledStartAt >= startOffset && appointment.ScheduledStartAt < endOffset);
        }

        if (query.DoctorId is not null)
        {
            appointmentsQuery = appointmentsQuery.Where(appointment => appointment.DoctorUserId == query.DoctorId);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            appointmentsQuery = appointmentsQuery.Where(appointment => appointment.Status.ToDisplay() == query.Status);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            appointmentsQuery = appointmentsQuery.Where(appointment =>
                (appointment.Patient.FirstName + " " + appointment.Patient.LastName).ToLower().Contains(search) ||
                appointment.Notes != null && appointment.Notes.ToLower().Contains(search));
        }

        var total = await appointmentsQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);

        var appointments = await appointmentsQuery
            .OrderBy(appointment => appointment.ScheduledStartAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = appointments
            .Select(appointment => new AppointmentListItemDto(
                appointment.Id,
                appointment.PatientId,
                appointment.Patient.FullName(),
                appointment.DoctorUserId,
                $"Dr. {appointment.DoctorUser.FullName()}",
                appointment.ScheduledStartAt,
                appointment.DurationMinutes,
                appointment.AppointmentType.ToDisplay(),
                appointment.Status.ToDisplay(),
                appointment.Notes))
            .ToList();

        return TypedResults.Ok(new PagedResponse<AppointmentListItemDto>(items, page, pageSize, total));
    }

    private static async Task<Results<Ok<AppointmentDetailDto>, NotFound>> GetAppointmentByIdAsync(
        Guid appointmentId,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var appointment = await dbContext.Appointments
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .FirstOrDefaultAsync(item => item.Id == appointmentId, cancellationToken);

        if (appointment is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(new AppointmentDetailDto(
            appointment.Id,
            appointment.PatientId,
            appointment.Patient.FullName(),
            appointment.DoctorUserId,
            $"Dr. {appointment.DoctorUser.FullName()}",
            appointment.ScheduledStartAt,
            appointment.DurationMinutes,
            appointment.AppointmentType.ToDisplay(),
            appointment.Status.ToDisplay(),
            appointment.Notes,
            appointment.CancellationReason,
            appointment.CreatedByUserId,
            appointment.CreatedAt,
            appointment.UpdatedAt));
    }

    private sealed class AppointmentsQuery
    {
        public DateOnly? Date { get; init; }

        public Guid? DoctorId { get; init; }

        public string? Status { get; init; }

        public string? Search { get; init; }

        public int? Page { get; init; }

        public int? PageSize { get; init; }
    }
}
