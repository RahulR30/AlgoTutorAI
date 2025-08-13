const axios = require('axios');

// Your Railway backend URL
const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

// Sample problems data (representing the variety you have)
const allProblems = [
  // Array Problems
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
      }
    ],
    testCases: [
      {
        input: '"()"',
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
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    difficulty: "medium",
    category: "Array",
    topics: ["Array", "Dynamic Programming"],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      }
    ],
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6"
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    hints: [
      "Use Kadane's algorithm",
      "Keep track of current sum and maximum sum seen so far"
    ],
    solution: "function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  \n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  \n  return maxSum;\n}"
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    description: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    difficulty: "easy",
    category: "Linked List",
    topics: ["Linked List", "Recursion"],
    examples: [
      {
        input: "l1 = [1,2,4], l2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Merge the two sorted lists."
      }
    ],
    testCases: [
      {
        input: "[1,2,4]",
        expectedOutput: "[1,1,2,3,4,4]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 <= Node.val <= 100",
      "Both l1 and l2 are sorted in non-decreasing order"
    ],
    hints: [
      "Use a dummy head node",
      "Compare values and link nodes accordingly"
    ],
    solution: "function mergeTwoLists(l1, l2) {\n  const dummy = new ListNode(0);\n  let current = dummy;\n  \n  while (l1 && l2) {\n    if (l1.val <= l2.val) {\n      current.next = l1;\n      l1 = l1.next;\n    } else {\n      current.next = l2;\n      l2 = l2.next;\n    }\n    current = current.next;\n  }\n  \n  current.next = l1 || l2;\n  return dummy.next;\n}"
  },
  {
    title: "Binary Tree Inorder Traversal",
    slug: "binary-tree-inorder-traversal",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    difficulty: "easy",
    category: "Tree",
    topics: ["Tree", "Depth-First Search"],
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal: left -> root -> right"
      }
    ],
    testCases: [
      {
        input: "[1,null,2,3]",
        expectedOutput: "[1,3,2]"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100]",
      "-100 <= Node.val <= 100"
    ],
    hints: [
      "Use recursion or iterative approach with stack",
      "Inorder: left subtree -> root -> right subtree"
    ],
    solution: "function inorderTraversal(root) {\n  const result = [];\n  \n  function traverse(node) {\n    if (!node) return;\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n  \n  traverse(root);\n  return result;\n}"
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "easy",
    category: "Dynamic Programming",
    topics: ["Dynamic Programming", "Math"],
    examples: [
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways: (1,1,1), (1,2), (2,1)"
      }
    ],
    testCases: [
      {
        input: "3",
        expectedOutput: "3"
      }
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    hints: [
      "This is a Fibonacci sequence problem",
      "Use dynamic programming to avoid recalculating"
    ],
    solution: "function climbStairs(n) {\n  if (n <= 2) return n;\n  \n  let one = 1, two = 2;\n  for (let i = 3; i <= n; i++) {\n    let temp = one + two;\n    one = two;\n    two = temp;\n  }\n  \n  return two;\n}"
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.",
    difficulty: "easy",
    category: "Array",
    topics: ["Array", "Dynamic Programming"],
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      }
    ],
    testCases: [
      {
        input: "[7,1,5,3,6,4]",
        expectedOutput: "5"
      }
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    hints: [
      "Keep track of minimum price seen so far",
      "Calculate profit for each day and update maximum"
    ],
    solution: "function maxProfit(prices) {\n  let minPrice = prices[0];\n  let maxProfit = 0;\n  \n  for (let i = 1; i < prices.length; i++) {\n    maxProfit = Math.max(maxProfit, prices[i] - minPrice);\n    minPrice = Math.min(minPrice, prices[i]);\n  }\n  \n  return maxProfit;\n}"
  },
  {
    title: "Linked List Cycle",
    slug: "linked-list-cycle",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.",
    difficulty: "easy",
    category: "Linked List",
    topics: ["Linked List", "Two Pointers"],
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 2nd node (0-indexed)."
      }
    ],
    testCases: [
      {
        input: "[3,2,0,-4]",
        expectedOutput: "true"
      }
    ],
    constraints: [
      "The number of the nodes in the list is in the range [0, 10^4]",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list"
    ],
    hints: [
      "Use Floyd's Cycle-Finding Algorithm (fast and slow pointers)",
      "If fast pointer catches slow pointer, there's a cycle"
    ],
    solution: "function hasCycle(head) {\n  if (!head || !head.next) return false;\n  \n  let slow = head;\n  let fast = head.next;\n  \n  while (slow !== fast) {\n    if (!fast || !fast.next) return false;\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  \n  return true;\n}"
  },
  {
    title: "Symmetric Tree",
    slug: "symmetric-tree",
    description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    difficulty: "easy",
    category: "Tree",
    topics: ["Tree", "Depth-First Search"],
    examples: [
      {
        input: "root = [1,2,2,3,4,4,3]",
        output: "true",
        explanation: "The tree is symmetric around its center."
      }
    ],
    testCases: [
      {
        input: "[1,2,2,3,4,4,3]",
        expectedOutput: "true"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 1000]",
      "-100 <= Node.val <= 100"
    ],
    hints: [
      "Check if left subtree is mirror of right subtree",
      "Use recursive approach to compare nodes"
    ],
    solution: "function isSymmetric(root) {\n  if (!root) return true;\n  \n  function isMirror(left, right) {\n    if (!left && !right) return true;\n    if (!left || !right) return false;\n    return left.val === right.val && \n           isMirror(left.left, right.right) && \n           isMirror(left.right, right.left);\n  }\n  \n  return isMirror(root.left, root.right);\n}"
  }
];

async function populateAllProblems() {
  try {
    console.log('🔄 Starting to populate Railway backend with ALL problems...');
    
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
    console.log('📝 Inserting all problems...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const problem of allProblems) {
      try {
        const response = await axios.post(`${RAILWAY_BACKEND_URL}/api/problems`, problem);
        console.log(`✅ Added: ${problem.title}`);
        successCount++;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log(`⚠️  Problem already exists: ${problem.title}`);
          successCount++;
        } else {
          console.log(`❌ Failed to add ${problem.title}:`, error.response?.data?.error || error.message);
          errorCount++;
        }
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Verify the data
    console.log('\n🔍 Verifying data...');
    const finalResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const finalCount = finalResponse.data.problems.length;
    console.log(`📊 Final problems count: ${finalCount}`);
    
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successfully added: ${successCount}`);
    console.log(`   ❌ Failed to add: ${errorCount}`);
    console.log(`   📋 Total in backend: ${finalCount}`);
    
    if (finalCount > 0) {
      console.log('\n🎉 Backend populated successfully!');
      console.log('\n🔗 Your backend is now ready at:');
      console.log(`   ${RAILWAY_BACKEND_URL}`);
      console.log('\n📱 Test the problems endpoint:');
      console.log(`   ${RAILWAY_BACKEND_URL}/api/problems`);
      console.log('\n🌐 Your frontend should now show ALL problems!');
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

populateAllProblems();
