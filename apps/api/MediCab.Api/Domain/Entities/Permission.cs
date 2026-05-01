using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class Permission : Entity
{
    public string ModuleCode { get; set; } = string.Empty;

    public string ActionCode { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public ICollection<RolePermission> RolePermissions { get; set; } = [];
}
