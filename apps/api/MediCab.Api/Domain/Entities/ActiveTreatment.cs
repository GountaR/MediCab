using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class ActiveTreatment : AuditableEntity
{
    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid PrescriberUserId { get; set; }

    public User PrescriberUser { get; set; } = null!;

    public Guid? ConsultationId { get; set; }

    public Consultation? Consultation { get; set; }

    public string Dci { get; set; } = string.Empty;

    public string? BrandName { get; set; }

    public string Dosage { get; set; } = string.Empty;

    public string Posology { get; set; } = string.Empty;

    public string Route { get; set; } = string.Empty;

    public DateOnly StartedOn { get; set; }

    public TreatmentStatus Status { get; set; }

    public bool NonSubstitutable { get; set; }

    public string? Notes { get; set; }
}
