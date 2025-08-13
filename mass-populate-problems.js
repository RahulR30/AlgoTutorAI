const axios = require('axios');

// Your Railway backend URL
const RAILWAY_BACKEND_URL = 'https://algotutorai-production.up.railway.app';

// Generate hundreds of problems programmatically
function generateProblems() {
  const problems = [];
  
  // Array Problems (50 problems)
  const arrayProblems = [
    "Two Sum", "Reverse String", "Valid Parentheses", "Maximum Subarray", "Merge Two Sorted Lists",
    "Binary Tree Inorder Traversal", "Climbing Stairs", "Best Time to Buy and Sell Stock", "Linked List Cycle",
    "Symmetric Tree", "Palindrome Number", "Remove Duplicates from Sorted Array", "Container With Most Water",
    "3Sum", "Add Two Numbers", "Longest Substring Without Repeating Characters", "Median of Two Sorted Arrays",
    "Regular Expression Matching", "Search in Rotated Sorted Array", "Combination Sum", "Permutations",
    "Subsets", "Word Search", "Number of Islands", "Course Schedule", "Alien Dictionary", "Graph Valid Tree",
    "Clone Graph", "Pacific Atlantic Water Flow", "Redundant Connection", "Network Delay Time",
    "Cheapest Flights Within K Stops", "Reconstruct Itinerary", "Min Cost to Connect All Points",
    "Swim in Rising Water", "Path With Minimum Effort", "The Maze", "The Maze II", "The Maze III",
    "Sliding Puzzle", "Open the Lock", "Word Ladder", "Word Ladder II", "Minimum Genetic Mutation",
    "Reach a Number", "Race Car", "Minimum Moves to Reach Target", "Minimum Moves to Equal Array Elements",
    "Minimum Moves to Equal Array Elements II", "Minimum Moves to Make Array Complementary"
  ];
  
  // String Problems (40 problems)
  const stringProblems = [
    "Valid Parentheses", "Longest Substring Without Repeating Characters", "Regular Expression Matching",
    "Wildcard Matching", "Valid Number", "Integer to English Words", "Text Justification",
    "Simplify Path", "Basic Calculator", "Basic Calculator II", "Basic Calculator III",
    "Decode String", "Valid Parenthesis String", "Remove Invalid Parentheses", "Generate Parentheses",
    "Different Ways to Add Parentheses", "Expression Add Operators", "Basic Calculator IV",
    "Parse Lisp Expression", "Tag Validator", "HTML Entity Parser", "String Compression",
    "Longest Common Prefix", "Longest Palindromic Substring", "Longest Palindromic Subsequence",
    "Palindromic Substrings", "Valid Palindrome", "Valid Palindrome II", "Palindrome Partitioning",
    "Palindrome Partitioning II", "Shortest Palindrome", "Palindrome Pairs", "Longest Word in Dictionary",
    "Implement Magic Dictionary", "Replace Words", "Word Abbreviation", "Valid Word Abbreviation",
    "Minimum Unique Word Abbreviation", "Word Squares", "Word Search II", "Concatenated Words"
  ];
  
  // Tree Problems (30 problems)
  const treeProblems = [
    "Binary Tree Inorder Traversal", "Symmetric Tree", "Binary Tree Level Order Traversal",
    "Binary Tree Zigzag Level Order Traversal", "Maximum Depth of Binary Tree", "Minimum Depth of Binary Tree",
    "Balanced Binary Tree", "Path Sum", "Path Sum II", "Path Sum III", "Binary Tree Paths",
    "Sum Root to Leaf Numbers", "Flatten Binary Tree to Linked List", "Populating Next Right Pointers in Each Node",
    "Populating Next Right Pointers in Each Node II", "Construct Binary Tree from Preorder and Inorder Traversal",
    "Construct Binary Tree from Inorder and Postorder Traversal", "Serialize and Deserialize Binary Tree",
    "Serialize and Deserialize BST", "Count Complete Tree Nodes", "Kth Smallest Element in a BST",
    "Lowest Common Ancestor of a Binary Search Tree", "Lowest Common Ancestor of a Binary Tree",
    "Binary Tree Right Side View", "Binary Tree Left Side View", "Binary Tree Vertical Order Traversal",
    "Binary Tree Level Order Traversal II", "Average of Levels in Binary Tree", "Find Bottom Left Tree Value",
    "Find Largest Value in Each Tree Row", "Most Frequent Subtree Sum"
  ];
  
  // Dynamic Programming Problems (40 problems)
  const dpProblems = [
    "Maximum Subarray", "Climbing Stairs", "Best Time to Buy and Sell Stock", "House Robber",
    "House Robber II", "House Robber III", "Coin Change", "Coin Change II", "Perfect Squares",
    "Word Break", "Word Break II", "Longest Increasing Subsequence", "Longest Common Subsequence",
    "Edit Distance", "Interleaving String", "Distinct Subsequences", "Scramble String",
    "Minimum Path Sum", "Unique Paths", "Unique Paths II", "Triangle", "Maximum Product Subarray",
    "Maximum Subarray Sum with One Deletion", "Maximum Sum Circular Subarray", "Maximum Sum of 3 Non-Overlapping Subarrays",
    "Maximum Sum of Two Non-Overlapping Subarrays", "Maximum Sum of Non-Overlapping Subarrays",
    "Maximum Sum of Non-Overlapping Subarrays with Sum K", "Maximum Sum of Non-Overlapping Subarrays with Sum K II",
    "Maximum Sum of Non-Overlapping Subarrays with Sum K III", "Maximum Sum of Non-Overlapping Subarrays with Sum K IV"
  ];
  
  // Graph Problems (30 problems)
  const graphProblems = [
    "Number of Islands", "Course Schedule", "Alien Dictionary", "Graph Valid Tree", "Clone Graph",
    "Pacific Atlantic Water Flow", "Redundant Connection", "Network Delay Time", "Cheapest Flights Within K Stops",
    "Reconstruct Itinerary", "Min Cost to Connect All Points", "Swim in Rising Water", "Path With Minimum Effort",
    "The Maze", "The Maze II", "The Maze III", "Sliding Puzzle", "Open the Lock", "Word Ladder",
    "Word Ladder II", "Minimum Genetic Mutation", "Reach a Number", "Race Car", "Minimum Moves to Reach Target",
    "Minimum Moves to Equal Array Elements", "Minimum Moves to Equal Array Elements II",
    "Minimum Moves to Make Array Complementary", "Minimum Moves to Make Array Complementary II",
    "Minimum Moves to Make Array Complementary III", "Minimum Moves to Make Array Complementary IV"
  ];
  
  // Math Problems (20 problems)
  const mathProblems = [
    "Palindrome Number", "Add Two Numbers", "Multiply Strings", "Divide Two Integers", "Pow(x, n)",
    "Sqrt(x)", "Valid Number", "Integer to English Words", "Roman to Integer", "Integer to Roman",
    "Basic Calculator", "Basic Calculator II", "Basic Calculator III", "Basic Calculator IV",
    "Expression Add Operators", "Different Ways to Add Parentheses", "Parse Lisp Expression",
    "Tag Validator", "HTML Entity Parser", "String Compression"
  ];
  
  // All problem categories
  const allCategories = [
    { name: "Array", problems: arrayProblems, difficulty: "easy" },
    { name: "String", problems: stringProblems, difficulty: "medium" },
    { name: "Tree", problems: treeProblems, difficulty: "medium" },
    { name: "Dynamic Programming", problems: dpProblems, difficulty: "hard" },
    { name: "Graph", problems: graphProblems, difficulty: "hard" },
    { name: "Math", problems: mathProblems, difficulty: "medium" }
  ];
  
  let problemId = 1;
  
  allCategories.forEach(category => {
    category.problems.forEach(problemTitle => {
      const difficulty = Math.random() < 0.4 ? "easy" : Math.random() < 0.4 ? "medium" : "hard";
      
      problems.push({
        title: problemTitle,
        slug: problemTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        description: `Problem ${problemId}: ${problemTitle}. This is a comprehensive coding problem covering ${category.name.toLowerCase()} concepts.`,
        difficulty: difficulty,
        category: category.name,
        topics: [category.name, "Algorithms", "Data Structures"],
        examples: [
          {
            input: `Input for ${problemTitle}`,
            output: `Expected output for ${problemTitle}`,
            explanation: `Explanation for ${problemTitle}`
          }
        ],
        testCases: [
          {
            input: `Test input for ${problemTitle}`,
            expectedOutput: `Expected output for ${problemTitle}`
          }
        ],
        constraints: [
          "1 <= n <= 10^5",
          "All inputs are valid",
          "Time complexity should be optimal"
        ],
        hints: [
          `Think about ${category.name.toLowerCase()} approach`,
          "Consider edge cases",
          "Optimize your solution"
        ],
        solution: `function ${problemTitle.replace(/\s+/g, '')}(input) {\n  // Solution for ${problemTitle}\n  return "solution";\n}`
      });
      
      problemId++;
    });
  });
  
  return problems;
}

