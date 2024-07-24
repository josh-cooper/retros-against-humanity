"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createNewGame } from "@/lib/actions/multiplayer-state";

export default function StartNewGameButton() {
  const router = useRouter();

  const handleStartGame = async () => {
    const gameId = await createNewGame();
    router.push(`/game/${gameId}`);
  };

  return (
    <Button
      onClick={handleStartGame}
      className="px-8 py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md transition duration-300 ease-in-out"
    >
      Start New Game
    </Button>
  );
}
