using MediCab.Api.Domain.Common;
using MediCab.Api.Domain.Entities;
using MediCab.Api.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace MediCab.Api.Infrastructure.Persistence;

public class MediCabDbContext(DbContextOptions<MediCabDbContext> options) : DbContext(options)
{
    public DbSet<Clinic> Clinics => Set<Clinic>();
    public DbSet<ClinicSchedule> ClinicSchedules => Set<ClinicSchedule>();
    public DbSet<ClinicSettings> ClinicSettings => Set<ClinicSettings>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<User> Users => Set<User>();
    public DbSet<DoctorProfile> DoctorProfiles => Set<DoctorProfile>();
    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<PatientAllergy> PatientAllergies => Set<PatientAllergy>();
    public DbSet<PatientTag> PatientTags => Set<PatientTag>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Consultation> Consultations => Set<Consultation>();
    public DbSet<ConsultationExam> ConsultationExams => Set<ConsultationExam>();
    public DbSet<PatientDiagnosis> PatientDiagnoses => Set<PatientDiagnosis>();
    public DbSet<ConsultationSecondaryDiagnosis> ConsultationSecondaryDiagnoses => Set<ConsultationSecondaryDiagnosis>();
    public DbSet<VitalSign> VitalSigns => Set<VitalSign>();
    public DbSet<ActiveTreatment> ActiveTreatments => Set<ActiveTreatment>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
    public DbSet<MedicalDocument> MedicalDocuments => Set<MedicalDocument>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoicePayment> InvoicePayments => Set<InvoicePayment>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureCommon(modelBuilder);
        ConfigureClinic(modelBuilder);
        ConfigureSecurity(modelBuilder);
        ConfigurePatients(modelBuilder);
        ConfigureAppointments(modelBuilder);
        ConfigureClinical(modelBuilder);
        ConfigureDocuments(modelBuilder);
        ConfigureInvoices(modelBuilder);
        ConfigureAudit(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateAuditTimestamps();
        return base.SaveChanges();
    }

