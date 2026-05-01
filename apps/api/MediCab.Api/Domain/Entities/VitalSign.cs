using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class VitalSign : Entity
{
    public Guid PatientId { get; set; }

    public Patient Patient { get; set; } = null!;

    public Guid? ConsultationId { get; set; }

    public Consultation? Consultation { get; set; }

    public DateTimeOffset MeasuredAt { get; set; }

    public decimal? WeightKg { get; set; }

    public decimal? HeightCm { get; set; }

    public string? BloodPressure { get; set; }

    public int? HeartRate { get; set; }

    public decimal? TemperatureC { get; set; }

    public int? Spo2 { get; set; }
}
