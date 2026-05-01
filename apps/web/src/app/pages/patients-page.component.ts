import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, map, of, startWith, switchMap } from 'rxjs';

import { STATUTS_PATIENT, calculerAge, formatMontant, getNomComplet } from '../data/medicab-demo.data';
import { Patient, StatutPatient } from '../data/medicab-demo.types';
import { PatientsApiService } from '../services/patients-api.service';
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
  private readonly patientsApi = inject(PatientsApiService);

  protected readonly recherche = signal('');
  protected readonly filtreStatut = signal<FiltreStatut>('Tous');
  protected readonly filtreMedecin = signal<FiltreMedecin>('Tous');
  protected readonly page = signal(1);

  protected readonly statuts = ['Tous', ...STATUTS_PATIENT] as const;
  private readonly medecinsState = toSignal(
    this.patientsApi.getDoctors().pipe(catchError(() => of([]))),
    { initialValue: [] }
  );

  protected readonly medecins = computed(() => this.medecinsState());

  private readonly patientsState = toSignal(
    toObservable(
      computed(() => ({
        search: this.recherche().trim(),
        status: this.filtreStatut() === 'Tous' ? undefined : (this.filtreStatut() as StatutPatient),
        doctorId: this.filtreMedecin() === 'Tous' ? undefined : this.filtreMedecin(),
        page: this.page(),
        pageSize: ITEMS_PAR_PAGE
      }))
    ).pipe(
      debounceTime(150),
      switchMap((query) =>
        this.patientsApi.getPatients(query).pipe(
          map((response) => ({ loading: false, response, error: '' })),
          startWith({ loading: true, response: null, error: '' }),
          catchError(() =>
            of({
              loading: false,
              response: null,
              error: "Impossible de charger la liste patients depuis l'API."
            })
          )
        )
      )
    ),
    {
      initialValue: {
        loading: true,
        response: null as { items: Patient[]; page: number; pageSize: number; total: number } | null,
        error: ''
      }
    }
  );

  protected readonly patientsFiltres = computed(() => {
    return this.patientsState().response?.items ?? [];
  });

  protected readonly chargement = computed(() => this.patientsState().loading);
  protected readonly erreur = computed(() => this.patientsState().error);
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil((this.patientsState().response?.total ?? 0) / ITEMS_PAR_PAGE))
  );

  protected readonly pageCourante = computed(() => {
    return this.patientsFiltres()
      .map((patient) => ({
        patient,
        nomComplet: getNomComplet(patient),
        medecin: this.medecins().find((medecin) => medecin.id === patient.medecinId),
        age: calculerAge(patient.dateNaissance),
        solde: formatMontant(patient.soldeImpaye ?? 0)
      }));
  });

  protected readonly vueSynthese = computed(() => {
    const patients = this.patientsFiltres();
    const total = this.patientsState().response?.total ?? 0;
    return {
      total,
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
