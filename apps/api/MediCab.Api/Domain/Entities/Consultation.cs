using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class Consultation : AuditableEntity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid DoctorUserId { get; set; }

    public User DoctorUser { get; set; } = null!;

    public Guid? AppointmentId { get; set; }

    public Appointment? Appointment { get; set; }

    public DateOnly ConsultationDate { get; set; }

    public TimeOnly ConsultationTime { get; set; }

    public AppointmentType ConsultationType { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string Anamnesis { get; set; } = string.Empty;

    public string Assessment { get; set; } = string.Empty;

    public string Plan { get; set; } = string.Empty;

    public DateOnly? FollowUpDate { get; set; }

    public string? FollowUpInstructions { get; set; }

    public ConsultationStatus Status { get; set; }

    public DateTimeOffset? SignedAt { get; set; }

    public ConsultationExam? Exam { get; set; }

    public ICollection<PatientDiagnosis> Diagnoses { get; set; } = [];

    public ICollection<ConsultationSecondaryDiagnosis> SecondaryDiagnoses { get; set; } = [];

    public ICollection<VitalSign> VitalSigns { get; set; } = [];

    public ICollection<ActiveTreatment> ActiveTreatments { get; set; } = [];

    public ICollection<Prescription> Prescriptions { get; set; } = [];

    public ICollection<MedicalDocument> Documents { get; set; } = [];

    public ICollection<Invoice> Invoices { get; set; } = [];
}
