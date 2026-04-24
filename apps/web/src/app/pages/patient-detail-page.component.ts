import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';

import { DATE_REFERENCE_DEMO, calculerAge, comparerRendezVous, convertirDateFr, formatMontant, getInitiales, getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { StatutFacture, StatutPatient, StatutRendezVous } from '../data/medicab-demo.types';
import { StatusChipComponent } from '../shared/status-chip.component';

@Component({
  selector: 'app-patient-detail-page',
  standalone: true,
  imports: [RouterLink, StatusChipComponent],
  templateUrl: './patient-detail-page.component.html',
  styleUrl: './patient-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientDetailPageComponent {
  protected readonly demoStore = inject(MedicabDemoStore);
  private readonly route = inject(ActivatedRoute);

  private readonly patientId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: this.route.snapshot.paramMap.get('id') }
  );

  protected readonly referenceDate = DATE_REFERENCE_DEMO;
  protected readonly patient = computed(() => this.demoStore.getPatient(this.patientId()));
  protected readonly medecin = computed(() => this.demoStore.getMedecin(this.patient()?.medecinId));
  protected readonly rendezVous = computed(() => this.demoStore.getRendezVousPatient(this.patientId()));
  protected readonly facturesOuvertes = computed(() => this.demoStore.getFacturesOuvertesPatient(this.patientId()));
  protected readonly age = computed(() => (this.patient() ? calculerAge(this.patient()!.dateNaissance) : null));
  protected readonly nomComplet = computed(() => (this.patient() ? getNomComplet(this.patient()!) : ''));
  protected readonly initials = computed(() => (this.patient() ? getInitiales(this.patient()!) : ''));
  protected readonly prochainRendezVous = computed(() => {
    const reference = convertirDateFr(this.referenceDate).getTime();
    return this.rendezVous()
      .filter((item) => convertirDateFr(item.date).getTime() >= reference && item.statut !== 'Terminé')
      .slice()
      .sort(comparerRendezVous)[0];
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

  protected invoiceTone(statut: StatutFacture) {
    switch (statut) {
      case 'En retard':
        return 'danger';
      case 'Partielle':
        return 'warning';
      case 'Réglée':
        return 'success';
      case 'Envoyée':
        return 'accent';
      default:
        return 'neutral';
    }
  }

  protected montantRestant(montantTotal: number, montantRegle: number): string {
    return formatMontant(montantTotal - montantRegle);
  }

  protected readonly formatMontant = formatMontant;
}
