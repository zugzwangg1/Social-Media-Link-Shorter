const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const passport = require('../config/passport');
const authService = require('../services/authService');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('username')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-z0-9_-]+$/).withMessage('Username can only contain lowercase letters, numbers, hyphens and underscores'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', authLimiter, validateRegistration, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { email, username, password } = req.body;
    const result = await authService.register(email, username, password);

    // Set token in httpOnly cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    if (error.message.includes('already')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, validateLogin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Set token in httpOnly cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    if (error.message.includes('Invalid credentials') || error.message.includes('locked')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_FAILED',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.json({
    success: true,
    data: {}
  });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId).select('-password');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          name: user.name,
          bio: user.bio,
          profilePicture: user.profilePicture,
          themeColor: user.themeColor
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/google
// @desc    Google OAuth initiation
// @access  Public
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
      const result = await authService.handleOAuthCallback('google', req.user);

      // Set token in httpOnly cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Redirect to frontend dashboard
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${result.token}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// @route   GET /api/auth/microsoft
// @desc    Microsoft OAuth initiation
// @access  Public
router.get('/microsoft',
  passport.authenticate('microsoft', { scope: ['user.read'], session: false })
);

// @route   GET /api/auth/microsoft/callback
// @desc    Microsoft OAuth callback
// @access  Public
router.get('/microsoft/callback',
  passport.authenticate('microsoft', { session: false, failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
      const result = await authService.handleOAuthCallback('microsoft', req.user);

      // Set token in httpOnly cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // Redirect to frontend dashboard
      res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${result.token}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// @route   POST /api/auth/password-reset
// @desc    Request password reset
// @access  Public
router.post('/password-reset', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const passwordResetService = require('../services/passwordResetService');
    const { email } = req.body;
    
    try {
      const resetToken = await passwordResetService.generateResetToken(email);
      
      // In production, send email with reset link
      // For now, return token in response (development only)
      res.json({
        success: true,
        data: {
          message: 'Password reset email sent',
          // Remove this in production
          resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        }
      });
    } catch (error) {
      // Don't reveal if user exists or not
      res.json({
        success: true,
        data: {
          message: 'If the email exists, a password reset link has been sent'
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/password-reset/:token
// @desc    Reset password with token
// @access  Public
router.post('/password-reset/:token', authLimiter, [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array()
        }
      });
    }

    const passwordResetService = require('../services/passwordResetService');
    const { token } = req.params;
    const { password } = req.body;

    await passwordResetService.resetPassword(token, password);

    res.json({
      success: true,
      data: {
        message: 'Password has been reset successfully'
      }
    });
  } catch (error) {
    if (error.message.includes('Invalid or expired')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: error.message
        }
      });
    }
    next(error);
  }
});

module.exports = router;
