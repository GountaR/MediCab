import { Facture, Medecin, Patient, RendezVous, StatutFacture, StatutPatient, StatutRendezVous, TypeRendezVous } from './medicab-demo.types';

export const DATE_REFERENCE_DEMO = '22/04/2026';

export const STATUTS_PATIENT: ReadonlyArray<StatutPatient> = ['Actif', 'Inactif', 'En attente', 'Décédé'];
export const STATUTS_RDV: ReadonlyArray<StatutRendezVous> = ['Planifié', 'Accueilli', 'En consultation', 'Terminé', 'Annulé', 'Absent'];
export const STATUTS_FACTURE: ReadonlyArray<StatutFacture> = ['Brouillon', 'Envoyée', 'Réglée', 'En retard', 'Partielle', 'Annulée'];
export const TYPES_RDV: ReadonlyArray<TypeRendezVous> = [
  'Consultation générale',
  'Suivi',
  'Nouveau patient',
  'Acte médical',
  'Prévention',
  'Urgence'
];

export const MEDECINS_DEMO: ReadonlyArray<Medecin> = [
  { id: 'm01', prenom: 'Étienne', nom: 'Renard', specialite: 'Médecine générale', couleur: '#1756a8', initiales: 'ER' },
  { id: 'm02', prenom: 'Claire', nom: 'Fontaine', specialite: 'Cardiologie', couleur: '#7c3aed', initiales: 'CF' },
  { id: 'm03', prenom: 'Hugo', nom: 'Marchand', specialite: 'Pédiatrie', couleur: '#0d7a5f', initiales: 'HM' }
];

