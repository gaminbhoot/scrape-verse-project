# ScrapeVerse Kick-Off — Comprehensive Analysis + AegisScrape Gap Audit & Remediation Plan

> Generated: 2026-08-18 // Source: https://www.wemakedevs.org/blogs/scrape-verse-kick-off (WeMakeDevs), Bright Data Scraper Studio CLI, repo docs in `docs/` and live code audit of `scrape-verse-project` (AegisScrape).
> Methodology: blind-first requirements extraction (before inspecting your build) → then concrete gap audit vs. implementation.

---

## PART 1 — What ScrapeVerse Actually Wants (Blind Analysis)

### 1.1 The Core Problem Statement
ScrapeVerse is **not a generic scraper hackathon**. It is a **self-healing data pipeline** challenge.

- **Pain:** Web scrapers are fragile — one class-name rename, one DOM reorder, one anti-bot update breaks the pipeline, causes silent data loss, hours of manual repair.
- **Thesis (Hendrix & Ghost):** Inspired by Jimi Hendrix-style improvisation + Ghost-style resilience. The “Verse” = multiverse of target site DOM variations. The winning scraper doesn’t break; it **adapts** in real-time.
- **What judges evaluate:** Not whether you can extract data once, but whether you can **keep extracting after the site tries to break you**.

### 1.2 Official Stack & Constraints (Non-Negotiable)
- **Bright Data Web Scraper IDE (Scraper Studio) + `@brightdata/cli` via `npx`** is mandatory. Local `cheerio`/`playwright` scrapers do not count.
- **Lifecycle you must implement:**
  ```
  bdata scraper create <url> "<field prompt>"
  → bdata scraper run <collector_id> <url> --format json
  → DETECT failure (empty payload / schema mismatch / non-zero exit)
  → bdata scraper heal <collector_id> "<break reason>"   // creates diff_summary, status=awaiting_approval
  → bdata scraper approve <collector_id> [--auto-approve]  // actually deploys fix
  → VERIFY run again → persist → expose via dashboard
  ```
  Docs state explicitly: **`heal` halts at `awaiting_approval` unless you pass `--auto-approve` or run `approve`**. Skipping this is a judging failure.
- **Budget:** WeMakeDevs + Bright Data give **5,000 free credits / $50 bonus** on registration. Dashboard must surface this. Every `run`/`heal` costs credits — you must handle `402 Payment Required` gracefully.
- **Proxy & Unblocking:** Must route through Bright Data’s Residential/Mobile/Web-Unlocker pool, not raw fetch. Expect `429`/`403` demo scenarios.
- **Tracks / Pillars implied by charter:**
  1. **Web-Slinger (Grand Prize):** Depth of Bright Data integration (CLI + IDE loop + heal/approve).
  2. **Suit-Up (Best UI):** Real observability — health matrix, MTTR, diff viewer, live terminal, budget meter.
  3. **Spider-Sense (Clean Code):** TypeScript, modular `runner/healer/store`, CI/CD, tests, docs.
  4. **Daily Bugle (Storytelling):** 2–3 min video + DEV.to article showing **break → heal** live. Needs `BreakSimulator` flow for judges.

### 1.3 Functional Requirements Decomposition (From Blog + PRD + Architecture)
| # | Requirement | Success Criteria | Judging Weight |
|---|-------------|------------------|----------------|
| R1 | Scraper Studio Collector Setup | Parameterized targetUrl + schema prompt, shows `collectorId` (e.g. `c_...`) in config | Must Have |
| R2 | Heartbeat Health Checks | Cron/scheduled run, detects HTTP error / empty array / schema drift within 60s | Must Have |
| R3 | Zero-Downtime Self-Healing | `heal` → `approve` → re-run succeeds <25–60s MTTR, logs `diff_summary` & strategy | Must Have |
| R4 | Schema Drift Detection | JSON-schema validator flags missing/type-mutated fields, partial data still served | Should Have |
| R5 | Persistent Store | Postgres (prod) / SQLite (dev) with historical runs + healEvents, not in-memory | Must Have |
| R6 | Export API + Webhooks | REST `/api/scrapers`, `/api/metrics`, `/api/budget`, `/api/logs` + webhook notification | Must Have |
| R7 | Visual Dashboard | Matrix (Healthy/Healing/Broken), MetricCards (Uptime/MTTR/Records/Heals), DataExplorer, LiveTerminal with filters | Must Have |
| R8 | CI/CD Auto-Heal PR | GitHub Actions cron + `heal` + `create-pull-request` with diff, confidence score | Should Have |
| R9 | Security | API keys in `BRIGHT_DATA_API_KEY` env, no client leak, CLI arg escaping (no injection) | Must Have |

