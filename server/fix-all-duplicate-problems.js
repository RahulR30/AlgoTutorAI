const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Specific problem data for the problems mentioned in the images
const specificProblemData = {
  'Valid Parentheses': {
    examples: [
      {
        input: '"()"',
        output: 'true',
        explanation: 'Simple valid parentheses'
      },
      {
        input: '"()[]{}"',
        output: 'true',
        explanation: 'Multiple valid parentheses'
      },
      {
        input: '"(]"',
        output: 'false',
        explanation: 'Invalid parentheses combination'
      }
    ],
    testCases: [
      { input: { s: '()' }, expectedOutput: true, isHidden: false },
      { input: { s: '()[]{}' }, expectedOutput: true, isHidden: false },
      { input: { s: '(]' }, expectedOutput: false, isHidden: false },
      { input: { s: '([)]' }, expectedOutput: false, isHidden: true }
    ],
    solution: `function solution(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  
  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`,
    constraints: ['Time: O(n)', 'Space: O(n)'],
    hints: ['Use stack to track opening parentheses', 'Check if closing parentheses match top of stack'],
    learningObjectives: ['Learn stack data structure', 'Understand parentheses matching'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of stacks'],
    estimatedTime: 15,
    category: 'stacks'
  },
  
  'Merge K Sorted Arrays': {
    examples: [
      {
        input: '[[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'Merge all sorted arrays into one sorted array'
      },
      {
        input: '[[1,2,3],[4,5,6],[7,8,9]]',
        output: '[1,2,3,4,5,6,7,8,9]',
        explanation: 'Merge three sorted arrays'
      }
    ],
    testCases: [
      { input: { arrays: [[1,4,5],[1,3,4],[2,6]] }, expectedOutput: [1,1,2,3,4,4,5,6], isHidden: false },
      { input: { arrays: [[1,2,3],[4,5,6],[7,8,9]] }, expectedOutput: [1,2,3,4,5,6,7,8,9], isHidden: false },
      { input: { arrays: [[1],[2],[3]] }, expectedOutput: [1,2,3], isHidden: false },
      { input: { arrays: [[],[1,2],[3,4]] }, expectedOutput: [1,2,3,4], isHidden: true }
    ],
    solution: `function solution(arrays) {
  const result = [];
  
  // Use min heap to efficiently merge
  const minHeap = [];
  
  // Add first element from each array
  arrays.forEach((arr, index) => {
    if (arr.length > 0) {
      minHeap.push({ value: arr[0], arrayIndex: index, elementIndex: 0 });
    }
  });
  
  // Build min heap
  buildMinHeap(minHeap);
  
  while (minHeap.length > 0) {
    const { value, arrayIndex, elementIndex } = extractMin(minHeap);
    result.push(value);
    
    // Add next element from same array if available
    if (elementIndex + 1 < arrays[arrayIndex].length) {
      insert(minHeap, {
        value: arrays[arrayIndex][elementIndex + 1],
        arrayIndex,
        elementIndex: elementIndex + 1
      });
    }
  }
  
  return result;
}`,
    constraints: ['Time: O(n log k)', 'Space: O(k)'],
    hints: ['Use min heap to track smallest elements', 'Add next element from same array after extracting'],
    learningObjectives: ['Learn heap data structure', 'Understand merge algorithms'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Heap concepts'],
    estimatedTime: 35,
    category: 'arrays'
  },
  
  'Group Anagrams': {
    examples: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'Group strings with same character count'
      },
      {
        input: '["a"]',
        output: '[["a"]]',
        explanation: 'Single string forms its own group'
      }
    ],
    testCases: [
      { input: { strs: ['eat','tea','tan','ate','nat','bat'] }, expectedOutput: [['bat'],['nat','tan'],['ate','eat','tea']], isHidden: false },
      { input: { strs: ['a'] }, expectedOutput: [['a']], isHidden: false },
      { input: { strs: [''] }, expectedOutput: [['']], isHidden: false },
      { input: { strs: ['abc','cba','bac'] }, expectedOutput: [['abc','cba','bac']], isHidden: true }
    ],
    solution: `function solution(strs) {
  const groups = new Map();
  
  for (const str of strs) {
    const sorted = str.split('').sort().join('');
    
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    
    groups.get(sorted).push(str);
  }
  
  return Array.from(groups.values());
}`,
    constraints: ['Time: O(n * k log k)', 'Space: O(n * k)'],
    hints: ['Sort each string to create key', 'Use hash map to group', 'Return grouped arrays'],
    learningObjectives: ['Learn hash map usage', 'Understand anagram grouping'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings', 'Hash map concepts'],
    estimatedTime: 20,
    category: 'hash-tables'
  }
};

// Function to fix ALL problems with specific titles
async function fixAllDuplicateProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    let totalFixed = 0;
    
    // Fix each specific problem type
    for (const [title, data] of Object.entries(specificProblemData)) {
      try {
        // Find ALL problems with this title
        const problems = await Problem.find({ title: title });
        
        if (problems.length === 0) {
          console.log(`⚠️  No problems found with title: ${title}`);
          continue;
        }
        
        console.log(`🔍 Found ${problems.length} problems with title: "${title}"`);
        
        // Update ALL problems with this title
        for (const problem of problems) {
          try {
            await Problem.findByIdAndUpdate(problem._id, data);
            console.log(`✅ Fixed: ${title} (ID: ${problem._id})`);
            totalFixed++;
          } catch (error) {
            console.error(`❌ Failed to fix ${title} (ID: ${problem._id}):`, error.message);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${title}:`, error.message);
      }
    }
    
    console.log(`\n🎉 All duplicate problem fixing completed!`);
    console.log(`✅ Total Fixed: ${totalFixed} problems`);
    console.log(`🌐 Open http://localhost:3000 to view ALL fixed problems`);
    
  } catch (error) {
    console.error('❌ Error fixing problems:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllDuplicateProblems();
}

module.exports = { fixAllDuplicateProblems };
