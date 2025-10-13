# Kovari - Streamlined SOP Platform

A centralised hub that transforms how product managers handle internal workflows, SOP management, and real-time updates.

## Features

### Booking System
- **International Timezone Support**: Users can select from common IANA timezones
- **7-Day Availability**: Shows next 7 calendar days with hourly slots from 09:00-17:00
- **Smart Collision Detection**: Prevents double-booking using UTC normalization
- **Pain Points Questionnaire**: 5 optional questions to help prepare demos
- **GDPR Compliance**: Required consent checkbox for data processing

### Timezone Handling
- **Browser Detection**: Automatically detects user's timezone, defaults to Europe/London
- **UTC Storage**: All bookings stored with `utc_start` for collision checking
- **Local Display**: Times shown in user's selected timezone
- **Calendar Integration**: ICS attachments and Google Calendar links respect timezone

### Email Confirmations
- **Dual Time Display**: Shows both local time and UTC equivalent
- **Pain Points Included**: User responses included in confirmation emails
- **Team Notifications**: Internal team receives copy with all booking details
- **Calendar Attachments**: ICS files with proper timezone information

### Data Structure
Bookings are stored with:
- `utc_start`: ISO string for collision detection
- `timezone_selected`: IANA timezone string
- `duration_minutes`: Always 30 for demos
- `pain_points`: Object containing optional questionnaire responses

### Collision Prevention
Slots are considered taken if another booking has the same `utc_start`, regardless of the user's chosen timezone. This ensures no double-booking across different timezones.

## Backend & Database

This project now includes a **Supabase backend** with:
- PostgreSQL database for storing bookings
- Real-time booking collision detection
- Edge Functions for sending emails
- Row Level Security for data protection

### Quick Setup

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com)

3. **Copy environment template and configure**:
   ```bash
   cp env.example .env
   ```
   Fill in your Supabase URL and anon key from Project Settings → API

4. **Link your project**:
   ```bash
   supabase login
   supabase link --project-ref your-project-id
   ```

5. **Push database schema**:
   ```bash
   supabase db push
   ```

6. **Deploy Edge Function**:
   ```bash
   # Set secrets first
   supabase secrets set RESEND_API_KEY=your_key
   supabase secrets set EMAIL_FROM=hello@opscentral.com
   supabase secrets set BOOKINGS_NOTIFY=team@opscentral.com
   
   # Deploy the function
   supabase functions deploy send-booking-email
   ```

📖 **See `SUPABASE_SETUP.md` for detailed setup instructions!**

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=http://localhost:5173
```

### Edge Functions (set via Supabase CLI)
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set EMAIL_FROM=hello@opscentral.com
supabase secrets set BOOKINGS_NOTIFY=team@opscentral.com
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Optional: Run Supabase locally
npm run supabase:start
npm run supabase:status
npm run supabase:stop
```

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- React Router
- Vite
- Lucide React (icons)

### Backend
- Supabase (PostgreSQL + Edge Functions)
- Row Level Security (RLS)
- Resend (email service)
