import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Trophy } from 'lucide-react';
import { useGameState } from '@/engine/GameState';
import { createInitialState } from '@/engine/GameState';
import { hasSave, loadGame, getBestAsset } from '@/engine/SaveSystem';
import Layout from '@/components/Layout';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function StartScreen() {
  const navigate = useNavigate();
  const { dispatch } = useGameState();
  const [familyName, setFamilyName] = useState('');
  const [hasSaveFile, setHasSaveFile] = useState(false);
  const [bestAsset, setBestAsset] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setHasSaveFile(hasSave());
    setBestAsset(getBestAsset());
  }, []);

  const handleStartGame = () => {
    if (!familyName.trim()) {
      setError('请输入家族姓氏');
      return;
    }
    if (/^\d+$/.test(familyName.trim())) {
      setError('家族姓氏不能仅为数字');
      return;
    }
    setError('');
    const initialState = createInitialState(familyName.trim());
    dispatch({ type: 'LOAD_SAVE', payload: initialState });
    navigate('/play');
  };

  const handleContinueGame = () => {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_SAVE', payload: saved });
      navigate('/play');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartGame();
    }
  };

  return (
    <Layout bgImage="./bg-start.jpg" era={1} overlayOpacity={0.7}>
      {/* Rotating gear decoration */}
      <motion.div
        className="fixed top-20 right-20 opacity-10 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ zIndex: 2 }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 20L110 50L90 50L100 20ZM100 180L90 150L110 150L100 180ZM20 100L50 90L50 110L20 100ZM180 100L150 110L150 90L180 100ZM45 45L65 65L55 75L45 45ZM155 155L135 135L145 125L155 155ZM45 155L55 125L65 135L45 155ZM155 45L145 75L135 65L155 45Z"
            fill="white"
          />
          <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="8" fill="none" />
          <circle cx="100" cy="100" r="20" stroke="white" strokeWidth="4" fill="none" />
        </svg>
      </motion.div>

      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 py-12">
        {/* Title */}
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-[#FFD700] tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: easeOutExpo }}
          >
            家族穿越
          </motion.h1>

          <motion.h2
            className="text-3xl md:text-5xl font-bold text-[#D2691E] mt-2"
            style={{ fontFamily: 'Cinzel, serif', letterSpacing: '-0.01em' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
          >
            工业革命纪元
          </motion.h2>

          {/* Gold divider */}
          <motion.div
            className="w-[200px] h-[2px] bg-[#FFD700] mt-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.7, ease: easeOutExpo }}
            style={{ transformOrigin: 'center' }}
          />

          <motion.p
            className="text-base text-[#A0A0A0] mt-4 italic"
            style={{ fontFamily: 'Inter, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            &ldquo;从 £10,000 到万亿帝国的征途&rdquo;
          </motion.p>
        </motion.div>

        {/* Family name input */}
        <motion.div
          className="flex flex-col items-center gap-2 mb-8 w-full max-w-[320px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: easeOutExpo }}
        >
          <div className="relative w-full">
            <input
              type="text"
              value={familyName}
              onChange={(e) => { setFamilyName(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="请输入您的家族姓氏..."
              maxLength={12}
              className="w-full h-12 px-4 rounded-xl text-lg text-center outline-none transition-all duration-300"
              style={{
                fontFamily: 'Playfair Display, serif',
                background: 'rgba(20,20,20,0.8)',
                backdropFilter: 'blur(12px)',
                border: `2px solid ${error ? '#FF1744' : '#8B4513'}`,
                color: '#FFD700',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FFD700';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255,215,0,0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? '#FF1744' : '#8B4513';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-[#FF1744]"
            >
              {error}
            </motion.p>
          )}
          {familyName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[#8B4513]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {familyName}家族
            </motion.p>
          )}
        </motion.div>

        {/* Main buttons */}
        <motion.div
          className="flex flex-col items-center gap-4 w-full max-w-[400px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3, ease: easeOutExpo }}
        >
          <button
            onClick={handleStartGame}
            className="w-[200px] h-14 rounded-xl text-lg font-semibold transition-all duration-200 hover:brightness-125 hover:shadow-xl active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
              color: '#1A0F0A',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            开始新游戏
          </button>

          <button
            onClick={handleContinueGame}
            disabled={!hasSaveFile}
            className="w-[200px] h-12 rounded-xl text-base font-medium transition-all duration-200 hover:border-[#FFD700] active:scale-[0.97] disabled:opacity-30 disabled:pointer-events-none"
            style={{
              background: 'transparent',
              color: hasSaveFile ? '#FFD700' : '#888',
              border: '2px solid',
              borderColor: hasSaveFile ? '#FFD700' : '#555',
            }}
          >
            继续游戏
            {hasSaveFile && (
              <span className="block text-xs text-[#888] mt-0.5">有存档</span>
            )}
          </button>
        </motion.div>

        {/* Secondary buttons */}
        <motion.div
          className="flex items-center gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5, ease: easeOutExpo }}
        >
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 text-[#888] hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/5"
          >
            <Settings size={18} />
            <span className="text-sm">设置</span>
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 text-[#888] hover:text-[#FFD700] transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/5"
          >
            <Trophy size={18} />
            <span className="text-sm">成就</span>
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="w-[280px] h-[1px] bg-white/10 mx-auto mb-4" />
          <div className="flex items-center justify-center gap-8 text-xs text-[#888]">
            <span>
              最高资产: {bestAsset > 0 ? `£${bestAsset.toLocaleString()}` : '---'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Settings drawer */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              className="relative w-[320px] h-full p-6 flex flex-col gap-6"
              style={{ background: 'rgba(15,15,15,0.98)', backdropFilter: 'blur(20px)' }}
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
            >
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                设置
              </h2>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#AAA]">音效</span>
                <button
                  onClick={() => {}}
                  className="w-12 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: true ? '#8B4513' : '#333' }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: true ? 'translateX(24px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#AAA]">粒子特效</span>
                <button
                  onClick={() => {}}
                  className="w-12 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: true ? '#8B4513' : '#333' }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: true ? 'translateX(24px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#AAA]">动画效果</span>
                <button
                  onClick={() => {}}
                  className="w-12 h-6 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: true ? '#8B4513' : '#333' }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform duration-200"
                    style={{ transform: true ? 'translateX(24px)' : 'translateX(2px)' }}
                  />
                </button>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => {}}
                  className="w-full h-10 rounded-xl text-sm font-medium text-[#FF1744] border border-[#FF1744] hover:bg-[#FF1744]/10 transition-all duration-200"
                >
                  重置所有存档
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
