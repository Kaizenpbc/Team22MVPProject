-- Create subscription tier management system

-- Main subscription tiers table
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tier_key VARCHAR(50) UNIQUE NOT NULL, -- 'free', 'pro', 'enterprise'
    name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    
    -- Pricing
    price_monthly DECIMAL(10, 2) DEFAULT 0.00,
    price_yearly DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Display
    description TEXT,
    icon VARCHAR(50) DEFAULT 'Shield',
    color VARCHAR(50) DEFAULT 'gray',
    cta_text VARCHAR(100) DEFAULT 'Get Started',
    cta_link VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Tier features table
CREATE TABLE IF NOT EXISTS public.tier_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tier_id UUID REFERENCES public.subscription_tiers(id) ON DELETE CASCADE,
    feature_text TEXT NOT NULL,
    feature_type VARCHAR(20) DEFAULT 'feature', -- 'feature', 'limitation'
    display_order INTEGER NOT NULL DEFAULT 0,
    is_highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tier limits table
CREATE TABLE IF NOT EXISTS public.tier_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tier_id UUID REFERENCES public.subscription_tiers(id) ON DELETE CASCADE,
    limit_key VARCHAR(100) NOT NULL, -- 'max_workflows', 'ai_credits_monthly', etc.
    limit_value TEXT NOT NULL, -- Can be numeric or string
    limit_type VARCHAR(20) DEFAULT 'numeric', -- 'numeric', 'boolean', 'text'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tier_id, limit_key)
);

-- Tier change history table (audit trail)
CREATE TABLE IF NOT EXISTS public.tier_change_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tier_id UUID REFERENCES public.subscription_tiers(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL, -- 'price_change', 'feature_added', 'feature_removed', etc.
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    changed_by UUID REFERENCES auth.users(id),
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_tier_key ON public.subscription_tiers(tier_key);
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_is_active ON public.subscription_tiers(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_display_order ON public.subscription_tiers(display_order);
CREATE INDEX IF NOT EXISTS idx_tier_features_tier_id ON public.tier_features(tier_id);
CREATE INDEX IF NOT EXISTS idx_tier_limits_tier_id ON public.tier_limits(tier_id);
CREATE INDEX IF NOT EXISTS idx_tier_change_history_tier_id ON public.tier_change_history(tier_id);

-- Insert default tiers based on current pricing
INSERT INTO public.subscription_tiers (tier_key, name, display_order, price_monthly, price_yearly, description, icon, color, cta_text, cta_link, is_popular)
VALUES 
    ('free', 'Free', 1, 0.00, 0.00, 'Perfect for exploring the platform', 'Shield', 'gray', 'Get Started Free', '/signup', false),
    ('pro', 'Pro', 2, 19.00, 228.00, 'For regular users who want AI features', 'Crown', 'blue', 'Start Pro Trial', '/signup?plan=pro', true),
    ('enterprise', 'Enterprise', 3, 49.00, 588.00, 'For teams and organizations', 'Users', 'purple', 'Contact Sales', '/contact', false)
ON CONFLICT (tier_key) DO NOTHING;

-- Insert default features for Free tier
INSERT INTO public.tier_features (tier_id, feature_text, feature_type, display_order)
SELECT 
    id,
    unnest(ARRAY[
        '3 workflows',
        'Basic parsing (no AI)',
        'Manual workflow creation',
        'Interactive flowchart',
        'Basic exports (JSON, CSV, Text, Markdown)',
        '10 pre-built templates',
        'Community support',
        'No AI features',
        'Limited to 3 workflows',
        'No premium exports'
    ]),
    CASE 
        WHEN row_number() OVER () <= 7 THEN 'feature'
        ELSE 'limitation'
    END,
    row_number() OVER ()
FROM public.subscription_tiers
WHERE tier_key = 'free';

-- Insert default features for Pro tier
INSERT INTO public.tier_features (tier_id, feature_text, feature_type, display_order)
SELECT 
    id,
    unnest(ARRAY[
        'Unlimited workflows',
        'AI parsing (uses your OpenAI API key)',
        'AI analysis (comprehensive gap detection)',
        'AI chat (workflow assistance)',
        'All export formats (Mermaid, Draw.io, Notion)',
        'Interactive flowchart with decision nodes',
        'Advanced workflow analytics',
        'Priority email support',
        'API access',
        'Workflow templates library'
    ]),
    'feature',
    row_number() OVER ()
FROM public.subscription_tiers
WHERE tier_key = 'pro';

-- Insert default features for Enterprise tier
INSERT INTO public.tier_features (tier_id, feature_text, feature_type, display_order)
SELECT 
    id,
    unnest(ARRAY[
        'Everything in Pro',
        'Team collaboration (up to 10 users)',
        'Shared workflow library',
        'Advanced analytics dashboard',
        'White-label option (remove Kovari branding)',
        'Custom integrations (API webhooks)',
        'Priority phone support',
        'Dedicated account manager',
        'Custom onboarding',
        'SLA guarantees'
    ]),
    'feature',
    row_number() OVER ()
FROM public.subscription_tiers
WHERE tier_key = 'enterprise';

-- Insert default limits for tiers
INSERT INTO public.tier_limits (tier_id, limit_key, limit_value, limit_type)
SELECT 
    id,
    unnest(ARRAY['max_workflows', 'ai_enabled', 'max_team_members', 'api_access']),
    unnest(ARRAY['3', 'false', '1', 'false']),
    unnest(ARRAY['numeric', 'boolean', 'numeric', 'boolean'])
FROM public.subscription_tiers
WHERE tier_key = 'free';

INSERT INTO public.tier_limits (tier_id, limit_key, limit_value, limit_type)
SELECT 
    id,
    unnest(ARRAY['max_workflows', 'ai_enabled', 'max_team_members', 'api_access']),
    unnest(ARRAY['unlimited', 'true', '1', 'true']),
    unnest(ARRAY['text', 'boolean', 'numeric', 'boolean'])
FROM public.subscription_tiers
WHERE tier_key = 'pro';

INSERT INTO public.tier_limits (tier_id, limit_key, limit_value, limit_type)
SELECT 
    id,
    unnest(ARRAY['max_workflows', 'ai_enabled', 'max_team_members', 'api_access', 'white_label']),
    unnest(ARRAY['unlimited', 'true', '10', 'true', 'true']),
    unnest(ARRAY['text', 'boolean', 'numeric', 'boolean', 'boolean'])
FROM public.subscription_tiers
WHERE tier_key = 'enterprise';

-- Function to get all active tiers with features and limits
CREATE OR REPLACE FUNCTION public.get_active_subscription_tiers()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'id', st.id,
            'tier_key', st.tier_key,
            'name', st.name,
            'display_order', st.display_order,
            'price_monthly', st.price_monthly,
            'price_yearly', st.price_yearly,
            'currency', st.currency,
            'description', st.description,
            'icon', st.icon,
            'color', st.color,
            'cta_text', st.cta_text,
            'cta_link', st.cta_link,
            'is_popular', st.is_popular,
            'features', (
                SELECT json_agg(
                    json_build_object(
                        'id', tf.id,
                        'text', tf.feature_text,
                        'type', tf.feature_type,
                        'is_highlighted', tf.is_highlighted
                    )
                    ORDER BY tf.display_order
                )
                FROM public.tier_features tf
                WHERE tf.tier_id = st.id
            ),
            'limits', (
                SELECT json_object_agg(
                    tl.limit_key,
                    json_build_object(
                        'value', tl.limit_value,
                        'type', tl.limit_type
                    )
                )
                FROM public.tier_limits tl
                WHERE tl.tier_id = st.id
            )
        )
        ORDER BY st.display_order
    ) INTO result
    FROM public.subscription_tiers st
    WHERE st.is_active = true AND st.is_visible = true;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update tier (admin only)
