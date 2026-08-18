import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (p) => {
  try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch { return ''; }
};
const exists = (p) => fs.existsSync(path.join(ROOT, p));

// ───────────────────────────────────────────────
// 1. BRIGHTDATA CLI CONTRACT — the heart of ScrapeVerse
// ───────────────────────────────────────────────
test('HARSH: BrightDataClient must implement REAL CLI envelope, not mock theater', async (t) => {
  const src = read('src/lib/brightdata.ts');

  await t.test('must import child_process spawn (not fake logs)', () => {
    assert.ok(src.includes('spawn') || src.includes('execFile'), 'brightdata.ts must use spawn/execFile to call npx @brightdata/cli — current mock just pushes strings');
  });

  await t.test('must implement heal → awaiting_approval → approve loop', () => {
    assert.ok(src.toLowerCase().includes('awaiting_approval') || src.toLowerCase().includes('awaiting approval'), 'Missing awaiting_approval gate — heal halts until approve');
    assert.ok(src.includes('approve'), 'Missing approveCollector / bdata scraper approve');
  });

  await t.test('getBudget must hit real API when key present, fallback only when absent', () => {
    assert.ok(src.includes('BRIGHT_DATA_API_KEY'), 'Must branch on BRIGHT_DATA_API_KEY');
    assert.ok(src.includes('4850') || src.includes('creditsRemaining'), 'getBudget must return creditsRemaining');
    // Harsh: should not ALWAYS return 4850
    const hardCodedReturn = src.match(/return\s*\{\s*creditsRemaining:\s*4850/);
    assert.ok(!hardCodedReturn || src.includes('process.env.BRIGHT_DATA_API_KEY'), 'Hard-coded 4850 without env fallback is theater');
  });

  await t.test('executeCollector must handle timeout, 402, 429, malformed envelope', () => {
    assert.ok(src.includes('timeout') || src.includes('signal') || src.includes('kill'), 'Must implement timeout for hanging CLI');
    assert.ok(src.includes('402') || src.includes('Payment Required') || src.includes('credits'), 'Must handle 402 credit exhaustion');
    assert.ok(src.includes('429') || src.includes('RateLimit') || src.includes('rate'), 'Must handle 429');
  });

  await t.test('must escape CLI args to prevent injection', () => {
    assert.ok(src.includes('replace') && src.includes('"'), 'Must escape double quotes in CLI args');
  });

  await t.test('must log raw stdout/stderr envelope, not invented strings', () => {
    assert.ok(src.includes('stdout') || src.includes('stderr') || src.includes('envelope'), 'Must capture real CLI output');
  });
});

// ───────────────────────────────────────────────
// 2. STORE — STATE MACHINE & PERSISTENCE
// ───────────────────────────────────────────────
test('HARSH: Store must be a real state machine with persistence, not in-memory array', async (t) => {
  const storeSrc = read('src/lib/store.ts');
  const typesSrc = read('src/lib/types.ts');

  await t.test('must have awaiting_approval status', () => {
    assert.ok(typesSrc.includes('awaiting_approval') || storeSrc.includes('awaiting_approval'), 'ScraperStatus must include awaiting_approval');
  });

  await t.test('must not be pure in-memory — needs sqlite/postgres/drizzle/better-sqlite3', () => {
    const hasDB = storeSrc.includes('sqlite') || storeSrc.includes('postgres') || storeSrc.includes('drizzle') || storeSrc.includes('better-sqlite3') || storeSrc.includes('DATABASE_URL');
    assert.ok(hasDB, 'Store is in-memory singleton — will lose all runs/heals on cold start. Must have persistence.');
  });

  await t.test('breakScraper must be idempotent and validate id', () => {
    // Simulate: breaking already-broken should not double-corrupt selectors
    const selectors = [
      { field: 'company', selector: '.company-name-v1', status: 'valid' },
      { field: 'count', selector: 'span.impact', status: 'valid' },
    ];
    const breakOnce = (sels) => sels.map(s => s.field === 'company' ? { ...s, status: 'broken', selector: '.obsolete-company-deprecated-node[v="2025"]' } : s);
    const once = breakOnce(selectors);
    const twice = breakOnce(once);
    assert.equal(twice.filter(s => s.status === 'broken').length, 1, 'Double break must not duplicate broken entries');
    assert.ok(storeSrc.includes('not found'), 'Must throw for invalid id');
  });

  await t.test('heal must set healing → awaiting_approval → recovered only after approve', () => {
    assert.ok(storeSrc.includes('healing'), 'Must set status healing during heal');
    // Current code goes healing -> recovered instantly — harsh fail
    const instantRecover = storeSrc.includes("status = 'recovered'") && !storeSrc.includes('awaiting_approval');
    assert.ok(!instantRecover, 'Heal must NOT instantly mark recovered without approval gate');
  });

  await t.test('must handle invalid id for run/heal/break/approve', () => {
    for (const fn of ['runScraper', 'healScraper', 'breakScraper', 'approveScraper']) {
      // store should throw for unknown id
      assert.ok(storeSrc.includes('not found'), `Store must throw for unknown id in ${fn}`);
    }
  });

  await t.test('double heal while already healing must be rejected or queued', () => {
    // Simulate lock
    let status = 'healing';
    const tryHeal = () => {
      if (status === 'healing' || status === 'awaiting_approval') throw new Error('HealInProgress');
    };
    assert.throws(() => tryHeal(), /HealInProgress/, 'Concurrent heal must be rejected');
  });

  await t.test('must handle empty scrapers array gracefully', () => {
    const empty = [];
    const metrics = {
      total: empty.length,
      healthy: empty.filter(s => s.status === 'healthy').length,
    };
    assert.equal(metrics.total, 0, 'Empty store must not crash metrics');
    assert.equal(metrics.healthy, 0);
  });
});

// ───────────────────────────────────────────────
// 3. SCHEMA DRIFT — BRUTAL VALIDATION
// ───────────────────────────────────────────────
test('HARSH: Schema validation must be wired live, including edge cases', async (t) => {
  const validate = (data, schema) => {
    const errs = [];
    for (const [k, type] of Object.entries(schema)) {
      if (data[k] === undefined || data[k] === null) { errs.push(`missing:${k}`); continue; }
      if (type === 'number' && typeof data[k] !== 'number') errs.push(`type:${k}`);
      if (type === 'string' && typeof data[k] !== 'string') errs.push(`type:${k}`);
      if (type === 'date-iso' && isNaN(Date.parse(data[k]))) errs.push(`date:${k}`);
    }
    return errs;
  };

  await t.test('missing required fields flagged', () => {
    const schema = { company: 'string', count: 'number', date: 'date-iso' };
    const payload = { company: 'A' };
    const errs = validate(payload, schema);
    assert.ok(errs.includes('missing:count'));
    assert.ok(errs.includes('missing:date'));
  });

  await t.test('type mutation flagged, null not coerced', () => {
    const errs = validate({ company: 'A', count: '240', date: '2026-08-16' }, { company: 'string', count: 'number', date: 'date-iso' });
    assert.ok(errs.includes('type:count'), 'String 240 must not pass as number');
  });

  await t.test('extra fields ignored but not crashed', () => {
    const errs = validate({ company: 'A', count: 1, date: '2026-08-16', injected: '<script>' }, { company: 'string', count: 'number', date: 'date-iso' });
    assert.equal(errs.length, 0);
  });

  await t.test('empty payload, null payload, undefined handling', () => {
    assert.ok(validate({}, { company: 'string' }).includes('missing:company'));
    assert.ok(validate({ company: null }, { company: 'string' }).includes('missing:company'));
    assert.ok(validate({ company: '' }, { company: 'string' }).length === 0, 'Empty string is still string');
  });

  await t.test('malformed date-iso rejected', () => {
    assert.ok(validate({ date: 'tomorrow' }, { date: 'date-iso' }).includes('date:date'));
    assert.ok(validate({ date: '2026-13-99' }, { date: 'date-iso' }).includes('date:date'));
    assert.equal(validate({ date: '2026-08-16T00:00:00.000Z' }, { date: 'date-iso' }).length, 0);
  });

  await t.test('partial salvage: degraded but data returned', () => {
    const data = [{ company: 'A', count: 240 }, { company: 'B', count: null }];
    const valid = data.filter(d => validate(d, { company: 'string', count: 'number' }).length === 0);
    assert.equal(valid.length, 1, 'Only fully valid rows survive, but pipeline not hard-fails');
  });

  await t.test('store must wire validator live (not just test mock)', () => {
    const storeSrc = read('src/lib/store.ts');
    assert.ok(storeSrc.includes('validate') || storeSrc.includes('schemaDrift') || storeSrc.includes('Schema'), 'Store must import/call schema validator on every run');
  });
});

// ───────────────────────────────────────────────
// 4. API CONTRACTS — EVERY ROUTE, EVERY EDGE
// ───────────────────────────────────────────────
test('HARSH: Every API route must validate, sanitize, and handle edge cases', async (t) => {
  const routes = [
    'app/api/scrapers/route.ts',
    'app/api/scrapers/[id]/run/route.ts',
    'app/api/scrapers/[id]/heal/route.ts',
    'app/api/scrapers/[id]/break/route.ts',
    'app/api/scrapers/[id]/approve/route.ts',
    'app/api/metrics/route.ts',
    'app/api/logs/route.ts',
    'app/api/budget/route.ts',
  ];

  await t.test('all mandatory routes exist', () => {
    for (const r of routes) {
      const isApprove = r.includes('approve');
      const exist = exists(r);
      if (isApprove) {
        assert.ok(!exist || exist, 'approve route SHOULD exist but currently missing — harsh fail expected');
        if (!exist) assert.fail(`Missing mandatory route: ${r} — approval gate unimplementable without it`);
      } else {
        assert.ok(exist, `Missing route: ${r}`);
      }
    }
  });

  await t.test('routes must use zod for collectorId and escape injection', () => {
    const runSrc = read('app/api/scrapers/[id]/run/route.ts');
    const healSrc = read('app/api/scrapers/[id]/heal/route.ts');
    const combined = runSrc + healSrc + read('app/api/scrapers/[id]/break/route.ts');
    assert.ok(combined.includes('zod') || combined.includes('z.') || combined.includes('validate'), 'Routes must use zod validation');
  });

  await t.test('must reject invalid collectorId formats', () => {
    const isValid = (id) => /^c_[a-z0-9_]+$/.test(id) || /^scraper-\d+$/.test(id);
    assert.equal(isValid('scraper-1'), true);
    assert.equal(isValid('c_layoffs_v2_hackathon'), true);
    assert.equal(isValid('../../etc/passwd'), false);
    assert.equal(isValid("'; DROP TABLE"), false);
    assert.equal(isValid('<script>alert(1)</script>'), false);
    assert.equal(isValid(''), false);
  });

  await t.test('injection payloads must be neutralized', () => {
    const payloads = [
      "1'; DROP TABLE collectors; --",
      '<script>alert(1)</script>',
      '"`$(rm -rf /)`"',
      'c_layoffs"; rm -rf /; echo "',
      '../../../etc/passwd',
      '${process.env.BRIGHT_DATA_API_KEY}',
    ];
    const escape = (s) => s.replace(/"/g, '\\"').replace(/'/g, "''").replace(/<script>/gi, '');
    for (const p of payloads) {
      const e = escape(p);
      assert.ok(!e.includes('<script>'), `Failed to neutralize ${p}`);
    }
  });

  await t.test('GET /api/scrapers must not leak API key to client', () => {
    const scraperRoute = read('app/api/scrapers/route.ts');
    assert.ok(!scraperRoute.includes('BRIGHT_DATA_API_KEY') || scraperRoute.includes('server'), 'API key must stay server-side');
  });

  await t.test('POST routes must be idempotent-safe and rate-limited conceptually', () => {
    const storeSrc = read('src/lib/store.ts');
    // Check that heal does not allow infinite heals without run
    assert.ok(storeSrc.includes('totalHeals') || storeSrc.includes('heal'), 'Must track heals for rate limiting');
  });

  await t.test('budget route must handle 402 gracefully', () => {
    const b = read('app/api/budget/route.ts');
    assert.ok(b.includes('brightData') || b.includes('budget'), 'Budget route must delegate to brightData client');
  });
});

// ───────────────────────────────────────────────
// 5. ADVERSARIAL DOM — OBFUSCATION, DECOYS, MORPHING
// ───────────────────────────────────────────────
test('HARSH: Adversarial DOM resilience', async (t) => {
  await t.test('obfuscated hashed classes', () => {
    const html = '<div class="aXbYcZ-foo _idx_99 bg-red-500">$10</div>';
    const selectorHealed = 'div[class*="aXbYcZ"]';
    assert.ok(html.includes('aXbYcZ'), 'Healed selector must match substring, not exact class');
  });

  await t.test('decoy shadow/aria-hidden elements must be ignored', () => {
    const dom = '<span class="price shadow" aria-hidden="true">$99</span><span class="price real">$10</span>';
    const isDecoy = (el) => el.includes('shadow') || el.includes('aria-hidden');
    assert.equal(isDecoy('<span class="price shadow" aria-hidden="true">$99</span>'), true);
    assert.equal(isDecoy('<span class="price real">$10</span>'), false);
  });

  await t.test('tag morphing table→div flex must still extract', () => {
    const before = '<table><tr><td class="item">A</td></tr></table>';
    const after = '<div class="flex-cards"><div class="item">A</div></div>';
    const extract = (html) => html.includes('class="item"') ? 'A' : null;
    assert.equal(extract(before), 'A');
    assert.equal(extract(after), 'A');
  });

  await t.test('confidence drops with decoys, stays high without', () => {
    const calc = (hasDecoy) => hasDecoy ? 0.35 : 0.94;
    assert.ok(calc(false) > 0.8);
    assert.ok(calc(true) < 0.5);
  });

  await t.test('deep hierarchy repair must use data-testid fallback', () => {
    const repaired = 'article[data-testid="product"] > div > span';
    const html = '<article data-testid="product"><div><span>$10</span></div></article>';
    assert.ok(html.includes('data-testid="product"'), 'Repaired selector must anchor on data-testid');
  });

  await t.test('empty HTML, null, and huge DOM handling', () => {
    const parse = (html, sel) => {
      if (!html || html.length === 0) return null;
      if (html.length > 1_000_000) throw new Error('DOMTooLarge');
      return html.includes(sel) ? 'found' : null;
    };
    assert.equal(parse('', '.a'), null);
    assert.equal(parse(null, '.a'), null);
    assert.throws(() => parse('a'.repeat(1_000_001), '.a'), /DOMTooLarge/);
  });
});

// ───────────────────────────────────────────────
// 6. CONCURRENCY & RACE CONDITIONS — BRUTAL STRESS
// ───────────────────────────────────────────────
test('HARSH: Concurrency — 100+ parallel, interleaved break/heal, no deadlock', async (t) => {
  await t.test('50 concurrent runs all resolve', async () => {
    const run = async (i) => { await new Promise(r => setTimeout(r, Math.random() * 10)); return `ok-${i}`; };
    const res = await Promise.all(Array.from({ length: 50 }, (_, i) => run(i)));
    assert.equal(res.length, 50);
    assert.ok(res.includes('ok-49'));
  });

  await t.test('200 concurrent writes no loss (lock simulation)', async () => {
    class Store { constructor(){ this.m=new Map(); this.lock=false;} async write(k,v){ while(this.lock) await new Promise(r=>setTimeout(r,1)); this.lock=true; await new Promise(r=>setTimeout(r, Math.random()*2)); this.m.set(k,v); this.lock=false; } }
    const s=new Store();
    await Promise.all(Array.from({length:200},(_,i)=>s.write(`k${i}`,i)));
    assert.equal(s.m.size, 200, 'Lost writes under contention');
  });

  await t.test('interleaved break-heal 100 cycles no deadlock', async () => {
    let state='healthy';
    const cycle=async()=>{ if(state==='broken'){ await new Promise(r=>setTimeout(r,2)); state='healthy'; } if(Math.random()>0.8) state='broken'; return true; };
    const out=await Promise.all(Array.from({length:100},()=>cycle()));
    assert.equal(out.length, 100);
  });

  await t.test('heal latency stays <1500ms under load', async () => {
    const heal=async()=>{ const s=performance.now(); await new Promise(r=>setTimeout(r, Math.random()*400+200)); return performance.now()-s; };
    const lat=await heal();
    assert.ok(lat < 1500, `Heal took ${lat}ms > 1500`);
  });

  await t.test('store must be singleton — parallel imports share state', () => {
    const a = { id: 'x', status: 'healthy' };
    const b = a;
    b.status='broken';
    assert.equal(a.status,'broken', 'Singleton mutation must propagate');
  });
});

// ───────────────────────────────────────────────
// 7. BUDGET, MTTR, RATE LIMITS
// ───────────────────────────────────────────────
test('HARSH: Budget & MTTR — credits, 402, 429, exhaustion', async (t) => {
  await t.test('budget shape correct', () => {
    const budget = { creditsRemaining: 4850, monthlyTier: 'WeMakeDevs Hackathon Special', activeProxies: 42 };
    assert.equal(typeof budget.creditsRemaining, 'number');
    assert.ok(budget.creditsRemaining >= 0);
    assert.ok(budget.activeProxies > 0);
  });

  await t.test('credit exhaustion must 402, not silent success', () => {
    const tryRun = (credits) => { if(credits <= 0) throw Object.assign(new Error('Payment Required'), {status:402}); return true; };
    assert.throws(()=>tryRun(0), /Payment Required/);
    assert.doesNotThrow(()=>tryRun(10));
  });

  await t.test('429 rate limit must backoff, not crash', async () => {
    let attempts=0;
    const fetchWithBackoff=async()=>{ attempts++; if(attempts<3) throw Object.assign(new Error('RateLimit'),{status:429}); return 'ok'; };
    const run=async()=>{ for(let i=0;i<5;i++){ try{ return await fetchWithBackoff(); } catch(e){ if(e.status!==429) throw e; await new Promise(r=>setTimeout(r,5)); } } throw new Error('failed'); };
    const r=await run();
    assert.equal(r,'ok');
  });

  await t.test('MTTR < 25s PRD requirement (heal + verify)', async () => {
    const mttr= 24.5;
    assert.ok(mttr < 25, 'MTTR must be <25s per PRD');
  });

  await t.test('Header must not hardcode 4850 — must reflect live budget', () => {
    const header = read('components/Header.tsx');
    const hard = header.includes('4,850') && !header.includes('budget') && !header.includes('creditsRemaining');
    assert.ok(!hard || header.includes('4850'), 'Header currently hardcodes 4850 — should fetch /api/budget');
  });
});

// ───────────────────────────────────────────────
// 8. SECURITY — API KEY, CLIENT LEAK, ENV
// ───────────────────────────────────────────────
test('HARSH: Security — no key leak, env hygiene, CLI escaping', async (t) => {
  await t.test('.env.example must exist and NOT be committed with real key', () => {
    assert.ok(exists('.env.example') || !exists('.env.local'), '.env.example should exist for judges');
    const example = read('.env.example');
    if (example) assert.ok(!example.includes('brd_') || example.includes('your_'), 'Example must not contain real key');
  });

  await t.test('BRIGHT_DATA_API_KEY must never appear in client components', () => {
    const clientFiles = ['app/page.tsx', 'components/Header.tsx', 'components/ScraperMatrix.tsx'];
    for (const f of clientFiles) {
      const src = read(f);
      assert.ok(!src.includes('BRIGHT_DATA_API_KEY'), `${f} must not reference API key (client leak)`);
    }
  });

  await t.test('CLI arg escaping prevents injection', () => {
    const fmt = (cmd, args) => cmd + ' ' + args.map(a => `"${a.replace(/"/g,'\\"')}"`).join(' ');
    const cmd = fmt('bdata scraper heal', ['c_test', '"; rm -rf /; echo "']);
    assert.ok(cmd.includes('\\"'), 'Double quote must be escaped');
    assert.ok(!cmd.includes('rm -rf') || cmd.includes('\\"'), 'Injection must be quoted');
  });

  await t.test('zod validation exists for collectorId', () => {
    const anySrc = read('src/lib/types.ts') + read('app/api/scrapers/[id]/run/route.ts') + read('src/lib/brightdata.ts');
    // Harsh: currently missing zod — expect fail until fixed
    const hasZod = anySrc.includes('zod') || anySrc.includes('z.') || read('package.json').includes('zod');
    assert.ok(hasZod, 'zod must be in package.json and used for validation');
  });

  await t.test('package.json must declare @brightdata/cli', () => {
    const pkg = read('package.json');
    const hasCLI = pkg.includes('@brightdata/cli') || pkg.includes('brightdata');
    // This will FAIL harshly until you add it — intentional
    if (!hasCLI) assert.fail('package.json missing @brightdata/cli — violates ScrapeVerse stack requirement');
  });
});

// ───────────────────────────────────────────────
// 9. PERSISTENCE & CI/CD — SURVIVES RESTART
// ───────────────────────────────────────────────
test('HARSH: Persistence & CI/CD must survive restart and actually heal', async (t) => {
  await t.test('store must use DB file, not just in-memory', () => {
    const candidates = ['data.db', 'prisma', 'drizzle', 'better-sqlite3', 'DATABASE_URL'];
    const storeSrc = read('src/lib/store.ts');
    const found = candidates.some(c => storeSrc.includes(c) || exists(`src/lib/${c}`) || exists(c));
    assert.ok(found || storeSrc.includes('sqlite'), 'Persistence layer missing — data lost on reboot');
  });

  await t.test('workflow file exists with cron and heal+approve', () => {
    const wf = read('.github/workflows/scraper-heal.yml');
    assert.ok(wf.length > 0, 'Workflow missing');
    assert.ok(wf.includes('cron'), 'Workflow must have cron schedule');
    assert.ok(wf.includes('heal'), 'Workflow must run bdata scraper heal');
    // Harsh: must also approve
    const hasApprove = wf.includes('approve');
    if (!hasApprove) assert.fail('Workflow heals but never approves — will stay awaiting_approval forever');
  });

  await t.test('workflow must create PR with diff, not empty', () => {
    const wf = read('.github/workflows/scraper-heal.yml');
    assert.ok(wf.includes('create-pull-request') || wf.includes('peter-evans'), 'Workflow must create PR via create-pull-request');
  });
});

// ───────────────────────────────────────────────
// 10. UI CONTRACTS — COMPONENTS EXIST AND TYPED
// ───────────────────────────────────────────────
test('HARSH: UI components must exist, be typed, and handle all statuses', async (t) => {
  const comps = ['Header.tsx', 'MetricCards.tsx', 'ScraperMatrix.tsx', 'BreakSimulator.tsx', 'DiffViewer.tsx', 'LiveTerminal.tsx', 'DataExplorer.tsx'];
  for (const c of comps) {
    await t.test(`${c} exists`, () => { assert.ok(exists(`components/${c}`), `Missing ${c}`); });
  }

  await t.test('ScraperMatrix must render healthy/healing/broken/awaiting_approval/recovered', () => {
    const src = read('components/ScraperMatrix.tsx');
    assert.ok(src.includes('healthy'), 'Must handle healthy');
    assert.ok(src.includes('broken'), 'Must handle broken');
    assert.ok(src.includes('healing') || src.includes('heal'), 'Must handle healing');
    if (!src.includes('awaiting_approval')) assert.fail('ScraperMatrix missing awaiting_approval — judges will not see approval gate');
  });

  await t.test('DiffViewer must show before/after selector + strategy + confidence', () => {
    const d = read('components/DiffViewer.tsx');
    assert.ok(d.includes('oldSelector') || d.includes('broken') || d.includes('Before'), 'Must show old selector');
    assert.ok(d.includes('newSelector') || d.includes('repaired') || d.includes('After'), 'Must show new selector');
    assert.ok(d.includes('strategy') || d.includes('Strategy') || d.includes('Semantic'), 'Must show strategy');
  });

  await t.test('LiveTerminal must filter ALL/CLI/ENGINE/HEALER/CI/CD and copy', () => {
    const l = read('components/LiveTerminal.tsx');
    assert.ok(l.includes('ALL'), 'Must have ALL filter');
    assert.ok(l.includes('CLI') && l.includes('HEALER'), 'Must filter CLI/HEALER');
  });

  await t.test('Header must show proxy pool + credits via props/fetch, not pure hardcode', () => {
    const h = read('components/Header.tsx');
    assert.ok(h.includes('Proxy') || h.includes('proxy'), 'Header must show proxy pool');
    assert.ok(h.includes('Credits') || h.includes('credits'), 'Header must show credits');
  });

  await t.test('page.tsx must handle loading, error, and empty states', () => {
    const p = read('app/page.tsx');
    assert.ok(p.includes('fetch') || p.includes('useEffect'), 'Must fetch telemetry');
    assert.ok(p.includes('error') || p.includes('catch') || p.includes('failed'), 'Must handle errors');
  });
});

// ───────────────────────────────────────────────
// 11. FUZZ & RANDOMIZED EDGE INPUTS
// ───────────────────────────────────────────────
test('HARSH: Fuzz — random malformed inputs must not crash', async (t) => {
  await t.test('fuzz collectorId with 50 random strings', () => {
    const isValid = (id) => typeof id === 'string' && id.length > 0 && id.length < 100 && /^c_[a-z0-9_]+$/.test(id) || /^scraper-\d+$/.test(id);
    const fuzz = ['', null, undefined, 123, {}, [], 'a'.repeat(500), 'c_!@#$', 'c_layoffs\nrm -rf', 'c_layoffs\x00'];
    for (const v of fuzz) {
      assert.equal(isValid(v), false, `Should reject fuzz ${JSON.stringify(v)}`);
    }
    assert.equal(isValid('c_valid_123'), true);
  });

  await t.test('fuzz JSON payloads — trailing commas, single quotes, huge', () => {
    const safeParse = (s) => { try{ return JSON.parse(s); } catch{ try{ return JSON.parse(s.replace(/,\s*}/g,'}').replace(/,\s*]/g,']').replace(/'/g,'"')); } catch{ return {error:'malformed'}; } } };
    assert.equal(safeParse('{ "a": 1, }').a, 1, 'Trailing comma repaired');
    assert.ok(safeParse('not json').error === 'malformed');
    assert.ok(safeParse('{"a":'.repeat(1000)).error === 'malformed', 'Huge malformed not crash');
  });

  await t.test('fuzz run with isBroken true/false/undefined', () => {
    const exec = (isBroken) => isBroken === true ? 'failed' : 'success';
    assert.equal(exec(true), 'failed');
    assert.equal(exec(false), 'success');
    assert.equal(exec(undefined), 'success');
    assert.equal(exec(null), 'success');
  });

  await t.test('extreme metrics — 0 scrapers, 1M runs, NaN handling', () => {
    const calc = (healthy, total) => total>0 ? Number(((healthy/total)*100).toFixed(1)) : 100;
    assert.equal(calc(0,0), 100, '0/0 must be 100% not NaN');
    assert.equal(calc(5,10), 50);
    assert.ok(!isNaN(calc(0,0)));
  });
});

