using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class Patient : AuditableEntity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public string Dpi { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public DateOnly BirthDate { get; set; }

    public string Gender { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Email { get; set; }

    public string Address { get; set; } = string.Empty;

    public string? InsuranceName { get; set; }

    public string? InsuranceMemberNumber { get; set; }

    public Guid? PrimaryDoctorUserId { get; set; }

    public User? PrimaryDoctorUser { get; set; }

    public PatientStatus Status { get; set; }

    public string? BloodGroup { get; set; }

    public ICollection<PatientAllergy> Allergies { get; set; } = [];

    public ICollection<PatientTag> Tags { get; set; } = [];

    public ICollection<Appointment> Appointments { get; set; } = [];

    public ICollection<Consultation> Consultations { get; set; } = [];

    public ICollection<Invoice> Invoices { get; set; } = [];
}
