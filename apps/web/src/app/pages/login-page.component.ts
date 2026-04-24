import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  protected readonly roleCards = [
    {
      title: 'Réceptionniste',
      description: 'Accueil patient, planning, check-in et suivi facturation simple.'
    },
    {
      title: 'Médecin',
      description: 'Consultation, ordonnances, documents et suivi clinique.'
    },
    {
      title: 'Administrateur',
      description: 'Utilisateurs, permissions, paramètres et pilotage global.'
    }
  ];
}
