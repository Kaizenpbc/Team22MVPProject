-- Add email column to user_profiles table and populate it from auth.users
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Update existing user_profiles with email data from auth.users
UPDATE public.user_profiles 
SET email = au.email
FROM auth.users au
WHERE public.user_profiles.id = au.id 
AND public.user_profiles.email IS NULL;

-- Create a function to populate user_profiles with email data
CREATE OR REPLACE FUNCTION public.populate_user_profiles_with_email()
RETURNS TEXT AS $$
DECLARE
    user_record RECORD;
    inserted_count INTEGER := 0;
    updated_count INTEGER := 0;
    total_count INTEGER := 0;
BEGIN
    -- Loop through all users in auth.users
    FOR user_record IN 
        SELECT 
            au.id,
            au.email,
            au.raw_user_meta_data->>'full_name' as full_name,
            au.created_at,
            au.updated_at,
            CASE 
                WHEN au.email LIKE '%admin%' OR au.email LIKE '%@kpbc.ca' THEN 'admin'
                ELSE 'user'
            END as role
        FROM auth.users au
    LOOP
        total_count := total_count + 1;
        
        -- Insert or update user profile
        INSERT INTO public.user_profiles (
            id,
            email,
            full_name,
            role,
            credits,
            subscription_tier,
            subscription_status,
            created_at,
            updated_at
        ) VALUES (
            user_record.id,
            user_record.email,
            COALESCE(user_record.full_name, 'No Name'),
            user_record.role,
            COALESCE((SELECT credits FROM public.user_profiles WHERE id = user_record.id), 10),
            COALESCE((SELECT subscription_tier FROM public.user_profiles WHERE id = user_record.id), 'free'),
            COALESCE((SELECT subscription_status FROM public.user_profiles WHERE id = user_record.id), 'active'),
            user_record.created_at,
            user_record.updated_at
        )
        ON CONFLICT (id) 
        DO UPDATE SET 
            email = user_record.email,
            full_name = COALESCE(user_record.full_name, public.user_profiles.full_name),
            role = COALESCE(user_record.role, public.user_profiles.role),
            updated_at = NOW();
        
        IF FOUND THEN
            IF (SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE id = user_record.id AND created_at = user_record.created_at)) THEN
                inserted_count := inserted_count + 1;
            ELSE
                updated_count := updated_count + 1;
            END IF;
        END IF;
    END LOOP;
    
    RETURN 'Total auth users: ' || total_count || ', Profiles inserted: ' || inserted_count || ', Profiles updated: ' || updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
