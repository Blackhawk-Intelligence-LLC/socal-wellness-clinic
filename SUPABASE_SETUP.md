# Supabase Setup Guide 🚀

## 1. Set Up Your Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for it to provision (takes ~2 minutes)

## 2. Run the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" to execute

## 3. Configure Authentication

1. Go to **Authentication > Providers**
2. Enable **Email** provider (should be enabled by default)
3. Go to **Authentication > Email Templates**
4. Customize the confirmation email template:

```html
<h2>Welcome to SoCal Wellness!</h2>
<p>Hi {{ .Email }},</p>
<p>Thanks for signing up! Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>Once confirmed, you'll be able to book appointments and manage your wellness journey.</p>
<p>Best regards,<br>The SoCal Wellness Team</p>
```

## 4. Enable Row Level Security (RLS)

The schema already includes RLS policies, but verify they're enabled:

1. Go to **Database > Tables**
2. Check that the shield icon is green for:
   - `profiles`
   - `appointments`
   - `appointment_history`
   - `services`

## 5. Update Environment Variables

Your `.env.local` file has been created with your credentials:

```env
VITE_SUPABASE_URL=https://phflhiiojlacaanpkvho.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 6. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test user registration:
   - Click "Book Appointment" button
   - Click "Sign up" in the modal
   - Fill in the form and submit
   - Check your email for confirmation

3. Test booking flow:
   - Sign in with your account
   - Go to the booking form
   - Complete a test booking
   - Check the Supabase dashboard to see the appointment

## 7. View Your Data

In the Supabase dashboard:
- **Table Editor**: View and manage appointments, profiles, services
- **Authentication > Users**: See registered users
- **Logs**: Monitor database activity

## 8. Production Deployment

When deploying to Vercel:

1. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Ensure your Supabase project URL is added to allowed URLs:
   - Go to **Authentication > URL Configuration**
   - Add your production domain to:
     - Site URL
     - Redirect URLs

## 9. Optional: Set Up Email with Resend

For better email deliverability:

1. Go to **Settings > Authentication**
2. Enable custom SMTP
3. Use Resend or your preferred email service
4. Configure SMTP settings

## 🎉 You're All Set!

Your SoCal Wellness Clinic now has:
- ✅ User authentication
- ✅ Appointment booking saved to database
- ✅ User profiles
- ✅ Appointment history tracking
- ✅ Row-level security
- ✅ Real-time updates (if needed)

## Troubleshooting

### "User must be logged in to book"
- Ensure the user has confirmed their email
- Check that RLS policies are correctly set

### "Permission denied for table"
- Verify RLS is enabled on the table
- Check that policies match the schema

### Email not sending
- Check spam folder
- Verify email templates are set up
- Consider using custom SMTP 