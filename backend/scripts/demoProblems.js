module.exports = [
  {
    title: 'Two Sum', difficulty: 'easy', category: 'algorithms', topics: ['arrays', 'hash-table'],
    description: 'Given nums and target, return the indices of two numbers that add up to target. Return the smaller index first.',
    constraints: ['Exactly one solution exists; do not reuse an element.'],
    examples: [{ input: '{"nums":[2,7,11,15],"target":9}', output: '[0,1]' }],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Return the two indices.\n}',
      python: 'def twoSum(nums, target):\n    # Return the two indices.\n    pass'
    },
    solution: 'Track previously seen values in a map and look up target minus the current value.',
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] }
    ]
  },
  {
    title: 'Sum an Array', difficulty: 'easy', category: 'algorithms', topics: ['arrays'],
    description: 'Return the sum of all numbers in the input array. An empty array sums to zero.',
    examples: [{ input: '[1,2,3]', output: '6' }],
    starterCode: { javascript: 'function solution(numbers) {\n  // Return the sum.\n}', python: 'def solution(numbers):\n    pass' },
    solution: 'Accumulate each number, starting at zero.',
    testCases: [{ input: [1, 2, 3], expectedOutput: 6 }, { input: [], expectedOutput: 0 }]
  },
  {
    title: 'Reverse a String', difficulty: 'easy', category: 'algorithms', topics: ['strings'],
    description: 'Return the characters of text in reverse order.',
    examples: [{ input: '{"text":"hello"}', output: 'olleh' }],
    starterCode: { javascript: 'function reverse(text) {\n  // Return reversed text.\n}', python: 'def reverse(text):\n    pass' },
    solution: 'Visit characters from the last index to the first.',
    testCases: [{ input: { text: 'hello' }, expectedOutput: 'olleh' }, { input: { text: 'a' }, expectedOutput: 'a' }]
  }
];
