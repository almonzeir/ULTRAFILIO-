-- Create a table to track daily usage per user
CREATE TABLE IF NOT EXISTS daily_usage (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  date DATE NOT NULL,
  generation_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Security)
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage" 
ON daily_usage FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Function to check and increment usage (Atomic operation)
CREATE OR REPLACE FUNCTION check_and_increment_usage(check_user_id UUID, limit_count INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today DATE;
  current_count INTEGER;
BEGIN
  -- Get today's date in Malaysia Time (UTC+8)
  today := (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kuala_Lumpur')::DATE;
  
  -- Get current usage for today, or invoke default 0
  SELECT generation_count INTO current_count
  FROM daily_usage
  WHERE user_id = check_user_id AND date = today;

  IF current_count IS NULL THEN
    current_count := 0;
  END IF;

  -- Check if limit reached
  IF current_count >= limit_count THEN
    RETURN FALSE; -- Limit reached
  END IF;

  -- Increment usage
  INSERT INTO daily_usage (user_id, date, generation_count)
  VALUES (check_user_id, today, 1)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    -- If the date stored is different from today (i.e. it's a new day), reset to 1
    -- Else increment
    generation_count = CASE 
      WHEN daily_usage.date != today THEN 1 
      ELSE daily_usage.generation_count + 1 
    END,
    date = today,
    updated_at = NOW();
    
  RETURN TRUE; -- Success
END;
$$;
