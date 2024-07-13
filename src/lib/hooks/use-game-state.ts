import { useState, useEffect } from "react";
import { GameState, Card } from "@/types/game";
import { promptCards, answerCards } from "@/lib/cards";
import {
  createGame,
  updateGameState,
  getGameState,
} from "@/lib/actions/multiplayer-state";
import { supabase } from "@/lib/supabase/client";

export const useGameState = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    currentPrompt: promptCards[Math.floor(Math.random() * promptCards.length)],
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameIdParam = urlParams.get("gameId");
    if (gameIdParam) {
      setGameId(gameIdParam);
      fetchGameState(gameIdParam);
    } else {
      createNewGame();
    }
  }, []);

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

  const createNewGame = async () => {
    const newGameState: GameState = {
      players: {},
      currentPrompt:
        promptCards[Math.floor(Math.random() * promptCards.length)],
      currentPlayerId: null,
      playedCards: {},
      round: 0,
      gamePhase: "playing",
      winner: null,
      votes: {},
    };
    const newGameId = await createGame(newGameState);
    setGameId(newGameId as string);
    setGameState(newGameState);
    window.history.replaceState(null, "", `?gameId=${newGameId}`);
  };

  const dealHand = (prevHand: Card[]): void => {
    console.log("Dealing new hand with prevHand:", prevHand);
    const newHand: Card[] = [...prevHand];

    const hasBlank = newHand.some((card) => card.isBlank);
    if (!hasBlank) {
      newHand.push({
        id: Math.random().toString(36).substr(2, 9),
        content: "[BLANK]",
        isBlank: true,
      });
    }

    const numCardsToAdd = 5 - newHand.length;

    console.log("numCardsToAdd", numCardsToAdd);

    for (let i = 0; i < numCardsToAdd; i++) {
      const randomIndex = Math.floor(Math.random() * answerCards.length);
      const content = answerCards[randomIndex];
      newHand.push({
        id: Math.random().toString(36).substr(2, 9),
        content: content,
        isBlank: content === "[BLANK]",
      });
    }
    setHand(newHand);
  };

  const joinGame = async (name: string): Promise<void> => {
    const newPlayerId = Math.random().toString(36).substr(2, 9);
    setPlayerId(newPlayerId);
    setPlayerName(name);
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
    dealHand([]);
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
      newState.winner = determineWinner(newState.votes);
    }

    setGameState(newState);
    await updateGameState(gameId!, newState);
  };

  const determineWinner = (votes: Record<string, string>): string => {
    const voteCounts: Record<string, number> = {};
    Object.values(votes).forEach((votedPlayerId) => {
      voteCounts[votedPlayerId] = (voteCounts[votedPlayerId] || 0) + 1;
    });
    return Object.entries(voteCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
  };

  const startNewRound = async (): Promise<void> => {
    const newState: GameState = {
      ...gameState,
      round: gameState.round + 1,
      gamePhase: "playing",
      playedCards: {},
      currentPrompt:
        promptCards[Math.floor(Math.random() * promptCards.length)],
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
    gameId,
    gameState,
    playerId,
    playerName,
    hand,
    joinGame,
    playCard,
    dealHand,
    startNewRound,
    vote, // Add this line to expose the vote function
  };
};
