-- Create admin tier management system (simplified version)

-- Create admin_accounts table
CREATE TABLE IF NOT EXISTS public.admin_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_activity_logs table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admin_accounts(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_accounts_email ON public.admin_accounts(email);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_role ON public.admin_accounts(role);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_status ON public.admin_accounts(status);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_expires_at ON public.admin_accounts(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at);

-- Function to create a new admin account
CREATE OR REPLACE FUNCTION public.create_admin_account(
    admin_email TEXT,
    admin_name TEXT,
    admin_role TEXT,
    expiration_days INTEGER DEFAULT 365
)
RETURNS TEXT AS $$
DECLARE
    creator_id UUID;
    admin_id UUID;
    expiration_date TIMESTAMP WITH TIME ZONE;
    result_text TEXT;
BEGIN
    -- Check if the current user is a super admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) THEN
        RAISE EXCEPTION 'Access denied. Super Admin privileges required.';
    END IF;
    
    -- Get creator ID
    creator_id := auth.uid();
    
    -- Calculate expiration date
    expiration_date := NOW() + (expiration_days || ' days')::INTERVAL;
    
    -- Insert new admin account
    INSERT INTO public.admin_accounts (
        email,
        full_name,
        role,
        created_by,
        expires_at
    ) VALUES (
        admin_email,
        admin_name,
        admin_role,
        creator_id,
        expiration_date
    ) RETURNING id INTO admin_id;
    
    -- Log the admin creation action
    INSERT INTO public.admin_activity_logs (
        admin_id,
        action,
        details,
        ip_address
    ) VALUES (
        admin_id,
        'admin_created',
        jsonb_build_object(
            'created_by', creator_id,
            'admin_email', admin_email,
            'admin_role', admin_role,
            'expires_at', expiration_date
        ),
        inet_client_addr()
    );
    
    result_text := 'Admin account created successfully: ' || admin_email || ' (Role: ' || admin_role || ', Expires: ' || expiration_date::TEXT || ')';
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all admin accounts (super admin only)
CREATE OR REPLACE FUNCTION public.get_all_admin_accounts()
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    full_name TEXT,
    role VARCHAR(20),
    status VARCHAR(20),
    created_by_email TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Check if the current user is a super admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) THEN
        RAISE EXCEPTION 'Access denied. Super Admin privileges required.';
    END IF;
    
    RETURN QUERY
    SELECT 
        aa.id,
        aa.email,
        aa.full_name,
        aa.role,
        aa.status,
        au.email as created_by_email,
        aa.expires_at,
        aa.last_login,
        aa.login_count,
        aa.created_at,
        aa.updated_at
    FROM public.admin_accounts aa
    LEFT JOIN auth.users au ON aa.created_by = au.id
    ORDER BY aa.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log admin activity
CREATE OR REPLACE FUNCTION public.log_admin_activity(
    activity_action TEXT,
    activity_details JSONB DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    admin_id UUID;
    result_text TEXT;
BEGIN
    -- Get current admin ID from admin_accounts table
    SELECT id INTO admin_id 
    FROM public.admin_accounts 
    WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
    );
    
    -- If admin not found, try to find by user ID
    IF admin_id IS NULL THEN
        SELECT id INTO admin_id 
        FROM public.admin_accounts 
        WHERE created_by = auth.uid();
    END IF;
    
    -- Log the activity
    INSERT INTO public.admin_activity_logs (
        admin_id,
        action,
        details,
        ip_address,
        user_agent
    ) VALUES (
        admin_id,
        activity_action,
        activity_details,
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb->>'user-agent'
    );
    
    result_text := 'Activity logged: ' || activity_action;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to suspend/activate admin account
CREATE OR REPLACE FUNCTION public.manage_admin_status(
    target_admin_id UUID,
    new_status TEXT
)
RETURNS TEXT AS $$
DECLARE
    admin_email TEXT;
    result_text TEXT;
BEGIN
    -- Check if the current user is a super admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) THEN
        RAISE EXCEPTION 'Access denied. Super Admin privileges required.';
    END IF;
    
    -- Get admin email for logging
    SELECT email INTO admin_email FROM public.admin_accounts WHERE id = target_admin_id;
    
    -- Update admin status
    UPDATE public.admin_accounts 
    SET 
        status = new_status,
        updated_at = NOW()
    WHERE id = target_admin_id;
    
    -- Log the status change
    PERFORM public.log_admin_activity(
        'admin_status_changed',
        jsonb_build_object(
            'target_admin_id', target_admin_id,
            'target_admin_email', admin_email,
            'new_status', new_status,
            'changed_by', auth.uid()
        )
    );
    
    result_text := 'Admin status updated: ' || admin_email || ' -> ' || new_status;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to extend admin expiration
CREATE OR REPLACE FUNCTION public.extend_admin_expiration(
    target_admin_id UUID,
    additional_days INTEGER
)
RETURNS TEXT AS $$
DECLARE
    admin_email TEXT;
    new_expiration TIMESTAMP WITH TIME ZONE;
    result_text TEXT;
BEGIN
    -- Check if the current user is a super admin
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) THEN
        RAISE EXCEPTION 'Access denied. Super Admin privileges required.';
    END IF;
    
    -- Get admin email and current expiration
    SELECT email, expires_at INTO admin_email, new_expiration 
    FROM public.admin_accounts 
    WHERE id = target_admin_id;
    
    -- Calculate new expiration date
    new_expiration := COALESCE(new_expiration, NOW()) + (additional_days || ' days')::INTERVAL;
    
    -- Update expiration date
    UPDATE public.admin_accounts 
    SET 
        expires_at = new_expiration,
        updated_at = NOW()
    WHERE id = target_admin_id;
    
    -- Log the extension
    PERFORM public.log_admin_activity(
        'admin_expiration_extended',
        jsonb_build_object(
            'target_admin_id', target_admin_id,
            'target_admin_email', admin_email,
            'additional_days', additional_days,
            'new_expiration', new_expiration,
            'extended_by', auth.uid()
        )
    );
    
    result_text := 'Admin expiration extended: ' || admin_email || ' -> ' || new_expiration::TEXT;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
