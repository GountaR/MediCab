using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class ClinicSchedule : Entity
{
    public Guid ClinicId { get; set; }

    public Clinic Clinic { get; set; } = null!;

    public int DayOfWeek { get; set; }

    public bool IsOpen { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }
}
