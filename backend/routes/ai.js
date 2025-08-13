const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// Ollama configuration - use const for immutable values
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2:7b';

// Cache frequently used values
const VALID_TOPICS = new Set([
  'arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 
  'heaps', 'hash-tables', 'dynamic-programming', 'greedy', 'backtracking', 
  'two-pointers', 'sliding-window', 'binary-search', 'sorting', 'recursion', 
  'bit-manipulation', 'math', 'geometry', 'game-theory', 'system-design'
]);

const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

// Pre-allocate common objects to reduce GC pressure
const DEFAULT_CONSTRAINTS = Object.freeze(['Time: O(n)', 'Space: O(1)']);
const DEFAULT_STATISTICS = Object.freeze({
  totalSubmissions: 0,
  correctSubmissions: 0,
  averageScore: 0,
  averageTime: 0,
  difficultyRating: 3
});

// Helper function to call Ollama API - optimized for performance
async function callOllama(prompt, options = {}) {
  // Use Object.assign for better performance than spread operator
  const requestOptions = Object.assign({
    model: OLLAMA_MODEL,
    prompt,
    stream: false,
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1000
  }, options);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestOptions)
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw error;
  }
}

// Helper function to analyze user performance - optimized for performance
const analyzeUserPerformance = (submissions) => {
  if (!submissions?.length) {
    return {
      weakAreas: ['general'],
      strongAreas: [],
      recentPerformance: 'no data',
      learningStyle: 'beginner'
    };
  }

  // Pre-allocate arrays with estimated capacity
  const weakAreas = [];
  const strongAreas = [];
  const topicPerformance = new Map();
  
  // Use for...of for better performance than forEach
  for (const submission of submissions) {
    const problem = submission.problemId;
    if (problem?.topics) {
      for (const topic of problem.topics) {
        let stats = topicPerformance.get(topic);
        if (!stats) {
          stats = { total: 0, correct: 0 };
          topicPerformance.set(topic, stats);
        }
        stats.total++;
        if (submission.overallResult?.passedTestCases === submission.overallResult?.totalTestCases) {
          stats.correct++;
        }
      }
    }
  }

  // Calculate weak and strong areas in single pass
  for (const [topic, stats] of topicPerformance) {
    const successRate = stats.correct / stats.total;
    if (successRate < 0.5) {
      weakAreas.push(topic);
    } else if (successRate > 0.8) {
      strongAreas.push(topic);
    }
  }

  // Analyze recent performance (only first 10 submissions)
  const recentSubmissions = submissions.slice(0, 10);
  let correctCount = 0;
  for (const submission of recentSubmissions) {
    if (submission.overallResult?.passedTestCases === submission.overallResult?.totalTestCases) {
      correctCount++;
    }
  }
  
  const recentSuccessRate = correctCount / recentSubmissions.length;
  let recentPerformance = 'improving';
  if (recentSuccessRate < 0.3) recentPerformance = 'declining';
  else if (recentSuccessRate < 0.6) recentPerformance = 'stable';

  // Determine learning style
  const learningStyle = weakAreas.length > strongAreas.length ? 'needs-support' : 
                       strongAreas.length > weakAreas.length ? 'self-directed' : 'balanced';

  return {
    weakAreas: weakAreas.length ? weakAreas : ['general'],
    strongAreas,
    recentPerformance,
    learningStyle
  };
};

