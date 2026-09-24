#!/usr/bin/env bash
# Start an isolated Next.js instance for GasGo verification.
# Usage (from repo root or anywhere):
#   .cursor/skills/verify-gasgo/helpers/launch.sh
# Optional env: GASGO_VERIFY_PORT (default 3100), GASGO_VERIFY_HOST (default 127.0.0.1)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib.sh"

mkdir -p "${GASGO_VERIFY_RUN_DIR}" "${GASGO_VERIFY_EVIDENCE_DIR}"

if [[ -f "${GASGO_VERIFY_PID_FILE}" ]]; then
  existing="$(tr -d '[:space:]' < "${GASGO_VERIFY_PID_FILE}")"
  gasgo_verify_load_run
  if gasgo_verify_pid_alive "${existing}" && [[ "$(gasgo_verify_http_code "${GASGO_VERIFY_BASE_URL}/")" == "200" ]]; then
    echo "already-running pid=${existing} url=${GASGO_VERIFY_BASE_URL}"
    echo "Reuse this instance or run helpers/cleanup.sh first. Do not drive :3000 if that is someone else's session."
    exit 0
  fi
  echo "stale run dir; removing leftover pid ${existing:-none}"
  if [[ -n "${existing}" ]]; then
    gasgo_verify_kill_tree "${existing}"
  fi
  rm -f "${GASGO_VERIFY_PID_FILE}" "${GASGO_VERIFY_PORT_FILE}" "${GASGO_VERIFY_URL_FILE}"
fi

if gasgo_verify_port_busy "${GASGO_VERIFY_PORT}"; then
  echo "refusing to launch: port ${GASGO_VERIFY_PORT} is already bound." >&2
  echo "Pick another GASGO_VERIFY_PORT or stop the owner of that port. Do not steal :3000." >&2
  exit 2
fi

if [[ ! -d "${GASGO_VERIFY_REPO_ROOT}/node_modules" ]]; then
  echo "node_modules missing; running npm ci in ${GASGO_VERIFY_REPO_ROOT}"
  (cd "${GASGO_VERIFY_REPO_ROOT}" && npm ci)
fi

: > "${GASGO_VERIFY_LOG_FILE}"
echo "${GASGO_VERIFY_PORT}" > "${GASGO_VERIFY_PORT_FILE}"
echo "${GASGO_VERIFY_BASE_URL}" > "${GASGO_VERIFY_URL_FILE}"

(
  cd "${GASGO_VERIFY_REPO_ROOT}"
  # Isolated port. No Paystack key → mock pay. No admin PIN env → demo PIN 2468.
  exec env PORT="${GASGO_VERIFY_PORT}" npm run dev -- --hostname "${GASGO_VERIFY_HOST}" -p "${GASGO_VERIFY_PORT}"
) >> "${GASGO_VERIFY_LOG_FILE}" 2>&1 &
echo $! > "${GASGO_VERIFY_PID_FILE}"
pid="$(tr -d '[:space:]' < "${GASGO_VERIFY_PID_FILE}")"

echo "launching pid=${pid} url=${GASGO_VERIFY_BASE_URL} log=${GASGO_VERIFY_LOG_FILE}"

ready=0
for _ in $(seq 1 60); do
  if ! gasgo_verify_pid_alive "${pid}"; then
    echo "dev process exited before ready. last log lines:" >&2
    tail -n 40 "${GASGO_VERIFY_LOG_FILE}" >&2 || true
    exit 1
  fi
  if grep -Eqi "Ready in|Local:[[:space:]]+http" "${GASGO_VERIFY_LOG_FILE}" 2>/dev/null \
    && [[ "$(gasgo_verify_http_code "${GASGO_VERIFY_BASE_URL}/")" == "200" ]]; then
    ready=1
    break
  fi
  if [[ "$(gasgo_verify_http_code "${GASGO_VERIFY_BASE_URL}/")" == "200" ]]; then
    ready=1
    break
  fi
  sleep 0.5
done

if [[ "${ready}" -ne 1 ]]; then
  echo "timed out waiting for ${GASGO_VERIFY_BASE_URL}/" >&2
  tail -n 40 "${GASGO_VERIFY_LOG_FILE}" >&2 || true
  exit 1
fi

echo "ready url=${GASGO_VERIFY_BASE_URL} pid=${pid}"
echo "Ready signal: HTTP 200 on / plus Next 'Ready in' (or equivalent) in ${GASGO_VERIFY_LOG_FILE}"
