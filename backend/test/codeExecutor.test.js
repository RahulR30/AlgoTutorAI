const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const executor = require('../services/codeExecutor');

test('a nonzero exit cannot pass even after printing the expected answer', async () => {
  const result = await executor.executeCode('javascript',
    'function solution(x) { process.exitCode = 1; return x; }',
    [{ input: 7, expectedOutput: 7 }], 'exit');
  assert.equal(result.executionResults[0].isCorrect, false);
  assert.match(result.executionResults[0].errorMessage, /failed/i);
});

test('JavaScript object inputs become positional arguments', async () => {
  const result = await executor.executeCode('javascript',
    'function add(a, b) { return a + b; }',
    [{ input: { a: 2, b: 3 }, expectedOutput: 5 }], 'args');
  assert.equal(result.overallResult.score, 100);
});

test('JavaScript keeps array inputs intact and rejects wrong answers', async () => {
  const result = await executor.executeCode('javascript',
    'function total(values) { return values.reduce((a, b) => a + b, 0); }',
    [{ input: [2, 3], expectedOutput: 5 },
      { input: [2, 3], expectedOutput: 9 }], 'arrays');
  assert.deepEqual(result.executionResults.map(r => r.isCorrect), [true, false]);
});

test('syntax errors are reported as execution failures', async () => {
  const result = await executor.executeCode('javascript', 'function solution( {',
    [{ input: 1, expectedOutput: 1 }], 'syntax');
  assert.equal(result.overallResult.score, 0);
  assert.match(result.executionResults[0].errorMessage, /SyntaxError/);
});

test('timed-out programs cannot pass after printing the expected answer', async () => {
  const result = await executor.executeCode('javascript',
    'function solution(x) { setTimeout(() => {}, 11000); return x; }',
    [{ input: 7, expectedOutput: 7 }], 'timeout');
  assert.equal(result.overallResult.score, 0);
  assert.equal(result.executionResults[0].errorMessage, 'Execution timeout');
});

test('Python round-trips JSON data without interpreting it as source', async () => {
  const values = [true, false, null, 'quote" slash\\ newline\n',
    { nested: [true, null, { text: 'a"b' }] }];
  const result = await executor.executeCode('python',
    'def solution(value):\n    return value',
    values.map(value => ({ input: { value }, expectedOutput: value })), 'python');
  assert.equal(result.overallResult.score, 100,
    JSON.stringify(result.executionResults));
});

test('Python accepts scalar, null and array inputs as one argument', async () => {
  const result = await executor.executeCode('python',
    'def solution(value):\n    return value',
    [42, null, [true, null, 'hello']].map(value => ({ input: value, expectedOutput: value })),
    'python-single');
  assert.equal(result.overallResult.score, 100);
});

test('concurrent submissions get unique directories even in the same millisecond', async () => {
  const instance = new executor.constructor();
  const dirs = [];
  instance.runTestCase = async (_language, _code, _testCase, dir) => {
    dirs.push(dir);
    return { isCorrect: true, executionTime: 0 };
  };
  const originalNow = Date.now;
  Date.now = () => 123;
  try {
    await Promise.all(Array.from({ length: 8 }, () =>
      instance.executeCode('javascript', '', [{}], 'same')));
  } finally {
    Date.now = originalNow;
  }
  assert.equal(new Set(dirs).size, 8);
  for (const dir of dirs) await assert.rejects(fs.access(dir));
});

test('unexpected execution failures still clean up temporary files', async () => {
  const instance = new executor.constructor();
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'executor-test-'));
  instance.tempDir = root;
  instance.runTestCase = async () => { throw new Error('unexpected failure'); };
  try {
    await assert.rejects(instance.executeCode('javascript', '', [{}], 'cleanup'));
    assert.deepEqual(await fs.readdir(root), []);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
