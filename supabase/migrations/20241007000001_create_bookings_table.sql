-- Create bookings table
-- This is like creating a special filing cabinet drawer just for bookings!

CREATE TABLE IF NOT EXISTS public.bookings (
  -- Unique ID for each booking (like a special number for each toy)
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Customer information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  
  -- Pain points questionnaire responses
  workflow_challenge TEXT,
  sop_management TEXT,
  main_goal TEXT,
  limiting_tools TEXT,
  demo_preparation TEXT,
  
  -- Booking time details
  selected_date DATE NOT NULL,
  selected_time TIME NOT NULL,
  timezone_selected TEXT NOT NULL,
  utc_start TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  
  -- Booking status
  status TEXT NOT NULL DEFAULT 'confirmed',
  
  -- Tracking timestamps (when was this created/updated)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on utc_start for fast collision checking
-- This helps us quickly find if a time slot is already taken!
CREATE INDEX idx_bookings_utc_start ON public.bookings(utc_start);

-- Create an index on email for looking up user bookings
CREATE INDEX idx_bookings_email ON public.bookings(email);

-- Create an index on status for filtering
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- Enable Row Level Security (RLS)
-- This is like a lock on the drawer - only the right people can access it!
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert a booking (for public booking form)
CREATE POLICY "Anyone can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Users can read their own bookings by email
CREATE POLICY "Users can read their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (true);

-- Create updated_at trigger
-- This automatically updates the 'updated_at' field when we change something!
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE public.bookings IS 'Stores all demo booking appointments';

