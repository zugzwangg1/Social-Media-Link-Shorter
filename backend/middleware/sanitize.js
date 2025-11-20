/**
 * Sanitize user input to prevent injection attacks
 * This middleware works in conjunction with express-mongo-sanitize and xss-clean
 */

const sanitizeInput = (req, res, next) => {
  // Additional custom sanitization can be added here
  // express-mongo-sanitize already handles MongoDB injection
  // xss-clean already handles XSS attacks
  
  // Trim string inputs
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

module.exports = sanitizeInput;
