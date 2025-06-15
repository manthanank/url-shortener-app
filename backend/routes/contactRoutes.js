const express = require('express');
const rateLimit = require('express-rate-limit');
const {
    submitContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    getContactStats
} = require('../controllers/contactController');
const { validateContact } = require('../middleware/validation');

const router = express.Router();

// Rate limiting for contact submissions
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 contact submissions per windowMs
    message: {
        success: false,
        message: 'Too many contact submissions from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Full name of the person
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *           example: "john.doe@example.com"
 *         message:
 *           type: string
 *           minLength: 10
 *           maxLength: 1000
 *           description: Message content
 *           example: "I would like to inquire about your services..."
 *
 *     Contact:
 *       allOf:
 *         - $ref: '#/components/schemas/ContactRequest'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Unique contact identifier
 *             status:
 *               type: string
 *               enum: [new, read, replied]
 *               description: Contact status
 *               example: "new"
 *             adminNotes:
 *               type: string
 *               maxLength: 500
 *               description: Admin notes about the contact
 *             ip:
 *               type: string
 *               description: IP address of the submitter
 *             userAgent:
 *               type: string
 *               description: User agent string
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Creation timestamp
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Last update timestamp
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Submit a contact message
 *     description: Submit a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactRequest'
 *     responses:
 *       201:
 *         description: Contact message submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                         contactId:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', contactLimiter, validateContact, submitContact);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contacts (Admin only)
 *     description: Retrieve all contact messages with pagination and filtering
 *     tags: [Contact, Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of contacts per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied]
 *         description: Filter by contact status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, email, or message
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         contacts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Contact'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             current:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', getAllContacts);

/**
 * @swagger
 * /api/contacts/stats:
 *   get:
 *     summary: Get contact statistics (Admin only)
 *     description: Get statistics about contacts grouped by status
 *     tags: [Contact, Admin]
 *     responses:
 *       200:
 *         description: Contact statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         byStatus:
 *                           type: object
 *                           properties:
 *                             new:
 *                               type: integer
 *                             read:
 *                               type: integer
 *                             replied:
 *                               type: integer
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/stats', getContactStats);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact by ID (Admin only)
 *     description: Retrieve a specific contact message by ID
 *     tags: [Contact, Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         contact:
 *                           $ref: '#/components/schemas/Contact'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', getContactById);

/**
 * @swagger
 * /api/contacts/{id}:
 *   patch:
 *     summary: Update contact status (Admin only)
 *     description: Update the status and admin notes of a contact
 *     tags: [Contact, Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, read, replied]
 *                 description: New status for the contact
 *               adminNotes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Admin notes about the contact
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                         contact:
 *                           $ref: '#/components/schemas/Contact'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch('/:id', updateContactStatus);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete contact (Admin only)
 *     description: Delete a contact message
 *     tags: [Contact, Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', deleteContact);

module.exports = router;
