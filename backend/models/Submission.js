const mongoose = require('mongoose');

const executionResultSchema = new mongoose.Schema({
  testCaseIndex: {
    type: Number,
    required: true
  },
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expectedOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  actualOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  executionTime: {
    type: Number,
    default: 0
  },
  memoryUsed: {
    type: Number,
    default: 0
  },
  errorMessage: String
});

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
 },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift']
  },
  code: {
    type: String,
    required: true,
    maxlength: 10000
  },
  executionResults: [executionResultSchema],
  overallResult: {
    isCorrect: {
      type: Boolean,
      required: true
    },
    totalTestCases: {
      type: Number,
      required: true
    },
    passedTestCases: {
      type: Number,
      required: true
    },
    executionTime: {
      type: Number,
      default: 0
    },
    memoryUsed: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'error', 'timeout'],
    default: 'pending'
  },
  isSubmitted: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date
  },
  feedback: {
    type: String,
    maxlength: 1000
  },
  aiAnalysis: {
    codeQuality: {
      type: Number,
      min: 1,
      max: 10
    },
    timeComplexity: String,
    spaceComplexity: String,
    suggestions: [String],
    improvements: [String]
  },
  metadata: {
    browser: String,
    userAgent: String,
    ipAddress: String,
    submissionMethod: {
      type: String,
      enum: ['web', 'api', 'mobile'],
      default: 'web'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance - commented out to avoid conflicts
// submissionSchema.index({ userId: 1, problemId: 1 });
// submissionSchema.index({ userId: 1, createdAt: -1 });
// submissionSchema.index({ problemId: 1, createdAt: -1 });
// submissionSchema.index({ status: 1 });
// submissionSchema.index({ 'overallResult.isCorrect': 1 });
// submissionSchema.index({ language: 1 });

// Virtual for execution status
submissionSchema.virtual('executionStatus').get(function() {
  if (this.status === 'completed') {
    return this.overallResult.isCorrect ? 'accepted' : 'wrong_answer';
  }
  return this.status;
});

// Virtual for performance rating
submissionSchema.virtual('performanceRating').get(function() {
  if (this.overallResult.score >= 90) return 'excellent';
  if (this.overallResult.score >= 70) return 'good';
  if (this.overallResult.score >= 50) return 'fair';
  return 'poor';
});

// Method to update execution results
submissionSchema.methods.updateExecutionResults = function(results) {
  this.executionResults = results;
  this.overallResult = this.calculateOverallResult(results);
  this.status = 'completed';
  this.submittedAt = new Date();
  this.isSubmitted = true;
  return this.save();
};

// Method to calculate overall result
submissionSchema.methods.calculateOverallResult = function(results) {
  const totalTestCases = results.length;
  const passedTestCases = results.filter(r => r.isCorrect).length;
  const isCorrect = passedTestCases === totalTestCases;
  
  // Calculate average execution time
  const totalTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0);
  const averageTime = totalTime / totalTestCases;
  
  // Calculate average memory usage
  const totalMemory = results.reduce((sum, r) => sum + (r.memoryUsed || 0), 0);
  const averageMemory = totalMemory / totalTestCases;
  
  // Calculate score based on passed test cases
  const score = Math.round((passedTestCases / totalTestCases) * 100);
  
  return {
    isCorrect,
    totalTestCases,
    passedTestCases,
    executionTime: averageTime,
    memoryUsed: averageMemory,
    score
  };
};

// Method to add AI analysis
submissionSchema.methods.addAIAnalysis = function(analysis) {
  this.aiAnalysis = analysis;
  return this.save();
};

// Method to add feedback
submissionSchema.methods.addFeedback = function(feedback) {
  this.feedback = feedback;
  return this.save();
};

// Static method to find user's submissions
submissionSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.problemId) {
    query.problemId = options.problemId;
  }
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.language) {
    query.language = options.language;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('problemId', 'title difficulty topics')
    .limit(options.limit || 50);
};

// Static method to find problem submissions
submissionSchema.statics.findByProblem = function(problemId, options = {}) {
  const query = { problemId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.language) {
    query.language = options.language;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .populate('userId', 'username profile.firstName profile.lastName')
    .limit(options.limit || 100);
};

// Static method to get submission statistics
submissionSchema.statics.getStatistics = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        correctSubmissions: { $sum: { $cond: ['$overallResult.isCorrect', 1, 0] } },
        averageScore: { $avg: '$overallResult.score' },
        averageTime: { $avg: '$overallResult.executionTime' },
        languages: { $addToSet: '$language' }
      }
    }
  ]);
};

module.exports = mongoose.model('Submission', submissionSchema);
