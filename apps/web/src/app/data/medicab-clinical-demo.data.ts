import { TypeRendezVous } from './medicab-demo.types';

export type StatutConsultation = 'Brouillon' | 'Finalisée' | 'Signée';
export type StatutOrdonnance = 'Active' | 'Expirée' | 'Annulée' | 'Renouvelée';
export type StatutDiagnostic = 'Actif' | 'Résolu' | 'Chronique' | 'Suspecté';
export type StatutMedicament = 'Actif' | 'Terminé' | 'Suspendu' | 'Inconnu';
export type StatutDocument = 'Normal' | 'Anormal' | 'Critique' | 'En attente';
export type CategorieDocument = 'Analyse' | 'Imagerie' | 'Compte-rendu' | 'Courrier' | 'Ordonnance';

export interface DiagnosticActif {
  id: string;
  patientId: string;
  code: string;
  libelle: string;
  statut: StatutDiagnostic;
  dateDebut: string;
  notes?: string;
}

export interface MedicamentActif {
  id: string;
  patientId: string;
  dci: string;
  nomCommercial?: string;
  dosage: string;
  posologie: string;
  voie: string;
  dateDebut: string;
  statut: StatutMedicament;
  prescripteurId: string;
  nonSubstituable?: boolean;
  notes?: string;
}

export interface ConstantesVitales {
  id: string;
  patientId: string;
  date: string;
  poids: number;
  taille: number;
  pa: string;
  fc: number;
  temperature: number;
  spo2: number;
}

export interface ExamenClinique {
  poids?: number;
  taille?: number;
  pa?: string;
  fc?: number;
  temperature?: number;
  spo2?: number;
  cardiovasculaire?: string;
  respiratoire?: string;
  abdomen?: string;
  neurologique?: string;
  orl?: string;
  autre?: string;
}

export interface ConsultationMedicale {
  id: string;
  patientId: string;
  medecinId: string;
  date: string;
  heure: string;
  type: TypeRendezVous;
  motif: string;
  anamnese: string;
  examenClinique: ExamenClinique;
  diagnosticPrincipal: string;
  diagnosticsSecondaires: string[];
  evaluation: string;
  plan: string;
  ordonnanceId?: string;
  suiviDate?: string;
  suiviInstructions?: string;
  statut: StatutConsultation;
}

export interface MedicamentOrdonnance {
  id: string;
  dci: string;
  nomCommercial?: string;
  dosage: string;
  posologie: string;
  voie: string;
  duree: string;
  quantite: string;
  renouvellement: number;
  nonSubstituable: boolean;
  instructions?: string;
}

export interface OrdonnanceDemo {
  id: string;
  patientId: string;
  medecinId: string;
  consultationId?: string;
  date: string;
  dateExpiration: string;
  statut: StatutOrdonnance;
  instructions?: string;
  medicaments: MedicamentOrdonnance[];
}

export interface DocumentMedicalDemo {
  id: string;
  patientId: string;
  type: CategorieDocument;
  titre: string;
  sousTitre?: string;
  date: string;
  taille: string;
  medecinId?: string;
  consultationId?: string;
  statut: StatutDocument;
  resume?: string;
}

export const DIAGNOSTICS_ACTIFS_DEMO: ReadonlyArray<DiagnosticActif> = [
  {
    id: 'd01',
    patientId: 'p01',
    code: 'E11.9',
    libelle: 'Diabète sucré de type 2',
    statut: 'Chronique',
    dateDebut: '15/04/2018',
    notes: 'Sous Metformine, HbA1c cible < 7,5%.'
  },
  {
    id: 'd02',
    patientId: 'p01',
    code: 'I10',
    libelle: 'Hypertension artérielle essentielle',
    statut: 'Chronique',
    dateDebut: '10/09/2021',
    notes: 'Traitement Amlodipine + Ramipril.'
  },
  {
    id: 'd07',
    patientId: 'p05',
    code: 'I10',
    libelle: 'Hypertension artérielle essentielle',
    statut: 'Chronique',
    dateDebut: '30/11/2022',
    notes: 'Traitement Ramipril 5mg, objectifs PA < 130/80.'
  }
];

