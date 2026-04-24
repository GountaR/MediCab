import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NAV_SECTIONS, WORKSPACE_PAGES } from '../app.navigation';
import { AppIconComponent } from '../shared/app-icon.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, AppIconComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  protected readonly metrics = [
    { label: 'Patients actifs', value: '152', detail: 'Socle repris du prototype Figma' },
    { label: 'Rendez-vous du jour', value: '18', detail: 'Planning réception + clinique' },
    { label: 'Impayés à surveiller', value: '4', detail: 'Facturation simple en V1' },
    { label: 'Rôles système', value: '3', detail: 'Réception, médecin, admin' }
  ];

  protected readonly roleSpaces = [
    {
      title: 'Réceptionniste',
      description: 'Accueil patient, agenda, check-in, création rapide et suivi d’impayés.'
    },
    {
      title: 'Médecin',
      description: 'Consultation structurée, diagnostic, ordonnances et suivi patient.'
    },
    {
      title: 'Administrateur',
      description: 'Supervision, utilisateurs, rôles, paramètres et audit.'
    }
  ];

  protected readonly sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: WORKSPACE_PAGES.filter((page) => page.section === section.key)
  }));
}
