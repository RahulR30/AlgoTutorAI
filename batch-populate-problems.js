const axios = require('axios');

// Your Railway backend URL
const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

// Small batch of high-quality problems
const problems = [
  {
    title: "Two Sum II - Input Array Is Sorted",
    slug: "two-sum-ii-input-array-is-sorted",
    description: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.",
    difficulty: "medium",
    category: "Array",
    topics: ["Array", "Two Pointers", "Binary Search"],
    examples: [
      {
        input: "numbers = [2,7,11,15], target = 9",
        output: "[1,2]",
        explanation: "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2]."
      }
    ],
    testCases: [
      {
        input: "[2,7,11,15]",
        expectedOutput: "[1,2]",
        target: 9
      }
    ],
    constraints: [
      "2 <= numbers.length <= 3 * 10^4",
      "-1000 <= numbers[i] <= 1000",
      "numbers is sorted in non-decreasing order",
      "-1000 <= target <= 1000"
    ],
    hints: [
      "Use two pointers approach since array is sorted",
      "Start with left pointer at beginning and right pointer at end"
    ],
    solution: "function twoSum(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n  \n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) {\n      return [left + 1, right + 1];\n    } else if (sum < target) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n  \n  return [];\n}"
  },
  {
    title: "3Sum Closest",
    slug: "3sum-closest",
    description: "Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target.",
    difficulty: "medium",
    category: "Array",
    topics: ["Array", "Two Pointers", "Sorting"],
    examples: [
      {
        input: "nums = [-1,2,1,-4], target = 1",
        output: "2",
        explanation: "The sum that is closest to the target is 2. (-1 + 2 + 1 = 2)."
      }
    ],
    testCases: [
      {
        input: "[-1,2,1,-4]",
        expectedOutput: "2",
        target: 1
      }
    ],
    constraints: [
      "3 <= nums.length <= 1000",
      "-1000 <= nums[i] <= 1000",
      "-10^4 <= target <= 10^4"
    ],
    hints: [
      "Sort the array first",
      "Use three pointers: one fixed, two moving"
    ],
    solution: "function threeSumClosest(nums, target) {\n  nums.sort((a, b) => a - b);\n  let closest = nums[0] + nums[1] + nums[2];\n  \n  for (let i = 0; i < nums.length - 2; i++) {\n    let left = i + 1;\n    let right = nums.length - 1;\n    \n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n      \n      if (Math.abs(sum - target) < Math.abs(closest - target)) {\n        closest = sum;\n      }\n      \n      if (sum < target) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n  \n  return closest;\n}"
  },
  {
    title: "4Sum",
    slug: "4sum",
    description: "Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that nums[a] + nums[b] + nums[c] + nums[d] == target.",
    difficulty: "medium",
    category: "Array",
    topics: ["Array", "Two Pointers", "Sorting"],
    examples: [
      {
        input: "nums = [1,0,-1,0,-2,2], target = 0",
        output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
        explanation: "The quadruplets that sum to 0."
      }
    ],
    testCases: [
      {
        input: "[1,0,-1,0,-2,2]",
        expectedOutput: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]",
        target: 0
      }
    ],
    constraints: [
      "1 <= nums.length <= 200",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    hints: [
      "Sort the array first",
      "Use four pointers: two fixed, two moving"
    ],
    solution: "function fourSum(nums, target) {\n  const result = [];\n  nums.sort((a, b) => a - b);\n  \n  for (let i = 0; i < nums.length - 3; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    \n    for (let j = i + 1; j < nums.length - 2; j++) {\n      if (j > i + 1 && nums[j] === nums[j - 1]) continue;\n      \n      let left = j + 1;\n      let right = nums.length - 1;\n      \n      while (left < right) {\n        const sum = nums[i] + nums[j] + nums[left] + nums[right];\n        \n        if (sum === target) {\n          result.push([nums[i], nums[j], nums[left], nums[right]]);\n          while (left < right && nums[left] === nums[left + 1]) left++;\n          while (left < right && nums[right] === nums[right - 1]) right--;\n          left++;\n          right--;\n        } else if (sum < target) {\n          left++;\n        } else {\n          right--;\n        }\n      }\n    }\n  }\n  \n  return result;\n}"
  },
  {
    title: "Remove Element",
    slug: "remove-element",
    description: "Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The relative order of the elements may be changed.",
    difficulty: "easy",
    category: "Array",
    topics: ["Array", "Two Pointers"],
    examples: [
      {
        input: "nums = [3,2,2,3], val = 3",
        output: "2, nums = [2,2,_,_]",
        explanation: "Your function should return k = 2, with the first two elements of nums being 2."
      }
    ],
    testCases: [
      {
        input: "[3,2,2,3]",
        expectedOutput: "2",
        val: 3
      }
    ],
    constraints: [
      "0 <= nums.length <= 100",
      "0 <= nums[i] <= 50",
      "0 <= val <= 100"
    ],
    hints: [
      "Use two pointers approach",
      "One pointer for reading, one for writing"
    ],
    solution: "function removeElement(nums, val) {\n  let writeIndex = 0;\n  \n  for (let readIndex = 0; readIndex < nums.length; readIndex++) {\n    if (nums[readIndex] !== val) {\n      nums[writeIndex] = nums[readIndex];\n      writeIndex++;\n    }\n  }\n  \n  return writeIndex;\n}"
  },
  {
    title: "Next Permutation",
    slug: "next-permutation",
    description: "Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers.",
    difficulty: "medium",
    category: "Array",
    topics: ["Array", "Two Pointers"],
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[1,3,2]",
        explanation: "The next permutation of [1,2,3] is [1,3,2]."
      }
    ],
    testCases: [
      {
        input: "[1,2,3]",
        expectedOutput: "[1,3,2]"
      }
    ],
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 100"
    ],
    hints: [
      "Find the first decreasing element from right",
      "Swap with the next greater element and reverse the suffix"
    ],
    solution: "function nextPermutation(nums) {\n  let i = nums.length - 2;\n  \n  // Find first decreasing element from right\n  while (i >= 0 && nums[i] >= nums[i + 1]) {\n    i--;\n  }\n  \n  if (i >= 0) {\n    let j = nums.length - 1;\n    \n    // Find next greater element\n    while (j >= 0 && nums[j] <= nums[i]) {\n      j--;\n    }\n    \n    // Swap\n    [nums[i], nums[j]] = [nums[j], nums[i]];\n  }\n  \n  // Reverse suffix\n  let left = i + 1;\n  let right = nums.length - 1;\n  while (left < right) {\n    [nums[left], nums[right]] = [nums[right], nums[left]];\n    left++;\n    right--;\n  }\n}"
  }
];

