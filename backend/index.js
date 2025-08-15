const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
console.log('🔍 Loading route files...');
const authRoutes = require('./routes/auth');
console.log('✅ Auth routes loaded');
const problemRoutes = require('./routes/problems');
console.log('✅ Problem routes loaded');
const userRoutes = require('./routes/users');
console.log('✅ User routes loaded');

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

// Check for critical environment variables
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  WARNING: MONGODB_URI not set. Server may not start properly.');
  console.warn('   Please set MONGODB_URI in Railway environment variables.');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set. Authentication will not work.');
  console.warn('   Please set JWT_SECRET in Railway environment variables.');
}

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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Get the base domain without trailing slash
    const baseDomain = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : 'http://localhost:3000';
    
    // Allow requests from the base domain and with trailing slash
    if (origin === baseDomain || origin === baseDomain + '/') {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin === 'http://localhost:3000' || origin === 'http://localhost:3000/') {
      return callback(null, true);
    }
    
    console.log('🚫 CORS blocked origin:', origin);
    console.log('✅ Allowed origins:', baseDomain, baseDomain + '/');
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan('combined'));

// API routes
console.log('🔍 Registering API routes...');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes registered at /api/auth');
app.use('/api/problems', problemRoutes);
console.log('✅ Problem routes registered at /api/problems');
app.use('/api/users', userRoutes);
console.log('✅ User routes registered at /api/users');

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check if Python is available
    const { exec } = require('child_process');
    const pythonCheck = new Promise((resolve) => {
      exec('python3 --version', { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          resolve({ available: false, error: error.message, version: null });
        } else {
          resolve({ available: true, error: null, version: stdout.trim() });
        }
      });
    });

    const pythonStatus = await pythonCheck;
    
    res.json({ 
      status: 'OK', 
      message: 'AlgoTutorAI Server is running',
      mode: 'mongodb',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      mongoConnected: !!process.env.MONGODB_URI,
      jwtConfigured: !!process.env.JWT_SECRET,
      python: pythonStatus
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'AlgoTutorAI Server is running',
      mode: 'mongodb',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      mongoConnected: !!process.env.MONGODB_URI,
      jwtConfigured: !!process.env.JWT_SECRET,
      python: { available: false, error: 'Health check failed', version: null }
    });
  }
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
    
    // Only try to connect to MongoDB if URI is provided
    if (process.env.MONGODB_URI) {
      console.log('📊 Attempting to connect to MongoDB...');
      await connectDB();
      console.log('📊 MongoDB connected successfully');
    } else {
      console.log('⚠️  Skipping MongoDB connection - MONGODB_URI not set');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 AlgoTutorAI Server running on port ${PORT}`);
      console.log(`📚 Ready to help students learn algorithms and data structures!`);
      
      if (process.env.MONGODB_URI) {
        console.log(`🔧 Running with FULL FUNCTIONALITY (MongoDB mode)`);
        console.log(`🎯 Features: Real code execution, Progress tracking`);
        console.log(`🗄️  Database: MongoDB Atlas (Cloud)`);
      } else {
        console.log(`⚠️  Running in LIMITED mode - MongoDB not configured`);
        console.log(`🔧 Please set MONGODB_URI environment variable for full functionality`);
      }
      
      console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Don't exit if it's just a MongoDB connection issue
    if (error.message.includes('MongoDB') || error.message.includes('connect')) {
      console.log('⚠️  Starting server without MongoDB connection...');
      app.listen(PORT, () => {
        console.log(`🚀 AlgoTutorAI Server running on port ${PORT} (Limited Mode)`);
        console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
      });
    } else {
      process.exit(1);
    }
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
