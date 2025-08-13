const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Correct categories for different problem types
const correctCategories = {
  'missing-number': 'arrays',
  'array-sum': 'arrays',
  'find-maximum': 'arrays',
  'two-sum': 'arrays',
  'sorting': 'arrays',
  'string-reverse': 'strings',
  'palindrome': 'strings',
  'valid-parentheses': 'stacks',
  'linked-list': 'linked-lists',
  'tree-depth': 'trees',
  'graph-traversal': 'graphs',
  'binary-search': 'binary-search',
  'climbing-stairs': 'dynamic-programming',
  'factorial': 'recursion',
  'fizz-buzz': 'math',
  'bit-manipulation': 'bit-manipulation'
};

// Function to determine correct category based on problem content
function determineCorrectCategory(problem) {
  const title = problem.title.toLowerCase();
  const description = (problem.description || '').toLowerCase();
  
  // Check for specific problem types
  if (title.includes('missing number') || description.includes('missing number') || description.includes('sequence')) {
    return 'arrays';
  }
  if (title.includes('sum') || description.includes('sum') || description.includes('add')) {
    return 'arrays';
  }
  if (title.includes('maximum') || title.includes('max') || description.includes('maximum')) {
    return 'arrays';
  }
  if (title.includes('two sum') || description.includes('two sum') || description.includes('add up to')) {
    return 'arrays';
  }
  if (title.includes('sort') || description.includes('sort')) {
    return 'arrays';
  }
  if (title.includes('reverse') || description.includes('reverse')) {
    if (description.includes('string') || title.includes('string')) {
      return 'strings';
    }
    if (description.includes('linked') || title.includes('linked')) {
      return 'linked-lists';
    }
    return 'arrays';
  }
  if (title.includes('palindrome') || description.includes('palindrome')) {
    return 'strings';
  }
  if (title.includes('parentheses') || description.includes('parentheses') || description.includes('brackets')) {
    return 'stacks';
  }
  if (title.includes('linked') || description.includes('linked list')) {
    return 'linked-lists';
  }
  if (title.includes('tree') || description.includes('tree') || description.includes('depth')) {
    return 'trees';
  }
  if (title.includes('graph') || description.includes('graph') || description.includes('traversal')) {
    return 'graphs';
  }
  if (title.includes('binary') || description.includes('binary search')) {
    return 'binary-search';
  }
  if (title.includes('stairs') || description.includes('climbing') || description.includes('distinct ways')) {
    return 'dynamic-programming';
  }
  if (title.includes('factorial') || description.includes('factorial') || description.includes('!')) {
    return 'recursion';
  }
  if (title.includes('fizz') || title.includes('buzz') || description.includes('fizz') || description.includes('buzz')) {
    return 'math';
  }
  if (title.includes('bit') || description.includes('bit') || description.includes('manipulation')) {
    return 'bit-manipulation';
  }
  
  // Default fallback
  return 'arrays';
}

// Function to get appropriate constraints for a problem
function getConstraintsForProblem(problem) {
  const title = problem.title.toLowerCase();
  const description = (problem.description || '').toLowerCase();
  
  // Missing Number problems
  if (title.includes('missing number') || description.includes('missing number')) {
    return [
      'Time: O(n) - need to iterate through sequence',
      'Space: O(1) - only using constant extra space',
      '1 ≤ n ≤ 10⁵',
      '1 ≤ sequence.length ≤ 10⁵',
      'Sequence contains unique integers from 1 to n',
      'Exactly one number is missing'
    ];
  }
  
  // Array Sum problems
  if (title.includes('sum') || description.includes('sum')) {
    return [
      'Time: O(n) - need to iterate through all elements',
      'Space: O(1) - only using constant extra space',
      '1 ≤ arr.length ≤ 10⁵',
      '-10⁴ ≤ arr[i] ≤ 10⁴',
      'Array contains integers only'
    ];
  }
  
  // String problems
  if (title.includes('string') || description.includes('string') || title.includes('palindrome')) {
    return [
      'Time: O(n) - need to process each character',
      'Space: O(n) - creating new string or array',
      '1 ≤ s.length ≤ 10⁴',
      'String contains only printable ASCII characters'
    ];
  }
  
  // Parentheses problems
  if (title.includes('parentheses') || description.includes('parentheses')) {
    return [
      'Time: O(n) - single pass through string',
      'Space: O(n) - stack for opening brackets',
      '1 ≤ s.length ≤ 10⁴',
      's consists of parentheses only "()[]{}"'
    ];
  }
  
  // Binary Search problems
  if (title.includes('binary') || description.includes('binary search')) {
    return [
      'Time: O(log n) - binary search complexity',
      'Space: O(1) - constant extra space',
      '1 ≤ arr.length ≤ 10⁵',
      'Array is sorted in ascending order',
      '-10⁴ ≤ arr[i] ≤ 10⁴'
    ];
  }
  
  // Graph problems
  if (title.includes('graph') || description.includes('graph') || description.includes('traversal')) {
    return [
      'Time: O(V + E) - visit each node and edge once',
      'Space: O(V) - visited set and recursion stack',
      '1 ≤ nodes ≤ 10⁴',
      '1 ≤ edges ≤ 10⁴',
      'Graph is connected'
    ];
  }
  
  // Default constraints
  return [
    'Time: O(n) - linear time complexity',
    'Space: O(1) - constant extra space',
    '1 ≤ input size ≤ 10⁵',
    'Input contains valid data'
  ];
}

// Function to fix a single problem's constraints and category
async function fixProblemConstraintsAndCategory(problem) {
  const correctCategory = determineCorrectCategory(problem);
  const constraints = getConstraintsForProblem(problem);
  
  // Check if problem needs fixing
  const needsFixing = 
    !problem.constraints || 
    problem.constraints.length === 0 || 
    problem.category !== correctCategory;
  
  if (!needsFixing) {
    console.log(`✅ ${problem.title} - constraints and category already correct`);
    return false;
  }
  
  // Update the problem
  const updates = {
    constraints: constraints,
    category: correctCategory
  };
  
  try {
    await Problem.findByIdAndUpdate(problem._id, updates);
    console.log(`✅ Fixed: ${problem.title} - Category: ${problem.category} → ${correctCategory}, Added ${constraints.length} constraints`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to fix ${problem.title}:`, error.message);
    return false;
  }
}

// Main function to fix all problems' constraints and categories
async function fixAllConstraintsAndCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    // Get all problems
    const problems = await Problem.find({ isActive: true });
    console.log(`🔍 Found ${problems.length} problems to check for constraints and categories`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    // Fix each problem
    for (const problem of problems) {
      const wasFixed = await fixProblemConstraintsAndCategory(problem);
      if (wasFixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\n🎉 Constraints and categories fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`⏭️  Skipped: ${skippedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view the corrected problems`);
    
  } catch (error) {
    console.error('❌ Error fixing constraints and categories:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllConstraintsAndCategories();
}

module.exports = { fixAllConstraintsAndCategories };
