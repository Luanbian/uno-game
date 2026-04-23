import { useGame } from "./hooks/useGame";
import { LobbyScreen } from "./screens/LobbyScreen";
import { CardGallery } from "./screens/CardGallery";

function App() {
  const { gameState } = useGame();

  const gameStarted = (gameState?.discard_pile?.length ?? 0) > 0;

  if (!gameStarted) return <LobbyScreen />;

  return <CardGallery />;
}

export default App;
