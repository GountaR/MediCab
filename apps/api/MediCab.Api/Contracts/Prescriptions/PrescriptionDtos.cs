namespace MediCab.Api.Contracts.Prescriptions;

public sealed record PrescriptionItemDto(
    Guid Id,
    string Dci,
    string? BrandName,
    string Dosage,
    string Posology,
    string Route,
    string DurationLabel,
    string QuantityLabel,
    int RenewalCount,
    bool NonSubstitutable,
    string? Instructions);

public sealed record PrescriptionListItemDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    Guid? ConsultationId,
    DateOnly IssuedOn,
    DateOnly? ExpiresOn,
    string Status,
    int ItemsCount);

public sealed record PrescriptionDetailDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    Guid? ConsultationId,
    DateOnly IssuedOn,
    DateOnly? ExpiresOn,
    string Status,
    string? Instructions,
    IReadOnlyList<PrescriptionItemDto> Items,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
