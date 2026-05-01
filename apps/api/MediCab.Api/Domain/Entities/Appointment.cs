using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class Appointment : AuditableEntity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid DoctorUserId { get; set; }

    public User DoctorUser { get; set; } = null!;

    public DateTimeOffset ScheduledStartAt { get; set; }

    public int DurationMinutes { get; set; }

    public AppointmentType AppointmentType { get; set; }

    public AppointmentStatus Status { get; set; }

    public string? Notes { get; set; }

    public string? CancellationReason { get; set; }

    public Guid CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = null!;

    public ICollection<Consultation> Consultations { get; set; } = [];

    public ICollection<Invoice> Invoices { get; set; } = [];
}
