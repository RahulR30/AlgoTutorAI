const express = require('express');
const User = require('../models/User');
const Submission = require('../models/Submission');

async function findSubmissionsByUser(userId, options = {}) {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Math.min(1000, Number(options.limit) || 20));
  const [submissions, total] = await Promise.all([
    Submission.find({ userId }).sort({ createdAt: -1 }).skip((page - 1) * limit)
      .limit(limit).populate('problemId', 'title difficulty topics').lean(),
    Submission.countDocuments({ userId })
  ]);
  return { submissions, pagination: { currentPage: page, totalPages: Math.ceil(total / limit), totalSubmissions: total, hasNext: page * limit < total, hasPrev: page > 1 } };
}
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Profile retrieved successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'Unable to retrieve user profile at this time'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, bio, location, website } = req.body;
    
    const updates = {};
    if (firstName !== undefined) updates['profile.firstName'] = firstName;
    if (lastName !== undefined) updates['profile.lastName'] = lastName;
    if (bio !== undefined) updates['profile.bio'] = bio;
    if (location !== undefined) updates['profile.location'] = location;
    if (website !== undefined) updates['profile.website'] = website;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true }).lean();
    
    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'Unable to update user profile at this time'
    });
  }
});

// @route   GET /api/users/progress
// @desc    Get user learning progress
// @access  Private
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Get recent submissions
    const submissions = await findSubmissionsByUser(req.user.id, {
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    // Calculate overall progress
    const totalTopics = user.topicProgress.length;
    const completedTopics = user.topicProgress.filter(tp => tp.problemsSolved >= 5).length;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Get weak and strong topics
    const weakTopics = user.topicProgress
      .filter(tp => tp.averageScore < 70)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);

    const strongTopics = user.topicProgress
      .filter(tp => tp.averageScore >= 80)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);

    const progress = {
      overall: {
        totalProblemsSolved: user.learningStats.totalProblemsSolved,
        currentStreak: user.learningStats.currentStreak,
        longestStreak: user.learningStats.longestStreak,
        overallProgress,
        totalTopics,
        completedTopics
      },
      topicProgress: user.topicProgress,
      recentSubmissions: submissions.submissions,
      weakTopics,
      strongTopics,
      insights: {
        needsImprovement: weakTopics.map(tp => tp.topic),
        strengths: strongTopics.map(tp => tp.topic),
        nextMilestone: user.learningStats.totalProblemsSolved + 5
      }
    };

    res.json({
      message: 'Progress retrieved successfully',
      progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      error: 'Progress retrieval failed',
      message: 'Unable to retrieve user progress at this time'
    });
  }
});

// @route   GET /api/users/submissions
// @desc    Get user submission history
// @access  Private
router.get('/submissions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const result = await findSubmissionsByUser(req.user.id, options);

    res.json({
      message: 'Submissions retrieved successfully',
      submissions: result.submissions,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      error: 'Submissions retrieval failed',
      message: 'Unable to retrieve user submissions at this time'
    });
  }
});

