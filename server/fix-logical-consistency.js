const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Comprehensive problem templates with logical consistency
const logicalProblemTemplates = {
  // Missing Number problems
  'missing-number': {
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
  },

  // Factorial problems
  'factorial': {
    description: 'Calculate the factorial of a number n (n!)',
    examples: [
      {
        input: 'n = 4',
        output: '24',
        explanation: '4! = 4 × 3 × 2 × 1 = 24'
      },
      {
        input: 'n = 5',
        output: '120',
        explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120'
      }
    ],
    testCases: [
      { input: { n: 4 }, expectedOutput: 24, isHidden: false },
      { input: { n: 5 }, expectedOutput: 120, isHidden: false },
      { input: { n: 1 }, expectedOutput: 1, isHidden: false },
      { input: { n: 3 }, expectedOutput: 6, isHidden: true }
    ],
    solution: `function solution(n) {
  if (n <= 1) return 1;
  return n * solution(n - 1);
}`,
    constraints: ['Time: O(n)', 'Space: O(n) due to recursion stack'],
    hints: ['Use recursion', 'Base case: n <= 1 returns 1', 'Recursive case: n * factorial(n-1)'],
    learningObjectives: ['Learn recursion', 'Understand factorial calculation'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of functions', 'Recursion concepts'],
    estimatedTime: 20,
    category: 'recursion'
  },

  // Array Sum problems
  'array-sum': {
    description: 'Calculate the sum of all elements in an array',
    examples: [
      {
        input: '[1, 2, 3, 4, 5]',
        output: '15',
        explanation: 'Sum of all numbers: 1 + 2 + 3 + 4 + 5 = 15'
      },
      {
        input: '[10, 20, 30]',
        output: '60',
        explanation: 'Sum of all numbers: 10 + 20 + 30 = 60'
      }
    ],
    testCases: [
      { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15, isHidden: false },
      { input: { arr: [10, 20, 30] }, expectedOutput: 60, isHidden: false },
      { input: { arr: [0, 0, 0] }, expectedOutput: 0, isHidden: false },
      { input: { arr: [1] }, expectedOutput: 1, isHidden: true }
    ],
    solution: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
    constraints: ['Time: O(n)', 'Space: O(1)'],
    hints: ['Use reduce() method', 'Start with sum = 0', 'Add each element to running sum'],
    learningObjectives: ['Master array iteration', 'Understand reduce operations'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
    estimatedTime: 10,
    category: 'arrays'
  },

  // String Reversal problems
  'string-reverse': {
    description: 'Reverse a string character by character',
    examples: [
      {
        input: '"hello"',
        output: '"olleh"',
        explanation: 'Each character reversed: h→o, e→l, l→l, l→e, o→h'
      },
      {
        input: '"world"',
        output: '"dlrow"',
        explanation: 'Each character reversed: w→d, o→l, r→r, l→o, d→w'
      }
    ],
    testCases: [
      { input: { str: 'hello' }, expectedOutput: 'olleh', isHidden: false },
      { input: { str: 'world' }, expectedOutput: 'dlrow', isHidden: false },
      { input: { str: 'a' }, expectedOutput: 'a', isHidden: false },
      { input: { str: '12345' }, expectedOutput: '54321', isHidden: true }
    ],
    solution: `function solution(str) {
  return str.split('').reverse().join('');
}`,
    constraints: ['Time: O(n)', 'Space: O(n)'],
    hints: ['Split string into array of characters', 'Reverse the array', 'Join characters back into string'],
    learningObjectives: ['Learn string manipulation', 'Understand array methods'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings and arrays'],
    estimatedTime: 10,
    category: 'strings'
  },

  // Maximum Value problems
  'find-maximum': {
    description: 'Find the maximum value in an array of numbers',
    examples: [
      {
        input: '[3, 1, 4, 1, 5, 9, 2, 6]',
        output: '9',
        explanation: 'The maximum value in the array is 9'
      },
      {
        input: '[-1, -5, -10]',
        output: '-1',
        explanation: 'The maximum value in the array is -1'
      }
    ],
    testCases: [
      { input: { arr: [3, 1, 4, 1, 5, 9, 2, 6] }, expectedOutput: 9, isHidden: false },
      { input: { arr: [-1, -5, -10] }, expectedOutput: -1, isHidden: false },
      { input: { arr: [42] }, expectedOutput: 42, isHidden: false },
      { input: { arr: [0, 0, 0, 0] }, expectedOutput: 0, isHidden: true }
    ],
    solution: `function solution(arr) {
  return Math.max(...arr);
}`,
    constraints: ['Time: O(n)', 'Space: O(1)'],
    hints: ['Use Math.max() with spread operator', 'Or iterate through array to find max'],
    learningObjectives: ['Learn Math.max usage', 'Understand spread operator'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
    estimatedTime: 8,
    category: 'arrays'
  },

  // Palindrome problems
  'palindrome': {
    description: 'Check if a string is a palindrome (reads the same forwards and backwards)',
    examples: [
      {
        input: '"racecar"',
        output: 'true',
        explanation: '"racecar" reads the same forwards and backwards'
      },
      {
        input: '"hello"',
        output: 'false',
        explanation: '"hello" does not read the same forwards and backwards'
      }
    ],
    testCases: [
      { input: { str: 'racecar' }, expectedOutput: true, isHidden: false },
      { input: { str: 'hello' }, expectedOutput: false, isHidden: false },
      { input: { str: 'a' }, expectedOutput: true, isHidden: false },
      { input: { str: 'anna' }, expectedOutput: true, isHidden: true }
    ],
    solution: `function solution(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`,
    constraints: ['Time: O(n)', 'Space: O(n)'],
    hints: ['Reverse the string', 'Compare original with reversed', 'Use split, reverse, join'],
    learningObjectives: ['Learn string manipulation', 'Understand palindrome concept'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings'],
    estimatedTime: 15,
    category: 'strings'
  },

  // Two Sum problems
  'two-sum': {
    description: 'Find two numbers in an array that add up to a target value',
    examples: [
      {
        input: 'arr = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: '2 + 7 = 9, so return indices [0, 1]'
      },
      {
        input: 'arr = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: '2 + 4 = 6, so return indices [1, 2]'
      }
    ],
    testCases: [
      { input: { arr: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], isHidden: false },
      { input: { arr: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], isHidden: false },
      { input: { arr: [3, 3], target: 6 }, expectedOutput: [0, 1], isHidden: false },
      { input: { arr: [1, 5, 8, 10], target: 15 }, expectedOutput: [2, 3], isHidden: true }
    ],
    solution: `function solution(arr, target) {
  const map = new Map();
  
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(arr[i], i);
  }
  
  return [];
}`,
    constraints: ['Time: O(n)', 'Space: O(n)'],
    hints: ['Use hash map to store seen numbers', 'Check if complement exists', 'Return indices when found'],
    learningObjectives: ['Learn hash map usage', 'Understand two-pointer technique'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Hash map concepts'],
    estimatedTime: 20,
    category: 'arrays'
  }
};

// Function to determine problem type based on description and title
function determineProblemType(problem) {
  const title = problem.title.toLowerCase();
  const description = (problem.description || '').toLowerCase();
  
  // Check for specific problem types
  if (description.includes('missing number') || description.includes('sequence') || title.includes('missing')) {
    return 'missing-number';
  }
  if (description.includes('factorial') || description.includes('!') || title.includes('factorial')) {
    return 'factorial';
  }
  if (description.includes('sum') || description.includes('add') || title.includes('sum')) {
    return 'array-sum';
  }
  if (description.includes('reverse') || description.includes('backwards') || title.includes('reverse')) {
    return 'string-reverse';
  }
  if (description.includes('maximum') || description.includes('max') || title.includes('maximum') || title.includes('max')) {
    return 'find-maximum';
  }
  if (description.includes('palindrome') || description.includes('same forwards') || title.includes('palindrome')) {
    return 'palindrome';
  }
  if (description.includes('two sum') || description.includes('add up to') || title.includes('two sum')) {
    return 'two-sum';
  }
  
  // Default fallback based on title
  if (title.includes('array') || title.includes('sum')) return 'array-sum';
  if (title.includes('string') || title.includes('reverse')) return 'string-reverse';
  if (title.includes('maximum') || title.includes('max')) return 'find-maximum';
  if (title.includes('palindrome')) return 'palindrome';
  if (title.includes('two sum')) return 'two-sum';
  
  return 'array-sum'; // Default fallback
}

// Function to check if a problem has logical consistency
function hasLogicalConsistency(problem) {
  const description = problem.description || '';
  const examples = problem.examples || [];
  
  // Check if examples match the description
  for (const example of examples) {
    const input = example.input || '';
    const output = example.output || '';
    const explanation = example.explanation || '';
    
    // Skip if any field is missing
    if (!input || !output || !explanation) continue;
    
    // Check for obvious mismatches
    if (description.includes('missing number') && (input.includes('!') || output.includes('!') || explanation.includes('factorial'))) {
      return false;
    }
    if (description.includes('factorial') && (input.includes('sequence') || output.includes('sequence') || explanation.includes('missing'))) {
      return false;
    }
    if (description.includes('sum') && (input.includes('reverse') || output.includes('reverse') || explanation.includes('reverse'))) {
      return false;
    }
  }
  
  return true;
}

// Function to fix a single problem's logical consistency
async function fixProblemLogic(problem) {
  const problemType = determineProblemType(problem);
  const template = logicalProblemTemplates[problemType];
  
  if (!template) {
    console.log(`⚠️  No template found for: ${problem.title}`);
    return false;
  }
  
  // Check if problem needs fixing
  const needsFixing = !hasLogicalConsistency(problem) || 
    problem.examples?.some(ex => 
      ex.input === 'Example input' || 
      ex.output === 'Example output' || 
      ex.explanation === 'Example explanation'
    );
  
  if (!needsFixing) {
    console.log(`✅ ${problem.title} - already logically consistent`);
    return false;
  }
  
  // Update the problem with logically consistent data
  const updates = {
    description: template.description,
    examples: template.examples,
    testCases: template.testCases,
    solution: template.solution,
    constraints: template.constraints,
    hints: template.hints,
    learningObjectives: template.learningObjectives,
    prerequisites: template.prerequisites,
    estimatedTime: template.estimatedTime,
    category: template.category
  };
  
  try {
    await Problem.findByIdAndUpdate(problem._id, updates);
    console.log(`✅ Fixed logical consistency: ${problem.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to fix ${problem.title}:`, error.message);
    return false;
  }
}

// Main function to fix all problems' logical consistency
async function fixAllLogicalConsistency() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    // Get all problems
    const problems = await Problem.find({ isActive: true });
    console.log(`🔍 Found ${problems.length} problems to check for logical consistency`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    // Fix each problem
    for (const problem of problems) {
      const wasFixed = await fixProblemLogic(problem);
      if (wasFixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\n🎉 Logical consistency fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`⏭️  Skipped: ${skippedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view the logically consistent problems`);
    
  } catch (error) {
    console.error('❌ Error fixing logical consistency:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllLogicalConsistency();
}

module.exports = { fixAllLogicalConsistency };
