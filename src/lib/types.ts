export type ScraperStatus = 'healthy' | 'healing' | 'awaiting_approval' | 'degraded' | 'broken' | 'recovered';

export interface SelectorMap {
  field: string;
  selector: string;
  type: 'css' | 'xpath' | 'semantic';
  required: boolean;
  sampleValue?: string;
  status: 'valid' | 'broken' | 'repaired';
  repairedFrom?: string;
}

export interface Scraper {
  id: string;
  name: string;
  collectorId: string;
  targetUrl: string;
  description: string;
  category: 'AI Models' | 'Tech Layoffs' | 'Job Market' | 'E-Commerce';
  status: ScraperStatus;
  lastRunAt: string;
  lastHealedAt?: string;
  successRate: number; // 0-100
  totalRuns: number;
  totalHeals: number;
  selectors: SelectorMap[];
  schema: Record<string, string>;
  isDemoBreakable?: boolean;
}

export interface ScraperRun {
  id: string;
  scraperId: string;
  timestamp: string;
  status: 'success' | 'failure' | 'healed';
  durationMs: number;
  recordsExtracted: number;
  sampleData: Record<string, any>[];
  schemaDriftDetected: boolean;
  logs: string[];
  error?: string;
  healEventId?: string;
}

export interface HealEvent {
  id: string;
  scraperId: string;
  timestamp: string;
  triggerReason: string;
  brokenSelectors: string[];
  repairedSelectors: { field: string; oldSelector: string; newSelector: string; strategy: string }[];
  confidenceScore: number;
  timeToHealMs: number;
  cliCommandUsed: string;
  prGenerated?: string;
}

export interface MetricOverview {
  totalScrapers: number;
  uptimePercentage: number;
  mttrSeconds: number; // Mean Time to Recovery
  totalRecordsExtracted: number;
  healsToday: number;
  healthyCount: number;
  brokenCount: number;
  healingCount: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'heal' | 'success';
  source: 'CLI' | 'ENGINE' | 'STUDIO' | 'HEALER' | 'CI/CD';
  message: string;
  collectorId?: string;
}
