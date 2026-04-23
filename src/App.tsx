import { useGame } from "./hooks/useGame";
import { LobbyScreen } from "./screens/LobbyScreen";

function App() {
  const { gameState } = useGame();

  const gameStarted = (gameState?.discard_pile?.length ?? 0) > 0;

  if (!gameStarted) return <LobbyScreen />;

  // GameScreen virá na próxima etapa
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      Jogo em andamento...
    </div>
  );
}

export default App;