export const MEDICAMENTS_ACTIFS_DEMO: ReadonlyArray<MedicamentActif> = [
  {
    id: 'med01',
    patientId: 'p01',
    dci: 'Metformine',
    nomCommercial: 'Glucophage',
    dosage: '1000 mg',
    posologie: '1 cp matin et soir pendant les repas',
    voie: 'Orale',
    dateDebut: '15/04/2018',
    statut: 'Actif',
    prescripteurId: 'm01'
  },
  {
    id: 'med02',
    patientId: 'p01',
    dci: 'Amlodipine',
    nomCommercial: 'Amlor',
    dosage: '10 mg',
    posologie: '1 cp le matin',
    voie: 'Orale',
    dateDebut: '12/02/2026',
    statut: 'Actif',
    prescripteurId: 'm01'
  },
  {
    id: 'med03',
    patientId: 'p01',
    dci: 'Ramipril',
    nomCommercial: 'Triatec',
    dosage: '5 mg',
    posologie: '1 cp le soir',
    voie: 'Orale',
    dateDebut: '12/02/2026',
    statut: 'Actif',
    prescripteurId: 'm01'
  },
  {
    id: 'med10',
    patientId: 'p05',
    dci: 'Ramipril',
    nomCommercial: 'Triatec',
    dosage: '5 mg',
    posologie: '1 cp le matin',
    voie: 'Orale',
    dateDebut: '30/11/2022',
    statut: 'Actif',
    prescripteurId: 'm01'
  }
];

export const CONSTANTES_VITALES_DEMO: ReadonlyArray<ConstantesVitales> = [
  { id: 'cv01', patientId: 'p01', date: '10/04/2026', poids: 76.0, taille: 164, pa: '138/82', fc: 74, temperature: 37.1, spo2: 98 },
  { id: 'cv02', patientId: 'p01', date: '12/02/2026', poids: 75.5, taille: 164, pa: '155/94', fc: 78, temperature: 36.9, spo2: 99 },
  { id: 'cv04', patientId: 'p05', date: '22/04/2026', poids: 68.0, taille: 168, pa: '128/78', fc: 68, temperature: 36.9, spo2: 99 }
];

