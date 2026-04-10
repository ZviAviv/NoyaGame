import { useGameStore } from './store/gameStore';
import WelcomeScreen from './screens/WelcomeScreen';
import GameScreen from './screens/GameScreen';
import ResultsScreen from './screens/ResultsScreen';
import AdminScreen from './screens/AdminScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const currentScreen = useGameStore((s) => s.currentScreen);

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'welcome' && <WelcomeScreen key="welcome" />}
      {currentScreen === 'game' && <GameScreen key="game" />}
      {currentScreen === 'results' && <ResultsScreen key="results" />}
      {currentScreen === 'admin' && <AdminScreen key="admin" />}
    </AnimatePresence>
  );
}

export default App;
