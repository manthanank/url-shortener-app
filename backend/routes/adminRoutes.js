const express = require('express');
const UrlService = require('../services/urlService');
const SchedulerService = require('../services/schedulerService');
const { ApiResponse } = require('../utils/response');
const { generalLimiter } = require('../middleware/security');

const router = express.Router();

// Apply rate limiting
router.use(generalLimiter);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get system statistics
 *     description: Get system-wide statistics and metrics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: System statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SystemStats'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * Get system statistics
 */
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await UrlService.getSystemStats();
        ApiResponse.success('System statistics retrieved successfully', stats).send(res);
    } catch (error) {
        next(error);
    }
});

/**
 * Manual cleanup of expired URLs
 */
router.post('/cleanup', async (req, res, next) => {
    try {
        const cleanedCount = await SchedulerService.runCleanupNow();
        ApiResponse.success(
            'Cleanup completed successfully',
            { cleanedCount }
        ).send(res);
    } catch (error) {
        next(error);
    }
});

/**
 * Health check with detailed information
 */
router.get('/health', async (req, res, next) => {
    try {
        const stats = await UrlService.getSystemStats();
        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            stats
        };

        ApiResponse.success('System health check', healthData).send(res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