### 1.4 Non-Functional / Judging Gotchas
- **Real API key path must exist** even if fallback mock allowed for local dev. Hard-coded `4850 credits` without API call fails “Production Readiness”.
- **Confidence score + strategy label** (“Semantic Anchor & Proximity”, “XPath fallback”, “AI re-prompt”) must be shown per repaired field.
- **Human-in-loop gate** must be visible. Judges will intentionally break a selector and expect to see `awaiting_approval` → Approve → Recovery. Auto-approve hidden heals look fake.
- **Logs must be real envelope logs**, not invented strings. Collect `stdout`/`stderr`/`exitCode` from CLI subprocess.

---

## PART 2 — Your Current Build: AegisScrape Audit (Post-Inspection)

**Repo:** `~/Documents/Projects/scrape-verse-project` — Next.js 15.5.23 + React 19 + TypeScript + Tailwind + `zod` + `lucide-react`. Builds clean (`next build` passes, 112kB First Load). Docs (`PRD.md`, `PROJECT_CHARTER.md`, `SYSTEM_ARCHITECTURE.md`, `HACKATHON_SUBMISSION_STRATEGY.md`) are unusually strong and aligned to blog.

**What’s already excellent (keep):**
- Docs narrative is hackathon-grade — problem/solution, MoSCoW, 5-day roadmap, demo script checklist.
- UI polish: `Header` (proxy 42 active, credits badge), `MetricCards`, `ScraperMatrix`, `BreakSimulator` → `DiffViewer` → `LiveTerminal` → `DataExplorer` flow is exactly what Suit-Up wants.
- `src/lib/types.ts` clean interfaces (`Scraper`, `ScraperRun`, `HealEvent`, `MetricOverview`, `LogEntry`, `SelectorMap`).
- GitHub Actions workflow exists (`.github/workflows/scraper-heal.yml`) with cron `0 */6 * * *`.
- Tests exist (5 suites, Node native runner) covering DOM shift, schema drift, injection, concurrency.

**What is hollow / mock / gap:**

### Critical Gaps (Will Fail Judging if Shipped As-Is)

**C1 — No Real Bright Data Execution (entire `brightdata.ts` is mock):**
- `getBudget()` returns hard-coded `{4850, "Hackathon Special", 42}`. `executeCollector()` and `healCollector()` just `push("[CLI] $ npx ...")` strings and return `generateMockExtractedData()` (layoffs/LLM/jobs canned arrays). No `child_process.spawn`, no `@brightdata/cli` import, no `BRIGHT_DATA_API_KEY` usage, no `bdata scraper approve` step. In production this is `awaiting_approval` forever.
- Consequence: Any judge running without mock will see no network call; the “heal” is instant `<900ms` fake, not real DOM diff.

**C2 — Store is In-Memory Singleton (`src/lib/store.ts`):**
- `private scrapers: Scraper[] = [...]` + `private runs: ScraperRun[] = []`. On serverless cold-start / restart all history vanishes. PRD promises SQLite/Postgres + `store.ts` persistence is unimplemented. `app/api/scrapers/route.ts` just returns `store.getScrapers()` with no DB.

**C3 — Approval Gate Missing:**
- Heal returns `{ success: true, repairedSelectors, cliCommand: "heal ..." }` then `store.healScraper` immediately marks `status: 'recovered'` and creates `verifiedRun`. Real CLI flow requires `heal` → `preview_result` → `approve --auto-approve`. Your `DiffViewer` shows a before/after but never an `awaiting_approval` state or `Approve` button backed by `bdata scraper approve`.

