-- Create a debug version of the populate function
CREATE OR REPLACE FUNCTION public.debug_populate_user_profiles()
RETURNS TEXT AS $$
DECLARE
    inserted_count INTEGER := 0;
    updated_count INTEGER := 0;
    auth_user_count INTEGER;
    profile_count_before INTEGER;
    profile_count_after INTEGER;
    result_text TEXT;
    auth_user RECORD;
BEGIN
    -- Count auth users
    SELECT COUNT(*) INTO auth_user_count FROM auth.users;
    
    -- Count profiles before
    SELECT COUNT(*) INTO profile_count_before FROM public.user_profiles;
    
    -- Try to insert one user at a time with detailed logging
    FOR auth_user IN SELECT id, email, created_at, updated_at FROM auth.users LOOP
        BEGIN
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
            VALUES (
                auth_user.id,
                'active',
                'free',
                TRUE,
                FALSE,
                3,
                1,
                LOWER(SPLIT_PART(auth_user.email, '@', 1)),
                CASE 
                    WHEN auth_user.email LIKE '%admin%' OR auth_user.email LIKE '%@kpbc.ca' THEN 'admin'
                    ELSE 'user'
                END,
                NULL,
                auth_user.created_at,
                NOW()
            );
            inserted_count := inserted_count + 1;
        EXCEPTION WHEN unique_violation THEN
            -- Update existing user
            UPDATE public.user_profiles SET
                username = LOWER(SPLIT_PART(auth_user.email, '@', 1)),
                role = CASE 
                    WHEN auth_user.email LIKE '%admin%' OR auth_user.email LIKE '%@kpbc.ca' THEN 'admin'
                    ELSE 'user'
                END,
                updated_at = NOW()
            WHERE id = auth_user.id;
            updated_count := updated_count + 1;
        END;
    END LOOP;
    
    -- Count profiles after
    SELECT COUNT(*) INTO profile_count_after FROM public.user_profiles;
    
    result_text := 'Auth users: ' || auth_user_count || 
                   ', Profiles before: ' || profile_count_before ||
                   ', Profiles after: ' || profile_count_after ||
                   ', Inserted: ' || inserted_count ||
                   ', Updated: ' || updated_count;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
