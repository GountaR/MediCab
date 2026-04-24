import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ADMIN_ROLE_DEFINITIONS,
  AdminRoleDefinition,
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
  cloneAdminUsers
} from '../data/medicab-admin-demo.data';
import { StatusChipComponent } from '../shared/status-chip.component';

type RoleFilter = 'Tous' | AdminUserRole;
type StatusFilter = 'Tous' | AdminUserStatus;

interface UserFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  specialty: string;
  rpps: string;
  password: string;
}

const NEW_USER_FORM: UserFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Réceptionniste',
  status: 'Actif',
  specialty: '',
  rpps: '',
  password: ''
};

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusChipComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPageComponent {
  protected readonly users = signal<AdminUser[]>(cloneAdminUsers());
  protected readonly search = signal('');
  protected readonly roleFilter = signal<RoleFilter>('Tous');
  protected readonly statusFilter = signal<StatusFilter>('Tous');
  protected readonly editorMode = signal<'create' | 'edit' | null>(null);
  protected readonly editingUserId = signal<string | null>(null);
  protected readonly form = signal<UserFormState>({ ...NEW_USER_FORM });
  protected readonly errors = signal<string[]>([]);
  protected readonly confirmToggleId = signal<string | null>(null);
  protected readonly roleDefinitions = ADMIN_ROLE_DEFINITIONS;

  protected readonly filteredUsers = computed(() => {
    const query = this.search().trim().toLowerCase();
    const role = this.roleFilter();
    const status = this.statusFilter();

    return this.users().filter((user) => {
      const matchesQuery =
        query.length === 0 ||
        `${user.firstName} ${user.lastName} ${user.email} ${user.role} ${user.specialty ?? ''}`
          .toLowerCase()
          .includes(query);

      const matchesRole = role === 'Tous' || user.role === role;
      const matchesStatus = status === 'Tous' || user.status === status;

      return matchesQuery && matchesRole && matchesStatus;
    });
  });

  protected readonly summary = computed(() => {
    const users = this.users();

    return {
      total: users.length,
      active: users.filter((user) => user.status === 'Actif').length,
      admins: users.filter((user) => user.role === 'Administrateur').length,
      doctors: users.filter((user) => user.role === 'Médecin').length,
      frontdesk: users.filter((user) => user.role === 'Réceptionniste').length
    };
  });

  protected readonly roleCards = computed(() =>
    this.roleDefinitions.map((role) => {
      const modules = Object.entries(role.permissions);
      const readable = modules.filter(([, permission]) => permission.lire).map(([module]) => module);
      const writable = modules.filter(([, permission]) =>
        permission.creer || permission.modifier || permission.supprimer || permission.exporter
      );

      return {
        ...role,
        readableCount: readable.length,
        writableCount: writable.length,
        highlights: readable.slice(0, 4)
      };
    })
  );

  protected readonly editingUser = computed(() => {
    const id = this.editingUserId();
    return id ? this.users().find((user) => user.id === id) ?? null : null;
  });

  protected readonly roleOptions: Array<RoleFilter> = ['Tous', 'Administrateur', 'Médecin', 'Réceptionniste'];
  protected readonly statusOptions: Array<StatusFilter> = ['Tous', 'Actif', 'Inactif', 'En congé', 'Suspendu'];

  protected openCreate(): void {
    this.editorMode.set('create');
    this.editingUserId.set(null);
    this.form.set({ ...NEW_USER_FORM });
    this.errors.set([]);
  }

  protected openEdit(user: AdminUser): void {
    this.editorMode.set('edit');
    this.editingUserId.set(user.id);
    this.form.set({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone ?? '',
      role: user.role,
      status: user.status,
      specialty: user.specialty ?? '',
      rpps: user.rpps ?? '',
      password: ''
    });
    this.errors.set([]);
  }

  protected closeEditor(): void {
    this.editorMode.set(null);
    this.editingUserId.set(null);
    this.form.set({ ...NEW_USER_FORM });
    this.errors.set([]);
  }

  protected updateForm<K extends keyof UserFormState>(key: K, value: UserFormState[K]): void {
    this.form.update((current) => ({
      ...current,
      [key]: value,
      ...(key === 'role' && value !== 'Médecin'
        ? { specialty: '', rpps: '' }
        : {})
    }));

    if (this.errors().length) {
      this.errors.set([]);
    }
  }

  protected saveUser(): void {
    const form = this.form();
    const errors: string[] = [];

    if (!form.firstName.trim()) {
      errors.push('Le prénom est requis.');
    }

    if (!form.lastName.trim()) {
      errors.push('Le nom est requis.');
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      errors.push('Une adresse email valide est requise.');
    }

    if (this.editorMode() === 'create' && !form.password.trim()) {
      errors.push('Un mot de passe initial est requis pour un nouveau compte.');
    }

    if (form.role === 'Médecin' && !form.rpps.trim()) {
      errors.push('Le RPPS est requis pour un médecin.');
    }

    if (errors.length) {
      this.errors.set(errors);
      return;
    }

    if (this.editorMode() === 'edit' && this.editingUser()) {
      const current = this.editingUser();

      this.users.update((users) =>
        users.map((user) =>
          user.id === current?.id
            ? {
                ...user,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                role: form.role,
                status: form.status,
                specialty: form.role === 'Médecin' ? form.specialty.trim() : undefined,
                rpps: form.role === 'Médecin' ? form.rpps.trim() : undefined
              }
            : user
        )
      );
    } else {
      const initials = `${form.firstName[0] ?? ''}${form.lastName[0] ?? ''}`.toUpperCase();

      this.users.update((users) => [
        {
          id: `u${Date.now()}`,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          status: form.status,
          specialty: form.role === 'Médecin' ? form.specialty.trim() : undefined,
          rpps: form.role === 'Médecin' ? form.rpps.trim() : undefined,
          lastConnection: '—',
          createdAt: '24/04/2026',
          initials,
          color: this.colorForRole(form.role)
        },
        ...users
      ]);
    }

    this.closeEditor();
  }

  protected confirmToggle(userId: string): void {
    this.confirmToggleId.set(userId);
  }

  protected cancelToggle(): void {
    this.confirmToggleId.set(null);
  }

  protected toggleAccount(userId: string): void {
    this.users.update((users) =>
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'Suspendu' ? 'Actif' : 'Suspendu'
            }
          : user
      )
    );

    this.confirmToggleId.set(null);
  }

  protected userTone(status: AdminUserStatus) {
    switch (status) {
      case 'Actif':
        return 'success';
      case 'Suspendu':
        return 'danger';
      case 'En congé':
        return 'warning';
      case 'Inactif':
        return 'neutral';
    }
  }

  protected roleTone(role: AdminUserRole): string {
    switch (role) {
      case 'Administrateur':
        return 'role-pill--admin';
      case 'Médecin':
        return 'role-pill--doctor';
      case 'Réceptionniste':
        return 'role-pill--frontdesk';
    }
  }

  protected accentClass(accent: AdminRoleDefinition['accent']): string {
    switch (accent) {
      case 'rose':
        return 'role-card--admin';
      case 'blue':
        return 'role-card--doctor';
      case 'amber':
        return 'role-card--frontdesk';
    }
  }

  private colorForRole(role: AdminUserRole): string {
    switch (role) {
      case 'Administrateur':
        return '#be185d';
      case 'Médecin':
        return '#1756a8';
      case 'Réceptionniste':
        return '#d97706';
    }
  }
}
