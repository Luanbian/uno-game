import { useGame } from "./hooks/useGame";
import { LobbyScreen } from "./screens/LobbyScreen";
import { GameScreen } from "./screens/GameScreen";

function App() {
  const { gameState } = useGame();

  const gameStarted = (gameState?.discard_pile?.length ?? 0) > 0;

  if (!gameStarted) return <LobbyScreen />;
  return <GameScreen />;
}

export default App;
