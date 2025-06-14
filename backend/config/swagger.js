const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./environment');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener API',
            version: '2.0.0',
            description: 'A robust URL shortener service with analytics and management features',
            license: {
                name: 'ISC',
            },
            contact: {
                name: 'API Support',
                email: 'manthan.ank46@gmail.com',
            },
        },
        servers: [
            {
                url: config.nodeEnv === 'production'
                    ? 'https://your-domain.vercel.app'
                    : `http://localhost:${config.port}`,
                description: config.nodeEnv === 'production' ? 'Production server' : 'Development server',
            },
        ],
        components: {
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the request was successful'
                        },
                        message: {
                            type: 'string',
                            description: 'Response message'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data (varies by endpoint)'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Response timestamp'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Detailed error messages'
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                URL: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier'
                        },
                        originalUrl: {
                            type: 'string',
                            format: 'uri',
                            description: 'The original long URL'
                        },
                        shortUrl: {
                            type: 'string',
                            description: 'The generated short URL identifier'
                        },
                        clicks: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Number of times the URL has been accessed'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Whether the URL is currently active'
                        },
                        expirationDate: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            description: 'When the URL expires (null for no expiration)'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When the URL was created'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When the URL was last updated'
                        },
                        lastAccessedAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            description: 'When the URL was last accessed'
                        }
                    }
                },
                CreateURLRequest: {
                    type: 'object',
                    required: ['originalUrl'],
                    properties: {
                        originalUrl: {
                            type: 'string',
                            format: 'uri',
                            description: 'The URL to shorten',
                            example: 'https://example.com/very/long/url/path'
                        },
                        customShortUrl: {
                            type: 'string',
                            pattern: '^[a-zA-Z0-9]+$',
                            minLength: 3,
                            maxLength: 20,
                            description: 'Custom short URL identifier (optional)',
                            example: 'my-link'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        currentPage: {
                            type: 'integer',
                            minimum: 1
                        },
                        totalPages: {
                            type: 'integer',
                            minimum: 0
                        },
                        totalCount: {
                            type: 'integer',
                            minimum: 0
                        },
                        hasNextPage: {
                            type: 'boolean'
                        },
                        hasPrevPage: {
                            type: 'boolean'
                        },
                        limit: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 50
                        }
                    }
                },
                SystemStats: {
                    type: 'object',
                    properties: {
                        totalUrls: {
                            type: 'integer',
                            description: 'Total number of URLs in the system'
                        },
                        activeUrls: {
                            type: 'integer',
                            description: 'Number of active URLs'
                        },
                        expiredUrls: {
                            type: 'integer',
                            description: 'Number of expired URLs'
                        },
                        totalClicks: {
                            type: 'integer',
                            description: 'Total clicks across all URLs'
                        },
                        urlsCreatedToday: {
                            type: 'integer',
                            description: 'URLs created today'
                        }
                    }
                }
            },
            responses: {
                BadRequest: {
                    description: 'Bad request - Invalid input data',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                Conflict: {
                    description: 'Resource already exists',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                TooManyRequests: {
                    description: 'Rate limit exceeded',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse'
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'URL Management',
                description: 'Operations for creating, retrieving, and managing URLs'
            },
            {
                name: 'Analytics',
                description: 'URL analytics and statistics'
            },
            {
                name: 'Admin',
                description: 'Administrative operations'
            },
            {
                name: 'System',
                description: 'System health and status endpoints'
            }
        ]
    },
    apis: ['./routes/*.js', './controllers/*.js', './index.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};
