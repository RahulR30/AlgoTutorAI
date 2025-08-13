const chokidar = require('chokidar');
const ProblemSync = require('./auto-sync-problems');

class DevSync {
  constructor() {
    this.sync = new ProblemSync();
    this.watcher = null;
  }

  startWatching() {
    console.log('👀 Starting development mode with auto-sync...');
    console.log('📁 Watching for changes in backend/models and backend/routes...');
    
    // Watch for changes in problem-related files
    this.watcher = chokidar.watch([
      'backend/models/Problem.js',
      'backend/routes/problems.js',
      'backend/seeder.js',
      'backend/seeders/**/*.js'
    ], {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    this.watcher
      .on('add', path => this.handleChange('added', path))
      .on('change', path => this.handleChange('changed', path))
      .on('unlink', path => this.handleChange('removed', path))
      .on('error', error => console.error('❌ Watcher error:', error));

    console.log('✅ File watching started!');
    console.log('💡 Press Ctrl+C to stop');
  }

  async handleChange(event, path) {
    console.log(`\n📝 File ${event}: ${path}`);
    
    // Wait a bit for the file to finish writing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sync problems to Railway
    console.log('🔄 Syncing problems to Railway backend...');
    await this.sync.syncProblems();
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      console.log('🛑 File watching stopped');
    }
  }
}

// CLI interface
async function main() {
  const devSync = new DevSync();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    devSync.stop();
    process.exit(0);
  });
  
  // Start watching
  devSync.startWatching();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DevSync;
