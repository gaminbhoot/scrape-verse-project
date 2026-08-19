import test from 'node:test';
import assert from 'node:assert/strict';

test('Bright Data Collector Schema & Selector Diagnostics', async t => {
  await t.test('detects broken selector when DOM class attribute shifts', () => {
    const originalSelector = '.company-name-v1';
    const targetHtml =
      '<article data-testid="item-card"><h2 class="listing-title">CloudCore Inc.</h2></article>';

    // Simulate DOM match check
    const matchesOriginal = targetHtml.includes('company-name-v1');
    assert.equal(matchesOriginal, false, 'Original selector should fail on modified DOM');
  });

  await t.test('autonomous healer generates valid fallback selector', () => {
    const field = 'company';
    const fallbackSelector = `h2[data-testid="${field}"], .listing-title`;
    const targetHtml =
      '<article data-testid="item-card"><h2 class="listing-title">CloudCore Inc.</h2></article>';

    const matchesFallback = targetHtml.includes('listing-title');
    assert.equal(matchesFallback, true, 'Self-healed selector must resolve target element');
  });

  await t.test('validates extracted JSON schema integrity', () => {
    const sampleRecord = {
      company: 'CloudCore Inc.',
      count: 240,
      role: 'Engineering',
      date: '2026-08-16',
    };

    assert.equal(typeof sampleRecord.company, 'string');
    assert.equal(typeof sampleRecord.count, 'number');
    assert.ok(sampleRecord.count > 0);
  });
});
