export type AdminUserRole = 'Administrateur' | 'Médecin' | 'Réceptionniste';
export type AdminUserStatus = 'Actif' | 'Inactif' | 'En congé' | 'Suspendu';
export type SettingsSectionId = 'cabinet' | 'rendezvous' | 'facturation' | 'notifications' | 'securite';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: AdminUserRole;
  specialty?: string;
  rpps?: string;
  status: AdminUserStatus;
  lastConnection?: string;
  createdAt: string;
  initials: string;
  color: string;
}

export interface AdminPermission {
  lire: boolean;
  creer: boolean;
  modifier: boolean;
  supprimer: boolean;
  exporter: boolean;
}

export interface AdminRoleDefinition {
  id: string;
  name: AdminUserRole;
  description: string;
  accent: 'rose' | 'blue' | 'amber';
  permissions: Record<string, AdminPermission>;
}

export interface CabinetHours {
  day: string;
  open: boolean;
  start: string;
  end: string;
}

export interface SettingsState {
  cabinet: {
    clinicName: string;
    addressLine1: string;
    postalCode: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    siret: string;
    rpps: string;
    hours: CabinetHours[];
  };
  rendezVous: {
    defaultDuration: string;
    newPatientDuration: string;
    procedureDuration: string;
    emailReminderHours: string;
    allowWalkIns: boolean;
    appointmentTypes: string[];
  };
  facturation: {
    autoPrepareInvoice: boolean;
    showDebtAlerts: boolean;
    paymentDelayDays: string;
    overdueReminderDays: string;
  };
  notifications: {
    appointmentReminderEmail: boolean;
    appointmentConfirmationEmail: boolean;
    cancellationEmail: boolean;
    labResultsEmail: boolean;
    prescriptionReminderEmail: boolean;
    adminAlertsEmail: boolean;
  };
  security: {
    minPasswordLength: string;
    sessionTimeoutMinutes: string;
    forceTwoFactor: boolean;
    auditConnections: boolean;
    backupFrequency: string;
    lastBackupAt: string;
    retentionDays: string;
    storageUsed: string;
    storageQuota: string;
  };
}

const FULL: AdminPermission = {
  lire: true,
  creer: true,
  modifier: true,
  supprimer: true,
  exporter: true
};

const READ_ONLY: AdminPermission = {
  lire: true,
  creer: false,
  modifier: false,
  supprimer: false,
  exporter: false
};

const NONE: AdminPermission = {
  lire: false,
  creer: false,
  modifier: false,
  supprimer: false,
  exporter: false
};

