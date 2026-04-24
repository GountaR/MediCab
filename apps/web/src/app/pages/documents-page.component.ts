import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { getNomComplet } from '../data/medicab-demo.data';
import { MedicabDemoStore } from '../data/medicab-demo.store';
import { CategorieDocument, StatutDocument, getDocumentsForDoctor } from '../data/medicab-clinical-demo.data';
import { StatusChipComponent } from '../shared/status-chip.component';

const MEDECIN_ACTIF_ID = 'm01';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [FormsModule, RouterLink, StatusChipComponent],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsPageComponent {
  protected readonly demoStore = inject(MedicabDemoStore);
  protected readonly search = signal('');
  protected readonly categoryFilter = signal<'Tous' | CategorieDocument>('Tous');
  protected readonly categories: Array<'Tous' | CategorieDocument> = ['Tous', 'Analyse', 'Imagerie', 'Compte-rendu', 'Courrier', 'Ordonnance'];
  protected readonly documents = getDocumentsForDoctor(MEDECIN_ACTIF_ID);

  protected readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    const category = this.categoryFilter();

    return this.documents.filter((document) => {
      const patient = this.demoStore.getPatient(document.patientId);
      const matchesQuery =
        query.length === 0 ||
        document.titre.toLowerCase().includes(query) ||
        (document.sousTitre?.toLowerCase().includes(query) ?? false) ||
        (patient ? getNomComplet(patient).toLowerCase().includes(query) : false);

      const matchesCategory = category === 'Tous' ? true : document.type === category;
      return matchesQuery && matchesCategory;
    });
  });

  protected readonly stats = computed(() => ({
    total: this.documents.length,
    anormaux: this.documents.filter((document) => document.statut === 'Anormal' || document.statut === 'Critique').length,
    enAttente: this.documents.filter((document) => document.statut === 'En attente').length
  }));

  protected documentTone(statut: StatutDocument) {
    switch (statut) {
      case 'Normal':
        return 'success';
      case 'Anormal':
        return 'warning';
      case 'Critique':
        return 'danger';
      case 'En attente':
        return 'accent';
      default:
        return 'neutral';
    }
  }

  protected categoryTone(categorie: CategorieDocument) {
    switch (categorie) {
      case 'Analyse':
        return 'accent';
      case 'Imagerie':
        return 'warning';
      case 'Compte-rendu':
        return 'neutral';
      case 'Courrier':
        return 'info';
      case 'Ordonnance':
        return 'success';
      default:
        return 'neutral';
    }
  }

  protected readonly getNomComplet = getNomComplet;
}
