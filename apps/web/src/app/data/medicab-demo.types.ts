export type StatutPatient = 'Actif' | 'Inactif' | 'En attente' | 'Décédé';
export type StatutRendezVous = 'Planifié' | 'Accueilli' | 'En consultation' | 'Terminé' | 'Annulé' | 'Absent';
export type TypeRendezVous = 'Consultation générale' | 'Suivi' | 'Nouveau patient' | 'Acte médical' | 'Prévention' | 'Urgence';
export type StatutFacture = 'Brouillon' | 'Envoyée' | 'Réglée' | 'En retard' | 'Partielle' | 'Annulée';
export type Specialite = 'Médecine générale' | 'Cardiologie' | 'Pédiatrie';

export interface Medecin {
  id: string;
  prenom: string;
  nom: string;
  specialite: Specialite;
  couleur: string;
  initiales: string;
}

export interface Patient {
  id: string;
  dpi: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  genre: 'Masculin' | 'Féminin' | 'Autre';
  telephone: string;
  email: string;
  adresse: string;
  mutuelle: string;
  numeroAdherent: string;
  medecinId: string;
  statut: StatutPatient;
  dernierVisite: string;
  prochainRDV?: string;
  groupeSanguin: string;
  allergies: string[];
  etiquettes?: string[];
  soldeImpaye?: number;
}

export interface RendezVous {
  id: string;
  patientId: string;
  medecinId: string;
  date: string;
  heure: string;
  duree: number;
  type: TypeRendezVous;
  statut: StatutRendezVous;
  notes?: string;
  factureId?: string;
  motifAnnulation?: string;
}

export interface Facture {
  id: string;
  numero: string;
  patientId: string;
  date: string;
  echeance: string;
  montantTotal: number;
  montantRegle: number;
  statut: StatutFacture;
  rendezVousId?: string;
  joursRetard?: number;
  motif: string;
}

export type ChipTone = 'neutral' | 'info' | 'accent' | 'success' | 'warning' | 'danger';
