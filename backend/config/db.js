const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    // Debug the connection string
    console.log('🔍 MongoDB Connection Debug:');
    console.log('   MONGODB_URI length:', mongoURI ? mongoURI.length : 'undefined');
    console.log('   MONGODB_URI starts with:', mongoURI ? mongoURI.substring(0, 20) + '...' : 'undefined');
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      throw new Error(`Invalid MongoDB URI format. Expected "mongodb://" or "mongodb+srv://", got: ${mongoURI.substring(0, 20)}...`);
    }
    
    const conn = await mongoose.connect(mongoURI, {
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
    console.error('❌ Error details:', error.message);
    
    if (error.message.includes('MONGODB_URI environment variable is not set')) {
      console.error('💡 Solution: Set MONGODB_URI in Railway environment variables');
    } else if (error.message.includes('Invalid MongoDB URI format')) {
      console.error('💡 Solution: Check MONGODB_URI format in Railway environment variables');
      console.error('   Expected format: mongodb+srv://username:password@cluster.mongodb.net/database');
    }
    
    throw error; // Re-throw so the main server can handle it
  }
};

module.exports = connectDB;
