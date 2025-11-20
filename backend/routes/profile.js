const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const profileService = require('../services/profileService');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB default
  },
  fileFilter
});

// Apply rate limiting
router.use(apiLimiter);

// @route   GET /api/profile/:username
// @desc    Get public profile
// @access  Public
router.get('/:username', async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.params.username);

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    if (error.message === 'Profile not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profile not found'
        }
      });
    }
    next(error);
  }
});

// @route   PUT /api/profile
// @desc    Update profile
// @access  Private
router.put('/', protect, [
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('bio').optional().trim().isLength({ max: 200 }).withMessage('Bio cannot exceed 200 characters')
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

    const { name, bio } = req.body;
    const user = await profileService.updateProfile(req.user.userId, { name, bio });

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/profile/username
// @desc    Change username
// @access  Private
router.put('/username', protect, [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-z0-9_-]+$/).withMessage('Username can only contain lowercase letters, numbers, hyphens and underscores')
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

    const { username } = req.body;
    const user = await profileService.changeUsername(req.user.userId, username);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    if (error.message === 'Username already taken') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USERNAME_TAKEN',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// @route   POST /api/profile/picture
// @desc    Upload profile picture
// @access  Private
router.post('/picture', protect, upload.single('profilePicture'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE',
          message: 'Please upload a file'
        }
      });
    }

    const filePath = `/uploads/profiles/${req.file.filename}`;
    const user = await profileService.uploadProfilePicture(req.user.userId, filePath);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}, (error, req, res, next) => {
  // Multer error handler
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'File size exceeds the limit'
        }
      });
    }
  }
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: error.message
      }
    });
  }
  next(error);
});

// @route   PUT /api/profile/theme
// @desc    Update theme color
// @access  Private
router.put('/theme', protect, [
  body('color')
    .trim()
    .notEmpty().withMessage('Color is required')
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Please provide a valid hex color')
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

    const { color } = req.body;
    const user = await profileService.updateTheme(req.user.userId, color);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
