# MediCab - Sprint 4 - Contrats API V1

## Objectif
Ce document fixe la premiere proposition de contrats API pour la V1.

Le principe retenu :
- REST JSON
- prefixe commun ` /api`
- authentification par token cote backend au Sprint 5
- routes alignees sur les modules deja visibles dans Angular
- DTOs pensés pour remplacer progressivement les mocks du Sprint 3

## Regles transverses

### Format des reponses
- succes lecture liste :
  - `items`
  - `page`
  - `pageSize`
  - `total`
- succes lecture detail :
  - objet JSON direct
- succes action :
  - objet mis a jour ou `204 No Content`
- erreur validation :
  - `400`
- erreur authentification :
  - `401`
- erreur autorisation :
  - `403`
- ressource absente :
  - `404`

### Pagination
Parametres standards :
- `page`
- `pageSize`
- `search`
- `sort`
- `direction`

### Conventions d'identifiants
- tous les ids applicatifs exposes sont des `uuid`
- les numeros metier (`dpi`, numero de facture) restent des champs metier et non des ids techniques

## 1. Authentification

### `POST /api/auth/login`
But :
- connecter un utilisateur et retourner le contexte applicatif initial

Request body :
```json
{
  "email": "p.gaillard@medicab.fr",
  "password": "secret"
}
```

Response body :
```json
{
  "accessToken": "jwt-or-session-token",
  "expiresAt": "2026-04-24T20:00:00Z",
  "user": {
    "id": "uuid",
    "firstName": "Pierre",
    "lastName": "Gaillard",
    "email": "p.gaillard@medicab.fr",
    "role": "Administrateur"
  },
  "permissions": [
    "PATIENTS:READ",
    "USERS:UPDATE"
  ]
}
```

### `GET /api/auth/me`
But :
- recuperer l'utilisateur courant et ses permissions

## 2. Tableau de bord

### `GET /api/dashboard/overview`
But :
- alimenter les cartes de synthese du dashboard

Query params :
- `roleScope=reception|doctor|admin`

Response body :
```json
{
  "kpis": {
    "activePatients": 152,
    "appointmentsToday": 18,
    "openInvoices": 6,
    "waitingPatients": 3
  },
  "todayAppointments": [],
  "alerts": [],
  "quickActions": []
}
```

## 3. Patients

### `GET /api/patients`
But :
- liste reception / clinique

Query params utiles :
- `page`
- `pageSize`
- `search`
- `status`
- `doctorId`

Response item :
```json
{
  "id": "uuid",
  "dpi": "DPI-10248",
  "firstName": "Marie",
  "lastName": "Dupont",
  "birthDate": "1968-10-14",
  "phone": "06 00 00 00 00",
  "status": "Actif",
  "primaryDoctorId": "uuid",
  "primaryDoctorName": "Dr. Etienne Renard",
  "lastVisitDate": "2026-04-10",
  "nextAppointmentDate": "2026-05-06",
  "unpaidBalance": 26.50
}
```

### `GET /api/patients/{patientId}`
But :
- fiche detail patient

Response body :
```json
{
  "id": "uuid",
  "dpi": "DPI-10248",
  "firstName": "Marie",
  "lastName": "Dupont",
  "birthDate": "1968-10-14",
  "gender": "Feminin",
  "phone": "06 00 00 00 00",
  "email": "marie.dupont@example.fr",
  "address": "14 rue ...",
  "insuranceName": "MGEN",
  "insuranceMemberNumber": "A12345",
  "primaryDoctor": {
    "id": "uuid",
    "fullName": "Dr. Etienne Renard"
  },
  "status": "Actif",
  "bloodGroup": "A+",
  "allergies": [
    "Penicilline"
  ],
  "tags": [
    "Diabete"
  ],
  "unpaidBalance": 26.50
}
```

### `POST /api/patients`
But :
- creation reception