export const CONSULTATIONS_MEDICALES_DEMO: ReadonlyArray<ConsultationMedicale> = [
  {
    id: 'cons04',
    patientId: 'p05',
    medecinId: 'm01',
    date: '22/04/2026',
    heure: '10:00',
    type: 'Prévention',
    motif: 'Bilan de prévention annuel — femme 46 ans',
    anamnese:
      'Mme Bernard, 46 ans, hypertension traitée par Ramipril 5 mg depuis novembre 2022. Elle consulte pour son bilan annuel de prévention. Aucun symptôme intercurrent, bon état général, légère prise de poids sur un an et activité physique modérée.',
    examenClinique: {
      poids: 68,
      taille: 168,
      pa: '128/78',
      fc: 68,
      temperature: 36.9,
      spo2: 99,
      cardiovasculaire: 'Bruits du coeur réguliers, pas de souffle, pas d oedemes.',
      respiratoire: 'Auscultation pulmonaire claire, pas de sibilants.',
      abdomen: 'Souple, indolore, pas de masse.',
      neurologique: 'Examen neurologique sans particularité.'
    },
    diagnosticPrincipal: 'Z00.0 — Examen médical général',
    diagnosticsSecondaires: ['I10 — Hypertension artérielle essentielle'],
    evaluation:
      'Prévention annuelle rassurante. L hypertension est bien contrôlée sous traitement. Poursuite des mesures hygiéno-diététiques avec bilan biologique de routine.',
    plan:
      '1. Poursuite Ramipril 5 mg\n2. Bilan biologique annuel à jeun\n3. Recommandation activité physique régulière\n4. Contrôle dans 12 mois sauf symptôme intercurrent',
    ordonnanceId: 'ord03',
    suiviDate: '22/04/2027',
    suiviInstructions: 'Réaliser le bilan à jeun et apporter les résultats à la prochaine consultation.',
    statut: 'Signée'
  },
  {
    id: 'cons01',
    patientId: 'p01',
    medecinId: 'm01',
    date: '10/04/2026',
    heure: '09:30',
    type: 'Suivi',
    motif: 'Suivi diabète type 2 — renouvellement ordonnance',
    anamnese:
      'Mme Dupont, 58 ans, diabétique de type 2 sous Metformine 1000 mg x2/j et Amlodipine 10 mg, se présente pour son suivi trimestriel. Fatigue persistante depuis environ 3 semaines et dysurie légère depuis 48h, sans fièvre ni hypoglycémie.',
    examenClinique: {
      poids: 76,
      taille: 164,
      pa: '138/82',
      fc: 74,
      temperature: 37.1,
      spo2: 98,
      cardiovasculaire: 'Bruits cardiaques réguliers, pas de souffle, pas d oedemes des membres inférieurs.',
      respiratoire: 'Murmure vésiculaire présent des deux côtés, pas de râles.',
      abdomen: 'Souple, douleur sus-pubienne modérée à la palpation profonde.',
      neurologique: 'Pas d anomalie neurologique focale.'
    },
    diagnosticPrincipal: 'E11.9 — Diabète de type 2 sans complication',
    diagnosticsSecondaires: ['I10 — Hypertension artérielle essentielle', 'N30.0 — Cystite aiguë'],
    evaluation:
      'Diabète globalement équilibré avec légère tendance à l hyperglycémie en fin de journée. Cystite aiguë non compliquée sans signe systémique.',
    plan:
      '1. Renouvellement Metformine + Amlodipine + Ramipril\n2. Cotrimoxazole Forte 5 jours\n3. Prescription HbA1c, NFS, créatinine, ionogramme, bilan lipidique et ECBU\n4. Contrôle dans 3 mois',
    ordonnanceId: 'ord01',
    suiviDate: '10/07/2026',
    suiviInstructions: 'Bilan biologique 15 jours avant la prochaine consultation. Automesure tensionnelle quotidienne.',
    statut: 'Signée'
  },
  {
    id: 'cons02',
    patientId: 'p01',
    medecinId: 'm01',
    date: '12/02/2026',
    heure: '10:00',
    type: 'Consultation générale',
    motif: 'Contrôle tensionnel — PA élevée en automesure',
    anamnese:
      'Valeurs tensionnelles élevées à domicile depuis 2 semaines, entre 155/95 et 165/100 mmHg. Asthénie modérée, sans céphalées, acouphènes ni phosphènes. Bonne observance de l Amlodipine 5 mg.',
    examenClinique: {
      poids: 75.5,
      taille: 164,
      pa: '155/94',
      fc: 78,
      temperature: 36.9,
      spo2: 99,
      cardiovasculaire: 'Bruits cardiaques réguliers, sans souffle pathologique.',
      respiratoire: 'Examen respiratoire normal.',
      abdomen: 'Souple et indolore.'
    },
    diagnosticPrincipal: 'I10 — Hypertension artérielle essentielle',
    diagnosticsSecondaires: ['E11.9 — Diabète de type 2 sans complication'],
    evaluation:
      'HTA insuffisamment contrôlée sous monothérapie. Majoration du traitement indiquée.',
    plan:
      '1. Passage Amlodipine à 10 mg\n2. Ajout Ramipril 5 mg le soir\n3. Surveillance PA quotidienne\n4. Régime désodé\n5. Consultation de contrôle dans 6 semaines',
    ordonnanceId: 'ord02',
    suiviDate: '26/03/2026',
    suiviInstructions: 'Automesure tensionnelle matin et soir avec carnet à rapporter.',
    statut: 'Signée'
  }
];

