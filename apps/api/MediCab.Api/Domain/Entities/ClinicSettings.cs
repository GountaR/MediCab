using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class ClinicSettings : Entity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public int DefaultAppointmentDurationMinutes { get; set; }

    public int NewPatientDurationMinutes { get; set; }

    public int ProcedureDurationMinutes { get; set; }

    public int EmailReminderHours { get; set; }

    public bool AllowWalkInConsultations { get; set; }

    public bool AutoPrepareInvoice { get; set; }

    public bool ShowDebtAlerts { get; set; }

    public int PaymentDelayDays { get; set; }

    public int OverdueReminderDays { get; set; }

    public int MinPasswordLength { get; set; }

    public int SessionTimeoutMinutes { get; set; }

    public bool ForceTwoFactor { get; set; }

    public bool AuditConnections { get; set; }

    public string BackupFrequency { get; set; } = string.Empty;

    public int BackupRetentionDays { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
