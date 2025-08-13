const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection (destination)
const atlasMongoURI = process.env.MONGODB_URI;

if (!atlasMongoURI) {
  console.error('❌ MONGODB_URI environment variable not set!');
  console.log('Please set MONGODB_URI in your .env file');
  process.exit(1);
}

async function migrateToAtlas() {
  try {
    console.log('🔄 Starting migration to MongoDB Atlas...');
    
    // Connect to MongoDB Atlas
    console.log('☁️  Connecting to MongoDB Atlas...');
    await mongoose.connect(atlasMongoURI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Import models (these will use the Atlas connection)
    const Problem = require('./models/Problem');
    const User = require('./models/User');
    const Submission = require('./models/Submission');
    
    // Check if data already exists in Atlas
    const existingProblems = await Problem.countDocuments();
    const existingUsers = await User.countDocuments();
    const existingSubmissions = await Submission.countDocuments();
    
    if (existingProblems > 0 || existingUsers > 0 || existingSubmissions > 0) {
      console.log('⚠️  Data already exists in MongoDB Atlas:');
      console.log(`   Problems: ${existingProblems}`);
      console.log(`   Users: ${existingUsers}`);
      console.log(`   Submissions: ${existingSubmissions}`);
      console.log('\n🔄 Skipping migration - data already present');
    } else {
      console.log('📊 No existing data found in Atlas, ready for fresh data');
    }
    
    // Create indexes on Atlas
    console.log('\n🔍 Creating indexes on Atlas...');
    await Problem.collection.createIndex({ topics: 1, difficulty: 1 });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Submission.collection.createIndex({ userId: 1, problemId: 1 });
    console.log('✅ Indexes created successfully');
    
    console.log('\n🎉 Atlas setup completed successfully!');
    console.log('\n📋 Current Atlas Status:');
    console.log(`   Problems: ${await Problem.countDocuments()}`);
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Submissions: ${await Submission.countDocuments()}`);
    
    console.log('\n🔗 Next steps:');
    console.log('1. Your app is now connected to MongoDB Atlas');
    console.log('2. You can deploy your backend to production');
    console.log('3. Update your frontend API URL for production');
    
  } catch (error) {
    console.error('❌ Atlas setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB Atlas');
  }
}

// Run if called directly
if (require.main === module) {
  migrateToAtlas();
}

module.exports = { migrateToAtlas };
