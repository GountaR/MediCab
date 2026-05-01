using MediCab.Api.Contracts.Common;
using MediCab.Api.Contracts.Consultations;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class ConsultationsEndpoints
{
    public static IEndpointRouteBuilder MapConsultationsReadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/consultations").WithTags("Consultations");

        group.MapGet("/", GetConsultationsAsync)
            .WithName("GetConsultations");

        group.MapGet("/{consultationId:guid}", GetConsultationByIdAsync)
            .WithName("GetConsultationById");

        return app;
    }

    private static async Task<Ok<PagedResponse<ConsultationListItemDto>>> GetConsultationsAsync(
        [AsParameters] ConsultationsQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var consultationsQuery = dbContext.Consultations
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .AsQueryable();

        if (query.DoctorId is not null)
        {
            consultationsQuery = consultationsQuery.Where(item => item.DoctorUserId == query.DoctorId);
        }

        if (query.PatientId is not null)
        {
            consultationsQuery = consultationsQuery.Where(item => item.PatientId == query.PatientId);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            consultationsQuery = consultationsQuery.Where(item => item.Status.ToDisplay() == query.Status);
        }

        if (query.DateFrom is not null)
        {
            consultationsQuery = consultationsQuery.Where(item => item.ConsultationDate >= query.DateFrom);
        }

        if (query.DateTo is not null)
        {
            consultationsQuery = consultationsQuery.Where(item => item.ConsultationDate <= query.DateTo);
        }

        var total = await consultationsQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);

        var consultations = await consultationsQuery
            .OrderByDescending(item => item.ConsultationDate)
            .ThenByDescending(item => item.ConsultationTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = consultations
            .Select(item => new ConsultationListItemDto(
                item.Id,
                item.PatientId,
                item.Patient.FullName(),
                item.DoctorUserId,
                $"Dr. {item.DoctorUser.FullName()}",
                item.AppointmentId,
                item.ConsultationDate,
                item.ConsultationTime,
                item.ConsultationType.ToDisplay(),
                item.Reason,
                item.Status.ToDisplay(),
                item.FollowUpDate))
            .ToList();

        return TypedResults.Ok(new PagedResponse<ConsultationListItemDto>(items, page, pageSize, total));
    }

    private static async Task<Results<Ok<ConsultationDetailDto>, NotFound>> GetConsultationByIdAsync(
        Guid consultationId,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var consultation = await dbContext.Consultations
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .Include(item => item.Exam)
            .Include(item => item.Diagnoses)
            .Include(item => item.SecondaryDiagnoses)
            .Include(item => item.ActiveTreatments)
            .FirstOrDefaultAsync(item => item.Id == consultationId, cancellationToken);

        if (consultation is null)
        {
            return TypedResults.NotFound();
        }

        var primaryDiagnosis = consultation.Diagnoses
            .OrderBy(item => item.StartedOn)
            .Select(item => $"{item.Icd10Code} - {item.Label}")
            .FirstOrDefault();

        var exam = consultation.Exam is null
            ? null
            : new ConsultationExamDto(
                consultation.Exam.WeightKg,
                consultation.Exam.HeightCm,
                consultation.Exam.BloodPressure,
                consultation.Exam.HeartRate,
                consultation.Exam.TemperatureC,
                consultation.Exam.Spo2,
                consultation.Exam.Cardiovascular,
                consultation.Exam.Respiratory,
                consultation.Exam.Abdomen,
                consultation.Exam.Neurological,
                consultation.Exam.Orl,
                consultation.Exam.OtherNotes);

        var treatments = consultation.ActiveTreatments
            .Select(item => new ConsultationTreatmentDto(
                item.Id,
                item.Dci,
                item.BrandName,
                item.Dosage,
                item.Posology,
                item.Route,
                item.Status.ToString(),
                item.NonSubstitutable,
                item.Notes))
            .ToList();

        return TypedResults.Ok(new ConsultationDetailDto(
            consultation.Id,
            consultation.PatientId,
            consultation.Patient.FullName(),
            consultation.DoctorUserId,
            $"Dr. {consultation.DoctorUser.FullName()}",
            consultation.AppointmentId,
            consultation.ConsultationDate,
            consultation.ConsultationTime,
            consultation.ConsultationType.ToDisplay(),
            consultation.Reason,
            consultation.Anamnesis,
            consultation.Assessment,
            consultation.Plan,
            consultation.Status.ToDisplay(),
            consultation.FollowUpDate,
            consultation.FollowUpInstructions,
            primaryDiagnosis,
            consultation.SecondaryDiagnoses.Select(item => item.Label).ToList(),
            exam,
            treatments,
            consultation.CreatedAt,
            consultation.UpdatedAt,
            consultation.SignedAt));
    }

    private sealed class ConsultationsQuery
    {
        public Guid? DoctorId { get; init; }
        public Guid? PatientId { get; init; }
        public string? Status { get; init; }
        public DateOnly? DateFrom { get; init; }
        public DateOnly? DateTo { get; init; }
        public int? Page { get; init; }
        public int? PageSize { get; init; }
    }
}
