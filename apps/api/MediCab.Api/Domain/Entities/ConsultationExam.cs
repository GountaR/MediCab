using MediCab.Api.Domain.Common;

namespace MediCab.Api.Domain.Entities;

public class ConsultationExam : Entity
{
    public Guid ConsultationId { get; set; }

    public Consultation Consultation { get; set; } = null!;

    public decimal? WeightKg { get; set; }

    public decimal? HeightCm { get; set; }

    public string? BloodPressure { get; set; }

    public int? HeartRate { get; set; }

    public decimal? TemperatureC { get; set; }

    public int? Spo2 { get; set; }

    public string? Cardiovascular { get; set; }

    public string? Respiratory { get; set; }

    public string? Abdomen { get; set; }

    public string? Neurological { get; set; }

    public string? Orl { get; set; }

    public string? OtherNotes { get; set; }
}
