const mongoose = require('mongoose');
const { URL_CONFIG } = require('../constants');

const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: [true, 'Original URL is required'],
        trim: true,
        minlength: [URL_CONFIG.MIN_LENGTH, `URL must be at least ${URL_CONFIG.MIN_LENGTH} characters long`],
        maxlength: [URL_CONFIG.MAX_LENGTH, `URL must not exceed ${URL_CONFIG.MAX_LENGTH} characters`],
        validate: {
            validator: function(url) {
                try {
                    const urlObj = new URL(url);
                    return URL_CONFIG.ALLOWED_PROTOCOLS.includes(urlObj.protocol);
                } catch {
                    return false;
                }
            },
            message: 'Please provide a valid URL with http or https protocol'
        }
    },    shortUrl: {
        type: String,
        required: [true, 'Short URL is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Short URL must be at least 3 characters long'],
        maxlength: [20, 'Short URL must not exceed 20 characters'],
        match: [/^[a-zA-Z0-9]+$/, 'Short URL must contain only letters and numbers']
    },
    clicks: {
        type: Number,
        default: 0,
        min: [0, 'Clicks cannot be negative']
    },
    expirationDate: {
        type: Date,
        validate: {
            validator: function(date) {
                return !date || date > new Date();
            },
            message: 'Expiration date must be in the future'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String,
        default: 'anonymous'
    },
    lastAccessedAt: {
        type: Date
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [20, 'Tag must not exceed 20 characters']
    }]
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Index for better query performance (removed duplicate shortUrl index)
urlSchema.index({ originalUrl: 1 });
urlSchema.index({ expirationDate: 1 });
urlSchema.index({ createdAt: -1 });

// Virtual for checking if URL is expired
urlSchema.virtual('isExpired').get(function() {
    return this.expirationDate && this.expirationDate < new Date();
});

// Instance method to increment clicks
urlSchema.methods.incrementClicks = function() {
    this.clicks += 1;
    this.lastAccessedAt = new Date();
    return this.save();
};

// Static method to find active URLs
urlSchema.statics.findActive = function() {
    return this.find({
        isActive: true,
        $or: [
            { expirationDate: null },
            { expirationDate: { $gt: new Date() } }
        ]
    });
};

// Pre-save middleware to ensure URL format
urlSchema.pre('save', function(next) {
    if (this.isModified('originalUrl') && !this.originalUrl.match(/^https?:\/\//)) {
        this.originalUrl = `https://${this.originalUrl}`;
    }
    next();
});

module.exports = mongoose.model('Url', urlSchema);
