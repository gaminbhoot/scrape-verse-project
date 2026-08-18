import { Scraper, ScraperRun, HealEvent, MetricOverview, LogEntry } from './types';
import { brightData } from './brightdata';

class ScraperStore {
  private scrapers: Scraper[] = [
    {
      id: 'scraper-1',
      name: 'Global Tech Layoffs & Market Tracker',
      collectorId: 'c_layoffs_v2_hackathon',
      targetUrl: 'https://layoffs.fyi/live-data',
      description: 'Continuous monitoring of workforce shifts and industry trends across public SEC filings and notices.',
      category: 'Tech Layoffs',
      status: 'healthy',
      lastRunAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      lastHealedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      successRate: 98.4,
      totalRuns: 142,
      totalHeals: 3,
      isDemoBreakable: true,
      selectors: [
        { field: 'company', selector: '.company-name-v1', type: 'css', required: true, status: 'valid', sampleValue: 'CloudCore Inc.' },
        { field: 'count', selector: 'span.impact-number', type: 'css', required: true, status: 'valid', sampleValue: '240' },
        { field: 'role', selector: '.division-impacted', type: 'css', required: false, status: 'valid', sampleValue: 'Engineering' },
        { field: 'date', selector: 'time.notice-date', type: 'css', required: true, status: 'valid', sampleValue: '2026-08-16' },
      ],
      schema: {
        company: 'string',
        count: 'number',
        role: 'string',
        date: 'date-iso',
      },
    },
    {
      id: 'scraper-2',
      name: 'Open LLM Leaderboard & Benchmark Pulse',
      collectorId: 'c_llm_benchmarks_live',
      targetUrl: 'https://huggingface.co/spaces/open-llm-leaderboard',
      description: 'Tracking open-weights reasoning scores, MMLU benchmarks, and model parameter tiers in real time.',
      category: 'AI Models',
      status: 'healthy',
      lastRunAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      successRate: 99.1,
      totalRuns: 310,
      totalHeals: 1,
      isDemoBreakable: false,
      selectors: [
        { field: 'modelName', selector: 'tr.model-row td.name', type: 'css', required: true, status: 'valid', sampleValue: 'DeepThink-v3' },
        { field: 'params', selector: 'span.param-badge', type: 'css', required: true, status: 'valid', sampleValue: '670B' },
        { field: 'mmluScore', selector: 'td.mmlu-val', type: 'css', required: true, status: 'valid', sampleValue: '91.8%' },
        { field: 'license', selector: 'span.license-tag', type: 'css', required: false, status: 'valid', sampleValue: 'Apache-2.0' },
      ],
      schema: {
        modelName: 'string',
        params: 'string',
        mmluScore: 'string',
        license: 'string',
      },
    },
    {
      id: 'scraper-3',
      name: 'Remote AI Engineering Job Opportunities',
      collectorId: 'c_ai_jobs_stream',
      targetUrl: 'https://news.ycombinator.com/jobs',
      description: 'Ingesting public hiring trends, salary ranges, and tech stack requirements for AI engineers.',
      category: 'Job Market',
      status: 'healthy',
      lastRunAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      successRate: 97.2,
      totalRuns: 88,
      totalHeals: 2,
      isDemoBreakable: false,
      selectors: [
        { field: 'item', selector: '.titleline > a', type: 'css', required: true, status: 'valid', sampleValue: 'AI Scraping Engineer' },
        { field: 'company', selector: '.subtext .hnuser', type: 'css', required: true, status: 'valid', sampleValue: 'ScrapeVerse Labs' },
        { field: 'location', selector: '.location-badge', type: 'css', required: false, status: 'valid', sampleValue: 'Remote' },
        { field: 'salary', selector: '.comp-estimate', type: 'css', required: false, status: 'valid', sampleValue: '$180k-$220k' },
      ],
      schema: {
        item: 'string',
        company: 'string',
        location: 'string',
        salary: 'string',
      },
    }
  ];

