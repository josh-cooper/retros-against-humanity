"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy } from "lucide-react";
import GameBoard from "./game-board";
import PlayerJoin from "./player-join";
import GameInfo from "./game-info";
import { useGameState } from "@/lib/hooks/use-game-state";

const RetrosAgainstHumanity: React.FC<{ gameId: string }> = ({ gameId }) => {
  const {
    gameState,
    playerId,
    hand,
    joinGame,
    playCard,
    dealHand,
    startNewRound,
    vote,
    discussionTopics,
  } = useGameState(gameId);

  const [showAlert, setShowAlert] = useState<boolean>(false);

  const getShareLink = (): string => {
    return `${window.location.origin}${window.location.pathname}?gameId=${gameId}`;
  };

  const copyShareLink = (): void => {
    navigator.clipboard.writeText(getShareLink());
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Multiplayer Retros Against Humanity
      </h1>

      {!playerId ? (
        <PlayerJoin onJoin={joinGame} />
      ) : gameState ? (
        <>
          <GameBoard
            gameState={gameState}
            hand={hand}
            playerId={playerId}
            onPlayCard={playCard}
            onDealHand={() => dealHand([])}
            onStartNewRound={startNewRound}
            onVote={vote}
            discussionTopics={discussionTopics}
          />

          <Button
            onClick={copyShareLink}
            variant="outline"
            className="px-8 py-2 mb-8"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Share Link
          </Button>

          {showAlert && (
            <Alert className="mb-8">
              <AlertDescription>
                Share link copied to clipboard!
              </AlertDescription>
            </Alert>
          )}

          <GameInfo
            gameState={gameState}
            playerId={playerId}
            onSelectWinner={vote}
          />
        </>
      ) : (
        <p>Loading game state...</p>
      )}
    </div>
  );
};

export default RetrosAgainstHumanity;
