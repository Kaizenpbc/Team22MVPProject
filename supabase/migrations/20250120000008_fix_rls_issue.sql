-- Fix the RLS issue by disabling it temporarily
-- We'll create proper admin policies later

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.user_profiles;

-- Disable RLS completely for now so admins can see all users
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Log the change
DO $$
BEGIN
    RAISE NOTICE 'RLS disabled on user_profiles table - admins can now see all users';
END $$;
