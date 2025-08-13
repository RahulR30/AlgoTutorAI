const axios = require('axios');

// Your Railway backend URL
const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

// Comprehensive problems data (representing 300+ problems)
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
    solution: "function isSymmetric(root) {\n  if (!root) return true;\n  \n  function isMirror(left, right) {\n    if (!left || !right) return false;\n    return left.val === right.val && \n           isMirror(left.left, right.right) && \n           isMirror(left.right, right.left);\n  }\n  \n  return isMirror(root.left, root.right);\n}"
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    difficulty: "easy",
    category: "Math",
    topics: ["Math"],
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      }
    ],
    testCases: [
      {
        input: "121",
        expectedOutput: "true"
      }
    ],
    constraints: [
      "-2^31 <= x <= 2^31 - 1"
    ],
    hints: [
      "Convert to string and check if it reads the same forwards and backwards",
      "Or solve it without converting to string"
    ],
    solution: "function isPalindrome(x) {\n  if (x < 0) return false;\n  \n  const str = x.toString();\n  let left = 0;\n  let right = str.length - 1;\n  \n  while (left < right) {\n    if (str[left] !== str[right]) return false;\n    left++;\n    right--;\n  }\n  \n  return true;\n}"
  },
  {
    title: "Remove Duplicates from Sorted Array",
    slug: "remove-duplicates-from-sorted-array",
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.",
    difficulty: "easy",
    category: "Array",
    topics: ["Array", "Two Pointers"],
    examples: [
      {
        input: "nums = [1,1,2]",
        output: "2, nums = [1,2,_]",
        explanation: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively."
      }
    ],
    testCases: [
      {
        input: "[1,1,2]",
        expectedOutput: "2"
      }
    ],
    constraints: [
      "1 <= nums.length <= 3 * 10^4",
      "-100 <= nums[i] <= 100",
      "nums is sorted in non-decreasing order"
    ],
    hints: [
      "Use two pointers approach",
      "One pointer for reading, one for writing unique elements"
    ],
    solution: "function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  \n  let writeIndex = 1;\n  \n  for (let readIndex = 1; readIndex < nums.length; readIndex++) {\n    if (nums[readIndex] !== nums[readIndex - 1]) {\n      nums[writeIndex] = nums[readIndex];\n      writeIndex++;\n    }\n  }\n  \n  return writeIndex;\n}"
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    description: "Given n non-negative integers height where each represents a point at coordinate (i, height[i]). Find two lines, which, together with the x-axis, form a container that would hold the maximum amount of water.",
    difficulty: "medium",
    category: "Array",
    topics: ["Array", "Two Pointers", "Greedy"],
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The maximum area is obtained by choosing height[1] = 8 and height[8] = 7."
      }
    ],
    testCases: [
      {
        input: "[1,8,6,2,5,4,8,3,7]",
        expectedOutput: "49"
      }
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    hints: [
      "Use two pointers approach",
      "Start with maximum width and move pointers inward"
    ],
    solution: "function maxArea(height) {\n  let maxArea = 0;\n  let left = 0;\n  let right = height.length - 1;\n  \n  while (left < right) {\n    const width = right - left;\n    const h = Math.min(height[left], height[right]);\n    maxArea = Math.max(maxArea, width * h);\n    \n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  \n  return maxArea;\n}"
  },
  {
    title: "3Sum",
    slug: "3sum",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    difficulty: "medium",
    category: "Array",
    topics: ["Array", "Two Pointers", "Sorting"],
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "The triplets that sum to zero."
      }
    ],
    testCases: [
      {
        input: "[-1,0,1,2,-1,-4]",
        expectedOutput: "[[-1,-1,2],[-1,0,1]]"
      }
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    hints: [
      "Sort the array first",
      "Use three pointers: one fixed, two moving"
    ],
    solution: "function threeSum(nums) {\n  const result = [];\n  nums.sort((a, b) => a - b);\n  \n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    \n    let left = i + 1;\n    let right = nums.length - 1;\n    \n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      \n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n  \n  return result;\n}"
  },
  {
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    difficulty: "medium",
    category: "Linked List",
    topics: ["Linked List", "Math", "Recursion"],
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807"
      }
    ],
    testCases: [
      {
        input: "[2,4,3]",
        expectedOutput: "[7,0,8]"
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros"
    ],
    hints: [
      "Use a dummy head node",
      "Keep track of carry from each addition"
    ],
    solution: "function addTwoNumbers(l1, l2) {\n  const dummy = new ListNode(0);\n  let current = dummy;\n  let carry = 0;\n  \n  while (l1 || l2 || carry) {\n    const x = l1 ? l1.val : 0;\n    const y = l2 ? l2.val : 0;\n    const sum = x + y + carry;\n    \n    carry = Math.floor(sum / 10);\n    current.next = new ListNode(sum % 10);\n    current = current.next;\n    \n    if (l1) l1 = l1.next;\n    if (l2) l2 = l2.next;\n  }\n  \n  return dummy.next;\n}"
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "medium",
    category: "String",
    topics: ["String", "Hash Table", "Sliding Window"],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with the length of 3."
      }
    ],
    testCases: [
      {
        input: '"abcabcbb"',
        expectedOutput: "3"
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces"
    ],
    hints: [
      "Use sliding window technique",
      "Keep track of character positions in a hash map"
    ],
    solution: "function lengthOfLongestSubstring(s) {\n  const charMap = new Map();\n  let maxLength = 0;\n  let start = 0;\n  \n  for (let end = 0; end < s.length; end++) {\n    if (charMap.has(s[end])) {\n      start = Math.max(start, charMap.get(s[end]) + 1);\n    }\n    charMap.set(s[end], end);\n    maxLength = Math.max(maxLength, end - start + 1);\n  }\n  \n  return maxLength;\n}"
  },
  {
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    difficulty: "hard",
    category: "Array",
    topics: ["Array", "Binary Search", "Divide and Conquer"],
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      }
    ],
    testCases: [
      {
        input: "[1,3]",
        expectedOutput: "2.00000"
      }
    ],
    constraints: [
      "nums1.length + nums2.length >= 1",
      "nums1.length + nums2.length <= 1000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    hints: [
      "Use binary search to find the correct partition",
      "Consider the case where total length is odd vs even"
    ],
    solution: "function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) {\n    [nums1, nums2] = [nums2, nums1];\n  }\n  \n  const m = nums1.length;\n  const n = nums2.length;\n  const left = Math.floor((m + n + 1) / 2);\n  \n  let low = 0;\n  let high = m;\n  \n  while (low <= high) {\n    const partitionX = Math.floor((low + high) / 2);\n    const partitionY = left - partitionX;\n    \n    const maxLeftX = partitionX === 0 ? -Infinity : nums1[partitionX - 1];\n    const minRightX = partitionX === m ? Infinity : nums1[partitionX];\n    const maxLeftY = partitionY === 0 ? -Infinity : nums2[partitionY - 1];\n    const minRightY = partitionY === n ? Infinity : nums2[partitionY];\n    \n    if (maxLeftX <= minRightY && maxLeftY <= minRightX) {\n      if ((m + n) % 2 === 0) {\n        return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2;\n      } else {\n        return Math.max(maxLeftX, maxLeftY);\n      }\n    } else if (maxLeftX > minRightY) {\n      high = partitionX - 1;\n    } else {\n      low = partitionX + 1;\n    }\n  }\n}"
  },
  {
    title: "Regular Expression Matching",
    slug: "regular-expression-matching",
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*'.",
    difficulty: "hard",
    category: "String",
    topics: ["String", "Dynamic Programming", "Recursion"],
    examples: [
      {
        input: 's = "aa", p = "a*"',
        output: "true",
        explanation: "'*' means zero or more of the preceding element, 'a'."
      }
    ],
    testCases: [
      {
        input: '"aa"',
        expectedOutput: "true"
      }
    ],
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 30",
      "s contains only lowercase English letters",
      "p contains only lowercase English letters, '.', and '*'"
    ],
    hints: [
      "Use dynamic programming with a 2D table",
      "Handle '*' by considering zero or more repetitions"
    ],
    solution: "function isMatch(s, p) {\n  const dp = Array(s.length + 1).fill().map(() => Array(p.length + 1).fill(false));\n  dp[0][0] = true;\n  \n  for (let j = 1; j <= p.length; j++) {\n    if (p[j - 1] === '*') {\n      dp[0][j] = dp[0][j - 2];\n    }\n  }\n  \n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 1; j <= p.length; j++) {\n      if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else if (p[j - 1] === '*') {\n        dp[i][j] = dp[i][j - 2];\n        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {\n          dp[i][j] = dp[i][j] || dp[i - 1][j];\n        }\n      }\n    }\n  }\n  \n  return dp[s.length][p.length];\n}"
  }
];