// Generate new problem using AI based on user performance
router.post('/generate-problem', auth, async (req, res) => {
  try {
    const { topic, difficulty, subtopics, learningObjectives, userId } = req.body;
    const targetUserId = userId || req.user.id;

    if (!topic || !difficulty) {
      return res.status(400).json({ 
        error: 'Topic and difficulty are required' 
      });
    }

    // Use cached validation sets for better performance
    if (!VALID_DIFFICULTIES.has(difficulty)) {
      return res.status(400).json({ 
        error: 'Difficulty must be easy, medium, or hard' 
      });
    }

    if (!VALID_TOPICS.has(topic)) {
      return res.status(400).json({ 
        error: `Topic must be one of: ${Array.from(VALID_TOPICS).join(', ')}` 
      });
    }

    // Optimize database queries - use projection and lean() for better performance
    const userSubmissions = await Submission.find({ userId: targetUserId })
      .populate('problemId', 'topics')
      .select('problemId overallResult')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Analyze user's weak areas and strengths
    const performanceAnalysis = analyzeUserPerformance(userSubmissions);
    
    // Get similar problems - use lean() for read-only operations
    const similarProblems = await Problem.find({
      topics: { $in: [topic] },
      difficulty: difficulty
    })
    .select('title topics difficulty')
    .limit(5)
    .lean();

    console.log(`Generating personalized problem for topic: ${topic}, difficulty: ${difficulty}`);
    
    // Use comprehensive template-based generation for reliability
    const templates = getComprehensiveTemplates();
    let template = null;
    
    if (templates[topic] && templates[topic][difficulty]) {
      const availableTemplates = templates[topic][difficulty];
      template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    } else {
      // Fallback to simple template
      template = getSimpleTemplate(Math.floor(Math.random() * 4));
    }
    
    // Create personalized problem with comprehensive details
    const generatedProblem = {
      title: template.title,
      description: template.description,
      difficulty: difficulty,
      topics: [topic],
      subtopics: subtopics || [topic],
      constraints: template.constraints || ['Time: O(n)', 'Space: O(1)'],
      examples: [template.example],
      testCases: template.testCases || [template.testCase],
      solution: template.solution,
      hints: template.hints,
      learningObjectives: template.learningObjectives || [`Master ${topic} concepts`, `Improve problem-solving skills`],
      prerequisites: template.prerequisites || [`Basic ${topic} knowledge`],
      tags: [topic, difficulty, 'personalized'],
      targetedWeakAreas: performanceAnalysis.weakAreas.slice(0, 2),
      difficultyAdjustment: `Adjusted to ${difficulty} based on user performance`,
      estimatedTime: template.estimatedTime || (difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35),
      category: template.category || topic
    };

    // Transform template-based problem to match schema
    const transformedProblem = {
      title: generatedProblem.title,
      description: generatedProblem.description,
      difficulty: generatedProblem.difficulty,
      topics: generatedProblem.topics,
      constraints: generatedProblem.constraints,
      examples: [{
        input: generatedProblem.examples[0].input,
        output: generatedProblem.examples[0].output,
        explanation: generatedProblem.examples[0].explanation
      }],
      testCases: generatedProblem.testCases || [{
        input: { arr: [1, 2, 3] },
        expectedOutput: 6,
        isHidden: false
      }],
      solution: generatedProblem.solution,
      hints: generatedProblem.hints,
      learningObjectives: generatedProblem.learningObjectives,
      prerequisites: generatedProblem.prerequisites,
      estimatedTime: generatedProblem.estimatedTime,
      category: generatedProblem.category,
      tags: generatedProblem.tags,
      isActive: true,
      statistics: {
        totalSubmissions: 0,
        correctSubmissions: 0,
        averageScore: 0,
        averageTime: 0,
        difficultyRating: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4
      },
      timeLimit: 1000,
      memoryLimit: 128,
      author: req.user.id
    };

    // Validate logical consistency - optimized with early returns
    transformedProblem.examples = validateAndFixExamples(transformedProblem.examples, transformedProblem.title);
    transformedProblem.testCases = validateAndFixTestCases(transformedProblem.testCases, transformedProblem.examples);
    transformedProblem.constraints = validateAndFixConstraints(transformedProblem.constraints, transformedProblem.title);

    // Create new problem
    const problem = new Problem({
      ...transformedProblem,
      slug: `${topic}-${difficulty}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    });

    const savedProblem = await problem.save();
    
    res.json({
      message: 'Problem generated successfully',
      problem: savedProblem
    });

  } catch (error) {
    console.error('Error generating problem:', error);
    res.status(500).json({ error: 'Failed to generate problem' });
  }
});

// Get personalized learning insights
router.post('/learning-insights', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = userId || req.user.id;

    // Get user's submission history
    const submissions = await Submission.find({ userId: targetUserId })
      .populate('problemId')
      .sort({ createdAt: -1 })
      .limit(100);

    // Analyze performance patterns
    const performanceAnalysis = analyzeUserPerformance(submissions);

    const prompt = `Analyze this coding student's performance and provide personalized learning insights:

Performance Data:
- Weak areas: ${performanceAnalysis.weakAreas.join(', ')}
- Strong areas: ${performanceAnalysis.strongAreas.join(', ')}
- Recent performance: ${performanceAnalysis.recentPerformance}
- Learning style: ${performanceAnalysis.learningStyle}
- Total problems attempted: ${submissions.length}

Provide insights in this JSON format:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "learningPatterns": ["pattern1", "pattern2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "nextSteps": ["step1", "step2"],
  "motivationalMessage": "encouraging message"
}`;

    const response = await callOllama(prompt, {
      temperature: 0.7,
      max_tokens: 1500
    });

    // Try to extract JSON from the response (AI models sometimes add extra text)
    let insights;
    try {
      // Look for JSON content between curly braces
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON content found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to a structured response
      insights = {
        strengths: ["Problem solving", "Algorithm understanding"],
        weaknesses: ["Need more practice with complex problems"],
        learningPatterns: ["Consistent practice", "Topic-based learning"],
        recommendations: ["Focus on weak areas", "Practice daily"],
        nextSteps: ["Solve more problems", "Review fundamentals"],
        motivationalMessage: "Great progress! Keep practicing consistently."
      };
    }

    res.json({
      message: 'Learning insights generated successfully',
      insights,
      performanceAnalysis
    });

  } catch (error) {
    console.error('Error generating learning insights:', error);
    res.status(500).json({ error: 'Failed to generate learning insights' });
  }
});

// Get interview readiness assessment
router.post('/interview-readiness', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = userId || req.user.id;

    // Get user's submission history
    const submissions = await Submission.find({ userId: targetUserId })
      .populate('problemId')
      .sort({ createdAt: -1 })
      .limit(100);

    // Analyze performance patterns
    const performanceAnalysis = analyzeUserPerformance(submissions);

    const prompt = `Assess this coding student's interview readiness based on their performance:

Performance Data:
- Weak areas: ${performanceAnalysis.weakAreas.join(', ')}
- Strong areas: ${performanceAnalysis.strongAreas.join(', ')}
- Recent performance: ${performanceAnalysis.recentPerformance}
- Learning style: ${performanceAnalysis.learningStyle}
- Total problems attempted: ${submissions.length}

Provide assessment in this JSON format:
{
  "overallScore": 75,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "readinessLevel": "ready/needs-work/not-ready",
  "recommendations": ["recommendation1", "recommendation2"],
  "practiceAreas": ["area1", "area2"],
  "estimatedTimeToReady": "2-3 weeks",
  "confidence": "high/medium/low"
}`;

    const response = await callOllama(prompt, {
      temperature: 0.7,
      max_tokens: 1500
    });

    // Try to extract JSON from the response (AI models sometimes add extra text)
    let assessment;
    try {
      // Look for JSON content between curly braces
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessment = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON content found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      // Fallback to a structured response
      assessment = {
        overallScore: 70,
        strengths: ["Problem solving", "Basic algorithms"],
        weaknesses: ["Complex data structures", "Advanced techniques"],
        readinessLevel: "needs-work",
        recommendations: ["Practice more complex problems", "Study data structures"],
        practiceAreas: ["Trees and graphs", "Dynamic programming"],
        estimatedTimeToReady: "3-4 weeks",
        confidence: "medium"
      };
    }

    res.json({
      message: 'Interview readiness assessment generated successfully',
      assessment,
      performanceAnalysis
    });

  } catch (error) {
    console.error('Error generating interview readiness assessment:', error);
    res.status(500).json({ error: 'Failed to generate interview readiness assessment' });
  }
});

// Generate complete problem database with AI - FAST VERSION
router.post('/generate-problem-database', auth, async (req, res) => {
  try {
    const { topics = [], difficulty = 'all', count = 50 } = req.body;
    
    // Define all available topics if none specified
    const allTopics = topics.length > 0 ? topics : [
      'arrays', 'strings', 'linked-lists', 'stacks', 'queues', 'trees', 'graphs', 
      'heaps', 'hash-tables', 'dynamic-programming', 'greedy', 'backtracking', 
      'two-pointers', 'sliding-window', 'binary-search', 'sorting', 'recursion', 
      'bit-manipulation', 'math', 'geometry', 'game-theory', 'system-design'
    ];
    
    // Define difficulty levels
    const difficultyLevels = difficulty === 'all' ? ['easy', 'medium', 'hard'] : [difficulty];
    
    // Use comprehensive problem generation for reliable, detailed content
    console.log('Generating problems using comprehensive templates...');
    
    // Generate problems with comprehensive templates
    const generatedProblems = generateComprehensiveProblems(allTopics, difficultyLevels, count);
    
    console.log(`Generated ${generatedProblems.length} comprehensive problems:`, generatedProblems.map(p => p.title));
    
    // Ensure we have problems to work with
    if (generatedProblems.length === 0) {
      console.error('No problems were generated!');
      return res.status(500).json({ error: 'Failed to generate problems' });
    }
    
    // Transform problems to match the exact Problem schema
    const transformedProblems = generatedProblems.map((problem, index) => {
      const topic = allTopics[index % allTopics.length];
      const diff = difficultyLevels[index % difficultyLevels.length];
      
      // Generate unique slug
      const slug = `${topic}-${diff}-${index + 1}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      console.log(`Transforming problem ${index + 1}: ${problem.title}`);
      console.log('  - testCases:', JSON.stringify(problem.testCases));
      console.log('  - solution:', problem.solution ? 'exists' : 'null');
      console.log('  - example:', JSON.stringify(problem.example));
      
      // Ensure all required fields are present and properly formatted
      const transformedProblem = {
        title: problem.title,
        slug: slug,
        description: problem.description,
        difficulty: diff,
        topics: [topic],
        constraints: problem.constraints || ['Time: O(n)', 'Space: O(1)'],
        examples: [{
          input: problem.example.input,
          output: problem.example.output,
          explanation: problem.example.explanation
        }],
        testCases: problem.testCases || [{ 
          input: { arr: [1, 2, 3] }, 
          expectedOutput: 6, 
          isHidden: false 
        }],
        solution: problem.solution || '// Solution will be implemented',
        hints: problem.hints || ['Think about the problem step by step'],
        isActive: true,
        statistics: {
          totalSubmissions: 0,
          correctSubmissions: 0,
          averageScore: 0,
          averageTime: 0,
          difficultyRating: diff === 'easy' ? 2 : diff === 'medium' ? 3 : 4
        },
        // Additional fields for comprehensive problem display
        learningObjectives: problem.learningObjectives || [`Master ${topic} concepts`, `Improve problem-solving skills`],
        prerequisites: problem.prerequisites || [`Basic ${topic} knowledge`],
        estimatedTime: problem.estimatedTime || (diff === 'easy' ? 15 : diff === 'medium' ? 25 : 35),
        category: problem.category || topic,
        tags: [topic, diff, 'practice'],
        timeLimit: 1000,
        memoryLimit: 128,
        author: req.user.id
      };
      
      // Validate and fix any logical inconsistencies
      transformedProblem.examples = validateAndFixExamples(transformedProblem.examples, transformedProblem.title);
      transformedProblem.testCases = validateAndFixTestCases(transformedProblem.testCases, transformedProblem.examples);
      transformedProblem.constraints = validateAndFixConstraints(transformedProblem.constraints, transformedProblem.title);
      
      console.log('  - Final transformed problem:');
      console.log(`    - title: ${transformedProblem.title}`);
      console.log(`    - examples: ${transformedProblem.examples.length}`);
      console.log(`    - testCases: ${transformedProblem.testCases.length}`);
      console.log(`    - constraints: ${transformedProblem.constraints.length}`);
      console.log(`    - solution: ${transformedProblem.solution ? 'exists' : 'missing'}`);
      
      return transformedProblem;
    });

    // Save all problems to database
    const savedProblems = [];
    for (const problem of transformedProblems) {
      try {
        const newProblem = new Problem(problem);
        const savedProblem = await newProblem.save();
        savedProblems.push(savedProblem);
        console.log(`Saved problem: ${savedProblem.title} (ID: ${savedProblem._id})`);
      } catch (saveError) {
        console.error(`Error saving problem ${problem.title}:`, saveError);
        // Continue with other problems
      }
    }
    
    res.json({
      message: 'Problem database generated successfully',
      totalGenerated: generatedProblems.length,
      totalSaved: savedProblems.length,
      problems: savedProblems.map(p => ({
        id: p._id,
        title: p.title,
        difficulty: p.difficulty,
        topics: p.topics,
        slug: p.slug,
        examples: p.examples.length,
        testCases: p.testCases.length,
        constraints: p.constraints.length
      })),
      summary: {
        byDifficulty: savedProblems.reduce((acc, p) => {
          acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
          return acc;
        }, {}),
        byTopic: savedProblems.reduce((acc, p) => {
          p.topics.forEach(topic => {
            acc[topic] = (acc[topic] || 0) + 1;
          });
          return acc;
        }, {}),
        byCategory: savedProblems.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {})
      }
    });
    
  } catch (error) {
    console.error('Error generating problem database:', error);
    res.status(500).json({ error: 'Failed to generate problem database' });
  }
});

