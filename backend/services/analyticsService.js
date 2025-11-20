const User = require('../models/User');
const Link = require('../models/Link');
const Analytics = require('../models/Analytics');

/**
 * Get analytics for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Analytics data
 */
const getAnalytics = async (userId) => {
  // Get profile views
  const analytics = await Analytics.findOne({ userId });

  // Get all links with click counts
  const links = await Link.find({ userId }).select('title url clicks isActive').sort({ position: 1 });

  // Calculate total clicks
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  return {
    profileViews: analytics?.profileViews || 0,
    totalClicks,
    links: links.map(link => ({
      id: link._id,
      title: link.title,
      url: link.url,
      clicks: link.clicks,
      isActive: link.isActive
    }))
  };
};

/**
 * Increment profile view counter
 * @param {string} username - Username
 * @returns {Promise<void>}
 */
const incrementProfileView = async (username) => {
  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    throw new Error('User not found');
  }

  // Use findOneAndUpdate with $inc for atomic increment
  await Analytics.findOneAndUpdate(
    { userId: user._id },
    { 
      $inc: { profileViews: 1 },
      $set: { lastViewedAt: new Date() }
    },
    { upsert: true, new: true }
  );
};

/**
 * Increment link click counter
 * @param {string} linkId - Link ID
 * @returns {Promise<string>} Target URL for redirect
 */
const incrementLinkClick = async (linkId) => {
  // Use findOneAndUpdate with $inc for atomic increment
  const link = await Link.findOneAndUpdate(
    { _id: linkId, isActive: true },
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (!link) {
    throw new Error('Link not found or inactive');
  }

  return link.url;
};

module.exports = {
  getAnalytics,
  incrementProfileView,
  incrementLinkClick
};
