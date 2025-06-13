const crypto = require('crypto');
const config = require('../config/environment');

/**
 * Generate the full short URL
 * @param {string} shortCode - The short URL code
 * @returns {string} - Complete short URL
 */
const generateShortUrl = (shortCode) => {
    return `${config.url.baseUrl}/${shortCode}`;
};

/**
 * Generate a unique short URL identifier
 * @param {number} length - Length of the generated string
 * @returns {string} - Random string
 */
const generateUniqueId = (length = config.url.shortUrlLength) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
};

/**
 * Generate a cryptographically secure random string
 * @param {number} length - Length of the generated string
 * @returns {string} - Secure random string
 */
const generateSecureId = (length = config.url.shortUrlLength) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.randomBytes(length);
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters[randomBytes[i] % characters.length];
    }

    return result;
};

/**
 * Calculate expiration date
 * @param {number} days - Number of days from now
 * @returns {Date} - Expiration date
 */
const calculateExpirationDate = (days = config.url.defaultExpirationDays) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    return expirationDate;
};

/**
 * Check if URL has expired
 * @param {Date} expirationDate - The expiration date to check
 * @returns {boolean} - Whether the URL has expired
 */
const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    return expirationDate < new Date();
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
const isValidUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
        return false;
    }
};

/**
 * Sanitize URL by ensuring it has a protocol
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
const sanitizeUrl = (url) => {
    if (!url.match(/^https?:\/\//)) {
        return `https://${url}`;
    }
    return url;
};

module.exports = {
    generateShortUrl,
    generateUniqueId,
    generateSecureId,
    calculateExpirationDate,
    isExpired,
    isValidUrl,
    sanitizeUrl
};
