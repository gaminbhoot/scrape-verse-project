import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/src/lib/store';

// Vercel Cron invokes GET /api/cron/heartbeat every 6h (vercel.json crons)
// Also callable via `curl -H "Authorization: Bearer $CRON_SECRET" ...`
// Guardrails mirror scripts/heartbeat.mjs: 429/5xx/402 do NOT trigger heal.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> if CRON_SECRET is set
  // In dev / without secret, allow all (simulation)
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;
  const auth = req.headers.get('authorization') || '';
  const vercelCron = req.headers.get('x-vercel-cron');
  if (vercelCron === '1' && auth === `Bearer ${cronSecret}`) return true;
  if (auth === `Bearer ${cronSecret}`) return true;
  // also allow explicit dashboard key for manual testing
  const dashKey = process.env.DASHBOARD_API_KEY;
  if (dashKey && auth === `Bearer ${dashKey}`) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized cron' }, { status: 401 });
  }

  const scrapers = store.getScrapers();
  const results: any[] = [];
  let healableCount = 0;

  for (const scraper of scrapers) {
    const start = Date.now();
    try {
      // Use store.runScraper which already handles REST→CLI→mock, envelope, drift, and persistence
      // Skip heal if we are already in healing/awaiting_approval to prevent concurrent heal
      if (scraper.status === 'healing' || scraper.status === 'awaiting_approval') {
        results.push({
          collectorId: scraper.collectorId,
          status: 'skipped',
          reason: `already ${scraper.status}`,
        });
        continue;
      }

      const run = await store.runScraper(scraper.id);
      const durationMs = Date.now() - start;

      // Guardrails — do NOT heal on infra
      if (run.error?.includes('402') || run.error?.includes('429') || run.error?.includes('5xx')) {
        results.push({
          collectorId: scraper.collectorId,
          status: 'infra',
          healable: false,
          reason: run.error,
          records: run.recordsExtracted,
          durationMs,
        });
        continue;
      }

      if (run.status === 'failure' || run.schemaDriftDetected || run.recordsExtracted === 0) {
        healableCount++;
        results.push({
          collectorId: scraper.collectorId,
          status: 'healable',
          healable: true,
          reason: run.error || (run.schemaDriftDetected ? 'schema drift' : 'empty'),
          records: run.recordsExtracted,
          durationMs,
        });
      } else {
        results.push({
          collectorId: scraper.collectorId,
          status: 'healthy',
          healable: false,
          records: run.recordsExtracted,
          durationMs,
        });
      }
    } catch (e: any) {
      // Distinguish infra vs healable by message
      const msg = e.message || String(e);
      const isInfra = msg.includes('402') || msg.includes('429') || msg.includes('5xx');
      results.push({
        collectorId: scraper.collectorId,
        status: isInfra ? 'infra' : 'error',
        healable: !isInfra,
        reason: msg,
      });
      if (!isInfra) healableCount++;
    }
  }

  // If healable, optionally trigger heal automatically in Vercel (Tier-3) when enabled
  // Default: report only (Tier-2 semi-auto). Enable via HEAL_ON_CRON=true
  const autoHeal = process.env.HEAL_ON_CRON === 'true';
  const healResults: any[] = [];
  if (autoHeal && healableCount > 0) {
    for (const r of results.filter(x => x.healable)) {
      const scraper = scrapers.find(s => s.collectorId === r.collectorId);
      if (!scraper) continue;
      try {
        const { healEvent } = await store.healScraper(scraper.id);
        await store.approveScraper(scraper.id);
        healResults.push({
          collectorId: scraper.collectorId,
          healed: true,
          healEventId: healEvent.id,
        });
      } catch (e: any) {
        healResults.push({ collectorId: scraper.collectorId, healed: false, error: e.message });
      }
    }
  }

  return NextResponse.json({
    ok: healableCount === 0,
    summary: {
      total: scrapers.length,
      healthy: results.filter(r => r.status === 'healthy').length,
      healable: healableCount,
      infra: results.filter(r => r.status === 'infra').length,
    },
    results,
    healResults: autoHeal ? healResults : undefined,
    note: autoHeal
      ? 'HEAL_ON_CRON=true — auto-healed healable collectors'
      : 'HEAL_ON_CRON not set — healable detected but not auto-healed (use POST /api/scrapers/:id/heal + approve, or set HEAL_ON_CRON=true for fully autonomous)',
    timestamp: new Date().toISOString(),
  });
}

// Support POST as well (for manual trigger)
export async function POST(req: NextRequest) {
  return GET(req);
}
