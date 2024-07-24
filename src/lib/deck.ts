import { Card } from "@/types/game";
import { promptCards, answerCards } from "@/lib/cards";

export const fillHand = (prevHand: Card[]): Card[] => {
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

  for (let i = 0; i < numCardsToAdd; i++) {
    const randomIndex = Math.floor(Math.random() * answerCards.length);
    const content = answerCards[randomIndex];
    newHand.push({
      id: Math.random().toString(36).substr(2, 9),
      content: content,
      isBlank: content === "[BLANK]",
    });
  }

  return newHand;
};

export const getPromptCard = (): string => {
  return promptCards[Math.floor(Math.random() * promptCards.length)];
};
