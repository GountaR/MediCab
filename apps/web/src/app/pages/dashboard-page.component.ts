import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NAV_SECTIONS, WORKSPACE_PAGES } from '../app.navigation';
import { DATE_REFERENCE_DEMO, formatMontant, getMontantRestant, getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { StatutPatient, StatutRendezVous } from '../data/medicab-demo.types';
import { AppIconComponent } from '../shared/app-icon.component';
import { StatusChipComponent } from '../shared/status-chip.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, AppIconComponent, StatusChipComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  protected readonly demoStore = inject(MedicabDemoStore);
  protected readonly referenceDate = DATE_REFERENCE_DEMO;

  protected readonly metrics = computed(() => {
    const snapshot = this.demoStore.dashboardSnapshot();
    return [
      { label: 'Patients actifs', value: `${snapshot.patientsActifs}`, detail: 'Base de démonstration issue du prototype' },
      { label: 'Rendez-vous du jour', value: `${snapshot.rendezVousDuJour}`, detail: `Référence ${this.referenceDate}` },
      { label: 'Consultations à suivre', value: `${snapshot.consultationsEnCours}`, detail: 'Accueillis ou déjà en cours' },
      { label: 'Dossiers à surveiller', value: `${snapshot.dossiersAvecImpayes}`, detail: `${snapshot.facturesEnRetard} factures en retard` }
    ];
  });

  protected readonly todayAppointments = computed(() =>
    this.demoStore.getRendezVousDuJour(6).map((rendezVous) => ({
      id: rendezVous.id,
      heure: rendezVous.heure,
      type: rendezVous.type,
      statut: rendezVous.statut,
      patientId: rendezVous.patientId,
      patient: getNomComplet(this.demoStore.getPatient(rendezVous.patientId)!),
      medecin: this.demoStore.getMedecin(rendezVous.medecinId)
    }))
  );

  protected readonly watchlistPatients = computed(() =>
    this.demoStore.getPatientsPrioritaires(4).map((patient) => ({
      id: patient.id,
      nomComplet: getNomComplet(patient),
      statut: patient.statut,
      solde: formatMontant(patient.soldeImpaye ?? 0),
      prochainRdv: patient.prochainRDV ?? 'Aucun rendez-vous programmé',
      medecin: this.demoStore.getMedecin(patient.medecinId)
    }))
  );

  protected readonly invoiceSummary = computed(() => {
    const factures = this.demoStore.factures();
    const totalRestant = factures.reduce((somme, facture) => somme + getMontantRestant(facture), 0);
    const ouvertes = factures.filter((facture) => getMontantRestant(facture) > 0).length;
    return {
      totalRestant: formatMontant(totalRestant),
      ouvertes
    };
  });

  protected readonly roleSpaces = [
    {
      title: 'Réceptionniste',
      description: 'Accueil patient, agenda, check-in, création rapide et suivi des impayés simples.'
    },
    {
      title: 'Médecin',
      description: 'Consultation structurée, diagnostic, ordonnances et visibilité limitée à ses patients déjà consultés.'
    },
    {
      title: 'Administrateur',
      description: 'Supervision, utilisateurs, rôles, paramètres et audit du cabinet unique.'
    }
  ];

  protected readonly sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: WORKSPACE_PAGES.filter((page) => page.section === section.key)
  }));

  protected patientTone(statut: StatutPatient) {
    switch (statut) {
      case 'Actif':
        return 'success';
      case 'En attente':
        return 'warning';
      case 'Décédé':
        return 'danger';
      default:
        return 'neutral';
    }
  }

  protected appointmentTone(statut: StatutRendezVous) {
    switch (statut) {
      case 'Planifié':
        return 'accent';
      case 'Accueilli':
        return 'info';
      case 'En consultation':
        return 'warning';
      case 'Terminé':
        return 'success';
      case 'Absent':
        return 'danger';
      default:
        return 'neutral';
    }
  }
}
