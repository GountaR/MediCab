namespace MediCab.Api.Contracts.Users;

public sealed record UserListItemDto(
    Guid Id,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string Role,
    string Status,
    string? Specialty,
    string? Rpps,
    DateTimeOffset? LastLoginAt);

public sealed record UserDetailDto(
    Guid Id,
    string FirstName,
    string LastName,
    string FullName,
    string Email,
    string? Phone,
    string Role,
    string Status,
    string? Specialty,
    string? Rpps,
    DateTimeOffset? LastLoginAt,
    DateTimeOffset CreatedAt,
    bool MustChangePassword);
