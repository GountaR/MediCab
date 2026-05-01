namespace MediCab.Api.Contracts.Invoices;

public sealed record InvoiceListItemDto(
    Guid Id,
    string Number,
    Guid PatientId,
    string PatientName,
    Guid? DoctorId,
    string? DoctorName,
    DateOnly IssuedOn,
    DateOnly DueOn,
    string Reason,
    decimal TotalAmount,
    decimal PaidAmount,
    decimal RemainingAmount,
    string Status,
    int DaysLate);

public sealed record InvoicePaymentDto(
    Guid Id,
    decimal Amount,
    DateOnly PaidOn,
    Guid RecordedByUserId,
    string RecordedByName,
    string? Notes,
    DateTimeOffset CreatedAt);

public sealed record InvoiceDetailDto(
    Guid Id,
    string Number,
    Guid PatientId,
    string PatientName,
    Guid? DoctorId,
    string? DoctorName,
    Guid? AppointmentId,
    Guid? ConsultationId,
    DateOnly IssuedOn,
    DateOnly DueOn,
    string Reason,
    decimal TotalAmount,
    decimal PaidAmount,
    decimal RemainingAmount,
    string Status,
    int DaysLate,
    IReadOnlyList<InvoicePaymentDto> Payments,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