export const PATIENTS_DEMO: ReadonlyArray<Patient> = [
  {
    id: 'p01', dpi: 'DPI-10234', prenom: 'Marie', nom: 'Dupont',
    dateNaissance: '14/03/1968', genre: 'Féminin', telephone: '06 12 34 56 78',
    email: 'marie.dupont@laposte.fr', adresse: '14 rue des Bouleaux, 75001 Paris',
    mutuelle: 'CPAM Paris', numeroAdherent: '1 68 03 75 001 042 89',
    medecinId: 'm01', statut: 'Actif', dernierVisite: '10/04/2026', prochainRDV: '29/04/2026',
    groupeSanguin: 'A+', allergies: ['Pénicilline', 'Sulfamides'],
    etiquettes: ['Diabétique', 'Hypertension'], soldeImpaye: 85
  },
  {
    id: 'p02', dpi: 'DPI-10235', prenom: 'Jean-Pierre', nom: 'Moreau',
    dateNaissance: '28/11/1952', genre: 'Masculin', telephone: '01 43 21 98 76',
    email: 'jp.moreau@orange.fr', adresse: '88 avenue Kléber, 69006 Lyon',
    mutuelle: 'Malakoff Humanis', numeroAdherent: '1 52 11 69 006 112 34',
    medecinId: 'm02', statut: 'Actif', dernierVisite: '18/04/2026', prochainRDV: '02/05/2026',
    groupeSanguin: 'O-', allergies: ['Aspirine'],
    etiquettes: ['Cardiaque', 'Senior'], soldeImpaye: 60
  },
  {
    id: 'p03', dpi: 'DPI-10236', prenom: 'Isabelle', nom: 'Lefebvre',
    dateNaissance: '04/07/1991', genre: 'Féminin', telephone: '06 87 65 43 21',
    email: 'isabelle.lefebvre@gmail.com', adresse: '209 boulevard Michelet, 13008 Marseille',
    mutuelle: 'Harmonie Mutuelle', numeroAdherent: '2 91 07 13 008 223 45',
    medecinId: 'm01', statut: 'Actif', dernierVisite: '15/04/2026',
    groupeSanguin: 'B+', allergies: [], etiquettes: []
  },
  {
    id: 'p04', dpi: 'DPI-10237', prenom: 'François', nom: 'Lemaire',
    dateNaissance: '19/01/1945', genre: 'Masculin', telephone: '05 56 78 90 12',
    email: 'f.lemaire@wanadoo.fr', adresse: '3 rue de la Paix, 33000 Bordeaux',
    mutuelle: 'MGEN', numeroAdherent: '1 45 01 33 000 334 56',
    medecinId: 'm03', statut: 'Actif', dernierVisite: '01/04/2026', prochainRDV: '30/04/2026',
    groupeSanguin: 'AB+', allergies: ['Codéine', 'Latex'],
    etiquettes: ['Senior', 'BPCO'], soldeImpaye: 250
  },
  {
    id: 'p05', dpi: 'DPI-10238', prenom: 'Nathalie', nom: 'Bernard',
    dateNaissance: '22/09/1979', genre: 'Féminin', telephone: '01 23 45 67 89',
    email: 'n.bernard@free.fr', adresse: '1102 rue de Rivoli, 75001 Paris',
    mutuelle: 'AG2R La Mondiale', numeroAdherent: '2 79 09 75 001 445 67',
    medecinId: 'm01', statut: 'Actif', dernierVisite: '28/03/2026', prochainRDV: '08/05/2026',
    groupeSanguin: 'O+', allergies: ['AINS'], etiquettes: ['Hypertension']
  },
  {
    id: 'p06', dpi: 'DPI-10239', prenom: 'Thomas', nom: 'Aubert',
    dateNaissance: '30/05/1988', genre: 'Masculin', telephone: '06 34 56 78 90',
    email: 'thomas.aubert@sfr.fr', adresse: '55 cours Lafayette, 69003 Lyon',
    mutuelle: 'Allianz Santé', numeroAdherent: '1 88 05 69 003 556 78',
    medecinId: 'm02', statut: 'Actif', dernierVisite: '12/04/2026',
    groupeSanguin: 'A-', allergies: [], etiquettes: ['Asthme'], soldeImpaye: 95
  },
  {
    id: 'p07', dpi: 'DPI-10240', prenom: 'Éléonore', nom: 'Vasseur',
    dateNaissance: '08/12/1935', genre: 'Féminin', telephone: '03 88 90 12 34',
    email: '', adresse: '7 rue du Maréchal Foch, 67000 Strasbourg',
    mutuelle: 'CPAM Bas-Rhin', numeroAdherent: '2 35 12 67 000 667 89',
    medecinId: 'm03', statut: 'Actif', dernierVisite: '20/04/2026', prochainRDV: '28/04/2026',
    groupeSanguin: 'A+', allergies: ['Interaction Warfarine-Aspirine'],
    etiquettes: ['Senior', 'Risque chute']
  },
  {
    id: 'p08', dpi: 'DPI-10241', prenom: 'Marc', nom: 'Petitjean',
    dateNaissance: '17/04/2001', genre: 'Masculin', telephone: '07 67 89 01 23',
    email: 'marc.petitjean@gmail.com', adresse: '410 rue du Fg Saint-Antoine, 75011 Paris',
    mutuelle: 'Harmonie Mutuelle', numeroAdherent: '1 01 04 75 011 778 90',
    medecinId: 'm02', statut: 'Actif', dernierVisite: '15/02/2026',
    groupeSanguin: 'B-', allergies: [], etiquettes: ['Asthme']
  },
  {
    id: 'p09', dpi: 'DPI-10242', prenom: 'Patricia', nom: 'Nguyen',
    dateNaissance: '11/08/1972', genre: 'Féminin', telephone: '01 56 78 90 12',
    email: 'p.nguyen@yahoo.fr', adresse: '822 rue des Roses, 92100 Boulogne',
    mutuelle: 'CPAM Hauts-de-Seine', numeroAdherent: '2 72 08 92 100 889 01',
    medecinId: 'm01', statut: 'Inactif', dernierVisite: '14/11/2025',
    groupeSanguin: 'O+', allergies: ['Amoxicilline'], etiquettes: []
  },
  {
    id: 'p10', dpi: 'DPI-10243', prenom: 'Grégoire', nom: 'Durand',
    dateNaissance: '25/02/1964', genre: 'Masculin', telephone: '02 40 12 34 56',
    email: 'gregoire.durand@nantes.fr', adresse: '16 rue du Calvaire, 44000 Nantes',
    mutuelle: 'MGEN', numeroAdherent: '1 64 02 44 000 990 12',
    medecinId: 'm03', statut: 'Actif', dernierVisite: '22/04/2026', prochainRDV: '15/05/2026',
    groupeSanguin: 'A+', allergies: [], etiquettes: ['Post-op']
  },
  {
    id: 'p11', dpi: 'DPI-10244', prenom: 'Linda', nom: 'Moreau',
    dateNaissance: '03/06/1958', genre: 'Féminin', telephone: '01 45 67 89 01',
    email: 'linda.moreau@numericable.fr', adresse: '290 avenue du Parc, 92140 Clamart',
    mutuelle: 'Malakoff Humanis', numeroAdherent: '2 58 06 92 140 101 23',
    medecinId: 'm02', statut: 'En attente', dernierVisite: '',
    groupeSanguin: 'AB-', allergies: ['Morphine'], etiquettes: ['Nouveau patient']
  },
  {
    id: 'p12', dpi: 'DPI-10245', prenom: 'David', nom: 'Thibault',
    dateNaissance: '16/10/1983', genre: 'Masculin', telephone: '06 90 12 34 56',
    email: 'd.thibault@gmail.com', adresse: '543 boulevard Voltaire, 75011 Paris',
    mutuelle: 'AG2R La Mondiale', numeroAdherent: '1 83 10 75 011 212 34',
    medecinId: 'm01', statut: 'Actif', dernierVisite: '08/04/2026', prochainRDV: '30/04/2026',
    groupeSanguin: 'O+', allergies: [], etiquettes: ['Diabétique', 'Hypertension']
  }
];

