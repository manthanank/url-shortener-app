const Url = require('../models/urlModel');
const UrlService = require('../services/urlService');
const { ApiResponse, AppError } = require('../utils/response');
const { isExpired } = require('../utils/urlUtils');
const { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../constants');

/**
 * Create a short URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl, customShortUrl } = req.validatedData;

        const { url, isNew } = await UrlService.findOrCreateUrl(originalUrl, customShortUrl);

        const message = isNew ? SUCCESS_MESSAGES.URL_CREATED : 'URL already exists';
        const statusCode = isNew ? HTTP_STATUS.CREATED : HTTP_STATUS.OK;

        ApiResponse.success(message, url, statusCode).send(res);

    } catch (error) {
        next(error);
    }
};

/**
 * Redirect to original URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const redirectUrl = async (req, res, next) => {
    try {
        const { shortUrl } = req.params;

        const url = await Url.findOne({ shortUrl, isActive: true });

        if (!url) {
            throw new AppError(ERROR_MESSAGES.URL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        if (isExpired(url.expirationDate)) {
            // Optionally deactivate expired URLs
            url.isActive = false;
            await url.save();
            throw new AppError(ERROR_MESSAGES.URL_EXPIRED, HTTP_STATUS.NOT_FOUND);
        }

        // Increment click count and update last accessed time
        await url.incrementClicks();

        // Redirect to original URL
        res.redirect(url.originalUrl);

    } catch (error) {
        if (error instanceof AppError) {
            return ApiResponse.error(error.message, error.statusCode).send(res);
        }
        next(error);
    }
};

/**
 * Get all URLs with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getUrls = async (req, res, next) => {
    try {
        const result = await UrlService.getUrlsWithPagination(req.query);

        ApiResponse.success(
            SUCCESS_MESSAGES.URL_RETRIEVED,
            result
        ).send(res);

    } catch (error) {
        next(error);
    }
};

/**
 * Get URL details by short URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getDetails = async (req, res, next) => {
    try {
        const { shortUrl } = req.params;

        const url = await Url.findOne({ shortUrl });

        if (!url) {
            throw new AppError(ERROR_MESSAGES.URL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        // Add computed fields
        const urlDetails = {
            ...url.toJSON(),
            isExpired: isExpired(url.expirationDate),
            daysUntilExpiration: url.expirationDate ?
                Math.ceil((url.expirationDate - new Date()) / (1000 * 60 * 60 * 24)) : null
        };

        ApiResponse.success(
            SUCCESS_MESSAGES.URL_RETRIEVED,
            urlDetails
        ).send(res);

    } catch (error) {
        next(error);
    }
};

/**
 * Delete URL by short URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteUrl = async (req, res, next) => {
    try {
        const { shortUrl } = req.params;

        const deletedUrl = await Url.findOneAndDelete({ shortUrl });

        if (!deletedUrl) {
            throw new AppError(ERROR_MESSAGES.URL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        ApiResponse.success(
            SUCCESS_MESSAGES.URL_DELETED,
            { shortUrl }
        ).send(res);

    } catch (error) {
        next(error);
    }
};

/**
 * Get URL analytics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAnalytics = async (req, res, next) => {
    try {
        const { shortUrl } = req.params;

        const analytics = await UrlService.getUrlAnalytics(shortUrl);

        ApiResponse.success(
            'Analytics retrieved successfully',
            analytics
        ).send(res);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createShortUrl,
    redirectUrl,
    getUrls,
    getDetails,
    deleteUrl,
    getAnalytics
};
