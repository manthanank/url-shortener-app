const Contact = require('../models/contactModel');
const emailService = require('../services/emailService');

/**
 * Submit a new contact message
 */
const submitContact = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        // Get client information
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        // Create new contact
        const contact = new Contact({
            name,
            email,
            message,
            ip,
            userAgent
        });

        await contact.save();

        // Send email notifications
        try {
            // Send notification to admin
            await emailService.sendContactNotification(contact);

            // Send auto-reply to user
            await emailService.sendAutoReply(contact);
        } catch (emailError) {
            // Log email error but don't fail the contact submission
            // eslint-disable-next-line no-console
            console.error('Email notification failed:', emailError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            data: {
                message: 'Thank you for your message! We will get back to you soon.',
                contactId: contact._id
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
                timestamp: new Date().toISOString()
            });
        }
        next(error);
    }
};

/**
 * Get all contacts (Admin only)
 */
const getAllContacts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;

        // Build query
        const query = {};
        if (status && ['new', 'read', 'replied'].includes(status)) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        const total = await Contact.countDocuments(query);

        res.json({
            success: true,
            data: {
                contacts,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                    limit
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get contact by ID (Admin only)
 */
const getContactById = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id).select('-__v');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            data: { contact },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID',
                timestamp: new Date().toISOString()
            });
        }
        next(error);
    }
};

/**
 * Update contact status (Admin only)
 */
const updateContactStatus = async (req, res, next) => {
    try {
        const { status, adminNotes } = req.body;
        const contactId = req.params.id;

        if (!['new', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: new, read, or replied',
                timestamp: new Date().toISOString()
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            contactId,
            { status, adminNotes },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: {
                message: 'Contact updated successfully',
                contact
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID',
                timestamp: new Date().toISOString()
            });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
                timestamp: new Date().toISOString()
            });
        }
        next(error);
    }
};

/**
 * Delete contact (Admin only)
 */
const deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: 'Contact deleted successfully',
            data: {
                message: 'Contact deleted successfully'
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact ID',
                timestamp: new Date().toISOString()
            });
        }
        next(error);
    }
};

/**
 * Get contact statistics (Admin only)
 */
const getContactStats = async (req, res, next) => {
    try {
        const stats = await Contact.getStats();
        const total = await Contact.countDocuments();

        const statusStats = {
            new: 0,
            read: 0,
            replied: 0
        };

        stats.forEach(stat => {
            statusStats[stat._id] = stat.count;
        });

        res.json({
            success: true,
            data: {
                total,
                byStatus: statusStats
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    getContactStats
};
