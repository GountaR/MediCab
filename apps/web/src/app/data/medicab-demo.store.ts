import { Injectable, computed, signal } from '@angular/core';

import {
  comparerDatesFr,
  DATE_REFERENCE_DEMO,
  FACTURES_DEMO,
  MEDECINS_DEMO,
  PATIENTS_DEMO,
  RENDEZ_VOUS_DEMO,
  comparerRendezVous,
  getMontantRestant
} from './medicab-demo.data';
import { Facture, Medecin, Patient, RendezVous } from './medicab-demo.types';

@Injectable({ providedIn: 'root' })
export class MedicabDemoStore {
  private readonly medecinsState = signal<ReadonlyArray<Medecin>>(MEDECINS_DEMO);
  private readonly patientsState = signal<ReadonlyArray<Patient>>(PATIENTS_DEMO);
  private readonly rendezVousState = signal<ReadonlyArray<RendezVous>>(RENDEZ_VOUS_DEMO);
  private readonly facturesState = signal<ReadonlyArray<Facture>>(FACTURES_DEMO);

  readonly medecins = this.medecinsState.asReadonly();
  readonly patients = this.patientsState.asReadonly();
  readonly rendezVous = this.rendezVousState.asReadonly();
  readonly factures = this.facturesState.asReadonly();
  readonly dateReference = DATE_REFERENCE_DEMO;

  readonly dashboardSnapshot = computed(() => {
    const patients = this.patients();
    const rendezVous = this.rendezVous();
    const factures = this.factures();

    const patientsActifs = patients.filter((patient) => patient.statut === 'Actif').length;
    const rendezVousDuJour = rendezVous.filter((item) => item.date === this.dateReference).length;
    const consultationsEnCours = rendezVous.filter((item) => item.statut === 'Accueilli' || item.statut === 'En consultation').length;
    const dossiersAvecImpayes = patients.filter((patient) => (patient.soldeImpaye ?? 0) > 0).length;
    const facturesEnRetard = factures.filter((facture) => facture.statut === 'En retard').length;

    return {
      patientsActifs,
      rendezVousDuJour,
      consultationsEnCours,
      dossiersAvecImpayes,
      facturesEnRetard
    };
  });

  getMedecin(id: string | null | undefined): Medecin | undefined {
    if (!id) {
      return undefined;
    }
    return this.medecins().find((medecin) => medecin.id === id);
  }

  getPatient(id: string | null | undefined): Patient | undefined {
    if (!id) {
      return undefined;
    }
    return this.patients().find((patient) => patient.id === id);
  }

  getRendezVousPatient(patientId: string | null | undefined): RendezVous[] {
    if (!patientId) {
      return [];
    }
    return this.rendezVous()
      .filter((rendezVous) => rendezVous.patientId === patientId)
      .slice()
      .sort(comparerRendezVous);
  }

  getFacturesPatient(patientId: string | null | undefined): Facture[] {
    if (!patientId) {
      return [];
    }
    return this.factures()
      .filter((facture) => facture.patientId === patientId)
      .slice()
      .sort((a, b) => comparerDatesFr(b.date, a.date));
  }

  getFacturesOuvertesPatient(patientId: string | null | undefined): Facture[] {
    return this.getFacturesPatient(patientId).filter((facture) => getMontantRestant(facture) > 0);
  }

  getRendezVousDuJour(limit?: number): RendezVous[] {
    const resultat = this.rendezVous()
      .filter((rendezVous) => rendezVous.date === this.dateReference)
      .slice()
      .sort(comparerRendezVous);

    return typeof limit === 'number' ? resultat.slice(0, limit) : resultat;
  }

  getPatientsPrioritaires(limit = 4): Patient[] {
    return this.patients()
      .filter((patient) => (patient.soldeImpaye ?? 0) > 0)
      .slice()
      .sort((a, b) => (b.soldeImpaye ?? 0) - (a.soldeImpaye ?? 0))
      .slice(0, limit);
  }
}
