-- Add user management functions for admins

-- Function to suspend a user
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
    SELECT email INTO user_email FROM auth.users WHERE id = user_id;
    
    -- Update user profile to suspended status
    UPDATE public.user_profiles 
    SET 
        subscription_status = 'suspended',
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Also update auth.users if possible (this might require service role)
    -- For now, we'll just update the profile
    
    result_text := 'User ' || COALESCE(user_email, user_id::TEXT) || ' has been suspended';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reactivate a user
CREATE OR REPLACE FUNCTION public.reactivate_user(user_id UUID)
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
    SELECT email INTO user_email FROM auth.users WHERE id = user_id;
    
    -- Update user profile to active status
    UPDATE public.user_profiles 
    SET 
        subscription_status = 'active',
        updated_at = NOW()
    WHERE id = user_id;
    
    result_text := 'User ' || COALESCE(user_email, user_id::TEXT) || ' has been reactivated';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete a user (soft delete - marks as deleted)
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
    SELECT email INTO user_email FROM auth.users WHERE id = user_id;
    
    -- Soft delete - mark as deleted
    UPDATE public.user_profiles 
    SET 
        subscription_status = 'deleted',
        updated_at = NOW()
    WHERE id = user_id;
    
    result_text := 'User ' || COALESCE(user_email, user_id::TEXT) || ' has been deleted';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a deleted_at column to track when users were deleted
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
