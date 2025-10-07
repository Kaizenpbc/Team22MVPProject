-- Create a function to check for booking collisions
-- This is like a smart helper that checks if a time slot is already taken!

CREATE OR REPLACE FUNCTION check_booking_collision(
  check_utc_start TIMESTAMPTZ,
  exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  collision_count INTEGER;
BEGIN
  -- Count how many bookings exist at this UTC time
  SELECT COUNT(*) INTO collision_count
  FROM public.bookings
  WHERE utc_start = check_utc_start
    AND status = 'confirmed'
    AND (exclude_booking_id IS NULL OR id != exclude_booking_id);
  
  -- Return true if there's a collision (count > 0)
  RETURN collision_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION check_booking_collision IS 'Checks if a booking time slot is already taken';

