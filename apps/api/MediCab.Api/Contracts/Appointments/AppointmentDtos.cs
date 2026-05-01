namespace MediCab.Api.Contracts.Appointments;

public sealed record AppointmentListItemDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    DateTimeOffset ScheduledStartAt,
    int DurationMinutes,
    string AppointmentType,
    string Status,
    string? Notes);

public sealed record AppointmentDetailDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid DoctorId,
    string DoctorName,
    DateTimeOffset ScheduledStartAt,
    int DurationMinutes,
    string AppointmentType,
    string Status,
    string? Notes,
    string? CancellationReason,
    Guid CreatedByUserId,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
