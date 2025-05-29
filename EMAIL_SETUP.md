# Email Setup Guide

This guide explains how to set up email functionality for the contact form using Resend.

## Overview

The contact form now sends actual emails using [Resend](https://resend.com), a modern email API service. When users submit the contact form:

1. An email is sent to `support@resume-roaster.xyz` with the user's message
2. A confirmation email is sent to the user acknowledging their submission

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for an account
2. Verify your email address
3. Complete the onboarding process

### 2. Get Your API Key

1. In your Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name like "Resume Roaster Contact Form"
4. Select the appropriate permissions (Send emails)
5. Copy the generated API key

### 3. Configure Domain (Optional but Recommended)

For production, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `resume-roaster.xyz`)
4. Follow the DNS verification steps
5. Once verified, you can send emails from `noreply@resume-roaster.xyz`

### 4. Update Environment Variables

Add your Resend API key to your environment file:

```bash
# In .env.local
RESEND_API_KEY=re_your_actual_api_key_here
```

### 5. Update Email Addresses (if needed)

If you want to change the email addresses, update them in `src/app/api/contact/route.ts`:

```typescript
// Send email to support
const { data, error } = await resend.emails.send({
  from: 'Contact Form <noreply@your-domain.com>',
  to: ['your-support-email@your-domain.com'],
  // ... rest of the configuration
})
```

## Testing

### Local Development

1. Make sure you have the `RESEND_API_KEY` in your `.env.local` file
2. Start your development server: `npm run dev`
3. Go to `/contact` and submit a test message
4. Check your email for both the support notification and user confirmation

### Production

1. Add the `RESEND_API_KEY` to your production environment variables
2. If using Vercel, add it in your project settings under Environment Variables
3. Deploy your changes
4. Test the contact form on your live site

## Email Templates

The system sends two types of emails:

### 1. Support Notification Email
- **To**: `support@resume-roaster.xyz`
- **Subject**: `Contact Form: [User's Subject]`
- **Content**: Formatted message with user details
- **Reply-To**: User's email address

### 2. User Confirmation Email
- **To**: User's email address
- **Subject**: `Thank you for contacting Resume Roaster`
- **Content**: Confirmation message with next steps

## Troubleshooting

### Common Issues

1. **"Email service not configured" error**
   - Make sure `RESEND_API_KEY` is set in your environment variables
   - Restart your development server after adding the key

2. **Emails not being delivered**
   - Check your Resend dashboard for delivery status
   - Verify your domain if using a custom domain
   - Check spam folders

3. **"Failed to send email" error**
   - Check the server logs for detailed error messages
   - Verify your API key is correct and has the right permissions
   - Check your Resend account limits

### Rate Limits

Resend has the following limits:
- **Free tier**: 100 emails/day, 3,000 emails/month
- **Pro tier**: Higher limits available

Monitor your usage in the Resend dashboard.

## Security Notes

- Never commit your actual API key to version control
- Use environment variables for all sensitive configuration
- The API key should only be accessible on the server side
- Consider implementing rate limiting for the contact form to prevent abuse

## API Endpoint

The contact form API is available at:
- **Endpoint**: `POST /api/contact`
- **Required fields**: `name`, `email`, `subject`, `message`
- **Response**: JSON with success/error status

Example request:
```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about resume analysis',
    message: 'I have a question about...'
  }),
})
```

## Support

If you need help with the email setup:
1. Check the Resend documentation: [docs.resend.com](https://docs.resend.com)
2. Review the server logs for error details
3. Contact the development team for assistance 