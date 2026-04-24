import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AppIconName } from '../app.navigation';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @switch (name()) {
      @case ('dashboard') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5"></rect>
          <rect x="13.5" y="3.5" width="7" height="5" rx="1.5"></rect>
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5"></rect>
          <rect x="13.5" y="10.5" width="7" height="10" rx="1.5"></rect>
        </svg>
      }
      @case ('patients') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <circle cx="9" cy="8" r="3.25"></circle>
          <path d="M3.5 18.2c0-2.7 2.5-4.7 5.5-4.7s5.5 2 5.5 4.7"></path>
          <path d="M16.2 9.2c.9-.9 2.6-.9 3.6 0s1 2.5 0 3.5"></path>
          <path d="M15.8 18.2c.2-1.5 1.5-2.8 3.2-3"></path>
        </svg>
      }
      @case ('calendar') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <rect x="3.5" y="5.5" width="17" height="15" rx="2"></rect>
          <path d="M7 3.8v3.5M17 3.8v3.5M3.5 9.5h17"></path>
          <rect x="7" y="12.5" width="3.5" height="3.5" rx="0.75"></rect>
        </svg>
      }
      @case ('consultations') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <path d="M4.5 12h3.2l1.5-3.5 3.2 7 2.1-4h4"></path>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2"></rect>
        </svg>
      }
      @case ('prescriptions') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <path d="M7.5 7.5a3.7 3.7 0 1 1 5.2 5.2l-5 5a3.7 3.7 0 0 1-5.2-5.2z"></path>
          <path d="M11.3 11.3 16.5 6a3.7 3.7 0 1 1 5.2 5.2l-5.2 5.2"></path>
        </svg>
      }
      @case ('documents') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <path d="M7.5 3.5h6l4 4v13h-10a2 2 0 0 1-2-2z"></path>
          <path d="M13.5 3.5v4h4"></path>
          <path d="M8.5 12h7M8.5 15h7"></path>
        </svg>
      }
      @case ('billing') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <rect x="3.5" y="6.5" width="17" height="11" rx="2"></rect>
          <path d="M3.5 10h17"></path>
          <path d="M8 14.5h2.5"></path>
        </svg>
      }
      @case ('users') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <circle cx="9" cy="8" r="3"></circle>
          <path d="M3.5 18c0-2.5 2.5-4.4 5.5-4.4s5.5 1.9 5.5 4.4"></path>
          <path d="M17 7.5h3.5M18.8 5.8v3.5"></path>
        </svg>
      }
      @case ('settings') {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <circle cx="12" cy="12" r="2.8"></circle>
          <path d="M12 4.2v2.1M12 17.7v2.1M4.2 12h2.1M17.7 12h2.1M6.5 6.5l1.5 1.5M16 16l1.5 1.5M17.5 6.5 16 8M8 16l-1.5 1.5"></path>
        </svg>
      }
      @default {
        <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" aria-hidden="true">
          <circle cx="12" cy="12" r="8"></circle>
        </svg>
      }
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      color: currentColor;
      line-height: 0;
    }

    svg {
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 1.7;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppIconComponent {
  readonly name = input.required<AppIconName>();
  readonly size = input(18);
}
