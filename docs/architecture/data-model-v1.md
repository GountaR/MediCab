# MediCab - Sprint 4 - Modele de donnees V1

## Objectif
Ce document formalise le premier modele de donnees PostgreSQL de MediCab a partir :
- du cadrage V1
- du front Angular mocke stabilise au Sprint 3
- des regles metier deja validees

Le but n'est pas encore d'ecrire les migrations, mais de fixer une base propre pour :
- la conception de la base PostgreSQL
- les contrats API du Sprint 4
- l'implementation .NET du Sprint 5

## Principes de modelisation
- base `PostgreSQL`
- noms de tables en `snake_case`
- identifiants techniques en `uuid`
- horodatages techniques en `timestamptz` UTC
- statuts metier stockes en `text` avec validation applicative puis contraintes SQL
- un seul cabinet en V1
- un utilisateur a un seul role systeme en V1
- la visibilite medecin -> patient est derivee des consultations existantes, pas d'une table dediee en V1

## Noyau metier V1

### 1. Cabinet et parametres

#### `clinic`
Une seule ligne en V1.

Colonnes principales :
- `id`
- `name`
- `address_line_1`
- `address_line_2`
- `postal_code`
- `city`
- `phone`
- `email`
- `website`
- `siret`
- `rpps`
- `created_at`
- `updated_at`

#### `clinic_schedule`
Horaires d'ouverture par jour.

Colonnes principales :
- `id`
- `clinic_id`
- `day_of_week`
- `is_open`
- `start_time`
- `end_time`

#### `clinic_settings`
Parametres fonctionnels transverses.

Colonnes principales :
- `clinic_id`
- `default_appointment_duration_minutes`
- `new_patient_duration_minutes`
- `procedure_duration_minutes`
- `email_reminder_hours`
- `allow_walk_in_consultations`
- `auto_prepare_invoice`
- `show_debt_alerts`
- `payment_delay_days`
- `overdue_reminder_days`
- `min_password_length`
- `session_timeout_minutes`
- `force_two_factor`
- `audit_connections`
- `backup_frequency`
- `backup_retention_days`
- `created_at`
- `updated_at`

### 2. Utilisateurs et securite

#### `roles`
Roles systeme V1.

Colonnes principales :
- `id`
- `code` (`ADMIN`, `DOCTOR`, `RECEPTION`)
- `name`
- `description`
- `is_system`
- `created_at`
- `updated_at`

#### `permissions`
Catalogue des permissions.

Colonnes principales :
- `id`
- `module_code`
- `action_code`
- `label`

Exemples :
- `PATIENTS:READ`
- `PATIENTS:CREATE`
- `APPOINTMENTS:UPDATE`
- `INVOICES:EXPORT`

#### `role_permissions`
Matrice RBAC.

Colonnes principales :
- `role_id`
- `permission_id`
- `created_at`

#### `users`
Tous les comptes applicatifs.

Colonnes principales :
- `id`
- `clinic_id`
- `role_id`
- `first_name`
- `last_name`
- `email`
- `phone`
- `password_hash`
- `status` (`Actif`, `Inactif`, `En conge`, `Suspendu`)
- `last_login_at`
- `must_change_password`
- `created_at`
- `updated_at`

Contraintes :
- `email` unique par cabinet

#### `doctor_profiles`
Extension du compte utilisateur pour les medecins.

Colonnes principales :
- `user_id`
- `specialty`
- `rpps`
- `display_color`
- `created_at`
- `updated_at`

Contraintes :
- `user_id` unique
- `rpps` unique si renseigne

### 3. Patients

#### `patients`
Fiche administrative centrale.

Colonnes principales :
- `id`
- `clinic_id`
- `dpi`
- `first_name`
- `last_name`
- `birth_date`
- `gender`
- `phone`
- `email`
- `address`
- `insurance_name`
- `insurance_member_number`
- `primary_doctor_user_id`
- `status` (`Actif`, `Inactif`, `En attente`, `Decede`)
- `blood_group`
- `created_at`
- `updated_at`

