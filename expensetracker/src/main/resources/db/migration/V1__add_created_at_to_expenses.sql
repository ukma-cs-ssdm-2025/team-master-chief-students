-- Add created_at column to expenses table if it doesn't exist
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE;

-- Update existing rows to have a default created_at value (using current timestamp)
UPDATE expenses 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

-- Make the column NOT NULL after updating existing rows
ALTER TABLE expenses 
ALTER COLUMN created_at SET NOT NULL;

