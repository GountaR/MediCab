import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { WorkspacePageDefinition } from '../app.navigation';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-page.component.html',
  styleUrl: './module-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModulePageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly page = toSignal(
    this.route.data.pipe(map((data) => data['page'] as WorkspacePageDefinition)),
    { initialValue: this.route.snapshot.data['page'] as WorkspacePageDefinition }
  );
}
