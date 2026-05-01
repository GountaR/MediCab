using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class PatientAllergy : Entity
{
    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public string Label { get; set; } = string.Empty;

    public string? Notes { get; set; }
}