    private void UpdateAuditTimestamps()
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }
    }

    private static void ConfigureCommon(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties().Where(property => property.ClrType.IsEnum))
            {
                property.SetMaxLength(64);
            }
        }
    }

    private static void ConfigureClinic(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Clinic>(entity =>
        {
            entity.ToTable("clinic");
            entity.Property(item => item.Name).HasMaxLength(200).IsRequired();
            entity.Property(item => item.AddressLine1).HasMaxLength(200).IsRequired();
            entity.Property(item => item.AddressLine2).HasMaxLength(200);
            entity.Property(item => item.PostalCode).HasMaxLength(16).IsRequired();
            entity.Property(item => item.City).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Phone).HasMaxLength(32).IsRequired();
            entity.Property(item => item.Email).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Website).HasMaxLength(200);
            entity.Property(item => item.Siret).HasMaxLength(32);
            entity.Property(item => item.Rpps).HasMaxLength(32);
        });

        modelBuilder.Entity<ClinicSchedule>(entity =>
        {
            entity.ToTable("clinic_schedule");
            entity.HasOne(item => item.Clinic).WithMany(item => item.Schedules).HasForeignKey(item => item.ClinicId);
        });

        modelBuilder.Entity<ClinicSettings>(entity =>
        {
            entity.ToTable("clinic_settings");
            entity.HasOne(item => item.Clinic).WithOne(item => item.Settings).HasForeignKey<ClinicSettings>(item => item.ClinicId);
            entity.Property(item => item.BackupFrequency).HasMaxLength(64).IsRequired();
        });
    }

    private static void ConfigureSecurity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("roles");
            entity.Property(item => item.Code).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.Name).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Description).HasMaxLength(500);
            entity.HasIndex(item => item.Code).IsUnique();
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.ToTable("permissions");
            entity.Property(item => item.ModuleCode).HasMaxLength(64).IsRequired();
            entity.Property(item => item.ActionCode).HasMaxLength(64).IsRequired();
            entity.Property(item => item.Label).HasMaxLength(200).IsRequired();
            entity.HasIndex(item => new { item.ModuleCode, item.ActionCode }).IsUnique();
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.ToTable("role_permissions");
            entity.HasKey(item => new { item.RoleId, item.PermissionId });
            entity.HasOne(item => item.Role).WithMany(item => item.RolePermissions).HasForeignKey(item => item.RoleId);
            entity.HasOne(item => item.Permission).WithMany(item => item.RolePermissions).HasForeignKey(item => item.PermissionId);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.Property(item => item.FirstName).HasMaxLength(120).IsRequired();
            entity.Property(item => item.LastName).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Email).HasMaxLength(200).IsRequired();
            entity.Property(item => item.Phone).HasMaxLength(32);
            entity.Property(item => item.PasswordHash).HasMaxLength(500).IsRequired();
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.HasIndex(item => new { item.ClinicId, item.Email }).IsUnique();
            entity.HasOne(item => item.Clinic).WithMany(item => item.Users).HasForeignKey(item => item.ClinicId);
            entity.HasOne(item => item.Role).WithMany(item => item.Users).HasForeignKey(item => item.RoleId);
        });

        modelBuilder.Entity<DoctorProfile>(entity =>
        {
            entity.ToTable("doctor_profiles");
            entity.Property(item => item.Specialty).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Rpps).HasMaxLength(32).IsRequired();
            entity.Property(item => item.DisplayColor).HasMaxLength(32).IsRequired();
            entity.HasIndex(item => item.UserId).IsUnique();
            entity.HasIndex(item => item.Rpps).IsUnique();
            entity.HasOne(item => item.User).WithOne(item => item.DoctorProfile).HasForeignKey<DoctorProfile>(item => item.UserId);
        });
    }

    private static void ConfigurePatients(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.ToTable("patients");
            entity.Property(item => item.Dpi).HasMaxLength(32).IsRequired();
            entity.Property(item => item.FirstName).HasMaxLength(120).IsRequired();
            entity.Property(item => item.LastName).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Gender).HasMaxLength(32).IsRequired();
            entity.Property(item => item.Phone).HasMaxLength(32).IsRequired();
            entity.Property(item => item.Email).HasMaxLength(200);
            entity.Property(item => item.Address).HasMaxLength(250).IsRequired();
            entity.Property(item => item.InsuranceName).HasMaxLength(160);
            entity.Property(item => item.InsuranceMemberNumber).HasMaxLength(64);
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.BloodGroup).HasMaxLength(8);
            entity.HasIndex(item => new { item.ClinicId, item.Dpi }).IsUnique();
            entity.HasIndex(item => new { item.ClinicId, item.LastName, item.FirstName });
            entity.HasOne(item => item.Clinic).WithMany(item => item.Patients).HasForeignKey(item => item.ClinicId);
            entity.HasOne(item => item.PrimaryDoctorUser).WithMany().HasForeignKey(item => item.PrimaryDoctorUserId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<PatientAllergy>(entity =>
        {
            entity.ToTable("patient_allergies");
            entity.Property(item => item.Label).HasMaxLength(160).IsRequired();
            entity.Property(item => item.Notes).HasMaxLength(500);
            entity.HasOne(item => item.Patient).WithMany(item => item.Allergies).HasForeignKey(item => item.PatientId);
        });

        modelBuilder.Entity<PatientTag>(entity =>
        {
            entity.ToTable("patient_tags");
            entity.Property(item => item.Label).HasMaxLength(80).IsRequired();
            entity.HasOne(item => item.Patient).WithMany(item => item.Tags).HasForeignKey(item => item.PatientId);
        });
    }

    private static void ConfigureAppointments(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("appointments");
            entity.Property(item => item.AppointmentType).HasConversion<string>().HasMaxLength(64);
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.Notes).HasMaxLength(2000);
            entity.Property(item => item.CancellationReason).HasMaxLength(500);
            entity.HasIndex(item => new { item.DoctorUserId, item.ScheduledStartAt });
            entity.HasIndex(item => new { item.PatientId, item.ScheduledStartAt });
            entity.HasIndex(item => new { item.Status, item.ScheduledStartAt });
            entity.HasOne(item => item.Patient).WithMany(item => item.Appointments).HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.DoctorUser).WithMany().HasForeignKey(item => item.DoctorUserId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(item => item.CreatedByUser).WithMany().HasForeignKey(item => item.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureClinical(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Consultation>(entity =>
        {
            entity.ToTable("consultations");
            entity.Property(item => item.ConsultationType).HasConversion<string>().HasMaxLength(64);
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.Reason).HasMaxLength(500).IsRequired();
            entity.Property(item => item.Anamnesis).HasMaxLength(4000).IsRequired();
            entity.Property(item => item.Assessment).HasMaxLength(4000).IsRequired();
            entity.Property(item => item.Plan).HasMaxLength(4000).IsRequired();
            entity.Property(item => item.FollowUpInstructions).HasMaxLength(2000);
            entity.HasIndex(item => new { item.DoctorUserId, item.ConsultationDate });
            entity.HasIndex(item => new { item.PatientId, item.ConsultationDate });
            entity.HasOne(item => item.Patient).WithMany(item => item.Consultations).HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.DoctorUser).WithMany().HasForeignKey(item => item.DoctorUserId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(item => item.Appointment).WithMany(item => item.Consultations).HasForeignKey(item => item.AppointmentId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ConsultationExam>(entity =>
        {
            entity.ToTable("consultation_exams");
            entity.Property(item => item.BloodPressure).HasMaxLength(32);
            entity.Property(item => item.Cardiovascular).HasMaxLength(1000);
            entity.Property(item => item.Respiratory).HasMaxLength(1000);
            entity.Property(item => item.Abdomen).HasMaxLength(1000);
            entity.Property(item => item.Neurological).HasMaxLength(1000);
            entity.Property(item => item.Orl).HasMaxLength(1000);
            entity.Property(item => item.OtherNotes).HasMaxLength(1000);
            entity.HasOne(item => item.Consultation).WithOne(item => item.Exam).HasForeignKey<ConsultationExam>(item => item.ConsultationId);
        });

        modelBuilder.Entity<PatientDiagnosis>(entity =>
        {
            entity.ToTable("patient_diagnoses");
            entity.Property(item => item.Icd10Code).HasMaxLength(32).IsRequired();
            entity.Property(item => item.Label).HasMaxLength(250).IsRequired();
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.Notes).HasMaxLength(1000);
            entity.HasOne(item => item.Patient).WithMany().HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.Consultation).WithMany(item => item.Diagnoses).HasForeignKey(item => item.ConsultationId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ConsultationSecondaryDiagnosis>(entity =>
        {
            entity.ToTable("consultation_secondary_diagnoses");
            entity.Property(item => item.Label).HasMaxLength(250).IsRequired();
            entity.HasOne(item => item.Consultation).WithMany(item => item.SecondaryDiagnoses).HasForeignKey(item => item.ConsultationId);
        });

        modelBuilder.Entity<VitalSign>(entity =>
        {
            entity.ToTable("vital_signs");
            entity.Property(item => item.BloodPressure).HasMaxLength(32);
            entity.HasOne(item => item.Patient).WithMany().HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.Consultation).WithMany(item => item.VitalSigns).HasForeignKey(item => item.ConsultationId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ActiveTreatment>(entity =>
        {
            entity.ToTable("active_treatments");
            entity.Property(item => item.Dci).HasMaxLength(200).IsRequired();
            entity.Property(item => item.BrandName).HasMaxLength(200);
            entity.Property(item => item.Dosage).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Posology).HasMaxLength(500).IsRequired();
            entity.Property(item => item.Route).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.Notes).HasMaxLength(1000);
            entity.HasOne(item => item.Patient).WithMany().HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.PrescriberUser).WithMany().HasForeignKey(item => item.PrescriberUserId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(item => item.Consultation).WithMany(item => item.ActiveTreatments).HasForeignKey(item => item.ConsultationId).OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigureDocuments(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Prescription>(entity =>
        {
            entity.ToTable("prescriptions");
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.Instructions).HasMaxLength(2000);
            entity.HasOne(item => item.Patient).WithMany().HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.DoctorUser).WithMany().HasForeignKey(item => item.DoctorUserId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(item => item.Consultation).WithMany(item => item.Prescriptions).HasForeignKey(item => item.ConsultationId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<PrescriptionItem>(entity =>
        {
            entity.ToTable("prescription_items");
            entity.Property(item => item.Dci).HasMaxLength(200).IsRequired();
            entity.Property(item => item.BrandName).HasMaxLength(200);
            entity.Property(item => item.Dosage).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Posology).HasMaxLength(500).IsRequired();
            entity.Property(item => item.Route).HasMaxLength(120).IsRequired();
            entity.Property(item => item.DurationLabel).HasMaxLength(120).IsRequired();
            entity.Property(item => item.QuantityLabel).HasMaxLength(120).IsRequired();
            entity.Property(item => item.Instructions).HasMaxLength(1000);
            entity.HasOne(item => item.Prescription).WithMany(item => item.Items).HasForeignKey(item => item.PrescriptionId);
        });

        modelBuilder.Entity<MedicalDocument>(entity =>
        {
            entity.ToTable("medical_documents");
            entity.Property(item => item.DocumentType).HasConversion<string>().HasMaxLength(64);
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.Title).HasMaxLength(250).IsRequired();
            entity.Property(item => item.Subtitle).HasMaxLength(250);
            entity.Property(item => item.Summary).HasMaxLength(2000);
            entity.Property(item => item.StorageKind).HasMaxLength(32).IsRequired();
            entity.Property(item => item.StoragePath).HasMaxLength(500).IsRequired();
            entity.Property(item => item.MimeType).HasMaxLength(120).IsRequired();
            entity.HasOne(item => item.Patient).WithMany().HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.DoctorUser).WithMany().HasForeignKey(item => item.DoctorUserId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(item => item.Consultation).WithMany(item => item.Documents).HasForeignKey(item => item.ConsultationId).OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigureInvoices(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.ToTable("invoices");
            entity.Property(item => item.Number).HasMaxLength(40).IsRequired();
            entity.Property(item => item.Reason).HasMaxLength(500).IsRequired();
            entity.Property(item => item.TotalAmount).HasPrecision(12, 2);
            entity.Property(item => item.PaidAmount).HasPrecision(12, 2);
            entity.Property(item => item.Status).HasConversion<string>().HasMaxLength(32);
            entity.HasIndex(item => new { item.ClinicId, item.Number }).IsUnique();
            entity.HasIndex(item => new { item.PatientId, item.Status });
            entity.HasIndex(item => new { item.Status, item.DueOn });
            entity.HasOne(item => item.Patient).WithMany(item => item.Invoices).HasForeignKey(item => item.PatientId);
            entity.HasOne(item => item.DoctorUser).WithMany().HasForeignKey(item => item.DoctorUserId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(item => item.Appointment).WithMany(item => item.Invoices).HasForeignKey(item => item.AppointmentId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(item => item.Consultation).WithMany(item => item.Invoices).HasForeignKey(item => item.ConsultationId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(item => item.CreatedByUser).WithMany().HasForeignKey(item => item.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(item => item.ValidatedByUser).WithMany().HasForeignKey(item => item.ValidatedByUserId).OnDelete(DeleteBehavior.SetNull);
            entity.ToTable(table => table.HasCheckConstraint("ck_invoices_paid_amount", "\"PaidAmount\" <= \"TotalAmount\""));
        });

        modelBuilder.Entity<InvoicePayment>(entity =>
        {
            entity.ToTable("invoice_payments");
            entity.Property(item => item.Amount).HasPrecision(12, 2);
            entity.Property(item => item.Notes).HasMaxLength(1000);
            entity.HasOne(item => item.Invoice).WithMany(item => item.Payments).HasForeignKey(item => item.InvoiceId);
            entity.HasOne(item => item.RecordedByUser).WithMany().HasForeignKey(item => item.RecordedByUserId).OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureAudit(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("audit_logs");
            entity.Property(item => item.ActionType).HasConversion<string>().HasMaxLength(32);
            entity.Property(item => item.ModuleCode).HasMaxLength(64).IsRequired();
            entity.Property(item => item.EntityType).HasMaxLength(64);
            entity.Property(item => item.Description).HasMaxLength(1000).IsRequired();
            entity.Property(item => item.IpAddress).HasMaxLength(64);
            entity.HasIndex(item => item.OccurredAt);
            entity.HasIndex(item => new { item.ModuleCode, item.OccurredAt });
            entity.HasOne(item => item.User).WithMany().HasForeignKey(item => item.UserId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}
