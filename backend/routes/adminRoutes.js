const express = require('express');
const UrlService = require('../services/urlService');
const SchedulerService = require('../services/schedulerService');
const emailService = require('../services/emailService');
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

/**
 * @swagger
 * /admin/email/test:
 *   post:
 *     summary: Send a test email
 *     description: Sends a test email to the configured admin email address
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: string
 *                       example: 'Test email sent successfully'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * Send a test email
 */
router.post('/email/test', async (req, res, next) => {
    try {
        await emailService.sendTestEmail();
        ApiResponse.success('Test email sent successfully').send(res);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /admin/test-email:
 *   post:
 *     summary: Test email functionality
 *     description: Test email configuration and send a test email
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Email test completed
 */
router.post('/test-email', async (req, res, next) => {
    try {
        const testResult = await emailService.testConnection();

        if (testResult.success) {
            // Send a test email
            const testContact = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message to verify email functionality.',
                ip: '127.0.0.1',
                userAgent: 'Test Agent',
                _id: 'test_id_' + Date.now()
            };

            const notificationSent = await emailService.sendContactNotification(testContact);

            ApiResponse.success('Email test completed', {
                connection: testResult,
                notificationSent,
                message: notificationSent ? 'Test email sent successfully' : 'Email connection works but notification failed'
            }).send(res);
        } else {
            ApiResponse.error('Email connection failed', 500, [testResult.message]).send(res);
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
