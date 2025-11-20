const crypto = require('crypto');

// Store for CSRF tokens (in production, use Redis or database)
const csrfTokens = new Map();

/**
 * Generate CSRF token
 */
const generateCsrfToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString('hex');
  const userId = req.user?.userId || req.sessionID || 'anonymous';
  
  csrfTokens.set(userId, token);
  
  // Set token in cookie
  res.cookie('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  });
  
  req.csrfToken = token;
  next();
};

/**
 * Validate CSRF token for state-changing operations
 */
const validateCsrfToken = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const userId = req.user?.userId || req.sessionID || 'anonymous';
  const storedToken = csrfTokens.get(userId);

  if (!token || !storedToken || token !== storedToken) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_TOKEN_INVALID',
        message: 'Invalid CSRF token'
      }
    });
  }

  next();
};

module.exports = {
  generateCsrfToken,
  validateCsrfToken
};