**C4 — No Schema Validation Engine:**
- `runScraper` does `isBroken ? failure : success` boolean, never validates `sampleData` against `scraper.schema`. Tests `validateSchema()` in `schema-drift.test.js` are standalone pure functions, not wired to the API. Partial salvage (“degraded but serving”) not implemented.

**C5 — Hard-coded Secrets / Env Hygiene:**
- No `.env.example`, no `process.env.BRIGHT_DATA_API_KEY` guard, no server-only `NEXT_PRIVATE_` usage. `Header` shows credits from props, not live budget. Budget card cannot show `402/429` or credit exhaustion.

### High-Severity Gaps

**H1 — DOM Diffing & AI Re-prompt are Strings:** `healCollector` logs `[DOM-DIFF] Detected updated container from div.card-v1 to article[data-testid="item-card"]` unconditionally. `generateRepairedSelector()` is three `if (field.includes(...))` canned returns, not proximity/heuristic or LLM call.

**H2 — CI/CD Workflow Won’t Auto-Heal:** Workflow does `npm run test || echo "HEAL_TRIGGERED=true"` then `npx @brightdata/cli bdata scraper heal c_layoffs...` but tests always pass, so `HEAL_TRIGGERED` never set; also never runs `bdata scraper approve` nor commits updated selector JSON, so `create-pull-request` will be empty.

**H3 — Budget/Metrics APIs are Mock Proxies:** `app/api/budget/route.ts` → `brightData.getBudget()` (mock), `app/api/metrics/route.ts` → `store.getMetrics()` computed from in-memory counters, not from run history aggregation.

**H4 — Security Sanitization Not Wired:** Tests in `api-contracts.test.js` mock `sanitizeInput()` and `formatBrightCliCommand()` quoting, but real routes `app/api/scrapers/[id]/break|heal|run` do `store.breakScraper(id)` with no input sanitization, no `zod` guard, no CollectorId allowlist.

**H5 — No Rate/Bank Controls:** No 429 backoff, no credit-check before `run`, no `Proxy Pool: Residential (42 Active)` live fetch.

### Medium / Polish Gaps
- `.env*` missing, `README` claims `.env.local` optional but code doesn’t branch mock vs live (always mock).
- `next.config.mjs` empty (`reactStrictMode: true`) — no `output: standalone` for deploy.
- `types.ts` uses `ScraperStatus = 'healthy'|'healing'|'degraded'|'broken'|'recovered'` but no `'awaiting_approval'`.
- `LiveTerminal` filter for `CLI|ENGINE|HEALER|CI/CD` works but `store` logs never produce `level: 'error'` with real `stderr`.
- Tests are isolated — none imports `src/lib/store` or hits Next API routes (no `fetch` contract test against live server).

**Build health:** `npm run build ✓`, `npm test` (node --test) passes because tests are pure — masks that integration is untested.

---

## PART 3 — Remediation Plan (Priority-Ordered, 3 Horizons)

### Horizon 0 — Quick Wins (2–4 hours, huge judging lift)

**0.1 Surface Approval Gate Truthfully (UI + Type):**
- Add `status: 'awaiting_approval'` to `ScraperStatus`; render amber badge + `Approve Heal` button in `ScraperMatrix`/`DiffViewer`.
- Update `store.healScraper` to set `status='awaiting_approval'` after `heal`, store `diff_summary`/`preview_result` placeholder, then require explicit `POST /api/scrapers/[id]/approve` to set `recovered`.

**0.2 Make Budget Real (even if fallback):**
- In `brightdata.ts#getBudget()`, try real `bdata budget` / REST `https://api.brightdata.com/zone/budget` when `BRIGHT_DATA_API_KEY` set; on failure fallback to mock and log `[WARN] Running in simulation mode — set BRIGHT_DATA_API_KEY for live envelope`. Pipe `creditsRemaining` to `Header` instead of hard `4850`.

