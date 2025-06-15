const joi = require('joi');
const { HTTP_STATUS, ERROR_MESSAGES, URL_CONFIG } = require('../constants');

const urlSchema = joi.object({
    originalUrl: joi.string()
        .uri({
            scheme: ['http', 'https']
        })
        .min(URL_CONFIG.MIN_LENGTH)
        .max(URL_CONFIG.MAX_LENGTH)
        .required()
        .messages({
            'string.empty': ERROR_MESSAGES.REQUIRED_FIELD,
            'string.uri': ERROR_MESSAGES.INVALID_URL,
            'string.min': `URL must be at least ${URL_CONFIG.MIN_LENGTH} characters long`,
            'string.max': `URL must not exceed ${URL_CONFIG.MAX_LENGTH} characters`,
            'any.required': ERROR_MESSAGES.REQUIRED_FIELD
        }),

    customShortUrl: joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .optional()
        .messages({
            'string.alphanum': 'Custom short URL must contain only letters and numbers',
            'string.min': 'Custom short URL must be at least 3 characters long',
            'string.max': 'Custom short URL must not exceed 20 characters'
        })
});

const contactSchema = joi.object({
    name: joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),

    email: joi.string()
        .email()
        .trim()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    message: joi.string()
        .trim()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.empty': 'Message is required',
            'string.min': 'Message must be at least 10 characters long',
            'string.max': 'Message cannot exceed 1000 characters',
            'any.required': 'Message is required'
        })
});

const validateCreateUrl = (req, res, next) => {
    const { error, value } = urlSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: ERROR_MESSAGES.VALIDATION_ERROR,
            errors
        });
    }

    req.validatedData = value;
    next();
};

const validateShortUrl = (req, res, next) => {
    const { shortUrl } = req.params;

    if (!shortUrl || shortUrl.length < 3) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Invalid short URL format'
        });
    }

    next();
};

const validateContact = (req, res, next) => {
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    req.validatedData = value;
    next();
};

module.exports = {
    validateCreateUrl,
    validateShortUrl,
    validateContact
};
