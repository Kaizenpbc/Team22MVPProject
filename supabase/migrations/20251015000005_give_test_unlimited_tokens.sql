-- Give user "test" unlimited tokens
-- This sets their workflow_limit to -1 (unlimited) and gives them max credits

-- First, let's find the test user
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT;
BEGIN
    -- Find user with email containing 'test' or username 'test'
    SELECT au.id, au.email INTO test_user_id, test_email
    FROM auth.users au
    WHERE au.email ILIKE '%test%' 
       OR au.raw_user_meta_data->>'full_name' ILIKE '%test%'
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Found test user: % (%)', test_email, test_user_id;
        
        -- Update user_profiles to give unlimited workflows and max credits
        UPDATE public.user_profiles 
        SET 
            workflow_limit = -1,  -- -1 means unlimited
            user_limit = -1,      -- Unlimited users too
            subscription_tier = 'enterprise',
            subscription_status = 'active',
            sop_access = TRUE,
            credits = 999999,     -- Give lots of credits
            lifetime_credits_purchased = 999999,
            updated_at = NOW()
        WHERE id = test_user_id;
        
        RAISE NOTICE 'Updated test user profile with unlimited access';
        
        -- Also add a credit transaction record
        INSERT INTO credit_transactions (
            user_id,
            amount,
            balance_after,
            transaction_type,
            metadata,
            created_at
        ) VALUES (
            test_user_id,
            999999,
            999999,
            'admin_adjustment',
            '{"reason": "Test user unlimited tokens", "admin": "system"}',
            NOW()
        );
        
        RAISE NOTICE 'Added credit transaction for test user';
        
    ELSE
        RAISE NOTICE 'No test user found. Searching for users with "test" in email or name...';
        
        -- Show all users for debugging
        FOR test_email IN 
            SELECT au.email FROM auth.users au ORDER BY au.created_at DESC LIMIT 5
        LOOP
            RAISE NOTICE 'User email: %', test_email;
        END LOOP;
    END IF;
END $$;

-- Show final result
SELECT 
    up.id,
    au.email,
    up.full_name,
    up.username,
    up.subscription_tier,
    up.workflow_limit,
    up.user_limit,
    up.credits,
    up.updated_at
FROM public.user_profiles up
INNER JOIN auth.users au ON up.id = au.id
WHERE au.email ILIKE '%test%' 
   OR up.username ILIKE '%test%'
   OR up.full_name ILIKE '%test%';
