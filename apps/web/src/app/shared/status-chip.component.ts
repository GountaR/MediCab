import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ChipTone } from '../data/medicab-demo.types';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-chip" [ngClass]="toneClass()">
      <span class="status-chip__dot"></span>
      <ng-content></ng-content>
    </span>
  `,
  styles: `
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.42rem;
      padding: 0.36rem 0.72rem;
      border-radius: 999px;
      border: 1px solid transparent;
      font-size: 0.78rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .status-chip__dot {
      width: 0.42rem;
      height: 0.42rem;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.8;
    }

    .status-chip--neutral {
      background: rgba(16, 35, 59, 0.06);
      border-color: rgba(16, 35, 59, 0.08);
      color: #5b6d80;
    }

    .status-chip--info {
      background: rgba(14, 116, 144, 0.1);
      border-color: rgba(14, 116, 144, 0.14);
      color: #0f6f8a;
    }

    .status-chip--accent {
      background: rgba(29, 95, 168, 0.1);
      border-color: rgba(29, 95, 168, 0.14);
      color: #1d5fa8;
    }

    .status-chip--success {
      background: rgba(5, 150, 105, 0.11);
      border-color: rgba(5, 150, 105, 0.15);
      color: #0b7f5d;
    }

    .status-chip--warning {
      background: rgba(217, 119, 6, 0.11);
      border-color: rgba(217, 119, 6, 0.15);
      color: #b26a0f;
    }

    .status-chip--danger {
      background: rgba(220, 38, 38, 0.1);
      border-color: rgba(220, 38, 38, 0.14);
      color: #c33232;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusChipComponent {
  readonly tone = input<ChipTone>('neutral');

  protected readonly toneClass = computed(() => `status-chip--${this.tone()}`);
}
