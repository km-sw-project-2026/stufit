-- Add status column to challenges table for tracking completion
ALTER TABLE challenges ADD COLUMN status TEXT DEFAULT NULL;

-- Create index for faster queries on status
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