**0.3 Env & Security Hygiene:**
- Add `.env.example` (`BRIGHT_DATA_API_KEY=`), `.env.local` gitignored, `src/lib/env.ts` with `zod` validation (`BRIGHT_DATA_API_KEY` optional, `ALLOW_MOCK_FALLBACK=true`).
- Add `zod` schema for `collectorId` (`/^c_[a-z0-9_]+$/`) and escape CLI args (`arg.replace(/"/g,'\\"')`) in one shared `formatBrightCommand()` used by all routes — reuse the logic already tested in `api-contracts.test.js`.

**0.4 Wire Schema Validator Live:**
- Import real `validateSchema()` into `store.runScraper()` post-extraction; if anomalies → set `schemaDriftDetected=true`, downgrade to `degraded` not `healthy`, log `[WARN] Schema drift: ...` but still return `sampleData` (graceful degrade).

### Horizon 1 — Core Fix: Replace Mock with Real CLI Envelope (1–2 days)

**1.1 Real `BrightDataClient` (keep mock as fallback):**
```ts
// src/lib/brightdata.ts
import { spawn } from 'node:child_process'
async function runCli(args: string[]): Promise<{ stdout:string, stderr:string, exitCode:number, envelope:any }>
```
- Implement `executeCollector()` → `spawn('npx', ['@brightdata/cli','bdata','scraper','run', collectorId, url, '--format','json'])` with 90s timeout, `BRIGHT_DATA_API_KEY` env injection, JSON-parse `envelope.data`, map `envelope.status`.
- Implement `healCollector()` → `spawn('heal', [id, reason])` → capture `diff_summary` + `preview_result` (contains `status: 'awaiting_approval'`, `suggested_selectors`). Return them, don’t auto-mark recovered.
- Implement `approveCollector()` → `spawn('approve', [id, '--auto-approve'])` → verify second run.
- All methods log raw CLI envelope to `store.addLog({source:'CLI', level:..., message: stdout/stderr})`.

**1.2 Persist Store:**
- Add `better-sqlite3` (or `drizzle` + `sqlite`) — one `data.db` file, tables `scrapers`, `runs`, `heal_events`, `logs`. Keep current mock seed on first boot via `seed.ts`. Replace `ScraperStore` array with DB queries; keep in-memory fallback if `DATABASE_URL` absent so local build still works.
- Add `GET /api/runs`, `GET /api/heal-events` for dashboard history (currently only `runs` in page state, not persisted).

**1.3 Add Approve Route:**
- New `app/api/scrapers/[id]/approve/route.ts` (`POST` → `store.approveScraper(id)` → returns `verifiedRun`). Wire button in `DiffViewer` → `fetch('/api/scrapers/'+id+'/approve', {method:'POST'})`.

**1.4 Fix CI/CD Trigger Logic:**
- Replace `npm run test || HEAL_TRIGGERED` with real `node scripts/heartbeat.mjs` that does `bdata scraper run` and exits non-zero on empty/schema-fail. Then `heal` → `approve --auto-approve` → commit `data/collectors.json` selector patch → `create-pull-request` actually has diff.

### Horizon 2 — Excellence: Heuristics, Resilience, Story (1 day polish)

**2.1 Real Heuristics (behind feature flag):**
- **DOM-Diff:** Save `lastGoodHtml` vs `currentHtml` snapshots in DB; compute diff via `diff-dom` or simple `cheerio` selector existence check; identify broken selectors, log exact `expected 4 selectors, 2 missing`.
- **Fallback strategies in order:** (1) `data-testid`/`data-field` semantic anchor, (2) text-proximity (`:contains()`), (3) structural proximity (`article:has(h2)`), (4) LLM re-prompt (package `htmlSnippet + desired schema` → Bright Data AI agent). Log chosen `strategy` per field — this is what `repairedSelectors.strategy` already expects.

**2.2 Resilience & Budget Guard:**
- Before each `run`, call `getBudget()` — if `creditsRemaining < 50` show banner `Low credits — heal may fail (402)`. Handle `429 RateLimit` with exponential backoff log, not crash.
- Add `concurrency-stress.test.js` already exists — wire it to real `store.runScraper` with 5 parallel `run` calls, assert no race on status transition.

