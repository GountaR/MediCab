namespace MediCab.Api.Contracts.Consultations;

public sealed record ConsultationListItemDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    Guid? AppointmentId,
    DateOnly ConsultationDate,
    TimeOnly ConsultationTime,
    string ConsultationType,
    string Reason,
    string Status,
    DateOnly? FollowUpDate);

public sealed record ConsultationExamDto(
    decimal? WeightKg,
    decimal? HeightCm,
    string? BloodPressure,
    int? HeartRate,
    decimal? TemperatureC,
    int? Spo2,
    string? Cardiovascular,
    string? Respiratory,
    string? Abdomen,
    string? Neurological,
    string? Orl,
    string? OtherNotes);

public sealed record ConsultationTreatmentDto(
    Guid Id,
    string Dci,
    string? BrandName,
    string Dosage,
    string Posology,
    string Route,
    string Status,
    bool NonSubstitutable,
    string? Notes);

public sealed record ConsultationDetailDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    Guid? AppointmentId,
    DateOnly ConsultationDate,
    TimeOnly ConsultationTime,
    string ConsultationType,
    string Reason,
    string Anamnesis,
    string Assessment,
    string Plan,
    string Status,
    DateOnly? FollowUpDate,
    string? FollowUpInstructions,
    string? PrimaryDiagnosis,
    IReadOnlyList<string> SecondaryDiagnoses,
    ConsultationExamDto? Exam,
    IReadOnlyList<ConsultationTreatmentDto> ActiveTreatments,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    DateTimeOffset? SignedAt);
