const cron = require('node-cron');
const UrlService = require('../services/urlService');

class SchedulerService {
    static init() {
        // Run cleanup every day at 2 AM
        cron.schedule('0 2 * * *', async () => {
            try {
                console.log('🧹 Starting scheduled cleanup of expired URLs...');
                const cleanedCount = await UrlService.cleanupExpiredUrls();
                console.log(`✅ Cleanup completed. Deactivated ${cleanedCount} expired URLs.`);
            } catch (error) {
                console.error('❌ Error during scheduled cleanup:', error);
            }
        });

        // Log system stats every hour (optional, for monitoring)
        cron.schedule('0 * * * *', async () => {
            try {
                const stats = await UrlService.getSystemStats();
                console.log('📊 System Stats:', {
                    totalUrls: stats.totalUrls,
                    activeUrls: stats.activeUrls,
                    totalClicks: stats.totalClicks,
                    urlsCreatedToday: stats.urlsCreatedToday
                });
            } catch (error) {
                console.error('❌ Error getting system stats:', error);
            }
        });

        console.log('⏰ Scheduler service initialized');
    }

    static async runCleanupNow() {
        try {
            console.log('🧹 Manual cleanup initiated...');
            const cleanedCount = await UrlService.cleanupExpiredUrls();
            console.log(`✅ Manual cleanup completed. Deactivated ${cleanedCount} expired URLs.`);
            return cleanedCount;
        } catch (error) {
            console.error('❌ Error during manual cleanup:', error);
            throw error;
        }
    }
}

module.exports = SchedulerService;