export const ORDONNANCES_DEMO: ReadonlyArray<OrdonnanceDemo> = [
  {
    id: 'ord01',
    patientId: 'p01',
    medecinId: 'm01',
    consultationId: 'cons01',
    date: '10/04/2026',
    dateExpiration: '10/07/2026',
    statut: 'Active',
    instructions: 'Automesure tensionnelle quotidienne et bilan biologique avant la prochaine consultation.',
    medicaments: [
      { id: 'm01a', dci: 'Metformine', nomCommercial: 'Glucophage', dosage: '1000 mg', posologie: '1 cp matin et soir pendant les repas', voie: 'Orale', duree: '3 mois', quantite: 'Boîte de 60', renouvellement: 2, nonSubstituable: false },
      { id: 'm01b', dci: 'Amlodipine', nomCommercial: 'Amlor', dosage: '10 mg', posologie: '1 cp le matin', voie: 'Orale', duree: '3 mois', quantite: 'Boîte de 30', renouvellement: 2, nonSubstituable: false },
      { id: 'm01c', dci: 'Ramipril', nomCommercial: 'Triatec', dosage: '5 mg', posologie: '1 cp le soir', voie: 'Orale', duree: '3 mois', quantite: 'Boîte de 30', renouvellement: 2, nonSubstituable: false },
      { id: 'm01d', dci: 'Cotrimoxazole', nomCommercial: 'Bactrim Forte', dosage: '800/160 mg', posologie: '1 cp matin et soir pendant les repas', voie: 'Orale', duree: '5 jours', quantite: 'Boîte de 10', renouvellement: 0, nonSubstituable: false, instructions: 'À prendre avec un grand verre d eau.' }
    ]
  },
  {
    id: 'ord02',
    patientId: 'p01',
    medecinId: 'm01',
    consultationId: 'cons02',
    date: '12/02/2026',
    dateExpiration: '12/05/2026',
    statut: 'Expirée',
    medicaments: [
      { id: 'm02a', dci: 'Amlodipine', nomCommercial: 'Amlor', dosage: '10 mg', posologie: '1 cp le matin', voie: 'Orale', duree: '3 mois', quantite: 'Boîte de 30', renouvellement: 1, nonSubstituable: false },
      { id: 'm02b', dci: 'Ramipril', nomCommercial: 'Triatec', dosage: '5 mg', posologie: '1 cp le soir', voie: 'Orale', duree: '3 mois', quantite: 'Boîte de 30', renouvellement: 1, nonSubstituable: false }
    ]
  },
  {
    id: 'ord03',
    patientId: 'p05',
    medecinId: 'm01',
    consultationId: 'cons04',
    date: '22/04/2026',
    dateExpiration: '22/07/2026',
    statut: 'Active',
    instructions: 'Bilan à réaliser à jeun le matin. Résultats à apporter à la prochaine consultation.',
    medicaments: [
      { id: 'm03a', dci: 'Ramipril', nomCommercial: 'Triatec', dosage: '5 mg', posologie: '1 cp le matin', voie: 'Orale', duree: '3 mois', quantite: 'Boîte de 30', renouvellement: 2, nonSubstituable: false }
    ]
  }
];

