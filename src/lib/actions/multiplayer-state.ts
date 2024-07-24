"use server";

import { supabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getPromptCard } from "../deck";
import { GameState } from "@/types/game";

async function postNewGame(initialState: any) {
  const { data, error } = await supabase
    .rpc("create_game", { initial_state: initialState })
    .single();

  if (error) throw error;
  revalidatePath("/");
  return data;
}

export async function createNewGame() {
  const initialState: GameState = {
    players: {},
    currentPrompt: getPromptCard(),
    currentPlayerId: null,
    playedCards: {},
    round: 0,
    gamePhase: "playing",
    winner: null,
    votes: {},
  };

  const newGameId = await postNewGame(initialState);
  return newGameId;
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
