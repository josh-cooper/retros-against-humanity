"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createGame(initialState: any) {
  const { data, error } = await supabase
    .from("games")
    .insert({ state: initialState })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/");
  return data.id;
}

export async function updateGameState(gameId: string, newState: any) {
  const { error } = await supabase
    .from("games")
    .update({ state: newState })
    .eq("id", gameId);

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
