const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Complete constraints for Find Missing Number problems
const missingNumberConstraints = [
  'Time: O(n) - need to iterate through sequence',
  'Space: O(1) - only using constant extra space',
  '1 ≤ n ≤ 10⁵',
  '1 ≤ sequence.length ≤ 10⁵',
  'Sequence contains unique integers from 1 to n',
  'Exactly one number is missing'
];

// Function to fix Find Missing Number problems with complete constraints
async function fixMissingNumberConstraints() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    // Find ALL problems with "Find Missing Number" title
    const problems = await Problem.find({ title: 'Find Missing Number' });
    
    if (problems.length === 0) {
      console.log('⚠️  No problems found with title "Find Missing Number"');
      return;
    }
    
    console.log(`🔍 Found ${problems.length} problems with title "Find Missing Number"`);
    
    let fixedCount = 0;
    
    // Fix each problem
    for (const problem of problems) {
      try {
        // Update with complete constraints
        await Problem.findByIdAndUpdate(problem._id, {
          constraints: missingNumberConstraints
        });
        console.log(`✅ Fixed constraints: Find Missing Number (ID: ${problem._id})`);
        fixedCount++;
      } catch (error) {
        console.error(`❌ Failed to fix Find Missing Number (ID: ${problem._id}):`, error.message);
      }
    }
    
    console.log(`\n🎉 Missing Number constraints fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view the fixed problems`);
    
  } catch (error) {
    console.error('❌ Error fixing missing number constraints:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixMissingNumberConstraints();
}

module.exports = { fixMissingNumberConstraints };
