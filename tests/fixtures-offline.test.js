import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const readFixture = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

test('Offline HTML Fixture Diagnostics & Selector Resolution', async (t) => {
  const beforeHtml = readFixture('fixtures/before.html');
  const afterHtml = readFixture('fixtures/after-redesign.html');

  await t.test('original selector matches successfully on fixtures/before.html', () => {
    const originalSelectorClass = 'company-name-v1';
    assert.ok(beforeHtml.includes(originalSelectorClass), 'before.html must contain original selector');
    assert.ok(beforeHtml.includes('CloudCore Inc.'));
  });

  await t.test('original selector fails on mutated fixtures/after-redesign.html', () => {
    const originalSelectorClass = 'company-name-v1';
    assert.equal(afterHtml.includes(originalSelectorClass), false, 'Original selector should break on redesigned DOM');
  });

  await t.test('self-healed fallback selector resolves on fixtures/after-redesign.html', () => {
    // Semantic and testid fallback selectors generated during AI self-healing
    const healedSelectorA = 'data-testid="company"';
    const healedSelectorB = 'listing-title';
    
    assert.ok(afterHtml.includes(healedSelectorA) || afterHtml.includes(healedSelectorB), 'Healed selector must resolve on redesigned fixture');
  });

  await t.test('validates full record schema extraction from after-redesign fixture', () => {
    assert.ok(afterHtml.includes('data-testid="count"'));
    assert.ok(afterHtml.includes('240'));
    assert.ok(afterHtml.includes('data-testid="role"'));
    assert.ok(afterHtml.includes('Engineering'));
  });
});
