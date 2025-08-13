const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algotutor-ai', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance (with error handling)
    try {
      await mongoose.connection.db.collection('problems').createIndex({ topics: 1, difficulty: 1 });
      await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await mongoose.connection.db.collection('submissions').createIndex({ userId: 1, problemId: 1 });
      console.log('🔍 Database indexes created successfully');
    } catch (indexError) {
      console.log('ℹ️  Some indexes already exist, continuing...');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