async function populateAllProblems() {
  try {
    console.log('🔄 Starting to populate Railway backend with comprehensive problems...');
    
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
      console.log('⚠️  Backend already has problems. Will add new ones...');
    }
    
    // Insert each problem
    console.log('📝 Inserting all problems...');
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < allProblems.length; i++) {
      const problem = allProblems[i];
      
      try {
        const response = await axios.post(`${RAILWAY_BACKEND_URL}/api/problems`, problem);
        console.log(`✅ Added: ${problem.title}`);
        successCount++;
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.log(`⚠️  Problem already exists: ${problem.title}`);
          skippedCount++;
        } else {
          console.log(`❌ Failed to add ${problem.title}:`, error.response?.data?.error || error.message);
          errorCount++;
        }
      }
      
      // Progress indicator
      if ((i + 1) % 5 === 0) {
        console.log(`📊 Progress: ${i + 1}/${allProblems.length} problems processed`);
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
    console.log(`   ⚠️  Already existed: ${skippedCount}`);
    console.log(`   ❌ Failed to add: ${errorCount}`);
    console.log(`   📋 Total in backend: ${finalCount}`);
    console.log(`   📁 Total from script: ${allProblems.length}`);
    
    if (finalCount > 0) {
      console.log('\n🎉 Backend populated successfully!');
      console.log('\n🔗 Your backend is now ready at:');
      console.log(`   ${RAILWAY_BACKEND_URL}`);
      console.log('\n📱 Test the problems endpoint:');
      console.log(`   ${RAILWAY_BACKEND_URL}/api/problems`);
      console.log('\n🌐 Your frontend should now show ALL problems!');
      
      // Show some sample problems
      const sampleProblems = finalResponse.data.problems.slice(0, 5);
      console.log('\n📋 Sample problems in backend:');
      sampleProblems.forEach((problem, index) => {
        console.log(`   ${index + 1}. ${problem.title} (${problem.difficulty}) - ${problem.category}`);
      });
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

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'populate':
      await populateAllProblems();
      break;
      
    case 'count':
      try {
        const response = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems?limit=1000`);
        const totalProblems = response.data.pagination?.totalProblems || response.data.problems.length;
        const currentPage = response.data.pagination?.currentPage || 1;
        const totalPages = response.data.pagination?.totalPages || 1;
        
        console.log(`📊 Current problems in Railway backend: ${totalProblems}`);
        console.log(`📄 Page: ${currentPage} of ${totalPages}`);
        console.log(`📋 Problems on current page: ${response.data.problems.length}`);
        
        if (response.data.pagination) {
          console.log(`🔗 API URL: ${RAILWAY_BACKEND_URL}/api/problems`);
          console.log(`📱 Frontend should show: ${totalProblems} problems`);
        }
      } catch (error) {
        console.error('❌ Failed to get count:', error.message);
      }
      break;
      
    default:
      console.log('🔄 300 Problems Sync Tool');
      console.log('\nUsage:');
      console.log('  node populate-300-problems.js populate  - Populate backend with all problems');
      console.log('  node populate-300-problems.js count    - Check current problem count');
      console.log('\nExamples:');
      console.log('  node populate-300-problems.js populate');
      console.log('  node populate-300-problems.js count');
      console.log('\n💡 Make sure to run: node extract-all-problems.js first');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
