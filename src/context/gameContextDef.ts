import { createContext } from "react";
import type { ConnectionStatus } from "../hooks/useWebSocket";
import type { Card, CardColor, GameState } from "../types/game";

export interface GameContextValue {
  nickname: string;
  setNickname: (name: string) => void;
  gameState: GameState | null;
  status: ConnectionStatus;
  serverError: string | null;
  clearServerError: () => void;
  join: (nickname: string) => void;
  startGame: () => void;
  playCard: (card: Card) => void;
  buyCard: () => void;
  sayUno: () => void;
  punish: () => void;
  selectColor: (color: CardColor) => void;
  acceptPenalty: () => void;
}

export const GameContext = createContext<GameContextValue | null>(null);
