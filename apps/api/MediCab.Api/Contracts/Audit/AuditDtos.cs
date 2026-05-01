namespace MediCab.Api.Contracts.Audit;

public sealed record AuditLogListItemDto(
    Guid Id,
    DateTimeOffset OccurredAt,
    Guid? UserId,
    string? UserName,
    string ActionType,
    string ModuleCode,
    string? EntityType,
    Guid? EntityId,
    string Description,
    string? IpAddress,
    bool IsSuccess);
