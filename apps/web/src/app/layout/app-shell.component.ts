import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { NAV_SECTIONS, PAGE_BY_PATH, WORKSPACE_PAGES, WorkspacePageDefinition } from '../app.navigation';
import { AppIconComponent } from '../shared/app-icon.component';

function getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
  let current = route;
  while (current.firstChild) {
    current = current.firstChild;
  }
  return current;
}

function getActivePage(route: ActivatedRoute): WorkspacePageDefinition {
  return (getDeepestRoute(route).snapshot.data['page'] as WorkspacePageDefinition) ?? WORKSPACE_PAGES[0];
}

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, AppIconComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formatter = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  protected readonly sections = NAV_SECTIONS;
  protected readonly pages = WORKSPACE_PAGES;
  protected readonly todayLabel = this.formatter.format(new Date());
  protected readonly currentPage = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(null),
      map(() => getActivePage(this.route))
    ),
    { initialValue: getActivePage(this.route) }
  );

  protected pagesForSection(sectionKey: string): WorkspacePageDefinition[] {
    return this.pages.filter((page) => page.section === sectionKey);
  }

  protected isCurrentPath(path: string): boolean {
    return this.currentPage()?.path === path;
  }

  protected readonly pageLookup = PAGE_BY_PATH;
}
