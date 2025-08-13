const axios = require('axios');

// Your Railway backend URL
const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

// Sample problems data with slugs
const sampleProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
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
        expectedOutput: "[0,1]",
        target: 9
      },
      {
        input: "[3,2,4]",
        expectedOutput: "[1,2]",
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
    slug: "reverse-string",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    difficulty: "easy",
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
        expectedOutput: '["o","l","l","e","h"]'
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]'
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
    slug: "valid-parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
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
        expectedOutput: "true"
      },
      {
        input: '"([)]"',
        expectedOutput: "false"
      },
      {
        input: '"{[]}"',
        expectedOutput: "true"
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

async function populateBackend() {
  try {
    console.log('🔄 Starting to populate Railway backend...');
    
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
      console.log('⚠️  Backend already has problems. Clearing existing ones...');
      // You might need to add a clear endpoint to your backend
      console.log('💡 Note: You may need to manually clear problems from your backend');
    }
    
    // Insert each problem
    console.log('📝 Inserting sample problems...');
    for (const problem of sampleProblems) {
      try {
        const response = await axios.post(`${RAILWAY_BACKEND_URL}/api/problems`, problem);
        console.log(`✅ Added: ${problem.title}`);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log(`⚠️  Problem already exists: ${problem.title}`);
        } else {
          console.log(`❌ Failed to add ${problem.title}:`, error.response?.data || error.message);
        }
      }
    }
    
    // Verify the data
    console.log('\n🔍 Verifying data...');
    const finalResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const finalCount = finalResponse.data.problems.length;
    console.log(`📊 Final problems count: ${finalCount}`);
    
    if (finalCount > 0) {
      console.log('\n🎉 Backend populated successfully!');
      console.log('\n🔗 Your backend is now ready at:');
      console.log(`   ${RAILWAY_BACKEND_URL}`);
      console.log('\n📱 Test the problems endpoint:');
      console.log(`   ${RAILWAY_BACKEND_URL}/api/problems`);
      console.log('\n🌐 Your frontend should now show problems!');
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

populateBackend();
