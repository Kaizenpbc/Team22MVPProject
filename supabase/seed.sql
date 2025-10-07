-- Seed data for development/testing
-- This adds some pretend bookings so we can test everything works!

-- Insert some sample bookings for testing
INSERT INTO public.bookings (
  full_name,
  email,
  notes,
  workflow_challenge,
  sop_management,
  main_goal,
  selected_date,
  selected_time,
  timezone_selected,
  utc_start,
  duration_minutes,
  status
) VALUES
  (
    'John Smith',
    'john@example.com',
    'Looking forward to seeing how OpsCentral can help our team',
    'We struggle with keeping SOPs up to date',
    'Currently using Google Docs and Notion',
    'Centralize all our process documentation',
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Europe/London',
    (CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours')::TIMESTAMPTZ,
    30,
    'confirmed'
  ),
  (
    'Sarah Johnson',
    'sarah@example.com',
    'Want to learn about automation features',
    'Too much manual work in our workflows',
    'Mix of Slack, Asana, and spreadsheets',
    'Automate repetitive tasks',
    CURRENT_DATE + INTERVAL '2 days',
    '14:00:00',
    'America/New_York',
    (CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours' + INTERVAL '5 hours')::TIMESTAMPTZ,
    30,
    'confirmed'
  ),
  (
    'Michael Chen',
    'michael@example.com',
    '',
    'Need better visibility into team processes',
    'Everything is scattered across different tools',
    'Single source of truth for operations',
    CURRENT_DATE + INTERVAL '3 days',
    '16:00:00',
    'Asia/Singapore',
    (CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours' - INTERVAL '8 hours')::TIMESTAMPTZ,
    30,
    'confirmed'
  );

