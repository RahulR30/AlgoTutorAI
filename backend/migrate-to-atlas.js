const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Problem = require('./models/Problem');

// Sample problems data (the ones we created earlier)
const sampleProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    category: "Array",
    topics: ["Array", "Hash Table"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    testCases: [
      {
        input: "[2,7,11,15]",
        output: "[0,1]",
        target: 9
      },
      {
        input: "[3,2,4]",
        output: "[1,2]",
        target: 6
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hints: [
      "Try using a hash table to store numbers you've seen",
      "For each number, check if target - number exists in the hash table"
    ],
    solution: "function twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  \n  return [];\n}"
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    difficulty: "Easy",
    category: "String",
    topics: ["String", "Two Pointers"],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "The string is reversed in place."
      }
    ],
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: '["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ],
    hints: [
      "Try using two pointers approach",
      "Swap characters from both ends and move towards the center"
    ],
    solution: "function reverseString(s) {\n  let left = 0;\n  let right = s.length - 1;\n  \n  while (left < right) {\n    [s[left], s[right]] = [s[right], s[left]];\n    left++;\n    right--;\n  }\n  \n  return s;\n}"
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy",
    category: "Stack",
    topics: ["String", "Stack"],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "Simple valid parentheses."
      },
      {
        input: 's = "([)]"',
        output: "false",
        explanation: "Invalid order of parentheses."
      }
    ],
    testCases: [
      {
        input: '"()"',
        output: "true"
      },
      {
        input: '"([)]"',
        output: "false"
      },
      {
        input: '"{[]}"',
        output: "true"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    hints: [
      "Use a stack to keep track of opening parentheses",
      "When you see a closing parenthesis, check if it matches the top of the stack"
    ],
    solution: "function isValid(s) {\n  const stack = [];\n  const pairs = {\n    ')': '(',\n    '}': '{',\n    ']': '['\n  };\n  \n  for (let char of s) {\n    if (pairs[char]) {\n      if (stack.pop() !== pairs[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  \n  return stack.length === 0;\n}"
  }
];

async function migrateToAtlas() {
  try {
    console.log('🔄 Starting migration to MongoDB Atlas...');
    
    // Connect to MongoDB Atlas
    console.log('☁️  Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Check if problems already exist
    const existingProblems = await Problem.countDocuments();
    if (existingProblems > 0) {
      console.log(`⚠️  Found ${existingProblems} existing problems in Atlas`);
      console.log('🔄 Clearing existing problems...');
      await Problem.deleteMany({});
      console.log('✅ Cleared existing problems');
    }

    // Insert sample problems
    console.log('📝 Inserting sample problems...');
    const insertedProblems = await Problem.insertMany(sampleProblems);
    console.log(`✅ Successfully inserted ${insertedProblems.length} problems`);

    // Verify the data
    const totalProblems = await Problem.countDocuments();
    console.log(`📊 Total problems in Atlas: ${totalProblems}`);

    // Show some sample data
    const sampleProblem = await Problem.findOne();
    if (sampleProblem) {
      console.log('\n📋 Sample problem data:');
      console.log(`   Title: ${sampleProblem.title}`);
      console.log(`   Difficulty: ${sampleProblem.difficulty}`);
      console.log(`   Category: ${sampleProblem.category}`);
      console.log(`   Constraints: ${sampleProblem.constraints.length}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n🔗 Your backend is now ready at:');
    console.log(`   https://algotutorai-production.up.railway.app`);
    console.log('\n📱 Test the problems endpoint:');
    console.log(`   https://algotutorai-production.up.railway.app/api/problems`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB Atlas');
  }
}

if (require.main === module) {
  migrateToAtlas();
}
