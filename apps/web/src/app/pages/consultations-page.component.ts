import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { ConsultationMedicale, DiagnosticActif, StatutConsultation, getConsultationsForDoctor, getConsultationsPatient, getDiagnosticsPatient, getLatestConstantesPatient, getMedicamentsPatient, getOrdonnanceForConsultation, calcImc, comparerDatesFr } from '../data/medicab-clinical-demo.data';
import { StatusChipComponent } from '../shared/status-chip.component';

const MEDECIN_ACTIF_ID = 'm01';

@Component({
  selector: 'app-consultations-page',
  standalone: true,
  imports: [FormsModule, StatusChipComponent],
  templateUrl: './consultations-page.component.html',
  styleUrl: './consultations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationsPageComponent {
  protected readonly demoStore = inject(MedicabDemoStore);
  protected readonly medecinActif = this.demoStore.getMedecin(MEDECIN_ACTIF_ID);
  protected readonly consultationsDisponibles = [...getConsultationsForDoctor(MEDECIN_ACTIF_ID)].sort((a, b) => comparerDatesFr(b.date, a.date));
  protected readonly consultationId = signal(this.consultationsDisponibles[0]?.id ?? '');

  protected readonly consultation = computed(() =>
    this.consultationsDisponibles.find((item) => item.id === this.consultationId()) ?? this.consultationsDisponibles[0] ?? null
  );

  protected readonly patient = computed(() => {
    const consultation = this.consultation();
    return consultation ? this.demoStore.getPatient(consultation.patientId) ?? null : null;
  });

  protected readonly historiquesPatient = computed(() => {
    const consultation = this.consultation();
    if (!consultation) {
      return [] as ConsultationMedicale[];
    }

    return getConsultationsPatient(consultation.patientId).sort((a, b) => comparerDatesFr(b.date, a.date));
  });

  protected readonly diagnosticsActifs = computed(() => {
    const consultation = this.consultation();
    return consultation ? getDiagnosticsPatient(consultation.patientId) : [];
  });

  protected readonly traitementsActifs = computed(() => {
    const consultation = this.consultation();
    return consultation ? getMedicamentsPatient(consultation.patientId) : [];
  });

  protected readonly dernieresConstantes = computed(() => {
    const consultation = this.consultation();
    return consultation ? getLatestConstantesPatient(consultation.patientId) ?? null : null;
  });

  protected readonly ordonnance = computed(() => {
    const consultation = this.consultation();
    return consultation ? getOrdonnanceForConsultation(consultation.ordonnanceId) ?? null : null;
  });

  protected readonly patientsSuivisCount = new Set(this.consultationsDisponibles.map((consultation) => consultation.patientId)).size;

  protected readonly consultationsDuJour = this.demoStore
    .getRendezVousDuJour()
    .filter((rendezVous) => rendezVous.medecinId === MEDECIN_ACTIF_ID).length;

  protected readonly resume = computed(() => ({
    consultationsDisponibles: this.consultationsDisponibles.length,
    diagnosticsChroniques: this.diagnosticsActifs().filter((item) => item.statut === 'Chronique').length,
    traitementsActifs: this.traitementsActifs().filter((item) => item.statut === 'Actif').length
  }));

  protected readonly imc = computed(() => {
    const constantes = this.dernieresConstantes();
    return constantes ? calcImc(constantes.poids, constantes.taille) : null;
  });

  protected consultationTone(statut: StatutConsultation) {
    switch (statut) {
      case 'Signée':
        return 'success';
      case 'Finalisée':
        return 'warning';
      default:
        return 'accent';
    }
  }

  protected diagnosticTone(diagnostic: DiagnosticActif) {
    switch (diagnostic.statut) {
      case 'Chronique':
        return 'danger';
      case 'Actif':
        return 'accent';
      case 'Résolu':
        return 'success';
      default:
        return 'warning';
    }
  }

  protected readonly getNomComplet = getNomComplet;
}
