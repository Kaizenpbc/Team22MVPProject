-- Fix delete_user function to use valid subscription_status value

-- Option 1: Add 'deleted' and 'suspended' to allowed subscription_status values
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_subscription_status_check;

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_subscription_status_check 
CHECK (subscription_status IN ('none', 'trial', 'active', 'cancelled', 'expired', 'suspended', 'deleted'));

-- Update the delete_user function to properly handle deletion
CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_email TEXT;
    result_text TEXT;
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Prevent deleting yourself
    IF user_id = auth.uid() THEN
        RAISE EXCEPTION 'Cannot delete your own account.';
    END IF;
    
    -- Get user email for logging
    SELECT email INTO user_email FROM public.user_profiles WHERE id = user_id;
    IF user_email IS NULL THEN
        SELECT email INTO user_email FROM auth.users WHERE id = user_id;
    END IF;
    
    -- Soft delete - mark as deleted
    UPDATE public.user_profiles 
    SET 
        subscription_status = 'deleted',
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Also delete from auth.users if you want hard delete (optional)
    -- DELETE FROM auth.users WHERE id = user_id;
    
    result_text := 'User ' || COALESCE(user_email, user_id::TEXT) || ' has been marked as deleted';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update suspend_user function to use 'suspended' status
CREATE OR REPLACE FUNCTION public.suspend_user(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_email TEXT;
    result_text TEXT;
BEGIN
    -- Check if the current user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Get user email for logging
    SELECT email INTO user_email FROM public.user_profiles WHERE id = user_id;
    IF user_email IS NULL THEN
        SELECT email INTO user_email FROM auth.users WHERE id = user_id;
    END IF;
    
    -- Suspend user
    UPDATE public.user_profiles 
    SET 
        subscription_status = 'suspended',
        updated_at = NOW()
    WHERE id = user_id;
    
    result_text := 'User ' || COALESCE(user_email, user_id::TEXT) || ' has been suspended';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