async function populateBatch() {
  try {
    console.log('🔄 Starting batch problem population...');
    
    // First, check if backend is accessible
    console.log('🔍 Testing backend connection...');
    const healthResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/health`);
    console.log('✅ Backend is accessible:', healthResponse.data.status);
    
    // Check current problems count
    console.log('📊 Checking current problems...');
    const problemsResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const currentCount = problemsResponse.data.problems.length;
    console.log(`📋 Current problems in backend: ${currentCount}`);
    
    // Insert each problem with longer delays
    console.log('📝 Inserting problems in batch...');
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      
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
      
      // Longer delay between requests to avoid rate limiting
      if (i < problems.length - 1) {
        console.log('⏳ Waiting 2 seconds before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Verify the data
    console.log('\n🔍 Verifying data...');
    const finalResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const finalCount = finalResponse.data.problems.length;
    console.log(`📊 Final problems count: ${finalCount}`);
    
    console.log('\n📊 Batch Summary:');
    console.log(`   ✅ Successfully added: ${successCount}`);
    console.log(`   ⚠️  Already existed: ${skippedCount}`);
    console.log(`   ❌ Failed to add: ${errorCount}`);
    console.log(`   📋 Total in backend: ${finalCount}`);
    console.log(`   📁 Total in batch: ${problems.length}`);
    
    if (finalCount > 0) {
      console.log('\n🎉 Batch populated successfully!');
      console.log('\n🔗 Your backend is now ready at:');
      console.log(`   ${RAILWAY_BACKEND_URL}`);
      console.log('\n📱 Test the problems endpoint:');
      console.log(`   ${RAILWAY_BACKEND_URL}/api/problems`);
      console.log('\n🌐 Your frontend should now show more problems!');
    } else {
      console.log('\n⚠️  No problems were added. Check your backend logs.');
    }
    
  } catch (error) {
    console.error('❌ Failed to populate batch:', error.message);
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
      await populateBatch();
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
      console.log('📦 Batch Problems Populator');
      console.log('\nUsage:');
      console.log('  node batch-populate-problems.js populate  - Add problems in small batches');
      console.log('  node batch-populate-problems.js count    - Check current problem count');
      console.log('\nExamples:');
      console.log('  node batch-populate-problems.js populate');
      console.log('  node batch-populate-problems.js count');
      console.log('\n💡 This script adds problems slowly to avoid rate limiting');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
