import { Routes } from '@angular/router';

import { PAGE_BY_PATH } from './app.navigation';
import { AppShellComponent } from './layout/app-shell.component';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { AppointmentsPageComponent } from './pages/appointments-page.component';
import { BillingPageComponent } from './pages/billing-page.component';
import { ConsultationsPageComponent } from './pages/consultations-page.component';
import { DocumentsPageComponent } from './pages/documents-page.component';
import { PatientDetailPageComponent } from './pages/patient-detail-page.component';
import { PatientsPageComponent } from './pages/patients-page.component';
import { PrescriptionsPageComponent } from './pages/prescriptions-page.component';
import { SettingsPageComponent } from './pages/settings-page.component';
import { UsersPageComponent } from './pages/users-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tableau-de-bord' },
      {
        path: 'tableau-de-bord',
        component: DashboardPageComponent,
        data: { page: PAGE_BY_PATH['tableau-de-bord'] }
      },
      {
        path: 'patients',
        component: PatientsPageComponent,
        data: { page: PAGE_BY_PATH['patients'] }
      },
      {
        path: 'patients/:id',
        component: PatientDetailPageComponent,
        data: { page: PAGE_BY_PATH['patients'] }
      },
      {
        path: 'rendez-vous',
        component: AppointmentsPageComponent,
        data: { page: PAGE_BY_PATH['rendez-vous'] }
      },
      {
        path: 'consultations',
        component: ConsultationsPageComponent,
        data: { page: PAGE_BY_PATH['consultations'] }
      },
      {
        path: 'ordonnances',
        component: PrescriptionsPageComponent,
        data: { page: PAGE_BY_PATH['ordonnances'] }
      },
      {
        path: 'documents',
        component: DocumentsPageComponent,
        data: { page: PAGE_BY_PATH['documents'] }
      },
      {
        path: 'facturation',
        component: BillingPageComponent,
        data: { page: PAGE_BY_PATH['facturation'] }
      },
      {
        path: 'utilisateurs',
        component: UsersPageComponent,
        data: { page: PAGE_BY_PATH['utilisateurs'] }
      },
      {
        path: 'parametres',
        component: SettingsPageComponent,
        data: { page: PAGE_BY_PATH['parametres'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'tableau-de-bord'
  }
];
