import { useContext } from "react";
import { GameContext } from "../context/gameContextDef";
import type { GameContextValue } from "../context/gameContextDef";

export type { GameContextValue };

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame deve ser usado dentro de <GameProvider>");
  return ctx;
}
