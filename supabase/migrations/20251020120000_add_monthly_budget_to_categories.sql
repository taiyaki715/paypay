-- Add monthly_budget column to categories table
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS monthly_budget integer;

-- Add comment to column
COMMENT ON COLUMN categories.monthly_budget IS 'Monthly budget amount in JPY (nullable, null means no budget set)';
