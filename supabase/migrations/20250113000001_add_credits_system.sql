-- Credits System Migration
-- Adds credits-based pricing to the platform

-- Add credits column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_credits_purchased INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lifetime_credits_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_credit_purchase_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive = add credits, negative = use credits
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'bonus', 'refund', 'admin_adjustment')),
  feature_used TEXT, -- 'ai_parse', 'ai_analysis', 'ai_chat', 'premium_export', 'workflow_save'
  workflow_id TEXT, -- optional reference to workflow
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create credit_packages table
CREATE TABLE IF NOT EXISTS credit_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  bonus_credits INTEGER DEFAULT 0,
  price_cents INTEGER NOT NULL, -- price in cents ($10 = 1000)
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default credit packages
INSERT INTO credit_packages (id, name, credits, bonus_credits, price_cents, is_popular, sort_order) VALUES
  ('starter', 'Starter Pack', 100, 0, 1000, FALSE, 1),
  ('popular', 'Popular Pack', 500, 100, 5000, TRUE, 2),
  ('value', 'Best Value Pack', 1000, 500, 10000, FALSE, 3),
  ('enterprise', 'Enterprise Pack', 5000, 2000, 30000, FALSE, 4)
ON CONFLICT (id) DO NOTHING;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);

-- Function to get user credit balance
CREATE OR REPLACE FUNCTION get_user_credits(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  SELECT COALESCE(credits, 0) INTO v_credits
  FROM user_profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(v_credits, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update user profile
  UPDATE user_profiles
  SET 
    credits = COALESCE(credits, 0) + p_amount,
    lifetime_credits_purchased = COALESCE(lifetime_credits_purchased, 0) + p_amount,
    last_credit_purchase_at = CASE 
      WHEN p_transaction_type = 'purchase' THEN NOW() 
      ELSE last_credit_purchase_at 
    END
  WHERE id = p_user_id
  RETURNING credits INTO v_new_balance;
  
  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    amount,
    balance_after,
    transaction_type,
    metadata
  ) VALUES (
    p_user_id,
    p_amount,
    v_new_balance,
    p_transaction_type,
    p_metadata
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_feature_used TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT COALESCE(credits, 0) INTO v_current_balance
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Check if enough credits
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits. Have: %, Need: %', v_current_balance, p_amount;
  END IF;
  
  -- Deduct credits
  UPDATE user_profiles
  SET 
    credits = credits - p_amount,
    lifetime_credits_used = COALESCE(lifetime_credits_used, 0) + p_amount
  WHERE id = p_user_id
  RETURNING credits INTO v_new_balance;
  
  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    amount,
    balance_after,
    transaction_type,
    feature_used,
    metadata
  ) VALUES (
    p_user_id,
    -p_amount,
    v_new_balance,
    'usage',
    p_feature_used,
    p_metadata
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has enough credits
CREATE OR REPLACE FUNCTION has_enough_credits(
  p_user_id UUID,
  p_required INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT COALESCE(credits, 0) INTO v_balance
  FROM user_profiles
  WHERE id = p_user_id;
  
  RETURN v_balance >= p_required;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant free starter credits to existing users
UPDATE user_profiles 
SET credits = COALESCE(credits, 0) + 10
WHERE credits = 0 OR credits IS NULL;

COMMENT ON TABLE credit_transactions IS 'Tracks all credit purchases and usage';
COMMENT ON TABLE credit_packages IS 'Available credit packages for purchase';
COMMENT ON FUNCTION get_user_credits IS 'Get current credit balance for a user';
COMMENT ON FUNCTION add_credits IS 'Add credits to user account (purchase, bonus, refund)';
COMMENT ON FUNCTION deduct_credits IS 'Deduct credits from user account (usage)';
COMMENT ON FUNCTION has_enough_credits IS 'Check if user has enough credits for a feature';

