-- Create a function to create a new game
CREATE OR REPLACE FUNCTION create_game(initial_state JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_game_id UUID;
BEGIN
  INSERT INTO games (state)
  VALUES (initial_state)
  RETURNING id INTO new_game_id;
  
  RETURN new_game_id;
END;
$$;

-- Create a function to update the game state
CREATE OR REPLACE FUNCTION update_game_state(p_game_id UUID, p_new_state JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE games
  SET state = p_new_state
  WHERE id = p_game_id;
END;
$$;