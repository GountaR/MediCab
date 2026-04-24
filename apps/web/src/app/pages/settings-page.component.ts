import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  SettingsSectionId,
  SettingsState,
  SETTINGS_SECTIONS,
  createSettingsState
} from '../data/medicab-admin-demo.data';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  protected readonly sections = SETTINGS_SECTIONS;
  protected readonly section = signal<SettingsSectionId>('cabinet');
  protected readonly settings = signal<SettingsState>(createSettingsState());
  protected readonly savedSnapshot = signal<SettingsState>(createSettingsState());
  protected readonly saveState = signal<'idle' | 'saved'>('idle');
  protected readonly newAppointmentType = signal('');

  protected readonly activeSection = computed(
    () => this.sections.find((item) => item.id === this.section()) ?? this.sections[0]
  );

  protected readonly dirty = computed(
    () => JSON.stringify(this.settings()) !== JSON.stringify(this.savedSnapshot())
  );

  protected readonly summary = computed(() => {
    const state = this.settings();
    const openDays = state.cabinet.hours.filter((slot) => slot.open).length;

    return {
      openDays,
      reminder: `${state.rendezVous.emailReminderHours} h`,
      security:
        state.security.forceTwoFactor ? '2FA obligatoire' : `Session ${state.security.sessionTimeoutMinutes} min`
    };
  });

  protected setSection(sectionId: SettingsSectionId): void {
    this.section.set(sectionId);
  }

  protected save(): void {
    this.savedSnapshot.set(this.cloneSettings(this.settings()));
    this.saveState.set('saved');
  }

  protected reset(): void {
    this.settings.set(this.cloneSettings(this.savedSnapshot()));
    this.saveState.set('idle');
    this.newAppointmentType.set('');
  }

  protected updateCabinetField<K extends keyof SettingsState['cabinet']>(
    key: K,
    value: SettingsState['cabinet'][K]
  ): void {
    this.settings.update((state) => ({
      ...state,
      cabinet: {
        ...state.cabinet,
        [key]: value
      }
    }));
    this.saveState.set('idle');
  }

  protected updateHours(index: number, key: 'open' | 'start' | 'end', value: boolean | string): void {
    this.settings.update((state) => ({
      ...state,
      cabinet: {
        ...state.cabinet,
        hours: state.cabinet.hours.map((slot, slotIndex) =>
          slotIndex === index
            ? {
                ...slot,
                [key]: value
              }
            : slot
        )
      }
    }));
    this.saveState.set('idle');
  }

  protected updateAppointmentField<K extends keyof SettingsState['rendezVous']>(
    key: K,
    value: SettingsState['rendezVous'][K]
  ): void {
    this.settings.update((state) => ({
      ...state,
      rendezVous: {
        ...state.rendezVous,
        [key]: value
      }
    }));
    this.saveState.set('idle');
  }

  protected addAppointmentType(): void {
    const label = this.newAppointmentType().trim();

    if (!label.length || this.settings().rendezVous.appointmentTypes.includes(label)) {
      return;
    }

    this.settings.update((state) => ({
      ...state,
      rendezVous: {
        ...state.rendezVous,
        appointmentTypes: [...state.rendezVous.appointmentTypes, label]
      }
    }));

    this.newAppointmentType.set('');
    this.saveState.set('idle');
  }

  protected removeAppointmentType(label: string): void {
    this.settings.update((state) => ({
      ...state,
      rendezVous: {
        ...state.rendezVous,
        appointmentTypes: state.rendezVous.appointmentTypes.filter((item) => item !== label)
      }
    }));
    this.saveState.set('idle');
  }

  protected updateBillingField<K extends keyof SettingsState['facturation']>(
    key: K,
    value: SettingsState['facturation'][K]
  ): void {
    this.settings.update((state) => ({
      ...state,
      facturation: {
        ...state.facturation,
        [key]: value
      }
    }));
    this.saveState.set('idle');
  }

  protected updateNotification<K extends keyof SettingsState['notifications']>(key: K, value: boolean): void {
    this.settings.update((state) => ({
      ...state,
      notifications: {
        ...state.notifications,
        [key]: value
      }
    }));
    this.saveState.set('idle');
  }

  protected updateSecurityField<K extends keyof SettingsState['security']>(
    key: K,
    value: SettingsState['security'][K]
  ): void {
    this.settings.update((state) => ({
      ...state,
      security: {
        ...state.security,
        [key]: value
      }
    }));
    this.saveState.set('idle');
  }

  private cloneSettings(source: SettingsState): SettingsState {
    return {
      cabinet: {
        ...source.cabinet,
        hours: source.cabinet.hours.map((slot) => ({ ...slot }))
      },
      rendezVous: {
        ...source.rendezVous,
        appointmentTypes: [...source.rendezVous.appointmentTypes]
      },
      facturation: { ...source.facturation },
      notifications: { ...source.notifications },
      security: { ...source.security }
    };
  }
}
