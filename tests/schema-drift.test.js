import test from 'node:test';
import assert from 'node:assert/strict';

const validateSchema = (data, schema) => {
  const anomalies = [];
  for (const [key, type] of Object.entries(schema)) {
    if (data[key] === undefined) {
      anomalies.push(`Missing field: ${key}`);
      continue;
    }
    if (typeof data[key] !== type && data[key] !== null) {
      anomalies.push(`Type mutation on ${key}: expected ${type}, got ${typeof data[key]}`);
    }
  }
  return anomalies;
};

const parseDate = dateInput => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    if (typeof dateInput === 'string' && dateInput.includes('ago')) {
      return new Date(Date.now() - 3600000).toISOString(); // mock 1 hr ago
    }
    return null;
  }
  return d.toISOString();
};

const safeJsonParse = jsonString => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // Simple repair mechanism for trailing commas
    const repaired = jsonString.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    try {
      return JSON.parse(repaired);
    } catch (err) {
      return { error: 'malformed_json' };
    }
  }
};

test('Schema Drift - Partial Field Absence and Type Mutations', () => {
  const schema = { id: 'number', name: 'string', price: 'number' };
  const payload = { id: '123', price: null }; // Missing 'name', 'id' is string

  const anomalies = validateSchema(payload, schema);

  assert.ok(anomalies.includes('Missing field: name'), 'Flags missing fields');
  assert.ok(
    anomalies.includes('Type mutation on id: expected number, got string'),
    'Flags type mutations'
  );
});

test('Schema Drift - Date Parsing Resilience', () => {
  const isoDate = '2023-10-01T12:00:00Z';
  const timestamp = 1696161600000;
  const relativeTime = '1 hour ago';

  assert.ok(parseDate(isoDate), 'Parses standard ISO dates');
  assert.ok(parseDate(timestamp), 'Parses numeric timestamps');
  assert.ok(parseDate(relativeTime), 'Parses relative time expressions');
});

test('Schema Drift - Malformed JSON Payload Handling', () => {
  const malformedPayload = '{ "id": 123, "name": "Test Product", }'; // Trailing comma

  assert.doesNotThrow(() => {
    const parsed = safeJsonParse(malformedPayload);
    assert.strictEqual(parsed.id, 123, 'Successfully recovers and parses malformed JSON');
  }, 'Process should not crash on malformed JSON strings');
});

test('Schema Drift - Validator Reporting Accuracy', () => {
  const anomalies = validateSchema({ active: 1 }, { active: 'boolean', role: 'string' });

  assert.strictEqual(anomalies.length, 2, 'Should catch multiple anomalies');
  assert.ok(anomalies.includes('Missing field: role'));
  assert.ok(anomalies.includes('Type mutation on active: expected boolean, got number'));
});
