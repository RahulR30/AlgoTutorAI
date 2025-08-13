const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Test problem data with comprehensive details
const testProblems = [
  {
    title: 'Array Sum - Enhanced',
    slug: 'arrays-easy-sum-enhanced',
    description: 'Calculate the sum of all elements in an array of integers. The array will contain positive integers and you need to return the total sum.',
    difficulty: 'easy',
    topics: ['arrays'],
    constraints: [
      'Time: O(n) - need to iterate through all elements',
      'Space: O(1) - only using a single variable for sum'
    ],
    examples: [
      {
        input: '[1, 2, 3, 4, 5]',
        output: '15',
        explanation: 'The sum of all numbers in the array is 1+2+3+4+5 = 15'
      },
      {
        input: '[10, 20, 30]',
        output: '60',
        explanation: 'The sum of all numbers in the array is 10+20+30 = 60'
      }
    ],
    testCases: [
      {
        input: { arr: [1, 2, 3, 4, 5] },
        expectedOutput: 15,
        isHidden: false
      },
      {
        input: { arr: [0, 0, 0] },
        expectedOutput: 0,
        isHidden: false
      },
      {
        input: { arr: [10, 20, 30] },
        expectedOutput: 60,
        isHidden: false
      },
      {
        input: { arr: [1] },
        expectedOutput: 1,
        isHidden: true
      }
    ],
    solution: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}

// Alternative solution using loop
// function solution(arr) {
//   let sum = 0;
//   for (let i = 0; i < arr.length; i++) {
//     sum += arr[i];
//   }
//   return sum;
// }`,
    hints: [
      'Use reduce() method or a simple loop',
      'Start with sum = 0',
      'Add each element to the running sum',
      'Consider edge cases like empty arrays'
    ],
    learningObjectives: ['Master array iteration', 'Understand reduce operations', 'Practice basic arithmetic'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
    estimatedTime: 10,
    category: 'arrays',
    tags: ['arrays', 'easy', 'practice', 'sum'],
    isActive: true,
    statistics: {
      totalSubmissions: 0,
      correctSubmissions: 0,
      averageScore: 0,
      averageTime: 0,
      difficultyRating: 2
    },
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: 'Reverse String - Enhanced',
    slug: 'strings-easy-reverse-enhanced',
    description: 'Reverse a string character by character. Given a string, return the string with all characters in reverse order.',
    difficulty: 'easy',
    topics: ['strings'],
    constraints: [
      'Time: O(n) - need to process each character',
      'Space: O(n) - creating new string for result'
    ],
    examples: [
      {
        input: '"hello"',
        output: '"olleh"',
        explanation: 'Each character is reversed in order: h->o, e->l, l->l, l->e, o->h'
      },
      {
        input: '"world"',
        output: '"dlrow"',
        explanation: 'Each character is reversed in order: w->d, o->l, r->r, l->o, d->w'
      }
    ],
    testCases: [
      {
        input: { str: 'hello' },
        expectedOutput: 'olleh',
        isHidden: false
      },
      {
        input: { str: 'world' },
        expectedOutput: 'dlrow',
        isHidden: false
      },
      {
        input: { str: 'a' },
        expectedOutput: 'a',
        isHidden: false
      },
      {
        input: { str: '12345' },
        expectedOutput: '54321',
        isHidden: true
      }
    ],
    solution: `function solution(str) {
  return str.split('').reverse().join('');
}

// Alternative solution using loop
// function solution(str) {
//   let reversed = '';
//   for (let i = str.length - 1; i >= 0; i--) {
//     reversed += str[i];
//   }
//   return reversed;
// }`,
    hints: [
      'Split string into array of characters',
      'Reverse the array',
      'Join characters back into string',
      'Handle edge cases like single characters or empty strings'
    ],
    learningObjectives: ['Learn string manipulation', 'Understand array methods', 'Practice string operations'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings and arrays'],
    estimatedTime: 10,
    category: 'strings',
    tags: ['strings', 'easy', 'practice', 'reverse'],
    isActive: true,
    statistics: {
      totalSubmissions: 0,
      correctSubmissions: 0,
      averageScore: 0,
      averageTime: 0,
      difficultyRating: 2
    },
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: 'Find Maximum - Enhanced',
    slug: 'arrays-easy-maximum-enhanced',
    description: 'Find the maximum value in an array of integers. Return the largest number present in the array.',
    difficulty: 'easy',
    topics: ['arrays'],
    constraints: [
      'Time: O(n) - need to check each element',
      'Space: O(1) - only storing the maximum value'
    ],
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
      {
        input: { arr: [3, 1, 4, 1, 5, 9, 2, 6] },
        expectedOutput: 9,
        isHidden: false
      },
      {
        input: { arr: [-1, -5, -10] },
        expectedOutput: -1,
        isHidden: false
      },
      {
        input: { arr: [42] },
        expectedOutput: 42,
        isHidden: false
      },
      {
        input: { arr: [0, 0, 0, 0] },
        expectedOutput: 0,
        isHidden: true
      }
    ],
    solution: `function solution(arr) {
  return Math.max(...arr);
}

// Alternative solution using loop
// function solution(arr) {
//   let max = arr[0];
//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i] > max) {
//       max = arr[i];
//     }
//   }
//   return max;
// }`,
    hints: [
      'Use Math.max() with spread operator',
      'Or iterate through array to find max',
      'Handle edge case of single element',
      'Consider edge cases like negative numbers'
    ],
    learningObjectives: ['Learn Math.max usage', 'Understand spread operator', 'Practice array operations'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
    estimatedTime: 8,
    category: 'arrays',
    tags: ['arrays', 'easy', 'practice', 'maximum'],
    isActive: true,
    statistics: {
      totalSubmissions: 0,
      correctSubmissions: 0,
      averageScore: 0,
      averageTime: 0,
      difficultyRating: 2
    },
    timeLimit: 1000,
    memoryLimit: 128
  }
];

async function insertTestProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    // Clear existing test problems
    await Problem.deleteMany({ slug: { $regex: /-enhanced$/ } });
    console.log('🧹 Cleared existing test problems');
    
    // Insert new test problems
    const insertedProblems = await Problem.insertMany(testProblems);
    console.log(`✅ Inserted ${insertedProblems.length} test problems`);
    
    // Display the inserted problems
    insertedProblems.forEach((problem, index) => {
      console.log(`\n${index + 1}. ${problem.title}`);
      console.log(`   - Examples: ${problem.examples.length}`);
      console.log(`   - Test Cases: ${problem.testCases.length}`);
      console.log(`   - Constraints: ${problem.constraints.length}`);
      console.log(`   - Hints: ${problem.hints.length}`);
      console.log(`   - Solution: ${problem.solution ? '✅' : '❌'}`);
      console.log(`   - Slug: ${problem.slug}`);
    });
    
    console.log('\n🎉 Test problems created successfully!');
    console.log('🌐 Open http://localhost:3000 to view them in the browser');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

async function verifyProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB for verification');
    
    // Get the enhanced problems
    const problems = await Problem.find({ slug: { $regex: /-enhanced$/ } });
    console.log(`🔍 Found ${problems.length} enhanced problems`);
    
    // Verify each problem
    problems.forEach((problem, index) => {
      console.log(`\n${index + 1}. ${problem.title}`);
      console.log(`   - Examples: ${problem.examples?.length || 0}`);
      console.log(`   - Test Cases: ${problem.testCases?.length || 0}`);
      console.log(`   - Constraints: ${problem.constraints?.length || 0}`);
      console.log(`   - Hints: ${problem.hints?.length || 0}`);
      console.log(`   - Solution: ${problem.solution ? '✅ (' + problem.solution.length + ' chars)' : '❌ NULL'}`);
      console.log(`   - Learning Objectives: ${problem.learningObjectives?.length || 0}`);
      console.log(`   - Prerequisites: ${problem.prerequisites?.length || 0}`);
      
      if (problem.solution) {
        console.log(`   - Solution Preview: ${problem.solution.substring(0, 100)}...`);
      }
    });
    
    // Check if there are any problems with missing solutions
    const problemsWithoutSolution = problems.filter(p => !p.solution);
    if (problemsWithoutSolution.length > 0) {
      console.log(`\n⚠️  ${problemsWithoutSolution.length} problems are missing solutions:`);
      problemsWithoutSolution.forEach(p => console.log(`   - ${p.title}`));
    } else {
      console.log('\n✅ All problems have solutions!');
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting AI Route Testing...\n');
  
  // Connect to MongoDB
  try {
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
  
  // Run tests
  await insertTestProblems();
  
  // Verify the problems were saved correctly
  console.log('\n🔍 Verifying saved problems...');
  await verifyProblems();
  
  // Cleanup
  await mongoose.disconnect();
  console.log('\n📦 Disconnected from MongoDB');
  console.log('✨ Testing completed!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { insertTestProblems };