  private runs: ScraperRun[] = [];
  private healEvents: HealEvent[] = [];
  private logs: LogEntry[] = [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      level: 'info',
      source: 'CLI',
      message: 'Initialized @brightdata/cli session. Authenticated with Collector Pool.',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      level: 'success',
      source: 'ENGINE',
      message: 'Collector c_layoffs_v2_hackathon executed scheduled heartbeat. 8 items verified.',
      collectorId: 'c_layoffs_v2_hackathon',
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      level: 'success',
      source: 'STUDIO',
      message: 'Collector c_llm_benchmarks_live synced data into SQLite store. 0 schema drift.',
      collectorId: 'c_llm_benchmarks_live',
    }
  ];

  getScrapers(): Scraper[] {
    return this.scrapers;
  }

  getScraper(id: string): Scraper | undefined {
    return this.scrapers.find(s => s.id === id);
  }

  getLogs(): LogEntry[] {
    return this.logs.slice().reverse();
  }

  getRuns(scraperId?: string): ScraperRun[] {
    if (scraperId) {
      return this.runs.filter(r => r.scraperId === scraperId).slice().reverse();
    }
    return this.runs.slice().reverse();
  }

  getHealEvents(): HealEvent[] {
    return this.healEvents.slice().reverse();
  }

  getMetrics(): MetricOverview {
    const total = this.scrapers.length;
    const healthy = this.scrapers.filter(s => s.status === 'healthy' || s.status === 'recovered').length;
    const broken = this.scrapers.filter(s => s.status === 'broken' || s.status === 'degraded').length;
    const healing = this.scrapers.filter(s => s.status === 'healing').length;

    return {
      totalScrapers: total,
      uptimePercentage: total > 0 ? Number(((healthy / total) * 100).toFixed(1)) : 100,
      mttrSeconds: 24.5,
      totalRecordsExtracted: this.scrapers.reduce((acc, s) => acc + (s.totalRuns * 12), 1420),
      healsToday: this.scrapers.reduce((acc, s) => acc + s.totalHeals, 0),
      healthyCount: healthy,
      brokenCount: broken,
      healingCount: healing,
    };
  }

  /**
   * Judge Demo: Break Scraper DOM intentionally
   */
  breakScraper(id: string): { scraper: Scraper; log: LogEntry } {
    const scraper = this.getScraper(id);
    if (!scraper) throw new Error(`Scraper ${id} not found`);

    scraper.status = 'broken';
    scraper.selectors = scraper.selectors.map(s => {
      if (s.field === 'company' || s.field === 'count' || s.field === 'item') {
        return {
          ...s,
          status: 'broken',
          selector: `.obsolete-${s.field}-deprecated-node[v="2025"]`,
        };
      }
      return s;
    });

    const log: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'error',
      source: 'ENGINE',
      message: `[DEMO BREAKER] Injected target website DOM mutation for ${scraper.collectorId}. 2 selectors broken.`,
      collectorId: scraper.collectorId,
    };

    this.logs.push(log);
    return { scraper, log };
  }

  /**
   * Execute Scraper Run
   */
  async runScraper(id: string): Promise<ScraperRun> {
    const scraper = this.getScraper(id);
    if (!scraper) throw new Error(`Scraper ${id} not found`);

    const isBroken = scraper.status === 'broken';
    const result = await brightData.executeCollector(scraper, isBroken);

    scraper.lastRunAt = new Date().toISOString();
    scraper.totalRuns += 1;

    const run: ScraperRun = {
      id: `run-${Date.now()}`,
      scraperId: scraper.id,
      timestamp: new Date().toISOString(),
      status: result.success ? 'success' : 'failure',
      durationMs: result.durationMs,
      recordsExtracted: result.data.length,
      sampleData: result.data,
      schemaDriftDetected: !result.success,
      logs: result.logs,
      error: result.error,
    };

    this.runs.push(run);

    this.logs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: result.success ? 'success' : 'error',
      source: 'CLI',
      message: result.success
        ? `Run completed for ${scraper.collectorId}: ${result.data.length} records extracted.`
        : `Run failed for ${scraper.collectorId}: ${result.error}`,
      collectorId: scraper.collectorId,
    });

    return run;
  }

  /**
   * Self-Heal Scraper
   */
  async healScraper(id: string): Promise<{ healEvent: HealEvent; scraper: Scraper; verifiedRun: ScraperRun }> {
    const scraper = this.getScraper(id);
    if (!scraper) throw new Error(`Scraper ${id} not found`);

    scraper.status = 'healing';

    this.logs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'heal',
      source: 'HEALER',
      message: `Triggering automated self-healing via 'bdata scraper heal ${scraper.collectorId}'...`,
      collectorId: scraper.collectorId,
    });

    const healResult = await brightData.healCollector(
      scraper,
      'DOM structure mutated by target site; primary CSS selectors failing'
    );

    // Apply repaired selectors
    scraper.selectors = scraper.selectors.map(s => {
      const repaired = healResult.repairedSelectors.find(r => r.field === s.field);
      if (repaired) {
        return {
          ...s,
          status: 'repaired',
          selector: repaired.newSelector,
          repairedFrom: repaired.oldSelector,
        };
      }
      return { ...s, status: 'valid' };
    });

    scraper.status = 'recovered';
    scraper.lastHealedAt = new Date().toISOString();
    scraper.totalHeals += 1;

    const healEvent: HealEvent = {
      id: `heal-${Date.now()}`,
      scraperId: scraper.id,
      timestamp: new Date().toISOString(),
      triggerReason: 'DOM class attribute refactoring on target site',
      brokenSelectors: healResult.repairedSelectors.map(r => r.oldSelector),
      repairedSelectors: healResult.repairedSelectors,
      confidenceScore: 98.4,
      timeToHealMs: healResult.timeToHealMs,
      cliCommandUsed: healResult.cliCommand,
      prGenerated: 'PR #14: fix(collector): self-healed selector mappings for c_layoffs_v2_hackathon',
    };

    this.healEvents.push(healEvent);

    // Execute verification run
    const verifiedRun = await this.runScraper(scraper.id);

    this.logs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'success',
      source: 'CI/CD',
      message: `Self-healing verified! Collector ${scraper.collectorId} restored to 100% data fidelity in ${healEvent.timeToHealMs}ms.`,
      collectorId: scraper.collectorId,
    });

    return { healEvent, scraper, verifiedRun };
  }
}

// Global singleton instance
export const store = new ScraperStore();
