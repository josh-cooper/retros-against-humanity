"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { createNewGame } from "@/lib/actions/multiplayer-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function StartNewGameButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const createGameMutation = useMutation({
    mutationFn: createNewGame,
    onSuccess: (gameId) => {
      setIsRedirecting(true);
      router.push(`/game/${gameId}`);
    },
    onError: (error) => {
      console.error("Failed to create new game:", error);
      setError("Failed to create a new game. Please try again.");
      setIsRedirecting(false);
    },
  });

  const handleStartGame = () => {
    setError(null);
    createGameMutation.mutate();
  };

  const isLoading = createGameMutation.isPending || isRedirecting;

  return (
    <>
      <Button
        onClick={handleStartGame}
        disabled={isLoading}
        className="px-8 py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out"
      >
        {isLoading ? "Creating Game..." : "Start New Game"}
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
