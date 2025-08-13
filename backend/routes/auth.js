const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profile: {
        firstName: firstName || '',
        lastName: lastName || ''
      }
    });

    await user.save();

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Unable to register user at this time'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last active date
    user.learningStats.lastActiveDate = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      id: user._id,
      email: user.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Unable to authenticate user at this time'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'User profile retrieved successfully',
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

// @route   PUT /api/auth/profile
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

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    );
    
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

// @route   PUT /api/auth/preferences
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

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    );
    
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

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    // Generate new JWT token
    const payload = {
      id: user._id,
      email: user.email
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Unable to refresh token at this time'
    });
  }
});

module.exports = router;
