const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Comprehensive problem templates covering ALL possible problem types
const comprehensiveTemplates = {
  // Array problems
  'arrays': {
    'easy': [
      {
        title: 'Array Sum',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '15', explanation: 'Sum of all elements: 1+2+3+4+5 = 15' },
          { input: '[10, 20, 30]', output: '60', explanation: 'Sum of all elements: 10+20+30 = 60' }
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
        constraints: ['Time: O(n)', 'Space: O(1)'],
        hints: ['Use reduce() method', 'Start with sum = 0', 'Add each element to running sum'],
        learningObjectives: ['Master array iteration', 'Understand reduce operations'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
        estimatedTime: 10,
        category: 'arrays'
      },
      {
        title: 'Find Maximum',
        examples: [
          { input: '[3, 1, 4, 1, 5, 9, 2, 6]', output: '9', explanation: 'The maximum value in the array is 9' },
          { input: '[-1, -5, -10]', output: '-1', explanation: 'The maximum value in the array is -1' }
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
        constraints: ['Time: O(n)', 'Space: O(1)'],
        hints: ['Use Math.max() with spread operator', 'Or iterate through array to find max'],
        learningObjectives: ['Learn Math.max usage', 'Understand spread operator'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
        estimatedTime: 8,
        category: 'arrays'
      }
    ],
    'medium': [
      {
        title: 'Maximum Subarray Sum',
        examples: [
          { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: 'Subarray [4, -1, 2, 1] has largest sum of 6' },
          { input: '[1, 2, 3, 4]', output: '10', explanation: 'Entire array has largest sum of 10' }
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
        constraints: ['Time: O(n)', 'Space: O(1)'],
        hints: ['Use Kadane\'s algorithm', 'Track current subarray sum and global maximum'],
        learningObjectives: ['Learn Kadane\'s algorithm', 'Understand dynamic programming concepts'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Basic algorithms'],
        estimatedTime: 25,
        category: 'arrays'
      }
    ],
    'hard': [
      {
        title: 'Merge K Sorted Arrays',
        examples: [
          { input: '[[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'Merge all sorted arrays into one sorted array' },
          { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,4,5,6,7,8,9]', explanation: 'Merge three sorted arrays' }
        ],
        testCases: [
          { input: { arrays: [[1,4,5],[1,3,4],[2,6]] }, expectedOutput: [1,1,2,3,4,4,5,6], isHidden: false },
          { input: { arrays: [[1,2,3],[4,5,6],[7,8,9]] }, expectedOutput: [1,2,3,4,5,6,7,8,9], isHidden: false },
          { input: { arrays: [[1],[2],[3]] }, expectedOutput: [1,2,3], isHidden: false },
          { input: { arrays: [[],[1,2],[3,4]] }, expectedOutput: [1,2,3,4], isHidden: true }
        ],
        solution: `function solution(arrays) {
  const result = [];
  
  // Use min heap to efficiently merge
  const minHeap = [];
  
  // Add first element from each array
  arrays.forEach((arr, index) => {
    if (arr.length > 0) {
      minHeap.push({ value: arr[0], arrayIndex: index, elementIndex: 0 });
    }
  });
  
  // Build min heap
  buildMinHeap(minHeap);
  
  while (minHeap.length > 0) {
    const { value, arrayIndex, elementIndex } = extractMin(minHeap);
    result.push(value);
    
    // Add next element from same array if available
    if (elementIndex + 1 < arrays[arrayIndex].length) {
      insert(minHeap, {
        value: arrays[arrayIndex][elementIndex + 1],
        arrayIndex,
        elementIndex: elementIndex + 1
      });
    }
  }
  
  return result;
}`,
        constraints: ['Time: O(n log k)', 'Space: O(k)'],
        hints: ['Use min heap to track smallest elements', 'Add next element from same array after extracting'],
        learningObjectives: ['Learn heap data structure', 'Understand merge algorithms'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Heap concepts'],
        estimatedTime: 35,
        category: 'arrays'
      }
    ]
  },
  
  // String problems
  'strings': {
    'easy': [
      {
        title: 'Reverse String',
        examples: [
          { input: '"hello"', output: '"olleh"', explanation: 'Each character reversed: h->o, e->l, l->l, l->e, o->h' },
          { input: '"world"', output: '"dlrow"', explanation: 'Each character reversed: w->d, o->l, r->r, l->o, d->w' }
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
        constraints: ['Time: O(n)', 'Space: O(n)'],
        hints: ['Split string into array of characters', 'Reverse the array', 'Join characters back into string'],
        learningObjectives: ['Learn string manipulation', 'Understand array methods'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings and arrays'],
        estimatedTime: 10,
        category: 'strings'
      }
    ],
    'medium': [
      {
        title: 'Word Break II',
        examples: [
          { input: 's = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]', output: '["cats and dog","cat sand dog"]', explanation: 'String can be broken in two ways' },
          { input: 's = "pineapplepenapple", wordDict = ["apple","pen","applepen","pine","pineapple"]', output: '["pine apple pen apple","pineapple pen apple","pine applepen apple"]', explanation: 'Multiple valid combinations' }
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
        constraints: ['Time: O(n^3)', 'Space: O(n)'],
        hints: ['Use backtracking to try all possible combinations', 'Check if each substring is in dictionary'],
        learningObjectives: ['Learn backtracking algorithms', 'Understand string manipulation', 'Practice recursion'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings', 'Recursion concepts'],
        estimatedTime: 30,
        category: 'strings'
      }
    ]
  },
  
  // Linked List problems
  'linked-lists': {
    'easy': [
      {
        title: 'Reverse Linked List',
        examples: [
          { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]', explanation: 'Linked list reversed: 1->2->3->4->5 becomes 5->4->3->2->1' },
          { input: '[1, 2]', output: '[2, 1]', explanation: 'Linked list reversed: 1->2 becomes 2->1' }
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
        constraints: ['Time: O(n)', 'Space: O(1)'],
        hints: ['Use three pointers: prev, current, next', 'Update links as you traverse', 'Return the new head (prev)'],
        learningObjectives: ['Learn linked list manipulation', 'Understand pointer manipulation'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of linked lists', 'Pointer concepts'],
        estimatedTime: 20,
        category: 'linked-lists'
      }
    ]
  },
  
  // Tree problems
  'trees': {
    'easy': [
      {
        title: 'Maximum Depth of Binary Tree',
        examples: [
          { input: '[3,9,20,null,null,15,7]', output: '3', explanation: 'Tree has maximum depth of 3 levels' },
          { input: '[1,null,2]', output: '2', explanation: 'Tree has maximum depth of 2 levels' }
        ],
        testCases: [
          { input: { root: [3,9,20,null,null,15,7] }, expectedOutput: 3, isHidden: false },
          { input: { root: [1,null,2] }, expectedOutput: 2, isHidden: false },
          { input: { root: [] }, expectedOutput: 0, isHidden: false },
          { input: { root: [1] }, expectedOutput: 1, isHidden: true }
        ],
        solution: `function solution(root) {
  if (!root) return 0;
  
  const leftDepth = solution(root.left);
  const rightDepth = solution(root.right);
  
  return Math.max(leftDepth, rightDepth) + 1;
}`,
        constraints: ['Time: O(n)', 'Space: O(h) where h is height'],
        hints: ['Use recursion', 'Base case: empty tree has depth 0', 'Return max of left and right subtree depths + 1'],
        learningObjectives: ['Learn tree traversal', 'Understand recursion with trees'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of trees', 'Recursion concepts'],
        estimatedTime: 15,
        category: 'trees'
      }
    ]
  },
  
  // Graph problems
  'graphs': {
    'medium': [
      {
        title: 'Graph Traversal',
        examples: [
          { input: 'Graph with nodes [1,2,3,4] and edges [[1,2],[2,3],[3,4]]', output: '[1,2,3,4]', explanation: 'BFS traversal visits nodes level by level' },
          { input: 'Graph with nodes [1,2,3] and edges [[1,2],[2,3]]', output: '[1,2,3]', explanation: 'DFS traversal explores as far as possible' }
        ],
        testCases: [
          { input: { graph: [[1,2],[2,3],[3,4]], start: 1 }, expectedOutput: [1,2,3,4], isHidden: false },
          { input: { graph: [[1,2],[2,3]], start: 1 }, expectedOutput: [1,2,3], isHidden: false },
          { input: { graph: [], start: 1 }, expectedOutput: [1], isHidden: false },
          { input: { graph: [[1,2],[2,3],[3,4]], start: 2 }, expectedOutput: [2,1,3,4], isHidden: true }
        ],
        solution: `function solution(graph, start) {
  const visited = new Set();
  const result = [];
  
  function dfs(node) {
    if (visited.has(node)) return;
    
    visited.add(node);
    result.push(node);
    
    // Find all neighbors
    for (const [from, to] of graph) {
      if (from === node && !visited.has(to)) {
        dfs(to);
      }
    }
  }
  
  dfs(start);
  return result;
}`,
        constraints: ['Time: O(V + E)', 'Space: O(V)'],
        hints: ['Use DFS or BFS', 'Keep track of visited nodes', 'Explore all neighbors'],
        learningObjectives: ['Learn graph traversal algorithms', 'Understand DFS and BFS'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of graphs', 'Recursion concepts'],
        estimatedTime: 25,
        category: 'graphs'
      }
    ]
  },
  
  // Stack problems
  'stacks': {
    'easy': [
      {
        title: 'Valid Parentheses',
        examples: [
          { input: '"()"', output: 'true', explanation: 'Simple valid parentheses' },
          { input: '"()[]{}"', output: 'true', explanation: 'Multiple valid parentheses' },
          { input: '"(]"', output: 'false', explanation: 'Invalid parentheses combination' }
        ],
        testCases: [
          { input: { s: '()' }, expectedOutput: true, isHidden: false },
          { input: { s: '()[]{}' }, expectedOutput: true, isHidden: false },
          { input: { s: '(]' }, expectedOutput: false, isHidden: false },
          { input: { s: '([)]' }, expectedOutput: false, isHidden: true }
        ],
        solution: `function solution(s) {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  
  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`,
        constraints: ['Time: O(n)', 'Space: O(n)'],
        hints: ['Use stack to track opening parentheses', 'Check if closing parentheses match top of stack'],
        learningObjectives: ['Learn stack data structure', 'Understand parentheses matching'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of stacks'],
        estimatedTime: 15,
        category: 'stacks'
      }
    ]
  },
  
  // Queue problems
  'queues': {
    'medium': [
      {
        title: 'Queue Management',
        examples: [
          { input: 'Enqueue: [1,2,3], Dequeue: 2 times', output: '[1,2]', explanation: 'First two elements dequeued' },
          { input: 'Enqueue: [5,10,15], Dequeue: 1 time', output: '[5]', explanation: 'First element dequeued' }
        ],
        testCases: [
          { input: { operations: ['enqueue', 'enqueue', 'enqueue', 'dequeue', 'dequeue'], values: [1,2,3] }, expectedOutput: [1,2], isHidden: false },
          { input: { operations: ['enqueue', 'enqueue', 'enqueue', 'dequeue'], values: [5,10,15] }, expectedOutput: [5], isHidden: false },
          { input: { operations: ['enqueue'], values: [42] }, expectedOutput: [42], isHidden: false },
          { input: { operations: ['enqueue', 'enqueue', 'dequeue', 'dequeue'], values: [1,2] }, expectedOutput: [], isHidden: true }
        ],
        solution: `function solution(operations, values) {
  const queue = [];
  const result = [];
  
  for (let i = 0; i < operations.length; i++) {
    if (operations[i] === 'enqueue') {
      queue.push(values[i]);
    } else if (operations[i] === 'dequeue') {
      if (queue.length > 0) {
        result.push(queue.shift());
      }
    }
  }
  
  return result;
}`,
        constraints: ['Time: O(n)', 'Space: O(n)'],
        hints: ['Use array as queue', 'Enqueue adds to end, dequeue removes from front'],
        learningObjectives: ['Learn queue data structure', 'Understand FIFO principle'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of queues'],
        estimatedTime: 20,
        category: 'queues'
      }
    ]
  },
  
  // Math problems
  'math': {
    'easy': [
      {
        title: 'Fizz Buzz',
        examples: [
          { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', explanation: 'Multiples of 3 are Fizz, multiples of 5 are Buzz, multiples of both are FizzBuzz' },
          { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]', explanation: 'First 5 numbers with FizzBuzz rules' }
        ],
        testCases: [
          { input: { n: 15 }, expectedOutput: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'], isHidden: false },
          { input: { n: 5 }, expectedOutput: ['1','2','Fizz','4','Buzz'], isHidden: false },
          { input: { n: 1 }, expectedOutput: ['1'], isHidden: false },
          { input: { n: 3 }, expectedOutput: ['1','2','Fizz'], isHidden: true }
        ],
        solution: `function solution(n) {
  const result = [];
  
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push('FizzBuzz');
    } else if (i % 3 === 0) {
      result.push('Fizz');
    } else if (i % 5 === 0) {
      result.push('Buzz');
    } else {
      result.push(i.toString());
    }
  }
  
  return result;
}`,
        constraints: ['Time: O(n)', 'Space: O(n)'],
        hints: ['Check divisibility by 3 and 5', 'Use modulo operator', 'Handle multiples of both numbers first'],
        learningObjectives: ['Learn modulo operations', 'Understand conditional logic'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of loops and conditionals'],
        estimatedTime: 10,
        category: 'math'
      }
    ]
  },
  
  // Dynamic Programming problems
  'dynamic-programming': {
    'medium': [
      {
        title: 'Climbing Stairs',
        examples: [
          { input: 'n = 3', output: '3', explanation: 'Three ways: 1+1+1, 1+2, 2+1' },
          { input: 'n = 4', output: '5', explanation: 'Five ways: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2' }
        ],
        testCases: [
          { input: { n: 3 }, expectedOutput: 3, isHidden: false },
          { input: { n: 4 }, expectedOutput: 5, isHidden: false },
          { input: { n: 2 }, expectedOutput: 2, isHidden: false },
          { input: { n: 5 }, expectedOutput: 8, isHidden: true }
        ],
        solution: `function solution(n) {
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
        constraints: ['Time: O(n)', 'Space: O(1)'],
        hints: ['Use dynamic programming', 'Each step depends on previous two steps', 'Use two variables to track previous values'],
        learningObjectives: ['Learn dynamic programming', 'Understand Fibonacci sequence'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of loops', 'Basic algorithms'],
        estimatedTime: 20,
        category: 'dynamic-programming'
      }
    ]
  },
  
  // Binary Search problems
  'binary-search': {
    'medium': [
      {
        title: 'Binary Search',
        examples: [
          { input: 'arr = [1,3,5,7,9], target = 5', output: '2', explanation: 'Target 5 is at index 2' },
          { input: 'arr = [1,3,5,7,9], target = 2', output: '-1', explanation: 'Target 2 is not in array' }
        ],
        testCases: [
          { input: { arr: [1,3,5,7,9], target: 5 }, expectedOutput: 2, isHidden: false },
          { input: { arr: [1,3,5,7,9], target: 2 }, expectedOutput: -1, isHidden: false },
          { input: { arr: [1], target: 1 }, expectedOutput: 0, isHidden: false },
          { input: { arr: [1,2,3], target: 4 }, expectedOutput: -1, isHidden: true }
        ],
        solution: `function solution(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
        constraints: ['Time: O(log n)', 'Space: O(1)'],
        hints: ['Array must be sorted', 'Use two pointers', 'Calculate middle index'],
        learningObjectives: ['Learn binary search algorithm', 'Understand logarithmic time complexity'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Basic algorithms'],
        estimatedTime: 20,
        category: 'binary-search'
      }
    ]
  },
  
  // Sorting problems
  'sorting': {
    'easy': [
      {
        title: 'Sort Colors',
        examples: [
          { input: '[2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: 'Sort colors: 0=red, 1=white, 2=blue' },
          { input: '[2,0,1]', output: '[0,1,2]', explanation: 'Sort colors in ascending order' }
        ],
        testCases: [
          { input: { nums: [2,0,2,1,1,0] }, expectedOutput: [0,0,1,1,2,2], isHidden: false },
          { input: { nums: [2,0,1] }, expectedOutput: [0,1,2], isHidden: false },
          { input: { nums: [0] }, expectedOutput: [0], isHidden: false },
          { input: { nums: [1,1,1] }, expectedOutput: [1,1,1], isHidden: true }
        ],
        solution: `function solution(nums) {
  let left = 0;
  let right = nums.length - 1;
  let i = 0;
  
  while (i <= right) {
    if (nums[i] === 0) {
      [nums[i], nums[left]] = [nums[left], nums[i]];
      left++;
      i++;
    } else if (nums[i] === 2) {
      [nums[i], nums[right]] = [nums[right], nums[i]];
      right--;
    } else {
      i++;
    }
  }
  
  return nums;
}`,
        constraints: ['Time: O(n)', 'Space: O(1)'],
        hints: ['Use three pointers', 'Move 0s to left, 2s to right', 'Keep 1s in middle'],
        learningObjectives: ['Learn three-pointer technique', 'Understand in-place sorting'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Pointer manipulation'],
        estimatedTime: 25,
        category: 'sorting'
      }
    ]
  },
  
  // Hash Table problems
  'hash-tables': {
    'medium': [
      {
        title: 'Group Anagrams',
        examples: [
          { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Group strings with same character count' },
          { input: '["a"]', output: '[["a"]]', explanation: 'Single string forms its own group' }
        ],
        testCases: [
          { input: { strs: ['eat','tea','tan','ate','nat','bat'] }, expectedOutput: [['bat'],['nat','tan'],['ate','eat','tea']], isHidden: false },
          { input: { strs: ['a'] }, expectedOutput: [['a']], isHidden: false },
          { input: { strs: [''] }, expectedOutput: [['']], isHidden: false },
          { input: { strs: ['abc','cba','bac'] }, expectedOutput: [['abc','cba','bac']], isHidden: true }
        ],
        solution: `function solution(strs) {
  const groups = new Map();
  
  for (const str of strs) {
    const sorted = str.split('').sort().join('');
    
    if (!groups.has(sorted)) {
      groups.set(sorted, []);
    }
    
    groups.get(sorted).push(str);
  }
  
  return Array.from(groups.values());
}`,
        constraints: ['Time: O(n * k log k)', 'Space: O(n * k)'],
        hints: ['Sort each string to create key', 'Use hash map to group', 'Return grouped arrays'],
        learningObjectives: ['Learn hash map usage', 'Understand anagram grouping'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings', 'Hash map concepts'],
        estimatedTime: 20,
        category: 'hash-tables'
      }
    ]
  },
  
  // Bit Manipulation problems
  'bit-manipulation': {
    'easy': [
      {
        title: 'Bit Manipulation',
        examples: [
          { input: 'n = 5, k = 1', output: 'true', explanation: '5 in binary is 101, bit at position 1 is 1 (true)' },
          { input: 'n = 5, k = 2', output: 'false', explanation: '5 in binary is 101, bit at position 2 is 0 (false)' }
        ],
        testCases: [
          { input: { n: 5, k: 1 }, expectedOutput: true, isHidden: false },
          { input: { n: 5, k: 2 }, expectedOutput: false, isHidden: false },
          { input: { n: 1, k: 0 }, expectedOutput: true, isHidden: false },
          { input: { n: 8, k: 3 }, expectedOutput: true, isHidden: true }
        ],
        solution: `function solution(n, k) {
  return (n & (1 << k)) !== 0;
}`,
        constraints: ['Time: O(1)', 'Space: O(1)'],
        hints: ['Use bitwise AND', 'Left shift 1 by k positions', 'Check if result is non-zero'],
        learningObjectives: ['Learn bitwise operations', 'Understand bit manipulation'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of binary numbers'],
        estimatedTime: 15,
        category: 'bit-manipulation'
      }
    ]
  },
  
  // Recursion problems
  'recursion': {
    'medium': [
      {
        title: 'Recursive Problem',
        examples: [
          { input: 'n = 4', output: '24', explanation: '4! = 4 * 3 * 2 * 1 = 24' },
          { input: 'n = 5', output: '120', explanation: '5! = 5 * 4 * 3 * 2 * 1 = 120' }
        ],
        testCases: [
          { input: { n: 4 }, expectedOutput: 24, isHidden: false },
          { input: { n: 5 }, expectedOutput: 120, isHidden: false },
          { input: { n: 1 }, expectedOutput: 1, isHidden: false },
          { input: { n: 0 }, expectedOutput: 1, isHidden: true }
        ],
        solution: `function solution(n) {
  if (n <= 1) return 1;
  return n * solution(n - 1);
}`,
        constraints: ['Time: O(n)', 'Space: O(n)'],
        hints: ['Base case: n <= 1 returns 1', 'Recursive case: n * factorial(n-1)'],
        learningObjectives: ['Learn recursion', 'Understand factorial calculation'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of functions'],
        estimatedTime: 15,
        category: 'recursion'
      }
    ]
  }
};

// Function to get appropriate template for any problem
function getTemplateForProblem(problem) {
  const title = problem.title.toLowerCase();
  const topics = problem.topics || ['arrays'];
  const difficulty = problem.difficulty || 'easy';
  
  // Determine the main topic based on title and topics
  let mainTopic = topics[0];
  
  // Map specific problem types to topics
  if (title.includes('word') || title.includes('string') || title.includes('anagram') || title.includes('parentheses')) {
    mainTopic = 'strings';
  } else if (title.includes('linked') || title.includes('list')) {
    mainTopic = 'linked-lists';
  } else if (title.includes('tree') || title.includes('depth') || title.includes('height')) {
    mainTopic = 'trees';
  } else if (title.includes('graph') || title.includes('traversal') || title.includes('path')) {
    mainTopic = 'graphs';
  } else if (title.includes('stack') || title.includes('parentheses') || title.includes('bracket')) {
    mainTopic = 'stacks';
  } else if (title.includes('queue') || title.includes('enqueue') || title.includes('dequeue')) {
    mainTopic = 'queues';
  } else if (title.includes('fizz') || title.includes('buzz') || title.includes('math')) {
    mainTopic = 'math';
  } else if (title.includes('climbing') || title.includes('stairs') || title.includes('fibonacci')) {
    mainTopic = 'dynamic-programming';
  } else if (title.includes('binary') || title.includes('search')) {
    mainTopic = 'binary-search';
  } else if (title.includes('sort') || title.includes('color')) {
    mainTopic = 'sorting';
  } else if (title.includes('hash') || title.includes('anagram') || title.includes('group')) {
    mainTopic = 'hash-tables';
  } else if (title.includes('bit') || title.includes('manipulation')) {
    mainTopic = 'bit-manipulation';
  } else if (title.includes('recursion') || title.includes('recursive')) {
    mainTopic = 'recursion';
  }
  
  // Get available templates for this topic and difficulty
  const topicTemplates = comprehensiveTemplates[mainTopic];
  if (!topicTemplates) {
    // Fallback to arrays if topic not found
    return comprehensiveTemplates['arrays']['easy'][0];
  }
  
  const diffTemplates = topicTemplates[difficulty];
  if (!diffTemplates) {
    // Fallback to easy if difficulty not found
    return topicTemplates['easy'] ? topicTemplates['easy'][0] : comprehensiveTemplates['arrays']['easy'][0];
  }
  
  // Return the first available template
  return diffTemplates[0];
}

// Function to fix a single problem
async function fixProblem(problem) {
  const template = getTemplateForProblem(problem);
  
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
async function fixAllProblemsComprehensive() {
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
    
    console.log(`\n🎉 Comprehensive problem fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`⏭️  Skipped: ${skippedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view ALL fixed problems`);
    
  } catch (error) {
    console.error('❌ Error fixing problems:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllProblemsComprehensive();
}

module.exports = { fixAllProblemsComprehensive };