export const DOCUMENTS_MEDICAUX_DEMO: ReadonlyArray<DocumentMedicalDemo> = [
  {
    id: 'doc01',
    patientId: 'p01',
    type: 'Analyse',
    titre: 'Bilan biologique complet',
    sousTitre: 'NFS, glycémie, HbA1c, lipides, créatinine',
    date: '14/01/2026',
    taille: '124 Ko',
    medecinId: 'm01',
    statut: 'Anormal',
    resume: 'HbA1c : 7,8% (hors cible). LDL : 1,52 g/L. Créatinine normale.'
  },
  {
    id: 'doc02',
    patientId: 'p01',
    type: 'Analyse',
    titre: 'ECBU',
    sousTitre: 'Examen cytobactériologique des urines',
    date: '10/04/2026',
    taille: '48 Ko',
    medecinId: 'm01',
    consultationId: 'cons01',
    statut: 'En attente',
    resume: 'Résultats attendus sous 48h.'
  },
  {
    id: 'doc03',
    patientId: 'p01',
    type: 'Imagerie',
    titre: "Fond d'oeil bilatéral",
    sousTitre: 'Dépistage rétinopathie diabétique',
    date: '10/11/2025',
    taille: '2,1 Mo',
    statut: 'Normal',
    resume: 'Pas de rétinopathie diabétique. Contrôle annuel recommandé.'
  },
  {
    id: 'doc04',
    patientId: 'p01',
    type: 'Compte-rendu',
    titre: 'Compte-rendu cardiologique',
    sousTitre: 'Dr. Fontaine — ECG + Echo',
    date: '08/10/2024',
    taille: '186 Ko',
    statut: 'Normal',
    resume: 'Rythmologie normale. FEVG conservée à 62%.'
  },
  {
    id: 'doc05',
    patientId: 'p05',
    type: 'Analyse',
    titre: 'Bilan biologique annuel',
    sousTitre: 'Prescription du 22/04/2026',
    date: '22/04/2026',
    taille: '—',
    medecinId: 'm01',
    consultationId: 'cons04',
    statut: 'En attente',
    resume: 'Résultats attendus dans 3 à 5 jours.'
  },
  {
    id: 'doc06',
    patientId: 'p05',
    type: 'Imagerie',
    titre: 'Mammographie bilatérale',
    date: '15/04/2023',
    taille: '4,2 Mo',
    statut: 'Normal',
    resume: 'ACR 1 bilatéral. Aucune anomalie détectée.'
  },
  {
    id: 'doc07',
    patientId: 'p03',
    type: 'Ordonnance',
    titre: 'Ordonnance rhinopharyngite',
    sousTitre: 'Consultation du 15/04/2026',
    date: '15/04/2026',
    taille: '18 Ko',
    medecinId: 'm01',
    statut: 'Normal'
  }
];

export function calcImc(poids: number, taille: number): number {
  return Math.round((poids / Math.pow(taille / 100, 2)) * 10) / 10;
}

export function getConsultationsForDoctor(medecinId: string): ConsultationMedicale[] {
  return CONSULTATIONS_MEDICALES_DEMO.filter((consultation) => consultation.medecinId === medecinId).slice();
}

export function getConsultationsPatient(patientId: string): ConsultationMedicale[] {
  return CONSULTATIONS_MEDICALES_DEMO.filter((consultation) => consultation.patientId === patientId).slice();
}

export function getDiagnosticsPatient(patientId: string): DiagnosticActif[] {
  return DIAGNOSTICS_ACTIFS_DEMO.filter((diagnostic) => diagnostic.patientId === patientId).slice();
}

export function getMedicamentsPatient(patientId: string): MedicamentActif[] {
  return MEDICAMENTS_ACTIFS_DEMO.filter((medicament) => medicament.patientId === patientId).slice();
}

export function getConstantesPatient(patientId: string): ConstantesVitales[] {
  return CONSTANTES_VITALES_DEMO.filter((constantes) => constantes.patientId === patientId).slice();
}

export function getLatestConstantesPatient(patientId: string): ConstantesVitales | undefined {
  return getConstantesPatient(patientId).sort((a, b) => comparerDatesFr(b.date, a.date))[0];
}

export function getOrdonnanceForConsultation(consultationId: string | undefined): OrdonnanceDemo | undefined {
  return ORDONNANCES_DEMO.find((ordonnance) => ordonnance.consultationId === consultationId);
}

export function getDocumentsPatient(patientId: string): DocumentMedicalDemo[] {
  return DOCUMENTS_MEDICAUX_DEMO.filter((document) => document.patientId === patientId).slice();
}

export function getDocumentsForDoctor(medecinId: string): DocumentMedicalDemo[] {
  return DOCUMENTS_MEDICAUX_DEMO.filter((document) => !document.medecinId || document.medecinId === medecinId).slice();
}

export function getOrdonnancesForDoctor(medecinId: string): OrdonnanceDemo[] {
  return ORDONNANCES_DEMO.filter((ordonnance) => ordonnance.medecinId === medecinId).slice();
}

export function comparerDatesFr(a: string, b: string): number {
  const [ja, ma, aa] = a.split('/').map(Number);
  const [jb, mb, ab] = b.split('/').map(Number);
  return new Date(aa, ma - 1, ja).getTime() - new Date(ab, mb - 1, jb).getTime();
}
