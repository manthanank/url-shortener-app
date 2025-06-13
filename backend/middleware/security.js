const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const config = require('../config/environment');

// Rate limiting
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Security middleware
const securityMiddleware = [
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    }),
    compression(),
    cors({
        origin: config.cors.origin,
        credentials: config.cors.credentials,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
];

// Rate limiters for different endpoints
const generalLimiter = createRateLimiter(
    parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
);

const shortenLimiter = createRateLimiter(
    parseInt(process.env.SHORTEN_RATE_LIMIT_WINDOW_MS) || 60 * 1000,
    parseInt(process.env.SHORTEN_RATE_LIMIT_MAX_REQUESTS) || 10
);

module.exports = {
    securityMiddleware,
    generalLimiter,
    shortenLimiter
};
