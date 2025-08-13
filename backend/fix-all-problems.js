const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Comprehensive problem templates for different topics
const problemTemplates = {
  'arrays': {
    'easy': [
      {
        title: 'Array Sum',
        description: 'Calculate the sum of all elements in an array of integers.',
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
          { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15, isHidden: false },
          { input: { arr: [0, 0, 0] }, expectedOutput: 0, isHidden: false },
          { input: { arr: [10, 20, 30] }, expectedOutput: 60, isHidden: false },
          { input: { arr: [1] }, expectedOutput: 1, isHidden: true }
        ],
        solution: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
        constraints: [
          'Time: O(n) - need to iterate through all elements',
          'Space: O(1) - only using a single variable for sum'
        ],
        hints: [
          'Use reduce() method or a simple loop',
          'Start with sum = 0',
          'Add each element to the running sum'
        ],
        learningObjectives: ['Master array iteration', 'Understand reduce operations'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
        estimatedTime: 10,
        category: 'arrays'
      },
      {
        title: 'Find Maximum',
        description: 'Find the maximum value in an array of integers.',
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
        constraints: [
          'Time: O(n) - need to check each element',
          'Space: O(1) - only storing the maximum value'
        ],
        hints: [
          'Use Math.max() with spread operator',
          'Or iterate through array to find max',
          'Handle edge case of single element'
        ],
        learningObjectives: ['Learn Math.max usage', 'Understand spread operator'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
        estimatedTime: 8,
        category: 'arrays'
      }
    ],
    'medium': [
      {
        title: 'Maximum Subarray Sum',
        description: 'Find the contiguous subarray within an array which has the largest sum.',
        examples: [
          {
            input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
            output: '6',
            explanation: 'The subarray [4, -1, 2, 1] has the largest sum of 6'
          },
          {
            input: '[1, 2, 3, 4]',
            output: '10',
            explanation: 'The entire array has the largest sum of 10'
          }
        ],
        testCases: [
          { input: { arr: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expectedOutput: 6, isHidden: false },
          { input: { arr: [1, 2, 3, 4] }, expectedOutput: 10, isHidden: false },
          { input: { arr: [-1, -2, -3] }, expectedOutput: -1, isHidden: false },
          { input: { arr: [5, -4, 3, -2, 1] }, expectedOutput: 5, isHidden: true }
        ],
        solution: `function solution(arr) {
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
}`,
        constraints: [
          'Time: O(n) - single pass through array',
          'Space: O(1) - only using constant variables'
        ],
        hints: [
          'Use Kadane\'s algorithm',
          'Track current subarray sum and global maximum',
          'Reset current sum when it becomes negative'
        ],
        learningObjectives: ['Learn Kadane\'s algorithm', 'Understand dynamic programming concepts'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Basic algorithms'],
        estimatedTime: 25,
        category: 'arrays'
      }
    ]
  },
  'strings': {
    'easy': [
      {
        title: 'Reverse String',
        description: 'Reverse a string character by character.',
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
          { input: { str: 'hello' }, expectedOutput: 'olleh', isHidden: false },
          { input: { str: 'world' }, expectedOutput: 'dlrow', isHidden: false },
          { input: { str: 'a' }, expectedOutput: 'a', isHidden: false },
          { input: { str: '12345' }, expectedOutput: '54321', isHidden: true }
        ],
        solution: `function solution(str) {
  return str.split('').reverse().join('');
}`,
        constraints: [
          'Time: O(n) - need to process each character',
          'Space: O(n) - creating new string for result'
        ],
        hints: [
          'Split string into array of characters',
          'Reverse the array',
          'Join characters back into string'
        ],
        learningObjectives: ['Learn string manipulation', 'Understand array methods'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings and arrays'],
        estimatedTime: 10,
        category: 'strings'
      }
    ],
    'medium': [
      {
        title: 'Word Break II',
        description: 'Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences.',
        examples: [
          {
            input: 's = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]',
            output: '["cats and dog","cat sand dog"]',
            explanation: 'The string can be broken into valid words in two ways: "cats and dog" and "cat sand dog"'
          },
          {
            input: 's = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]',
            output: '["pine apple pen apple","pineapple pen apple","pine applepen apple"]',
            explanation: 'Multiple valid word break combinations are possible'
          }
        ],
        testCases: [
          { input: { s: 'catsanddog', wordDict: ['cat','cats','and','sand','dog'] }, expectedOutput: ['cats and dog','cat sand dog'], isHidden: false },
          { input: { s: 'pineapplepenapple', wordDict: ['apple','pen','applepen','pine','pineapple'] }, expectedOutput: ['pine apple pen apple','pineapple pen apple','pine applepen apple'], isHidden: false },
          { input: { s: 'a', wordDict: ['a'] }, expectedOutput: ['a'], isHidden: false },
          { input: { s: 'catsandog', wordDict: ['cats','dog','sand','and','cat'] }, expectedOutput: [], isHidden: true }
        ],
        solution: `function solution(s, wordDict) {
  const result = [];
  
  function backtrack(start, path) {
    if (start === s.length) {
      result.push(path.join(' '));
      return;
    }
    
    for (let end = start + 1; end <= s.length; end++) {
      const word = s.substring(start, end);
      if (wordDict.includes(word)) {
        path.push(word);
        backtrack(end, path);
        path.pop();
      }
    }
  }
  
  backtrack(0, []);
  return result;
}`,
        constraints: [
          'Time: O(n^3) - for each position, try all possible word lengths',
          'Space: O(n) - recursion stack depth'
        ],
        hints: [
          'Use backtracking to try all possible word combinations',
          'Check if each substring is in the dictionary',
          'Build the result incrementally'
        ],
        learningObjectives: ['Learn backtracking algorithms', 'Understand string manipulation', 'Practice recursion'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings', 'Recursion concepts'],
        estimatedTime: 30,
        category: 'strings'
      }
    ]
  },
  'linked-lists': {
    'easy': [
      {
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list and return the new head.',
        examples: [
          {
            input: '[1, 2, 3, 4, 5]',
            output: '[5, 4, 3, 2, 1]',
            explanation: 'The linked list is reversed: 1->2->3->4->5 becomes 5->4->3->2->1'
          },
          {
            input: '[1, 2]',
            output: '[2, 1]',
            explanation: 'The linked list is reversed: 1->2 becomes 2->1'
          }
        ],
        testCases: [
          { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1], isHidden: false },
          { input: { head: [1, 2] }, expectedOutput: [2, 1], isHidden: false },
          { input: { head: [1] }, expectedOutput: [1], isHidden: false },
          { input: { head: [] }, expectedOutput: [], isHidden: true }
        ],
        solution: `function solution(head) {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`,
        constraints: [
          'Time: O(n) - need to visit each node once',
          'Space: O(1) - only using constant extra space'
        ],
        hints: [
          'Use three pointers: prev, current, next',
          'Update links as you traverse',
          'Return the new head (prev)'
        ],
        learningObjectives: ['Learn linked list manipulation', 'Understand pointer manipulation'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of linked lists', 'Pointer concepts'],
        estimatedTime: 20,
        category: 'linked-lists'
      }
    ]
  }
};

// Function to get appropriate template for a problem
function getTemplateForProblem(problem) {
  const title = problem.title.toLowerCase();
  const topics = problem.topics || ['arrays'];
  const difficulty = problem.difficulty || 'easy';
  
  // Determine the main topic
  let mainTopic = topics[0];
  if (title.includes('word') || title.includes('string')) mainTopic = 'strings';
  if (title.includes('linked') || title.includes('list')) mainTopic = 'linked-lists';
  
  // Get available templates for this topic and difficulty
  const topicTemplates = problemTemplates[mainTopic];
  if (!topicTemplates) return null;
  
  const diffTemplates = topicTemplates[difficulty];
  if (!diffTemplates) return null;
  
  // Return a template based on the problem title
  for (const template of diffTemplates) {
    if (title.includes(template.title.toLowerCase().split(' ')[0])) {
      return template;
    }
  }
  
  // Return the first available template if no specific match
  return diffTemplates[0];
}

// Function to fix a single problem
async function fixProblem(problem) {
  const template = getTemplateForProblem(problem);
  if (!template) {
    console.log(`⚠️  No template found for: ${problem.title}`);
    return false;
  }
  
  // Check if problem needs fixing
  const needsFixing = problem.examples?.some(ex => 
    ex.input === 'Example input' || 
    ex.output === 'Example output' || 
    ex.explanation === 'Example explanation'
  );
  
  if (!needsFixing) {
    console.log(`✅ ${problem.title} - already fixed`);
    return false;
  }
  
  // Update the problem with template data
  const updates = {
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
    console.log(`✅ Fixed: ${problem.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to fix ${problem.title}:`, error.message);
    return false;
  }
}

// Main function to fix all problems
async function fixAllProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    // Get all problems
    const problems = await Problem.find({ isActive: true });
    console.log(`🔍 Found ${problems.length} problems to check`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    // Fix each problem
    for (const problem of problems) {
      const wasFixed = await fixProblem(problem);
      if (wasFixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\n🎉 Problem fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`⏭️  Skipped: ${skippedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view the fixed problems`);
    
  } catch (error) {
    console.error('❌ Error fixing problems:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllProblems();
}

module.exports = { fixAllProblems };
