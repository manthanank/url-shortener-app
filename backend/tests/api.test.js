const request = require('supertest');
const app = require('../index');
const Url = require('../models/urlModel');

// Mock the database connection
jest.mock('../config/database', () => jest.fn());

describe('URL Shortener API', () => {
    describe('GET /health', () => {
        test('should return health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'URL Shortener API is running');
        });
    });

    describe('GET /', () => {
        test('should return welcome message', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message', 'Welcome to URL Shortener API');
        });
    });

    describe('POST /api/shorten', () => {
        test('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        test('should validate URL format', async () => {
            const response = await request(app)
                .post('/api/shorten')
                .send({ originalUrl: 'invalid-url' })
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('GET /api/urls', () => {
        test('should return paginated URLs', async () => {
            // Mock Url.find and Url.countDocuments
            jest.spyOn(Url, 'find').mockReturnValue({
                sort: jest.fn().mockReturnValue({
                    skip: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            lean: jest.fn().mockResolvedValue([])
                        })
                    })
                })
            });
            jest.spyOn(Url, 'countDocuments').mockResolvedValue(0);

            const response = await request(app)
                .get('/api/urls')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('pagination');
        });
    });
});

// Clean up after tests
afterAll(async () => {
    // Close any open handles
    jest.clearAllMocks();
});
