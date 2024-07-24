import { useState, useEffect } from "react";
import { GameState, Card } from "@/types/game";
import { updateGameState, getGameState } from "@/lib/actions/multiplayer-state";
import { supabase } from "@/lib/supabase/client";
import { suggestDiscussionTopics } from "../actions/suggest";
import { fillHand, getPromptCard } from "../deck";

export const useGameState = (gameId: string) => {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    currentPrompt: "",
    currentPlayerId: null,
    playedCards: {},
    round: 0,
    gamePhase: "playing",
    winner: null,
    votes: {},
  });
  const [playerName, setPlayerName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [hand, setHand] = useState<Card[]>([]);
  const [discussionTopics, setDiscussionTopics] = useState<string[]>([]);

  useEffect(() => {
    fetchGameState(gameId);
  }, [gameId]);

  useEffect(() => {
    if (gameId) {
      const subscription = supabase
        .channel(`games`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "games",
            filter: `id=eq.${gameId}`,
          },
          (payload) => {
            const newState = (payload.new as { [key: string]: any })
              .state as GameState;
            setGameState((prevState) => ({
              ...prevState,
              ...newState,
            }));
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [gameId]);

  const fetchGameState = async (gameId: string) => {
    const state = await getGameState(gameId);
    setGameState(state);
    if (playerId) {
      dealHand([]);
    }
  };

  const dealHand = (prevHand: Card[]): void => {
    const newHand = fillHand(prevHand);
    setHand(newHand);
  };

  const joinGame = async (name: string): Promise<void> => {
    const newPlayerId = Math.random().toString(36).substr(2, 9);
    setPlayerId(newPlayerId);
    setPlayerName(name);

    // Optimistically deal the initial hand
    dealHand([]);

    const newState = {
      ...gameState,
      players: {
        ...gameState.players,
        [newPlayerId]: name,
      },
      currentPlayerId: gameState.currentPlayerId || newPlayerId,
    };
    setGameState(newState);
    await updateGameState(gameId!, newState);
  };

  const playCard = async (playedCard: Card): Promise<void> => {
    const newState = {
      ...gameState,
      playedCards: {
        ...gameState.playedCards,
        [playerId]: playedCard.content,
      },
    };

    // Check if all players have played their cards
    if (
      Object.keys(newState.playedCards).length ===
        Object.keys(newState.players).length &&
      Object.keys(newState.players).length > 1
    ) {
      newState.gamePhase = "voting";
    }

    setGameState(newState);
    await updateGameState(gameId!, newState);

    const newHand = hand.filter((card) => card.id !== playedCard.id);
    setHand(newHand);

    if (newHand.length < 3) {
      dealHand(newHand);
    }
  };

  const vote = async (votedPlayerId: string): Promise<void> => {
    const newState = {
      ...gameState,
      votes: {
        ...gameState.votes,
        [playerId]: votedPlayerId,
      },
    };

    // Check if all players have voted
    if (
      Object.keys(newState.votes).length ===
      Object.keys(newState.players).length
    ) {
      newState.gamePhase = "roundEnd";
      newState.winner = await determineWinner(newState.votes);
    }

    setGameState(newState);
    await updateGameState(gameId!, newState);
  };

  const determineWinner = async (
    votes: Record<string, string>
  ): Promise<string> => {
    const voteCounts: Record<string, number> = {};
    Object.values(votes).forEach((votedPlayerId) => {
      voteCounts[votedPlayerId] = (voteCounts[votedPlayerId] || 0) + 1;
    });
    const winnerId = Object.entries(voteCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    // Get discussion topics for the winning answer
    const winningAnswer = gameState.playedCards[winnerId];
    const topics = await suggestDiscussionTopics(
      gameState.currentPrompt,
      winningAnswer
    );
    setDiscussionTopics(topics);

    return winnerId;
  };

  const startNewRound = async (): Promise<void> => {
    const newState: GameState = {
      ...gameState,
      round: gameState.round + 1,
      gamePhase: "playing",
      playedCards: {},
      currentPrompt: getPromptCard(),
      currentPlayerId: Object.keys(gameState.players)[
        gameState.round % Object.keys(gameState.players).length
      ],
      winner: null,
      votes: {}, // Reset votes for the new round
    };
    setGameState(newState);
    await updateGameState(gameId!, newState);
  };

  return {
    gameState,
    playerId,
    playerName,
    hand,
    joinGame,
    playCard,
    dealHand,
    startNewRound,
    vote,
    discussionTopics,
  };
};