Contraintes :
- `dpi` unique par cabinet

#### `patient_allergies`
Allergies structurees.

Colonnes principales :
- `id`
- `patient_id`
- `label`
- `notes`

#### `patient_tags`
Etiquettes UI / segmentation.

Colonnes principales :
- `id`
- `patient_id`
- `label`

### 4. Rendez-vous

#### `appointments`
Planning reception + medecins.

Colonnes principales :
- `id`
- `clinic_id`
- `patient_id`
- `doctor_user_id`
- `scheduled_start_at`
- `duration_minutes`
- `appointment_type`
- `status` (`Planifie`, `Accueilli`, `En consultation`, `Termine`, `Annule`, `Absent`)
- `notes`
- `cancellation_reason`
- `created_by_user_id`
- `created_at`
- `updated_at`

Notes :
- une consultation sans rendez-vous reste autorisee : `consultations.appointment_id` pourra donc etre nul

### 5. Clinique

#### `consultations`
Acte clinique principal.

Colonnes principales :
- `id`
- `clinic_id`
- `patient_id`
- `doctor_user_id`
- `appointment_id` nullable
- `consultation_date`
- `consultation_time`
- `consultation_type`
- `reason`
- `anamnesis`
- `assessment`
- `plan`
- `follow_up_date`
- `follow_up_instructions`
- `status` (`Brouillon`, `Finalisee`, `Signee`)
- `signed_at` nullable
- `created_at`
- `updated_at`

#### `consultation_exams`
Examen clinique structure.

Colonnes principales :
- `consultation_id`
- `weight_kg`
- `height_cm`
- `blood_pressure`
- `heart_rate`
- `temperature_c`
- `spo2`
- `cardiovascular`
- `respiratory`
- `abdomen`
- `neurological`
- `orl`
- `other_notes`

#### `patient_diagnoses`
Problemes / diagnostics suivis dans le temps.

Colonnes principales :
- `id`
- `patient_id`
- `consultation_id` nullable
- `icd10_code`
- `label`
- `status` (`Actif`, `Resolu`, `Chronique`, `Suspecte`)
- `started_on`
- `notes`
- `created_at`

#### `consultation_secondary_diagnoses`
Diagnostics secondaires saisis pour une consultation.

Colonnes principales :
- `id`
- `consultation_id`
- `label`

#### `vital_signs`
Historique des constantes vitales.

Colonnes principales :
- `id`
- `patient_id`
- `consultation_id` nullable
- `measured_at`
- `weight_kg`
- `height_cm`
- `blood_pressure`
- `heart_rate`
- `temperature_c`
- `spo2`

#### `active_treatments`
Traitements en cours / historiques simples.

Colonnes principales :
- `id`
- `patient_id`
- `prescriber_user_id`
- `consultation_id` nullable
- `dci`
- `brand_name`
- `dosage`
- `posology`
- `route`
- `started_on`
- `status` (`Actif`, `Termine`, `Suspendu`, `Inconnu`)
- `non_substitutable`
- `notes`

### 6. Ordonnances et documents

#### `prescriptions`
Ordonnances.

Colonnes principales :
- `id`
- `clinic_id`
- `patient_id`
- `doctor_user_id`
- `consultation_id` nullable
- `issued_on`
- `expires_on`
- `status` (`Active`, `Expiree`, `Annulee`, `Renouvelee`)
- `instructions`
- `created_at`
- `updated_at`

#### `prescription_items`
Lignes medicamenteuses d'une ordonnance.

Colonnes principales :
- `id`
- `prescription_id`
- `dci`
- `brand_name`
- `dosage`
- `posology`
- `route`
- `duration_label`
- `quantity_label`
- `renewal_count`
- `non_substitutable`
- `instructions`

#### `medical_documents`
Documents importes ou generes.

