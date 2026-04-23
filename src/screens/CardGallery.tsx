import { Card } from "../components/Card/Card";
import type { Card as CardType } from "../types/game";

const samples: CardType[] = [
  { color: "red",    type: "number",   value: 5 },
  { color: "blue",   type: "number",   value: 0 },
  { color: "green",  type: "jump",     value: -1 },
  { color: "yellow", type: "inverter", value: -1 },
  { color: "red",    type: "plusTwo",  value: -1 },
  { color: "none",   type: "joker",    value: -1 },
  { color: "none",   type: "plusFour", value: -1 },
];

export function CardGallery() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-12 p-8">
      <h2 className="text-white text-xl font-bold tracking-widest uppercase">Galeria de cartas</h2>

      {/* Tamanho md (mão do jogador) */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-500 text-xs uppercase tracking-widest">md — sua mão</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {samples.map((card, i) => (
            <Card key={i} card={card} size="md" />
          ))}
          <Card card={samples[0]} size="md" playable />
          <Card card={samples[0]} size="md" selected />
          <Card card={samples[0]} size="md" faceDown />
        </div>
      </div>

      {/* Tamanho lg (pilha de descarte) */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-500 text-xs uppercase tracking-widest">lg — pilha de descarte</p>
        <div className="flex gap-4">
          <Card card={samples[0]} size="lg" />
          <Card card={samples[5]} size="lg" />
        </div>
      </div>

      {/* Tamanho sm (oponentes) */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-gray-500 text-xs uppercase tracking-widest">sm — oponentes</p>
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i} card={samples[0]} size="sm" faceDown />
          ))}
        </div>
      </div>
    </div>
  );
}
