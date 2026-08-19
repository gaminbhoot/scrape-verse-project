#!/usr/bin/env node
// scripts/heartbeat.mjs — Collector Heartbeat with REST→CLI fallback, per-collector validation, and heal-aware exit codes
// Exit codes: 0 = healthy / infra-only (no heal), 1 = healable failure (empty / drift / schema), 2 = infra misconfig
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// ── Collector registry — mirrors src/lib/store.ts ──
const COLLECTORS = [
  {
    id: 'c_layoffs_v2_hackathon',
    url: 'https://layoffs.fyi/live-data',
    schema: { company: 'string', count: 'number', role: 'string', date: 'date-iso' },
    requiredFields: ['company', 'count', 'date'],
  },
  {
    id: 'c_llm_benchmarks_live',
    url: 'https://huggingface.co/spaces/open-llm-leaderboard',
    schema: { modelName: 'string', params: 'string', mmluScore: 'string', license: 'string' },
    requiredFields: ['modelName', 'params', 'mmluScore'],
  },
  {
    id: 'c_ai_jobs_stream',
    url: 'https://news.ycombinator.com/jobs',
    schema: { item: 'string', company: 'string', location: 'string', salary: 'string' },
    requiredFields: ['item', 'company'],
  },
];

function getTargets() {
  const singleId = process.env.COLLECTOR_ID || process.env.COLLECTOR || null;
  const singleUrl = process.env.TARGET_URL || null;
  if (singleId) {
    const known = COLLECTORS.find(c => c.id === singleId);
    if (known) return [{ ...known, url: singleUrl || known.url }];
    // unknown collector — still try with generic schema
    return [
      {
        id: singleId,
        url: singleUrl || COLLECTORS[0].url,
        schema: COLLECTORS[0].schema,
        requiredFields: COLLECTORS[0].requiredFields,
      },
    ];
  }
  return COLLECTORS;
}

function runCli(args, timeoutMs = 90000) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['@brightdata/cli', ...args], {
      env: { ...process.env },
      shell: false,
    });
    let stdout = '';
    let stderr = '';
    let killed = false;
    const timer = setTimeout(() => {
      killed = true;
      child.kill('SIGTERM');
      reject(
        Object.assign(
          new Error(`CLI timeout after ${timeoutMs}ms: npx @brightdata/cli ${args.join(' ')}`),
          { stdout, stderr, exitCode: 124 }
        )
      );
    }, timeoutMs);
    child.stdout?.on('data', d => (stdout += d.toString()));
    child.stderr?.on('data', d => (stderr += d.toString()));
    child.on('error', err => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', code => {
      clearTimeout(timer);
      if (killed) return;
      let envelope = null;
      try {
        const lines = stdout.trim().split('\n').filter(Boolean);
        for (let i = lines.length - 1; i >= 0; i--) {
          try {
            envelope = JSON.parse(lines[i]);
            break;
          } catch {}
        }
        if (!envelope && stdout.trim().startsWith('{')) envelope = JSON.parse(stdout);
      } catch {}
      resolve({ stdout, stderr, exitCode: code ?? 0, envelope });
    });
  });
}

