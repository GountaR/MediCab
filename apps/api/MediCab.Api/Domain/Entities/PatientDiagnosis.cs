using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class PatientDiagnosis : AuditableEntity
{
    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid? ConsultationId { get; set; }

    public Consultation? Consultation { get; set; }

    public string Icd10Code { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public DiagnosisStatus Status { get; set; }

    public DateOnly StartedOn { get; set; }

    public string? Notes { get; set; }
}
