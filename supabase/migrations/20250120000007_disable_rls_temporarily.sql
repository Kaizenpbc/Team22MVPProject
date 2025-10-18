-- Temporarily disable RLS on user_profiles for admin access
-- This allows admins to see all users

-- First, let's see what RLS policies exist
DO $$
BEGIN
    -- Check if RLS is enabled
    IF EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' 
        AND c.relname = 'user_profiles'
        AND c.relrowsecurity = true
    ) THEN
        RAISE NOTICE 'RLS is enabled on user_profiles table';
    ELSE
        RAISE NOTICE 'RLS is NOT enabled on user_profiles table';
    END IF;
END $$;

-- Disable RLS temporarily (we'll re-enable it later with proper admin policies)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Create a policy that allows admins to see all users
CREATE POLICY "Admins can view all user profiles" ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
        )
    );

-- Re-enable RLS with the new policy
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
