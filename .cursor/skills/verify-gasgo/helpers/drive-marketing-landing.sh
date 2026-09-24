#!/usr/bin/env bash
# Drive the marketing-landing feature via isolated Chrome CDP.
# Usage: .cursor/skills/verify-gasgo/helpers/drive-marketing-landing.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib.sh"
gasgo_verify_load_run
mkdir -p "${GASGO_VERIFY_EVIDENCE_DIR}" "${GASGO_VERIFY_RUN_DIR}"

export GASGO_VERIFY_BASE_URL GASGO_VERIFY_EVIDENCE_DIR GASGO_VERIFY_RUN_DIR GASGO_VERIFY_CDP_PORT

exec node "${SCRIPT_DIR}/cdp-drive.mjs" marketing-landing
