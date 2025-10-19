-- Create transactions table for PayPay credit card transaction data
CREATE TABLE IF NOT EXISTS transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_date timestamp with time zone NOT NULL,
  withdrawal_amount integer,
  deposit_amount integer,
  foreign_withdrawal_amount numeric(10, 2),
  currency text,
  conversion_rate numeric(10, 2),
  country text,
  transaction_type text NOT NULL,
  merchant text NOT NULL,
  payment_method text,
  payment_plan text,
  user_name text,
  transaction_number text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on transaction_date for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);

-- Create index on transaction_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_number ON transactions(transaction_number);

-- Create index on transaction_type for filtering
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE transactions IS 'PayPay credit card transaction records imported from CSV';