**2.3 Security & Docs:**
- Move all Bright Data keys server-side (`app/api/*` only), never expose to client `fetch`. Rate-limit `break/heal/approve` routes (one heal per collector per minute).
- Update `README` Quickstart to include `cp .env.example .env.local` + `npx @brightdata/cli bdata login` step, note `ALLOW_MOCK_FALLBACK` for offline judges.
- Record 150-sec demo: **Hook (fragile)** → **Break (click 1. Break)** → **Heal (awaiting_approval badge)** → **Approve** → **Recover (DataExplorer shows fresh rows + DiffViewer green)**, narrate MTTR + credits.

---

## PART 4 — Concrete “Next 10 Commits” Checklist

- [ ] **Commit 1 — Types & UI gate:** add `awaiting_approval` status, amber badge + Approve button.
- [ ] **Commit 2 — Env layer:** `.env.example`, `src/lib/env.ts` (zod), gitignore `.env.local`.
- [ ] **Commit 3 — CLI runner skeleton:** `src/lib/brightdata.real.ts` with `spawn` + timeout, keep `brightdata.mock.ts` fallback, feature-flag `USE_LIVE_CLI=!!process.env.BRIGHT_DATA_API_KEY`.
- [ ] **Commit 4 — Approve route & store DB stub:** `app/api/scrapers/[id]/approve/route.ts`, `store.approveScraper()`, SQLite wiring.
- [ ] **Commit 5 — Schema validator live:** wire `validateSchema` into `runScraper`, degraded path, test `schema-drift.test.js` now imports real validator.
- [ ] **Commit 6 — Budget live:** `getBudget()` real path, Header fetches `/api/budget`, handles 402/429 banners.
- [ ] **Commit 7 — CI heartbeat script:** `scripts/heartbeat.mjs` + workflow `heal`→`approve` fix.
- [ ] **Commit 8 — DOM diff heuristics:** snapshot + strategy labels, logs match `healCollector` already-expected format.
- [ ] **Commit 9 — Security:** `zod` + quoting in all routes, server-only key, rate limit.
- [ ] **Commit 10 — Polish:** `output: standalone`, run `npm run build && npm test` green, record demo video script per `HACKATHON_SUBMISSION_STRATEGY.md`.

---

## PART 5 — Risk / Decision Log

- **Keep mock fallback** — mandatory for offline judging and for local dev without key; gate via `BRIGHT_DATA_API_KEY` presence, log clearly.
- **Don’t invent Bright Data SDK** — use `@brightdata/cli` via `npx` as docs demand; judges check `package.json` for `@brightdata/cli` devDep + workflow `npx @brightdata/cli`.
- **Don’t over-engineer Postgres** — SQLite + `better-sqlite3` is sufficient for hackathon; Postgres migration is a README future note, not required for Suit-Up.
- **Approval is the story** — the single most differentiating fix you can ship in 30 minutes is showing `awaiting_approval` truthfully; it turns a “fake heal” into a “real human-in-loop” demo judges recognize.

---

## Appendix — Where to Look

- This report: `docs/COMPREHENSIVE_ANALYSIS_AND_REMEDIATION_PLAN.md`
- PRD/Charter/Architecture: `docs/PRD.md`, `docs/PROJECT_CHARTER.md`, `docs/SYSTEM_ARCHITECTURE.md`, `docs/HACKATHON_SUBMISSION_STRATEGY.md`
- Code audited: `src/lib/types.ts`, `src/lib/store.ts`, `src/lib/brightdata.ts`, `app/api/**/*`, `components/*`, tests `tests/*.test.js`, workflow `.github/workflows/scraper-heal.yml`
- Bright Data CLI source: `npm:@brightdata/cli` / https://github.com/danishashko/cli (heal→awaiting_approval→approve loop)

> Bottom line: You built a **judge-ready Suit-Up UI + excellent docs** for a **mock engine**. To win Web-Slinger + Spider-Sense, spend 1–2 days turning `brightdata.ts` from theater into real `spawn("npx @brightdata/cli")` with approve gate + SQLite, then your Break→Heal→Approve story becomes demonstrably autonomous self-healing, not simulated.
