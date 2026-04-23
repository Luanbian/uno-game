import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ClientMessage, ServerMessage } from "../types/game";
import { isServerError } from "../types/game";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

interface UseWebSocketOptions {
  url: string;
  onMessage: (msg: ServerMessage) => void;
  onError?: (error: string) => void;
}

interface UseWebSocketReturn {
  status: ConnectionStatus;
  send: (msg: ClientMessage) => void;
  disconnect: () => void;
}

const RECONNECT_DELAY_MS = 2000;

export function useWebSocket({
  url,
  onMessage,
  onError,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectRef = useRef<() => void>(() => {});
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  useLayoutEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
  });

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    wsRef.current?.close();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      clearReconnectTimer();
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as ServerMessage;
        if (isServerError(parsed)) {
          onErrorRef.current?.(parsed.error);
        } else {
          onMessageRef.current(parsed);
        }
      } catch {
        console.error("Mensagem inválida recebida:", event.data);
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
      reconnectTimerRef.current = setTimeout(
        () => connectRef.current(),
        RECONNECT_DELAY_MS,
      );
    };

    ws.onerror = () => {
      setStatus("disconnected");
    };
  }, [url, clearReconnectTimer]);

  useLayoutEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    clearReconnectTimer();
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("disconnected");
  }, [clearReconnectTimer]);

  const send = useCallback((msg: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket não está conectado. Mensagem descartada:", msg);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearReconnectTimer();
      wsRef.current?.close();
    };
  }, [connect, clearReconnectTimer]);

  return { status, send, disconnect };
}
