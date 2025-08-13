const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Problem = require('./models/Problem');

// Sample problems data
const sampleProblems = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    topics: ['arrays', 'hash-table'],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1],
        isHidden: false
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expectedOutput: [1, 2],
        isHidden: false
      },
      {
        input: { nums: [3, 3], target: 6 },
        expectedOutput: [0, 1],
        isHidden: false
      },
      {
        input: { nums: [1, 5, 8, 10, 13, 17], target: 18 },
        expectedOutput: [2, 5],
        isHidden: true
      }
    ],
    solution: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
    hints: [
      'Try using a hash table to store numbers you have seen',
      'For each number, check if its complement exists in the hash table',
      'The complement is target - current_number'
    ],
    category: 'algorithms',
    estimatedTime: 15,
    learningObjectives: [
      'Hash table usage',
      'Two-pointer technique',
      'Time complexity optimization'
    ]
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.',
    difficulty: 'easy',
    topics: ['strings', 'stacks'],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\''
    ],
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Simple valid parentheses.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Multiple valid parentheses pairs.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Invalid parentheses order.'
      }
    ],
    testCases: [
      {
        input: { s: "()" },
        expectedOutput: true,
        isHidden: false
      },
      {
        input: { s: "()[]{}" },
        expectedOutput: true,
        isHidden: false
      },
      {
        input: { s: "(]" },
        expectedOutput: false,
        isHidden: false
      },
      {
        input: { s: "([)]" },
        expectedOutput: false,
        isHidden: true
      }
    ],
    solution: `function isValid(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let char of s) {
    if (pairs[char]) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
    hints: [
      'Use a stack to keep track of opening brackets',
      'When you see a closing bracket, check if it matches the top of the stack',
      'The stack should be empty at the end for valid parentheses'
    ],
    category: 'data-structures',
    estimatedTime: 20,
    learningObjectives: [
      'Stack data structure',
      'String manipulation',
      'Bracket matching algorithms'
    ]
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    difficulty: 'medium',
    topics: ['dynamic-programming', 'math'],
    constraints: [
      '1 <= n <= 45'
    ],
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1 step + 1 step, or 2 steps.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: 1+1+1, 1+2, or 2+1.'
      }
    ],
    testCases: [
      {
        input: { n: 2 },
        expectedOutput: 2,
        isHidden: false
      },
      {
        input: { n: 3 },
        expectedOutput: 3,
        isHidden: false
      },
      {
        input: { n: 4 },
        expectedOutput: 5,
        isHidden: false
      },
      {
        input: { n: 5 },
        expectedOutput: 8,
        isHidden: true
      }
    ],
    solution: `function climbStairs(n) {
  if (n <= 2) return n;
  
  let prev = 1;
  let curr = 2;
  
  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}`,
    hints: [
      'This is a classic dynamic programming problem',
      'Think about how many ways you can reach step i',
      'You can reach step i from step i-1 or step i-2',
      'The number of ways to reach step i is the sum of ways to reach step i-1 and step i-2'
    ],
    category: 'algorithms',
    estimatedTime: 25,
    learningObjectives: [
      'Dynamic programming',
      'Fibonacci sequence',
      'Space optimization'
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algotutor-ai');
    console.log('📊 MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@algotutor.ai',
      password: adminPassword,
      profile: {
        firstName: 'Admin',
        lastName: 'User'
      },
      preferences: {
        difficulty: 'advanced',
        topics: ['arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 'heaps', 'hash-tables', 'dynamic-programming', 'greedy', 'backtracking', 'two-pointers', 'sliding-window', 'binary-search', 'sorting', 'recursion', 'bit-manipulation', 'math', 'geometry', 'game-theory', 'system-design'],
        dailyGoal: 3,
        notifications: true,
        theme: 'auto'
      },
      isVerified: true
    });

    await adminUser.save();
    console.log('👤 Admin user created');

    // Create problems
    for (const problemData of sampleProblems) {
      const problem = new Problem({
        ...problemData,
        author: adminUser._id
      });
      await problem.save();
    }
    console.log(`📚 Created ${sampleProblems.length} problems`);

    console.log('✅ Database seeded successfully!');
    console.log('🔑 Admin login: admin@algotutor.ai / admin123');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run seeder
if (require.main === module) {
  connectDB().then(seedDatabase);
}

module.exports = { connectDB, seedDatabase };
