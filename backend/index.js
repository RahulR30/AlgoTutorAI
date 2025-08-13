const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');

// Import MongoDB connection
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Debug environment variables
console.log('🔍 Environment check:');
console.log('   PORT:', process.env.PORT);
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AlgoTutorAI Server is running',
    mode: 'mongodb',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting AlgoTutorAI Server...');
    
    // Connect to MongoDB
    console.log('📊 Attempting to connect to MongoDB...');
    await connectDB();
    console.log('📊 MongoDB connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 AlgoTutorAI Server running on port ${PORT}`);
      console.log(`📚 Ready to help students learn algorithms and data structures!`);
      console.log(`🔧 Running with FULL FUNCTIONALITY (MongoDB mode)`);
      console.log(`🎯 Features: Real code execution, AI analysis, Progress tracking`);
      console.log(`🗄️  Database: MongoDB Atlas (Cloud)`);
      console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
