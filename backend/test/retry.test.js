const { test } = require('node:test');
const assert = require('node:assert/strict');
const connectWithRetry = require('../config/retry');

const noSleep = async () => {};

test('retries until MongoDB becomes reachable', async () => {
  let calls = 0;
  const result = await connectWithRetry(async () => {
    calls++;
    if (calls < 3) throw new Error('querySrv ENOTFOUND');
    return 'connected';
  }, { attempts: 3, sleep: noSleep });
  assert.equal(result, 'connected');
  assert.equal(calls, 3);
});

test('gives up after the configured attempts with exponential backoff', async () => {
  const waits = [];
  let calls = 0;
  await assert.rejects(connectWithRetry(
    async () => { calls++; throw new Error('querySrv ENOTFOUND'); },
    { attempts: 4, delayMs: 100, sleep: async (ms) => waits.push(ms) },
  ), /ENOTFOUND/);
  assert.equal(calls, 4);
  assert.deepEqual(waits, [100, 200, 400]);
});
