/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Check for http or https protocol
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Normalize URL (ensure it has protocol)
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL
 */
const normalizeUrl = (url) => {
  if (!url) return url;
  
  // Add https:// if no protocol specified
  if (!url.match(/^https?:\/\//i)) {
    return `https://${url}`;
  }
  
  return url;
};

module.exports = {
  isValidUrl,
  normalizeUrl
};
