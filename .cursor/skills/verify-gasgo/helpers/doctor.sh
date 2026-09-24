#!/usr/bin/env bash
# Read-only: is this verification instance worth driving?
# Usage: .cursor/skills/verify-gasgo/helpers/doctor.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/lib.sh"
gasgo_verify_load_run

fail=0
pass() { echo "PASS  $*"; }
warn() { echo "WARN  $*"; }
bad() { echo "FAIL  $*"; fail=1; }

if [[ ! -f "${GASGO_VERIFY_PID_FILE}" ]]; then
  bad "no pid file at ${GASGO_VERIFY_PID_FILE} — run helpers/launch.sh"
  echo "doctor: FAIL"
  exit 1
fi

pid="$(tr -d '[:space:]' < "${GASGO_VERIFY_PID_FILE}")"
if gasgo_verify_pid_alive "${pid}"; then
  pass "process alive pid=${pid}"
else
  bad "pid ${pid} is not running"
fi

pkg_version="$(node -e "console.log(require('${GASGO_VERIFY_REPO_ROOT}/package.json').version)" 2>/dev/null || echo "?")"
pkg_name="$(node -e "console.log(require('${GASGO_VERIFY_REPO_ROOT}/package.json').name)" 2>/dev/null || echo "?")"
if [[ "${pkg_name}" == "gasgo" ]]; then
  pass "package ${pkg_name}@${pkg_version} at ${GASGO_VERIFY_REPO_ROOT}"
else
  bad "unexpected package name '${pkg_name}' (expected gasgo)"
fi

if gasgo_verify_port_busy "${GASGO_VERIFY_PORT}"; then
  pass "port ${GASGO_VERIFY_PORT} is listening"
else
  bad "port ${GASGO_VERIFY_PORT} is not listening"
fi

# Confirm the listener is in our process tree via /proc (ss is not assumed).
tree="$(gasgo_verify_descendants "${pid}" | tr '\n' ' ')"
owned="$(python3 - "${GASGO_VERIFY_PORT}" ${tree} <<'PY'
import sys
from pathlib import Path
port = sys.argv[1]
tree = set(sys.argv[2:])
tcp = Path("/proc/net/tcp")
if not tcp.is_file():
    print("unknown")
    raise SystemExit
# /proc/net/tcp local_address is hex IP:port
want = int(port)
owners = []
for line in tcp.read_text().splitlines()[1:]:
    parts = line.split()
    if len(parts) < 10:
        continue
    local = parts[1]
    inode = parts[9]
    try:
        hexport = int(local.split(":")[1], 16)
    except (IndexError, ValueError):
        continue
    if hexport != want:
        continue
    owners.append(inode)
print("inode" if owners else "none")
PY
)"
if [[ -n "${tree}" ]]; then
  pass "process tree for pid ${pid}: ${tree}"
else
  warn "empty process tree for pid ${pid}"
fi
if [[ "${owned}" == "none" ]]; then
  warn "no /proc/net/tcp inode for port ${GASGO_VERIFY_PORT}; HTTP checks still decide health"
fi

tmp_html="$(mktemp)"
code="$(curl -sS -o "${tmp_html}" -w "%{http_code}" --max-time 8 "${GASGO_VERIFY_BASE_URL}/" || echo "000")"
if [[ "${code}" == "200" ]]; then
  pass "GET / → 200"
else
  bad "GET / → ${code}"
fi

if grep -q "<title>GasGo</title>" "${tmp_html}"; then
  pass "HTML title is GasGo"
else
  bad "HTML title is not GasGo (client HomeGate may still hydrate; title comes from src/app/(customer)/page.tsx)"
fi

if grep -Eqi "Loading GasGo|gasgo|__next" "${tmp_html}"; then
  pass "HTML looks like the Next GasGo shell"
else
  bad "HTML does not look like GasGo"
fi

for path in /order/cylinder /login /admin/login /how-it-works /zones /why /profile; do
  c="$(gasgo_verify_http_code "${GASGO_VERIFY_BASE_URL}${path}")"
  if [[ "${c}" == "200" ]]; then
    pass "GET ${path} → 200"
  else
    bad "GET ${path} → ${c}"
  fi
done

rm -f "${tmp_html}"

echo
if [[ "${fail}" -eq 0 ]]; then
  echo "doctor: OK  ${GASGO_VERIFY_BASE_URL}  (isolated verify instance)"
  echo "Auth: no server session. Customer demo is localStorage ${SESSION_HINT:-gasgo-session}. Admin PIN fallback is 2468."
  exit 0
fi
echo "doctor: FAIL  do not drive this instance"
exit 1
