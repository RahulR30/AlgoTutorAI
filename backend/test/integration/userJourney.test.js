const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongo, server, base, token, problem;

before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.JWT_SECRET = 'integration-only-secret-not-for-deployment';
  process.env.MONGODB_URI = mongo.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
  const Problem = require('../../models/Problem');
  problem = await Problem.create(require('../../scripts/demoProblems')[0]);
  const app = require('../../index');
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
async function request(url, method = 'GET', data) {
  const response = await fetch(base + url, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(data ? { body: JSON.stringify(data) } : {})
  });
  const body = await response.json();
  assert.ok(response.ok, `${method} ${url}: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

test('signup, login, submission, history and progress share the same database', async () => {
  const registration = await request('/auth/register', 'POST', {
    username: 'testlearner', email: 'learner@example.com', password: 'test-password'
  });
  assert.equal(registration.user.username, 'testlearner');
  assert.equal(JSON.stringify(registration.user).includes('password'), false);
  token = registration.token;
  const login = await request('/auth/login', 'POST', { email: 'learner@example.com', password: 'test-password' });
  assert.equal(login.user.username, 'testlearner');
  token = login.token;
  assert.equal((await request('/users/profile')).user.username, 'testlearner');
  for (const route of ['/problems/random', '/problems/popular', '/problems/recent', '/problems/topic/arrays', '/problems/difficulty/easy', '/problems/topics/list']) await request(route);
  const topics = (await request('/problems/topics/list')).topics;
  assert.deepEqual(topics.find(t => t.name === 'arrays').counts, { easy: 1, medium: 0, hard: 0 });
  const code = 'function twoSum(nums, target) { for (let i=0;i<nums.length;i++) for(let j=i+1;j<nums.length;j++) if(nums[i]+nums[j]===target) return [i,j]; }';
  for (let i = 0; i < 2; i++) {
    const result = await request(`/problems/${problem.id}/submit`, 'POST', { language: 'javascript', code });
    assert.equal(result.submission.overallResult.isCorrect, true);
  }
  const failed = await request(`/problems/${problem.id}/submit`, 'POST', { language: 'javascript', code: 'function twoSum() { throw new Error("bad solution"); }' });
  assert.equal(failed.submission.overallResult.isCorrect, false);
  await request('/auth/profile', 'PUT', { firstName: 'Learner' });
  assert.equal((await request('/auth/me')).user.profile.firstName, 'Learner');
  const history = await request('/users/submissions');
  assert.equal(history.submissions.length, 3);
  assert.equal(history.submissions[0].status, 'completed');
  const profile = (await request('/auth/me')).user;
  assert.equal(profile.learningStats.totalProblemsSolved, 1);
  assert.equal(profile.learningStats.totalSubmissions, 3);
  assert.equal(profile.learningStats.correctSubmissions, 2);
  assert.equal((await request('/users/progress')).progress.overall.totalProblemsSolved, 1);
  assert.equal((await request('/users/leaderboard')).leaderboard[0].username, 'testlearner');
  assert.equal((await request('/users/stats')).stats.submissions.total, 3);
  assert.ok((await request('/users/achievements')).achievements.some(a => a.name === 'First Steps'));
});
