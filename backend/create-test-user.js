const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algotutor');
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'demo@algotutor.ai' });
    if (existingUser) {
      console.log('ℹ️ Test user already exists');
      console.log('   Email: demo@algotutor.ai');
      console.log('   Password: demo123');
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Create test user
    const testUser = new User({
      username: 'demo',
      email: 'demo@algotutor.ai',
      password: hashedPassword,
      profile: {
        firstName: 'Demo',
        lastName: 'User'
      },
      learningStats: {
        totalProblemsSolved: 0,
        currentStreak: 0,
        totalTimeSpent: 0,
        lastActiveDate: new Date()
      },
      topicProgress: [],
      preferences: {
        difficulty: 'beginner',
        topics: ['arrays', 'strings'],
        dailyGoal: 3,
        notifications: true,
        theme: 'light'
      }
    });

    await testUser.save();
    console.log('✅ Test user created successfully!');
    console.log('   Email: demo@algotutor.ai');
    console.log('   Password: demo123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createTestUser();
