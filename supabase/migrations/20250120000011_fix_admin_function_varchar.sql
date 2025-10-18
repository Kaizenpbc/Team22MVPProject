-- Fix the admin function data type mismatch
-- The auth.users.email field is VARCHAR(255) not TEXT

CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
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
        au.id,
        au.email,
        COALESCE(up.full_name, au.raw_user_meta_data->>'full_name', 'No Name') as full_name,
        COALESCE(up.role, 
            CASE 
                WHEN au.email LIKE '%admin%' OR au.email LIKE '%@kpbc.ca' THEN 'admin'
                ELSE 'user'
            END
        ) as role,
        COALESCE(up.credits, 0) as credits,
        COALESCE(up.subscription_tier, 'free') as subscription_tier,
        COALESCE(up.subscription_status, 'active') as subscription_status,
        au.created_at,
        au.updated_at
    FROM auth.users au
    LEFT JOIN public.user_profiles up ON au.id = up.id
    ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
