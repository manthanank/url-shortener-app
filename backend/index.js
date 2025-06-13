const express = require('express');
const connectDatabase = require('./config/database');
const urlRoutes = require('./routes/urlRoutes');
const adminRoutes = require('./routes/adminRoutes');
const SchedulerService = require('./services/schedulerService');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { securityMiddleware } = require('./middleware/security');
const { swaggerUi, specs } = require('./config/swagger');
const config = require('./config/environment');

const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(securityMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database
connectDatabase();

// Initialize scheduler for cleanup tasks
if (config.nodeEnv === 'production') {
    SchedulerService.init();
}

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'URL Shortener API Documentation'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     description: Check if the API is running
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running successfully
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
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                         environment:
 *                           type: string
 */
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'URL Shortener API is running',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// API routes
app.use('/api', urlRoutes);
app.use('/admin', adminRoutes);

// Handle favicon and common static files
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/robots.txt', (req, res) => res.status(404).end());
app.get('/manifest.json', (req, res) => res.status(404).end());

/**
 * @swagger
 * /:
 *   get:
 *     summary: API welcome message
 *     description: Get welcome message and API information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Welcome message with API information
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
 *                         version:
 *                           type: string
 *                         documentation:
 *                           type: string
 */
// Root endpoint
app.get('/', (req, res) => {    res.status(200).json({
    success: true,
    message: 'Welcome to URL Shortener API',
    version: '2.0.0',
    documentation: '/api-docs'
});
});

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).send(); // No Content
});

// Handle robots.txt
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow:');
});

// Handle common static file requests that might cause 404s
app.get('/manifest.json', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Manifest not available'
    });
});

// Handle 404 for unknown routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
