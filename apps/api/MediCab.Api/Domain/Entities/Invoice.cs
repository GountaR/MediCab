using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class Invoice : AuditableEntity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public string Number { get; set; } = string.Empty;

    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid? DoctorUserId { get; set; }

    public User? DoctorUser { get; set; }

    public Guid? AppointmentId { get; set; }

    public Appointment? Appointment { get; set; }

    public Guid? ConsultationId { get; set; }

    public Consultation? Consultation { get; set; }

    public DateOnly IssuedOn { get; set; }

    public DateOnly DueOn { get; set; }

    public string Reason { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public InvoiceStatus Status { get; set; }

    public Guid CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = null!;

    public Guid? ValidatedByUserId { get; set; }

    public User? ValidatedByUser { get; set; }

    public ICollection<InvoicePayment> Payments { get; set; } = [];
}
