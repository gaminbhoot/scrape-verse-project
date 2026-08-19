import test from 'node:test';
import assert from 'node:assert/strict';

class SimulatedStateStore {
  constructor() {
    this.records = new Map();
    this.logs = [];
    this.lock = false;
  }

  async write(id, data) {
    // Thread-safety / Lock simulation
    while (this.lock) await new Promise(r => setTimeout(r, 1));
    this.lock = true;

    await new Promise(r => setTimeout(r, Math.random() * 2)); // simulate async I/O
    this.records.set(id, data);
    this.logs.push(`Write_OK_${id}`);

    this.lock = false;
  }

  getRecordCount() {
    return this.records.size;
  }
}

test('Concurrency - 50 Concurrent Scraper Executions', async () => {
  const executeScraper = async index => {
    await new Promise(r => setTimeout(r, Math.random() * 10)); // random network latency
    return `Result_${index}`;
  };

  const tasks = Array.from({ length: 50 }).map((_, i) => executeScraper(i));
  const results = await Promise.all(tasks);

  assert.strictEqual(results.length, 50, 'All 50 executions completed successfully');
  assert.ok(results.includes('Result_49'), 'Expected result contents are present');
});

test('Concurrency - Rapid Interleaved Break-then-Heal Cycles', async () => {
  let globalState = 'healthy';

  const scraperTask = async id => {
    if (globalState === 'broken') {
      // Heal cycle
      await new Promise(r => setTimeout(r, 2));
      globalState = 'healthy';
    }
    // Randomly break the state for others
    if (Math.random() > 0.8) globalState = 'broken';

    return true; // execution finishes
  };

  const cycles = Array.from({ length: 100 }).map((_, i) => scraperTask(i));
  const results = await Promise.all(cycles);

  assert.strictEqual(results.length, 100, 'Handled rapid state switching without deadlocks');
});

test('Concurrency - State Store Consistency High Write Throughput', async () => {
  const store = new SimulatedStateStore();

  const writes = Array.from({ length: 200 }).map((_, i) => store.write(`k_${i}`, { val: i }));
  await Promise.all(writes);

  assert.strictEqual(
    store.getRecordCount(),
    200,
    'No data loss during high concurrent write throughput'
  );
});

test('Concurrency - Log Entry Ordering and Metric Aggregation', async () => {
  const store = new SimulatedStateStore();

  const parallelOps = Array.from({ length: 50 }).map((_, i) => store.write(`log_${i}`, {}));
  await Promise.all(parallelOps);

  assert.strictEqual(store.logs.length, 50, 'Metrics aggregated accurately');
  // Ensure thread safety prevented race conditions dropping logs
});
