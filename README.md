# MediCab

MediCab is a desktop-first medical practice management application that will be rebuilt from scratch with Angular, .NET, and PostgreSQL.

The project follows the delivery plan already validated during Sprint 0. The current focus is Sprint 1: repository foundations and a simple local developer experience.

## Current status
- Sprint 0 completed: product scope and V1 cadrage are documented in `MediCab - Cadrage V1.md`
- Sprint 1 in progress: repository structure, local conventions, PostgreSQL local runtime, Angular scaffold, and .NET API scaffold
- The Figma export remains available in `Medical Practice Management Prototype/` as a UX and functional reference only

## Target repository structure
- `apps/web/`: future Angular application
- `apps/api/`: future .NET API
- `docs/`: architecture notes, decisions, and supporting project documentation
- `infra/terraform/`: Terraform modules and environment definitions
- `scripts/dev/`: local developer scripts
- `Medical Practice Management Prototype/`: Figma export kept for reference

## Local development principles
- one repository for the whole project
- fixed and documented ports
- no manual password prompt to start local services
- environment values stored in `.env`
- PostgreSQL available through Docker Compose
- front and backend scaffolding will happen after prerequisites are installed

## Prerequisites
- Docker Desktop with Docker Compose
- Node.js 22 (the repository is pinned in `.nvmrc`)
- npm
- .NET SDK 10

## Quick start for local development
1. Copy the environment file:
   `cp .env.example .env`
2. Check your machine setup:
   `make doctor`
3. Start PostgreSQL:
   `make db-up`
4. Start the API:
   `make api-start`
5. Start the Angular app:
   `make web-start`
6. Stop PostgreSQL:
   `make db-down`

## Local ports
- Angular web app: `4200`
- .NET API HTTP: `5080`
- .NET API HTTPS: `7080`
- PostgreSQL: `54329`

## Local PostgreSQL defaults
- host: `localhost`
- port: `54329`
- database: `medicab`
- username: `medicab`
- password: `medicab_dev`

Example connection string:

`Host=localhost;Port=54329;Database=medicab;Username=medicab;Password=medicab_dev`

## Notes
- The Angular workspace lives in `apps/web`.
- The .NET API lives in `apps/api/MediCab.Api`.
- The repository uses fixed local ports for frontend, backend, and PostgreSQL.
- The frontend dev server is configured to proxy API requests to the backend in local development.
