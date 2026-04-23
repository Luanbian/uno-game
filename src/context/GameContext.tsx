import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import type { Card, CardColor, ClientMessage, GameState } from "../types/game";
import { GameContext } from "./gameContextDef";

const WS_URL = "ws://localhost:8080/ws";

export function GameProvider({ children }: { children: ReactNode }) {
  const [nickname, setNickname] = useState("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleMessage = useCallback((msg: GameState) => {
    setGameState(msg);
  }, []);

  const handleError = useCallback((error: string) => {
    setServerError(error);
  }, []);

  const { status, send } = useWebSocket({
    url: WS_URL,
    onMessage: handleMessage,
    onError: handleError,
  });

  const sendWithNickname = useCallback(
    (msg: ClientMessage) => send(msg),
    [send],
  );

  const join = useCallback(
    (name: string) => {
      setNickname(name);
      sendWithNickname({ action: "join", nickname: name });
    },
    [sendWithNickname],
  );

  const startGame = useCallback(() => {
    sendWithNickname({ action: "start_game" });
  }, [sendWithNickname]);

  const playCard = useCallback(
    (card: Card) => {
      sendWithNickname({ action: "play_card", nickname, card });
    },
    [sendWithNickname, nickname],
  );

  const buyCard = useCallback(() => {
    sendWithNickname({ action: "buy_card", nickname });
  }, [sendWithNickname, nickname]);

  const sayUno = useCallback(() => {
    sendWithNickname({ action: "say_uno", nickname });
  }, [sendWithNickname, nickname]);

  const punish = useCallback(() => {
    sendWithNickname({ action: "punish_no_say_uno" });
  }, [sendWithNickname]);

  const selectColor = useCallback(
    (color: CardColor) => {
      sendWithNickname({
        action: "select_color",
        nickname,
        selected_color: color,
      });
    },
    [sendWithNickname, nickname],
  );

  const acceptPenalty = useCallback(() => {
    sendWithNickname({ action: "accept_penalty", nickname });
  }, [sendWithNickname, nickname]);

  const clearServerError = useCallback(() => setServerError(null), []);

  return (
    <GameContext.Provider
      value={{
        nickname,
        setNickname,
        gameState,
        status,
        serverError,
        clearServerError,
        join,
        startGame,
        playCard,
        buyCard,
        sayUno,
        punish,
        selectColor,
        acceptPenalty,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
