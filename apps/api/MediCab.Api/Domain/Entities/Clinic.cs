using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class Clinic : AuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public string AddressLine1 { get; set; } = string.Empty;

    public string? AddressLine2 { get; set; }

    public string PostalCode { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Website { get; set; }

    public string? Siret { get; set; }

    public string? Rpps { get; set; }

    public ICollection<ClinicSchedule> Schedules { get; set; } = [];

    public ClinicSettings? Settings { get; set; }

    public ICollection<User> Users { get; set; } = [];

    public ICollection<Patient> Patients { get; set; } = [];
}
