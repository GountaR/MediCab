.SHELLFLAGS := -eu -o pipefail -c
SHELL := /bin/bash
.DEFAULT_GOAL := help
export PATH := /opt/homebrew/opt/node@22/bin:$(HOME)/.dotnet:$(PATH)

help:
	@echo "Available targets:"
	@echo "  make doctor   - check local prerequisites"
	@echo "  make db-up    - start PostgreSQL with Docker Compose"
	@echo "  make db-down  - stop PostgreSQL"
	@echo "  make db-logs  - follow PostgreSQL logs"
	@echo "  make web-start - start the Angular app on port 4200"
	@echo "  make api-start - start the .NET API on ports 5080/7080"

doctor:
	@./scripts/dev/doctor.sh

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

db-logs:
	docker compose logs -f postgres

web-start:
	cd apps/web && npm start

api-start:
	cd apps/api/MediCab.Api && dotnet run
