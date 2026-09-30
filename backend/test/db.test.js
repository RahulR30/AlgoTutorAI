const { test } = require('node:test');
const assert = require('node:assert/strict');
const { connectWithRetry } = require('../config/db');

const noSleep = async () => {};

test('retries until MongoDB becomes reachable', async () => {
  let calls = 0;
  const result = await connectWithRetry({
    attempts: 3,
    sleep: noSleep,
    connect: async () => {
      calls++;
      if (calls < 3) throw new Error('querySrv ENOTFOUND');
      return 'connected';
    },
  });
  assert.equal(result, 'connected');
  assert.equal(calls, 3);
});

test('gives up after the configured attempts with exponential backoff', async () => {
  const waits = [];
  let calls = 0;
  await assert.rejects(connectWithRetry({
    attempts: 4,
    delayMs: 100,
    sleep: async (ms) => waits.push(ms),
    connect: async () => { calls++; throw new Error('querySrv ENOTFOUND'); },
  }), /ENOTFOUND/);
  assert.equal(calls, 4);
  assert.deepEqual(waits, [100, 200, 400]);
});
