"use server";

import { supabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGame(initialState: any) {
  const { data, error } = await supabase
    .rpc("create_game", { initial_state: initialState })
    .single();

  if (error) throw error;
  revalidatePath("/");
  return data;
}

export async function updateGameState(gameId: string, newState: any) {
  const { error } = await supabase.rpc("update_game_state", {
    p_game_id: gameId,
    p_new_state: newState,
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function getGameState(gameId: string) {
  const { data, error } = await supabase
    .from("games")
    .select("state")
    .eq("id", gameId)
    .single();

  if (error) throw error;
  return data.state;
}
