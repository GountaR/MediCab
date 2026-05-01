using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class DoctorProfile : Entity
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public string Specialty { get; set; } = string.Empty;

    public string Rpps { get; set; } = string.Empty;

    public string DisplayColor { get; set; } = "#1d5fa8";

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
