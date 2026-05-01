import { Routes, Route } from 'react-router'
import { GameProvider } from './engine/GameState'
import StartScreen from './pages/StartScreen'
import MainGame from './pages/MainGame'
import EventModal from './components/EventModal'
import EraTransition from './components/EraTransition'
import MarriageScreen from './pages/MarriageScreen'
import HeirScreen from './pages/HeirScreen'
import RankingScreen from './pages/RankingScreen'
import AchievementsScreen from './pages/AchievementsScreen'
import GameOverScreen from './pages/GameOverScreen'

export default function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/play" element={<MainGame />} />
        <Route path="/invest/:id" element={<MainGame />} />
        <Route path="/crit" element={<MainGame />} />
        <Route path="/event/:type" element={<MainGame />} />
        <Route path="/era-transition" element={<EraTransition />} />
        <Route path="/marriage" element={<MarriageScreen />} />
        <Route path="/heir" element={<HeirScreen />} />
        <Route path="/ranking" element={<RankingScreen />} />
        <Route path="/achievements" element={<AchievementsScreen />} />
        <Route path="/gameover" element={<GameOverScreen />} />
      </Routes>
    </GameProvider>
  )
}