CREATE OR REPLACE FUNCTION public.update_subscription_tier(
    p_tier_id UUID,
    p_updates JSON
)
RETURNS TEXT AS $$
DECLARE
    v_admin_check BOOLEAN;
    v_old_value TEXT;
    v_field TEXT;
BEGIN
    -- Check if user is admin
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) INTO v_admin_check;
    
    IF NOT v_admin_check THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    -- Update tier fields from JSON
    UPDATE public.subscription_tiers
    SET 
        name = COALESCE((p_updates->>'name')::TEXT, name),
        price_monthly = COALESCE((p_updates->>'price_monthly')::DECIMAL, price_monthly),
        price_yearly = COALESCE((p_updates->>'price_yearly')::DECIMAL, price_yearly),
        description = COALESCE((p_updates->>'description')::TEXT, description),
        is_popular = COALESCE((p_updates->>'is_popular')::BOOLEAN, is_popular),
        is_visible = COALESCE((p_updates->>'is_visible')::BOOLEAN, is_visible),
        cta_text = COALESCE((p_updates->>'cta_text')::TEXT, cta_text),
        updated_at = NOW(),
        updated_by = auth.uid()
    WHERE id = p_tier_id;
    
    -- Log the change
    INSERT INTO public.tier_change_history (tier_id, change_type, changed_by, new_value)
    VALUES (p_tier_id, 'tier_updated', auth.uid(), p_updates::TEXT);
    
    RETURN 'Tier updated successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add/update tier feature
CREATE OR REPLACE FUNCTION public.manage_tier_feature(
    p_tier_id UUID,
    p_feature_id UUID DEFAULT NULL,
    p_feature_text TEXT DEFAULT NULL,
    p_feature_type TEXT DEFAULT 'feature',
    p_display_order INTEGER DEFAULT 999,
    p_action TEXT DEFAULT 'add' -- 'add', 'update', 'delete'
)
RETURNS TEXT AS $$
DECLARE
    v_admin_check BOOLEAN;
BEGIN
    -- Check if user is admin
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%@kpbc.ca')
    ) INTO v_admin_check;
    
    IF NOT v_admin_check THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    IF p_action = 'add' THEN
        INSERT INTO public.tier_features (tier_id, feature_text, feature_type, display_order)
        VALUES (p_tier_id, p_feature_text, p_feature_type, p_display_order);
        RETURN 'Feature added successfully';
        
    ELSIF p_action = 'update' THEN
        UPDATE public.tier_features
        SET 
            feature_text = COALESCE(p_feature_text, feature_text),
            feature_type = COALESCE(p_feature_type, feature_type),
            display_order = COALESCE(p_display_order, display_order),
            updated_at = NOW()
        WHERE id = p_feature_id;
        RETURN 'Feature updated successfully';
        
    ELSIF p_action = 'delete' THEN
        DELETE FROM public.tier_features WHERE id = p_feature_id;
        RETURN 'Feature deleted successfully';
    END IF;
    
    RETURN 'Invalid action';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