### `PUT /api/patients/{patientId}`
But :
- edition reception / admin

## 4. Rendez-vous

### `GET /api/appointments`
Query params utiles :
- `date`
- `doctorId`
- `status`
- `search`

Response item :
```json
{
  "id": "uuid",
  "patientId": "uuid",
  "patientName": "Marie Dupont",
  "doctorId": "uuid",
  "doctorName": "Dr. Etienne Renard",
  "scheduledStartAt": "2026-04-24T09:30:00Z",
  "durationMinutes": 30,
  "appointmentType": "Suivi",
  "status": "Planifie",
  "notes": "..."
}
```

### `POST /api/appointments`
### `PUT /api/appointments/{appointmentId}`
### `POST /api/appointments/{appointmentId}/check-in`
But :
- passage du statut a `Accueilli`

### `POST /api/appointments/{appointmentId}/cancel`
Request body :
```json
{
  "reason": "Patient indisponible"
}
```

## 5. Consultations

### `GET /api/consultations`
Query params utiles :
- `doctorId`
- `patientId`
- `status`
- `dateFrom`
- `dateTo`

### `GET /api/consultations/{consultationId}`
Response body :
```json
{
  "id": "uuid",
  "patient": {
    "id": "uuid",
    "fullName": "Marie Dupont"
  },
  "doctor": {
    "id": "uuid",
    "fullName": "Dr. Etienne Renard"
  },
  "appointmentId": "uuid",
  "consultationDate": "2026-04-10",
  "consultationTime": "09:30",
  "consultationType": "Suivi",
  "reason": "Suivi diabete",
  "anamnesis": "...",
  "exam": {
    "weightKg": 76.0,
    "heightCm": 164,
    "bloodPressure": "138/82"
  },
  "primaryDiagnosis": "E11.9 - Diabete type 2",
  "secondaryDiagnoses": [
    "I10 - HTA"
  ],
  "assessment": "...",
  "plan": "...",
  "followUpDate": "2026-07-10",
  "followUpInstructions": "...",
  "status": "Signee",
  "prescriptionId": "uuid"
}
```

### `POST /api/consultations`
### `PUT /api/consultations/{consultationId}`
### `POST /api/consultations/{consultationId}/sign`
But :
- finalisation metier simple de la consultation

## 6. Ordonnances

### `GET /api/prescriptions`
Query params utiles :
- `patientId`
- `doctorId`
- `status`

### `GET /api/prescriptions/{prescriptionId}`
### `POST /api/prescriptions`
### `PUT /api/prescriptions/{prescriptionId}`

Response detail :
```json
{
  "id": "uuid",
  "patientId": "uuid",
  "doctorId": "uuid",
  "consultationId": "uuid",
  "issuedOn": "2026-04-10",
  "expiresOn": "2026-07-10",
  "status": "Active",
  "instructions": "Prendre apres repas",
  "items": [
    {
      "id": "uuid",
      "dci": "Metformine",
      "dosage": "1000 mg",
      "posology": "1 cp matin et soir",
      "route": "Orale",
      "durationLabel": "90 jours",
      "quantityLabel": "180 comprimes",
      "renewalCount": 0,
      "nonSubstitutable": false
    }
  ]
}
```

## 7. Documents

### `GET /api/documents`
Query params utiles :
- `patientId`
- `type`
- `status`

### `GET /api/documents/{documentId}`
### `POST /api/documents`
But :
- creation metadata document
- plus tard : upload associe

### `GET /api/documents/{documentId}/download`
But :
- recuperation du document genere ou importe

## 8. Facturation

### `GET /api/invoices`
Query params utiles :
- `patientId`
- `status`
- `search`
- `dateFrom`
- `dateTo`

