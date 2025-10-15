-- Add role support to user_profiles
-- This adds username, role, and avatar_url to match the custom users table

-- Add new columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS username VARCHAR(50),
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- Update existing users to have role based on email patterns
UPDATE public.user_profiles 
SET 
    role = CASE 
        WHEN EXISTS (
            SELECT 1 FROM auth.users au 
            WHERE au.id = user_profiles.id 
            AND (au.email LIKE '%admin%' OR au.email LIKE '%@kpbc.ca')
        ) THEN 'admin'
        ELSE 'user'
    END,
    username = COALESCE(
        username,
        -- Generate username from email if not set
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM auth.users au 
                WHERE au.id = user_profiles.id
            ) THEN (
                SELECT LOWER(SPLIT_PART(au.email, '@', 1))
                FROM auth.users au 
                WHERE au.id = user_profiles.id
            )
            ELSE NULL
        END
    )
WHERE username IS NULL OR role IS NULL;

-- Update the handle_new_user function to include role and username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-grant FREE tier to all new users
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
        avatar_url
    )
    VALUES (
        NEW.id, 
        'active',      -- Active by default
        'free',        -- Free tier
        TRUE,          -- SOP access granted
        FALSE,         -- Demo not completed yet
        3,             -- 3 workflows
        1,             -- 1 user
        LOWER(SPLIT_PART(NEW.email, '@', 1)), -- Generate username from email
        CASE 
            WHEN NEW.email LIKE '%admin%' OR NEW.email LIKE '%@kpbc.ca' THEN 'admin'
            ELSE 'user'
        END,           -- Set role based on email
        NULL           -- No avatar initially
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the get_user_access_status function to include role
DROP FUNCTION IF EXISTS public.get_user_access_status(UUID);

CREATE OR REPLACE FUNCTION public.get_user_access_status(p_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    subscription_status VARCHAR,
    subscription_tier VARCHAR,
    sop_access BOOLEAN,
    demo_completed BOOLEAN,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    workflow_limit INTEGER,
    user_limit INTEGER,
    username VARCHAR,
    role VARCHAR,
    avatar_url TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id AS user_id,
        COALESCE(up.subscription_status, 'none')::VARCHAR,
        up.subscription_tier::VARCHAR,
        COALESCE(up.sop_access, FALSE),
        COALESCE(up.demo_completed, FALSE),
        up.subscription_expires_at,
        up.workflow_limit,
        up.user_limit,
        up.username,
        up.role,
        up.avatar_url
    FROM public.user_profiles up
    WHERE up.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON COLUMN public.user_profiles.role IS 'User role: admin or user';
COMMENT ON COLUMN public.user_profiles.username IS 'Unique username for the user';
COMMENT ON COLUMN public.user_profiles.avatar_url IS 'URL to user avatar image';
