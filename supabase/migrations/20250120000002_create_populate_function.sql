-- Create a function to populate user_profiles for all auth users
CREATE OR REPLACE FUNCTION public.populate_user_profiles()
RETURNS TEXT AS $$
DECLARE
    inserted_count INTEGER;
BEGIN
    -- Insert profiles for ALL auth users (even if they already exist)
    INSERT INTO public.user_profiles (
        id, 
        subscription_status, 
        subscription_tier,
        sop_access, 
        demo_completed,
        workflow_limit,
        user_limit,
        username,
        role,
        avatar_url,
        created_at,
        updated_at
    )
    SELECT 
        au.id,
        'active',      -- Active status
        'free',        -- Free tier (auto-granted)
        TRUE,          -- SOP access granted
        FALSE,         -- Demo not completed yet
        3,             -- 3 workflows limit
        1,             -- 1 user limit
        LOWER(SPLIT_PART(au.email, '@', 1)), -- Generate username from email
        CASE 
            WHEN au.email LIKE '%admin%' OR au.email LIKE '%@kpbc.ca' THEN 'admin'
            ELSE 'user'
        END,           -- Set role based on email
        NULL,          -- No avatar initially
        au.created_at, -- Use their original signup date
        NOW()          -- Updated now
    FROM auth.users au
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        role = EXCLUDED.role,
        subscription_status = EXCLUDED.subscription_status,
        subscription_tier = EXCLUDED.subscription_tier,
        sop_access = EXCLUDED.sop_access,
        workflow_limit = EXCLUDED.workflow_limit,
        user_limit = EXCLUDED.user_limit,
        updated_at = NOW();
    
    GET DIAGNOSTICS inserted_count = ROW_COUNT;
    
    RETURN 'Successfully populated ' || inserted_count || ' user profiles';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
