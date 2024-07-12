export interface GameState {
  players: { [key: string]: string };
  currentPrompt: string;
  currentPlayerId: string | null;
  playedCards: { [key: string]: string };
  round: number;
  gamePhase: "playing" | "voting" | "roundEnd";
  winner: string | null;
  votes: { [key: string]: string };
}

export interface Card {
  id: string;
  content: string;
  isBlank: boolean;
}
