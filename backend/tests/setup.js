// Test setup file
process.env.NODE_ENV = 'test';
process.env.PORT = '5001'; // Use different port for testing
process.env.MONGODB_USER = 'test_user';
process.env.MONGODB_PASSWORD = 'test_password';

// Suppress console.log during tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};
