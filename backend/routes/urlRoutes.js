const express = require('express');
const {
    createShortUrl,
    getUrls,
    getDetails,
    deleteUrl,
    getAnalytics
} = require('../controllers/urlController');
const { validateCreateUrl, validateShortUrl } = require('../middleware/validation');
const { shortenLimiter, generalLimiter } = require('../middleware/security');

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// URL shortening routes

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     description: Create a new short URL from an original URL
 *     tags: [URL Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateURLRequest'
 *           examples:
 *             basic:
 *               summary: Basic URL shortening
 *               value:
 *                 originalUrl: "https://example.com/very/long/url/path"
 *             custom:
 *               summary: Custom short URL
 *               value:
 *                 originalUrl: "https://example.com/very/long/url/path"
 *                 customShortUrl: "my-link"
 *     responses:
 *       201:
 *         description: URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/URL'
 *       200:
 *         description: URL already exists
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/URL'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/shorten', shortenLimiter, validateCreateUrl, createShortUrl);

/**
 * @swagger
 * /api/urls:
 *   get:
 *     summary: Get all URLs
 *     description: Retrieve all URLs with pagination and filtering options
 *     tags: [URL Management]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, clicks, originalUrl, shortUrl]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: includeExpired
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include expired URLs
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in URLs
 *     responses:
 *       200:
 *         description: URLs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         urls:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/URL'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
// URL management routes
router.get('/urls', getUrls);

/**
 * @swagger
 * /api/details/{shortUrl}:
 *   get:
 *     summary: Get URL details
 *     description: Get detailed information about a specific short URL
 *     tags: [URL Management]
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: The short URL identifier
 *         example: abc123
 *     responses:
 *       200:
 *         description: URL details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/URL'
 *                         - type: object
 *                           properties:
 *                             isExpired:
 *                               type: boolean
 *                             daysUntilExpiration:
 *                               type: integer
 *                               nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/details/:shortUrl', validateShortUrl, getDetails);

/**
 * @swagger
 * /api/analytics/{shortUrl}:
 *   get:
 *     summary: Get URL analytics
 *     description: Get analytics and statistics for a specific short URL
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: The short URL identifier
 *         example: abc123
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         shortUrl:
 *                           type: string
 *                         originalUrl:
 *                           type: string
 *                         totalClicks:
 *                           type: integer
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         lastAccessedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         isActive:
 *                           type: boolean
 *                         isExpired:
 *                           type: boolean
 *                         expirationDate:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         daysUntilExpiration:
 *                           type: integer
 *                           nullable: true
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/analytics/:shortUrl', validateShortUrl, getAnalytics);

/**
 * @swagger
 * /api/delete/{shortUrl}:
 *   delete:
 *     summary: Delete URL
 *     description: Delete a short URL
 *     tags: [URL Management]
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *         description: The short URL identifier
 *         example: abc123
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         shortUrl:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/delete/:shortUrl', validateShortUrl, deleteUrl);

module.exports = router;
