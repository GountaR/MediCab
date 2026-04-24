import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { formatMontant, getMontantRestant, getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { Facture, StatutFacture } from '../data/medicab-demo.types';
import { StatusChipComponent } from '../shared/status-chip.component';

type FiltreFacturation = 'Non réglées' | 'En retard' | 'Partielle' | 'Envoyée' | 'Réglée' | 'Toutes';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusChipComponent],
  templateUrl: './billing-page.component.html',
  styleUrl: './billing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingPageComponent {
  protected readonly demoStore = inject(MedicabDemoStore);

  protected readonly recherche = signal('');
  protected readonly filtre = signal<FiltreFacturation>('Non réglées');
  protected readonly facturesState = signal<Facture[]>([...this.demoStore.factures()]);
  protected readonly factureSelectionneeId = signal<string | null>(null);
  protected readonly montantPaiement = signal('');
  protected readonly erreurPaiement = signal('');

  protected readonly factureSelectionnee = computed(() => {
    const id = this.factureSelectionneeId();
    return id ? this.facturesState().find((facture) => facture.id === id) ?? null : null;
  });

  protected readonly facturesFiltrees = computed(() => {
    const filtre = this.filtre();
    const recherche = this.recherche().trim().toLowerCase();

    return this.facturesState().filter((facture) => {
      const patient = this.demoStore.getPatient(facture.patientId);
      const correspondRecherche =
        recherche.length === 0 ||
        facture.numero.toLowerCase().includes(recherche) ||
        facture.motif.toLowerCase().includes(recherche) ||
        (patient ? getNomComplet(patient).toLowerCase().includes(recherche) : false);

      const correspondFiltre =
        filtre === 'Toutes'
          ? true
          : filtre === 'Non réglées'
            ? ['En retard', 'Partielle', 'Envoyée'].includes(facture.statut)
            : facture.statut === filtre;

      return correspondRecherche && correspondFiltre;
    });
  });

  protected readonly synthese = computed(() => {
    const factures = this.facturesState();
    const enRetard = factures.filter((facture) => facture.statut === 'En retard');
    const partielles = factures.filter((facture) => facture.statut === 'Partielle');
    const envoyees = factures.filter((facture) => facture.statut === 'Envoyée');
    const reglees = factures.filter((facture) => facture.statut === 'Réglée');

    return {
      enRetard,
      partielles,
      envoyees,
      totalOuvert: formatMontant(
        [...enRetard, ...partielles, ...envoyees].reduce((somme, facture) => somme + getMontantRestant(facture), 0)
      ),
      totalRetard: formatMontant(enRetard.reduce((somme, facture) => somme + getMontantRestant(facture), 0)),
      totalPartiel: formatMontant(partielles.reduce((somme, facture) => somme + getMontantRestant(facture), 0)),
      totalRegle: formatMontant(reglees.reduce((somme, facture) => somme + facture.montantTotal, 0))
    };
  });

  protected readonly boutonsFiltre = computed(() => {
    const synthese = this.synthese();
    const factures = this.facturesState();

    return [
      { key: 'Non réglées' as const, label: 'Non réglées', count: synthese.enRetard.length + synthese.partielles.length + synthese.envoyees.length, urgent: true },
      { key: 'En retard' as const, label: 'En retard', count: synthese.enRetard.length, urgent: true },
      { key: 'Partielle' as const, label: 'Partielle', count: synthese.partielles.length, urgent: false },
      { key: 'Envoyée' as const, label: 'Envoyée', count: synthese.envoyees.length, urgent: false },
      { key: 'Réglée' as const, label: 'Réglée', count: factures.filter((facture) => facture.statut === 'Réglée').length, urgent: false },
      { key: 'Toutes' as const, label: 'Toutes', count: factures.length, urgent: false }
    ];
  });

  protected readonly lignes = computed(() =>
    this.facturesFiltrees().map((facture) => ({
      facture,
      patient: this.demoStore.getPatient(facture.patientId),
      restant: getMontantRestant(facture)
    }))
  );

  protected factureTone(statut: StatutFacture) {
    switch (statut) {
      case 'En retard':
        return 'danger';
      case 'Partielle':
        return 'warning';
      case 'Envoyée':
        return 'accent';
      case 'Réglée':
        return 'success';
      default:
        return 'neutral';
    }
  }

  protected ouvrirPaiement(facture: Facture): void {
    this.factureSelectionneeId.set(facture.id);
    this.montantPaiement.set(getMontantRestant(facture).toFixed(2).replace('.', ','));
    this.erreurPaiement.set('');
  }

  protected fermerPaiement(): void {
    this.factureSelectionneeId.set(null);
    this.montantPaiement.set('');
    this.erreurPaiement.set('');
  }

  protected renseignerTotalRestant(): void {
    const facture = this.factureSelectionnee();
    if (!facture) {
      return;
    }

    this.montantPaiement.set(getMontantRestant(facture).toFixed(2).replace('.', ','));
    this.erreurPaiement.set('');
  }

  protected validerPaiement(): void {
    const facture = this.factureSelectionnee();
    if (!facture) {
      return;
    }

    const montant = Number.parseFloat(this.montantPaiement().replace(',', '.'));
    const restant = getMontantRestant(facture);

    if (Number.isNaN(montant) || montant <= 0) {
      this.erreurPaiement.set('Le montant saisi est invalide.');
      return;
    }

    if (montant > restant) {
      this.erreurPaiement.set(`Le montant ne peut pas dépasser ${formatMontant(restant)}.`);
      return;
    }

    this.facturesState.update((factures) =>
      factures.map((item) => {
        if (item.id !== facture.id) {
          return item;
        }

        const montantRegle = item.montantRegle + montant;
        const statut: StatutFacture = montantRegle >= item.montantTotal ? 'Réglée' : 'Partielle';

        return {
          ...item,
          montantRegle,
          statut
        };
      })
    );

    this.fermerPaiement();
  }

  protected readonly formatMontant = formatMontant;
}
