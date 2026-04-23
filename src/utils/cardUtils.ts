import type { Card, GameState } from "../types/game";

// Retorna a carta no topo da pilha de descarte
export function topCard(state: GameState): Card | null {
  const pile = state.discard_pile;
  return pile.length > 0 ? pile[pile.length - 1] : null;
}

// Verifica se uma carta pode ser jogada contra o topo da pilha
export function canPlayCard(card: Card, top: Card, stackedCards: number): boolean {
  // Com penalidade acumulada, só pode empilhar mais +2
  if (stackedCards > 0) {
    return card.type === "plusTwo";
  }

  // Carta coringa: sempre jogável
  if (card.color === "none") return true;

  // Mesma cor
  if (card.color === top.color) return true;

  // Mesmo tipo (para especiais: jump, inverter, plusTwo)
  if (card.type !== "number" && card.type === top.type) return true;

  // Mesmo número
  if (card.type === "number" && top.type === "number" && card.value === top.value) return true;

  return false;
}

// Filtra as cartas jogáveis da mão do jogador
export function playableCards(hand: Card[], top: Card, stackedCards: number): Card[] {
  return hand.filter((card) => canPlayCard(card, top, stackedCards));
}

// Retorna o índice do próximo jogador
export function nextPlayerIndex(current: number, direction: 1 | -1, total: number): number {
  return (current + direction + total) % total;
}

// Classe CSS de cor para cada cor de carta
export const cardColorClass: Record<string, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  none: "bg-gray-800",
};

// Label legível para cada tipo de carta
export const cardTypeLabel: Record<string, string> = {
  number: "",
  jump: "⊘",
  inverter: "⇄",
  plusTwo: "+2",
  plusFour: "+4",
  joker: "★",
  colorSelect: "★",
};
