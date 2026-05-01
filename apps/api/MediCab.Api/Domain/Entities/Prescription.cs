using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class Prescription : AuditableEntity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid DoctorUserId { get; set; }

    public User DoctorUser { get; set; } = null!;

    public Guid? ConsultationId { get; set; }

    public Consultation? Consultation { get; set; }

    public DateOnly IssuedOn { get; set; }

    public DateOnly? ExpiresOn { get; set; }

    public PrescriptionStatus Status { get; set; }

    public string? Instructions { get; set; }

    public ICollection<PrescriptionItem> Items { get; set; } = [];
}