// @route   GET /api/users/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Check for new achievements based on current progress
    const newAchievements = [];
    
    // First problem solved
    if (user.learningStats.totalProblemsSolved >= 1 && !user.achievements.find(a => a.name === 'First Steps')) {
      newAchievements.push({
        name: 'First Steps',
        description: 'Solved your first problem',
        icon: '🎯',
        earnedAt: new Date()
      });
    }
    
    // Streak achievements
    if (user.learningStats.currentStreak >= 3 && !user.achievements.find(a => a.name === 'Consistent Learner')) {
      newAchievements.push({
        name: 'Consistent Learner',
        description: 'Maintained a 3-day streak',
        icon: '🔥',
        earnedAt: new Date()
      });
    }
    
    if (user.learningStats.currentStreak >= 7 && !user.achievements.find(a => a.name === 'Week Warrior')) {
      newAchievements.push({
        name: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        icon: '⚡',
        earnedAt: new Date()
      });
    }
    
    // Topic mastery achievements
    const masteredTopics = user.topicProgress.filter(tp => tp.problemsSolved >= 10 && tp.averageScore >= 80);
    if (masteredTopics.length >= 1 && !user.achievements.find(a => a.name === 'Topic Master')) {
      newAchievements.push({
        name: 'Topic Master',
        description: `Mastered ${masteredTopics.length} topic(s)`,
        icon: '👑',
        earnedAt: new Date()
      });
    }
    
    // Problem count achievements
    if (user.learningStats.totalProblemsSolved >= 10 && !user.achievements.find(a => a.name === 'Problem Solver')) {
      newAchievements.push({
        name: 'Problem Solver',
        description: 'Solved 10 problems',
        icon: '💪',
        earnedAt: new Date()
      });
    }
    
    if (user.learningStats.totalProblemsSolved >= 50 && !user.achievements.find(a => a.name === 'Algorithm Expert')) {
      newAchievements.push({
        name: 'Algorithm Expert',
        description: 'Solved 50 problems',
        icon: '🧠',
        earnedAt: new Date()
      });
    }

    // Add new achievements to user
    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
      await User.findByIdAndUpdate(req.user.id, { $set: { achievements: user.achievements } });
    }

    res.json({
      message: 'Achievements retrieved successfully',
      achievements: user.achievements,
      newAchievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      error: 'Achievements retrieval failed',
      message: 'Unable to retrieve user achievements at this time'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get global leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    // Get all users and sort by problems solved
    const allUsers = (await User.find({ isActive: true })
      .sort({ 'learningStats.totalProblemsSolved': -1 })
      .limit(Math.max(1, Math.min(100, parseInt(limit) || 20)))
      .select('username profile learningStats').lean())
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        profile: user.profile,
        stats: {
          problemsSolved: user.learningStats.totalProblemsSolved,
          currentStreak: user.learningStats.currentStreak,
          longestStreak: user.learningStats.longestStreak
        }
      }));

    res.json({
      message: 'Leaderboard retrieved successfully',
      leaderboard: allUsers
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      error: 'Leaderboard retrieval failed',
      message: 'Unable to retrieve leaderboard at this time'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Get submission statistics
    const allSubmissions = await findSubmissionsByUser(req.user.id, { limit: 1000 });
    const submissions = allSubmissions.submissions;
    
    // Calculate submission stats
    const totalSubmissions = submissions.length;
    const successfulSubmissions = submissions.filter(s => s.overallResult.isCorrect).length;
    const successRate = totalSubmissions > 0 ? Math.round((successfulSubmissions / totalSubmissions) * 100) : 0;
    
    // Language usage stats
    const languageStats = {};
    submissions.forEach(sub => {
      languageStats[sub.language] = (languageStats[sub.language] || 0) + 1;
    });
    
    // Topic performance stats
    const topicStats = {};
    user.topicProgress.forEach(tp => {
      topicStats[tp.topic] = {
        problemsSolved: tp.problemsSolved,
        averageScore: tp.averageScore,
        difficultyBreakdown: tp.difficultyBreakdown
      };
    });

    const stats = {
      overview: {
        totalProblemsSolved: user.learningStats.totalProblemsSolved,
        currentStreak: user.learningStats.currentStreak,
        longestStreak: user.learningStats.longestStreak,
        totalTimeSpent: user.learningStats.totalTimeSpent
      },
      submissions: {
        total: totalSubmissions,
        successful: successfulSubmissions,
        successRate,
        averageScore: submissions.length > 0 ? 
          Math.round(submissions.reduce((sum, s) => sum + s.overallResult.score, 0) / submissions.length) : 0
      },
      languages: languageStats,
      topics: topicStats,
      achievements: {
        total: user.achievements.length,
        recent: user.achievements.slice(-3)
      }
    };

    res.json({
      message: 'Statistics retrieved successfully',
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Statistics retrieval failed',
      message: 'Unable to retrieve user statistics at this time'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
  try {
    const { difficulty, topics, dailyGoal, notifications, theme } = req.body;
    
    const updates = {};
    if (difficulty !== undefined) updates['preferences.difficulty'] = difficulty;
    if (topics !== undefined) updates['preferences.topics'] = topics;
    if (dailyGoal !== undefined) updates['preferences.dailyGoal'] = dailyGoal;
    if (notifications !== undefined) updates['preferences.notifications'] = notifications;
    if (theme !== undefined) updates['preferences.theme'] = theme;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true }).lean();
    
    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser;

    res.json({
      message: 'Preferences updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Preferences update failed',
      message: 'Unable to update user preferences at this time'
    });
  }
});

module.exports = router;
