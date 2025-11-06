-- Add indexes for refresh tokens table

-- Index for token lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token 
ON refresh_tokens (token);

-- Index for user_id lookups (for cleanup operations)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id 
ON refresh_tokens (user_id);

