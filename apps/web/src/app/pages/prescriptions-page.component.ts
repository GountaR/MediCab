import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { OrdonnanceDemo, StatutOrdonnance, getOrdonnancesForDoctor } from '../data/medicab-clinical-demo.data';
import { StatusChipComponent } from '../shared/status-chip.component';

type FiltreOrdonnance = 'Toutes' | 'Active' | 'Expirée' | 'Annulée';

const MEDECIN_ACTIF_ID = 'm01';

@Component({
  selector: 'app-prescriptions-page',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusChipComponent],
  templateUrl: './prescriptions-page.component.html',
  styleUrl: './prescriptions-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrescriptionsPageComponent {
  protected readonly demoStore = inject(MedicabDemoStore);
  protected readonly medecinActif = this.demoStore.getMedecin(MEDECIN_ACTIF_ID);
  protected readonly search = signal('');
  protected readonly statusFilter = signal<FiltreOrdonnance>('Toutes');
  protected readonly statuses: readonly FiltreOrdonnance[] = ['Toutes', 'Active', 'Expirée', 'Annulée'];
  protected readonly ordonnances = [...getOrdonnancesForDoctor(MEDECIN_ACTIF_ID)];
  protected readonly selectedId = signal(this.ordonnances[0]?.id ?? '');

  protected readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    const filter = this.statusFilter();

    return this.ordonnances.filter((ordonnance) => {
      const patient = this.demoStore.getPatient(ordonnance.patientId);
      const matchesQuery =
        query.length === 0 ||
        ordonnance.id.toLowerCase().includes(query) ||
        (patient ? getNomComplet(patient).toLowerCase().includes(query) : false) ||
        ordonnance.medicaments.some((medicament) => medicament.dci.toLowerCase().includes(query));

      const matchesStatus = filter === 'Toutes' ? true : ordonnance.statut === filter;
      return matchesQuery && matchesStatus;
    });
  });

  protected readonly selected = computed(() => {
    const filtered = this.filtered();
    return filtered.find((ordonnance) => ordonnance.id === this.selectedId()) ?? filtered[0] ?? null;
  });

  protected readonly selectedPatient = computed(() => {
    const ordonnance = this.selected();
    return ordonnance ? this.demoStore.getPatient(ordonnance.patientId) ?? null : null;
  });

  protected ordonnanceTone(statut: StatutOrdonnance) {
    switch (statut) {
      case 'Active':
        return 'success';
      case 'Expirée':
        return 'warning';
      case 'Annulée':
        return 'danger';
      case 'Renouvelée':
        return 'accent';
      default:
        return 'neutral';
    }
  }

  protected readonly getNomComplet = getNomComplet;
}
