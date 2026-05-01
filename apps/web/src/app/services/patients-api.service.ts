import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { Facture, Medecin, Patient, RendezVous, Specialite, StatutFacture, StatutPatient, StatutRendezVous, TypeRendezVous } from '../data/medicab-demo.types';

interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

interface UserListItemDto {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string | null;
}

interface PatientListItemDto {
  id: string;
  dpi: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  status: string;
  primaryDoctorId?: string | null;
  lastVisitDate?: string | null;
  nextAppointmentAt?: string | null;
  unpaidBalance: number;
}

interface PatientDetailDto {
  id: string;
  dpi: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  phone: string;
  email?: string | null;
  address: string;
  insuranceName?: string | null;
  insuranceMemberNumber?: string | null;
  status: string;
  bloodGroup?: string | null;
  primaryDoctorId?: string | null;
  allergies: string[];
  tags: string[];
  unpaidBalance: number;
  lastVisitDate?: string | null;
  nextAppointmentAt?: string | null;
}

interface AppointmentListItemDto {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledStartAt: string;
  durationMinutes: number;
  appointmentType: string;
  status: string;
  notes?: string | null;
}

interface InvoiceListItemDto {
  id: string;
  number: string;
  patientId: string;
  issuedOn: string;
  dueOn: string;
  reason: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  daysLate: number;
}

export interface PatientsListQuery {
  search?: string;
  status?: StatutPatient;
  doctorId?: string;
  page?: number;
  pageSize?: number;
}

export interface PatientDetailOverview {
  patient: Patient;
  medecins: Medecin[];
  rendezVous: RendezVous[];
  facturesOuvertes: Facture[];
}

@Injectable({ providedIn: 'root' })
export class PatientsApiService {
  private readonly http = inject(HttpClient);

  getDoctors(): Observable<Medecin[]> {
    const params = new HttpParams()
      .set('role', 'Médecin')
      .set('page', '1')
      .set('pageSize', '100');

    return this.http.get<PagedResponse<UserListItemDto>>('/api/users', { params }).pipe(
      map((response) => response.items.map((item) => this.mapDoctor(item)))
    );
  }

  getPatients(query: PatientsListQuery): Observable<PagedResponse<Patient>> {
    let params = new HttpParams()
      .set('page', `${query.page ?? 1}`)
      .set('pageSize', `${query.pageSize ?? 10}`);

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.status) {
      params = params.set('status', query.status);
    }

    if (query.doctorId) {
      params = params.set('doctorId', query.doctorId);
    }

