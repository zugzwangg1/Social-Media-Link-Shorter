const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');
const { protect } = require('../middleware/auth');
const { analyticsLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to analytics routes
router.use(analyticsLimiter);

// @route   GET /api/analytics
// @desc    Get user analytics
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const analytics = await analyticsService.getAnalytics(req.user.userId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/analytics/view/:username
// @desc    Increment profile view counter
// @access  Public
router.post('/view/:username', async (req, res, next) => {
  try {
    await analyticsService.incrementProfileView(req.params.username);

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// @route   POST /api/analytics/click/:linkId
// @desc    Increment link click counter and get redirect URL
// @access  Public
router.post('/click/:linkId', async (req, res, next) => {
  try {
    const targetUrl = await analyticsService.incrementLinkClick(req.params.linkId);

    res.json({
      success: true,
      data: { targetUrl }
    });
  } catch (error) {
    if (error.message === 'Link not found or inactive') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LINK_NOT_FOUND',
          message: error.message
        }
      });
    }
    next(error);
  }
});

module.exports = router;