async function triggerViaRest(collectorId, targetUrl, apiKey) {
  const endpoint = `https://api.brightdata.com/dca/trigger?collector=${encodeURIComponent(collectorId)}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ collector_id: collectorId, input: { url: targetUrl } }),
  });
  const text = await res.text();
  let envelope = null;
  try {
    envelope = JSON.parse(text);
  } catch {
    envelope = { raw: text };
  }
  if (!res.ok)
    return {
      stdout: text,
      stderr: `REST ${res.status} ${res.statusText}: ${text}`,
      exitCode: res.status,
      envelope,
    };
  return { stdout: text, stderr: '', exitCode: 0, envelope };
}

function validateRecords(records, collector) {
  const { schema, requiredFields } = collector;
  if (!Array.isArray(records) || records.length === 0) {
    return { ok: false, healable: true, reason: 'empty payload — 0 rows', nullRate: 1 };
  }
  let nullFields = 0;
  let totalFields = 0;
  const sampleErrors = [];
  for (const [idx, row] of records.entries()) {
    for (const req of requiredFields) {
      totalFields++;
      if (row[req] === undefined || row[req] === null || row[req] === '') {
        nullFields++;
        if (sampleErrors.length < 5) sampleErrors.push(`row#${idx} missing:${req}`);
      }
    }
    // type checks mirroring store.ts validateSchema
    for (const [k, type] of Object.entries(schema)) {
      if (row[k] === undefined || row[k] === null) continue;
      if (type === 'number' && typeof row[k] !== 'number' && isNaN(Number(row[k]))) {
        if (sampleErrors.length < 5)
          sampleErrors.push(`row#${idx} type:${k} expected number got ${typeof row[k]}:${row[k]}`);
      }
      if (type === 'date-iso' && isNaN(Date.parse(row[k]))) {
        if (sampleErrors.length < 5)
          sampleErrors.push(`row#${idx} date:${k} invalid iso:${row[k]}`);
      }
    }
  }
  const nullRate = totalFields > 0 ? nullFields / totalFields : 1;
  // Healable if >30% null or drift detected
  if (nullRate > 0.3)
    return {
      ok: false,
      healable: true,
      reason: `nullRate ${(nullRate * 100).toFixed(1)}% > 30% — ${sampleErrors.join('; ')}`,
      nullRate,
      sampleErrors,
    };
  // Guard for dramatic row count drop — if we have history median, compare; here we use absolute floor per collector
  const floor =
    collector.id === 'c_layoffs_v2_hackathon'
      ? 3
      : collector.id === 'c_llm_benchmarks_live'
        ? 2
        : 2;
  if (records.length < floor)
    return {
      ok: false,
      healable: true,
      reason: `row count ${records.length} < floor ${floor}`,
      nullRate,
      sampleErrors,
    };
  if (sampleErrors.length > 0) {
    // non-critical type drift — still healable if >30% rows affected, otherwise warn but pass
    const driftRate = sampleErrors.length / records.length;
    if (driftRate > 0.3)
      return {
        ok: false,
        healable: true,
        reason: `schema drift ${sampleErrors.join('; ')}`,
        nullRate,
        sampleErrors,
      };
  }
  return { ok: true, healable: false, reason: 'healthy', nullRate, sampleErrors };
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runCollector(collector) {
  const apiKey = process.env.BRIGHT_DATA_API_KEY || process.env.BRIGHTDATA_TOKEN || null;
  const useRest =
    (process.env.BRIGHT_DATA_USE_REST === 'true' || process.env.BRIGHT_DATA_USE_REST === '1') &&
    !!apiKey;
  const allowMock = process.env.ALLOW_MOCK_FALLBACK !== 'false';
  console.log(
    `\n[HEARTBEAT] ${collector.id} → ${collector.url} ${useRest ? '(REST)' : '(CLI)'} ${!apiKey && allowMock ? '[SIMULATION]' : ''}`
  );

  let result;
  try {
    if (useRest) {
      console.log(`[REST] POST https://api.brightdata.com/dca/trigger?collector=${collector.id}`);
      result = await triggerViaRest(collector.id, collector.url, apiKey);
    } else {
      result = await runCli(
        ['bdata', 'scraper', 'run', collector.id, collector.url, '--format', 'json'],
        90000
      );
    }

    // Infra guardrails — §27 Risk Register
    if (
      result.exitCode === 402 ||
      result.stderr.includes('402') ||
      result.stderr.includes('Payment Required')
    ) {
      console.error(
        `[CREDIT EXHAUSTED 402] ${collector.id} — credits exhausted, not healable. Check Bright Data Billing / promo wemakedevs.`
      );
      return {
        collector,
        status: 'infra',
        healable: false,
        exitCode: 0,
        result,
        records: [],
        reason: '402 credit exhausted',
      };
    }
    if (
      result.exitCode === 429 ||
      result.stderr.includes('429') ||
      result.stderr.includes('RateLimit') ||
      result.stderr.toLowerCase().includes('rate limit')
    ) {
      console.warn(
        `[RATE LIMITED 429] ${collector.id} — backing off with jitter, not healable this cycle.`
      );
      // exponential backoff with jitter (short in heartbeat — CI will retry next cron)
      const jitter = 500 + Math.random() * 1500;
      console.log(`[BACKOFF] sleeping ${Math.round(jitter)}ms before exit`);
      await sleep(jitter);
      return {
        collector,
        status: 'infra',
        healable: false,
        exitCode: 0,
        result,
        records: [],
        reason: '429 rate limited — backoff',
      };
    }
    if (result.exitCode >= 500 && result.exitCode < 600) {
      console.error(
        `[5xx TRANSIENT] ${collector.id} — target site transient ${result.exitCode}, retry only (no heal per R1).`
      );
      return {
        collector,
        status: 'infra',
        healable: false,
        exitCode: 0,
        result,
        records: [],
        reason: `5xx ${result.exitCode} transient`,
      };
    }
    if (result.exitCode === 124) {
      console.error(`[TIMEOUT] ${collector.id} — CLI timeout, treat as infra`);
      return {
        collector,
        status: 'infra',
        healable: false,
        exitCode: 0,
        result,
        records: [],
        reason: 'timeout 124',
      };
    }

    // Parse data envelope
    let records = [];
    if (result.envelope) {
      const data =
        result.envelope.data ??
        result.envelope.records ??
        result.envelope.result ??
        result.envelope.items ??
        [];
      records = Array.isArray(data) ? data : data ? [data] : [];
      // also try to parse stdout as direct array if envelope empty
      if (records.length === 0 && result.stdout) {
        try {
          const direct = JSON.parse(result.stdout);
          if (Array.isArray(direct)) records = direct;
          else if (direct.data && Array.isArray(direct.data)) records = direct.data;
        } catch {}
      }
    }

    // If CLI succeeded but produced no envelope, try stdout direct parse
    if (records.length === 0 && result.exitCode === 0 && result.stdout) {
      // last ditch: if stdout looks like json array
      const trimmed = result.stdout.trim();
      if (trimmed.startsWith('[')) {
        try {
          const arr = JSON.parse(trimmed);
          if (Array.isArray(arr)) records = arr;
        } catch {}
      }
    }

    // Mock fallback — when no key and allowMock, synthesize so local dev never blocks
    if (records.length === 0 && !apiKey && allowMock && result.exitCode === 0) {
      // This path shouldn't happen with the new envelope parsing, but keep for local demo stability
      console.log(
        `[SIMULATION] No live envelope — heartbeat treats as healthy in mock mode (store handles mock data separately)`
      );
      records = [{ _mock: true, collector: collector.id }];
    }

    // Validate
    const v = validateRecords(records, collector);
    // Persist snapshot for validate.mjs and debugging
    try {
      const dir = path.resolve('data');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, `latest-run-${collector.id}.json`),
        JSON.stringify(records, null, 2)
      );
      // also write generic latest for backwards compat (last collector wins, but we also keep per-collector)
      fs.writeFileSync(path.join(dir, 'latest-run.json'), JSON.stringify(records, null, 2));
      console.log(
        `[SNAPSHOT] wrote data/latest-run-${collector.id}.json (${records.length} records)`
      );
    } catch (e) {
      console.warn(`[SNAPSHOT] failed to write: ${e.message}`);
    }

    console.log(
      `[VALIDATE] ${collector.id} → ${v.ok ? 'HEALTHY' : 'HEALABLE'} — ${v.reason} (nullRate ${(v.nullRate * 100).toFixed(1)}%, records ${records.length})`
    );
    if (v.sampleErrors.length)
      console.log(`[VALIDATE] sample errors: ${v.sampleErrors.join(' | ')}`);
    if (result.stdout) console.log(`[STDOUT] ${result.stdout.slice(0, 1200)}`);
    if (result.stderr) console.log(`[STDERR] ${result.stderr.slice(0, 1200)}`);

    if (!v.ok && v.healable) {
      console.error(`[HEALABLE FAILURE] ${collector.id} — ${v.reason}`);
      return {
        collector,
        status: 'healable',
        healable: true,
        exitCode: 1,
        result,
        records,
        reason: v.reason,
      };
    }
    if (!v.ok) {
      console.error(`[INFRA FAILURE] ${collector.id} — ${v.reason}`);
      return {
        collector,
        status: 'infra',
        healable: false,
        exitCode: 0,
        result,
        records,
        reason: v.reason,
      };
    }
    console.log(
      `[HEARTBEAT OK] ${collector.id} — ${records.length} records, nullRate ${(v.nullRate * 100).toFixed(1)}%`
    );
    return {
      collector,
      status: 'healthy',
      healable: false,
      exitCode: 0,
      result,
      records,
      reason: v.reason,
    };
  } catch (e) {
    console.error(`[HEARTBEAT ERROR] ${collector.id}: ${e.message}`);
    if (e.stdout) console.log(`[STDOUT] ${String(e.stdout).slice(0, 800)}`);
    if (e.stderr) console.log(`[STDERR] ${String(e.stderr).slice(0, 800)}`);
    // Distinguish infra vs healable by exitCode
    if (e.exitCode === 402 || e.exitCode === 429 || (e.exitCode >= 500 && e.exitCode < 600)) {
      return {
        collector,
        status: 'infra',
        healable: false,
        exitCode: 0,
        result: {
          stdout: e.stdout || '',
          stderr: e.stderr || '',
          exitCode: e.exitCode,
          envelope: null,
        },
        records: [],
        reason: e.message,
      };
    }
    return {
      collector,
      status: 'error',
      healable: true,
      exitCode: 1,
      result: {
        stdout: e.stdout || '',
        stderr: e.message,
        exitCode: e.exitCode || 1,
        envelope: null,
      },
      records: [],
      reason: e.message,
    };
  }
}

