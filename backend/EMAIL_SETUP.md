# Email Notifications Setup

This document explains how to set up email notifications for the URL Shortener application.

## Overview

When users submit the contact form, the system will:

1. Send a notification email to the admin
2. Send an auto-reply confirmation email to the user

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
ADMIN_EMAIL=admin@example.com
```

### Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Use this app password as `EMAIL_PASSWORD`

### Other Email Providers

#### Outlook/Hotmail

```bash
EMAIL_SERVICE=hotmail
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Yahoo

```bash
EMAIL_SERVICE=yahoo
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Custom SMTP

```bash
EMAIL_SERVICE=
EMAIL_HOST=your.smtp.server.com
EMAIL_PORT=587
EMAIL_SECURE=true
```

## Features

### Admin Notification Email

When a user submits a contact form, the admin receives:

- Contact details (name, email, message)
- Technical information (IP, User Agent, timestamp)
- Contact ID for reference
- Formatted HTML email with professional styling

### User Auto-Reply

Users automatically receive:

- Confirmation that their message was received
- Expected response timeframe
- Professional auto-reply message
- Instructions for urgent matters

## Testing

### Test Email Functionality

Use the admin endpoint to test email configuration:

```bash
POST /admin/test-email
```

This will:

1. Verify email connection
2. Send a test notification email
3. Return status of both operations

### Sample Response

```json
{
  "success": true,
  "message": "Email test completed",
  "data": {
    "connection": {
      "success": true,
      "message": "Email service is working correctly"
    },
    "notificationSent": true,
    "message": "Test email sent successfully"
  }
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify email credentials
   - For Gmail, ensure you're using an App Password, not your regular password
   - Check 2-factor authentication is enabled

2. **Connection Timeout**
   - Verify SMTP server settings
   - Check firewall/network restrictions
   - Try different port (25, 465, 587)

3. **Email Not Received**
   - Check spam/junk folders
   - Verify EMAIL_FROM and ADMIN_EMAIL addresses
   - Test with admin endpoint first

### Debug Mode

The application logs email operations:

- ✅ Successful operations
- ❌ Error messages
- ⚠️ Warning messages (when email is disabled)

### Graceful Degradation

If email configuration is missing or invalid:

- Contact form submission still works
- Warning message is logged
- Application continues normally
- No error is shown to users

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **App Passwords**: Use app-specific passwords instead of account passwords
3. **SMTP over TLS**: Enable secure connections when possible
4. **Rate Limiting**: Email sending is subject to application rate limits

## Production Deployment

For production environments:

1. Use environment-specific email addresses
2. Set up proper DNS records (SPF, DKIM) for your domain
3. Consider using dedicated email services (SendGrid, Mailgun, etc.)
4. Monitor email delivery rates and bounces
5. Set up proper error alerting for email failures

## Dependencies

- `nodemailer`: Email sending library
- Environment configuration through `dotenv`

The email service is automatically initialized when the application starts and will log its status to the console.
