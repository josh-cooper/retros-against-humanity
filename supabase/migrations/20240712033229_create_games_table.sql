-- Create the games table
CREATE TABLE games (
    id UUID DEFAULT uuid_generate_v4 () PRIMARY KEY,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        state JSONB NOT NULL
);

-- Create an index on the id column for faster lookups
CREATE INDEX idx_games_id ON games (id);

-- Set up row-level security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create policies for read and write access
CREATE POLICY "Allow read access to all users" ON games FOR
SELECT USING (true);

CREATE POLICY "Allow insert access to all users" ON games FOR
INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow update access to all users" ON games FOR
UPDATE USING (true);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_games_modtime BEFORE
UPDATE ON games FOR EACH ROW
EXECUTE FUNCTION update_modified_column ();