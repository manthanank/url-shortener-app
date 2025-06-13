const Url = require('../models/urlModel');
const { generateSecureId, calculateExpirationDate, isExpired } = require('../utils/urlUtils');
const { AppError } = require('../utils/response');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

class UrlService {
    /**
     * Find an existing URL or create a new one
     */
    static async findOrCreateUrl(originalUrl, customShortUrl = null) {
        // Check if URL already exists and is not expired
        const existingUrl = await Url.findOne({ originalUrl, isActive: true });
        if (existingUrl && !isExpired(existingUrl.expirationDate)) {
            return { url: existingUrl, isNew: false };
        }

        // Generate unique short URL
        const shortUrl = customShortUrl || await this.generateUniqueShortUrl();

        // Validate custom short URL if provided
        if (customShortUrl) {
            const existingCustomUrl = await Url.findOne({ shortUrl: customShortUrl });
            if (existingCustomUrl) {
                throw new AppError('Custom short URL already exists', HTTP_STATUS.CONFLICT);
            }
        }

        // Create new URL
        const newUrl = new Url({
            originalUrl,
            shortUrl,
            expirationDate: calculateExpirationDate(),
            isActive: true
        });

        await newUrl.save();
        return { url: newUrl, isNew: true };
    }

    /**
     * Generate a unique short URL with collision checking
     */
    static async generateUniqueShortUrl(maxAttempts = 10) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const shortUrl = generateSecureId();
            const existingUrl = await Url.findOne({ shortUrl });

            if (!existingUrl) {
                return shortUrl;
            }
        }

        throw new AppError('Unable to generate unique short URL', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    /**
     * Get URLs with filtering and pagination
     */
    static async getUrlsWithPagination(options = {}) {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            includeExpired = false,
            search = ''
        } = options;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter = {};

        if (!includeExpired) {
            filter.$or = [
                { expirationDate: null },
                { expirationDate: { $gt: new Date() } }
            ];
            filter.isActive = true;
        }

        if (search) {
            filter.$or = [
                { originalUrl: { $regex: search, $options: 'i' } },
                { shortUrl: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute queries
        const [urls, totalCount] = await Promise.all([
            Url.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Url.countDocuments(filter)
        ]);

        return {
            urls,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
                totalCount,
                hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
                hasPrevPage: pageNum > 1,
                limit: limitNum
            }
        };
    }

    /**
     * Get URL analytics and statistics
     */
    static async getUrlAnalytics(shortUrl) {
        const url = await Url.findOne({ shortUrl });

        if (!url) {
            throw new AppError(ERROR_MESSAGES.URL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        return {
            shortUrl: url.shortUrl,
            originalUrl: url.originalUrl,
            totalClicks: url.clicks,
            createdAt: url.createdAt,
            lastAccessedAt: url.lastAccessedAt,
            isActive: url.isActive,
            isExpired: isExpired(url.expirationDate),
            expirationDate: url.expirationDate,
            daysUntilExpiration: url.expirationDate ?
                Math.ceil((url.expirationDate - new Date()) / (1000 * 60 * 60 * 24)) : null
        };
    }

    /**
     * Clean up expired URLs
     */
    static async cleanupExpiredUrls() {
        const result = await Url.updateMany(
            {
                expirationDate: { $lt: new Date() },
                isActive: true
            },
            {
                $set: { isActive: false }
            }
        );

        return result.modifiedCount;
    }

    /**
     * Get system statistics
     */
    static async getSystemStats() {
        const [
            totalUrls,
            activeUrls,
            expiredUrls,
            totalClicks,
            urlsCreatedToday
        ] = await Promise.all([
            Url.countDocuments(),
            Url.countDocuments({ isActive: true }),
            Url.countDocuments({
                expirationDate: { $lt: new Date() },
                isActive: false
            }),
            Url.aggregate([
                { $group: { _id: null, total: { $sum: '$clicks' } } }
            ]),
            Url.countDocuments({
                createdAt: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            })
        ]);

        return {
            totalUrls,
            activeUrls,
            expiredUrls,
            totalClicks: totalClicks[0]?.total || 0,
            urlsCreatedToday
        };
    }
}

module.exports = UrlService;