export const SYSTEM_MODULES = [
  'Tableau de bord',
  'Patients',
  'Rendez-vous',
  'Consultations',
  'Ordonnances',
  'Documents',
  'Facturation',
  'Utilisateurs',
  'Paramètres',
  'Journal d’audit'
];

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'u01',
    firstName: 'Pierre',
    lastName: 'Gaillard',
    email: 'p.gaillard@medicab.fr',
    phone: '01 42 00 00 01',
    role: 'Administrateur',
    status: 'Actif',
    lastConnection: '24/04/2026 · 08:05',
    createdAt: '01/09/2020',
    initials: 'PG',
    color: '#be185d'
  },
  {
    id: 'u02',
    firstName: 'Étienne',
    lastName: 'Renard',
    email: 'e.renard@medicab.fr',
    phone: '01 42 00 00 02',
    role: 'Médecin',
    specialty: 'Médecine générale',
    rpps: '10003456789',
    status: 'Actif',
    lastConnection: '24/04/2026 · 08:12',
    createdAt: '01/09/2020',
    initials: 'ER',
    color: '#1756a8'
  },
  {
    id: 'u03',
    firstName: 'Isabelle',
    lastName: 'Marchand',
    email: 'i.marchand@medicab.fr',
    phone: '01 42 00 00 03',
    role: 'Médecin',
    specialty: 'Cardiologie',
    rpps: '10004567890',
    status: 'Actif',
    lastConnection: '24/04/2026 · 08:30',
    createdAt: '15/03/2021',
    initials: 'IM',
    color: '#0f766e'
  },
  {
    id: 'u04',
    firstName: 'Camille',
    lastName: 'Fontaine',
    email: 'c.fontaine@medicab.fr',
    phone: '01 42 00 00 04',
    role: 'Médecin',
    specialty: 'Pédiatrie',
    rpps: '10005678901',
    status: 'Actif',
    lastConnection: '23/04/2026 · 17:45',
    createdAt: '01/01/2022',
    initials: 'CF',
    color: '#7c3aed'
  },
  {
    id: 'u05',
    firstName: 'Pauline',
    lastName: 'Girard',
    email: 'p.girard@medicab.fr',
    phone: '01 42 00 00 05',
    role: 'Réceptionniste',
    status: 'Actif',
    lastConnection: '24/04/2026 · 07:58',
    createdAt: '01/09/2020',
    initials: 'PG',
    color: '#d97706'
  },
  {
    id: 'u06',
    firstName: 'Mathieu',
    lastName: 'Lefèvre',
    email: 'm.lefevre@medicab.fr',
    phone: '01 42 00 00 06',
    role: 'Réceptionniste',
    status: 'Actif',
    lastConnection: '24/04/2026 · 08:02',
    createdAt: '14/06/2021',
    initials: 'ML',
    color: '#0891b2'
  },
  {
    id: 'u07',
    firstName: 'Sophie',
    lastName: 'Durand',
    email: 's.durand@medicab.fr',
    phone: '01 42 00 00 07',
    role: 'Réceptionniste',
    status: 'En congé',
    lastConnection: '08/04/2026 · 17:30',
    createdAt: '20/11/2022',
    initials: 'SD',
    color: '#64748b'
  },
  {
    id: 'u08',
    firstName: 'Claire',
    lastName: 'Martin',
    email: 'c.martin@medicab.fr',
    phone: '01 42 00 00 08',
    role: 'Réceptionniste',
    status: 'Inactif',
    lastConnection: '15/01/2026 · 09:12',
    createdAt: '03/04/2023',
    initials: 'CM',
    color: '#94a3b8'
  }
];

export const ADMIN_ROLE_DEFINITIONS: AdminRoleDefinition[] = [
  {
    id: 'role-admin',
    name: 'Administrateur',
    accent: 'rose',
    description:
      'Accès complet aux modules, aux utilisateurs, aux paramètres et au journal d’audit du cabinet.',
    permissions: {
      'Tableau de bord': FULL,
      Patients: FULL,
      'Rendez-vous': FULL,
      Consultations: FULL,
      Ordonnances: FULL,
      Documents: FULL,
      Facturation: FULL,
      Utilisateurs: FULL,
      Paramètres: { ...READ_ONLY, modifier: true },
      'Journal d’audit': { ...READ_ONLY, exporter: true }
    }
  },
  {
    id: 'role-doctor',
    name: 'Médecin',
    accent: 'blue',
    description:
      'Accès clinique sur ses patients déjà consultés, avec création de consultations, ordonnances et documents.',
    permissions: {
      'Tableau de bord': READ_ONLY,
      Patients: { ...READ_ONLY, modifier: true },
      'Rendez-vous': READ_ONLY,
      Consultations: { lire: true, creer: true, modifier: true, supprimer: false, exporter: false },
      Ordonnances: { lire: true, creer: true, modifier: true, supprimer: false, exporter: true },
      Documents: { lire: true, creer: true, modifier: true, supprimer: false, exporter: false },
      Facturation: NONE,
      Utilisateurs: NONE,
      Paramètres: NONE,
      'Journal d’audit': NONE
    }
  },
  {
    id: 'role-frontdesk',
    name: 'Réceptionniste',
    accent: 'amber',
    description:
      'Gestion de l’accueil, des rendez-vous et de la facturation administrative, sans accès clinique sensible.',
    permissions: {
      'Tableau de bord': READ_ONLY,
      Patients: { lire: true, creer: true, modifier: true, supprimer: false, exporter: false },
      'Rendez-vous': { lire: true, creer: true, modifier: true, supprimer: true, exporter: false },
      Consultations: NONE,
      Ordonnances: NONE,
      Documents: READ_ONLY,
      Facturation: { lire: true, creer: true, modifier: true, supprimer: false, exporter: false },
      Utilisateurs: NONE,
      Paramètres: NONE,
      'Journal d’audit': NONE
    }
  }
];

