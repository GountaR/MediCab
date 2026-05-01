namespace MediCab.Api.Contracts.Documents;

public sealed record DocumentListItemDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid? DoctorId,
    string? DoctorName,
    Guid? ConsultationId,
    string DocumentType,
    string Status,
    string Title,
    string? Subtitle,
    string StorageKind,
    string MimeType,
    long? SizeBytes,
    DateTimeOffset CreatedAt);

public sealed record DocumentDetailDto(
    Guid Id,
    Guid PatientId,
    string PatientName,
    Guid? DoctorId,
    string? DoctorName,
    Guid? ConsultationId,
    string DocumentType,
    string Status,
    string Title,
    string? Subtitle,
    string? Summary,
    string StorageKind,
    string StoragePath,
    string MimeType,
    long? SizeBytes,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);
