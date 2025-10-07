-- Create user profiles table for subscription management
-- This table extends auth.users with custom subscription data

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_status VARCHAR(20) DEFAULT 'none' CHECK (subscription_status IN ('none', 'trial', 'active', 'cancelled', 'expired')),
    subscription_tier VARCHAR(20) CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
    sop_access BOOLEAN DEFAULT FALSE,
    demo_completed BOOLEAN DEFAULT FALSE,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user subscriptions tracking table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('starter', 'professional', 'enterprise')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    stripe_subscription_id VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user journey tracking table
CREATE TABLE IF NOT EXISTS public.user_journey (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event VARCHAR(100) NOT NULL,
    platform VARCHAR(50) DEFAULT 'opscentral',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_status ON public.user_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_sop_access ON public.user_profiles(sop_access);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_journey_user_id ON public.user_journey(user_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_event ON public.user_journey(event);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" 
    ON public.user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.user_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles" 
    ON public.user_profiles 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
    ON public.user_subscriptions 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" 
    ON public.user_subscriptions 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- RLS Policies for user_journey
CREATE POLICY "Users can view their own journey" 
    ON public.user_journey 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all journey data" 
    ON public.user_journey 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, subscription_status, sop_access, demo_completed)
    VALUES (NEW.id, 'none', FALSE, FALSE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update user subscription status
CREATE OR REPLACE FUNCTION update_user_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the user profile with subscription status
    UPDATE public.user_profiles 
    SET 
        subscription_status = NEW.status,
        subscription_tier = NEW.tier,
        subscription_expires_at = NEW.end_date,
        sop_access = CASE 
            WHEN NEW.status = 'active' AND NEW.tier IN ('starter', 'professional', 'enterprise') 
            THEN TRUE 
            ELSE FALSE 
        END,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update user profile when subscription changes
CREATE TRIGGER trigger_update_user_subscription_status
    AFTER INSERT OR UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_subscription_status();

-- Function to track user journey events
CREATE OR REPLACE FUNCTION track_user_journey(
    p_user_id UUID,
    p_event VARCHAR(100),
    p_platform VARCHAR(50) DEFAULT 'opscentral',
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    journey_id UUID;
BEGIN
    INSERT INTO public.user_journey (user_id, event, platform, metadata)
    VALUES (p_user_id, p_event, p_platform, p_metadata)
    RETURNING id INTO journey_id;
    
    RETURN journey_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user access status
CREATE OR REPLACE FUNCTION get_user_access_status(p_user_id UUID)
RETURNS TABLE (
    user_id UUID,
    subscription_status VARCHAR(20),
    subscription_tier VARCHAR(20),
    sop_access BOOLEAN,
    demo_completed BOOLEAN,
    subscription_expires_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        COALESCE(up.subscription_status, 'none')::VARCHAR(20),
        up.subscription_tier,
        COALESCE(up.sop_access, FALSE),
        COALESCE(up.demo_completed, FALSE),
        up.subscription_expires_at
    FROM public.user_profiles up
    WHERE up.id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create profiles for existing users
INSERT INTO public.user_profiles (id, subscription_status, sop_access, demo_completed)
SELECT id, 'none', FALSE, FALSE
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles)
ON CONFLICT (id) DO NOTHING;

-- Add comments
COMMENT ON TABLE public.user_profiles IS 'Extended user profiles with subscription information';
COMMENT ON TABLE public.user_subscriptions IS 'Tracks user subscription history and status';
COMMENT ON TABLE public.user_journey IS 'Tracks user journey events across the platform';
COMMENT ON FUNCTION track_user_journey IS 'Records user journey events for analytics';
COMMENT ON FUNCTION get_user_access_status IS 'Returns comprehensive user access status';
