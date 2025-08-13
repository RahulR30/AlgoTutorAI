const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Problem = require('./backend/models/Problem');

async function exportAllProblems() {
  try {
    console.log('🔄 Starting export of ALL problems from local MongoDB...');
    
    // Connect to local MongoDB
    console.log('📊 Connecting to local MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('✅ Connected to local MongoDB');
    
    // Get all problems from local database
    console.log('📥 Fetching all problems from local database...');
    const localProblems = await Problem.find({}).lean();
    console.log(`📋 Found ${localProblems.length} problems in local database`);
    
    // Prepare problems for export (clean up MongoDB-specific fields)
    console.log('🔧 Preparing problems for export...');
    const problemsToExport = localProblems.map(problem => {
      // Remove MongoDB-specific fields
      const cleanProblem = { ...problem };
      delete cleanProblem._id;
      delete cleanProblem.__v;
      
      // Ensure slug exists
      if (!cleanProblem.slug) {
        cleanProblem.slug = cleanProblem.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
      
      return cleanProblem;
    });
    
    // Write to JSON file
    const fs = require('fs');
    const outputFile = 'all-problems.json';
    
    fs.writeFileSync(outputFile, JSON.stringify(problemsToExport, null, 2));
    console.log(`💾 Exported ${problemsToExport.length} problems to ${outputFile}`);
    
    // Show some sample problems
    console.log('\n📋 Sample exported problems:');
    problemsToExport.slice(0, 5).forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.title} (${problem.difficulty}) - ${problem.category}`);
    });
    
    console.log('\n🎉 Export completed successfully!');
    console.log(`📊 Total problems exported: ${problemsToExport.length}`);
    console.log(`📁 File saved as: ${outputFile}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Run: node populate-from-export.js');
    console.log('   2. This will populate your Railway backend with ALL problems');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    console.error('❌ Error details:', error.message);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('📊 Disconnected from local MongoDB');
    }
  }
}

if (require.main === module) {
  exportAllProblems();
}
