# Supabase Backend Setup Guide

This guide will help you set up your Supabase backend for the OpsCentral booking system! Think of this as building instructions for your toy set - follow each step carefully! 🎯

## Prerequisites (What You Need First)

1. **Node.js** (version 18 or higher) - Like having the right batteries!
2. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
3. **Supabase CLI** - Install it by running:
   ```bash
   npm install -g supabase
   ```

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in the details:
   - **Project Name**: OpsCentral (or whatever you like!)
   - **Database Password**: Create a strong password and save it somewhere safe!
   - **Region**: Choose the one closest to you
4. Click **"Create new project"** and wait a few minutes for it to set up

## Step 2: Get Your API Keys

1. In your Supabase project, go to **Settings** (gear icon) → **API**
2. You'll see two important things:
   - **Project URL**: Looks like `https://abcdefghijk.supabase.co`
   - **anon public key**: A long string of random characters

## Step 3: Set Up Local Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your values:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_URL=http://localhost:5173
   ```

## Step 4: Install Dependencies

Run this command to install the Supabase library:
```bash
npm install
```

## Step 5: Link Your Local Project to Supabase

1. Login to Supabase CLI:
   ```bash
   supabase login
   ```

2. Link your project (you'll need your project ID from the URL):
   ```bash
   supabase link --project-ref your-project-id
   ```

## Step 6: Push Database Migrations

This creates all the tables and functions in your database:
```bash
supabase db push
```

This will create:
- ✅ The `bookings` table
- ✅ Indexes for fast searching
- ✅ Security policies (Row Level Security)
- ✅ Helper functions for checking booking collisions

## Step 7: (Optional) Add Test Data

If you want some example bookings to test with:
```bash
supabase db reset
```

This will run the seed file and add 3 sample bookings!

## Step 8: Set Up Email Sending (Edge Function)

1. Get a **Resend API key**:
   - Go to [resend.com](https://resend.com)
   - Sign up for free
   - Create an API key

2. Set up Edge Function secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your_resend_api_key_here
   supabase secrets set EMAIL_FROM=hello@opscentral.com
   supabase secrets set BOOKINGS_NOTIFY=team@opscentral.com
   ```

3. Deploy the Edge Function:
   ```bash
   supabase functions deploy send-booking-email
   ```

## Step 9: Start Your App!

Now you're ready to run your application:
```bash
npm run dev
```

Open your browser to `http://localhost:5173` and try making a booking!

## Testing Your Setup ✅

To make sure everything works:

1. Go to the booking page
2. Select a date and time
3. Fill in the form
4. Submit the booking
5. Check your Supabase Dashboard → Table Editor → bookings to see if it was saved!

## Common Issues & Solutions

### "Missing Supabase environment variables"
- Make sure you created the `.env` file and filled in the correct values
- Restart your dev server after creating the `.env` file

### "Failed to create booking"
- Check your Supabase project is active
- Make sure you ran `supabase db push` to create the tables
- Check the browser console for error messages

### "Email sending failed"
- This is okay! The booking is still saved
- Make sure you set up the Resend API key
- Check that the Edge Function is deployed

## Database Structure

Your database has one main table:

**bookings**
- `id` - Unique identifier
- `full_name` - Customer name
- `email` - Customer email
- `notes` - Optional notes
- `workflow_challenge`, `sop_management`, etc. - Pain points responses
- `selected_date` - The date they selected
- `selected_time` - The time they selected
- `timezone_selected` - Their timezone
- `utc_start` - The booking time in UTC (for collision checking)
- `duration_minutes` - Always 30 for demos
- `status` - confirmed, cancelled, etc.
- `created_at`, `updated_at` - Timestamp tracking

## Local Development with Supabase

You can also run Supabase locally using Docker:

```bash
# Start local Supabase
npm run supabase:start

# Check status
npm run supabase:status

# Stop local Supabase
npm run supabase:stop

# Reset database (warning: deletes all data!)
npm run supabase:db:reset
```

## Next Steps

- Customize the email templates in `supabase/functions/send-booking-email/index.ts`
- Add more fields to the booking form if needed
- Set up authentication for admin access
- Create an admin dashboard to view all bookings

## Need Help?

Check the Supabase documentation:
- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Database Guide](https://supabase.com/docs/guides/database)

Happy coding! 🚀

