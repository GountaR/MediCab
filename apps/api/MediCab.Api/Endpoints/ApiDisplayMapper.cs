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

    public static string ToDisplay(this ConsultationStatus status) => status switch
    {
        ConsultationStatus.Brouillon => "Brouillon",
        ConsultationStatus.Finalisee => "Finalisée",
        ConsultationStatus.Signee => "Signée",
        _ => status.ToString()
    };

    public static string ToDisplay(this InvoiceStatus status) => status switch
    {
        InvoiceStatus.Brouillon => "Brouillon",
        InvoiceStatus.Envoyee => "Envoyée",
        InvoiceStatus.Reglee => "Réglée",
        InvoiceStatus.EnRetard => "En retard",
        InvoiceStatus.Partielle => "Partielle",
        InvoiceStatus.Annulee => "Annulée",
        _ => status.ToString()
    };

    public static string ToDisplay(this PrescriptionStatus status) => status switch
    {
        PrescriptionStatus.Active => "Active",
        PrescriptionStatus.Expiree => "Expirée",
        PrescriptionStatus.Annulee => "Annulée",
        PrescriptionStatus.Renouvelee => "Renouvelée",
        _ => status.ToString()
    };

    public static string ToDisplay(this DocumentStatus status) => status switch
    {
        DocumentStatus.Normal => "Normal",
        DocumentStatus.Anormal => "Anormal",
        DocumentStatus.Critique => "Critique",
        DocumentStatus.EnAttente => "En attente",
        _ => status.ToString()
    };

    public static string ToDisplay(this DocumentType type) => type switch
    {
        DocumentType.Analyse => "Analyse",
        DocumentType.Imagerie => "Imagerie",
        DocumentType.CompteRendu => "Compte-rendu",
        DocumentType.Courrier => "Courrier",
        DocumentType.Ordonnance => "Ordonnance",
        _ => type.ToString()
    };

    public static string ToDisplay(this AuditActionType action) => action switch
    {
        AuditActionType.Connexion => "Connexion",
        AuditActionType.Deconnexion => "Déconnexion",
        AuditActionType.Creation => "Création",
        AuditActionType.Modification => "Modification",
        AuditActionType.Suppression => "Suppression",
        AuditActionType.Export => "Export",
        AuditActionType.AccesRefuse => "Accès refusé",
        _ => action.ToString()
    };

    public static string FullName(this User user) => $"{user.FirstName} {user.LastName}";

    public static string FullName(this Patient patient) => $"{patient.FirstName} {patient.LastName}";
}
