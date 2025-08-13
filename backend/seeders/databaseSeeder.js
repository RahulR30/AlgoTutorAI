const mongoose = require('mongoose');
const User = require('../models/User');
const Problem = require('../models/Problem');
require('dotenv').config();

const problems = [
  // Arrays
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    difficulty: 'easy',
    topic: 'arrays',
    subtopics: ['hash-table', 'two-pointers'],
    constraints: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      inputConstraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
      outputConstraints: ['Only one valid answer exists']
    },
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
      { input: { nums: [2,7,11,15], target: 9 }, expectedOutput: [0,1], isHidden: false },
      { input: { nums: [3,2,4], target: 6 }, expectedOutput: [1,2], isHidden: false },
      { input: { nums: [3,3], target: 6 }, expectedOutput: [0,1], isHidden: false },
      { input: { nums: [1,5,8,10,13,17], target: 18 }, expectedOutput: [2,5], isHidden: true }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Your code here
  // Return an array with two indices
}`,
      python: `def twoSum(nums, target):
    # Your code here
    # Return a list with two indices
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    // Return an array with two indices
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    // Return a vector with two indices
}`
    },
    solution: {
      javascript: `function twoSum(nums, target) {
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
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`
    },
    hints: [
      'Try using a hash table to store numbers you have seen',
      'For each number, check if its complement (target - number) exists in the hash table',
      'This approach gives you O(n) time complexity'
    ],
    learningObjectives: [
      'Understand hash table data structure',
      'Learn two-pointer technique',
      'Practice space-time complexity analysis'
    ],
    prerequisites: ['basic arrays', 'hash tables'],
    tags: ['arrays', 'hash-table', 'two-pointers', 'easy']
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.',
    difficulty: 'easy',
    topic: 'stacks',
    subtopics: ['stack', 'string'],
    constraints: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      inputConstraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'']
    },
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Simple valid parentheses.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'All brackets are properly closed.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Opening parenthesis is not closed by the same type of bracket.'
      }
    ],
    testCases: [
      { input: { s: "()" }, expectedOutput: true, isHidden: false },
      { input: { s: "()[]{}" }, expectedOutput: true, isHidden: false },
      { input: { s: "(]" }, expectedOutput: false, isHidden: false },
      { input: { s: "([)]" }, expectedOutput: false, isHidden: false },
      { input: { s: "{[]}" }, expectedOutput: true, isHidden: true }
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Your code here
  // Return true if valid, false otherwise
}`,
      python: `def isValid(s):
    # Your code here
    # Return True if valid, False otherwise
    pass`,
      java: `public boolean isValid(String s) {
    // Your code here
    // Return true if valid, false otherwise
}`,
      cpp: `bool isValid(string s) {
    // Your code here
    // Return true if valid, false otherwise
}`
    },
    solution: {
      javascript: `function isValid(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let char of s) {
    if (pairs[char]) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in pairs:
            if not stack or stack.pop() != pairs[char]:
                return False
        else:
            stack.append(char)
    return len(stack) == 0`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> pairs = new HashMap<>();
    pairs.put(')', '(');
    pairs.put('}', '{');
    pairs.put(']', '[');
    
    for (char c : s.toCharArray()) {
        if (pairs.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) {
                return false;
            }
        } else {
            stack.push(c);
        }
    }
    return stack.isEmpty();
}`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {{')', '('}, {'}', '{'}, {']', '['}};
    
    for (char c : s) {
        if (pairs.count(c)) {
            if (st.empty() || st.top() != pairs[c]) {
                return false;
            }
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`
    },
    hints: [
      'Use a stack to keep track of opening brackets',
      'When you see a closing bracket, check if it matches the top of the stack',
      'The stack should be empty at the end for valid parentheses'
    ],
    learningObjectives: [
      'Understand stack data structure',
      'Learn bracket matching algorithms',
      'Practice stack operations'
    ],
    prerequisites: ['basic strings', 'stacks'],
    tags: ['stacks', 'strings', 'easy']
  },
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    difficulty: 'medium',
    topic: 'dynamic-programming',
    subtopics: ['kadanes-algorithm', 'divide-and-conquer'],
    constraints: {
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      inputConstraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4']
    },
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'Single element array.'
      }
    ],
    testCases: [
      { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, expectedOutput: 6, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [5,4,-1,7,8] }, expectedOutput: 23, isHidden: false },
      { input: { nums: [-1,-2,-3,-4] }, expectedOutput: -1, isHidden: true }
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Your code here
  // Return the maximum subarray sum
}`,
      python: `def maxSubArray(nums):
    # Your code here
    # Return the maximum subarray sum
    pass`,
      java: `public int maxSubArray(int[] nums) {
    // Your code here
    // Return the maximum subarray sum
}`,
      cpp: `int maxSubArray(vector<int>& nums) {
    // Your code here
    // Return the maximum subarray sum
}`
    },
    solution: {
      javascript: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
}`,
      python: `def maxSubArray(nums):
    max_so_far = max_ending_here = nums[0]
    
    for num in nums[1:]:
        max_ending_here = max(num, max_ending_here + num)
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far`,
      java: `public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`,
      cpp: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0];
    int maxEndingHere = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        maxEndingHere = max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`
    },
    hints: [
      'Think about keeping track of the maximum sum ending at each position',
      'At each step, decide whether to extend the current subarray or start a new one',
      'This is known as Kadane\'s algorithm'
    ],
    learningObjectives: [
      'Understand dynamic programming',
      'Learn Kadane\'s algorithm',
      'Practice subarray problems'
    ],
    prerequisites: ['basic arrays', 'dynamic programming'],
    tags: ['dynamic-programming', 'arrays', 'medium']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algotutor-ai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 Connected to MongoDB');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('🗑️ Cleared existing problems');

    // Insert new problems
    const insertedProblems = await Problem.insertMany(problems);
    console.log(`✅ Inserted ${insertedProblems.length} problems`);

    // Create a default admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@algotutor.ai' });
    if (!adminExists) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@algotutor.ai',
        password: 'admin123',
        profile: {
          firstName: 'Admin',
          lastName: 'User'
        },
        preferences: {
          difficulty: 'advanced',
          topics: ['arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 'heaps', 'hash-tables', 'dynamic-programming', 'greedy', 'backtracking', 'two-pointers', 'sliding-window', 'binary-search', 'sorting', 'recursion', 'bit-manipulation', 'math', 'geometry', 'game-theory', 'system-design']
        }
      });
      await adminUser.save();
      console.log('👤 Created admin user: admin@algotutor.ai / admin123');
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
