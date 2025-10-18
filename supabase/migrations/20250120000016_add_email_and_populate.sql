-- Add email column to user_profiles table and populate it from auth.users

-- Step 1: Add email column if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 2: Create an index on the email column for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Step 3: Populate email data from auth.users into user_profiles
UPDATE public.user_profiles up
SET email = au.email
FROM auth.users au
WHERE up.id = au.id
AND (up.email IS NULL OR up.email = '');

-- Step 4: Create a function to keep emails in sync (for future inserts)
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new user_profile is inserted, automatically populate email
  IF NEW.email IS NULL OR NEW.email = '' THEN
    SELECT email INTO NEW.email
    FROM auth.users
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger to auto-populate email on insert
DROP TRIGGER IF EXISTS sync_user_email_trigger ON public.user_profiles;
CREATE TRIGGER sync_user_email_trigger
BEFORE INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_email();

-- Step 6: Update the populate function to include email
CREATE OR REPLACE FUNCTION public.populate_user_profiles_with_email()
RETURNS TEXT AS $$
DECLARE
    auth_user_count INTEGER;
    profile_count_before INTEGER;
    profile_count_after INTEGER;
    inserted_count INTEGER := 0;
    updated_count INTEGER := 0;
    user_record RECORD;
BEGIN
    -- Get counts
    SELECT COUNT(*) INTO auth_user_count FROM auth.users;
    SELECT COUNT(*) INTO profile_count_before FROM public.user_profiles;
    
    -- Process each user
    FOR user_record IN 
        SELECT 
            au.id,
            au.email,
            COALESCE(au.raw_user_meta_data->>'full_name', 'User ' || SUBSTRING(au.email FROM 1 FOR POSITION('@' IN au.email) - 1)) as full_name,
            au.created_at,
            au.updated_at
        FROM auth.users au
    LOOP
        -- Insert or update user profile with email
        INSERT INTO public.user_profiles (
            id,
            email,
            full_name,
            created_at,
            updated_at
        ) VALUES (
            user_record.id,
            user_record.email,
            user_record.full_name,
            user_record.created_at,
            user_record.updated_at
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            full_name = COALESCE(public.user_profiles.full_name, EXCLUDED.full_name),
            updated_at = EXCLUDED.updated_at;
        
        -- Track if this was an insert or update
        IF FOUND THEN
            IF (SELECT COUNT(*) FROM public.user_profiles WHERE id = user_record.id) = 1 THEN
                updated_count := updated_count + 1;
            END IF;
        ELSE
            inserted_count := inserted_count + 1;
        END IF;
    END LOOP;
    
    SELECT COUNT(*) INTO profile_count_after FROM public.user_profiles;
    
    RETURN 'Auth users: ' || auth_user_count || 
           ', Profiles before: ' || profile_count_before || 
           ', Profiles after: ' || profile_count_after || 
           ', Inserted: ' || inserted_count || 
           ', Updated: ' || updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Run the populate function to ensure all existing profiles have emails
SELECT public.populate_user_profiles_with_email();
