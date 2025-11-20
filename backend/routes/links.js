const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const linkService = require('../services/linkService');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all link routes
router.use(apiLimiter);

// All routes require authentication
router.use(protect);

// @route   GET /api/links
// @desc    Get user's links
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const links = await linkService.getLinks(req.user.userId);

    res.json({
      success: true,
      data: { links }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/links
// @desc    Create new link
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('url').trim().notEmpty().withMessage('URL is required')
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

    const { title, url } = req.body;
    const link = await linkService.createLink(req.user.userId, title, url);

    res.status(201).json({
      success: true,
      data: { link }
    });
  } catch (error) {
    if (error.message.includes('Invalid URL')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_URL',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// @route   PUT /api/links/:id
// @desc    Update link
// @access  Private
router.put('/:id', [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('url').optional().trim().notEmpty().withMessage('URL cannot be empty')
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

    const { title, url } = req.body;
    const link = await linkService.updateLink(req.params.id, req.user.userId, { title, url });

    res.json({
      success: true,
      data: { link }
    });
  } catch (error) {
    if (error.message === 'Link not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LINK_NOT_FOUND',
          message: error.message
        }
      });
    }
    if (error.message.includes('Invalid URL')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_URL',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// @route   DELETE /api/links/:id
// @desc    Delete link
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    await linkService.deleteLink(req.params.id, req.user.userId);

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.message === 'Link not found') {
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

// @route   PUT /api/links/reorder
// @desc    Reorder links
// @access  Private
router.put('/reorder', [
  body('linkIds').isArray().withMessage('linkIds must be an array')
    .notEmpty().withMessage('linkIds cannot be empty')
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

    const { linkIds } = req.body;
    const links = await linkService.reorderLinks(req.user.userId, linkIds);

    res.json({
      success: true,
      data: { links }
    });
  } catch (error) {
    if (error.message === 'Invalid link IDs') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_LINK_IDS',
          message: error.message
        }
      });
    }
    next(error);
  }
});

// @route   PUT /api/links/:id/toggle
// @desc    Toggle link active status
// @access  Private
router.put('/:id/toggle', async (req, res, next) => {
  try {
    const link = await linkService.toggleLinkStatus(req.params.id, req.user.userId);

    res.json({
      success: true,
      data: { link }
    });
  } catch (error) {
    if (error.message === 'Link not found') {
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