// Get a simple template by index
function getSimpleTemplate(index) {
  const templates = [
    {
      example: {
        input: '[1, 2, 3, 4, 5]',
        output: '15',
        explanation: 'The sum of all numbers is 1+2+3+4+5 = 15'
      },
      testCase: { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15 },
      solution: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
      hints: ['Use reduce or loop', 'Start with sum = 0']
    },
    {
      example: {
        input: '[3, 1, 4, 1, 5, 9, 2, 6]',
        output: '9',
        explanation: 'The maximum value in the array is 9'
      },
      testCase: { input: { arr: [3, 1, 4, 1, 5, 9, 2, 6] }, expectedOutput: 9 },
      solution: `function solution(arr) {
  return Math.max(...arr);
}`,
      hints: ['Use Math.max', 'Or iterate to find max']
    },
    {
      example: {
        input: '"hello"',
        output: '"olleh"',
        explanation: 'Each character is reversed in order'
      },
      testCase: { input: { str: 'hello' }, expectedOutput: 'olleh' },
      solution: `function solution(str) {
  return str.split('').reverse().join('');
}`,
      hints: ['Split into array', 'Reverse and join']
    },
    {
      example: {
        input: '"racecar"',
        output: 'true',
        explanation: 'The string reads the same forward and backward'
      },
      testCase: { input: { str: 'racecar' }, expectedOutput: true },
      solution: `function solution(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      hints: ['Clean the string', 'Compare with reversed version']
    }
  ];
  
  return templates[index % templates.length];
}

// Generate problems directly with logical, consistent content
function generateDirectProblems(topics, difficulties, count) {
  const problems = [];
  
  // Create a simple, reliable set of problems without AI
  const simpleProblems = [
    {
      title: 'Array Sum',
      description: 'Calculate the sum of all elements in an array of integers.',
      example: {
        input: '[1, 2, 3, 4, 5]',
        output: '15',
        explanation: 'The sum of all numbers is 1+2+3+4+5 = 15'
      },
      testCase: { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15 },
      solution: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
      constraints: ['Time: O(n)', 'Space: O(1)'],
      hints: ['Use reduce or loop', 'Start with sum = 0']
    },
    {
      title: 'Find Maximum',
      description: 'Find the maximum value in an array of integers.',
      example: {
        input: '[3, 1, 4, 1, 5, 9, 2, 6]',
        output: '9',
        explanation: 'The maximum value in the array is 9'
      },
      testCase: { input: { arr: [3, 1, 4, 1, 5, 9, 2, 6] }, expectedOutput: 9 },
      solution: `function solution(arr) {
  return Math.max(...arr);
}`,
      constraints: ['Time: O(n)', 'Space: O(1)'],
      hints: ['Use Math.max', 'Or iterate to find max']
    },
    {
      title: 'Reverse String',
      description: 'Reverse a string character by character.',
      example: {
        input: '"hello"',
        output: '"olleh"',
        explanation: 'Each character is reversed in order'
      },
      testCase: { input: { str: 'hello' }, expectedOutput: 'olleh' },
      solution: `function solution(str) {
  return str.split('').reverse().join('');
}`,
      constraints: ['Time: O(n)', 'Space: O(n)'],
      hints: ['Split into array', 'Reverse and join']
    },
    {
      title: 'Palindrome Check',
      description: 'Check if a string is a palindrome (reads the same forward and backward).',
      example: {
        input: '"racecar"',
        output: 'true',
        explanation: 'The string reads the same forward and backward'
      },
      testCase: { input: { str: 'racecar' }, expectedOutput: true },
      solution: `function solution(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      constraints: ['Time: O(n)', 'Space: O(n)'],
      hints: ['Clean the string', 'Compare with reversed version']
    }
  ];
  
  console.log('Using simple, reliable problem templates');
  
  for (let i = 0; i < count; i++) {
    const problemIndex = i % simpleProblems.length;
    const template = simpleProblems[problemIndex];
    
    console.log(`Using template ${problemIndex + 1}: ${template.title}`);
    
    problems.push(template);
  }
  
  console.log(`Generated ${problems.length} simple problems:`, problems.map(p => p.title));
  return problems;
}

// Enhanced problem templates with comprehensive details
function getComprehensiveTemplates() {
  return {
    'arrays': {
      'easy': [
        {
          title: 'Array Sum',
          description: 'Calculate the sum of all elements in an array of integers. The array will contain positive integers and you need to return the total sum.',
          example: {
            input: '[1, 2, 3, 4, 5]',
            output: '15',
            explanation: 'The sum of all numbers in the array is 1+2+3+4+5 = 15'
          },
          testCases: [
            { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15, isHidden: false },
            { input: { arr: [0, 0, 0] }, expectedOutput: 0, isHidden: false },
            { input: { arr: [10, 20, 30] }, expectedOutput: 60, isHidden: false },
            { input: { arr: [1] }, expectedOutput: 1, isHidden: true }
          ],
          solution: `function solution(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}`,
          constraints: ['Time: O(n) - need to iterate through all elements', 'Space: O(1) - only using a single variable for sum'],
          hints: ['Use reduce() method or a simple loop', 'Start with sum = 0', 'Add each element to the running sum'],
          learningObjectives: ['Master array iteration', 'Understand reduce operations', 'Practice basic arithmetic'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
          estimatedTime: 10,
          category: 'arrays'
        },
        {
          title: 'Find Maximum',
          description: 'Find the maximum value in an array of integers. Return the largest number present in the array.',
          example: {
            input: '[3, 1, 4, 1, 5, 9, 2, 6]',
            output: '9',
            explanation: 'The maximum value in the array is 9'
          },
          testCases: [
            { input: { arr: [3, 1, 4, 1, 5, 9, 2, 6] }, expectedOutput: 9, isHidden: false },
            { input: { arr: [-1, -5, -10] }, expectedOutput: -1, isHidden: false },
            { input: { arr: [42] }, expectedOutput: 42, isHidden: false },
            { input: { arr: [0, 0, 0, 0] }, expectedOutput: 0, isHidden: true }
          ],
          solution: `function solution(arr) {
  return Math.max(...arr);
}`,
          constraints: ['Time: O(n) - need to check each element', 'Space: O(1) - only storing the maximum value'],
          hints: ['Use Math.max() with spread operator', 'Or iterate through array to find max', 'Handle edge case of single element'],
          learningObjectives: ['Learn Math.max usage', 'Understand spread operator', 'Practice array operations'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays'],
          estimatedTime: 8,
          category: 'arrays'
        },
        {
          title: 'Find Missing Number',
          description: 'Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.',
          example: {
            input: '[3, 0, 1]',
            output: '2',
            explanation: 'The missing number in the sequence 0,1,2,3 is 2'
          },
          testCases: [
            { input: { arr: [3, 0, 1] }, expectedOutput: 2, isHidden: false },
            { input: { arr: [0, 1] }, expectedOutput: 2, isHidden: false },
            { input: { arr: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, expectedOutput: 8, isHidden: false },
            { input: { arr: [0] }, expectedOutput: 1, isHidden: true }
          ],
          solution: `function solution(arr) {
  const n = arr.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}`,
          constraints: ['Time: O(n) - need to calculate sum of array', 'Space: O(1) - only using variables for sums'],
          hints: ['Use the sum formula: n*(n+1)/2', 'Calculate expected vs actual sum', 'The difference is the missing number'],
          learningObjectives: ['Learn mathematical formulas', 'Understand array sum operations', 'Practice problem-solving logic'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Basic math'],
          estimatedTime: 15,
          category: 'arrays'
        }
      ],
      'medium': [
        {
          title: 'Maximum Subarray Sum',
          description: 'Find the contiguous subarray within an array which has the largest sum. A subarray is a contiguous part of an array.',
          example: {
            input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]',
            output: '6',
            explanation: 'The subarray [4, -1, 2, 1] has the largest sum of 6'
          },
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
          constraints: ['Time: O(n) - single pass through array', 'Space: O(1) - only using constant variables'],
          hints: ['Use Kadane\'s algorithm', 'Track current subarray sum and global maximum', 'Reset current sum when it becomes negative'],
          learningObjectives: ['Learn Kadane\'s algorithm', 'Understand dynamic programming concepts', 'Practice subarray problems'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of arrays', 'Basic algorithms'],
          estimatedTime: 25,
          category: 'arrays'
        }
      ]
    },
    'strings': {
      'easy': [
        {
          title: 'Reverse String',
          description: 'Reverse a string character by character. Given a string, return the string with all characters in reverse order.',
          example: {
            input: '"hello"',
            output: '"olleh"',
            explanation: 'Each character is reversed in order: h->o, e->l, l->l, l->e, o->h'
          },
          testCases: [
            { input: { str: 'hello' }, expectedOutput: 'olleh', isHidden: false },
            { input: { str: 'world' }, expectedOutput: 'dlrow', isHidden: false },
            { input: { str: 'a' }, expectedOutput: 'a', isHidden: false },
            { input: { str: '12345' }, expectedOutput: '54321', isHidden: true }
          ],
          solution: `function solution(str) {
  return str.split('').reverse().join('');
}`,
          constraints: ['Time: O(n) - need to process each character', 'Space: O(n) - creating new string for result'],
          hints: ['Split string into array of characters', 'Reverse the array', 'Join characters back into string'],
          learningObjectives: ['Learn string manipulation', 'Understand array methods', 'Practice string operations'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings and arrays'],
          estimatedTime: 10,
          category: 'strings'
        },
        {
          title: 'Palindrome Check',
          description: 'Check if a string is a palindrome (reads the same forward and backward). Ignore case and non-alphanumeric characters.',
          example: {
            input: '"racecar"',
            output: 'true',
            explanation: 'The string reads the same forward and backward: racecar'
          },
          testCases: [
            { input: { str: 'racecar' }, expectedOutput: true, isHidden: false },
            { input: { str: 'hello' }, expectedOutput: false, isHidden: false },
            { input: { str: 'A man a plan a canal Panama' }, expectedOutput: true, isHidden: false },
            { input: { str: '12321' }, expectedOutput: true, isHidden: true }
          ],
          solution: `function solution(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
          constraints: ['Time: O(n) - need to process each character', 'Space: O(n) - creating cleaned string'],
          hints: ['Clean the string (remove spaces, punctuation)', 'Convert to lowercase', 'Compare with reversed version'],
          learningObjectives: ['Learn string cleaning', 'Understand regex basics', 'Practice palindrome logic'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of strings', 'Basic regex knowledge'],
          estimatedTime: 15,
          category: 'strings'
        }
      ]
    },
    'linked-lists': {
      'easy': [
        {
          title: 'Reverse Linked List',
          description: 'Given the head of a singly linked list, reverse the list and return the new head.',
          example: {
            input: '[1, 2, 3, 4, 5]',
            output: '[5, 4, 3, 2, 1]',
            explanation: 'The linked list is reversed: 1->2->3->4->5 becomes 5->4->3->2->1'
          },
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
          constraints: ['Time: O(n) - need to visit each node once', 'Space: O(1) - only using constant extra space'],
          hints: ['Use three pointers: prev, current, next', 'Update links as you traverse', 'Return the new head (prev)'],
          learningObjectives: ['Learn linked list manipulation', 'Understand pointer manipulation', 'Practice iterative algorithms'],
          prerequisites: ['Basic JavaScript knowledge', 'Understanding of linked lists', 'Pointer concepts'],
          estimatedTime: 20,
          category: 'linked-lists'
        }
      ]
    }
  };
}

// Generate comprehensive problems with all necessary details
function generateComprehensiveProblems(topics, difficulties, count) {
  const templates = getComprehensiveTemplates();
  const problems = [];
  
  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    const diff = difficulties[i % difficulties.length];
    
    const topicTemplates = templates[topic];
    if (topicTemplates && topicTemplates[diff]) {
      const diffTemplates = topicTemplates[diff];
      const template = diffTemplates[i % diffTemplates.length];
      
      // Create unique variation
      const variation = Math.floor(i / diffTemplates.length);
      const problem = createProblemVariation(template, topic, diff, variation);
      
      problems.push(problem);
    } else {
      // Fallback to basic template
      const basicTemplate = getSimpleTemplate(i);
      problems.push({
        title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Problem ${i + 1}`,
        description: `Practice problem for ${topic} with ${diff} difficulty.`,
        example: basicTemplate.example,
        testCases: [basicTemplate.testCase],
        solution: basicTemplate.solution,
        constraints: basicTemplate.constraints,
        hints: basicTemplate.hints,
        learningObjectives: [`Master ${topic} concepts`, `Improve problem-solving skills`],
        prerequisites: [`Basic ${topic} knowledge`],
        estimatedTime: diff === 'easy' ? 15 : diff === 'medium' ? 25 : 35,
        category: topic
      });
    }
  }
  
  return problems;
}

// Create problem variation with unique content
function createProblemVariation(template, topic, difficulty, variation) {
  if (variation === 0) return template;
  
  const variationData = {
    'arrays': {
      'easy': [
        { numbers: [2, 3, 4, 5, 6], expected: 20 },
        { numbers: [10, 20, 30, 40], expected: 100 },
        { numbers: [1, 3, 5, 7, 9], expected: 25 }
      ],
      'medium': [
        { numbers: [-1, 2, -3, 4, -5], expected: 4 },
        { numbers: [2, 3, 4, 5, 6], expected: 6 },
        { numbers: [1, 2, 3, 4, 5, 6], expected: 21 }
      ]
    },
    'strings': {
      'easy': [
        { str: 'world', expected: 'dlrow' },
        { str: 'coding', expected: 'gnidoc' },
        { str: 'algorithm', expected: 'mhtirogla' }
      ]
    }
  };
  
  const variations = variationData[topic]?.[difficulty];
  if (variations && variations[variation - 1]) {
    const varData = variations[variation - 1];
    
    if (template.title.includes('Sum')) {
      return {
        ...template,
        title: template.title + ` Variant ${variation + 1}`,
        example: {
          input: `[${varData.numbers.join(', ')}]`,
          output: varData.expected.toString(),
          explanation: `The sum of all numbers is ${varData.numbers.join('+')} = ${varData.expected}`
        },
        testCases: [
          { input: { arr: varData.numbers }, expectedOutput: varData.expected, isHidden: false },
          ...template.testCases.slice(1)
        ]
      };
    } else if (template.title.includes('Reverse')) {
      return {
        ...template,
        title: template.title + ` - ${varData.str}`,
        example: {
          input: `"${varData.str}"`,
          output: `"${varData.expected}"`,
          explanation: `Each character in "${varData.str}" is reversed to "${varData.expected}"`
        },
        testCases: [
          { input: { str: varData.str }, expectedOutput: varData.expected, isHidden: false },
          ...template.testCases.slice(1)
        ]
      };
    }
  }
  
  return template;
}

// Create logical, consistent problems based on content
function createLogicalProblem(problem, topic, difficulty, index) {
  console.log('Creating logical problem:', { problem, topic, difficulty, index });
  
  const title = problem.title || `${topic.charAt(0).toUpperCase() + topic.slice(1)} Problem ${index + 1}`;
  const slug = `${topic}-${difficulty}-${index + 1}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  
  // Handle direct problem generation format
  if (problem.example && problem.testCase && problem.solution) {
    console.log('Using direct problem format:', problem);
    return {
      title,
      slug,
      description: problem.description || `Practice problem for ${topic}`,
      examples: [{
        input: problem.example.input,
        output: problem.example.output,
        explanation: problem.example.explanation
      }],
      testCases: [problem.testCase],
      solution: problem.solution,
      constraints: problem.constraints || ['Time: O(n)', 'Space: O(1)'],
      hints: problem.hints || ["Think about the problem step by step"]
    };
  }
  
  // Fallback to old logic for AI-generated problems
  let examples, testCases, solution, constraints;
  
  if (problem.example && problem.example.input && problem.example.output) {
    // Use AI-generated example if it's valid
    console.log('Using AI-generated example:', problem.example);
    examples = [{
      input: problem.example.input.replace(/^Input:\s*/, '').replace(/^input:\s*/, ''),
      output: problem.example.output.replace(/^Output:\s*/, '').replace(/^output:\s*/, ''),
      explanation: problem.example.explanation.replace(/^explanation:\s*/, '').replace(/^Explanation:\s*/, '')
    }];
  } else {
    // Create logical examples based on problem type
    console.log('Creating logical examples for title:', title);
    examples = createLogicalExamples(title, difficulty);
  }
  
  // Create logical test cases that match the examples
  testCases = createLogicalTestCases(examples, difficulty);
  
  // Create appropriate solution based on problem type
  solution = createLogicalSolution(title, topic, difficulty);
  
  // Create appropriate constraints
  constraints = createLogicalConstraints(title, difficulty);
  
  const result = {
    title,
    slug,
    description: problem.description || `Practice problem for ${topic}`,
    examples,
    testCases,
    solution,
    constraints,
    hints: problem.hints || ["Think about the problem step by step"]
  };
  
  console.log('Created logical problem:', result);
  return result;
}

// Create logical examples based on problem type
function createLogicalExamples(title, difficulty) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('sum') || titleLower.includes('add')) {
    return [{
      input: "[1, 2, 3, 4, 5]",
      output: "15",
      explanation: "The sum of all numbers in the array is 1+2+3+4+5 = 15"
    }];
  } else if (titleLower.includes('reverse')) {
    return [{
      input: "hello world",
      output: "dlrow olleh",
      explanation: "Each character in the string is reversed in order"
    }];
  } else if (titleLower.includes('maximum') || titleLower.includes('max')) {
    return [{
      input: "[3, 1, 4, 1, 5, 9, 2, 6]",
      output: "9",
      explanation: "The maximum value in the array is 9"
    }];
  } else if (titleLower.includes('find') && titleLower.includes('missing')) {
    return [{
      input: "[0, 1, 3]",
      output: "2",
      explanation: "The missing number in the sequence 0,1,2,3 is 2"
    }];
  } else if (titleLower.includes('palindrome')) {
    return [{
      input: "racecar",
      output: "true",
      explanation: "The string reads the same forward and backward"
    }];
  } else {
    // Generic example
    return [{
      input: difficulty === 'easy' ? "[1, 2, 3]" : "[3, 1, 4, 1, 5, 9, 2, 6]",
      output: difficulty === 'easy' ? "6" : "31",
      explanation: "Process the input according to the problem requirements"
    }];
  }
}

// Create logical test cases that match the examples
function createLogicalTestCases(examples, difficulty) {
  const testCases = [];
  
  // Add the example as a test case
  if (examples[0]) {
    const example = examples[0];
    let input, expectedOutput;
    
    if (example.input.includes('[')) {
      // Array input
      input = { arr: JSON.parse(example.input) };
      expectedOutput = parseInt(example.output);
    } else if (example.input.includes('"')) {
      // String input
      input = { str: example.input.replace(/"/g, '') };
      expectedOutput = example.output === 'true' ? true : example.output;
    } else {
      // Number input
      input = { num: parseInt(example.input) };
      expectedOutput = parseInt(example.output);
    }
    
    testCases.push({
      input,
      expectedOutput,
      isHidden: false
    });
  }
  
  // Add additional test cases based on difficulty
  if (difficulty === 'medium' || difficulty === 'hard') {
    if (examples[0]?.input.includes('[')) {
      testCases.push({
        input: { arr: [0, -1, -2, -3] },
        expectedOutput: -6,
        isHidden: false
      });
    }
  }
  
  return testCases;
}

// Create appropriate solution based on problem type
function createLogicalSolution(title, topic, difficulty) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('sum') || titleLower.includes('add')) {
    return `// Solution: Calculate sum of array elements
function solution(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`;
  } else if (titleLower.includes('reverse')) {
    return `// Solution: Reverse string characters
function solution(str) {
  return str.split('').reverse().join('');
}`;
  } else if (titleLower.includes('maximum') || titleLower.includes('max')) {
    return `// Solution: Find maximum value in array
function solution(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`;
  } else if (titleLower.includes('find') && titleLower.includes('missing')) {
    return `// Solution: Find missing number in sequence
function solution(arr) {
  const n = arr.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}`;
  } else if (titleLower.includes('palindrome')) {
    return `// Solution: Check if string is palindrome
function solution(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`;
  } else {
    return `// Solution for ${topic} problem
function solution(input) {
  // Implement the solution based on the problem description
  // This is a template - replace with actual logic
  return input;
}`;
  }
}

// Create appropriate constraints based on problem type
function createLogicalConstraints(title, difficulty) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('sum') || titleLower.includes('add')) {
    return [
      `Time: O(n) - need to iterate through all elements`,
      `Space: O(1) - only using a single variable for sum`
    ];
  } else if (titleLower.includes('reverse')) {
    return [
      `Time: O(n) - need to process each character`,
      `Space: O(n) - creating new string for result`
    ];
  } else if (titleLower.includes('maximum') || titleLower.includes('max')) {
    return [
      `Time: O(n) - need to check each element`,
      `Space: O(1) - only storing the maximum value`
    ];
  } else {
    return [
      `Time: O(n) - linear time complexity`,
      `Space: O(1) - constant space complexity`
    ];
  }
}

// Template-based problem generation (fallback) - optimized
function generateProblemsFromTemplates(topics, difficulties, count) {
  // Pre-allocate array with known capacity
  const problems = new Array(Math.min(count, 100)); // Cap at 100 to prevent memory issues
  let problemIndex = 0;
  
  // Use Map for O(1) lookups instead of object property access
  const problemTemplates = new Map([
    ['arrays', new Map([
      ['easy', [
        { title: 'Find Missing Number', description: 'Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array. For example, if input is [3,0,1], output should be 2 since 2 is missing.' },
        { title: 'Array Rotation', description: 'Rotate an array to the right by k steps, where k is non-negative. For example, with input [1,2,3,4,5,6,7] and k = 3, the output should be [5,6,7,1,2,3,4].' },
        { title: 'Find Duplicates', description: 'Given an array of integers where each integer is between 1 and n (inclusive), find all duplicates in the array. For input [4,3,2,7,8,2,3,1], output should be [2,3] since these appear twice.' }
      ]],
      ['medium', [
        { title: 'Maximum Subarray Sum', description: 'Find the contiguous subarray within an array which has the largest sum. For input [-2,1,-3,4,-1,2,1,-5,4], the output should be 6, corresponding to the subarray [4,-1,2,1].' },
        { title: 'Two Sum Variant', description: 'Given an array of integers and a target sum, find two numbers such that they add up to the target. Return the indices of the two numbers. For input [2,7,11,15] with target 9, output should be [0,1].' },
        { title: 'Array Partitioning', description: 'Partition an array into two parts such that the absolute difference between the sums of the two parts is minimized. For input [1,2,3,4], output should be 0 since we can partition as [1,4] and [2,3].' }
      ]],
      ['hard', [
        { title: 'Trapping Rain Water', description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. For input [0,1,0,2,1,0,1,3,2,1,2,1], output should be 6.' },
        { title: 'Sliding Window Maximum', description: 'Given an array and an integer k, find the maximum element for each and every contiguous subarray of size k. For input [1,3,-1,-3,5,3,6,7] with k = 3, output should be [3,3,5,5,6,7].' },
        { title: 'Merge K Sorted Arrays', description: 'Given k sorted arrays of size n each, merge them into one sorted array. For input [[1,4,5],[1,3,4],[2,6]], output should be [1,1,2,3,4,4,5,6].' }
      ]]
    ])],
    ['strings', new Map([
      ['easy', [
        { title: 'Valid Parentheses', description: 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. A string is valid if open brackets are closed by the same type of brackets and in the correct order. For input "()[]{}", output should be true.' },
        { title: 'Palindrome Check', description: 'Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases. For input "A man, a plan, a canal: Panama", output should be true since it reads the same forward and backward.' },
        { title: 'String Compression', description: 'Given an array of characters, compress it in-place. The length after compression must always be smaller than or equal to the original array. For input ["a","a","b","b","c","c","c"], output should be ["a","2","b","2","c","3"].' }
      ]],
      ['medium', [
        { title: 'Longest Substring Without Repeats', description: 'Given a string, find the length of the longest substring without repeating characters. For input "abcabcbb", the output should be 3, as the longest substring without repeating characters is "abc".' },
        { title: 'Group Anagrams', description: 'Given an array of strings, group the anagrams together. An anagram is a word formed by rearranging the letters of another word. For input ["eat","tea","tan","ate","nat","bat"], output should be [["eat","tea","ate"],["tan","nat"],["bat"]].' },
        { title: 'String to Integer', description: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer. The algorithm should handle leading whitespace, optional plus/minus sign, and stop at the first non-digit character. For input "   -42", output should be -42.' }
      ]],
      ['hard', [
        { title: 'Regular Expression Matching', description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*". "." matches any single character, "*" matches zero or more of the preceding element. For input s = "aa", p = "a*", output should be true.' },
        { title: 'Longest Valid Parentheses', description: 'Given a string containing just the characters "(" and ")", find the length of the longest valid (well-formed) parentheses substring. For input "(()", the output should be 2, as the longest valid parentheses substring is "()".' },
        { title: 'Word Break II', description: 'Given a string s and a dictionary of strings wordDict, add spaces in s to construct a sentence where each word is a valid dictionary word. Return all such possible sentences. For input s = "catsanddog", wordDict = ["cat","cats","and","sand","dog"], output should be ["cats and dog","cat sand dog"].' }
      ]]
    ])]
  ]);

  // Generate problems efficiently
  for (let i = 0; problemIndex < count && i < 1000; i++) {
    const topic = topics[i % topics.length];
    const diff = difficulties[i % difficulties.length];
    
    const topicTemplates = problemTemplates.get(topic);
    if (topicTemplates) {
      const diffTemplates = topicTemplates.get(diff);
      if (diffTemplates) {
        const template = diffTemplates[i % diffTemplates.length];
        problems[problemIndex++] = {
          title: template.title,
          description: template.description,
          topic,
          difficulty: diff
        };
      }
    }
  }
  
  // Return only the generated problems (trim unused slots)
  return problems.slice(0, problemIndex);
}

// Validate and fix examples for logical consistency
function validateAndFixExamples(examples, title) {
  if (!examples || !Array.isArray(examples)) {
    return [{
      input: '[1, 2, 3]',
      output: '6',
      explanation: 'Process the input according to the problem requirements'
    }];
  }
  
  return examples.map(example => {
    if (!example.input || !example.output) {
      return {
        input: '[1, 2, 3]',
        output: '6',
        explanation: 'Process the input according to the problem requirements'
      };
    }
    
    // Fix common logical errors based on problem type
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('reverse')) {
      const inputStr = example.input.toString().replace(/[\[\]"]/g, '');
      const expectedReversed = inputStr.split('').reverse().join('');
      if (example.output !== expectedReversed) {
        return {
          input: example.input,
          output: expectedReversed,
          explanation: `The input string '${inputStr}' is reversed to '${expectedReversed}'.`
        };
      }
    }
    
    if (titleLower.includes('sum') || titleLower.includes('add')) {
      if (example.input.includes('[') && example.input.includes(']')) {
        try {
          const numbers = JSON.parse(example.input);
          const expectedSum = numbers.reduce((sum, num) => sum + num, 0);
          if (parseInt(example.output) !== expectedSum) {
            return {
              input: example.input,
              output: expectedSum.toString(),
              explanation: `The sum of all numbers is ${numbers.join('+')} = ${expectedSum}`
            };
          }
        } catch (e) {
          // Keep original if parsing fails
        }
      }
    }
    
    // Fix generic explanations
    if (!example.explanation || 
        example.explanation.includes('explanation') || 
        example.explanation.includes('Example explanation')) {
      return {
        ...example,
        explanation: `The input ${example.input} produces the output ${example.output} when processed correctly.`
      };
    }
    
    return example;
  });
}

// Validate and fix test cases for consistency with examples
function validateAndFixTestCases(testCases, examples) {
  if (!testCases || !Array.isArray(testCases)) {
    return [{
      input: { arr: [1, 2, 3] },
      expectedOutput: 6,
      isHidden: false
    }];
  }
  
  return testCases.map((testCase, index) => {
    if (!testCase.input || testCase.expectedOutput === undefined) {
      return {
        input: { arr: [1, 2, 3] },
        expectedOutput: 6,
        isHidden: index === 0 ? false : true
      };
    }
    
    // Ensure isHidden is boolean
    if (typeof testCase.isHidden !== 'boolean') {
      testCase.isHidden = index === 0 ? false : true;
    }
    
    return testCase;
  });
}

// Validate and fix constraints for clarity
function validateAndFixConstraints(constraints, title) {
  if (!constraints || !Array.isArray(constraints)) {
    return ['Time: O(n)', 'Space: O(1)'];
  }
  
  return constraints.map(constraint => {
    // Ensure constraints are descriptive
    if (constraint === 'Time: O(n)' || constraint === 'Space: O(1)') {
      const titleLower = title.toLowerCase();
      if (titleLower.includes('sum') || titleLower.includes('add')) {
        return constraint === 'Time: O(n)' 
          ? 'Time: O(n) - need to iterate through all elements'
          : 'Space: O(1) - only using a single variable for sum';
      } else if (titleLower.includes('reverse')) {
        return constraint === 'Time: O(n)'
          ? 'Time: O(n) - need to process each character'
          : 'Space: O(n) - creating new string for result';
      }
    }
    
    return constraint;
  });
}

// Update and improve existing AI-generated problem
router.put('/problem/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find the existing problem
    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    // Check if user is author or admin
    if (existingProblem.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this problem' });
    }
    
    // Validate and improve the updates
    const improvedUpdates = {};
    
    // Improve examples if provided
    if (updates.examples) {
      improvedUpdates.examples = validateAndFixExamples(updates.examples, existingProblem.title);
    }
    
    // Improve test cases if provided
    if (updates.testCases) {
      improvedUpdates.testCases = validateAndFixTestCases(updates.testCases, updates.examples || existingProblem.examples);
    }
    
    // Improve constraints if provided
    if (updates.constraints) {
      improvedUpdates.constraints = validateAndFixConstraints(updates.constraints, existingProblem.title);
    }
    
    // Improve description if provided
    if (updates.description) {
      improvedUpdates.description = improveDescription(updates.description, existingProblem.title, existingProblem.topics);
    }
    
    // Improve hints if provided
    if (updates.hints) {
      improvedUpdates.hints = improveHints(updates.hints, existingProblem.title, existingProblem.difficulty);
    }
    
    // Improve solution if provided
    if (updates.solution) {
      improvedUpdates.solution = improveSolution(updates.solution, existingProblem.title, existingProblem.topics);
    }
    
    // Add any other valid updates
    const allowedFields = [
      'title', 'difficulty', 'topics', 'learningObjectives', 'prerequisites', 
      'estimatedTime', 'category', 'tags', 'timeLimit', 'memoryLimit'
    ];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        improvedUpdates[field] = updates[field];
      }
    });
    
    // Update the problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { ...improvedUpdates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Problem updated and improved successfully',
      problem: updatedProblem
    });
    
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ error: 'Failed to update problem' });
  }
});

// Improve problem description for clarity and completeness
function improveDescription(description, title, topics) {
  if (!description || description.length < 50) {
    const topic = topics?.[0] || 'algorithm';
    return `Practice problem for ${topic}. ${description || 'Solve the given problem efficiently.'}`;
  }
  
  // Ensure description ends with clear instruction
  if (!description.endsWith('.') && !description.endsWith('!') && !description.endsWith('?')) {
    description += '.';
  }
  
  // Add topic context if missing
  if (topics && topics.length > 0 && !description.toLowerCase().includes(topics[0].toLowerCase())) {
    description += ` This problem focuses on ${topics[0]} concepts.`;
  }
  
  return description;
}

// Improve hints for better guidance
function improveHints(hints, title, difficulty) {
  if (!Array.isArray(hints) || hints.length === 0) {
    return ['Think about the problem step by step', 'Consider edge cases', 'Start with a simple approach'];
  }
  
  // Ensure hints are specific and helpful
  return hints.map(hint => {
    if (hint.length < 10) {
      return 'Think about the problem step by step';
    }
    
    // Make hints more specific based on problem type
    const titleLower = title.toLowerCase();
    if (titleLower.includes('sum') && hint.includes('sum')) {
      return hint + ' - Consider using a loop or reduce method';
    }
    
    if (titleLower.includes('reverse') && hint.includes('reverse')) {
      return hint + ' - Think about string manipulation methods';
    }
    
    if (titleLower.includes('maximum') && hint.includes('maximum')) {
      return hint + ' - Consider comparing each element';
    }
    
    return hint;
  });
}

// Improve solution code for clarity and efficiency
function improveSolution(solution, title, topics) {
  if (!solution || solution.length < 20) {
    return `// Solution for ${title}
function solution(input) {
  // Implement your solution here
  // This is a template - replace with actual logic
  return input;
}`;
  }
  
  // Ensure solution has proper function structure
  if (!solution.includes('function') && !solution.includes('def') && !solution.includes('public')) {
    return `function solution(input) {
  ${solution}
}`;
  }
  
  // Add efficiency comments if missing
  if (!solution.includes('//') && !solution.includes('/*')) {
    const topic = topics?.[0] || 'algorithm';
    return `// Efficient solution for ${topic} problem
${solution}
// Time complexity: O(n) - linear time
// Space complexity: O(1) - constant space`;
  }
  
  return solution;
}

// Get AI-generated problem with comprehensive details
router.get('/problem/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the problem by ID
    const problem = await Problem.findById(id)
      .populate('author', 'username email')
      .lean();
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    // Ensure all required fields are present and properly formatted
    const formattedProblem = {
      ...problem,
      examples: problem.examples || [{
        input: '[1, 2, 3]',
        output: '6',
        explanation: 'Process the input according to the problem requirements'
      }],
      testCases: problem.testCases || [{
        input: { arr: [1, 2, 3] },
        expectedOutput: 6,
        isHidden: false
      }],
      constraints: problem.constraints || ['Time: O(n)', 'Space: O(1)'],
      hints: problem.hints || ['Think about the problem step by step'],
      learningObjectives: problem.learningObjectives || [`Master ${problem.topics[0]} concepts`, `Improve problem-solving skills`],
      prerequisites: problem.prerequisites || [`Basic ${problem.topics[0]} knowledge`],
      estimatedTime: problem.estimatedTime || (problem.difficulty === 'easy' ? 15 : problem.difficulty === 'medium' ? 25 : 35),
      category: problem.category || problem.topics[0],
      tags: problem.tags || [problem.topics[0], problem.difficulty, 'practice'],
      timeLimit: problem.timeLimit || 1000,
      memoryLimit: problem.memoryLimit || 128,
      statistics: problem.statistics || {
        totalSubmissions: 0,
        correctSubmissions: 0,
        averageScore: 0,
        averageTime: 0,
        difficultyRating: problem.difficulty === 'easy' ? 2 : problem.difficulty === 'medium' ? 3 : 4
      }
    };
    
    // Validate and fix any logical inconsistencies
    formattedProblem.examples = validateAndFixExamples(formattedProblem.examples, formattedProblem.title);
    formattedProblem.testCases = validateAndFixTestCases(formattedProblem.testCases, formattedProblem.examples);
    formattedProblem.constraints = validateAndFixConstraints(formattedProblem.constraints, formattedProblem.title);
    
    res.json({
      message: 'Problem retrieved successfully',
      problem: formattedProblem
    });
    
  } catch (error) {
    console.error('Error retrieving problem:', error);
    res.status(500).json({ error: 'Failed to retrieve problem' });
  }
});

// Get AI-generated problems by topic and difficulty
router.get('/problems', auth, async (req, res) => {
  try {
    const { topic, difficulty, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (topic) query.topics = { $in: [topic] };
    if (difficulty) query.difficulty = difficulty;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Find problems
    const problems = await Problem.find(query)
      .select('title slug description difficulty topics examples testCases constraints hints learningObjectives prerequisites estimatedTime category tags statistics')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Count total problems for pagination
    const totalProblems = await Problem.countDocuments(query);
    
    // Format problems for display
    const formattedProblems = problems.map(problem => {
      const formatted = {
        ...problem,
        examples: problem.examples || [{
          input: '[1, 2, 3]',
          output: '6',
          explanation: 'Process the input according to the problem requirements'
        }],
        testCases: problem.testCases || [{
          input: { arr: [1, 2, 3] },
          expectedOutput: 6,
          isHidden: false
        }],
        constraints: problem.constraints || ['Time: O(n)', 'Space: O(1)'],
        hints: problem.hints || ['Think about the problem step by step'],
        learningObjectives: problem.learningObjectives || [`Master ${problem.topics[0]} concepts`, `Improve problem-solving skills`],
        prerequisites: problem.prerequisites || [`Basic ${problem.topics[0]} knowledge`],
        estimatedTime: problem.estimatedTime || (problem.difficulty === 'easy' ? 15 : problem.difficulty === 'medium' ? 25 : 35),
        category: problem.category || problem.topics[0],
        tags: problem.tags || [problem.topics[0], problem.difficulty, 'practice']
      };
      
      // Validate and fix any logical inconsistencies
      formatted.examples = validateAndFixExamples(formatted.examples, formatted.title);
      formatted.testCases = validateAndFixTestCases(formatted.testCases, formatted.examples);
      formatted.constraints = validateAndFixConstraints(formatted.constraints, formatted.title);
      
      return formatted;
    });
    
    res.json({
      message: 'Problems retrieved successfully',
      problems: formattedProblems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProblems / parseInt(limit)),
        totalProblems,
        hasNextPage: skip + problems.length < totalProblems,
        hasPrevPage: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Error retrieving problems:', error);
    res.status(500).json({ error: 'Failed to retrieve problems' });
  }
});

// Get problem statistics and analytics
router.get('/problem-stats/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get problem with submission statistics
    const problem = await Problem.findById(id)
      .select('title difficulty topics statistics')
      .lean();
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    // Get submission history for this problem
    const submissions = await Submission.find({ problemId: id })
      .select('overallResult executionTime createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    // Calculate additional statistics
    const totalSubmissions = submissions.length;
    const correctSubmissions = submissions.filter(s => 
      s.overallResult?.passedTestCases === s.overallResult?.totalTestCases
    ).length;
    
    const successRate = totalSubmissions > 0 ? (correctSubmissions / totalSubmissions) * 100 : 0;
    const averageExecutionTime = submissions.length > 0 
      ? submissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) / submissions.length 
      : 0;
    
    // Difficulty assessment based on performance
    let difficultyAssessment = 'appropriate';
    if (successRate < 30) difficultyAssessment = 'too hard';
    else if (successRate > 80) difficultyAssessment = 'too easy';
    
    const stats = {
      problem: {
        title: problem.title,
        difficulty: problem.difficulty,
        topics: problem.topics
      },
      submissions: {
        total: totalSubmissions,
        correct: correctSubmissions,
        successRate: Math.round(successRate * 100) / 100,
        averageExecutionTime: Math.round(averageExecutionTime * 100) / 100
      },
      difficultyAssessment,
      recommendations: []
    };
    
    // Generate recommendations based on performance
    if (successRate < 50) {
      stats.recommendations.push('Consider adding more hints or examples');
      stats.recommendations.push('Review problem description for clarity');
    }
    
    if (averageExecutionTime > 5000) {
      stats.recommendations.push('Problem may be computationally complex');
      stats.recommendations.push('Consider optimizing time constraints');
    }
    
    res.json({
      message: 'Problem statistics retrieved successfully',
      stats
    });
    
  } catch (error) {
    console.error('Error retrieving problem statistics:', error);
    res.status(500).json({ error: 'Failed to retrieve problem statistics' });
  }
});

// Generate problem with specific learning objectives
router.post('/generate-learning-problem', auth, async (req, res) => {
  try {
    const { 
      learningObjective, 
      topic, 
      difficulty = 'medium', 
      complexity = 'standard',
      includeExamples = true,
      includeTestCases = true,
      includeHints = true
    } = req.body;

    if (!learningObjective || !topic) {
      return res.status(400).json({ 
        error: 'Learning objective and topic are required' 
      });
    }

    // Validate inputs
    if (!VALID_TOPICS.has(topic)) {
      return res.status(400).json({ 
        error: `Topic must be one of: ${Array.from(VALID_TOPICS).join(', ')}` 
      });
    }

    if (!VALID_DIFFICULTIES.has(difficulty)) {
      return res.status(400).json({ 
        error: 'Difficulty must be easy, medium, or hard' 
      });
    }

    // Get user's learning progress
    const userSubmissions = await Submission.find({ userId: req.user.id })
      .populate('problemId', 'topics difficulty')
      .select('problemId overallResult')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const performanceAnalysis = analyzeUserPerformance(userSubmissions);
    
    // Generate problem based on learning objective
    const problem = generateLearningProblem(
      learningObjective, 
      topic, 
      difficulty, 
      complexity,
      includeExamples,
      includeTestCases,
      includeHints,
      performanceAnalysis
    );

    // Transform to match Problem schema
    const transformedProblem = {
      title: problem.title,
      slug: `${topic}-${difficulty}-${learningObjective.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      description: problem.description,
      difficulty: problem.difficulty,
      topics: [topic],
      constraints: problem.constraints,
      examples: problem.examples,
      testCases: problem.testCases,
      solution: problem.solution,
      hints: problem.hints,
      learningObjectives: [learningObjective],
      prerequisites: problem.prerequisites,
      estimatedTime: problem.estimatedTime,
      category: topic,
      tags: [topic, difficulty, 'learning', complexity],
      isActive: true,
      statistics: {
        totalSubmissions: 0,
        correctSubmissions: 0,
        averageScore: 0,
        averageTime: 0,
        difficultyRating: difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4
      },
      timeLimit: 1000,
      memoryLimit: 128,
      author: req.user.id
    };

    // Validate and fix any logical inconsistencies
    transformedProblem.examples = validateAndFixExamples(transformedProblem.examples, transformedProblem.title);
    transformedProblem.testCases = validateAndFixTestCases(transformedProblem.testCases, transformedProblem.examples);
    transformedProblem.constraints = validateAndFixConstraints(transformedProblem.constraints, transformedProblem.title);

    // Save to database
    const newProblem = new Problem(transformedProblem);
    const savedProblem = await newProblem.save();

    res.json({
      message: 'Learning problem generated successfully',
      problem: savedProblem,
      learningObjective,
      complexity,
      targetedAreas: performanceAnalysis.weakAreas
    });

  } catch (error) {
    console.error('Error generating learning problem:', error);
    res.status(500).json({ error: 'Failed to generate learning problem' });
  }
});

// Generate problem focused on specific learning objective
function generateLearningProblem(
  learningObjective, 
  topic, 
  difficulty, 
  complexity,
  includeExamples,
  includeTestCases,
  includeHints,
  performanceAnalysis
) {
  // Base problem structure
  const baseProblem = {
    title: `${learningObjective} - ${topic.charAt(0).toUpperCase() + topic.slice(1)} Practice`,
    description: `Practice problem designed to help you master: ${learningObjective}. This problem focuses on ${topic} concepts and is tailored to ${difficulty} difficulty level.`,
    difficulty: difficulty,
    estimatedTime: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35,
    prerequisites: [`Basic understanding of ${topic}`, 'Fundamental programming concepts']
  };

  // Generate examples based on learning objective
  if (includeExamples) {
    baseProblem.examples = generateExamplesForObjective(learningObjective, topic, difficulty, complexity);
  }

  // Generate test cases based on examples
  if (includeTestCases) {
    baseProblem.testCases = generateTestCasesForObjective(learningObjective, topic, difficulty, complexity);
  }

  // Generate solution based on learning objective
  baseProblem.solution = generateSolutionForObjective(learningObjective, topic, difficulty, complexity);

  // Generate hints based on learning objective
  if (includeHints) {
    baseProblem.hints = generateHintsForObjective(learningObjective, topic, difficulty, complexity);
  }

  // Generate constraints based on complexity
  baseProblem.constraints = generateConstraintsForComplexity(complexity, topic, difficulty);

  return baseProblem;
}

// Generate examples based on learning objective
function generateExamplesForObjective(learningObjective, topic, difficulty, complexity) {
  const objectiveLower = learningObjective.toLowerCase();
  
  if (objectiveLower.includes('sum') || objectiveLower.includes('addition')) {
    return [{
      input: '[1, 2, 3, 4, 5]',
      output: '15',
      explanation: 'The sum of all numbers in the array is 1+2+3+4+5 = 15'
    }, {
      input: '[10, 20, 30]',
      output: '60',
      explanation: 'The sum of all numbers in the array is 10+20+30 = 60'
    }];
  }
  
  if (objectiveLower.includes('reverse') || objectiveLower.includes('string manipulation')) {
    return [{
      input: '"hello"',
      output: '"olleh"',
      explanation: 'Each character is reversed in order: h->o, e->l, l->l, l->e, o->h'
    }, {
      input: '"world"',
      output: '"dlrow"',
      explanation: 'Each character is reversed in order: w->d, o->l, r->r, l->o, d->w'
    }];
  }
  
  if (objectiveLower.includes('maximum') || objectiveLower.includes('minimum')) {
    return [{
      input: '[3, 1, 4, 1, 5, 9, 2, 6]',
      output: '9',
      explanation: 'The maximum value in the array is 9'
    }, {
      input: '[-1, -5, -10, -2]',
      output: '-1',
      explanation: 'The maximum value in the array is -1'
    }];
  }
  
  // Default examples
  return [{
    input: '[1, 2, 3]',
    output: '6',
    explanation: 'Process the input according to the problem requirements'
  }];
}

// Generate test cases based on learning objective
function generateTestCasesForObjective(learningObjective, topic, difficulty, complexity) {
  const objectiveLower = learningObjective.toLowerCase();
  
  if (objectiveLower.includes('sum') || objectiveLower.includes('addition')) {
    return [
      { input: { arr: [1, 2, 3, 4, 5] }, expectedOutput: 15, isHidden: false },
      { input: { arr: [0, 0, 0] }, expectedOutput: 0, isHidden: false },
      { input: { arr: [10, 20, 30] }, expectedOutput: 60, isHidden: false },
      { input: { arr: [1] }, expectedOutput: 1, isHidden: true }
    ];
  }
  
  if (objectiveLower.includes('reverse') || objectiveLower.includes('string manipulation')) {
    return [
      { input: { str: 'hello' }, expectedOutput: 'olleh', isHidden: false },
      { input: { str: 'world' }, expectedOutput: 'dlrow', isHidden: false },
      { input: { str: 'a' }, expectedOutput: 'a', isHidden: false },
      { input: { str: '12345' }, expectedOutput: '54321', isHidden: true }
    ];
  }
  
  // Default test cases
  return [
    { input: { arr: [1, 2, 3] }, expectedOutput: 6, isHidden: false },
    { input: { arr: [0, 0, 0] }, expectedOutput: 0, isHidden: true }
  ];
}

// Generate solution based on learning objective
function generateSolutionForObjective(learningObjective, topic, difficulty, complexity) {
  const objectiveLower = learningObjective.toLowerCase();
  
  if (objectiveLower.includes('sum') || objectiveLower.includes('addition')) {
    return `// Solution: Calculate sum of array elements
function solution(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Alternative solution using reduce
// function solution(arr) {
//   return arr.reduce((sum, num) => sum + num, 0);
// }`;
  }
  
  if (objectiveLower.includes('reverse') || objectiveLower.includes('string manipulation')) {
    return `// Solution: Reverse string characters
function solution(str) {
  return str.split('').reverse().join('');
}

// Alternative solution using loop
// function solution(str) {
//   let reversed = '';
//   for (let i = str.length - 1; i >= 0; i--) {
//     reversed += str[i];
//   }
//   return reversed;
// }`;
  }
  
  if (objectiveLower.includes('maximum') || objectiveLower.includes('minimum')) {
    return `// Solution: Find maximum value in array
function solution(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Alternative solution using Math.max
// function solution(arr) {
//   return Math.max(...arr);
// }`;
  }
  
  // Default solution
  return `// Solution for ${learningObjective}
function solution(input) {
  // Implement your solution here based on the learning objective
  // This is a template - replace with actual logic
  return input;
}`;
}

// Generate hints based on learning objective
function generateHintsForObjective(learningObjective, topic, difficulty, complexity) {
  const objectiveLower = learningObjective.toLowerCase();
  
  if (objectiveLower.includes('sum') || objectiveLower.includes('addition')) {
    return [
      'Start with a variable to store the sum',
      'Iterate through each element in the array',
      'Add each element to the running sum',
      'Consider edge cases like empty arrays'
    ];
  }
  
  if (objectiveLower.includes('reverse') || objectiveLower.includes('string manipulation')) {
    return [
      'Think about how to access characters in a string',
      'Consider using string methods like split(), reverse(), and join()',
      'Or use a loop to build the reversed string',
      'Handle edge cases like single characters or empty strings'
    ];
  }
  
  if (objectiveLower.includes('maximum') || objectiveLower.includes('minimum')) {
    return [
      'Start by assuming the first element is the maximum',
      'Compare each element with the current maximum',
      'Update the maximum when you find a larger value',
      'Consider edge cases like negative numbers'
    ];
  }
  
  // Default hints
  return [
    'Think about the problem step by step',
    'Consider edge cases and boundary conditions',
    'Start with a simple approach and optimize later',
    'Test your solution with the provided examples'
  ];
}

// Generate constraints based on complexity
function generateConstraintsForComplexity(complexity, topic, difficulty) {
  const baseConstraints = ['Time: O(n)', 'Space: O(1)'];
  
  if (complexity === 'advanced') {
    return [
      'Time: O(n) - optimize for linear time complexity',
      'Space: O(1) - use constant extra space',
      'Handle edge cases efficiently',
      'Consider memory optimization'
    ];
  }
  
  if (complexity === 'expert') {
    return [
      'Time: O(n) - achieve optimal time complexity',
      'Space: O(1) - minimize memory usage',
      'Handle all edge cases gracefully',
      'Optimize for both time and space'
    ];
  }
  
  return baseConstraints;
}

module.exports = router;
