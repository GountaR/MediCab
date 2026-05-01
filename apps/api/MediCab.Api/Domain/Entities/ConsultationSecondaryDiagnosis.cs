using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class ConsultationSecondaryDiagnosis : Entity
{
    public Guid ConsultationId { get; set; }

    public Consultation Consultation { get; set; } = null!;

    public string Label { get; set; } = string.Empty;
}
