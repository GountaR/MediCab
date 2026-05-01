using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class AuditLog : Entity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public Guid? UserId { get; set; }

    public User? User { get; set; }

    public AuditActionType ActionType { get; set; }

    public string ModuleCode { get; set; } = string.Empty;

    public string? EntityType { get; set; }

    public Guid? EntityId { get; set; }

    public string Description { get; set; } = string.Empty;

    public string? IpAddress { get; set; }

    public bool IsSuccess { get; set; }

    public DateTimeOffset OccurredAt { get; set; } = DateTimeOffset.UtcNow;
}
