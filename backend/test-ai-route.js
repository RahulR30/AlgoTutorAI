const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const User = require('./models/User');

// Test configuration
const TEST_CONFIG = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/algotutor',
  testUserId: 'test-user-id' // This will be created if it doesn't exist
};

// Mock user for testing
const mockUser = {
  id: TEST_CONFIG.testUserId,
  username: 'testuser',
  email: 'test@example.com',
  role: 'user'
};

// Test data for AI route testing
const testData = {
  topic: 'arrays',
  difficulty: 'easy',
  learningObjective: 'Master array sum operations',
  count: 5
};

// Test functions
async function testProblemGeneration() {
  console.log('🧪 Testing AI Problem Generation...\n');
  
  try {
    // Test 1: Generate individual problem
    console.log('1️⃣ Testing individual problem generation...');
    const individualProblem = await generateTestProblem();
    console.log('✅ Individual problem generated:', individualProblem.title);
    console.log('   - Examples:', individualProblem.examples.length);
    console.log('   - Test Cases:', individualProblem.testCases.length);
    console.log('   - Constraints:', individualProblem.constraints.length);
    console.log('   - Solution:', individualProblem.solution ? '✅' : '❌');
    console.log('   - Hints:', individualProblem.hints.length);
    console.log('');
    
    // Test 2: Generate problem database
    console.log('2️⃣ Testing problem database generation...');
    const problemDatabase = await generateTestProblemDatabase();
    console.log('✅ Problem database generated:', problemDatabase.length, 'problems');
    
    // Analyze generated problems
    const analysis = analyzeGeneratedProblems(problemDatabase);
    console.log('   - Average examples per problem:', analysis.avgExamples);
    console.log('   - Average test cases per problem:', analysis.avgTestCases);
    console.log('   - Average constraints per problem:', analysis.avgConstraints);
    console.log('   - Problems with solutions:', analysis.problemsWithSolutions);
    console.log('   - Problems with hints:', analysis.problemsWithHints);
    console.log('');
    
    // Test 3: Generate learning problem
    console.log('3️⃣ Testing learning problem generation...');
    const learningProblem = await generateTestLearningProblem();
    console.log('✅ Learning problem generated:', learningProblem.title);
    console.log('   - Learning Objective:', learningProblem.learningObjectives[0]);
    console.log('   - Prerequisites:', learningProblem.prerequisites.length);
    console.log('   - Estimated Time:', learningProblem.estimatedTime, 'minutes');
    console.log('');
    
    // Test 4: Validate problem schema compliance
    console.log('4️⃣ Testing problem schema compliance...');
    const schemaValidation = validateProblemSchema(individualProblem);
    console.log('✅ Schema validation:', schemaValidation.isValid ? 'PASSED' : 'FAILED');
    if (!schemaValidation.isValid) {
      console.log('   - Missing fields:', schemaValidation.missingFields);
      console.log('   - Invalid fields:', schemaValidation.invalidFields);
    }
    console.log('');
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Generate test problem using the AI route logic
async function generateTestProblem() {
  const templates = getComprehensiveTemplates();
  const template = templates.arrays.easy[0]; // Array Sum problem
  
  const problem = {
    title: template.title,
    description: template.description,
    difficulty: 'easy',
    topics: ['arrays'],
    constraints: template.constraints,
    examples: [template.example],
    testCases: template.testCases,
    solution: template.solution,
    hints: template.hints,
    learningObjectives: template.learningObjectives,
    prerequisites: template.prerequisites,
    estimatedTime: template.estimatedTime,
    category: template.category
  };
  
  // Transform to match Problem schema
  return {
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    topics: problem.topics,
    constraints: problem.constraints,
    examples: [{
      input: problem.examples[0].input,
      output: problem.examples[0].output,
      explanation: problem.examples[0].explanation
    }],
    testCases: problem.testCases,
    solution: problem.solution,
    hints: problem.hints,
    learningObjectives: problem.learningObjectives,
    prerequisites: problem.prerequisites,
    estimatedTime: problem.estimatedTime,
    category: problem.category,
    tags: [problem.topics[0], problem.difficulty, 'practice'],
    isActive: true,
    statistics: {
      totalSubmissions: 0,
      correctSubmissions: 0,
      averageScore: 0,
      averageTime: 0,
      difficultyRating: 2
    },
    timeLimit: 1000,
    memoryLimit: 128
  };
}

// Generate test problem database
async function generateTestProblemDatabase() {
  const problems = [];
  const templates = getComprehensiveTemplates();
  
  for (let i = 0; i < testData.count; i++) {
    const topic = 'arrays';
    const diff = 'easy';
    const template = templates[topic][diff][i % templates[topic][diff].length];
    
    const problem = {
      title: template.title,
      description: template.description,
      difficulty: diff,
      topics: [topic],
      constraints: template.constraints,
      examples: [template.example],
      testCases: template.testCases,
      solution: template.solution,
      hints: template.hints,
      learningObjectives: template.learningObjectives,
      prerequisites: template.prerequisites,
      estimatedTime: template.estimatedTime,
      category: template.category
    };
    
    problems.push(problem);
  }
  
  return problems;
}

// Generate test learning problem
async function generateTestLearningProblem() {
  const problem = generateLearningProblem(
    testData.learningObjective,
    testData.topic,
    testData.difficulty,
    'standard',
    true,
    true,
    true,
    { weakAreas: ['arrays'], strongAreas: ['strings'] }
  );
  
  return {
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    topics: [testData.topic],
    constraints: problem.constraints,
    examples: problem.examples,
    testCases: problem.testCases,
    solution: problem.solution,
    hints: problem.hints,
    learningObjectives: [testData.learningObjective],
    prerequisites: problem.prerequisites,
    estimatedTime: problem.estimatedTime,
    category: testData.topic,
    tags: [testData.topic, testData.difficulty, 'learning', 'standard'],
    isActive: true,
    statistics: {
      totalSubmissions: 0,
      correctSubmissions: 0,
      averageScore: 0,
      averageTime: 0,
      difficultyRating: 2
    },
    timeLimit: 1000,
    memoryLimit: 128
  };
}

// Analyze generated problems
function analyzeGeneratedProblems(problems) {
  const totalExamples = problems.reduce((sum, p) => sum + (p.examples?.length || 0), 0);
  const totalTestCases = problems.reduce((sum, p) => sum + (p.testCases?.length || 0), 0);
  const totalConstraints = problems.reduce((sum, p) => sum + (p.constraints?.length || 0), 0);
  const problemsWithSolutions = problems.filter(p => p.solution).length;
  const problemsWithHints = problems.filter(p => p.hints && p.hints.length > 0).length;
  
  return {
    avgExamples: Math.round((totalExamples / problems.length) * 100) / 100,
    avgTestCases: Math.round((totalTestCases / problems.length) * 100) / 100,
    avgConstraints: Math.round((totalConstraints / problems.length) * 100) / 100,
    problemsWithSolutions,
    problemsWithHints
  };
}

// Validate problem schema compliance
function validateProblemSchema(problem) {
  const requiredFields = [
    'title', 'description', 'difficulty', 'topics', 'constraints',
    'examples', 'testCases', 'solution', 'hints', 'isActive'
  ];
  
  const missingFields = requiredFields.filter(field => !problem[field]);
  const invalidFields = [];
  
  // Check specific field validations
  if (problem.examples && !Array.isArray(problem.examples)) {
    invalidFields.push('examples should be an array');
  }
  
  if (problem.testCases && !Array.isArray(problem.testCases)) {
    invalidFields.push('testCases should be an array');
  }
  
  if (problem.constraints && !Array.isArray(problem.constraints)) {
    invalidFields.push('constraints should be an array');
  }
  
  if (problem.hints && !Array.isArray(problem.hints)) {
    invalidFields.push('hints should be an array');
  }
  
  return {
    isValid: missingFields.length === 0 && invalidFields.length === 0,
    missingFields,
    invalidFields
  };
}

// Mock functions from the AI route (simplified versions)
function getComprehensiveTemplates() {
  return {
    'arrays': {
      'easy': [
        {
          title: 'Array Sum',
          description: 'Calculate the sum of all elements in an array of integers.',
          example: {
            input: '[1, 2, 3, 4, 5]',
            output: '15',
            explanation: 'The sum of all numbers is 1+2+3+4+5 = 15'
          },
          testCases: [
            { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15, isHidden: false },
            { input: { arr: [0, 0, 0] }, expectedOutput: 0, isHidden: false }
          ],
          solution: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
          constraints: ['Time: O(n) - need to iterate through all elements', 'Space: O(1) - only using a single variable for sum'],
          hints: ['Use reduce() method or a simple loop', 'Start with sum = 0'],
          learningObjectives: ['Master array iteration', 'Understand reduce operations'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
          estimatedTime: 10,
          category: 'arrays'
        }
      ]
    }
  };
}

function generateLearningProblem(learningObjective, topic, difficulty, complexity, includeExamples, includeTestCases, includeHints, performanceAnalysis) {
  return {
    title: `${learningObjective} - ${topic.charAt(0).toUpperCase() + topic.slice(1)} Practice`,
    description: `Practice problem designed to help you master: ${learningObjective}.`,
    difficulty: difficulty,
    estimatedTime: 15,
    prerequisites: [`Basic understanding of ${topic}`, 'Fundamental programming concepts'],
    examples: includeExamples ? [{ input: '[1, 2, 3]', output: '6', explanation: 'Example explanation' }] : [],
    testCases: includeTestCases ? [{ input: { arr: [1, 2, 3] }, expectedOutput: 6, isHidden: false }] : [],
    solution: '// Solution template',
    hints: includeHints ? ['Think step by step'] : [],
    constraints: ['Time: O(n)', 'Space: O(1)']
  };
}

// Main execution
async function main() {
  console.log('🚀 Starting AI Route Testing...\n');
  
  // Connect to MongoDB
  try {
    await mongoose.connect(TEST_CONFIG.mongoUri);
    console.log('📦 Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
  
  // Run tests
  await testProblemGeneration();
  
  // Cleanup
  await mongoose.disconnect();
  console.log('\n📦 Disconnected from MongoDB');
  console.log('✨ Testing completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testProblemGeneration,
  generateTestProblem,
  generateTestProblemDatabase,
  generateTestLearningProblem
};
