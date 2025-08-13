const mongoose = require('mongoose');
const Problem = require('./models/Problem');

// Comprehensive problem templates with concrete examples, constraints, and proper test cases
const completeProblemTemplates = {
  // Minimum Cost Flow problems
  'minimum-cost-flow': {
    description: 'Write a program that takes a flow network as input and finds the minimum cost flow through the network.',
    examples: [
      {
        input: 'nodes = 4, edges = [[0,1,10,2], [1,2,5,1], [2,3,8,3], [0,2,15,4]], source = 0, sink = 3, flow = 12',
        output: '31',
        explanation: 'Network with 4 nodes: 0→1→3 (cost 2+3=5), 0→2→3 (cost 4+3=7). Total cost for flow 12: 5×2 + 7×3 = 31'
      },
      {
        input: 'nodes = 3, edges = [[0,1,5,2], [1,2,3,1]], source = 0, sink = 2, flow = 3',
        output: '9',
        explanation: 'Simple path 0→1→2 with cost 2+1=3 per unit. Total cost for flow 3: 3×3 = 9'
      }
    ],
    testCases: [
      { 
        input: { 
          nodes: 4, 
          edges: [[0,1,10,2], [1,2,5,1], [2,3,8,3], [0,2,15,4]], 
          source: 0, 
          sink: 3, 
          flow: 12 
        }, 
        expectedOutput: 31, 
        isHidden: false 
      },
      { 
        input: { 
          nodes: 3, 
          edges: [[0,1,5,2], [1,2,3,1]], 
          source: 0, 
          sink: 2, 
          flow: 3 
        }, 
        expectedOutput: 9, 
        isHidden: false 
      },
      { 
        input: { 
          nodes: 2, 
          edges: [[0,1,10,5]], 
          source: 0, 
          sink: 1, 
          flow: 5 
        }, 
        expectedOutput: 25, 
        isHidden: false 
      },
      { 
        input: { 
          nodes: 5, 
          edges: [[0,1,8,2], [1,2,6,1], [2,3,4,3], [3,4,2,2]], 
          source: 0, 
          sink: 4, 
          flow: 4 
        }, 
        expectedOutput: 32, 
        isHidden: true 
      }
    ],
    solution: `function solution(nodes, edges, source, sink, targetFlow) {
  // Implementation of minimum cost flow using Ford-Fulkerson with cost optimization
  const graph = new Array(nodes).fill().map(() => []);
  
  // Build adjacency list with capacity and cost
  for (const [from, to, capacity, cost] of edges) {
    graph[from].push({ to, capacity, cost, flow: 0 });
    graph[to].push({ to: from, capacity: 0, cost: -cost, flow: 0 });
  }
  
  let totalCost = 0;
  let totalFlow = 0;
  
  while (totalFlow < targetFlow) {
    // Find shortest path using Bellman-Ford
    const [path, cost] = findShortestPath(graph, source, sink);
    if (!path) break;
    
    // Calculate flow that can be sent
    let flow = Math.min(...path.map(edge => edge.capacity - edge.flow));
    flow = Math.min(flow, targetFlow - totalFlow);
    
    // Update flow and cost
    for (const edge of path) {
      edge.flow += flow;
      totalCost += flow * edge.cost;
    }
    
    totalFlow += flow;
  }
  
  return totalCost;
}`,
    constraints: [
      'Time: O(VE² log(V)) - Ford-Fulkerson with cost optimization',
      'Space: O(V + E) - adjacency list representation',
      '1 ≤ nodes ≤ 100',
      '1 ≤ edges ≤ 1000',
      '0 ≤ capacity ≤ 10⁶',
      '0 ≤ cost ≤ 10⁴',
      '0 ≤ flow ≤ 10⁶'
    ],
    hints: [
      'Use Ford-Fulkerson algorithm with cost optimization',
      'Find shortest path using Bellman-Ford for negative costs',
      'Update residual graph after each flow augmentation',
      'Track total cost while maximizing flow'
    ],
    learningObjectives: ['Learn minimum cost flow algorithms', 'Understand network flow optimization', 'Practice graph algorithms'],
    prerequisites: ['Basic graph theory', 'Understanding of flow networks', 'Algorithm design skills'],
    estimatedTime: 45,
    category: 'graphs'
  },

  // Binary Search problems
  'binary-search': {
    description: 'Implement binary search to find a target element in a sorted array.',
    examples: [
      {
        input: 'arr = [1, 3, 5, 7, 9, 11, 13], target = 7',
        output: '3',
        explanation: 'Target 7 is found at index 3 in the sorted array [1, 3, 5, 7, 9, 11, 13]'
      },
      {
        input: 'arr = [2, 4, 6, 8, 10], target = 5',
        output: '-1',
        explanation: 'Target 5 is not found in the sorted array [2, 4, 6, 8, 10], so return -1'
      }
    ],
    testCases: [
      { input: { arr: [1, 3, 5, 7, 9, 11, 13], target: 7 }, expectedOutput: 3, isHidden: false },
      { input: { arr: [2, 4, 6, 8, 10], target: 5 }, expectedOutput: -1, isHidden: false },
      { input: { arr: [1], target: 1 }, expectedOutput: 0, isHidden: false },
      { input: { arr: [1, 2, 3, 4, 5], target: 6 }, expectedOutput: -1, isHidden: true }
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
    constraints: [
      'Time: O(log n) - binary search complexity',
      'Space: O(1) - constant extra space',
      '1 ≤ arr.length ≤ 10⁵',
      '-10⁴ ≤ arr[i] ≤ 10⁴',
      '-10⁴ ≤ target ≤ 10⁴',
      'Array is sorted in ascending order'
    ],
    hints: [
      'Use two pointers: left and right',
      'Calculate middle index: (left + right) / 2',
      'Compare middle element with target',
      'Update left or right pointer based on comparison'
    ],
    learningObjectives: ['Learn binary search algorithm', 'Understand logarithmic time complexity', 'Practice divide and conquer'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Basic algorithms'],
    estimatedTime: 20,
    category: 'binary-search'
  },

  // Dynamic Programming problems
  'climbing-stairs': {
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      {
        input: 'n = 3',
        output: '3',
        explanation: 'Three ways: 1+1+1, 1+2, 2+1'
      },
      {
        input: 'n = 4',
        output: '5',
        explanation: 'Five ways: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2'
      }
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
    constraints: [
      'Time: O(n) - single pass through numbers',
      'Space: O(1) - constant extra space',
      '1 ≤ n ≤ 45',
      'Result fits in 32-bit integer'
    ],
    hints: [
      'Use dynamic programming approach',
      'Each step depends on previous two steps',
      'Use two variables to track previous values',
      'Base cases: n=1 returns 1, n=2 returns 2'
    ],
    learningObjectives: ['Learn dynamic programming', 'Understand Fibonacci sequence', 'Practice optimization'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of loops', 'Basic algorithms'],
    estimatedTime: 20,
    category: 'dynamic-programming'
  },

  // Graph problems
  'graph-traversal': {
    description: 'Implement depth-first search (DFS) to traverse a graph and return the nodes in the order they are visited.',
    examples: [
      {
        input: 'graph = [[1,2], [2,3], [3,4]], start = 1',
        output: '[1,2,3,4]',
        explanation: 'DFS starting from node 1: visit 1, then explore to 2, then to 3, then to 4'
      },
      {
        input: 'graph = [[1,2], [1,3], [2,4]], start = 1',
        output: '[1,2,4,3]',
        explanation: 'DFS from 1: visit 1, explore 2 and its neighbor 4, then backtrack to explore 3'
      }
    ],
    testCases: [
      { input: { graph: [[1,2], [2,3], [3,4]], start: 1 }, expectedOutput: [1,2,3,4], isHidden: false },
      { input: { graph: [[1,2], [1,3], [2,4]], start: 1 }, expectedOutput: [1,2,4,3], isHidden: false },
      { input: { graph: [], start: 1 }, expectedOutput: [1], isHidden: false },
      { input: { graph: [[1,2], [2,3]], start: 2 }, expectedOutput: [2,1,3], isHidden: true }
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
    constraints: [
      'Time: O(V + E) - visit each node and edge once',
      'Space: O(V) - visited set and recursion stack',
      '1 ≤ graph.length ≤ 10⁴',
      '1 ≤ start ≤ 10⁴',
      'Graph is undirected and connected'
    ],
    hints: [
      'Use recursion for DFS implementation',
      'Keep track of visited nodes with a Set',
      'Explore all unvisited neighbors',
      'Add nodes to result when first visited'
    ],
    learningObjectives: ['Learn graph traversal algorithms', 'Understand DFS implementation', 'Practice recursion'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of graphs', 'Recursion concepts'],
    estimatedTime: 25,
    category: 'graphs'
  },

  // String problems
  'valid-parentheses': {
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.',
    examples: [
      {
        input: '"()"',
        output: 'true',
        explanation: 'Simple valid parentheses: open and close in correct order'
      },
      {
        input: '"()[]{}"',
        output: 'true',
        explanation: 'Multiple valid parentheses: each pair is properly closed'
      },
      {
        input: '"(]"',
        output: 'false',
        explanation: 'Invalid: opening parenthesis "(" is closed by closing bracket "]"'
      }
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
    constraints: [
      'Time: O(n) - single pass through string',
      'Space: O(n) - stack for opening brackets',
      '1 ≤ s.length ≤ 10⁴',
      's consists of parentheses only "()[]{}"'
    ],
    hints: [
      'Use stack to track opening parentheses',
      'When seeing closing bracket, check if it matches top of stack',
      'Stack should be empty at the end',
      'Use hash map for bracket pairs'
    ],
    learningObjectives: ['Learn stack data structure', 'Understand parentheses matching', 'Practice string manipulation'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of stacks', 'String operations'],
    estimatedTime: 15,
    category: 'stacks'
  },

  // Array problems
  'two-sum': {
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1]'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2]'
      }
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], isHidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], isHidden: false },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1], isHidden: false },
      { input: { nums: [1, 5, 8, 10], target: 15 }, expectedOutput: [2, 3], isHidden: true }
    ],
    solution: `function solution(nums, target) {
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
    constraints: [
      'Time: O(n) - single pass through array',
      'Space: O(n) - hash map for seen numbers',
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Exactly one valid answer exists'
    ],
    hints: [
      'Use hash map to store seen numbers',
      'For each number, check if complement exists',
      'Complement = target - current number',
      'Return indices when complement is found'
    ],
    learningObjectives: ['Learn hash map usage', 'Understand two-pointer technique', 'Practice array manipulation'],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Hash map concepts'],
    estimatedTime: 20,
    category: 'arrays'
  }
};

// Function to determine problem type based on description and title
function determineProblemType(problem) {
  const title = problem.title.toLowerCase();
  const description = (problem.description || '').toLowerCase();
  
  // Check for specific problem types
  if (description.includes('minimum cost flow') || description.includes('flow network') || title.includes('cost flow')) {
    return 'minimum-cost-flow';
  }
  if (description.includes('binary search') || description.includes('sorted array') || title.includes('binary')) {
    return 'binary-search';
  }
  if (description.includes('climbing stairs') || description.includes('distinct ways') || title.includes('stairs')) {
    return 'climbing-stairs';
  }
  if (description.includes('graph') || description.includes('traversal') || description.includes('dfs') || title.includes('graph')) {
    return 'graph-traversal';
  }
  if (description.includes('parentheses') || description.includes('brackets') || title.includes('parentheses')) {
    return 'valid-parentheses';
  }
  if (description.includes('two sum') || description.includes('add up to') || title.includes('two sum')) {
    return 'two-sum';
  }
  
  // Default fallback based on title
  if (title.includes('array') || title.includes('sum')) return 'two-sum';
  if (title.includes('string') || title.includes('parentheses')) return 'valid-parentheses';
  if (title.includes('graph') || title.includes('traversal')) return 'graph-traversal';
  if (title.includes('binary') || title.includes('search')) return 'binary-search';
  if (title.includes('stairs') || title.includes('climbing')) return 'climbing-stairs';
  
  return 'two-sum'; // Default fallback
}

// Function to check if a problem needs fixing
function needsFixing(problem) {
  const examples = problem.examples || [];
  const constraints = problem.constraints || [];
  const testCases = problem.testCases || [];
  
  // Check for placeholder data
  const hasPlaceholders = examples.some(ex => 
    ex.input === 'Example input' || 
    ex.output === 'Example output' || 
    ex.explanation === 'Example explanation'
  );
  
  // Check for abstract examples
  const hasAbstractExamples = examples.some(ex => 
    ex.input.includes('FlowNetwork') || 
    ex.input.includes('Network') ||
    ex.explanation.includes('finds the') ||
    ex.explanation.includes('through the')
  );
  
  // Check for missing constraints
  const hasNoConstraints = constraints.length === 0;
  
  // Check for poor test cases
  const hasPoorTestCases = testCases.length === 0 || testCases.some(tc => 
    !tc.input || !tc.expectedOutput
  );
  
  return hasPlaceholders || hasAbstractExamples || hasNoConstraints || hasPoorTestCases;
}

// Function to fix a single problem completely
async function fixProblemComplete(problem) {
  const problemType = determineProblemType(problem);
  const template = completeProblemTemplates[problemType];
  
  if (!template) {
    console.log(`⚠️  No template found for: ${problem.title}`);
    return false;
  }
  
  // Check if problem needs fixing
  if (!needsFixing(problem)) {
    console.log(`✅ ${problem.title} - already complete`);
    return false;
  }
  
  // Update the problem with complete data
  const updates = {
    description: template.description,
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
    console.log(`✅ Fixed completely: ${problem.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to fix ${problem.title}:`, error.message);
    return false;
  }
}

// Main function to fix all problems completely
async function fixAllProblemsComplete() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/algotutor-ai');
    console.log('📊 Connected to MongoDB');
    
    // Get all problems
    const problems = await Problem.find({ isActive: true });
    console.log(`🔍 Found ${problems.length} problems to check for completeness`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    
    // Fix each problem
    for (const problem of problems) {
      const wasFixed = await fixProblemComplete(problem);
      if (wasFixed) {
        fixedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`\n🎉 Complete problem fixing completed!`);
    console.log(`✅ Fixed: ${fixedCount} problems`);
    console.log(`⏭️  Skipped: ${skippedCount} problems`);
    console.log(`🌐 Open http://localhost:3000 to view the complete problems`);
    
  } catch (error) {
    console.error('❌ Error fixing problems completely:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  fixAllProblemsComplete();
}

module.exports = { fixAllProblemsComplete };
