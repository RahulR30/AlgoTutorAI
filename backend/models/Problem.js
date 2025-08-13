const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expectedOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  description: String
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  topics: [{
    type: String,
    required: true
  }],
  constraints: [{
    type: String,
    maxlength: 200
  }],
  examples: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    },
    explanation: String
  }],
  testCases: [testCaseSchema],
  solution: {
    type: String,
    required: true
  },
  hints: [{
    type: String,
    maxlength: 500
  }],
  relatedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  statistics: {
    totalSubmissions: {
      type: Number,
      default: 0
    },
    correctSubmissions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    difficultyRating: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  estimatedTime: {
    type: Number,
    default: 30, // minutes
    min: 5,
    max: 180
  },
  prerequisites: [String],
  learningObjectives: [String]
}, {
  timestamps: true
});

// Pre-save hook to generate slug from title
problemSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  next();
});

// Indexes for better query performance - commented out to avoid conflicts
// problemSchema.index({ slug: 1 });
// problemSchema.index({ difficulty: 1 });
// problemSchema.index({ topics: 1 });
// problemSchema.index({ isActive: 1 });
// problemSchema.index({ 'statistics.totalSubmissions': -1 });
// problemSchema.index({ 'statistics.averageScore': -1 });
// problemSchema.index({ category: 1 });

// Virtual for success rate
problemSchema.virtual('successRate').get(function() {
  if (this.statistics.totalSubmissions === 0) return 0;
  return Math.round((this.statistics.correctSubmissions / this.statistics.totalSubmissions) * 100);
});

// Virtual for difficulty level
problemSchema.virtual('difficultyLevel').get(function() {
  if (this.statistics.averageScore >= 80) return 'easy';
  if (this.statistics.averageScore >= 50) return 'medium';
  return 'hard';
});

// Method to update statistics
problemSchema.methods.updateStatistics = function(submissionResult) {
  this.statistics.totalSubmissions++;
  
  if (submissionResult.isCorrect) {
    this.statistics.correctSubmissions++;
  }
  
  // Update average score
  const totalScore = this.statistics.averageScore * (this.statistics.totalSubmissions - 1) + submissionResult.score;
  this.statistics.averageScore = totalScore / this.statistics.totalSubmissions;
  
  // Update average time
  if (submissionResult.executionTime) {
    const totalTime = this.statistics.averageTime * (this.statistics.totalSubmissions - 1) + submissionResult.executionTime;
    this.statistics.averageTime = totalTime / this.statistics.totalSubmissions;
  }
  
  return this.save();
};

// Method to add test case
problemSchema.methods.addTestCase = function(testCase) {
  this.testCases.push(testCase);
  return this.save();
};

// Method to remove test case
problemSchema.methods.removeTestCase = function(testCaseId) {
  this.testCases = this.testCases.filter(tc => tc._id.toString() !== testCaseId.toString());
  return this.save();
};

// Static method to find problems by topic
problemSchema.statics.findByTopic = function(topic) {
  return this.find({ 
    topics: topic, 
    isActive: true 
  }).sort({ 'statistics.totalSubmissions': -1 });
};

// Static method to find problems by difficulty
problemSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ 
    difficulty: difficulty, 
    isActive: true 
  }).sort({ 'statistics.averageScore': -1 });
};

// Static method to find popular problems
problemSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'statistics.totalSubmissions': -1 })
    .limit(limit);
};

// Static method to find recent problems
problemSchema.statics.findRecent = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Problem', problemSchema);
