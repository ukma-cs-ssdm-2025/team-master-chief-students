-- Add created_at column to expenses table if it doesn't exist
-- Note: This migration is for existing databases. V0 creates the table with created_at already.
-- This migration handles cases where the table exists without created_at column.

DO $$
BEGIN
    -- Add column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'expenses' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE expenses 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE;
        
        -- Update existing rows to have a default created_at value
        UPDATE expenses 
        SET created_at = CURRENT_TIMESTAMP 
        WHERE created_at IS NULL;
        
        -- Make the column NOT NULL after updating existing rows
        ALTER TABLE expenses 
        ALTER COLUMN created_at SET NOT NULL;
    END IF;
END $$;

