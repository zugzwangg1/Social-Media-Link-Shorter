const crypto = require('crypto');
const User = require('../models/User');
const PasswordReset = require('../models/PasswordReset');
const { hashPassword } = require('../utils/passwordUtils');

/**
 * Generate password reset token
 * @param {string} email - User email
 * @returns {Promise<string>} Reset token
 */
const generateResetToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token before storing
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Create reset record with 1 hour expiration
  await PasswordReset.create({
    userId: user._id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    used: false
  });

  return resetToken;
};

/**
 * Reset password using token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
const resetPassword = async (token, newPassword) => {
  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find valid reset record
  const resetRecord = await PasswordReset.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
    used: false
  });

  if (!resetRecord) {
    throw new Error('Invalid or expired reset token');
  }

  // Get user
  const user = await User.findById(resetRecord.userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  user.password = hashedPassword;
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  // Mark token as used
  resetRecord.used = true;
  await resetRecord.save();

  // Invalidate all existing sessions would be handled by the client
  // by clearing tokens when password is reset
};

module.exports = {
  generateResetToken,
  resetPassword
};
