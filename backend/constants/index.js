// HTTP Status Codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
    INVALID_URL: 'Please provide a valid URL',
    URL_NOT_FOUND: 'URL not found or expired',
    URL_EXPIRED: 'URL has expired',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    URL_ALREADY_EXISTS: 'URL already exists',
    REQUIRED_FIELD: 'This field is required'
};

// Success Messages
const SUCCESS_MESSAGES = {
    URL_CREATED: 'Short URL created successfully',
    URL_DELETED: 'URL deleted successfully',
    URL_RETRIEVED: 'URL retrieved successfully'
};

// URL Configuration
const URL_CONFIG = {
    MIN_LENGTH: 3,
    MAX_LENGTH: 2048,
    ALLOWED_PROTOCOLS: ['http:', 'https:']
};

module.exports = {
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    URL_CONFIG
};
