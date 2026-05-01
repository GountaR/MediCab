using MediCab.Api.Contracts.Common;
using MediCab.Api.Contracts.Prescriptions;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class PrescriptionsEndpoints
{
    public static IEndpointRouteBuilder MapPrescriptionsReadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/prescriptions").WithTags("Prescriptions");

        group.MapGet("/", GetPrescriptionsAsync)
            .WithName("GetPrescriptions");

        group.MapGet("/{prescriptionId:guid}", GetPrescriptionByIdAsync)
            .WithName("GetPrescriptionById");

        return app;
    }

    private static async Task<Ok<PagedResponse<PrescriptionListItemDto>>> GetPrescriptionsAsync(
        [AsParameters] PrescriptionsQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var prescriptionsQuery = dbContext.Prescriptions
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .Include(item => item.Items)
            .AsQueryable();

        if (query.PatientId is not null)
        {
            prescriptionsQuery = prescriptionsQuery.Where(item => item.PatientId == query.PatientId);
        }

        if (query.DoctorId is not null)
        {
            prescriptionsQuery = prescriptionsQuery.Where(item => item.DoctorUserId == query.DoctorId);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            prescriptionsQuery = prescriptionsQuery.Where(item => item.Status.ToDisplay() == query.Status);
        }

        var total = await prescriptionsQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);

        var prescriptions = await prescriptionsQuery
            .OrderByDescending(item => item.IssuedOn)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = prescriptions.Select(item => new PrescriptionListItemDto(
            item.Id,
            item.PatientId,
            item.Patient.FullName(),
            item.DoctorUserId,
            $"Dr. {item.DoctorUser.FullName()}",
            item.ConsultationId,
            item.IssuedOn,
            item.ExpiresOn,
            item.Status.ToDisplay(),
            item.Items.Count)).ToList();

        return TypedResults.Ok(new PagedResponse<PrescriptionListItemDto>(items, page, pageSize, total));
    }

    private static async Task<Results<Ok<PrescriptionDetailDto>, NotFound>> GetPrescriptionByIdAsync(
        Guid prescriptionId,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var prescription = await dbContext.Prescriptions
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .Include(item => item.Items)
            .FirstOrDefaultAsync(item => item.Id == prescriptionId, cancellationToken);

        if (prescription is null)
        {
            return TypedResults.NotFound();
        }

        var items = prescription.Items
            .OrderBy(item => item.Dci)
            .Select(item => new PrescriptionItemDto(
                item.Id,
                item.Dci,
                item.BrandName,
                item.Dosage,
                item.Posology,
                item.Route,
                item.DurationLabel,
                item.QuantityLabel,
                item.RenewalCount,
                item.NonSubstitutable,
                item.Instructions))
            .ToList();

        return TypedResults.Ok(new PrescriptionDetailDto(
            prescription.Id,
            prescription.PatientId,
            prescription.Patient.FullName(),
            prescription.DoctorUserId,
            $"Dr. {prescription.DoctorUser.FullName()}",
            prescription.ConsultationId,
            prescription.IssuedOn,
            prescription.ExpiresOn,
            prescription.Status.ToDisplay(),
            prescription.Instructions,
            items,
            prescription.CreatedAt,
            prescription.UpdatedAt));
    }

    private sealed class PrescriptionsQuery
    {
        public Guid? PatientId { get; init; }
        public Guid? DoctorId { get; init; }
        public string? Status { get; init; }
        public int? Page { get; init; }
        public int? PageSize { get; init; }
    }
}
