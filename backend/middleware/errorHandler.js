const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

const errorHandler = (err, req, res, _next) => {
    // Don't log common 404 errors to reduce console noise
    const commonStaticFiles = ['/favicon.ico', '/robots.txt', '/manifest.json', '/apple-touch-icon.png'];
    const isCommon404 = err.statusCode === 404 && commonStaticFiles.some(file => req.originalUrl.includes(file));

    if (!isCommon404) {
        console.error('❌ Error:', err);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.VALIDATION_ERROR,
            errors
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: `${field} already exists`
        });
    }

    // Mongoose CastError
    if (err.name === 'CastError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Invalid resource ID'
        });
    }

    // Default error
    res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || ERROR_MESSAGES.SERVER_ERROR
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};
