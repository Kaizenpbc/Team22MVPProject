-- Fix RLS policies to allow users to create their own subscriptions

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.user_subscriptions;

-- Allow users to insert their own subscriptions
CREATE POLICY "Users can create their own subscriptions" 
    ON public.user_subscriptions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own subscriptions
CREATE POLICY "Users can update their own subscriptions" 
    ON public.user_subscriptions 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Allow service role to manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions" 
    ON public.user_subscriptions 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Drop existing restrictive policies for user_profiles
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;

-- Allow users to insert their own profile (in case it doesn't exist)
CREATE POLICY "Users can insert their own profile" 
    ON public.user_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can manage all profiles" 
    ON public.user_profiles 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Allow users to insert journey events
CREATE POLICY "Users can create their own journey events" 
    ON public.user_journey 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT INSERT, UPDATE ON public.user_subscriptions TO authenticated;
GRANT INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT INSERT ON public.user_journey TO authenticated;
