using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Domain.Entities;

public class Role : AuditableEntity
{
    public UserRoleCode Code { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public bool IsSystem { get; set; }

    public ICollection<User> Users { get; set; } = [];

    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}
