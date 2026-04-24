# MediCab — Cadrage fonctionnel V1

## 1. Objet
`MediCab` est une application de gestion de cabinet medical `desktop-first`, en `francais`, destinee a couvrir la gestion administrative, clinique et operationnelle d'un cabinet unique.

La V1 doit permettre :
- la gestion des patients
- la gestion des rendez-vous
- la saisie des consultations
- la creation d'ordonnances et la gestion de documents
- la facturation simple
- la gestion des utilisateurs, roles et permissions
- la supervision administrative minimale

## 2. Stack cible
- Frontend : `Angular`
- Backend : `.NET`
- Base de donnees : `PostgreSQL`

## 3. Utilisateurs V1
- `Receptionniste`
- `Medecin`
- `Administrateur`

## 4. Regles d'acces
- `Administrateur` : acces global aux modules d'administration, utilisateurs, roles, parametres, audit, supervision facturation
- `Receptionniste` : acces aux patients, rendez-vous, facturation administrative, sans acces clinique sensible
- `Medecin` : acces uniquement a `ses patients`, c'est-a-dire les patients ayant deja eu `au moins une consultation` avec lui

## 5. Modules inclus en V1
- `Authentification`
- `Tableaux de bord`
- `Patients`
- `Rendez-vous`
- `Consultations`
- `Ordonnances`
- `Documents`
- `Facturation`
- `Utilisateurs`
- `Roles et permissions`
- `Parametres`
- `Audit`

## 6. Parcours critiques
### 6.1 Receptionniste
- connexion
- recherche patient
- creation patient
- prise / reprogrammation / annulation de rendez-vous
- accueil patient
- suivi d'impaye

### 6.2 Medecin
- connexion
- vue du jour
- acces dossier patient
- creation consultation
- prescription
- recommandations de suivi

### 6.3 Administrateur
- connexion
- supervision activite
- gestion utilisateurs
- gestion roles
- suivi facturation
- consultation audit

## 7. Entites principales
- `Patient`
- `Utilisateur`
- `Medecin`
- `Role`
- `Permission`
- `RendezVous`
- `Consultation`
- `Diagnostic`
- `Antecedent`
- `ConstantesVitales`
- `TraitementActif`
- `Ordonnance`
- `DocumentMedical`
- `Facture`
- `EntreeAudit`

## 8. Regles metier figees V1
- un patient a `un medecin referent principal`
- un patient peut neanmoins etre consulte par d'autres medecins si necessaire
- une `consultation sans rendez-vous` est autorisee
- une facture est `semi-manuelle` : pre-remplissage possible depuis consultation / rendez-vous, validation finale administrative
- le perimetre V1 couvre `un seul cabinet`
- les documents peuvent etre `generes` par le systeme ou `importes`
- la signature en V1 est une `validation metier simple`, pas une signature electronique reglementaire
- la facturation V1 ne gere pas le `moyen de paiement`, seulement le `montant total`, le `montant paye`, le `reste a payer` et le `statut`
- la matrice RBAC est visible, avec des roles systeme cadres
- les exports V1 sont limites aux modules utiles

## 9. Facturation V1
La facturation V1 est volontairement simple :
- montant total
- montant paye
- reste a payer
- statut de facture
- lien avec patient
- lien eventuel avec rendez-vous / consultation
- suivi des retards et impayes

Pas retenu en V1 :
- moyen de paiement detaille
- workflow avance de tiers payant
- rapprochement assureur
- paiement en ligne

## 10. Documents et clinique
Le volet clinique V1 inclut :
- anamnese
- examen clinique
- diagnostic principal et secondaires
- plan therapeutique
- ordonnance
- recommandations de suivi
- diagnostics actifs
- traitements en cours
- constantes vitales
- documents medicaux

## 11. Hors perimetre V1
- multi-cabinet
- teleconsultation
- application mobile
- SMS / WhatsApp
- e-mails transactionnels avances
- integration laboratoire
- paiement en ligne
- signature electronique reglementaire
- gestion avancee du tiers payant

## 12. Exigences produit et UX
- interface `francaise`
- format date `DD/MM/YYYY`
- heure `24h`
- desktop-first
- ecrans denses mais lisibles
- navigation rapide par role
- composants reutilisables
- etats UI complets : vide, chargement, erreur, succes, aucun resultat, acces refuse

## 13. Exigences techniques de depart
- lancement local simple
- ports figes et documentes
- pas de mot de passe a saisir manuellement pour demarrer
- configuration claire par environnement
- architecture compatible avec front mocke puis branchement API progressif