// ── main ──
const targets = getTargets();
console.log(
  `[HEARTBEAT] Starting — ${targets.length} collector(s): ${targets.map(c => c.id).join(', ')}`
);
console.log(
  `[ENV] BRIGHT_DATA_API_KEY=${process.env.BRIGHT_DATA_API_KEY ? '***set' : 'not set'} ALLOW_MOCK_FALLBACK=${process.env.ALLOW_MOCK_FALLBACK ?? 'true'} BRIGHT_DATA_USE_REST=${process.env.BRIGHT_DATA_USE_REST ?? 'false'}`
);

let overallExit = 0;
const results = [];
for (const collector of targets) {
  const r = await runCollector(collector);
  results.push(r);
  if (r.healable) overallExit = 1; // healable dominates
}

const healable = results.filter(r => r.healable);
const healthy = results.filter(r => r.status === 'healthy');
const infra = results.filter(r => r.status === 'infra');

console.log(
  `\n[SUMMARY] healthy=${healthy.length} healable=${healable.length} infra=${infra.length} overallExit=${overallExit}`
);
if (healable.length) {
  console.error(
    `[HEAL TRIGGER] ${healable.map(r => r.collector.id).join(', ')} require healing — exiting 1 so CI heal job can fire`
  );
}
if (infra.length && !healable.length) {
  console.log(
    `[INFRA ONLY] transient infra issues — not triggering heal (per R1/R4/R7 guardrails)`
  );
}
process.exit(overallExit);
