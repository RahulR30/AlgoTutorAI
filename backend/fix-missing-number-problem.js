const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Correct data for the "Find Missing Number" problem
const missingNumberData = {
  description: 'Find the missing number in a sequence from 1 to n',
  examples: [
    {
      input: 'n = 4, sequence = [1, 2, 4]',
      output: '3',
      explanation: 'The sequence from 1 to 4 should be [1, 2, 3, 4], but 3 is missing'
    },
    {
      input: 'n = 5, sequence = [1, 3, 4, 5]',
      output: '2',
      explanation: 'The sequence from 1 to 5 should be [1, 2, 3, 4, 5], but 2 is missing'
    }
  ],
  testCases: [
    { input: { n: 4, sequence: [1, 2, 4] }, expectedOutput: 3, isHidden: false },
    { input: { n: 5, sequence: [1, 3, 4, 5] }, expectedOutput: 2, isHidden: false },
    { input: { n: 3, sequence: [1, 2] }, expectedOutput: 3, isHidden: false },
    { input: { n: 6, sequence: [1, 2, 3, 4, 6] }, expectedOutput: 5, isHidden: true }
  ],
  solution: `function solution(n, sequence) {
  // Calculate expected sum of 1 to n
  const expectedSum = (n * (n + 1)) / 2;
  
  // Calculate actual sum of sequence
  const actualSum = sequence.reduce((sum, num) => sum + num, 0);
  
  // Missing number is the difference
  return expectedSum - actualSum;
}`,
  constraints: ['Time: O(n)', 'Space: O(1)'],
  hints: ['Use the formula for sum of 1 to n: n*(n+1)/2', 'Subtract actual sum from expected sum'],
  learningObjectives: ['Learn arithmetic sequence formulas', 'Understand array reduction'],
  prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Basic math'],
  estimatedTime: 15,
  category: 'arrays'
};

// Function to fix the missing number problem
async function fixMissingNumberProblem() {
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
        await Problem.findByIdAndUpdate(problem._id, missingNumberData);
        console.log(`✅ Fixed: Find Missing Number (ID: ${problem._id})`);
        fixedCount++;
      } catch (error) {
        console.error(`❌ Failed to fix Find Missing Number (ID: ${problem._id}):`, error.message);
      }
    }
    
    console.log(`\n🎉 Missing Number problem fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view the fixed problems`);
    
  } catch (error) {
    console.error('❌ Error fixing missing number problems:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixMissingNumberProblem();
}

module.exports = { fixMissingNumberProblem };
