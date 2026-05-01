using MediCab.Api.Contracts.Common;
using MediCab.Api.Contracts.Documents;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class DocumentsEndpoints
{
    public static IEndpointRouteBuilder MapDocumentsReadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/documents").WithTags("Documents");

        group.MapGet("/", GetDocumentsAsync)
            .WithName("GetDocuments");

        group.MapGet("/{documentId:guid}", GetDocumentByIdAsync)
            .WithName("GetDocumentById");

        return app;
    }

    private static async Task<Ok<PagedResponse<DocumentListItemDto>>> GetDocumentsAsync(
        [AsParameters] DocumentsQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var documentsQuery = dbContext.MedicalDocuments
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .AsQueryable();

        if (query.PatientId is not null)
        {
            documentsQuery = documentsQuery.Where(item => item.PatientId == query.PatientId);
        }

        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            documentsQuery = documentsQuery.Where(item => item.DocumentType.ToDisplay() == query.Type);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            documentsQuery = documentsQuery.Where(item => item.Status.ToDisplay() == query.Status);
        }

        var total = await documentsQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);

        var documents = await documentsQuery
            .OrderByDescending(item => item.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = documents.Select(item => new DocumentListItemDto(
            item.Id,
            item.PatientId,
            item.Patient.FullName(),
            item.DoctorUserId,
            item.DoctorUser is null ? null : $"Dr. {item.DoctorUser.FullName()}",
            item.ConsultationId,
            item.DocumentType.ToDisplay(),
            item.Status.ToDisplay(),
            item.Title,
            item.Subtitle,
            item.StorageKind,
            item.MimeType,
            item.SizeBytes,
            item.CreatedAt)).ToList();

        return TypedResults.Ok(new PagedResponse<DocumentListItemDto>(items, page, pageSize, total));
    }

    private static async Task<Results<Ok<DocumentDetailDto>, NotFound>> GetDocumentByIdAsync(
        Guid documentId,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var document = await dbContext.MedicalDocuments
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .FirstOrDefaultAsync(item => item.Id == documentId, cancellationToken);

        if (document is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(new DocumentDetailDto(
            document.Id,
            document.PatientId,
            document.Patient.FullName(),
            document.DoctorUserId,
            document.DoctorUser is null ? null : $"Dr. {document.DoctorUser.FullName()}",
            document.ConsultationId,
            document.DocumentType.ToDisplay(),
            document.Status.ToDisplay(),
            document.Title,
            document.Subtitle,
            document.Summary,
            document.StorageKind,
            document.StoragePath,
            document.MimeType,
            document.SizeBytes,
            document.CreatedAt,
            document.UpdatedAt));
    }

    private sealed class DocumentsQuery
    {
        public Guid? PatientId { get; init; }
        public string? Type { get; init; }
        public string? Status { get; init; }
        public int? Page { get; init; }
        public int? PageSize { get; init; }
    }
}
