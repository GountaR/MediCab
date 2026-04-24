#!/usr/bin/env bash
set -euo pipefail

check_cmd() {
  local label="$1"
  local cmd="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    printf "[ok] %s: %s\n" "$label" "$($cmd --version 2>/dev/null | head -n 1 || true)"
  else
    printf "[missing] %s\n" "$label"
  fi
}

echo "MediCab local environment check"
echo

check_cmd docker docker
check_cmd "node (project runtime)" /opt/homebrew/opt/node@22/bin/node
check_cmd "npm (project runtime)" /opt/homebrew/opt/node@22/bin/npm

if command -v dotnet >/dev/null 2>&1; then
  printf "[ok] dotnet: %s\n" "$(dotnet --version 2>/dev/null | head -n 1 || true)"
elif [[ -x "${HOME}/.dotnet/dotnet" ]]; then
  printf "[ok] dotnet (local): %s\n" "$("${HOME}/.dotnet/dotnet" --version 2>/dev/null | head -n 1 || true)"
else
  printf "[missing] dotnet\n"
fi

echo
if [[ -f .env ]]; then
  echo "[ok] .env present"
else
  echo "[warn] .env missing (copy .env.example to .env)"
fi

if docker compose version >/dev/null 2>&1; then
  echo "[ok] docker compose available"
else
  echo "[missing] docker compose"
fi
