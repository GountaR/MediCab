import { Routes } from '@angular/router';

import { AppShellComponent } from './layout/app-shell.component';
import { PAGE_BY_PATH } from './app.navigation';
import { DashboardPageComponent } from './pages/dashboard-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { ModulePageComponent } from './pages/module-page.component';

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
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['patients'] }
      },
      {
        path: 'rendez-vous',
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['rendez-vous'] }
      },
      {
        path: 'consultations',
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['consultations'] }
      },
      {
        path: 'ordonnances',
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['ordonnances'] }
      },
      {
        path: 'documents',
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['documents'] }
      },
      {
        path: 'facturation',
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['facturation'] }
      },
      {
        path: 'utilisateurs',
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['utilisateurs'] }
      },
      {
        path: 'parametres',
        component: ModulePageComponent,
        data: { page: PAGE_BY_PATH['parametres'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'tableau-de-bord'
  }
];
