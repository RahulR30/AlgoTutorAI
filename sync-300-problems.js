const axios = require('axios');
const fs = require('fs');

// Your Railway backend URL
const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

async function syncAll300Problems() {
  try {
    console.log('🔄 Starting to sync ALL 300 problems to Railway backend...');
    
    // Check if the problems file exists
    const problemsFile = 'all-300-problems.json';
    if (!fs.existsSync(problemsFile)) {
      console.error(`❌ Problems file not found: ${problemsFile}`);
      console.log('💡 Please run: node extract-all-problems.js first');
      return;
    }
    
    // Load problems from JSON file
    console.log('📥 Loading problems from JSON file...');
    const allProblems = JSON.parse(fs.readFileSync(problemsFile, 'utf8'));
    console.log(`📋 Loaded ${allProblems.length} problems from ${problemsFile}`);
    
    // First, check if backend is accessible
    console.log('🔍 Testing backend connection...');
    const healthResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/health`);
    console.log('✅ Backend is accessible:', healthResponse.data.status);
    
    // Check current problems count
    console.log('📊 Checking current problems...');
    const problemsResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const currentCount = problemsResponse.data.problems.length;
    console.log(`📋 Current problems in backend: ${currentCount}`);
    
    if (currentCount > 0) {
      console.log('⚠️  Backend already has problems. Will add new ones...');
    }
    
    // Insert each problem
    console.log('📝 Inserting all problems...');
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < allProblems.length; i++) {
      const problem = allProblems[i];
      
      try {
        const response = await axios.post(`${RAILWAY_BACKEND_URL}/api/problems`, problem);
        console.log(`✅ Added: ${problem.title}`);
        successCount++;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log(`⚠️  Problem already exists: ${problem.title}`);
          skippedCount++;
        } else {
          console.log(`❌ Failed to add ${problem.title}:`, error.response?.data?.error || error.message);
          errorCount++;
        }
      }
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`📊 Progress: ${i + 1}/${allProblems.length} problems processed`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Verify the data
    console.log('\n🔍 Verifying data...');
    const finalResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const finalCount = finalResponse.data.problems.length;
    console.log(`📊 Final problems count: ${finalCount}`);
    
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successfully added: ${successCount}`);
    console.log(`   ⚠️  Already existed: ${skippedCount}`);
    console.log(`   ❌ Failed to add: ${errorCount}`);
    console.log(`   📋 Total in backend: ${finalCount}`);
    console.log(`   📁 Total from file: ${allProblems.length}`);
    
    if (finalCount > 0) {
      console.log('\n🎉 Backend populated successfully!');
      console.log('\n🔗 Your backend is now ready at:');
      console.log(`   ${RAILWAY_BACKEND_URL}`);
      console.log('\n📱 Test the problems endpoint:');
      console.log(`   ${RAILWAY_BACKEND_URL}/api/problems`);
      console.log('\n🌐 Your frontend should now show ALL problems!');
      
      // Show some sample problems
      const sampleProblems = finalResponse.data.problems.slice(0, 5);
      console.log('\n📋 Sample problems in backend:');
      sampleProblems.forEach((problem, index) => {
        console.log(`   ${index + 1}. ${problem.title} (${problem.difficulty}) - ${problem.category}`);
      });
    } else {
      console.log('\n⚠️  No problems were added. Check your backend logs.');
    }
    
  } catch (error) {
    console.error('❌ Failed to populate backend:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'sync':
      await syncAll300Problems();
      break;
      
    case 'count':
      try {
        const response = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
        console.log(`📊 Current problems in Railway backend: ${response.data.problems.length}`);
      } catch (error) {
        console.error('❌ Failed to get count:', error.message);
      }
      break;
      
    default:
      console.log('🔄 300 Problems Sync Tool');
      console.log('\nUsage:');
      console.log('  node sync-300-problems.js sync   - Sync all 300 problems to Railway');
      console.log('  node sync-300-problems.js count  - Check current problem count');
      console.log('\nExamples:');
      console.log('  node sync-300-problems.js sync');
      console.log('  node sync-300-problems.js count');
      console.log('\n💡 Make sure to run: node extract-all-problems.js first');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
