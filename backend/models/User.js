const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    bio: {
      type: String,
      maxlength: 500
    },
    location: {
      type: String,
      maxlength: 100
    },
    website: {
      type: String,
      maxlength: 200
    },
    avatar: {
      type: String
    }
  },
  learningStats: {
    totalProblemsSolved: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    },
    totalSubmissions: {
      type: Number,
      default: 0
    },
    correctSubmissions: {
      type: Number,
      default: 0
    }
  },
  topicProgress: [{
    topic: {
      type: String,
      required: true
    },
    problemsSolved: {
      type: Number,
      default: 0
    },
    totalProblems: {
      type: Number,
      default: 0
    },
    lastSolved: {
      type: Date
    }
  }],
  preferences: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    topics: [{
      type: String
    }],
    dailyGoal: {
      type: Number,
      default: 3,
      min: 1,
      max: 10
    },
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'javascript'
    }
  },
  achievements: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    icon: {
      type: String
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Index for better query performance - commented out to avoid conflicts
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });
// userSchema.index({ 'learningStats.totalProblemsSolved': -1 });
// userSchema.index({ 'learningStats.currentStreak': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Virtual for accuracy rate
userSchema.virtual('accuracyRate').get(function() {
  if (this.learningStats.totalSubmissions === 0) return 0;
  return Math.round((this.learningStats.correctSubmissions / this.learningStats.totalSubmissions) * 100);
});

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

module.exports = mongoose.model('User', userSchema);
