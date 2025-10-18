-- Add email system for user notifications

-- Function to send email notifications to users
CREATE OR REPLACE FUNCTION public.send_user_notification(
    recipient_email TEXT,
    subject TEXT,
    message TEXT,
    notification_type TEXT DEFAULT 'general'
)
RETURNS TEXT AS $$
DECLARE
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
    
    -- Log the email (in a real system, this would trigger an actual email service)
    INSERT INTO public.email_log (
        recipient_email,
        subject,
        message,
        notification_type,
        sent_by,
        sent_at
    ) VALUES (
        recipient_email,
        subject,
        message,
        notification_type,
        auth.uid(),
        NOW()
    );
    
    result_text := 'Email notification sent to ' || recipient_email || ': ' || subject;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send bulk emails to all users
CREATE OR REPLACE FUNCTION public.send_bulk_notification(
    subject TEXT,
    message TEXT,
    notification_type TEXT DEFAULT 'general',
    user_filter TEXT DEFAULT 'all' -- 'all', 'active', 'suspended', 'admins', 'users'
)
RETURNS TEXT AS $$
DECLARE
    user_record RECORD;
    sent_count INTEGER := 0;
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
    
    -- Send emails based on filter
    FOR user_record IN 
        SELECT au.email, au.id, up.subscription_status, up.role
        FROM auth.users au
        LEFT JOIN public.user_profiles up ON au.id = up.id
        WHERE 
            au.email IS NOT NULL
            AND (
                user_filter = 'all' OR
                (user_filter = 'active' AND up.subscription_status = 'active') OR
                (user_filter = 'suspended' AND up.subscription_status = 'suspended') OR
                (user_filter = 'admins' AND up.role = 'admin') OR
                (user_filter = 'users' AND up.role = 'user')
            )
    LOOP
        -- Log the email
        INSERT INTO public.email_log (
            recipient_email,
            subject,
            message,
            notification_type,
            sent_by,
            sent_at
        ) VALUES (
            user_record.email,
            subject,
            message,
            notification_type,
            auth.uid(),
            NOW()
        );
        
        sent_count := sent_count + 1;
    END LOOP;
    
    result_text := 'Bulk notification sent to ' || sent_count || ' users: ' || subject;
    
    RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create email log table to track sent emails
CREATE TABLE IF NOT EXISTS public.email_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'general',
    sent_by UUID REFERENCES auth.users(id),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'sent' -- 'sent', 'failed', 'pending'
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON public.email_log(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_log_sent_at ON public.email_log(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_log_type ON public.email_log(notification_type);
