const nodemailer = require('nodemailer');
const config = require('../config/environment');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    initializeTransporter() {
        try {
            // Only initialize if email credentials are provided
            if (!config.email.auth.user || !config.email.auth.pass) {
                // eslint-disable-next-line no-console
                console.warn('⚠️  Email credentials not provided. Email notifications will be disabled.');
                return;
            }

            this.transporter = nodemailer.createTransport({
                service: config.email.service,
                host: config.email.host,
                port: config.email.port,
                secure: config.email.secure,
                auth: {
                    user: config.email.auth.user,
                    pass: config.email.auth.pass
                }
            });

            // Verify connection
            this.transporter.verify((error, _success) => {
                if (error) {
                    // eslint-disable-next-line no-console
                    console.error('❌ Email service initialization failed:', error.message);
                } else {
                    // eslint-disable-next-line no-console
                    console.log('✅ Email service initialized successfully');
                }
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Failed to initialize email service:', error.message);
        }
    }

    async sendContactNotification(contactData) {
        if (!this.transporter) {
            // eslint-disable-next-line no-console
            console.warn('⚠️  Email service not available. Skipping notification.');
            return false;
        }

        try {
            const { name, email, message, ip, userAgent, _id } = contactData;

            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #495057; margin-top: 0;">Contact Details</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Contact ID:</strong> ${_id}</p>
                    </div>

                    <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #495057; margin-top: 0;">Message</h3>
                        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                    </div>

                    <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h4 style="color: #6c757d; margin-top: 0;">Technical Information</h4>
                        <p><strong>IP Address:</strong> ${ip}</p>
                        <p><strong>User Agent:</strong> ${userAgent}</p>
                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
                        <p>This notification was sent automatically from your URL Shortener application.</p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: config.email.from,
                to: config.email.to,
                subject: `New Contact Form Submission from ${name}`,
                html: htmlContent,
                text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Contact ID: ${_id}

Message:
${message}

Technical Information:
IP: ${ip}
User Agent: ${userAgent}
Submitted: ${new Date().toLocaleString()}
                `.trim()
            };

            const result = await this.transporter.sendMail(mailOptions);
            // eslint-disable-next-line no-console
            console.log('✅ Contact notification email sent successfully:', result.messageId);
            return true;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Failed to send contact notification email:', error.message);
            return false;
        }
    }

    async sendAutoReply(contactData) {
        if (!this.transporter) {
            return false;
        }

        try {
            const { name, email } = contactData;

            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Thank You for Contacting Us!</h2>

                    <p>Dear ${name},</p>

                    <p>Thank you for reaching out to us through our URL Shortener application. We have received your message and will get back to you as soon as possible.</p>

                    <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Our team will review your message within 24 hours</li>
                            <li>You will receive a response at this email address: ${email}</li>
                            <li>For urgent matters, please include "URGENT" in your subject line</li>
                        </ul>
                    </div>

                    <p>If you have any additional questions or need immediate assistance, please don't hesitate to contact us again.</p>

                    <p>Best regards,<br>
                    The URL Shortener Team</p>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
                        <p>This is an automated response. Please do not reply to this email.</p>
                    </div>
                </div>
            `;

            const mailOptions = {
                from: config.email.from,
                to: email,
                subject: 'Thank you for contacting us - URL Shortener',
                html: htmlContent,
                text: `
Dear ${name},

Thank you for reaching out to us through our URL Shortener application. We have received your message and will get back to you as soon as possible.

What happens next?
- Our team will review your message within 24 hours
- You will receive a response at this email address: ${email}
- For urgent matters, please include "URGENT" in your subject line

If you have any additional questions or need immediate assistance, please don't hesitate to contact us again.

Best regards,
The URL Shortener Team

This is an automated response. Please do not reply to this email.
                `.trim()
            };

            const result = await this.transporter.sendMail(mailOptions);
            // eslint-disable-next-line no-console
            console.log('✅ Auto-reply email sent successfully:', result.messageId);
            return true;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('❌ Failed to send auto-reply email:', error.message);
            return false;
        }
    }

    // Test email connectivity
    async testConnection() {
        if (!this.transporter) {
            return { success: false, message: 'Email service not initialized' };
        }

        try {
            await this.transporter.verify();
            return { success: true, message: 'Email service is working correctly' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

module.exports = new EmailService();
