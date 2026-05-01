using MediCab.Api.Contracts.Common;
using MediCab.Api.Contracts.Patients;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class PatientsEndpoints
{
    public static IEndpointRouteBuilder MapPatientsReadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/patients").WithTags("Patients");

        group.MapGet("/", GetPatientsAsync)
            .WithName("GetPatients");

        group.MapGet("/{patientId:guid}", GetPatientByIdAsync)
            .WithName("GetPatientById");

        return app;
    }

    private static async Task<Ok<PagedResponse<PatientListItemDto>>> GetPatientsAsync(
        [AsParameters] PatientsQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var patientsQuery = dbContext.Patients
            .AsNoTracking()
            .Include(patient => patient.PrimaryDoctorUser)
            .Include(patient => patient.Consultations)
            .Include(patient => patient.Appointments)
            .Include(patient => patient.Invoices)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            patientsQuery = patientsQuery.Where(patient =>
                patient.Dpi.ToLower().Contains(search) ||
                (patient.FirstName + " " + patient.LastName).ToLower().Contains(search) ||
                patient.Phone.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            patientsQuery = patientsQuery.Where(patient => patient.Status.ToDisplay() == query.Status);
        }

        if (query.DoctorId is not null)
        {
            patientsQuery = patientsQuery.Where(patient => patient.PrimaryDoctorUserId == query.DoctorId);
        }

        var total = await patientsQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);

        var patients = await patientsQuery
            .OrderBy(patient => patient.LastName)
            .ThenBy(patient => patient.FirstName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = patients
            .Select(patient =>
            {
                var lastVisitDate = patient.Consultations
                    .OrderByDescending(consultation => consultation.ConsultationDate)
                    .Select(consultation => (DateOnly?)consultation.ConsultationDate)
                    .FirstOrDefault();

                var nextAppointmentAt = patient.Appointments
                    .Where(appointment => appointment.ScheduledStartAt >= DateTimeOffset.UtcNow)
                    .OrderBy(appointment => appointment.ScheduledStartAt)
                    .Select(appointment => (DateTimeOffset?)appointment.ScheduledStartAt)
                    .FirstOrDefault();

                var unpaidBalance = patient.Invoices
                    .Where(invoice => invoice.Status != Domain.Enums.InvoiceStatus.Annulee)
                    .Sum(invoice => Math.Max(invoice.TotalAmount - invoice.PaidAmount, 0m));

                return new PatientListItemDto(
                    patient.Id,
                    patient.Dpi,
                    patient.FirstName,
                    patient.LastName,
                    patient.FullName(),
                    patient.BirthDate,
                    patient.Phone,
                    patient.Status.ToDisplay(),
                    patient.PrimaryDoctorUserId,
                    patient.PrimaryDoctorUser is null ? null : $"Dr. {patient.PrimaryDoctorUser.FullName()}",
                    lastVisitDate,
                    nextAppointmentAt,
                    unpaidBalance);
            })
            .ToList();

        return TypedResults.Ok(new PagedResponse<PatientListItemDto>(items, page, pageSize, total));
    }

    private static async Task<Results<Ok<PatientDetailDto>, NotFound>> GetPatientByIdAsync(
        Guid patientId,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var patient = await dbContext.Patients
            .AsNoTracking()
            .Include(item => item.PrimaryDoctorUser)
            .Include(item => item.Allergies)
            .Include(item => item.Tags)
            .Include(item => item.Consultations)
            .Include(item => item.Appointments)
            .Include(item => item.Invoices)
            .FirstOrDefaultAsync(item => item.Id == patientId, cancellationToken);

        if (patient is null)
        {
            return TypedResults.NotFound();
        }

        var unpaidBalance = patient.Invoices
            .Where(invoice => invoice.Status != Domain.Enums.InvoiceStatus.Annulee)
            .Sum(invoice => Math.Max(invoice.TotalAmount - invoice.PaidAmount, 0m));

        var lastVisitDate = patient.Consultations
            .OrderByDescending(consultation => consultation.ConsultationDate)
            .Select(consultation => (DateOnly?)consultation.ConsultationDate)
            .FirstOrDefault();

        var nextAppointmentAt = patient.Appointments
            .Where(appointment => appointment.ScheduledStartAt >= DateTimeOffset.UtcNow)
            .OrderBy(appointment => appointment.ScheduledStartAt)
            .Select(appointment => (DateTimeOffset?)appointment.ScheduledStartAt)
            .FirstOrDefault();

        return TypedResults.Ok(new PatientDetailDto(
            patient.Id,
            patient.Dpi,
            patient.FirstName,
            patient.LastName,
            patient.FullName(),
            patient.BirthDate,
            patient.Gender,
            patient.Phone,
            patient.Email,
            patient.Address,
            patient.InsuranceName,
            patient.InsuranceMemberNumber,
            patient.Status.ToDisplay(),
            patient.BloodGroup,
            patient.PrimaryDoctorUserId,
            patient.PrimaryDoctorUser is null ? null : $"Dr. {patient.PrimaryDoctorUser.FullName()}",
            patient.Allergies.Select(allergy => allergy.Label).ToList(),
            patient.Tags.Select(tag => tag.Label).ToList(),
            unpaidBalance,
            lastVisitDate,
            nextAppointmentAt));
    }

    private sealed class PatientsQuery
    {
        public string? Search { get; init; }

        public string? Status { get; init; }

        public Guid? DoctorId { get; init; }

        public int? Page { get; init; }

        public int? PageSize { get; init; }
    }
}
