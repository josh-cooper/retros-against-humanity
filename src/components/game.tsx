"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shuffle, Copy, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import GameCard from "@/components/game-card";

// Define types
interface GameState {
  players: { [key: string]: string };
  currentPrompt: string;
  currentPlayerId: string | null;
  playedCards: { [key: string]: string };
}

interface Card {
  id: string;
  content: string;
  isBlank: boolean;
}

const promptCards: string[] = [
  "Ain't nobody got time for _____",
  "_____ is the hero we deserve, but not the one we need right now",
  "I'm not saying it was _____, but it was _____",
  "_____ : Ain't no party like a _____ party",
  "Nobody puts _____ in the corner",
];

const answerCards: string[] = [
  "Pair programming",
  "Standups that last forever",
  "The mythical man-month",
  "Technical debt",
  "Agile manifesto",
  "Sprint planning",
  "Retrospectives",
  "User stories",
  "Burndown charts",
  "Scrum master",
  "[BLANK]",
  "[BLANK]",
];

const RetrosAgainstHumanity: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    currentPrompt: "",
    currentPlayerId: null,
    playedCards: {},
  });
  const [playerName, setPlayerName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [hand, setHand] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isBlankCardDialogOpen, setIsBlankCardDialogOpen] =
    useState<boolean>(false);
  const [blankCardContent, setBlankCardContent] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameStateParam = urlParams.get("gameState");
    if (gameStateParam) {
      setGameState(JSON.parse(atob(gameStateParam)));
    } else {
      drawPromptCard();
    }
  }, []);

  const drawPromptCard = (): void => {
    const randomIndex = Math.floor(Math.random() * promptCards.length);
    setGameState((prevState) => ({
      ...prevState,
      currentPrompt: promptCards[randomIndex],
    }));
  };

  const dealHand = (): void => {
    const newHand: Card[] = [];
    for (let i = 0; i < 5; i++) {
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

  const selectCard = (cardId: string): void => {
    setSelectedCardId(cardId);
  };

  const playCard = (): void => {
    if (selectedCardId && playerId) {
      const selectedCard = hand.find((card) => card.id === selectedCardId);
      if (selectedCard && selectedCard.isBlank) {
        setIsBlankCardDialogOpen(true);
      } else if (selectedCard) {
        submitCard(selectedCard.content);
      }
    }
  };

  const submitCard = (content: string): void => {
    setGameState((prevState) => ({
      ...prevState,
      playedCards: {
        ...prevState.playedCards,
        [playerId]: content,
      },
    }));
    const newHand = hand.filter((card) => card.id !== selectedCardId);
    setHand(newHand);
    setSelectedCardId(null);

    if (newHand.length < 3) {
      dealHand();
    }
  };

  const handleBlankCardSubmit = (): void => {
    if (blankCardContent.trim() !== "") {
      submitCard(blankCardContent);
      setBlankCardContent("");
      setIsBlankCardDialogOpen(false);
    }
  };

  const joinGame = (): void => {
    if (playerName) {
      const newPlayerId = Math.random().toString(36).substr(2, 9);
      setPlayerId(newPlayerId);
      setGameState((prevState) => ({
        ...prevState,
        players: {
          ...prevState.players,
          [newPlayerId]: playerName,
        },
        currentPlayerId: prevState.currentPlayerId || newPlayerId,
      }));
      dealHand();
    }
  };

  const getShareLink = (): string => {
    const gameStateString = btoa(JSON.stringify(gameState));
    return `${window.location.origin}${window.location.pathname}?gameState=${gameStateString}`;
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
        <div className="mb-8 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPlayerName(e.target.value)
            }
            className="mb-4"
          />
          <Button onClick={joinGame} className="w-full">
            Join Game
          </Button>
        </div>
      ) : (
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
            <Button onClick={dealHand} variant="outline" className="px-8 py-2">
              <Shuffle className="mr-2 h-4 w-4" /> New Hand
            </Button>
            <Button
              onClick={copyShareLink}
              variant="outline"
              className="px-8 py-2"
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Share Link
            </Button>
          </div>

          {showAlert && (
            <Alert className="mb-8">
              <AlertDescription>
                Share link copied to clipboard!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>Players</CardHeader>
              <CardContent>
                {Object.entries(gameState.players).map(([id, name]) => (
                  <div key={id} className="flex items-center mb-2">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>
                      {name}{" "}
                      {id === gameState.currentPlayerId
                        ? "(Current Player)"
                        : ""}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>Played Cards</CardHeader>
              <CardContent>
                {Object.entries(gameState.playedCards).map(
                  ([playerId, card]) => (
                    <div key={playerId} className="mb-2">
                      <span className="font-semibold">
                        {gameState.players[playerId]}:
                      </span>{" "}
                      {card}
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          <Dialog
            open={isBlankCardDialogOpen}
            onOpenChange={setIsBlankCardDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fill in the blank card</DialogTitle>
              </DialogHeader>
              <Input
                type="text"
                placeholder="Enter your answer"
                value={blankCardContent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBlankCardContent(e.target.value)
                }
              />
              <DialogFooter>
                <Button
                  onClick={() => setIsBlankCardDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleBlankCardSubmit}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default RetrosAgainstHumanity;
