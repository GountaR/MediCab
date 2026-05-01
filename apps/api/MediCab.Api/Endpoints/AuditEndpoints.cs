using MediCab.Api.Contracts.Audit;
using MediCab.Api.Contracts.Common;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class AuditEndpoints
{
    public static IEndpointRouteBuilder MapAuditReadEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/audit-logs", GetAuditLogsAsync)
            .WithTags("Audit")
            .WithName("GetAuditLogs");

        return app;
    }

    private static async Task<Ok<PagedResponse<AuditLogListItemDto>>> GetAuditLogsAsync(
        [AsParameters] AuditQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var auditQuery = dbContext.AuditLogs
            .AsNoTracking()
            .Include(item => item.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Module))
        {
            auditQuery = auditQuery.Where(item => item.ModuleCode == query.Module);
        }

        if (!string.IsNullOrWhiteSpace(query.ActionType))
        {
            auditQuery = auditQuery.Where(item => item.ActionType.ToDisplay() == query.ActionType);
        }

        if (query.UserId is not null)
        {
            auditQuery = auditQuery.Where(item => item.UserId == query.UserId);
        }

        if (query.DateFrom is not null)
        {
            var start = new DateTimeOffset(query.DateFrom.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc), TimeSpan.Zero);
            auditQuery = auditQuery.Where(item => item.OccurredAt >= start);
        }

        if (query.DateTo is not null)
        {
            var end = new DateTimeOffset(query.DateTo.Value.AddDays(1).ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc), TimeSpan.Zero);
            auditQuery = auditQuery.Where(item => item.OccurredAt < end);
        }

        var total = await auditQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);

        var items = await auditQuery
            .OrderByDescending(item => item.OccurredAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(item => new AuditLogListItemDto(
                item.Id,
                item.OccurredAt,
                item.UserId,
                item.User == null ? null : item.User.FullName(),
                item.ActionType.ToDisplay(),
                item.ModuleCode,
                item.EntityType,
                item.EntityId,
                item.Description,
                item.IpAddress,
                item.IsSuccess))
            .ToListAsync(cancellationToken);

        return TypedResults.Ok(new PagedResponse<AuditLogListItemDto>(items, page, pageSize, total));
    }

    private sealed class AuditQuery
    {
        public string? Module { get; init; }
        public string? ActionType { get; init; }
        public Guid? UserId { get; init; }
        public DateOnly? DateFrom { get; init; }
        public DateOnly? DateTo { get; init; }
        public int? Page { get; init; }
        public int? PageSize { get; init; }
    }
}
