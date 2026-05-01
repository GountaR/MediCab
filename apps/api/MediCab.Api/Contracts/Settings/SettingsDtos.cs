namespace MediCab.Api.Contracts.Settings;

public sealed record ClinicScheduleDto(
    int DayOfWeek,
    string DayLabel,
    bool IsOpen,
    TimeOnly? StartTime,
    TimeOnly? EndTime);

public sealed record SettingsDto(
    ClinicSummaryDto Clinic,
    AppointmentSettingsDto Appointments,
    BillingSettingsDto Billing,
    SecuritySettingsDto Security);

public sealed record ClinicSummaryDto(
    Guid Id,
    string Name,
    string AddressLine1,
    string? AddressLine2,
    string PostalCode,
    string City,
    string Phone,
    string Email,
    string? Website,
    string? Siret,
    string? Rpps,
    IReadOnlyList<ClinicScheduleDto> Schedule);

public sealed record AppointmentSettingsDto(
    int DefaultDurationMinutes,
    int NewPatientDurationMinutes,
    int ProcedureDurationMinutes,
    int EmailReminderHours,
    bool AllowWalkInConsultations);

public sealed record BillingSettingsDto(
    bool AutoPrepareInvoice,
    bool ShowDebtAlerts,
    int PaymentDelayDays,
    int OverdueReminderDays);

public sealed record SecuritySettingsDto(
    int MinPasswordLength,
    int SessionTimeoutMinutes,
    bool ForceTwoFactor,
    bool AuditConnections,
    string BackupFrequency,
    int BackupRetentionDays);
