// --- Enums do domínio ---

export type CardColor = "red" | "green" | "blue" | "yellow" | "none";

export type CardType =
  | "number"
  | "jump"
  | "inverter"
  | "plusTwo"
  | "plusFour"
  | "joker"
  | "colorSelect";

export type GameAction =
  | "join"
  | "start_game"
  | "play_card"
  | "buy_card"
  | "say_uno"
  | "punish_no_say_uno"
  | "select_color"
  | "accept_penalty";

// --- Carta ---

export interface Card {
  color: CardColor;
  type: CardType;
  value: number; // 0-9 para números, -1 para especiais
}

// --- Estado do jogo (broadcast do servidor) ---

export interface GameState {
  hands: Record<string, Card[]>;
  discard_pile: Card[];
  players: string[];
  current_player: number;
  last_player: number;
  said_uno: Record<string, boolean>;
  winner?: string;
  direction: 1 | -1;
  stacked_cards: number;
}

// --- Mensagens Cliente → Servidor ---

export interface JoinMessage {
  action: "join";
  nickname: string;
}

export interface StartGameMessage {
  action: "start_game";
}

export interface PlayCardMessage {
  action: "play_card";
  nickname: string;
  card: Card;
}

export interface BuyCardMessage {
  action: "buy_card";
  nickname: string;
}

export interface SayUnoMessage {
  action: "say_uno";
  nickname: string;
}

export interface PunishMessage {
  action: "punish_no_say_uno";
}

export interface SelectColorMessage {
  action: "select_color";
  nickname: string;
  selected_color: CardColor;
}

export interface AcceptPenaltyMessage {
  action: "accept_penalty";
  nickname: string;
}

export type ClientMessage =
  | JoinMessage
  | StartGameMessage
  | PlayCardMessage
  | BuyCardMessage
  | SayUnoMessage
  | PunishMessage
  | SelectColorMessage
  | AcceptPenaltyMessage;

// --- Mensagens Servidor → Cliente ---

export interface ServerError {
  error: string;
}

export type ServerMessage = GameState | ServerError;

// --- Helpers de tipo ---

export function isServerError(msg: ServerMessage): msg is ServerError {
  return "error" in msg;
}

export function isWildCard(card: Card): boolean {
  return card.color === "none";
}

export function isSpecialCard(card: Card): boolean {
  return card.type !== "number";
}
