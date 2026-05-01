using MediCab.Api.Domain.Entities;
using MediCab.Api.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Infrastructure.Persistence;

public static class DevelopmentDataSeeder
{
    private static readonly Guid ClinicId = Guid.Parse("a1111111-1111-1111-1111-111111111111");
    private static readonly Guid RoleAdminId = Guid.Parse("a2222222-1111-1111-1111-111111111111");
    private static readonly Guid RoleDoctorId = Guid.Parse("a2222222-2222-1111-1111-111111111111");
    private static readonly Guid RoleReceptionId = Guid.Parse("a2222222-3333-1111-1111-111111111111");
    private static readonly Guid AdminUserId = Guid.Parse("a3333333-1111-1111-1111-111111111111");
    private static readonly Guid DoctorUserId = Guid.Parse("a3333333-2222-1111-1111-111111111111");
    private static readonly Guid ReceptionUserId = Guid.Parse("a3333333-3333-1111-1111-111111111111");
    private static readonly Guid PatientOneId = Guid.Parse("a4444444-1111-1111-1111-111111111111");
    private static readonly Guid PatientTwoId = Guid.Parse("a4444444-2222-1111-1111-111111111111");
    private static readonly Guid AppointmentOneId = Guid.Parse("a5555555-1111-1111-1111-111111111111");
    private static readonly Guid AppointmentTwoId = Guid.Parse("a5555555-2222-1111-1111-111111111111");
    private static readonly Guid ConsultationOneId = Guid.Parse("a6666666-1111-1111-1111-111111111111");
    private static readonly Guid InvoiceOneId = Guid.Parse("a7777777-1111-1111-1111-111111111111");

