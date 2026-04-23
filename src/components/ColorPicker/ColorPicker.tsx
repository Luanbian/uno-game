import type { CardColor } from "../../types/game";

const COLORS: { color: CardColor; bg: string; label: string }[] = [
  { color: "red", bg: "bg-red-500 hover:bg-red-400", label: "Vermelho" },
  { color: "green", bg: "bg-green-500 hover:bg-green-400", label: "Verde" },
  { color: "blue", bg: "bg-blue-500 hover:bg-blue-400", label: "Azul" },
  {
    color: "yellow",
    bg: "bg-yellow-400 hover:bg-yellow-300",
    label: "Amarelo",
  },
];

interface ColorPickerProps {
  onSelect: (color: CardColor) => void;
}

export function ColorPicker({ onSelect }: ColorPickerProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-2xl">
        <p className="text-white font-bold text-lg tracking-wide">
          Escolha uma cor
        </p>
        <div className="grid grid-cols-2 gap-3">
          {COLORS.map(({ color, bg, label }) => (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`${bg} w-28 h-16 rounded-xl font-bold text-white text-sm tracking-wide transition-all active:scale-95 shadow-md`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