Response item :
```json
{
  "id": "uuid",
  "number": "FAC-2026-0894",
  "patientId": "uuid",
  "patientName": "Nathalie Bernard",
  "doctorName": "Dr. Etienne Renard",
  "issuedOn": "2026-04-22",
  "dueOn": "2026-05-07",
  "reason": "Prevention - Bilan annuel",
  "totalAmount": 46.00,
  "paidAmount": 46.00,
  "remainingAmount": 0.00,
  "status": "Reglee",
  "daysLate": 0
}
```

### `GET /api/invoices/{invoiceId}`
### `POST /api/invoices`
### `PUT /api/invoices/{invoiceId}`

### `POST /api/invoices/{invoiceId}/payments`
But :
- enregistrer un encaissement simple sans moyen de paiement

Request body :
```json
{
  "amount": 15.00,
  "paidOn": "2026-04-24",
  "notes": "Reglement partiel"
}
```

Response body :
```json
{
  "invoiceId": "uuid",
  "paidAmount": 15.00,
  "remainingAmount": 11.50,
  "status": "Partielle"
}
```

## 9. Utilisateurs et roles

### `GET /api/users`
Query params utiles :
- `search`
- `role`
- `status`

### `GET /api/users/{userId}`
### `POST /api/users`
### `PUT /api/users/{userId}`

### `POST /api/users/{userId}/suspend`
### `POST /api/users/{userId}/reactivate`

### `GET /api/roles`
But :
- afficher la matrice des roles et permissions

Response item :
```json
{
  "id": "uuid",
  "code": "DOCTOR",
  "name": "Medecin",
  "description": "Acces clinique sur ses patients deja consultes",
  "permissions": [
    "PATIENTS:READ",
    "CONSULTATIONS:CREATE",
    "PRESCRIPTIONS:UPDATE"
  ]
}
```

## 10. Parametres

### `GET /api/settings`
But :
- recuperer les parametres du cabinet

### `PUT /api/settings`
But :
- mise a jour globale ou partielle des parametres V1

Response body :
```json
{
  "clinic": {
    "name": "Cabinet Medical Renard-Marchand"
  },
  "appointments": {
    "defaultDurationMinutes": 30,
    "allowWalkInConsultations": true
  },
  "billing": {
    "autoPrepareInvoice": true,
    "showDebtAlerts": true
  },
  "security": {
    "sessionTimeoutMinutes": 60,
    "forceTwoFactor": false
  }
}
```

## 11. Audit

### `GET /api/audit-logs`
Query params utiles :
- `module`
- `actionType`
- `userId`
- `dateFrom`
- `dateTo`

Response item :
```json
{
  "id": "uuid",
  "occurredAt": "2026-04-24T08:12:00Z",
  "userName": "Pierre Gaillard",
  "actionType": "Connexion",
  "moduleCode": "AUTH",
  "description": "Connexion reussie",
  "ipAddress": "192.168.1.45",
  "isSuccess": true
}
```

## DTOs prioritaires a implementer en premier
- `AuthLoginRequest`
- `AuthSessionDto`
- `PatientListItemDto`
- `PatientDetailDto`
- `CreatePatientRequest`
- `AppointmentListItemDto`
- `CreateAppointmentRequest`
- `ConsultationDetailDto`
- `CreateConsultationRequest`
- `InvoiceListItemDto`
- `RegisterInvoicePaymentRequest`
- `UserListItemDto`
- `CreateUserRequest`
- `SettingsDto`

## Ordre conseille d'implementation au Sprint 5
1. `auth`
2. `users / roles`
3. `patients`
4. `appointments`
5. `consultations`
6. `prescriptions`
7. `documents`
8. `invoices`
9. `settings`
10. `audit`

## Points de vigilance
- ne pas casser la regle de visibilite medecin -> uniquement ses patients deja consultes
- ne pas reintroduire de moyen de paiement detaille dans l'API V1
- garder les reponses assez proches des besoins du front pour remplacer les mocks sans couche d'adaptation lourde
- privilegier des endpoints simples avant d'ouvrir trop tot des workflows avancés
