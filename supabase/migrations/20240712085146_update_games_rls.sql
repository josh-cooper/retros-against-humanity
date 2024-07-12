-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to all users" ON games;

DROP POLICY IF EXISTS "Allow insert access to all users" ON games;

DROP POLICY IF EXISTS "Allow update access to all users" ON games;

-- Create a policy for read access (only allow access to the specific game)
CREATE POLICY "Allow read access to specific game" ON games
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND id = auth.uid()::uuid);

-- Create a policy for insert (only allow server to insert)
CREATE POLICY "Allow insert for server only" ON games FOR
INSERT
WITH
    CHECK (
        auth.jwt () IS NOT NULL
        AND auth.jwt () ->> 'role' = 'service_role'
    );

-- Create a policy for update (only allow server to update)
CREATE POLICY "Allow update for server only" ON games FOR
UPDATE USING (
    auth.jwt () IS NOT NULL
    AND auth.jwt () ->> 'role' = 'service_role'
);