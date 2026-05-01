#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${REPO_ROOT}"

stop_listener_on_port() {
  local name="$1"
  local port="$2"
  local pids

  pids="$(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null | sort -u || true)"

  if [[ -z "${pids}" ]]; then
    echo "[stop] ${name}: no listener on port ${port}"
    return 0
  fi

  echo "[stop] ${name}: stopping listener(s) on port ${port}: ${pids}"
  while IFS= read -r pid; do
    [[ -n "${pid}" ]] || continue
    kill -TERM "${pid}" 2>/dev/null || true
  done <<< "${pids}"

  for _ in {1..20}; do
    sleep 0.25
    if ! lsof -tiTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "[stop] ${name}: stopped gracefully"
      return 0
    fi
  done

  pids="$(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null | sort -u || true)"
  if [[ -n "${pids}" ]]; then
    echo "[stop] ${name}: forcing remaining listener(s) on port ${port}: ${pids}"
    while IFS= read -r pid; do
      [[ -n "${pid}" ]] || continue
      kill -KILL "${pid}" 2>/dev/null || true
    done <<< "${pids}"
  fi
}

verify_port_stopped() {
  local name="$1"
  local port="$2"

  if lsof -tiTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "[stop] ${name}: still listening on port ${port}"
    return 1
  fi

  echo "[stop] ${name}: confirmed stopped on port ${port}"
}

echo "[stop] MediCab shutdown sequence started"
echo "[stop] order: frontend -> API -> PostgreSQL"

stop_listener_on_port "Angular frontend" "4200"
stop_listener_on_port ".NET API (HTTP)" "5080"
stop_listener_on_port ".NET API (HTTPS)" "7080"

if command -v docker >/dev/null 2>&1; then
  echo "[stop] PostgreSQL: stopping Docker Compose services"
  docker compose down --remove-orphans
else
  echo "[stop] PostgreSQL: docker not available, skipping compose down"
fi

verify_port_stopped "Angular frontend" "4200"
verify_port_stopped ".NET API (HTTP)" "5080"
verify_port_stopped ".NET API (HTTPS)" "7080"
verify_port_stopped "PostgreSQL" "54329"

echo "[stop] MediCab shutdown complete"
