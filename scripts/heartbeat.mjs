#!/usr/bin/env node
// Heartbeat: runs collector and exits non-zero on failure/empty/drift
import { spawn } from 'node:child_process';
const collector = process.env.COLLECTOR_ID || 'c_layoffs_v2_hackathon';
const url = process.env.TARGET_URL || 'https://layoffs.fyi/live-data';

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['@brightdata/cli', ...args], { stdio: 'inherit' });
    child.on('close', (code) => resolve(code));
    child.on('error', reject);
  });
}

const code = await run(['bdata', 'scraper', 'run', collector, url, '--format', 'json']);
if (code !== 0) {
  console.error(`Heartbeat failed for ${collector} — triggering heal`);
  process.exit(1);
}
console.log(`Heartbeat ok for ${collector}`);