    public static async Task SeedAsync(MediCabDbContext dbContext, CancellationToken cancellationToken = default)
    {
        if (await dbContext.Clinics.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;
        var clinic = new Clinic
        {
            Id = ClinicId,
            Name = "Cabinet Médical Renard-Marchand",
            AddressLine1 = "14 avenue de la Victoire",
            PostalCode = "75001",
            City = "Paris",
            Phone = "01 42 00 00 00",
            Email = "contact@cabinet-renard-marchand.fr",
            Website = "www.cabinet-renard-marchand.fr",
            Siret = "12345678900012",
            Rpps = "00003456789",
            CreatedAt = now,
            UpdatedAt = now
        };

        var roleAdmin = new Role
        {
            Id = RoleAdminId,
            Code = UserRoleCode.Admin,
            Name = "Administrateur",
            Description = "Accès complet au pilotage du cabinet.",
            IsSystem = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        var roleDoctor = new Role
        {
            Id = RoleDoctorId,
            Code = UserRoleCode.Doctor,
            Name = "Médecin",
            Description = "Accès clinique sur ses patients déjà consultés.",
            IsSystem = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        var roleReception = new Role
        {
            Id = RoleReceptionId,
            Code = UserRoleCode.Reception,
            Name = "Réceptionniste",
            Description = "Accueil, rendez-vous et facturation administrative.",
            IsSystem = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        var adminUser = new User
        {
            Id = AdminUserId,
            ClinicId = ClinicId,
            RoleId = RoleAdminId,
            FirstName = "Pierre",
            LastName = "Gaillard",
            Email = "p.gaillard@medicab.fr",
            Phone = "01 42 00 00 01",
            PasswordHash = "dev-only",
            Status = UserStatus.Actif,
            LastLoginAt = now.AddHours(-2),
            MustChangePassword = false,
            CreatedAt = now.AddMonths(-18),
            UpdatedAt = now
        };

        var doctorUser = new User
        {
            Id = DoctorUserId,
            ClinicId = ClinicId,
            RoleId = RoleDoctorId,
            FirstName = "Étienne",
            LastName = "Renard",
            Email = "e.renard@medicab.fr",
            Phone = "01 42 00 00 02",
            PasswordHash = "dev-only",
            Status = UserStatus.Actif,
            LastLoginAt = now.AddHours(-1),
            MustChangePassword = false,
            CreatedAt = now.AddMonths(-18),
            UpdatedAt = now
        };

        var receptionUser = new User
        {
            Id = ReceptionUserId,
            ClinicId = ClinicId,
            RoleId = RoleReceptionId,
            FirstName = "Pauline",
            LastName = "Girard",
            Email = "p.girard@medicab.fr",
            Phone = "01 42 00 00 05",
            PasswordHash = "dev-only",
            Status = UserStatus.Actif,
            LastLoginAt = now.AddHours(-3),
            MustChangePassword = false,
            CreatedAt = now.AddMonths(-12),
            UpdatedAt = now
        };

        var doctorProfile = new DoctorProfile
        {
            UserId = DoctorUserId,
            Specialty = "Médecine générale",
            Rpps = "10003456789",
            DisplayColor = "#1d5fa8",
            CreatedAt = now.AddMonths(-18),
            UpdatedAt = now
        };

        var patientOne = new Patient
        {
            Id = PatientOneId,
            ClinicId = ClinicId,
            Dpi = "DPI-10248",
            FirstName = "Marie",
            LastName = "Dupont",
            BirthDate = new DateOnly(1968, 10, 14),
            Gender = "Féminin",
            Phone = "06 10 00 00 01",
            Email = "marie.dupont@example.fr",
            Address = "14 rue des Tilleuls, Paris",
            InsuranceName = "MGEN",
            InsuranceMemberNumber = "A12345",
            PrimaryDoctorUserId = DoctorUserId,
            Status = PatientStatus.Actif,
            BloodGroup = "A+",
            CreatedAt = now.AddMonths(-6),
            UpdatedAt = now
        };

        var patientTwo = new Patient
        {
            Id = PatientTwoId,
            ClinicId = ClinicId,
            Dpi = "DPI-10402",
            FirstName = "Nathalie",
            LastName = "Bernard",
            BirthDate = new DateOnly(1979, 6, 22),
            Gender = "Féminin",
            Phone = "06 10 00 00 02",
            Email = "nathalie.bernard@example.fr",
            Address = "9 avenue Victor Hugo, Paris",
            InsuranceName = "Harmonie Mutuelle",
            InsuranceMemberNumber = "B99887",
            PrimaryDoctorUserId = DoctorUserId,
            Status = PatientStatus.Actif,
            BloodGroup = "O+",
            CreatedAt = now.AddMonths(-4),
            UpdatedAt = now
        };

        var patientOneAllergy = new PatientAllergy
        {
            PatientId = PatientOneId,
            Label = "Pénicilline",
            Notes = "Éruption cutanée connue."
        };

        var patientOneTag = new PatientTag
        {
            PatientId = PatientOneId,
            Label = "Diabète"
        };

        var appointmentOne = new Appointment
        {
            Id = AppointmentOneId,
            ClinicId = ClinicId,
            PatientId = PatientOneId,
            DoctorUserId = DoctorUserId,
            ScheduledStartAt = now.Date.AddHours(9).AddMinutes(30),
            DurationMinutes = 30,
            AppointmentType = AppointmentType.Suivi,
            Status = AppointmentStatus.Planifie,
            Notes = "Suivi diabète et renouvellement",
            CreatedByUserId = ReceptionUserId,
            CreatedAt = now.AddDays(-2),
            UpdatedAt = now
        };

        var appointmentTwo = new Appointment
        {
            Id = AppointmentTwoId,
            ClinicId = ClinicId,
            PatientId = PatientTwoId,
            DoctorUserId = DoctorUserId,
            ScheduledStartAt = now.Date.AddHours(10),
            DurationMinutes = 45,
            AppointmentType = AppointmentType.Prevention,
            Status = AppointmentStatus.Accueilli,
            Notes = "Bilan annuel",
            CreatedByUserId = ReceptionUserId,
            CreatedAt = now.AddDays(-1),
            UpdatedAt = now
        };

        var consultationOne = new Consultation
        {
            Id = ConsultationOneId,
            ClinicId = ClinicId,
            PatientId = PatientOneId,
            DoctorUserId = DoctorUserId,
            AppointmentId = AppointmentOneId,
            ConsultationDate = DateOnly.FromDateTime(now.Date.AddDays(-10)),
            ConsultationTime = new TimeOnly(9, 30),
            ConsultationType = AppointmentType.Suivi,
            Reason = "Suivi diabète type 2",
            Anamnesis = "Fatigue légère depuis trois semaines, pas d'hypoglycémie signalée.",
            Assessment = "Équilibre correct, traitement à poursuivre.",
            Plan = "Poursuite traitement, bilan dans trois mois.",
            Status = ConsultationStatus.Signee,
            SignedAt = now.AddDays(-10),
            CreatedAt = now.AddDays(-10),
            UpdatedAt = now.AddDays(-10)
        };

        var consultationExam = new ConsultationExam
        {
            ConsultationId = ConsultationOneId,
            WeightKg = 76.0m,
            HeightCm = 164,
            BloodPressure = "138/82",
            HeartRate = 74,
            TemperatureC = 37.1m,
            Spo2 = 98,
            Cardiovascular = "Bruits cardiaques réguliers",
            Respiratory = "Auscultation claire"
        };

        var invoiceOne = new Invoice
        {
            Id = InvoiceOneId,
            ClinicId = ClinicId,
            Number = "FAC-2026-0894",
            PatientId = PatientOneId,
            DoctorUserId = DoctorUserId,
            AppointmentId = AppointmentOneId,
            ConsultationId = ConsultationOneId,
            IssuedOn = DateOnly.FromDateTime(now.Date.AddDays(-9)),
            DueOn = DateOnly.FromDateTime(now.Date.AddDays(6)),
            Reason = "Consultation - Suivi diabète",
            TotalAmount = 26.50m,
            PaidAmount = 0m,
            Status = InvoiceStatus.Envoyee,
            CreatedByUserId = ReceptionUserId,
            CreatedAt = now.AddDays(-9),
            UpdatedAt = now.AddDays(-9)
        };

        dbContext.AddRange(
            clinic,
            roleAdmin,
            roleDoctor,
            roleReception,
            adminUser,
            doctorUser,
            receptionUser,
            doctorProfile,
            patientOne,
            patientTwo,
            patientOneAllergy,
            patientOneTag,
            appointmentOne,
            appointmentTwo,
            consultationOne,
            consultationExam,
            invoiceOne);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
