using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class User : AuditableEntity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public Guid RoleId { get; set; }

    public Role Role { get; set; } = null!;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string PasswordHash { get; set; } = string.Empty;

    public UserStatus Status { get; set; }

    public DateTimeOffset? LastLoginAt { get; set; }

    public bool MustChangePassword { get; set; } = true;

    public DoctorProfile? DoctorProfile { get; set; }
}
