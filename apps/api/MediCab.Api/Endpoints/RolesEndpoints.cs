using MediCab.Api.Contracts.Roles;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class RolesEndpoints
{
    public static IEndpointRouteBuilder MapRolesReadEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/roles", GetRolesAsync)
            .WithTags("Roles")
            .WithName("GetRoles");

        return app;
    }

    private static async Task<Ok<IReadOnlyList<RoleDto>>> GetRolesAsync(
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var roles = await dbContext.Roles
            .AsNoTracking()
            .Include(item => item.RolePermissions)
                .ThenInclude(item => item.Permission)
            .OrderBy(item => item.Name)
            .ToListAsync(cancellationToken);

        var items = roles.Select(role => new RoleDto(
            role.Id,
            role.Code.ToString().ToUpperInvariant(),
            role.Name,
            role.Description,
            role.IsSystem,
            role.RolePermissions
                .OrderBy(item => item.Permission.ModuleCode)
                .ThenBy(item => item.Permission.ActionCode)
                .Select(item => $"{item.Permission.ModuleCode}:{item.Permission.ActionCode}")
                .ToList()))
            .ToList();

        return TypedResults.Ok<IReadOnlyList<RoleDto>>(items);
    }
}
