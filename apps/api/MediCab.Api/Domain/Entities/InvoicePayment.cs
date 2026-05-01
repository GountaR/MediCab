using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class InvoicePayment : Entity
{
    public Guid InvoiceId { get; set; }

    public Invoice Invoice { get; set; } = null!;

    public decimal Amount { get; set; }

    public DateOnly PaidOn { get; set; }

    public Guid RecordedByUserId { get; set; }

    public User RecordedByUser { get; set; } = null!;

    public string? Notes { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
