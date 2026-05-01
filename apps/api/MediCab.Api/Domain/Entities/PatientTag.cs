using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class PatientTag : Entity
{
    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public string Label { get; set; } = string.Empty;
}
