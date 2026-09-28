// Isolated local demo: no live database or API keys are used.
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { randomBytes } = require('node:crypto');

async function main() {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.JWT_SECRET = randomBytes(32).toString('hex');
  process.env.NODE_ENV = 'development';
  await mongoose.connect(process.env.MONGODB_URI);
  const Problem = require('../models/Problem');
  for (const problem of require('./demoProblems')) await Problem.create(problem);
  const User = require('../models/User');
  const bcrypt = require('bcryptjs');
  await User.create({ username: 'demo', email: 'demo@algotutor.ai', password: await bcrypt.hash('demo123', 10) });
  const app = require('../index');
  const server = app.listen(Number(process.env.PORT) || 5001, '127.0.0.1', () => {
    console.log('Local demo ready. Start the frontend with npm start, then register an account.');
    console.log('Three practice problems are seeded. Demo data is discarded when stopped.');
  });
  const stop = async () => {
    server.close();
    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}
main().catch(error => { console.error(error.message); process.exit(1); });
