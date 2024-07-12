import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { GameState } from "@/types/game";

interface GameInfoProps {
  gameState: GameState;
  playerId: string;
  onSelectWinner: (winningPlayerId: string) => void;
}

const GameInfo: React.FC<GameInfoProps> = ({
  gameState,
  playerId,
  onSelectWinner,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>Players</CardHeader>
        <CardContent>
          {Object.entries(gameState.players).map(([id, name]) => (
            <div key={id} className="flex items-center mb-2">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>
                {name}{" "}
                {id === gameState.currentPlayerId ? "(Current Player)" : ""}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Played Cards</CardHeader>
        <CardContent>
          {Object.entries(gameState.playedCards).map(([playerId, card]) => (
            <div key={playerId} className="mb-2">
              <span className="font-semibold">
                {gameState.players[playerId]}:
              </span>{" "}
              {card}
              {gameState.gamePhase === "judging" &&
                playerId === gameState.currentPlayerId && (
                  <Button
                    onClick={() => onSelectWinner(playerId)}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    Select Winner
                  </Button>
                )}
              {gameState.gamePhase === "roundEnd" &&
                playerId === gameState.winner && (
                  <span className="ml-2 text-green-600 font-bold">Winner!</span>
                )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInfo;
