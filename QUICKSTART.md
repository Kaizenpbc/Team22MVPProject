# 🚀 Quick Start Guide

Get your OpsCentral booking system running with Supabase in 5 minutes!

## Step 1: Install the Supabase Package

```bash
npm install
```

This installs all dependencies including `@supabase/supabase-js`.

## Step 2: Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"**
3. Fill in:
   - Name: `OpsCentral`
   - Password: (create a strong one!)
   - Region: (choose closest to you)
4. Wait 2-3 minutes for setup

## Step 3: Get Your Credentials

1. In your Supabase project, click **Settings** (gear icon) → **API**
2. Copy these two values:
   - **URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbG...` (long string)

## Step 4: Create .env File

```bash
cp env.example .env
```

Edit `.env` and paste your values:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...your-anon-key...
VITE_APP_URL=http://localhost:5173
```

## Step 5: Install Supabase CLI

```bash
npm install -g supabase
```

Then login:

```bash
supabase login
```

## Step 6: Link Your Project

Find your project ID (it's in the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`):

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

## Step 7: Create Database Tables

```bash
supabase db push
```

This creates your bookings table and all the functions!

## Step 8: (Optional) Set Up Email

If you want to send booking confirmation emails:

1. Get a free API key from [resend.com](https://resend.com)
2. Run these commands:

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
supabase secrets set EMAIL_FROM=hello@opscentral.com
supabase secrets set BOOKINGS_NOTIFY=team@opscentral.com
```

3. Deploy the email function:

```bash
supabase functions deploy send-booking-email
```

## Step 9: Start Your App! 🎉

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and try booking a demo!

---

## Verify It's Working

1. Go to the **Book** page
2. Select a date and time
3. Fill in the form
4. Click **Confirm Booking**
5. Check your Supabase Dashboard → **Table Editor** → **bookings**
6. You should see your booking there! ✅

---

## Troubleshooting

**"Missing Supabase environment variables"**
- Make sure `.env` file exists in your project root
- Restart your dev server: press `Ctrl+C` and run `npm run dev` again

**"Failed to create booking"**
- Check you ran `supabase db push`
- Verify your `.env` values are correct
- Check browser console (F12) for errors

**Need more help?**
- Check `SUPABASE_SETUP.md` for detailed instructions
- Visit [Supabase Docs](https://supabase.com/docs)

---

That's it! You now have a fully functional backend with database and email support! 🚀

