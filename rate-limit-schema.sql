-- Rate limiting table - minimal approach
CREATE TABLE daily_usage (
  ip TEXT NOT NULL,
  date DATE NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (ip, date)
);

-- Function to increment and return new count
CREATE OR REPLACE FUNCTION increment_usage(_ip TEXT, _date DATE)
RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO daily_usage (ip, date, count)
  VALUES (_ip, _date, 1)
  ON CONFLICT (ip, date)
  DO UPDATE SET count = daily_usage.count + 1
  RETURNING count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Function to reset usage for paid users (add bonus credits)
CREATE OR REPLACE FUNCTION reset_usage_for_paid(_ip TEXT, _bonus_credits INTEGER DEFAULT 5)
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  -- Reset today's count to negative value (gives bonus credits)
  INSERT INTO daily_usage (ip, date, count)
  VALUES (_ip, CURRENT_DATE, -_bonus_credits)
  ON CONFLICT (ip, date)
  DO UPDATE SET count = -_bonus_credits;
END;
$$;

-- Get current usage for an IP
CREATE OR REPLACE FUNCTION get_usage(_ip TEXT, _date DATE)
RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
  current_count INTEGER;
BEGIN
  SELECT count INTO current_count
  FROM daily_usage
  WHERE ip = _ip AND date = _date;
  
  RETURN COALESCE(current_count, 0);
END;
$$;

-- Cleanup old entries (optional - for keeping DB tidy)
CREATE OR REPLACE FUNCTION cleanup_old_usage()
RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM daily_usage
  WHERE date < CURRENT_DATE - INTERVAL '7 days';
END;
$$;
