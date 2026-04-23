import { useGame } from "../hooks/useGame";
import { Card } from "../components/Card/Card";
import { ColorPicker } from "../components/ColorPicker/ColorPicker";
import { canPlayCard, topCard } from "../utils/cardUtils";
import type { Card as CardType } from "../types/game";

// ─── Tela principal ───────────────────────────────────────────────────────────

export function GameScreen() {
  const {
    nickname,
    gameState,
    playCard,
    buyCard,
    sayUno,
    punish,
    selectColor,
    acceptPenalty,
    startGame,
  } = useGame();

  if (!gameState) return null;

  const top = topCard(gameState);
  const myHand = gameState.hands[nickname] ?? [];
  const myIndex = gameState.players.indexOf(nickname);
  const isMyTurn = gameState.current_player === myIndex;
  const stacked = gameState.stacked_cards;
  const opponents = gameState.players.filter((p) => p !== nickname);

  // Precisa escolher cor: topo é wild (color "none") e eu sou o LastPlayer
  // Joker: CurrentPlayer fica em mim. +4: CurrentPlayer pula (jumpNextPlayer),
  // mas LastPlayer ainda aponta para quem jogou — por isso usamos LastPlayer aqui.
  const lastIdx = gameState.last_player;
  const needsColorSelect =
    top?.color === "none" &&
    lastIdx >= 0 &&
    gameState.players[lastIdx] === nickname;

  // Lógica de UNO e punição
  const lastPlayerName = lastIdx >= 0 ? gameState.players[lastIdx] : null;
  const lastHandSize = lastPlayerName
    ? (gameState.hands[lastPlayerName]?.length ?? 0)
    : 0;
  const lastSaidUno = lastPlayerName
    ? gameState.said_uno[lastPlayerName]
    : false;
  const canSayUno =
    lastIdx === myIndex && myHand.length === 1 && !gameState.said_uno[nickname];
  const canPunish =
    !!lastPlayerName &&
    lastPlayerName !== nickname &&
    lastHandSize === 1 &&
    !lastSaidUno;

  function handleCardClick(card: CardType) {
    if (!isMyTurn) return;
    playCard(card);
    // Se for coringa, o servidor responde com colorSelect no topo → needsColorSelect dispara o picker
  }

  if (gameState.winner) {
    return (
      <WinnerBanner
        winner={gameState.winner}
        isMe={gameState.winner === nickname}
        onRematch={startGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-4 gap-4 select-none">
      {/* Cor picker sobreposto */}
      {needsColorSelect && <ColorPicker onSelect={selectColor} />}

      {/* ── Header ─────────────────────────────────────────── */}
      <Header
        direction={gameState.direction}
        stacked={stacked}
        currentPlayerName={gameState.players[gameState.current_player]}
        isMyTurn={isMyTurn}
      />

      {/* ── Oponentes ──────────────────────────────────────── */}
      <div className="flex gap-4 justify-center flex-wrap">
        {opponents.map((name) => {
          const handSize = gameState.hands[name]?.length ?? 0;
          const isCurrent =
            gameState.players[gameState.current_player] === name;
          const saidUno = gameState.said_uno[name];
          return (
            <Opponent
              key={name}
              name={name}
              handSize={handSize}
              isCurrent={isCurrent}
              saidUno={saidUno}
            />
          );
        })}
      </div>

      {/* ── Mesa central ───────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center gap-8">
        {/* Deck (comprar) */}
        <div className="flex flex-col items-center gap-2">
          <Card
            card={{ color: "none", type: "joker", value: -1 }}
            faceDown
            size="lg"
            onClick={isMyTurn && stacked === 0 ? buyCard : undefined}
            playable={isMyTurn && stacked === 0}
          />
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            Comprar
          </span>
        </div>

        {/* Pilha de descarte */}
        <div className="flex flex-col items-center gap-2">
          {top ? (
            <Card card={top} size="lg" />
          ) : (
            <div className="w-28 h-40 rounded-xl border-2 border-dashed border-gray-700" />
          )}
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            Descarte
          </span>
        </div>
      </div>

      {/* ── Controles ──────────────────────────────────────── */}
      <Controls
        isMyTurn={isMyTurn}
        stacked={stacked}
        canSayUno={canSayUno}
        canPunish={canPunish}
        lastPlayerName={lastPlayerName}
        onBuyCard={buyCard}
        onAcceptPenalty={acceptPenalty}
        onSayUno={sayUno}
        onPunish={punish}
      />

      {/* ── Sua mão ────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-500 text-xs uppercase tracking-widest">
          Sua mão ({myHand.length} {myHand.length === 1 ? "carta" : "cartas"})
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 px-2 w-full justify-center">
          {myHand.map((card, i) => {
            const isPlayable =
              isMyTurn && !!top && canPlayCard(card, top, stacked);
            return (
              <Card
                key={i}
                card={card}
                size="md"
                playable={isPlayable}
                onClick={isPlayable ? () => handleCardClick(card) : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Header({
  direction,
  stacked,
  currentPlayerName,
  isMyTurn,
}: {
  direction: number;
  stacked: number;
  currentPlayerName: string;
  isMyTurn: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <span
          className="text-gray-400"
          title={direction === 1 ? "Sentido horário" : "Anti-horário"}
        >
          {direction === 1 ? "🔄" : "🔃"}
        </span>
        {stacked > 0 && (
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full text-xs font-bold">
            +{stacked} acumulado
          </span>
        )}
      </div>
      <span
        className={`font-semibold ${isMyTurn ? "text-green-400" : "text-gray-400"}`}
      >
        {isMyTurn ? "✦ Sua vez!" : `Vez de ${currentPlayerName}`}
      </span>
    </div>
  );
}

function Opponent({
  name,
  handSize,
  isCurrent,
  saidUno,
}: {
  name: string;
  handSize: number;
  isCurrent: boolean;
  saidUno: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
        isCurrent ? "bg-white/10 ring-1 ring-white/30" : "bg-gray-800/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-medium">{name}</span>
        {saidUno && (
          <span className="bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded">
            UNO!
          </span>
        )}
      </div>
      {/* Cartas empilhadas */}
      <div className="flex">
        {Array.from({ length: Math.min(handSize, 8) }).map((_, i) => (
          <div key={i} className={i > 0 ? "-ml-7" : ""} style={{ zIndex: i }}>
            <Card
              card={{ color: "none", type: "joker", value: -1 }}
              faceDown
              size="sm"
            />
          </div>
        ))}
        {handSize > 8 && (
          <div className="-ml-4 flex items-center justify-center w-12 h-[4.5rem] bg-gray-700 rounded-xl border-2 border-white/20 text-white text-xs font-bold z-10">
            +{handSize - 8}
          </div>
        )}
        {handSize === 0 && (
          <span className="text-gray-600 text-xs">sem cartas</span>
        )}
      </div>
      <span className="text-gray-500 text-xs">
        {handSize} {handSize === 1 ? "carta" : "cartas"}
      </span>
    </div>
  );
}

function Controls({
  isMyTurn,
  stacked,
  canSayUno,
  canPunish,
  lastPlayerName,
  onBuyCard,
  onAcceptPenalty,
  onSayUno,
  onPunish,
}: {
  isMyTurn: boolean;
  stacked: number;
  canSayUno: boolean;
  canPunish: boolean;
  lastPlayerName: string | null;
  onBuyCard: () => void;
  onAcceptPenalty: () => void;
  onSayUno: () => void;
  onPunish: () => void;
}) {
  const showAnyControl = isMyTurn || canSayUno || canPunish;
  if (!showAnyControl) return null;

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {/* Aceitar penalidade */}
      {isMyTurn && stacked > 0 && (
        <button
          onClick={onAcceptPenalty}
          className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow"
        >
          Aceitar +{stacked}
        </button>
      )}

      {/* Comprar carta */}
      {isMyTurn && stacked === 0 && (
        <button
          onClick={onBuyCard}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow"
        >
          Comprar Carta
        </button>
      )}

      {/* UNO! */}
      {canSayUno && (
        <button
          onClick={onSayUno}
          className="bg-red-500 hover:bg-red-400 active:scale-95 text-white font-black px-6 py-2.5 rounded-xl text-lg transition-all shadow animate-pulse"
        >
          UNO!
        </button>
      )}

      {/* Punir jogador que não disse UNO */}
      {canPunish && (
        <button
          onClick={onPunish}
          className="bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-all shadow"
        >
          Punir {lastPlayerName} 🎴
        </button>
      )}
    </div>
  );
}

function WinnerBanner({
  winner,
  isMe,
  onRematch,
}: {
  winner: string;
  isMe: boolean;
  onRematch: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="text-6xl mb-4">{isMe ? "🏆" : "😢"}</p>
        <h2 className="text-white text-4xl font-black">
          {isMe ? "Você venceu!" : `${winner} venceu!`}
        </h2>
        <p className="text-gray-400 mt-2">
          {isMe ? "Parabéns!" : "Melhor sorte na próxima."}
        </p>
      </div>
      <button
        onClick={onRematch}
        className="bg-green-500 hover:bg-green-400 active:scale-95 text-white font-black text-xl px-10 py-4 rounded-2xl transition-all shadow-lg"
      >
        Jogar Novamente
      </button>
    </div>
  );
}
