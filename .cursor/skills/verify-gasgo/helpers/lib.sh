#!/usr/bin/env bash
# Shared paths for verify-gasgo helpers. Source this; do not execute it.

set -euo pipefail

_verify_gasgo_helpers_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GASGO_VERIFY_SKILL_DIR="$(cd "${_verify_gasgo_helpers_dir}/.." && pwd)"
GASGO_VERIFY_REPO_ROOT="$(cd "${GASGO_VERIFY_SKILL_DIR}/../../.." && pwd)"

GASGO_VERIFY_PORT="${GASGO_VERIFY_PORT:-3100}"
GASGO_VERIFY_HOST="${GASGO_VERIFY_HOST:-127.0.0.1}"
GASGO_VERIFY_BASE_URL="${GASGO_VERIFY_BASE_URL:-http://${GASGO_VERIFY_HOST}:${GASGO_VERIFY_PORT}}"
GASGO_VERIFY_RUN_DIR="${GASGO_VERIFY_RUN_DIR:-${GASGO_VERIFY_SKILL_DIR}/.run}"
GASGO_VERIFY_EVIDENCE_DIR="${GASGO_VERIFY_EVIDENCE_DIR:-${GASGO_VERIFY_SKILL_DIR}/evidence}"
GASGO_VERIFY_CDP_PORT="${GASGO_VERIFY_CDP_PORT:-33100}"

GASGO_VERIFY_PID_FILE="${GASGO_VERIFY_RUN_DIR}/next.pid"
GASGO_VERIFY_PORT_FILE="${GASGO_VERIFY_RUN_DIR}/port"
GASGO_VERIFY_URL_FILE="${GASGO_VERIFY_RUN_DIR}/base-url"
GASGO_VERIFY_LOG_FILE="${GASGO_VERIFY_RUN_DIR}/next.log"
GASGO_VERIFY_CHROME_DIR="${GASGO_VERIFY_RUN_DIR}/chrome-profile"
GASGO_VERIFY_CHROME_PID_FILE="${GASGO_VERIFY_RUN_DIR}/chrome.pid"
GASGO_VERIFY_CDP_PORT_FILE="${GASGO_VERIFY_RUN_DIR}/cdp-port"

gasgo_verify_load_run() {
  if [[ -f "${GASGO_VERIFY_PORT_FILE}" ]]; then
    GASGO_VERIFY_PORT="$(tr -d '[:space:]' < "${GASGO_VERIFY_PORT_FILE}")"
  fi
  if [[ -f "${GASGO_VERIFY_URL_FILE}" ]]; then
    GASGO_VERIFY_BASE_URL="$(tr -d '[:space:]' < "${GASGO_VERIFY_URL_FILE}")"
  else
    GASGO_VERIFY_BASE_URL="http://${GASGO_VERIFY_HOST}:${GASGO_VERIFY_PORT}"
  fi
  if [[ -f "${GASGO_VERIFY_CDP_PORT_FILE}" ]]; then
    GASGO_VERIFY_CDP_PORT="$(tr -d '[:space:]' < "${GASGO_VERIFY_CDP_PORT_FILE}")"
  fi
}

gasgo_verify_pid_alive() {
  local pid="$1"
  [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null
}

gasgo_verify_port_busy() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "( sport = :${port} )" 2>/dev/null | grep -q ":${port}"
  else
    python3 - "${port}" <<'PY'
import socket, sys
port = int(sys.argv[1])
s = socket.socket()
s.settimeout(0.3)
try:
    s.connect(("127.0.0.1", port))
except OSError:
    sys.exit(1)
finally:
    s.close()
sys.exit(0)
PY
  fi
}

gasgo_verify_http_code() {
  local url="$1"
  curl -sS -o /dev/null -w "%{http_code}" --max-time 8 "${url}" || true
}

gasgo_verify_descendants() {
  local root="$1"
  python3 - "${root}" <<'PY'
import sys
from pathlib import Path

root = sys.argv[1]
seen = []
queue = [root]
while queue:
    pid = queue.pop(0)
    if pid in seen:
        continue
    seen.append(pid)
    kids = Path(f"/proc/{pid}/task/{pid}/children")
    if kids.is_file():
        text = kids.read_text().strip()
        if text:
            queue.extend(text.split())
print("\n".join(seen))
PY
}

gasgo_verify_kill_tree() {
  local root="$1"
  local pid
  if ! gasgo_verify_pid_alive "${root}"; then
    return 0
  fi
  local pids
  pids="$(gasgo_verify_descendants "${root}" | tr '\n' ' ')"
  # TERM first, then KILL. Never match by process name.
  # shellcheck disable=SC2086
  kill ${pids} 2>/dev/null || true
  sleep 0.4
  for pid in ${pids}; do
    if gasgo_verify_pid_alive "${pid}"; then
      kill -9 "${pid}" 2>/dev/null || true
    fi
  done
}
