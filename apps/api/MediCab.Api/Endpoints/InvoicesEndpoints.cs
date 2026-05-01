using MediCab.Api.Contracts.Common;
using MediCab.Api.Contracts.Invoices;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class InvoicesEndpoints
{
    public static IEndpointRouteBuilder MapInvoicesReadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/invoices").WithTags("Invoices");

        group.MapGet("/", GetInvoicesAsync)
            .WithName("GetInvoices");

        group.MapGet("/{invoiceId:guid}", GetInvoiceByIdAsync)
            .WithName("GetInvoiceById");

        return app;
    }

    private static async Task<Ok<PagedResponse<InvoiceListItemDto>>> GetInvoicesAsync(
        [AsParameters] InvoicesQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var invoicesQuery = dbContext.Invoices
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .AsQueryable();

        if (query.PatientId is not null)
        {
            invoicesQuery = invoicesQuery.Where(item => item.PatientId == query.PatientId);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            invoicesQuery = invoicesQuery.Where(item => item.Status.ToDisplay() == query.Status);
        }

        if (query.DateFrom is not null)
        {
            invoicesQuery = invoicesQuery.Where(item => item.IssuedOn >= query.DateFrom);
        }

        if (query.DateTo is not null)
        {
            invoicesQuery = invoicesQuery.Where(item => item.IssuedOn <= query.DateTo);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            invoicesQuery = invoicesQuery.Where(item =>
                item.Number.ToLower().Contains(search) ||
                item.Reason.ToLower().Contains(search) ||
                (item.Patient.FirstName + " " + item.Patient.LastName).ToLower().Contains(search));
        }

        var total = await invoicesQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var invoices = await invoicesQuery
            .OrderByDescending(item => item.IssuedOn)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = invoices
            .Select(item =>
            {
                var remaining = Math.Max(item.TotalAmount - item.PaidAmount, 0m);
                var daysLate = item.DueOn < today && remaining > 0 ? today.DayNumber - item.DueOn.DayNumber : 0;

                return new InvoiceListItemDto(
                    item.Id,
                    item.Number,
                    item.PatientId,
                    item.Patient.FullName(),
                    item.DoctorUserId,
                    item.DoctorUser is null ? null : $"Dr. {item.DoctorUser.FullName()}",
                    item.IssuedOn,
                    item.DueOn,
                    item.Reason,
                    item.TotalAmount,
                    item.PaidAmount,
                    remaining,
                    item.Status.ToDisplay(),
                    daysLate);
            })
            .ToList();

        return TypedResults.Ok(new PagedResponse<InvoiceListItemDto>(items, page, pageSize, total));
    }

    private static async Task<Results<Ok<InvoiceDetailDto>, NotFound>> GetInvoiceByIdAsync(
        Guid invoiceId,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var invoice = await dbContext.Invoices
            .AsNoTracking()
            .Include(item => item.Patient)
            .Include(item => item.DoctorUser)
            .Include(item => item.Payments)
                .ThenInclude(payment => payment.RecordedByUser)
            .FirstOrDefaultAsync(item => item.Id == invoiceId, cancellationToken);

        if (invoice is null)
        {
            return TypedResults.NotFound();
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var remaining = Math.Max(invoice.TotalAmount - invoice.PaidAmount, 0m);
        var daysLate = invoice.DueOn < today && remaining > 0 ? today.DayNumber - invoice.DueOn.DayNumber : 0;

        var payments = invoice.Payments
            .OrderByDescending(item => item.PaidOn)
            .Select(item => new InvoicePaymentDto(
                item.Id,
                item.Amount,
                item.PaidOn,
                item.RecordedByUserId,
                item.RecordedByUser.FullName(),
                item.Notes,
                item.CreatedAt))
            .ToList();

        return TypedResults.Ok(new InvoiceDetailDto(
            invoice.Id,
            invoice.Number,
            invoice.PatientId,
            invoice.Patient.FullName(),
            invoice.DoctorUserId,
            invoice.DoctorUser is null ? null : $"Dr. {invoice.DoctorUser.FullName()}",
            invoice.AppointmentId,
            invoice.ConsultationId,
            invoice.IssuedOn,
            invoice.DueOn,
            invoice.Reason,
            invoice.TotalAmount,
            invoice.PaidAmount,
            remaining,
            invoice.Status.ToDisplay(),
            daysLate,
            payments,
            invoice.CreatedAt,
            invoice.UpdatedAt));
    }

    private sealed class InvoicesQuery
    {
        public Guid? PatientId { get; init; }
        public string? Status { get; init; }
        public string? Search { get; init; }
        public DateOnly? DateFrom { get; init; }
        public DateOnly? DateTo { get; init; }
        public int? Page { get; init; }
        public int? PageSize { get; init; }
    }
}
