import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import GameCard from "@/components/game/game-card";
import { GameState, Card } from "@/types/game";
import BlankCardDialog from "./blank-card-dialog";

interface GameBoardProps {
  gameState: GameState;
  hand: Card[];
  playerId: string;
  onPlayCard: (content: string) => void;
  onDealHand: () => void;
  onStartNewRound: () => void;
  onVote: (votedPlayerId: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  hand,
  playerId,
  onPlayCard,
  onDealHand,
  onStartNewRound,
  onVote,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isBlankCardDialogOpen, setIsBlankCardDialogOpen] =
    useState<boolean>(false);

  const selectCard = (cardId: string): void => {
    setSelectedCardId(cardId);
  };

  const playCard = (): void => {
    if (selectedCardId) {
      const selectedCard = hand.find((card) => card.id === selectedCardId);
      if (selectedCard && selectedCard.isBlank) {
        setIsBlankCardDialogOpen(true);
      } else if (selectedCard) {
        onPlayCard(selectedCard.content);
      }
    }
  };

  const handleBlankCardSubmit = (content: string): void => {
    onPlayCard(content);
    setIsBlankCardDialogOpen(false);
  };

  return (
    <>
      <div className="mb-8 flex justify-center">
        <GameCard
          id="prompt"
          content={gameState.currentPrompt}
          isPrompt={true}
          isSelected={false}
          isBlank={false}
          onClick={() => {}}
        />
      </div>

      {gameState.gamePhase === "playing" && (
        <>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {hand.map((card) => (
              <GameCard
                key={card.id}
                id={card.id}
                content={card.content}
                isPrompt={false}
                isSelected={selectedCardId === card.id}
                isBlank={card.isBlank}
                onClick={selectCard}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={playCard}
              disabled={!selectedCardId}
              className="px-8 py-2"
            >
              Play Card
            </Button>
            <Button
              onClick={onDealHand}
              variant="outline"
              className="px-8 py-2"
            >
              <Shuffle className="mr-2 h-4 w-4" /> New Hand
            </Button>
          </div>
        </>
      )}

      {gameState.gamePhase === "voting" && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(gameState.playedCards).map(([playerId, content]) => (
            <div key={playerId} className="flex flex-col items-center">
              <GameCard
                id={playerId}
                content={content}
                isPrompt={false}
                isSelected={false}
                isBlank={false}
                onClick={() => onVote(playerId)}
              />
              <Button
                onClick={() => onVote(playerId)}
                className="mt-2"
                disabled={gameState.votes[playerId] !== undefined}
              >
                Vote
              </Button>
            </div>
          ))}
        </div>
      )}

      {gameState.gamePhase === "roundEnd" && (
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Winner:</h2>
          <GameCard
            id={gameState.winner!}
            content={gameState.playedCards[gameState.winner!]}
            isPrompt={false}
            isSelected={false}
            isBlank={false}
            onClick={() => {}}
          />
          <p className="mt-2 text-xl">
            {gameState.players[gameState.winner!]} wins this round!
          </p>
          {playerId === gameState.currentPlayerId && (
            <Button onClick={onStartNewRound} className="mt-4 px-8 py-2">
              Start New Round
            </Button>
          )}
        </div>
      )}

      <BlankCardDialog
        isOpen={isBlankCardDialogOpen}
        onClose={() => setIsBlankCardDialogOpen(false)}
        onSubmit={handleBlankCardSubmit}
      />
    </>
  );
};

export default GameBoard;
