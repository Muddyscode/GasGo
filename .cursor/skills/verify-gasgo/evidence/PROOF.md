# Proof run — marketing landing

Executed the generated skill end to end on 2026-09-24.

1. `helpers/launch.sh` — Next.js on `http://127.0.0.1:3100` (isolated; not `:3000`).
2. `helpers/doctor.sh` — `doctor: OK` (pid alive, `gasgo@0.1.0`, `/` title GasGo, listed routes 200).
3. `helpers/drive-marketing-landing.sh` — isolated Chrome CDP clicked hero **Start a refill**.
4. `helpers/cleanup.sh` — removed `.run/` and freed port 3100. **This folder was left intact.**

| Step | Observable |
|---|---|
| Before | `/` — headline `A full cylinder back at the door, before the pot needs it.` Session/draft empty. |
| Action | Click link **Start a refill** |
| After | `/order/cylinder` — `What should we fill?` title `Your fill · GasGo` |

Files:

- `marketing-landing-2026-09-24T11-44-43-586Z-01-landing.png` / `.json`
- `marketing-landing-2026-09-24T11-44-43-586Z-02-fill.png` / `.json`
- `marketing-landing-2026-09-24T11-44-43-586Z-report.json`
- `LAST_PROOF.json`
