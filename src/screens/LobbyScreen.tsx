import { useState, useEffect } from "react";
import { useGame } from "../hooks/useGame";

export function LobbyScreen() {
  const {
    nickname,
    gameState,
    status,
    serverError,
    clearServerError,
    join,
    startGame,
  } = useGame();
  const [inputValue, setInputValue] = useState("");

  const isConnected = status === "connected";
  const hasJoined = nickname !== "";
  const players = gameState?.players ?? [];

  // Limpa erro do servidor após 3 segundos
  useEffect(() => {
    if (!serverError) return;
    const t = setTimeout(clearServerError, 3000);
    return () => clearTimeout(t);
  }, [serverError, clearServerError]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const name = inputValue.trim();
    if (name.length < 2 || name.length > 16) return;
    join(name);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 px-4">
      {/* Status da conexão */}
      <StatusBadge status={status} />

      {/* Logo */}
      <div className="text-center select-none">
        <h1 className="text-8xl font-black tracking-widest drop-shadow-lg">
          <span className="text-red-500">U</span>
          <span className="text-yellow-400">N</span>
          <span className="text-green-400">O</span>
        </h1>
      </div>

      {/* Erro do servidor */}
      {serverError && (
        <div className="bg-red-900/60 border border-red-500 text-red-200 text-sm px-4 py-2 rounded-lg">
          {serverError}
        </div>
      )}

      {/* Formulário de entrada OU sala de espera */}
      {!hasJoined ? (
        <JoinForm
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleJoin}
          disabled={!isConnected}
        />
      ) : (
        <WaitingRoom
          players={players}
          nickname={nickname}
          onStart={startGame}
          disabled={!isConnected || players.length < 2}
        />
      )}
    </div>
  );
}

// --- Sub-componentes ---

function StatusBadge({ status }: { status: string }) {
  const styles = {
    connected: {
      dot: "bg-green-400",
      text: "text-green-400",
      label: "Conectado",
    },
    connecting: {
      dot: "bg-yellow-400 animate-pulse",
      text: "text-yellow-400",
      label: "Conectando...",
    },
    disconnected: {
      dot: "bg-red-500 animate-pulse",
      text: "text-red-400",
      label: "Desconectado — reconectando...",
    },
  }[status] ?? { dot: "bg-gray-500", text: "text-gray-400", label: status };

  return (
    <div className={`flex items-center gap-2 text-sm ${styles.text}`}>
      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
      {styles.label}
    </div>
  );
}

function JoinForm({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}) {
  const tooShort = value.trim().length > 0 && value.trim().length < 2;

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center gap-4 w-full max-w-sm"
    >
      <label className="text-gray-400 text-sm tracking-wide uppercase">
        Seu apelido
      </label>
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Matheus"
          maxLength={16}
          disabled={disabled}
          className="
            flex-1 bg-gray-800 border border-gray-600 text-white placeholder-gray-500
            rounded-xl px-4 py-3 text-lg outline-none
            focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors
          "
        />
        <button
          type="submit"
          disabled={disabled || value.trim().length < 2}
          className="
            bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl text-lg
            hover:bg-yellow-300 active:scale-95
            disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
            transition-all
          "
        >
          Entrar
        </button>
      </div>
      {tooShort && <p className="text-red-400 text-xs">Mínimo 2 caracteres</p>}
    </form>
  );
}

function WaitingRoom({
  players,
  nickname,
  onStart,
  disabled,
}: {
  players: string[];
  nickname: string;
  onStart: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      {/* Lista de jogadores */}
      <div className="w-full bg-gray-800 rounded-2xl p-4 flex flex-col gap-2">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
          Jogadores na sala ({players.length})
        </p>
        {players.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-2">
            Aguardando jogadores...
          </p>
        ) : (
          players.map((player) => (
            <div key={player} className="flex items-center gap-3 py-1">
              <span className="text-gray-400">👤</span>
              <span className="text-white font-medium">{player}</span>
              {player === nickname && (
                <span className="text-xs text-yellow-400 ml-auto">você</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Dica de mínimo de jogadores */}
      {players.length < 2 && (
        <p className="text-gray-500 text-sm">
          Aguardando mais {2 - players.length} jogador
          {players.length === 0 ? "es" : ""} para iniciar
        </p>
      )}

      {/* Botão iniciar */}
      <button
        onClick={onStart}
        disabled={disabled}
        className="
          w-full bg-green-500 text-white font-black text-xl py-4 rounded-2xl tracking-wide
          hover:bg-green-400 active:scale-95
          disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100
          transition-all shadow-lg shadow-green-900/40
        "
      >
        ▶ Iniciar Jogo
      </button>
    </div>
  );
}
