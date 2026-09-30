// Atlas can be briefly unreachable (e.g. DNS lookups failing while a cluster
// resumes), so retry with exponential backoff before giving up.
const connectWithRetry = async (connect, {
  attempts = Number(process.env.MONGODB_CONNECT_ATTEMPTS) || 5,
  delayMs = 5000,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
} = {}) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await connect();
    } catch (error) {
      if (attempt >= attempts) throw error;
      const wait = delayMs * 2 ** (attempt - 1);
      console.warn(`⚠️  MongoDB connection attempt ${attempt}/${attempts} failed, retrying in ${wait / 1000}s...`);
      await sleep(wait);
    }
  }
};

module.exports = connectWithRetry;
