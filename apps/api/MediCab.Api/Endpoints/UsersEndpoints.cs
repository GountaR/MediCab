using MediCab.Api.Contracts.Common;
using MediCab.Api.Contracts.Users;
using MediCab.Api.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Endpoints;

public static class UsersEndpoints
{
    public static IEndpointRouteBuilder MapUsersReadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").WithTags("Users");

        group.MapGet("/", GetUsersAsync)
            .WithName("GetUsers");

        group.MapGet("/{userId:guid}", GetUserByIdAsync)
            .WithName("GetUserById");

        return app;
    }

    private static async Task<Ok<PagedResponse<UserListItemDto>>> GetUsersAsync(
        [AsParameters] UsersQuery query,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var usersQuery = dbContext.Users
            .AsNoTracking()
            .Include(user => user.Role)
            .Include(user => user.DoctorProfile)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim().ToLower();
            usersQuery = usersQuery.Where(user =>
                (user.FirstName + " " + user.LastName).ToLower().Contains(search) ||
                user.Email.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Role))
        {
            usersQuery = usersQuery.Where(user => user.Role.Name == query.Role);
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            usersQuery = usersQuery.Where(user => user.Status.ToDisplay() == query.Status);
        }

        var total = await usersQuery.CountAsync(cancellationToken);
        var page = Math.Max(query.Page ?? 1, 1);
        var pageSize = Math.Clamp(query.PageSize ?? 20, 1, 100);

        var users = await usersQuery
            .OrderBy(user => user.LastName)
            .ThenBy(user => user.FirstName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = users
            .Select(user => new UserListItemDto(
                user.Id,
                user.FirstName,
                user.LastName,
                user.FullName(),
                user.Email,
                user.Phone,
                user.Role.Code.ToDisplay(),
                user.Status.ToDisplay(),
                user.DoctorProfile?.Specialty,
                user.DoctorProfile?.Rpps,
                user.LastLoginAt))
            .ToList();

        return TypedResults.Ok(new PagedResponse<UserListItemDto>(items, page, pageSize, total));
    }

    private static async Task<Results<Ok<UserDetailDto>, NotFound>> GetUserByIdAsync(
        Guid userId,
        MediCabDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .AsNoTracking()
            .Include(item => item.Role)
            .Include(item => item.DoctorProfile)
            .FirstOrDefaultAsync(item => item.Id == userId, cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(new UserDetailDto(
            user.Id,
            user.FirstName,
            user.LastName,
            user.FullName(),
            user.Email,
            user.Phone,
            user.Role.Code.ToDisplay(),
            user.Status.ToDisplay(),
            user.DoctorProfile?.Specialty,
            user.DoctorProfile?.Rpps,
            user.LastLoginAt,
            user.CreatedAt,
            user.MustChangePassword));
    }

    private sealed class UsersQuery
    {
        public string? Search { get; init; }

        public string? Role { get; init; }

        public string? Status { get; init; }

        public int? Page { get; init; }

        public int? PageSize { get; init; }
    }
}
