# AGENTS — Coding Agent as UI

Per SCRAPEVERSE_REQUIREMENTS_ANALYSIS.md §7 & §20:

- Agent is the UI. Dashboard is observability, not control plane.
- Collector is API: POST /dca/trigger with Bearer token.
- All secrets via `BRIGHT_DATA_API_KEY` in .env, never in git.
- CI runs `POST /dca/trigger` via heartbeat.mjs every 6h (see .github/workflows/scraper-heal.yml).

Co-Authored-By: Claude <noreply@anthropic.com>
