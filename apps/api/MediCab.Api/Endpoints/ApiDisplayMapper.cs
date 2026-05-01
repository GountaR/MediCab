using MediCab.Api.Domain.Entities;
using MediCab.Api.Domain.Enums;

namespace MediCab.Api.Endpoints;

internal static class ApiDisplayMapper
{
    public static string ToDisplay(this UserRoleCode role) => role switch
    {
        UserRoleCode.Admin => "Administrateur",
        UserRoleCode.Doctor => "Médecin",
        UserRoleCode.Reception => "Réceptionniste",
        _ => role.ToString()
    };

    public static string ToDisplay(this UserStatus status) => status switch
    {
        UserStatus.Actif => "Actif",
        UserStatus.Inactif => "Inactif",
        UserStatus.EnConge => "En congé",
        UserStatus.Suspendu => "Suspendu",
        _ => status.ToString()
    };

    public static string ToDisplay(this PatientStatus status) => status switch
    {
        PatientStatus.Actif => "Actif",
        PatientStatus.Inactif => "Inactif",
        PatientStatus.EnAttente => "En attente",
        PatientStatus.Decede => "Décédé",
        _ => status.ToString()
    };

    public static string ToDisplay(this AppointmentStatus status) => status switch
    {
        AppointmentStatus.Planifie => "Planifié",
        AppointmentStatus.Accueilli => "Accueilli",
        AppointmentStatus.EnConsultation => "En consultation",
        AppointmentStatus.Termine => "Terminé",
        AppointmentStatus.Annule => "Annulé",
        AppointmentStatus.Absent => "Absent",
        _ => status.ToString()
    };

    public static string ToDisplay(this AppointmentType type) => type switch
    {
        AppointmentType.ConsultationGenerale => "Consultation générale",
        AppointmentType.Suivi => "Suivi",
        AppointmentType.NouveauPatient => "Nouveau patient",
        AppointmentType.ActeMedical => "Acte médical",
        AppointmentType.Prevention => "Prévention",
        AppointmentType.Urgence => "Urgence",
        _ => type.ToString()
    };

    public static string FullName(this User user) => $"{user.FirstName} {user.LastName}";

    public static string FullName(this Patient patient) => $"{patient.FirstName} {patient.LastName}";
}
