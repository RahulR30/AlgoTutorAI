const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Your Railway backend URL
const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

// Import models
const Problem = require('./backend/models/Problem');

class ProblemSync {
  constructor() {
    this.isRunning = false;
    this.syncInterval = null;
    this.lastSyncTime = null;
  }

  async startAutoSync(intervalMinutes = 5) {
    console.log(`🔄 Starting auto-sync every ${intervalMinutes} minutes...`);
    console.log(`📡 Railway backend: ${RAILWAY_BACKEND_URL}`);
    
    // Initial sync
    await this.syncProblems();
    
    // Set up periodic sync
    this.syncInterval = setInterval(async () => {
      await this.syncProblems();
    }, intervalMinutes * 60 * 1000);
    
    console.log(`✅ Auto-sync started! Will sync every ${intervalMinutes} minutes`);
    console.log('💡 Press Ctrl+C to stop');
  }

  async syncProblems() {
    if (this.isRunning) {
      console.log('⏳ Sync already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    
    try {
      console.log(`\n🔄 Starting sync at ${new Date().toLocaleTimeString()}...`);
      
      // Connect to local MongoDB
      await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
      
      // Get all local problems
      const localProblems = await Problem.find({}).lean();
      console.log(`📊 Found ${localProblems.length} problems in local database`);
      
      // Disconnect from local
      await mongoose.disconnect();
      
      // Check Railway backend
      const backendResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
      const backendProblems = backendResponse.data.problems;
      console.log(`📊 Found ${backendProblems.length} problems in Railway backend`);
      
      // Compare and sync
      const syncResult = await this.compareAndSync(localProblems, backendProblems);
      
      const duration = Date.now() - startTime;
      this.lastSyncTime = new Date();
      
      console.log(`✅ Sync completed in ${duration}ms`);
      console.log(`📊 Sync result: ${syncResult.added} added, ${syncResult.updated} updated, ${syncResult.deleted} deleted`);
      
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      }
    } finally {
      this.isRunning = false;
    }
  }

  async compareAndSync(localProblems, backendProblems) {
    const result = { added: 0, updated: 0, deleted: 0 };
    
    // Create maps for quick lookup
    const localMap = new Map(localProblems.map(p => [p.title, p]));
    const backendMap = new Map(backendProblems.map(p => [p.title, p]));
    
    // Add/Update problems
    for (const [title, localProblem] of localMap) {
      const backendProblem = backendMap.get(title);
      
      if (!backendProblem) {
        // New problem - add it
        try {
          await axios.post(`${RAILWAY_BACKEND_URL}/api/problems`, localProblem);
          console.log(`✅ Added: ${title}`);
          result.added++;
        } catch (error) {
          console.log(`❌ Failed to add ${title}:`, error.response?.data?.error || error.message);
        }
      } else {
        // Check if update is needed
        if (this.needsUpdate(localProblem, backendProblem)) {
          try {
            // You might need to add a PUT endpoint to your backend
            console.log(`⚠️  ${title} needs update (backend doesn't support updates yet)`);
            // await axios.put(`${RAILWAY_BACKEND_URL}/api/problems/${backendProblem._id}`, localProblem);
            // result.updated++;
          } catch (error) {
            console.log(`❌ Failed to update ${title}:`, error.message);
          }
        }
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Check for deleted problems (optional - you might want to keep them)
    // for (const [title, backendProblem] of backendMap) {
    //   if (!localMap.has(title)) {
    //     console.log(`🗑️  Problem deleted locally: ${title}`);
    //     result.deleted++;
    //   }
    // }
    
    return result;
  }

  needsUpdate(localProblem, backendProblem) {
    // Compare key fields to see if update is needed
    const fieldsToCompare = ['description', 'examples', 'testCases', 'constraints', 'hints', 'solution'];
    
    for (const field of fieldsToCompare) {
      if (JSON.stringify(localProblem[field]) !== JSON.stringify(backendProblem[field])) {
        return true;
      }
    }
    
    return false;
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('🛑 Auto-sync stopped');
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      backendUrl: RAILWAY_BACKEND_URL
    };
  }
}

// CLI interface
async function main() {
  const sync = new ProblemSync();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    sync.stopAutoSync();
    process.exit(0);
  });
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'start':
      const interval = parseInt(args[1]) || 5;
      await sync.startAutoSync(interval);
      break;
      
    case 'sync':
      await sync.syncProblems();
      break;
      
    case 'status':
      console.log('📊 Sync Status:', sync.getStatus());
      break;
      
    default:
      console.log('🔄 Problem Auto-Sync Tool');
      console.log('\nUsage:');
      console.log('  node auto-sync-problems.js start [interval-minutes]  - Start auto-sync');
      console.log('  node auto-sync-problems.js sync                      - Run one-time sync');
      console.log('  node auto-sync-problems.js status                   - Show sync status');
      console.log('\nExamples:');
      console.log('  node auto-sync-problems.js start                    - Auto-sync every 5 minutes');
      console.log('  node auto-sync-problems.js start 10                - Auto-sync every 10 minutes');
      console.log('  node auto-sync-problems.js sync                    - Sync once now');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ProblemSync;
