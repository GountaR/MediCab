import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { STATUTS_PATIENT, calculerAge, formatMontant, getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { Patient, StatutPatient } from '../data/medicab-demo.types';
import { StatusChipComponent } from '../shared/status-chip.component';

const ITEMS_PAR_PAGE = 10;

type FiltreStatut = StatutPatient | 'Tous';
type FiltreMedecin = string | 'Tous';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusChipComponent],
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientsPageComponent {
  private readonly demoStore = inject(MedicabDemoStore);

  protected readonly recherche = signal('');
  protected readonly filtreStatut = signal<FiltreStatut>('Tous');
  protected readonly filtreMedecin = signal<FiltreMedecin>('Tous');
  protected readonly page = signal(1);

  protected readonly medecins = this.demoStore.medecins;
  protected readonly statuts = ['Tous', ...STATUTS_PATIENT] as const;

  protected readonly patientsFiltres = computed(() => {
    const recherche = this.recherche().trim().toLowerCase();
    const filtreStatut = this.filtreStatut();
    const filtreMedecin = this.filtreMedecin();

    return this.demoStore.patients().filter((patient) => {
      const correspondRecherche =
        recherche.length === 0 ||
        getNomComplet(patient).toLowerCase().includes(recherche) ||
        patient.dpi.toLowerCase().includes(recherche) ||
        patient.telephone.includes(recherche) ||
        patient.email.toLowerCase().includes(recherche);

      const correspondStatut = filtreStatut === 'Tous' || patient.statut === filtreStatut;
      const correspondMedecin = filtreMedecin === 'Tous' || patient.medecinId === filtreMedecin;

      return correspondRecherche && correspondStatut && correspondMedecin;
    });
  });

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.patientsFiltres().length / ITEMS_PAR_PAGE)));

  protected readonly pageCourante = computed(() => {
    const debut = (this.page() - 1) * ITEMS_PAR_PAGE;
    return this.patientsFiltres()
      .slice(debut, debut + ITEMS_PAR_PAGE)
      .map((patient) => ({
        patient,
        nomComplet: getNomComplet(patient),
        medecin: this.demoStore.getMedecin(patient.medecinId),
        age: calculerAge(patient.dateNaissance),
        solde: formatMontant(patient.soldeImpaye ?? 0)
      }));
  });

  protected readonly vueSynthese = computed(() => {
    const patients = this.patientsFiltres();
    return {
      total: patients.length,
      actifs: patients.filter((patient) => patient.statut === 'Actif').length,
      enAttente: patients.filter((patient) => patient.statut === 'En attente').length,
      avecImpayes: patients.filter((patient) => (patient.soldeImpaye ?? 0) > 0).length
    };
  });

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

  protected resetFilters(): void {
    this.recherche.set('');
    this.filtreStatut.set('Tous');
    this.filtreMedecin.set('Tous');
    this.page.set(1);
  }

  protected setPage(page: number): void {
    const safePage = Math.min(Math.max(page, 1), this.totalPages());
    this.page.set(safePage);
  }

  protected hasAlerte(patient: Patient): boolean {
    return patient.allergies.length > 0 || (patient.soldeImpaye ?? 0) > 0;
  }
}
