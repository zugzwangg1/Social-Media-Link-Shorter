const Link = require('../models/Link');
const { isValidUrl, normalizeUrl } = require('../utils/urlValidator');

/**
 * Get all links for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User's links
 */
const getLinks = async (userId) => {
  const links = await Link.find({ userId }).sort({ position: 1 });
  return links;
};

/**
 * Create a new link
 * @param {string} userId - User ID
 * @param {string} title - Link title
 * @param {string} url - Link URL
 * @returns {Promise<Object>} Created link
 */
const createLink = async (userId, title, url) => {
  if (!title || !title.trim()) {
    throw new Error('Link title is required');
  }

  // Normalize and validate URL
  const normalizedUrl = normalizeUrl(url);
  
  if (!isValidUrl(normalizedUrl)) {
    throw new Error('Invalid URL format');
  }

  // Get the highest position for this user
  const lastLink = await Link.findOne({ userId }).sort({ position: -1 });
  const position = lastLink ? lastLink.position + 1 : 0;

  const link = await Link.create({
    userId,
    title: title.trim(),
    url: normalizedUrl,
    position,
    isActive: true,
    clicks: 0
  });

  return link;
};

/**
 * Update a link
 * @param {string} linkId - Link ID
 * @param {string} userId - User ID (for authorization)
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated link
 */
const updateLink = async (linkId, userId, updates) => {
  const link = await Link.findOne({ _id: linkId, userId });

  if (!link) {
    throw new Error('Link not found');
  }

  // Validate title if provided
  if (updates.title !== undefined) {
    if (!updates.title || !updates.title.trim()) {
      throw new Error('Link title is required');
    }
    link.title = updates.title.trim();
  }

  // Validate and normalize URL if provided
  if (updates.url !== undefined) {
    const normalizedUrl = normalizeUrl(updates.url);
    if (!isValidUrl(normalizedUrl)) {
      throw new Error('Invalid URL format');
    }
    link.url = normalizedUrl;
  }

  await link.save();
  return link;
};

/**
 * Delete a link
 * @param {string} linkId - Link ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<void>}
 */
const deleteLink = async (linkId, userId) => {
  const link = await Link.findOne({ _id: linkId, userId });

  if (!link) {
    throw new Error('Link not found');
  }

  await Link.deleteOne({ _id: linkId });
};

/**
 * Reorder links
 * @param {string} userId - User ID
 * @param {Array<string>} linkIds - Array of link IDs in new order
 * @returns {Promise<Array>} Updated links
 */
const reorderLinks = async (userId, linkIds) => {
  // Verify all links belong to user
  const links = await Link.find({ _id: { $in: linkIds }, userId });

  if (links.length !== linkIds.length) {
    throw new Error('Invalid link IDs');
  }

  // Update positions
  const updatePromises = linkIds.map((linkId, index) => {
    return Link.updateOne(
      { _id: linkId, userId },
      { position: index }
    );
  });

  await Promise.all(updatePromises);

  // Return updated links
  return await getLinks(userId);
};

/**
 * Toggle link active status
 * @param {string} linkId - Link ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<Object>} Updated link
 */
const toggleLinkStatus = async (linkId, userId) => {
  const link = await Link.findOne({ _id: linkId, userId });

  if (!link) {
    throw new Error('Link not found');
  }

  link.isActive = !link.isActive;
  await link.save();

  return link;
};

module.exports = {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  toggleLinkStatus
};
