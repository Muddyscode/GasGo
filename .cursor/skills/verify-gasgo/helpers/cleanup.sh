#!/usr/bin/env bash
# Tear down the instance this run launched. Never deletes evidence.
# Usage: .cursor/skills/verify-gasgo/helpers/cleanup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib.sh"
gasgo_verify_load_run

echo "cleanup: run=${GASGO_VERIFY_RUN_DIR} evidence kept at ${GASGO_VERIFY_EVIDENCE_DIR}"

if [[ -f "${GASGO_VERIFY_CHROME_PID_FILE}" ]]; then
  chrome_pid="$(tr -d '[:space:]' < "${GASGO_VERIFY_CHROME_PID_FILE}")"
  if [[ -n "${chrome_pid}" ]]; then
    echo "stopping chrome pid=${chrome_pid}"
    gasgo_verify_kill_tree "${chrome_pid}"
  fi
fi

if [[ -f "${GASGO_VERIFY_PID_FILE}" ]]; then
  pid="$(tr -d '[:space:]' < "${GASGO_VERIFY_PID_FILE}")"
  if [[ -n "${pid}" ]]; then
    echo "stopping next pid=${pid}"
    gasgo_verify_kill_tree "${pid}"
  fi
fi

# Scratch only. Evidence stays.
if [[ -d "${GASGO_VERIFY_RUN_DIR}" ]]; then
  rm -rf "${GASGO_VERIFY_RUN_DIR}"
  echo "removed scratch ${GASGO_VERIFY_RUN_DIR}"
fi

if [[ -d "${GASGO_VERIFY_EVIDENCE_DIR}" ]]; then
  echo "evidence still present:"
  ls -la "${GASGO_VERIFY_EVIDENCE_DIR}" || true
else
  echo "note: evidence dir missing at ${GASGO_VERIFY_EVIDENCE_DIR} (nothing to keep)"
fi

echo "cleanup: done"
