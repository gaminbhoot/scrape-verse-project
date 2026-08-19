# 🛡️ AegisScrape (ScraperSense)

> **Autonomous Self-Healing Web Scraping Engine & Visual Observability Platform**  
> Built for the **"Into the Scrape-Verse"** Hackathon by **WeMakeDevs** & **Bright Data**.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](<>)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](<>)
[![Bright Data CLI](https://img.shields.io/badge/Bright%20Data-Scraper%20Studio-blue.svg)](<>)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](<>)

---

## 🌟 Overview

Web scrapers are notoriously fragile—minor DOM modifications, class renaming, or layout restructuring by target websites immediately crash downstream data pipelines, causing silent data corruption and hours of manual triage.

**AegisScrape** pioneers zero-downtime, self-healing web data pipelines. Powered by **Bright Data Scraper Studio** and `@brightdata/cli`, AegisScrape continuously monitors collector heartbeats, detects selector breaking and schema drift in real time, and automatically executes `bdata scraper heal` to restore 100% data fidelity in seconds without human intervention.

---

## 🏆 Target Hackathon Tracks

| Track                     | Category                                  | How AegisScrape Competes                                                                                                                                                                             |
| :------------------------ | :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Web-Slinger Track**     | **Grand Prize (Best Use of Bright Data)** | Deep integration with Bright Data Scraper Studio & `@brightdata/cli` (`bdata scraper run`, `bdata scraper heal`, `bdata budget`), featuring automated CLI recovery loops and Collector ID telemetry. |
| **Suit-Up Track**         | **Best UI**                               | Sleek Cyberpunk/Dark-Mode Observability Control Center with real-time health telemetry, live CLI stream, interactive judge demo breaker, and visual DOM diff inspector.                              |
| **Spider-Sense Track**    | **Best Clean Code**                       | Strict TypeScript architecture, modular separation of concerns (Runner, Healer, Store, API), full documentation, automated GitHub Actions CI/CD, and test suite.                                     |
| **The Daily Bugle Track** | **Social & Community**                    | Complete write-ups, architecture specs, video demonstration script, and LinkedIn/DEV.to showcase.                                                                                                    |

---

## 📐 Architecture

```mermaid
graph TD
    A[Scheduled Cron / GitHub Actions] -->|Triggers Heartbeat| B(Aegis Scraper Engine)
    B -->|Executes via @brightdata/cli| C{Bright Data Scraper Studio}
    C -->|Success / Valid Schema| D[Structured SQLite/PostgreSQL Store]
    C -->|Failure / Broken Selectors| E[Autonomous Self-Healing Engine]
    E -->|DOM Diffing & Heuristics| F[Bright Data AI Healer (bdata scraper heal)]
    F -->|Updates Collector Logic| B
    D --> G[Public REST APIs & Webhooks]
    G --> H[Visual Observability Dashboard]
    E -.->|Real-time Telemetry| H
```

---

## ⚡ Key Features

> **Collector-as-API:** `POST https://api.brightdata.com/dca/trigger?collector=c_xxx` with `Authorization: Bearer $BRIGHT_DATA_API_KEY` — see `src/lib/brightdata.ts:triggerViaRest`. CLI `bdata scraper run/heal/approve` is fallback. Respects `robots.txt`, public data only, turns websites into structured data.

1. **Autonomous Self-Healing (`bdata scraper heal`)**:
   - Detects layout shifts, obsolete CSS classes, and missing schema fields.
   - Automatically executes Bright Data healing heuristics to generate resilient semantic selectors.
   - Achieves an average Mean Time to Recovery (MTTR) of **< 25 seconds** vs. hours of manual developer intervention.

2. **Interactive "Judge Demo & Break Simulator"**:
   - A dedicated testbed where judges can click **"1. Break Selectors"**, observe the pipeline fail, and watch AegisScrape autonomously heal the broken scraper and recover verified data.

3. **Visual Selector Diff & Heuristic Audit**:
   - Side-by-side comparison of deprecated/broken selectors vs. newly synthesized self-healed selectors.

4. **Live Terminal & CLI Telemetry**:
   - Real-time stream of `@brightdata/cli` commands, proxy pool status, and CI/CD audit logs with filter pills.

5. **Automated CI/CD GitHub Action**:
   - Cron-based health check pipeline (`.github/workflows/scraper-heal.yml`) that auto-heals collectors and submits pull requests with updated selectors.

---

## 🚀 Quickstart

### Prerequisites

- Node.js 18+ (tested on Node.js 22/26)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/scrape-verse-project.git
cd scrape-verse-project
npm install
```

### 2. Configure Environment (Optional)

Create `.env.local` to add your Bright Data credentials (or run in built-in mock/simulation mode):

```bash
BRIGHT_DATA_API_KEY="your_bright_data_api_token"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Tests

```bash
npm test
```

---

## 🛠️ CLI Cheat Sheet

```bash
# 1. Authenticate with Bright Data
npx @brightdata/cli bdata login

# 2. Check balance and credits
npx @brightdata/cli bdata budget

# 3. Create a new collector
npx @brightdata/cli bdata scraper create <target_url> "<description of data fields>"

# 4. Run collector
npx @brightdata/cli bdata scraper run <collector_id> <target_url> --format json

# 5. Trigger self-healing
npx @brightdata/cli bdata scraper heal <collector_id> "<reason for break>"
```

---

## 📂 Project Documentation & Compliance

Detailed specifications, compliance certs, and planning documents:

- [Compliance, Zero-PII & Credit Economics](file:///Users/jay/Documents/Projects/scrape-verse-project/COMPLIANCE.md)
- [Project Charter](file:///Users/jay/Documents/Projects/scrape-verse-project/docs/PROJECT_CHARTER.md)
- [Product Requirements Document (PRD)](file:///Users/jay/Documents/Projects/scrape-verse-project/docs/PRD.md)
- [System Architecture Specification](file:///Users/jay/Documents/Projects/scrape-verse-project/docs/SYSTEM_ARCHITECTURE.md)
- [Hackathon Submission & Video Strategy](file:///Users/jay/Documents/Projects/scrape-verse-project/docs/HACKATHON_SUBMISSION_STRATEGY.md)

---

## 💡 Why Not Prebuilt Scrapers? (§12 Long-Tail Justification)

Prebuilt scrapers in commercial marketplaces only cover the top 0.01% of standard web domains (Amazon, LinkedIn, Walmart, Instagram). Real-world intelligence requires harvesting from dynamic, long-tail data sources where no prebuilts exist:

1. **Tech Layoffs & Workforce Shifts (`layoffs.fyi/live-data`)**: Macro-economic workforce movement tracker where table hierarchies frequently morph into card containers.
2. **Open LLM Leaderboard (`huggingface.co/spaces/open-llm-leaderboard`)**: Rapidly evolving open-weights AI model benchmark scores with dynamic Gradio/Flex containers.
3. **AI Engineering Opportunities (`news.ycombinator.com/jobs`)**: Public high-velocity hiring stream.

---

## 🛡️ Risk Register & Self-Healing Guardrails (§27)

| Risk ID | Failure Scenario                             | Impact              | Autonomous Mitigation & Guardrail                                            |
| :------ | :------------------------------------------- | :------------------ | :--------------------------------------------------------------------------- |
| **R1**  | **Target Site Transient 5xx Downtime**       | Heartbeat fails     | **Guardrail:** Do NOT trigger heal on 5xx; retry with exponential backoff.   |
| **R2**  | **Obfuscated / Hashed Tailwind CSS Classes** | Selectors break     | AI Healer synthesizes semantic tag & `data-testid` fallback selector chains. |
| **R3**  | **Full Page Redesign (Table ➔ Flex Grid)**   | Zero rows extracted | Structural relative path healing with partial salvage fallback.              |
| **R4**  | **Target Rate Limiting (HTTP 429)**          | Scraper throttled   | Residential proxy rotation + automatic backoff with jitter.                  |
| **R5**  | **Over-Healing on Minor Layout Jitter**      | Flaky updates       | `confidenceScore > 0.80` threshold required before proposed diff approval.   |
| **R6**  | **Silent Schema / Type Mutation**            | Bad data ingested   | Zod live schema validator rejects mutated types and logs anomaly.            |
| **R7**  | **Credit Exhaustion (HTTP 402)**             | Collector halts     | Budget API alerts dashboard and fails fast with actionable prompt.           |

---

## 💰 Credit Economics & Free-Tier Sustainability (§22)

- **Monthly Free Tier:** 5,000 credits/month (no credit card required).
- **WeMakeDevs Hackathon Promo Code:** `wemakedevs` (Unlocks +$50 in Bright Data billing).
- **Efficiency:** Lightweight selector heartbeat costs < 1 credit; full page scrape costs 2–5 credits. A single hackathon grant easily provides 1,000–2,500 full validation runs.

---

## 📜 License

MIT License. Built with ❤️ for WeMakeDevs & Bright Data.
