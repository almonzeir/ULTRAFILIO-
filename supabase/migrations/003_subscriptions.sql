-- =====================================================
-- ULTRAFOLIO SUBSCRIPTION & PAYMENT SCHEMA
-- =====================================================
-- Run this in your Supabase SQL Editor to add subscription support

-- 1. SUBSCRIPTIONS TABLE
-- Tracks user subscription status and plan type
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro_monthly', 'pro_lifetime')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')) DEFAULT 'active',
    
    -- Payment info
    payment_provider TEXT, -- 'lemonsqueezy', 'paypal', 'paddle', etc.
    external_subscription_id TEXT, -- ID from payment provider
    external_customer_id TEXT, -- Customer ID from payment provider
    
    -- Pricing
    amount_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    is_first_month BOOLEAN DEFAULT false, -- For $3 promo tracking
    
    -- Dates
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ, -- NULL for lifetime, subscription end for monthly
    cancelled_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, status) -- One active subscription per user
);

-- 2. DAILY USAGE TABLE
-- Tracks daily portfolio generations for free tier limits
CREATE TABLE IF NOT EXISTS daily_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    generation_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, date) -- One record per user per day
);

-- 3. PAYMENT HISTORY TABLE
-- Logs all payment transactions
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    -- Transaction details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Payment provider details
    payment_provider TEXT NOT NULL,
    external_transaction_id TEXT,
    payment_method TEXT, -- 'card', 'paypal', etc.
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, date);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);

-- 5. ROW LEVEL SECURITY
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can read their own usage
CREATE POLICY "Users can view own usage" ON daily_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own usage (for incrementing generation count)
CREATE POLICY "Users can update own usage" ON daily_usage
    FOR ALL USING (auth.uid() = user_id);

-- Users can view their payment history
CREATE POLICY "Users can view own payments" ON payment_history
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage everything (for webhooks)
CREATE POLICY "Service role full access subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access daily_usage" ON daily_usage
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access payments" ON payment_history
    FOR ALL USING (auth.role() = 'service_role');

-- 6. HELPER FUNCTION: Check if user is pro
CREATE OR REPLACE FUNCTION is_user_pro(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions
        WHERE user_id = check_user_id
        AND status = 'active'
        AND plan_type IN ('pro_monthly', 'pro_lifetime')
        AND (end_date IS NULL OR end_date > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. HELPER FUNCTION: Get user's daily generation count
CREATE OR REPLACE FUNCTION get_daily_generations(check_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT generation_count INTO count
    FROM daily_usage
    WHERE user_id = check_user_id AND date = CURRENT_DATE;
    
    RETURN COALESCE(count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER: Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER daily_usage_updated_at
    BEFORE UPDATE ON daily_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- DONE! Your subscription system is ready.
-- Next: Configure your payment provider webhooks
-- =====================================================
