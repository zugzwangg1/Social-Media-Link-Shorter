const User = require('../models/User');
const Link = require('../models/Link');
const Analytics = require('../models/Analytics');

/**
 * Get public profile by username
 * @param {string} username - Username
 * @returns {Promise<Object>} Profile data
 */
const getProfile = async (username) => {
  const user = await User.findOne({ username: username.toLowerCase() })
    .select('-password -failedLoginAttempts -lockUntil -oauthId');

  if (!user) {
    throw new Error('Profile not found');
  }

  // Get active links only for public profile
  const links = await Link.find({ userId: user._id, isActive: true })
    .sort({ position: 1 })
    .select('-userId');

  // Get analytics
  const analytics = await Analytics.findOne({ userId: user._id });

  return {
    user: {
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      themeColor: user.themeColor
    },
    links,
    profileViews: analytics?.profileViews || 0
  };
};

/**
 * Update profile information
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated user
 */
const updateProfile = async (userId, updates) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Update allowed fields
  if (updates.name !== undefined) {
    user.name = updates.name.trim();
  }

  if (updates.bio !== undefined) {
    if (updates.bio.length > 200) {
      throw new Error('Bio cannot exceed 200 characters');
    }
    user.bio = updates.bio.trim();
  }

  await user.save();

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    profilePicture: user.profilePicture,
    themeColor: user.themeColor
  };
};

/**
 * Change username
 * @param {string} userId - User ID
 * @param {string} newUsername - New username
 * @returns {Promise<Object>} Updated user
 */
const changeUsername = async (userId, newUsername) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Validate username format
  const usernameRegex = /^[a-z0-9_-]+$/;
  if (!usernameRegex.test(newUsername)) {
    throw new Error('Username can only contain lowercase letters, numbers, hyphens and underscores');
  }

  if (newUsername.length < 3 || newUsername.length > 30) {
    throw new Error('Username must be between 3 and 30 characters');
  }

  // Check if username is already taken
  const existingUser = await User.findOne({ 
    username: newUsername.toLowerCase(),
    _id: { $ne: userId }
  });

  if (existingUser) {
    throw new Error('Username already taken');
  }

  user.username = newUsername.toLowerCase();
  await user.save();

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    profilePicture: user.profilePicture,
    themeColor: user.themeColor
  };
};

/**
 * Upload profile picture
 * @param {string} userId - User ID
 * @param {string} filePath - File path or URL
 * @returns {Promise<Object>} Updated user
 */
const uploadProfilePicture = async (userId, filePath) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.profilePicture = filePath;
  await user.save();

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    profilePicture: user.profilePicture,
    themeColor: user.themeColor
  };
};

/**
 * Update theme color
 * @param {string} userId - User ID
 * @param {string} color - Hex color code
 * @returns {Promise<Object>} Updated user
 */
const updateTheme = async (userId, color) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Validate hex color
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexColorRegex.test(color)) {
    throw new Error('Invalid hex color format');
  }

  user.themeColor = color;
  await user.save();

  return {
    id: user._id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    profilePicture: user.profilePicture,
    themeColor: user.themeColor
  };
};

module.exports = {
  getProfile,
  updateProfile,
  changeUsername,
  uploadProfilePicture,
  updateTheme
};
