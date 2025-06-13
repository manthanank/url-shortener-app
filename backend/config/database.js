const mongoose = require('mongoose');
const config = require('./environment');

const connectDatabase = async () => {
    try {
        const connectionString = `mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.cluster}.mongodb.net/${config.mongodb.database}`;

        await mongoose.connect(connectionString, {
            // Removed deprecated options
        });

        console.log('✅ Connected to MongoDB database successfully!');    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('⚠️  Server will continue without database connection for testing purposes');
        // Don't exit the process, allow server to start for API testing
        // process.exit(1);
    }
};

// Handle database connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = connectDatabase;
