import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameState, Card } from "@/types/game";
import { updateGameState, getGameState } from "@/lib/actions/multiplayer-state";
import { supabase } from "@/lib/supabase/client";
import { suggestDiscussionTopics } from "../actions/suggest";
import { fillHand, getPromptCard } from "../deck";

export const useGameState = (gameId: string) => {
  const queryClient = useQueryClient();
  const [playerName, setPlayerName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [hand, setHand] = useState<Card[]>([]);
  const [discussionTopics, setDiscussionTopics] = useState<string[]>([]);

  // Query for game state
  const { data: gameState } = useQuery<GameState>({
    queryKey: ["gameState", gameId],
    queryFn: () => getGameState(gameId),
    enabled: !!gameId,
  });

  // Mutation for updating game state
  const updateGameStateMutation = useMutation({
    mutationFn: (newState: GameState) => updateGameState(gameId, newState),
    onMutate: async (newState) => {
      await queryClient.cancelQueries({ queryKey: ["gameState", gameId] });
      const previousState = queryClient.getQueryData<GameState>([
        "gameState",
        gameId,
      ]);
      queryClient.setQueryData<GameState>(["gameState", gameId], newState);
      return { previousState };
    },
    onError: (err, newState, context) => {
      queryClient.setQueryData<GameState>(
        ["gameState", gameId],
        context?.previousState
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["gameState", gameId] });
    },
  });

  // Supabase real-time subscription
  useEffect(() => {
    if (!gameId) return;

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
          handleNewGameState(newState);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [gameId, queryClient, playerId]);

  const handleNewGameState = async (newState: GameState) => {
    queryClient.setQueryData<GameState>(["gameState", gameId], newState);

    if (isRoundEndedAndPlayerWon(newState)) {
      await fetchAndSetDiscussionTopics(newState);
    }
  };

  const isRoundEndedAndPlayerWon = (state: GameState): boolean => {
    return state.gamePhase === "roundEnd" && state.winner === playerId;
  };

  const fetchAndSetDiscussionTopics = async (state: GameState) => {
    const winningAnswer = state.playedCards[playerId];
    const topics = await suggestDiscussionTopics(
      state.currentPrompt,
      winningAnswer
    );
    setDiscussionTopics(topics);
  };

  const dealHand = (prevHand: Card[]): void => {
    const newHand = fillHand(prevHand);
    setHand(newHand);
  };

  const joinGame = async (name: string): Promise<void> => {
    const newPlayerId = Math.random().toString(36).substr(2, 9);
    setPlayerId(newPlayerId);
    setPlayerName(name);

    dealHand([]);

    const newState = {
      ...gameState!,
      players: {
        ...gameState!.players,
        [newPlayerId]: name,
      },
      currentPlayerId: gameState!.currentPlayerId || newPlayerId,
    };
    updateGameStateMutation.mutate(newState);
  };

  const playCard = async (playedCard: Card): Promise<void> => {
    const newState = {
      ...gameState!,
      playedCards: {
        ...gameState!.playedCards,
        [playerId]: playedCard.content,
      },
    };

    if (
      Object.keys(newState.playedCards).length ===
        Object.keys(newState.players).length &&
      Object.keys(newState.players).length > 1
    ) {
      newState.gamePhase = "voting";
    }

    updateGameStateMutation.mutate(newState);

    const newHand = hand.filter((card) => card.id !== playedCard.id);
    setHand(newHand);

    if (newHand.length < 3) {
      dealHand(newHand);
    }
  };

  const vote = async (votedPlayerId: string): Promise<void> => {
    const newState = {
      ...gameState!,
      votes: {
        ...gameState!.votes,
        [playerId]: votedPlayerId,
      },
    };

    // Check if this vote completes the voting phase
    const allPlayersVoted =
      Object.keys(newState.votes).length ===
      Object.keys(newState.players).length;

    if (allPlayersVoted) {
      newState.gamePhase = "roundEnd";
      newState.winner = determineWinner(newState.votes);
    }

    // Update the state
    updateGameStateMutation.mutate(newState);
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
      ...gameState!,
      round: gameState!.round + 1,
      gamePhase: "playing",
      playedCards: {},
      currentPrompt: getPromptCard(),
      currentPlayerId: Object.keys(gameState!.players)[
        gameState!.round % Object.keys(gameState!.players).length
      ],
      winner: null,
      votes: {},
    };
    updateGameStateMutation.mutate(newState);
    setDiscussionTopics([]);
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
