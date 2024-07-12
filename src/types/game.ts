export interface GameState {
  players: { [key: string]: string };
  currentPrompt: string;
  currentPlayerId: string | null;
  playedCards: { [key: string]: string };
  round: number;
  gamePhase: "playing" | "judging" | "roundEnd";
  winner: string | null;
}

export interface Card {
  id: string;
  content: string;
  isBlank: boolean;
}
