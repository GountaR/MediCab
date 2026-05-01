using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class PrescriptionItem : Entity
{
    public Guid PrescriptionId { get; set; }

    public Prescription Prescription { get; set; } = null!;

    public string Dci { get; set; } = string.Empty;

    public string? BrandName { get; set; }

    public string Dosage { get; set; } = string.Empty;

    public string Posology { get; set; } = string.Empty;

    public string Route { get; set; } = string.Empty;

    public string DurationLabel { get; set; } = string.Empty;

    public string QuantityLabel { get; set; } = string.Empty;

    public int RenewalCount { get; set; }

    public bool NonSubstitutable { get; set; }

    public string? Instructions { get; set; }
}
