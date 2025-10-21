-- Add is_excluded column to transactions table
ALTER TABLE transactions
ADD COLUMN is_excluded boolean DEFAULT false NOT NULL;

-- Create index on is_excluded for faster filtering
CREATE INDEX IF NOT EXISTS idx_transactions_is_excluded ON transactions(is_excluded);

-- Add comment to column
COMMENT ON COLUMN transactions.is_excluded IS 'Flag to exclude transaction from budget calculations and reports';
