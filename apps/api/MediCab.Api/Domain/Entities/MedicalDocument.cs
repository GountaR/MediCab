using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class MedicalDocument : AuditableEntity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid? DoctorUserId { get; set; }

    public User? DoctorUser { get; set; }

    public Guid? ConsultationId { get; set; }

    public Consultation? Consultation { get; set; }

    public DocumentType DocumentType { get; set; }

    public DocumentStatus Status { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Subtitle { get; set; }

    public string? Summary { get; set; }

    public string StorageKind { get; set; } = "generated";

    public string StoragePath { get; set; } = string.Empty;

    public string MimeType { get; set; } = "application/pdf";

    public long? SizeBytes { get; set; }
}
