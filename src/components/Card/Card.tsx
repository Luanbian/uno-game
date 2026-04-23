import type { Card as CardType, CardColor } from "../../types/game";

// --- Props ---

export interface CardProps {
  card: CardType;
  onClick?: () => void;
  playable?: boolean; // pode ser jogada agora
  selected?: boolean; // selecionada pelo jogador
  faceDown?: boolean; // carta virada (mão dos oponentes)
  size?: "sm" | "md" | "lg";
}

// --- Mapeamentos visuais ---

const bgColor: Record<CardColor, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  none: "bg-gray-950",
};

const textColor: Record<CardColor, string> = {
  red: "text-red-500",
  green: "text-green-500",
  blue: "text-blue-500",
  yellow: "text-yellow-400",
  none: "text-white",
};

const sizeClasses = {
  sm: { card: "w-12 h-[4.5rem]", label: "text-xs", center: "text-lg" },
  md: { card: "w-20 h-28", label: "text-sm", center: "text-2xl" },
  lg: { card: "w-28 h-40", label: "text-base", center: "text-4xl" },
};

function cardLabel(card: CardType): string {
  switch (card.type) {
    case "number":
      return String(card.value);
    case "jump":
      return "⊘";
    case "inverter":
      return "↺";
    case "plusTwo":
      return "+2";
    case "plusFour":
      return "+4";
    case "joker":
      return "★";
    case "colorSelect":
      return "★";
  }
}

// --- Componente principal ---

export function Card({
  card,
  onClick,
  playable,
  selected,
  faceDown,
  size = "md",
}: CardProps) {
  const isWild = card.color === "none";
  const isClickable = !!onClick && !faceDown;
  const sc = sizeClasses[size];

  if (faceDown) return <CardBack size={size} />;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      className={[
        sc.card,
        "relative rounded-xl border-2 border-white/80 select-none flex-shrink-0",
        bgColor[card.color],
        "flex flex-col items-center justify-center",
        "shadow-md transition-all duration-150",
        // estados interativos
        isClickable ? "cursor-pointer" : "cursor-default",
        playable && !selected
          ? "hover:-translate-y-3 hover:shadow-xl hover:ring-2 hover:ring-white/60"
          : "",
        selected
          ? "-translate-y-5 ring-4 ring-yellow-300 ring-offset-2 ring-offset-gray-900 shadow-xl"
          : "",
        !playable && isClickable ? "opacity-50" : "",
      ].join(" ")}
    >
      {/* Label topo-esquerda */}
      <span
        className={`absolute top-1 left-1.5 font-black leading-none ${sc.label} text-white drop-shadow`}
      >
        {cardLabel(card)}
      </span>

      {/* Centro da carta */}
      <div
        className={`
        rounded-full flex items-center justify-center
        ${size === "sm" ? "w-7 h-7" : ""}
        ${size === "md" ? "w-11 h-11" : ""}
        ${size === "lg" ? "w-16 h-16" : ""}
        ${isWild ? "" : "bg-white/90"}
      `}
      >
        {isWild ? (
          <WildCenter size={size} label={cardLabel(card)} />
        ) : (
          <span className={`font-black ${sc.center} ${textColor[card.color]}`}>
            {cardLabel(card)}
          </span>
        )}
      </div>

      {/* Label baixo-direita (rotacionado 180°) */}
      <span
        className={`absolute bottom-1 right-1.5 font-black leading-none ${sc.label} text-white drop-shadow rotate-180`}
      >
        {cardLabel(card)}
      </span>
    </div>
  );
}

// --- Carta virada (costas) ---

function CardBack({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sc = sizeClasses[size];
  return (
    <div
      className={`
      ${sc.card} rounded-xl border-2 border-white/80 bg-red-700
      flex items-center justify-center flex-shrink-0 shadow-md
    `}
    >
      <div className="rounded-lg border-2 border-white/60 w-[70%] h-[80%] bg-red-800 flex items-center justify-center">
        <span
          className={`font-black text-yellow-300 ${sc.center} italic tracking-tighter`}
        >
          UNO
        </span>
      </div>
    </div>
  );
}

// --- Centro de carta coringa ---

function WildCenter({
  size,
  label,
}: {
  size: "sm" | "md" | "lg";
  label: string;
}) {
  const circleSize =
    size === "sm" ? "w-7 h-7" : size === "md" ? "w-11 h-11" : "w-16 h-16";
  const textSize =
    size === "sm" ? "text-xs" : size === "md" ? "text-lg" : "text-2xl";

  return (
    <div className={`${circleSize} rounded-full overflow-hidden relative`}>
      {/* 4 quadrantes coloridos */}
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="bg-red-500" />
        <div className="bg-blue-500" />
        <div className="bg-yellow-400" />
        <div className="bg-green-500" />
      </div>
      {/* Label sobre os quadrantes */}
      {label !== "★" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-black text-white drop-shadow-md ${textSize}`}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
