require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    mongodb: {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
        cluster: process.env.MONGODB_CLUSTER || 'cluster0.re3ha3x',
        database: process.env.MONGODB_DATABASE || 'url-shortener-app'
    },

    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: process.env.CORS_CREDENTIALS === 'true' || false
    },

    url: {
        shortUrlLength: parseInt(process.env.SHORT_URL_LENGTH) || 6,
        defaultExpirationDays: parseInt(process.env.DEFAULT_EXPIRATION_DAYS) || 7
    }
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_USER', 'MONGODB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

module.exports = config;