export const RENDEZ_VOUS_DEMO: ReadonlyArray<RendezVous> = [
  { id: 'rdv01', patientId: 'p10', medecinId: 'm03', date: '22/04/2026', heure: '08:30', duree: 20, type: 'Consultation générale', statut: 'Terminé' },
  { id: 'rdv02', patientId: 'p01', medecinId: 'm01', date: '22/04/2026', heure: '09:00', duree: 30, type: 'Suivi', statut: 'Terminé', factureId: 'fac02' },
  { id: 'rdv03', patientId: 'p02', medecinId: 'm02', date: '22/04/2026', heure: '09:30', duree: 45, type: 'Acte médical', statut: 'Terminé' },
  { id: 'rdv04', patientId: 'p05', medecinId: 'm01', date: '22/04/2026', heure: '10:00', duree: 20, type: 'Prévention', statut: 'En consultation' },
  { id: 'rdv05', patientId: 'p03', medecinId: 'm01', date: '22/04/2026', heure: '10:30', duree: 30, type: 'Consultation générale', statut: 'Accueilli' },
  { id: 'rdv06', patientId: 'p04', medecinId: 'm03', date: '22/04/2026', heure: '11:00', duree: 20, type: 'Suivi', statut: 'Planifié' },
  { id: 'rdv07', patientId: 'p08', medecinId: 'm02', date: '22/04/2026', heure: '11:30', duree: 45, type: 'Nouveau patient', statut: 'Planifié' },
  { id: 'rdv08', patientId: 'p09', medecinId: 'm01', date: '22/04/2026', heure: '14:00', duree: 20, type: 'Suivi', statut: 'Planifié' },
  { id: 'rdv09', patientId: 'p06', medecinId: 'm02', date: '22/04/2026', heure: '14:30', duree: 30, type: 'Acte médical', statut: 'Planifié', factureId: 'fac05' },
  { id: 'rdv10', patientId: 'p12', medecinId: 'm01', date: '22/04/2026', heure: '15:00', duree: 30, type: 'Consultation générale', statut: 'Planifié' },
  { id: 'rdv11', patientId: 'p11', medecinId: 'm02', date: '22/04/2026', heure: '15:30', duree: 45, type: 'Nouveau patient', statut: 'Planifié' },
  { id: 'rdv12', patientId: 'p07', medecinId: 'm03', date: '22/04/2026', heure: '16:00', duree: 20, type: 'Suivi', statut: 'Planifié' },
  { id: 'rdv13', patientId: 'p01', medecinId: 'm01', date: '21/04/2026', heure: '09:30', duree: 30, type: 'Consultation générale', statut: 'Terminé' },
  { id: 'rdv14', patientId: 'p05', medecinId: 'm01', date: '21/04/2026', heure: '10:30', duree: 20, type: 'Suivi', statut: 'Terminé' },
  { id: 'rdv15', patientId: 'p02', medecinId: 'm02', date: '23/04/2026', heure: '09:00', duree: 45, type: 'Acte médical', statut: 'Planifié' },
  { id: 'rdv16', patientId: 'p03', medecinId: 'm01', date: '23/04/2026', heure: '11:00', duree: 30, type: 'Suivi', statut: 'Planifié' },
  { id: 'rdv17', patientId: 'p07', medecinId: 'm03', date: '24/04/2026', heure: '10:00', duree: 20, type: 'Prévention', statut: 'Planifié' },
  { id: 'rdv18', patientId: 'p12', medecinId: 'm01', date: '24/04/2026', heure: '14:00', duree: 30, type: 'Consultation générale', statut: 'Planifié' }
];

