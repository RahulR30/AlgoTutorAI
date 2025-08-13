const express = require('express');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const auth = require('../middleware/auth');
const codeExecutor = require('../services/codeExecutor');

const router = express.Router();

// Create a new problem (for development/testing)
router.post('/', async (req, res) => {
  try {
    const problemData = req.body;
    
    console.log('📝 Creating problem with data:', JSON.stringify(problemData, null, 2));
    
    // Check if problem with same title already exists
    const existingProblem = await Problem.findOne({ title: problemData.title });
    if (existingProblem) {
      return res.status(409).json({ error: 'Problem with this title already exists' });
    }
    
    // Create new problem
    const problem = new Problem(problemData);
    console.log('🔍 Problem model created, attempting to save...');
    
    await problem.save();
    console.log('✅ Problem saved successfully');
    
    res.status(201).json({ 
      message: 'Problem created successfully',
      problem: {
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        category: problem.category
      }
    });
  } catch (error) {
    console.error('❌ Error creating problem:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Send more detailed error information
    res.status(500).json({ 
      error: 'Failed to create problem',
      details: error.message,
      field: error.errors ? Object.keys(error.errors)[0] : 'unknown'
    });
  }
});

// Get all problems with filtering, pagination, and search
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      difficulty, 
      topics, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    if (difficulty) query.difficulty = difficulty;
    if (topics) query.topics = { $in: topics.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const problems = await Problem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-solution -testCases.isHidden');

    const totalProblems = await Problem.countDocuments(query);
    const totalPages = Math.ceil(totalProblems / parseInt(limit));

    res.json({
      problems,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProblems,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Remove solution and hidden test cases for public access
    const publicProblem = problem.toObject();
    delete publicProblem.solution;
    
    // Filter out hidden test case expected outputs
    publicProblem.testCases = publicProblem.testCases.map(tc => ({
      ...tc,
      expectedOutput: tc.isHidden ? undefined : tc.expectedOutput
    }));

    res.json({ problem: publicProblem });
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

// Get problem solution (requires authentication and previous submission)
router.get('/:id/solution', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user has submitted a solution
    const submission = await Submission.findOne({ userId, problemId: id });
    if (!submission) {
      return res.status(403).json({ 
        error: 'You must submit a solution before viewing the solution' 
      });
    }

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json({ 
      solution: problem.solution,
      testCases: problem.testCases,
      hints: problem.hints,
      learningObjectives: problem.learningObjectives
    });
  } catch (error) {
    console.error('Error fetching solution:', error);
    res.status(500).json({ error: 'Failed to fetch solution' });
  }
});

// Get topics list with problem counts
router.get('/topics/list', async (req, res) => {
  try {
    const topics = await Problem.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$topics' },
      {
        $group: {
          _id: '$topics',
          total: { $sum: 1 },
          counts: {
            $push: {
              $cond: [
                { $eq: ['$difficulty', '$$CURRENT.difficulty'] },
                '$difficulty',
                null
              ]
            }
          }
        }
      },
      {
        $project: {
          name: '$_id',
          displayName: { $toUpper: { $substr: ['$_id', 0, 1] } },
          total: 1,
          counts: {
            easy: { $size: { $filter: { input: '$counts', cond: { $eq: ['$$this', 'easy'] } } } },
            medium: { $size: { $filter: { input: '$counts', cond: { $eq: ['$$this', 'medium'] } } } },
            hard: { $size: { $filter: { input: '$counts', cond: { $eq: ['$$this', 'hard'] } } } }
          }
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get problems by difficulty
router.get('/difficulty/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { isActive: true, difficulty: level };
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const result = await inMemoryDB.findProblems(query, options);
    res.json(result);
  } catch (error) {
    console.error('Error fetching problems by difficulty:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get problems by topic
router.get('/topic/:topicName', async (req, res) => {
  try {
    const { topicName } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { isActive: true, topic: topicName };
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const result = await inMemoryDB.findProblems(query, options);
    res.json(result);
  } catch (error) {
    console.error('Error fetching problems by topic:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get random problem
router.get('/random', async (req, res) => {
  try {
    const { difficulty, topic } = req.query;
    const query = { isActive: true };
    
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topic = topic;

    const allProblems = await inMemoryDB.findProblems(query, { limit: 1000 });
    const problems = allProblems.problems;
    
    if (problems.length === 0) {
      return res.status(404).json({ error: 'No problems found' });
    }

    const randomIndex = Math.floor(Math.random() * problems.length);
    const problem = problems[randomIndex];

    // Remove solution and hidden test cases
    const publicProblem = {
      ...problem,
      solution: undefined,
      testCases: problem.testCases.map(tc => ({
        ...tc,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput
      }))
    };

    res.json({ problem: publicProblem });
  } catch (error) {
    console.error('Error fetching random problem:', error);
    res.status(500).json({ error: 'Failed to fetch random problem' });
  }
});

// Get popular problems
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const allProblems = await inMemoryDB.findProblems({ isActive: true }, { limit: 1000 });
    const problems = allProblems.problems
      .sort((a, b) => b.statistics.totalSubmissions - a.statistics.totalSubmissions)
      .slice(0, parseInt(limit))
      .map(problem => ({
        ...problem,
        solution: undefined,
        testCases: problem.testCases.map(tc => ({
          ...tc,
          expectedOutput: tc.isHidden ? undefined : tc.expectedOutput
        }))
      }));

    res.json({ problems });
  } catch (error) {
    console.error('Error fetching popular problems:', error);
    res.status(500).json({ error: 'Failed to fetch popular problems' });
  }
});

// Get recent problems
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const options = {
      limit: parseInt(limit),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const result = await inMemoryDB.findProblems({ isActive: true }, options);
    
    // Remove solution and hidden test cases
    const publicProblems = result.problems.map(problem => ({
      ...problem,
      solution: undefined,
      testCases: problem.testCases.map(tc => ({
        ...tc,
        expectedOutput: tc.isHidden ? undefined : tc.expectedOutput
      }))
    }));

    res.json({ problems: publicProblems });
  } catch (error) {
    console.error('Error fetching recent problems:', error);
    res.status(500).json({ error: 'Failed to fetch recent problems' });
  }
});

// Submit solution
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { language, code } = req.body;
    const userId = req.user.id;

    if (!language || !code) {
      return res.status(400).json({ 
        error: 'Language and code are required' 
      });
    }

    // Get problem with test cases
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Execute code against test cases
    const executionResult = await codeExecutor.executeCode(
      language, 
      code, 
      problem.testCases, 
      id
    );

    // Create submission record
    const submission = new Submission({
      userId,
      problemId: id,
      language,
      code,
      executionResults: executionResult.executionResults,
      overallResult: executionResult.overallResult
    });

    await submission.save();

    // Update problem statistics
    await Problem.findByIdAndUpdate(id, {
      $inc: {
        'statistics.totalSubmissions': 1,
        'statistics.correctSubmissions': executionResult.overallResult.isCorrect ? 1 : 0
      }
    });

    // Update user progress if solution is correct
    if (executionResult.overallResult.isCorrect) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'learningStats.totalProblemsSolved': 1,
          'learningStats.totalSubmissions': 1,
          'learningStats.correctSubmissions': 1
        },
        $set: {
          'learningStats.lastActiveDate': new Date()
        }
      });
    }

    res.json({
      message: 'Solution submitted successfully',
      submission: {
        _id: submission._id,
        overallResult: submission.overallResult,
        executionResults: submission.executionResults
      }
    });
  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

module.exports = router;
