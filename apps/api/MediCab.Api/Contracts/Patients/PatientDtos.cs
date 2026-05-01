namespace MediCab.Api.Contracts.Patients;

public sealed record PatientListItemDto(
    Guid Id,
    string Dpi,
    string FirstName,
    string LastName,
    string FullName,
    DateOnly BirthDate,
    string Phone,
    string Status,
    Guid? PrimaryDoctorId,
    string? PrimaryDoctorName,
    DateOnly? LastVisitDate,
    DateTimeOffset? NextAppointmentAt,
    decimal UnpaidBalance);

public sealed record PatientDetailDto(
    Guid Id,
    string Dpi,
    string FirstName,
    string LastName,
    string FullName,
    DateOnly BirthDate,
    string Gender,
    string Phone,
    string? Email,
    string Address,
    string? InsuranceName,
    string? InsuranceMemberNumber,
    string Status,
    string? BloodGroup,
    Guid? PrimaryDoctorId,
    string? PrimaryDoctorName,
    IReadOnlyList<string> Allergies,
    IReadOnlyList<string> Tags,
    decimal UnpaidBalance,
    DateOnly? LastVisitDate,
    DateTimeOffset? NextAppointmentAt);
