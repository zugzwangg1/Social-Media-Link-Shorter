const User = require('../models/User');
const Analytics = require('../models/Analytics');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} username - Username
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} Created user and token
 */
const register = async (email, username, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already registered');
    }
    if (existingUser.username === username) {
      throw new Error('Username already taken');
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
    oauthProvider: 'local'
  });

  // Create analytics record
  await Analytics.create({
    userId: user._id,
    profileViews: 0
  });

  // Generate token
  const token = generateToken({
    userId: user._id,
    email: user.email,
    username: user.username
  });

  return {
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      themeColor: user.themeColor
    },
    token
  };
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} User and token
 */
const login = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check if account is locked
  if (user.isLocked) {
    throw new Error('Account is temporarily locked due to multiple failed login attempts');
  }

  // Check password
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    // Increment failed login attempts
    user.failedLoginAttempts += 1;

    // Lock account after 5 failed attempts for 15 minutes
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await user.save();
    throw new Error('Invalid credentials');
  }

  // Reset failed login attempts on successful login
  if (user.failedLoginAttempts > 0) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
  }

  // Generate token
  const token = generateToken({
    userId: user._id,
    email: user.email,
    username: user.username
  });

  return {
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      themeColor: user.themeColor
    },
    token
  };
};

/**
 * Handle OAuth callback
 * @param {string} provider - OAuth provider (google, microsoft)
 * @param {Object} profile - OAuth profile data
 * @returns {Promise<Object>} User and token
 */
const handleOAuthCallback = async (provider, profile) => {
  const { id, email, displayName } = profile;

  // Check if user exists with this OAuth ID
  let user = await User.findOne({ oauthId: id, oauthProvider: provider });

  if (!user) {
    // Check if user exists with this email
    user = await User.findOne({ email });

    if (user) {
      // Link OAuth account to existing user
      user.oauthProvider = provider;
      user.oauthId = id;
      await user.save();
    } else {
      // Create new user
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
      
      // Ensure username is unique
      let uniqueUsername = username;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }

      user = await User.create({
        email,
        username: uniqueUsername,
        name: displayName,
        oauthProvider: provider,
        oauthId: id
      });

      // Create analytics record
      await Analytics.create({
        userId: user._id,
        profileViews: 0
      });
    }
  }

  // Generate token
  const token = generateToken({
    userId: user._id,
    email: user.email,
    username: user.username
  });

  return {
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture,
      themeColor: user.themeColor
    },
    token
  };
};

module.exports = {
  register,
  login,
  handleOAuthCallback
};
