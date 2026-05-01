namespace MediCab.Api.Contracts.Roles;

public sealed record RoleDto(
    Guid Id,
    string Code,
    string Name,
    string Description,
    bool IsSystem,
    IReadOnlyList<string> Permissions);
