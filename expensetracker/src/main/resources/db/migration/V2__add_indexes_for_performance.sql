-- Add indexes for cursor pagination and performance optimization

-- Index for user expenses cursor pagination (ORDER BY created_at DESC, id DESC)
CREATE INDEX IF NOT EXISTS idx_expenses_user_created_id 
ON expenses (user_id, created_at DESC, id DESC);

-- Index for team expenses cursor pagination
CREATE INDEX IF NOT EXISTS idx_expenses_team_created_id 
ON expenses (team_id, created_at DESC, id DESC) 
WHERE team_id IS NOT NULL;

-- Index for category lookups
CREATE INDEX IF NOT EXISTS idx_expenses_category 
ON expenses (category_id);

-- Index for user_id lookups (if not already exists from FK)
CREATE INDEX IF NOT EXISTS idx_expenses_user_id 
ON expenses (user_id);

