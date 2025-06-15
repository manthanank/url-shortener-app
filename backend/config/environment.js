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
        defaultExpirationDays: parseInt(process.env.DEFAULT_EXPIRATION_DAYS) || 7,
        // Base URL for generating short URLs
        baseUrl: process.env.BASE_URL || (process.env.NODE_ENV === 'production'
            ? 'https://url-shortener-app-nrnh.vercel.app'
            : 'http://localhost:3000')
    },

    frontend: {
        url: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production'
            ? 'https://shortener-url-app.vercel.app'
            : 'http://localhost:4200')
    },

    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true' || false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER
    }
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_USER', 'MONGODB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    if (config.nodeEnv === 'production') {
        process.exit(1);
    } else {
        console.warn('⚠️  Continuing in development mode without database connection');
    }
}

module.exports = config;
