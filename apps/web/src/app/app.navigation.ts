export type AppIconName =
  | 'dashboard'
  | 'patients'
  | 'calendar'
  | 'consultations'
  | 'prescriptions'
  | 'documents'
  | 'billing'
  | 'users'
  | 'settings'
  | 'login';

export interface SummaryCardDefinition {
  label: string;
  value: string;
  detail: string;
}

export interface WorkspacePageDefinition {
  path: string;
  label: string;
  section: 'workspace' | 'admin';
  icon: AppIconName;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: string[];
  summaryCards: SummaryCardDefinition[];
  focusItems: string[];
  nextMilestones: string[];
}

export interface NavigationSectionDefinition {
  key: 'workspace' | 'admin';
  label: string;
}

export const NAV_SECTIONS: NavigationSectionDefinition[] = [
  { key: 'workspace', label: 'Flux métier' },
  { key: 'admin', label: 'Pilotage' }
];

export const WORKSPACE_PAGES: WorkspacePageDefinition[] = [
  {
    path: 'tableau-de-bord',
    label: 'Tableau de bord',
    section: 'workspace',
    icon: 'dashboard',
    eyebrow: 'Espace de travail',
    title: 'Tableau de bord MediCab',
    description: 'Vue d’ensemble du cabinet avec accès rapide aux modules, aux rôles et aux priorités de la V1.',
    breadcrumbs: ['Espace de travail', 'Tableau de bord'],
    summaryCards: [
      { label: 'Patients actifs', value: '152', detail: 'Base de démonstration issue du prototype' },
      { label: 'Rendez-vous du jour', value: '18', detail: 'Réception et médecins synchronisés' },
      { label: 'Consultations en attente', value: '6', detail: 'File clinique à brancher au Sprint 3' }
    ],
    focusItems: [
      'Consolider la navigation globale Angular avant l’intégration fidèle du Figma.',
      'Prévoir les espaces réceptionniste, médecin et administrateur sans dupliquer le shell.',
      'Poser les fondations des tableaux, formulaires et états visuels.'
    ],
    nextMilestones: [
      'Sprint 3 : brancher les écrans réels et les mocks du prototype.',
      'Sprint 4 : aligner le shell avec les contrats API et le modèle de données.',
      'Sprint 5 : remplacer les données simulées par les services .NET.'
    ]
  },
  {
    path: 'patients',
    label: 'Patients',
    section: 'workspace',
    icon: 'patients',
    eyebrow: 'Réception et clinique',
    title: 'Gestion des patients',
    description: 'Liste, fiche patient et formulaires d’entrée. Ce module deviendra la porte d’entrée du dossier administratif et clinique.',
    breadcrumbs: ['Espace de travail', 'Patients'],
    summaryCards: [
      { label: 'Fiches prioritaires', value: '12', detail: 'Identité, contact, mutuelle, référent, alertes' },
      { label: 'Segments visibles', value: '4', detail: 'Actif, inactif, en attente, décédé' },
      { label: 'Vues prévues', value: '3', detail: 'Liste, détail et création / édition' }
    ],
    focusItems: [
      'Prévoir une liste dense mais lisible avec recherche, filtres et actions rapides.',
      'Conserver la séparation entre données administratives et données médicales.',
      'Préparer le terrain pour la règle métier : chaque médecin ne voit que ses patients déjà consultés.'
    ],
    nextMilestones: [
      'Intégrer la maquette Figma de la liste patients.',
      'Créer les composants de fiche patient et de résumé latéral.',
      'Brancher les formulaires sur les mocks puis les API.'
    ]
  },
  {
    path: 'rendez-vous',
    label: 'Rendez-vous',
    section: 'workspace',
    icon: 'calendar',
    eyebrow: 'Accueil et planning',
    title: 'Agenda et rendez-vous',
    description: 'Organisation du jour, reprogrammation, annulation et check-in patient dans un environnement réceptionniste rapide.',
    breadcrumbs: ['Espace de travail', 'Rendez-vous'],
    summaryCards: [
      { label: 'Statuts clés', value: '6', detail: 'Planifié, accueilli, en consultation, terminé, annulé, absent' },
      { label: 'Actions rapides', value: '4', detail: 'Créer, reprogrammer, annuler, accueillir' },
      { label: 'Vues prévues', value: '2', detail: 'Agenda et liste opérationnelle' }
    ],
    focusItems: [
      'Rendre les changements de statut visibles en un coup d’œil.',
      'Préserver un flux rapide pour la réception sans surcharge modale.',
      'Préparer la compatibilité avec la consultation sans rendez-vous.'
    ],
    nextMilestones: [
      'Intégrer le calendrier et les modales du prototype.',
      'Introduire les badges de statut et la file d’attente.',
      'Brancher le module sur les règles métier de planning.'
    ]
  },
  {
    path: 'consultations',
    label: 'Consultations',
    section: 'workspace',
    icon: 'consultations',
    eyebrow: 'Espace médecin',
    title: 'Consultations et suivi',
    description: 'Saisie structurée des consultations, diagnostic, plan thérapeutique et suivi clinique.',
    breadcrumbs: ['Espace de travail', 'Consultations'],
    summaryCards: [
      { label: 'Sections médicales', value: '6', detail: 'Motif, examen, diagnostic, traitement, ordonnance, suivi' },
      { label: 'Statuts', value: '3', detail: 'Brouillon, finalisée, signée' },
      { label: 'Référentiels', value: 'CIM-10', detail: 'Prévu dès les premiers écrans cliniques' }
    ],
    focusItems: [
      'Maintenir une lecture très claire malgré la densité clinique.',
      'Préparer des composants réutilisables pour constantes, diagnostics et notes.',
      'Conserver le filtre d’accès médecin sur ses patients consultés.'
    ],
    nextMilestones: [
      'Mapper la page consultation du prototype en Angular.',
      'Ajouter le workflow de brouillon et signature métier.',
      'Définir les contrats API et le schéma clinique.'
    ]
  },
  {
    path: 'ordonnances',
    label: 'Ordonnances',
    section: 'workspace',
    icon: 'prescriptions',
    eyebrow: 'Prescription',
    title: 'Ordonnances',
    description: 'Préparation des prescriptions, aperçu imprimable et gestion des traitements liés à la consultation.',
    breadcrumbs: ['Espace de travail', 'Ordonnances'],
    summaryCards: [
      { label: 'États', value: '4', detail: 'Active, expirée, annulée, renouvelée' },
      { label: 'Informations', value: '7', detail: 'DCI, dosage, posologie, durée, quantité, renouvellement, consignes' },
      { label: 'Sorties', value: 'PDF', detail: 'Aperçu imprimable prévu côté front puis API' }
    ],
    focusItems: [
      'Prévoir une expérience médecin rapide et sans bruit visuel.',
      'Distinguer clairement traitement en cours et nouvelle ordonnance.',
      'Conserver la place nécessaire pour l’impression et la signature métier.'
    ],
    nextMilestones: [
      'Intégrer le formulaire d’ordonnance du prototype.',
      'Brancher les médicaments courants et leurs statuts.',
      'Préparer la génération documentaire côté backend.'
    ]
  },
  {
    path: 'documents',
    label: 'Documents',
    section: 'workspace',
    icon: 'documents',
    eyebrow: 'Dossier patient',
    title: 'Documents médicaux',
    description: 'Organisation des analyses, imageries, comptes-rendus et pièces générées par l’application.',
    breadcrumbs: ['Espace de travail', 'Documents'],
    summaryCards: [
      { label: 'Catégories', value: '5', detail: 'Analyse, imagerie, compte-rendu, courrier, ordonnance' },
      { label: 'Statuts', value: '4', detail: 'Normal, anormal, critique, en attente' },
      { label: 'Sources', value: '2', detail: 'Importés et générés par le système' }
    ],
    focusItems: [
      'Garder une lecture immédiate de la criticité documentaire.',
      'Préparer l’association patient, consultation et médecin.',
      'Maintenir une interface simple pour les imports futurs.'
    ],
    nextMilestones: [
      'Intégrer la liste documentaire et les aperçus du prototype.',
      'Créer le modèle de métadonnées documentaires.',
      'Préparer l’upload et la consultation sécurisée.'
    ]
  },
  {
    path: 'facturation',
    label: 'Facturation',
    section: 'admin',
    icon: 'billing',
    eyebrow: 'Administration',
    title: 'Facturation et suivi des impayés',
    description: 'Module de facturation simple centré sur les montants, le reste à payer et les statuts métier.',
    breadcrumbs: ['Pilotage', 'Facturation'],
    summaryCards: [
      { label: 'Règle V1', value: 'Simple', detail: 'Pas de gestion détaillée du moyen de paiement' },
      { label: 'Montants', value: '3', detail: 'Total, payé, reste à payer' },
      { label: 'Statuts', value: '6', detail: 'Brouillon, envoyée, réglée, en retard, partielle, annulée' }
    ],
    focusItems: [
      'Conserver une vue très opérationnelle pour la réception et l’admin.',
      'Préparer la génération semi-manuelle des factures.',
      'Mettre en avant les retards et impayés sans complexifier le workflow.'
    ],
    nextMilestones: [
      'Intégrer les listes et détails de facture du prototype.',
      'Définir le modèle PostgreSQL des factures et paiements simples.',
      'Brancher les actions d’encaissement sur l’API.'
    ]
  },
  {
    path: 'utilisateurs',
    label: 'Utilisateurs',
    section: 'admin',
    icon: 'users',
    eyebrow: 'Administration',
    title: 'Utilisateurs et rôles',
    description: 'Gestion des comptes du cabinet, des rôles système et de la visibilité métier par module.',
    breadcrumbs: ['Pilotage', 'Utilisateurs'],
    summaryCards: [
      { label: 'Rôles système', value: '3', detail: 'Administrateur, médecin, réceptionniste' },
      { label: 'Accès', value: 'RBAC', detail: 'Lecture, création, modification, suppression, export' },
      { label: 'Statuts', value: '4', detail: 'Actif, inactif, en congé, suspendu' }
    ],
    focusItems: [
      'Conserver des rôles stables et lisibles pour la V1.',
      'Préparer les futures matrices de permissions sans sur-engineering.',
      'Afficher clairement les restrictions entre réception, clinique et administration.'
    ],
    nextMilestones: [
      'Intégrer la matrice des rôles du prototype.',
      'Créer les écrans de liste et d’édition utilisateur.',
      'Brancher la sécurité backend et les guards Angular.'
    ]
  },
  {
    path: 'parametres',
    label: 'Paramètres',
    section: 'admin',
    icon: 'settings',
    eyebrow: 'Pilotage',
    title: 'Paramètres du cabinet',
    description: 'Configuration fonctionnelle du cabinet, préférences système et réglages transverses de la V1.',
    breadcrumbs: ['Pilotage', 'Paramètres'],
    summaryCards: [
      { label: 'Périmètre V1', value: '1 cabinet', detail: 'Pas de multi-site ni de multi-établissement' },
      { label: 'Formats', value: 'FR', detail: 'Dates, heures et libellés francophones' },
      { label: 'Axes', value: '3', detail: 'Cabinet, produit, administration' }
    ],
    focusItems: [
      'Préparer les réglages essentiels sans alourdir la V1.',
      'Garder les conventions locales visibles et documentées.',
      'Poser un espace propre pour les futures préférences produit.'
    ],
    nextMilestones: [
      'Intégrer la page paramètres du prototype.',
      'Définir les premiers paramètres persistés côté backend.',
      'Préparer les écrans d’audit et de configuration avancée.'
    ]
  }
];

export const PAGE_BY_PATH = WORKSPACE_PAGES.reduce<Record<string, WorkspacePageDefinition>>((acc, page) => {
  acc[page.path] = page;
  return acc;
}, {});