Colonnes principales :
- `id`
- `clinic_id`
- `patient_id`
- `doctor_user_id` nullable
- `consultation_id` nullable
- `document_type` (`Analyse`, `Imagerie`, `Compte-rendu`, `Courrier`, `Ordonnance`)
- `status` (`Normal`, `Anormal`, `Critique`, `En attente`)
- `title`
- `subtitle`
- `summary`
- `storage_kind` (`generated`, `uploaded`)
- `storage_path`
- `mime_type`
- `size_bytes`
- `created_at`

### 7. Facturation

#### `invoices`
Factures V1.

Colonnes principales :
- `id`
- `clinic_id`
- `number`
- `patient_id`
- `doctor_user_id` nullable
- `appointment_id` nullable
- `consultation_id` nullable
- `issued_on`
- `due_on`
- `reason`
- `total_amount`
- `paid_amount`
- `status` (`Brouillon`, `Envoyee`, `Reglee`, `En retard`, `Partielle`, `Annulee`)
- `created_by_user_id`
- `validated_by_user_id` nullable
- `created_at`
- `updated_at`

Contraintes :
- `number` unique par cabinet
- `paid_amount <= total_amount`

#### `invoice_payments`
Trace minimale des encaissements.

Colonnes principales :
- `id`
- `invoice_id`
- `amount`
- `paid_on`
- `recorded_by_user_id`
- `notes`
- `created_at`

Note :
- on ne stocke pas le moyen de paiement en V1

### 8. Audit

#### `audit_logs`
Journal d'audit minimal.

Colonnes principales :
- `id`
- `clinic_id`
- `user_id` nullable
- `action_type`
- `module_code`
- `entity_type`
- `entity_id`
- `description`
- `ip_address`
- `is_success`
- `occurred_at`

## Relations clefs
- `clinic` 1 -> n `users`
- `clinic` 1 -> n `patients`
- `users` n -> 1 `roles`
- `users` 1 -> 0..1 `doctor_profiles`
- `patients` n -> 1 `users` via `primary_doctor_user_id`
- `appointments` n -> 1 `patients`
- `appointments` n -> 1 `users` via `doctor_user_id`
- `consultations` n -> 1 `patients`
- `consultations` n -> 1 `users` via `doctor_user_id`
- `consultations` 0..1 -> 1 `appointments`
- `prescriptions` n -> 1 `consultations` possible
- `medical_documents` n -> 1 `patients`
- `invoices` n -> 1 `patients`
- `invoice_payments` n -> 1 `invoices`

## Index prioritaires

### Patients
- index unique `(clinic_id, dpi)`
- index `(clinic_id, last_name, first_name)`
- index `(primary_doctor_user_id, status)`

### Rendez-vous
- index `(doctor_user_id, scheduled_start_at)`
- index `(patient_id, scheduled_start_at desc)`
- index `(status, scheduled_start_at)`

### Consultations
- index `(doctor_user_id, consultation_date desc)`
- index `(patient_id, consultation_date desc)`
- index `(appointment_id)`

### Facturation
- index unique `(clinic_id, number)`
- index `(patient_id, status)`
- index `(status, due_on)`

### Audit
- index `(occurred_at desc)`
- index `(module_code, occurred_at desc)`
- index `(user_id, occurred_at desc)`

## Regles de conception a conserver au Sprint 5
- la visibilite medecin -> patient sera calculee via les consultations
- la facturation reste simple : pas de mode de paiement, seulement des encaissements montants
- les roles systeme existent en base, mais la V1 garde 3 roles standards
- les documents doivent supporter les contenus generes et importes
- l'audit doit couvrir au minimum : connexion, creation, modification, suppression, export, acces refuse

## Implementation technique conseillee
- `uuid` genere cote base avec `gen_random_uuid()`
- montants en `numeric(12,2)`
- dates metier en `date`
- heures metier en `time` ou `timestamptz` selon usage ; pour les rendez-vous, preferer `scheduled_start_at timestamptz`
- fichiers documents hors base, metadata en base

## Points a traduire ensuite en migrations
- creation des tables et contraintes
- jeux de donnees de seed pour dev
- indexes
- vues ou requetes de projection pour le tableau de bord
