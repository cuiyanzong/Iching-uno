import type { GameCard, Element } from "@shared/schema";

export function canPlayCard(playCard: GameCard, currentCard: GameCard): boolean {
  const playElements = playCard.elements as Element[];
  const currentElements = currentCard.elements as Element[];
  
  // A card can be played if it shares at least one element with the current card
  return playElements.some(element => currentElements.includes(element));
}

export function isReverseCard(card: GameCard): boolean {
  // A card is a reverse card (互卦) if it has the same elements as another card
  // but in different order or arrangement
  return card.type === "reverse";
}

export function getNextPlayer(currentPlayer: number, totalPlayers: number, direction: "clockwise" | "counterclockwise"): number {
  if (direction === "clockwise") {
    return (currentPlayer + 1) % totalPlayers;
  } else {
    return currentPlayer === 0 ? totalPlayers - 1 : currentPlayer - 1;
  }
}

export function calculateScore(baseScore: number, remainingCards: number): number {
  return baseScore - remainingCards;
}

export function shuffleDeck<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
