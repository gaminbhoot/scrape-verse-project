# CLAUDE — Terminal-First Agent Contract

This project is terminal-first per ScrapeVerse §7.

## How the agent drives it

- `POST https://api.brightdata.com/dca/trigger?collector=c_xxx` — trigger scraper via REST (see src/lib/brightdata.ts:triggerViaRest)
- `npx @brightdata/cli bdata scraper run <collectorId> <url> --format json` — CLI fallback
- `npx @brightdata/cli bdata scraper heal <collectorId> "<reason>"` → `awaiting_approval` → `npx @brightdata/cli bdata scraper approve <collectorId> --auto-approve`

## Commands

- `npm run dev` — Next.js dashboard
- `npm test` — 99 tests (harsh-comprehensive)
- `node scripts/heartbeat.mjs` — cron that hits POST /dca/trigger and triggers heal on failure

## Collector IDs

- `c_layoffs_v2_hackathon` → https://layoffs.fyi/live-data
- `c_llm_benchmarks_live` → https://huggingface.co/spaces/open-llm-leaderboard
- `c_ai_jobs_stream` → https://news.ycombinator.com/jobs

## Public data only — robots.txt honored, no PII, turn websites into structured data
