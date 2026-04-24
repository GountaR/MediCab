import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DATE_REFERENCE_DEMO, STATUTS_RDV, convertirDateFr, getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { RendezVous, StatutRendezVous } from '../data/medicab-demo.types';
import { StatusChipComponent } from '../shared/status-chip.component';

type VueRendezVous = 'liste' | 'agenda';
type FiltreStatut = StatutRendezVous | 'Tous';
type FiltreMedecin = string | 'Tous';

const HEURE_DEBUT = 8;
const HEURE_FIN = 18;
const PIXELS_PAR_HEURE = 72;

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusChipComponent],
  templateUrl: './appointments-page.component.html',
  styleUrl: './appointments-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsPageComponent {
  private readonly demoStore = inject(MedicabDemoStore);

  protected readonly dateReference = DATE_REFERENCE_DEMO;
  protected readonly vue = signal<VueRendezVous>('liste');
  protected readonly recherche = signal('');
  protected readonly filtreStatut = signal<FiltreStatut>('Tous');
  protected readonly filtreMedecin = signal<FiltreMedecin>('Tous');
  protected readonly rendezVousState = signal<RendezVous[]>(this.demoStore.getRendezVousDuJour());

  protected readonly medecins = this.demoStore.medecins;
  protected readonly filtresStatut = ['Tous', ...STATUTS_RDV.filter((statut) => statut !== 'Absent')] as const;
  protected readonly heuresAgenda = Array.from({ length: HEURE_FIN - HEURE_DEBUT }, (_, index) => HEURE_DEBUT + index);

  protected readonly rendezVousFiltres = computed(() => {
    const recherche = this.recherche().trim().toLowerCase();
    const filtreStatut = this.filtreStatut();
    const filtreMedecin = this.filtreMedecin();

    return this.rendezVousState().filter((rendezVous) => {
      const patient = this.demoStore.getPatient(rendezVous.patientId);
      const correspondRecherche =
        recherche.length === 0 ||
        (patient ? getNomComplet(patient).toLowerCase().includes(recherche) : false) ||
        rendezVous.type.toLowerCase().includes(recherche) ||
        rendezVous.heure.includes(recherche);

      const correspondStatut = filtreStatut === 'Tous' || rendezVous.statut === filtreStatut;
      const correspondMedecin = filtreMedecin === 'Tous' || rendezVous.medecinId === filtreMedecin;

      return correspondRecherche && correspondStatut && correspondMedecin;
    });
  });

  protected readonly vueSynthese = computed(() => {
    const rendezVous = this.rendezVousState();
    const termines = rendezVous.filter((item) => item.statut === 'Terminé').length;
    const enAccueil = rendezVous.filter((item) => item.statut === 'Accueilli' || item.statut === 'En consultation').length;
    const planifies = rendezVous.filter((item) => item.statut === 'Planifié').length;
    return {
      total: rendezVous.length,
      termines,
      enAccueil,
      planifies,
      progression: rendezVous.length ? Math.round((termines / rendezVous.length) * 100) : 0
    };
  });

  protected readonly lignesListe = computed(() =>
    this.rendezVousFiltres().map((rendezVous) => ({
      rendezVous,
      patient: this.demoStore.getPatient(rendezVous.patientId),
      medecin: this.demoStore.getMedecin(rendezVous.medecinId)
    }))
  );

  protected readonly blocsAgenda = computed(() =>
    this.rendezVousFiltres().map((rendezVous) => {
      const patient = this.demoStore.getPatient(rendezVous.patientId);
      const medecin = this.demoStore.getMedecin(rendezVous.medecinId);
      const [heures, minutes] = rendezVous.heure.split(':').map(Number);
      const top = (heures - HEURE_DEBUT) * PIXELS_PAR_HEURE + (minutes / 60) * PIXELS_PAR_HEURE;
      const height = Math.max(34, (rendezVous.duree / 60) * PIXELS_PAR_HEURE);

      return {
        rendezVous,
        patient,
        medecin,
        top,
        height
      };
    })
  );

  protected readonly referenceLabel = computed(() => {
    const reference = convertirDateFr(this.dateReference);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(reference);
  });

  protected readonly agendaHeight = `${(HEURE_FIN - HEURE_DEBUT) * PIXELS_PAR_HEURE}px`;

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

  protected agendaBackground(couleur?: string): string {
    return couleur ? `${couleur}14` : '#eff6ff';
  }

  protected setVue(vue: VueRendezVous): void {
    this.vue.set(vue);
  }

  protected accueillir(rendezVousId: string): void {
    this.rendezVousState.update((items) =>
      items.map((item) => (item.id === rendezVousId && item.statut === 'Planifié' ? { ...item, statut: 'Accueilli' } : item))
    );
  }
}
