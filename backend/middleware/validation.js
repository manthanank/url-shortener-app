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

module.exports = {
    validateCreateUrl,
    validateShortUrl
};