export const SETTINGS_SECTIONS: Array<{
  id: SettingsSectionId;
  label: string;
  description: string;
}> = [
  { id: 'cabinet', label: 'Cabinet', description: 'Identité, coordonnées et horaires' },
  { id: 'rendezvous', label: 'Rendez-vous', description: 'Durées, types et rappel email' },
  { id: 'facturation', label: 'Facturation', description: 'V1 simplifiée et relances' },
  { id: 'notifications', label: 'Notifications', description: 'Emails utiles au cabinet' },
  { id: 'securite', label: 'Sécurité', description: 'Sessions, audit et sauvegardes' }
];

const SETTINGS_TEMPLATE: SettingsState = {
  cabinet: {
    clinicName: 'Cabinet Médical Renard-Marchand',
    addressLine1: '14 avenue de la Victoire',
    postalCode: '75001',
    city: 'Paris',
    phone: '01 42 00 00 00',
    email: 'contact@cabinet-renard-marchand.fr',
    website: 'www.cabinet-renard-marchand.fr',
    siret: '123 456 789 00012',
    rpps: '00003456789',
    hours: [
      { day: 'Lundi', open: true, start: '08:00', end: '19:00' },
      { day: 'Mardi', open: true, start: '08:00', end: '19:00' },
      { day: 'Mercredi', open: true, start: '08:00', end: '17:00' },
      { day: 'Jeudi', open: true, start: '08:00', end: '19:00' },
      { day: 'Vendredi', open: true, start: '08:00', end: '18:00' },
      { day: 'Samedi', open: true, start: '09:00', end: '12:00' },
      { day: 'Dimanche', open: false, start: '09:00', end: '12:00' }
    ]
  },
  rendezVous: {
    defaultDuration: '30',
    newPatientDuration: '45',
    procedureDuration: '60',
    emailReminderHours: '24',
    allowWalkIns: true,
    appointmentTypes: [
      'Consultation générale',
      'Suivi',
      'Nouveau patient',
      'Acte médical',
      'Prévention',
      'Urgence'
    ]
  },
  facturation: {
    autoPrepareInvoice: true,
    showDebtAlerts: true,
    paymentDelayDays: '15',
    overdueReminderDays: '30'
  },
  notifications: {
    appointmentReminderEmail: true,
    appointmentConfirmationEmail: true,
    cancellationEmail: true,
    labResultsEmail: true,
    prescriptionReminderEmail: true,
    adminAlertsEmail: true
  },
  security: {
    minPasswordLength: '8',
    sessionTimeoutMinutes: '60',
    forceTwoFactor: false,
    auditConnections: true,
    backupFrequency: 'Quotidienne',
    lastBackupAt: '24/04/2026 · 03:00',
    retentionDays: '30',
    storageUsed: '4,2 Go',
    storageQuota: '50 Go'
  }
};

export function cloneAdminUsers(): AdminUser[] {
  return ADMIN_USERS.map((user) => ({ ...user }));
}

export function createSettingsState(): SettingsState {
  return {
    cabinet: {
      ...SETTINGS_TEMPLATE.cabinet,
      hours: SETTINGS_TEMPLATE.cabinet.hours.map((slot) => ({ ...slot }))
    },
    rendezVous: {
      ...SETTINGS_TEMPLATE.rendezVous,
      appointmentTypes: [...SETTINGS_TEMPLATE.rendezVous.appointmentTypes]
    },
    facturation: { ...SETTINGS_TEMPLATE.facturation },
    notifications: { ...SETTINGS_TEMPLATE.notifications },
    security: { ...SETTINGS_TEMPLATE.security }
  };
}