    return this.http.get<PagedResponse<PatientListItemDto>>('/api/patients', { params }).pipe(
      map((response) => ({
        ...response,
        items: response.items.map((item) => this.mapPatientListItem(item))
      }))
    );
  }

  getPatientOverview(patientId: string): Observable<PatientDetailOverview> {
    return forkJoin({
      patient: this.http.get<PatientDetailDto>(`/api/patients/${patientId}`).pipe(map((item) => this.mapPatientDetail(item))),
      medecins: this.getDoctors(),
      rendezVous: this.getPatientAppointments(patientId),
      facturesOuvertes: this.getPatientOpenInvoices(patientId)
    });
  }

  private getPatientAppointments(patientId: string): Observable<RendezVous[]> {
    const params = new HttpParams()
      .set('patientId', patientId)
      .set('page', '1')
      .set('pageSize', '100');

    return this.http.get<PagedResponse<AppointmentListItemDto>>('/api/appointments', { params }).pipe(
      map((response) => response.items.map((item) => this.mapAppointment(item)))
    );
  }

  private getPatientOpenInvoices(patientId: string): Observable<Facture[]> {
    const params = new HttpParams()
      .set('patientId', patientId)
      .set('page', '1')
      .set('pageSize', '100');

    return this.http.get<PagedResponse<InvoiceListItemDto>>('/api/invoices', { params }).pipe(
      map((response) =>
        response.items
          .map((item) => this.mapInvoice(item))
          .filter((item) => item.montantTotal - item.montantRegle > 0)
      )
    );
  }

  private mapDoctor(item: UserListItemDto): Medecin {
    return {
      id: item.id,
      prenom: item.firstName,
      nom: item.lastName,
      specialite: this.toSpecialite(item.specialty),
      couleur: this.getDoctorColor(item.id),
      initiales: `${item.firstName[0] ?? ''}${item.lastName[0] ?? ''}`.toUpperCase()
    };
  }

  private mapPatientListItem(item: PatientListItemDto): Patient {
    return {
      id: item.id,
      dpi: item.dpi,
      prenom: item.firstName,
      nom: item.lastName,
      dateNaissance: this.formatDateOnly(item.birthDate),
      genre: 'Autre',
      telephone: item.phone,
      email: '',
      adresse: '',
      mutuelle: '',
      numeroAdherent: '',
      medecinId: item.primaryDoctorId ?? '',
      statut: item.status as StatutPatient,
      dernierVisite: this.formatOptionalDate(item.lastVisitDate),
      prochainRDV: this.formatOptionalDateTime(item.nextAppointmentAt),
      groupeSanguin: '',
      allergies: [],
      etiquettes: [],
      soldeImpaye: item.unpaidBalance
    };
  }

  private mapPatientDetail(item: PatientDetailDto): Patient {
    return {
      id: item.id,
      dpi: item.dpi,
      prenom: item.firstName,
      nom: item.lastName,
      dateNaissance: this.formatDateOnly(item.birthDate),
      genre: this.toGenre(item.gender),
      telephone: item.phone,
      email: item.email ?? '',
      adresse: item.address,
      mutuelle: item.insuranceName ?? '',
      numeroAdherent: item.insuranceMemberNumber ?? '',
      medecinId: item.primaryDoctorId ?? '',
      statut: item.status as StatutPatient,
      dernierVisite: this.formatOptionalDate(item.lastVisitDate),
      prochainRDV: this.formatOptionalDateTime(item.nextAppointmentAt),
      groupeSanguin: item.bloodGroup ?? '',
      allergies: item.allergies,
      etiquettes: item.tags,
      soldeImpaye: item.unpaidBalance
    };
  }

  private mapAppointment(item: AppointmentListItemDto): RendezVous {
    return {
      id: item.id,
      patientId: item.patientId,
      medecinId: item.doctorId,
      date: this.formatDateTimeDate(item.scheduledStartAt),
      heure: this.formatDateTimeTime(item.scheduledStartAt),
      duree: item.durationMinutes,
      type: item.appointmentType as TypeRendezVous,
      statut: item.status as StatutRendezVous,
      notes: item.notes ?? undefined
    };
  }

  private mapInvoice(item: InvoiceListItemDto): Facture {
    return {
      id: item.id,
      numero: item.number,
      patientId: item.patientId,
      date: this.formatDateOnly(item.issuedOn),
      echeance: this.formatDateOnly(item.dueOn),
      montantTotal: item.totalAmount,
      montantRegle: item.paidAmount,
      statut: item.status as StatutFacture,
      joursRetard: item.daysLate,
      motif: item.reason
    };
  }

  private formatOptionalDate(value?: string | null): string {
    return value ? this.formatDateOnly(value) : '';
  }

  private formatOptionalDateTime(value?: string | null): string | undefined {
    return value ? this.formatDateTimeDate(value) : undefined;
  }

  private formatDateOnly(value: string): string {
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  }

  private formatDateTimeDate(value: string): string {
    const date = new Date(value);
    return `${`${date.getUTCDate()}`.padStart(2, '0')}/${`${date.getUTCMonth() + 1}`.padStart(2, '0')}/${date.getUTCFullYear()}`;
  }

  private formatDateTimeTime(value: string): string {
    const date = new Date(value);
    return `${`${date.getUTCHours()}`.padStart(2, '0')}:${`${date.getUTCMinutes()}`.padStart(2, '0')}`;
  }

  private toSpecialite(value?: string | null): Specialite {
    if (value === 'Cardiologie' || value === 'Pédiatrie') {
      return value;
    }
    return 'Médecine générale';
  }

  private toGenre(value: string): Patient['genre'] {
    if (value === 'Masculin' || value === 'Féminin') {
      return value;
    }
    return 'Autre';
  }

  private getDoctorColor(id: string): string {
    const palette = ['#1756a8', '#7c3aed', '#0d7a5f', '#c2410c', '#b45309'];
    const hash = Array.from(id).reduce((total, char) => total + char.charCodeAt(0), 0);
    return palette[hash % palette.length];
  }
}