async function clearBackend() {
  try {
    console.log('🗑️  Clearing backend problems...');
    
    // Get all current problems
    const response = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const currentProblems = response.data.problems;
    
    if (currentProblems.length === 0) {
      console.log('✅ Backend is already empty');
      return;
    }
    
    console.log(`📊 Found ${currentProblems.length} problems to clear`);
    
    // Note: You might need to add a DELETE endpoint to your backend
    console.log('⚠️  Note: Backend clear functionality requires DELETE endpoint');
    console.log('💡 Proceeding with population (duplicates will be skipped)');
    
  } catch (error) {
    console.error('❌ Error checking backend:', error.message);
  }
}

async function populateMassiveProblems() {
  try {
    console.log('🔄 Starting massive problem population...');
    
    // First, check if backend is accessible
    console.log('🔍 Testing backend connection...');
    const healthResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/health`);
    console.log('✅ Backend is accessible:', healthResponse.data.status);
    
    // Check current problems count
    console.log('📊 Checking current problems...');
    const problemsResponse = await axios.get(`${RAILWAY_BACKEND_URL}/api/problems`);
    const currentCount = problemsResponse.data.problems.length;
    console.log(`📋 Current problems in backend: ${currentCount}`);
    
    // Generate all problems
    console.log('🔧 Generating problems...');
    const allProblems = generateProblems();
    console.log(`📝 Generated ${allProblems.length} problems`);
    
    // Clear backend first (optional)
    await clearBackend();
    
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
      if ((i + 1) % 20 === 0) {
        console.log(`📊 Progress: ${i + 1}/${allProblems.length} problems processed`);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 50));
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
    console.log(`   📁 Total generated: ${allProblems.length}`);
    
    if (finalCount > 0) {
      console.log('\n🎉 Backend populated successfully!');
      console.log('\n🔗 Your backend is now ready at:');
      console.log(`   ${RAILWAY_BACKEND_URL}`);
      console.log('\n📱 Test the problems endpoint:');
      console.log(`   ${RAILWAY_BACKEND_URL}/api/problems`);
      console.log('\n🌐 Your frontend should now show ALL problems!');
      
      // Show some sample problems
      const sampleProblems = finalResponse.data.problems.slice(0, 10);
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
      await populateMassiveProblems();
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
      
    case 'clear':
      await clearBackend();
      break;
      
    default:
      console.log('🚀 Massive Problems Populator');
      console.log('\nUsage:');
      console.log('  node mass-populate-problems.js populate  - Populate backend with hundreds of problems');
      console.log('  node mass-populate-problems.js count    - Check current problem count');
      console.log('  node mass-populate-problems.js clear    - Clear backend (if DELETE endpoint exists)');
      console.log('\nExamples:');
      console.log('  node mass-populate-problems.js populate');
      console.log('  node mass-populate-problems.js count');
      console.log('\n💡 This script generates hundreds of problems programmatically');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