export const FACTURES_DEMO: ReadonlyArray<Facture> = [
  { id: 'fac01', numero: 'FAC-2026-0031', patientId: 'p04', date: '05/03/2026', echeance: '05/04/2026', montantTotal: 250, montantRegle: 0, statut: 'En retard', joursRetard: 47, motif: 'Spirométrie + consultation' },
  { id: 'fac02', numero: 'FAC-2026-0041', patientId: 'p01', date: '22/03/2026', echeance: '22/04/2026', montantTotal: 85, montantRegle: 0, statut: 'En retard', joursRetard: 30, motif: 'Consultation + renouvellement ordonnance', rendezVousId: 'rdv02' },
  { id: 'fac03', numero: 'FAC-2026-0038', patientId: 'p02', date: '15/04/2026', echeance: '15/05/2026', montantTotal: 120, montantRegle: 60, statut: 'Partielle', motif: 'Consultation cardiologique' },
  { id: 'fac04', numero: 'FAC-2026-0044', patientId: 'p05', date: '10/04/2026', echeance: '10/05/2026', montantTotal: 65, montantRegle: 0, statut: 'Envoyée', motif: 'Bilan de prévention' },
  { id: 'fac05', numero: 'FAC-2026-0047', patientId: 'p06', date: '18/04/2026', echeance: '18/05/2026', montantTotal: 95, montantRegle: 0, statut: 'Envoyée', motif: 'Consultation + ECG', rendezVousId: 'rdv09' },
  { id: 'fac06', numero: 'FAC-2026-0052', patientId: 'p10', date: '22/04/2026', echeance: '22/05/2026', montantTotal: 55, montantRegle: 55, statut: 'Réglée', motif: 'Consultation générale' },
  { id: 'fac07', numero: 'FAC-2026-0053', patientId: 'p03', date: '15/04/2026', echeance: '15/05/2026', montantTotal: 70, montantRegle: 70, statut: 'Réglée', motif: 'Consultation + bilan sanguin' }
];

export function getNomComplet(personne: { prenom: string; nom: string }): string {
  return `${personne.prenom} ${personne.nom}`;
}

export function getInitiales(personne: { prenom: string; nom: string }): string {
  return `${personne.prenom[0]}${personne.nom[0]}`.toUpperCase();
}

export function calculerAge(dateNaissance: string): number {
  const [jour, mois, annee] = dateNaissance.split('/').map(Number);
  const reference = convertirDateFr(DATE_REFERENCE_DEMO);
  let age = reference.getFullYear() - annee;
  if (reference.getMonth() + 1 < mois || (reference.getMonth() + 1 === mois && reference.getDate() < jour)) {
    age -= 1;
  }
  return age;
}

export function formatMontant(montant: number): string {
  return `${montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

export function getMontantRestant(facture: Facture): number {
  return facture.montantTotal - facture.montantRegle;
}

export function convertirDateFr(date: string): Date {
  const [jour, mois, annee] = date.split('/').map(Number);
  return new Date(annee, mois - 1, jour);
}

export function comparerDatesFr(a: string, b: string): number {
  return convertirDateFr(a).getTime() - convertirDateFr(b).getTime();
}

export function comparerRendezVous(a: RendezVous, b: RendezVous): number {
  const dateDiff = comparerDatesFr(a.date, b.date);
  if (dateDiff !== 0) {
    return dateDiff;
  }
  return a.heure.localeCompare(b.heure);
}
