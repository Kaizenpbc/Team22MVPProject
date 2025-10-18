-- Create a function that admins can use to get all users, bypassing RLS
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    role TEXT,
    credits INTEGER,
    subscription_tier TEXT,
    subscription_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    RETURN QUERY
    SELECT 
        up.id,
        up.email,
        up.full_name,
        up.role,
        up.credits,
        up.subscription_tier,
        up.subscription_status,
        up.created_at,
        up.updated_at
    FROM public.user_profiles up
    ORDER BY up.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
