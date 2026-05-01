import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useGameState } from '@/engine/GameState';
import { TALENTS } from '@/data/talents';
import { RARITY_COLORS, ERA_CONFIG } from '@/data/constants';
import Layout from '@/components/Layout';
import RarityBadge from '@/components/RarityBadge';
import type { Talent, Heir } from '@/data/types';
import {
  ArrowLeft,
  Briefcase,
  Settings,
  Banknote,
  FlaskConical,
  Home,
  Drama,
  Star,
  Sparkles,
  AlertTriangle,
  Check,
  User,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeOutBack = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

interface Direction {
  id: string;
  label: string;
  icon: React.ReactNode;
  baseCost: number;
  effect: string;
  color: string;
}

const DIRECTIONS: Direction[] = [
  { id: 'commercial', label: '商业', icon: <Briefcase size={28} />, baseCost: 500, effect: '商业投资+15%', color: '#FFD700' },
  { id: 'industrial', label: '工业', icon: <Settings size={28} />, baseCost: 500, effect: '工业投资+15%', color: '#4682B4' },
  { id: 'financial', label: '金融', icon: <Banknote size={28} />, baseCost: 500, effect: '金融投资+15%', color: '#00E676' },
  { id: 'technology', label: '科技', icon: <FlaskConical size={28} />, baseCost: 500, effect: '科技投资+15%', color: '#40C4FF' },
  { id: 'realEstate', label: '地产', icon: <Home size={28} />, baseCost: 500, effect: '不动产+15%', color: '#FF6F00' },
  { id: 'social', label: '社交', icon: <Drama size={28} />, baseCost: 500, effect: '声誉+30%', color: '#FF69B4' },
];

/* Generate a random heir with talents */
function generateHeir(familyName: string): Heir {
  const firstNames = ['约翰', '威廉', '亨利', '詹姆斯', '亚瑟', '爱德华', '查理', '托马斯'];
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]}·${familyName}`;
  const shuffled = [...TALENTS].sort(() => Math.random() - 0.5);
  const talents = shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
  return {
    name,
    age: Math.floor(Math.random() * 8) + 16,
    health: Math.floor(Math.random() * 30) + 70,
    talents,
  };
}

/* Typewriter hook */
function useTypewriter(text: string, speed = 50, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setStarted(false);
    const delayTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, startDelay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed]);

  return displayed;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function TalentCard({ talent, isNegative }: { talent: Talent; isNegative?: boolean }) {
  const colors = isNegative
    ? { border: '#FF1744', glow: 'rgba(255,23,68,0.4)', text: '#FF1744', bg: 'rgba(255,23,68,0.1)' }
    : RARITY_COLORS[talent.rarity];

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden"
      style={{
        background: 'rgba(30,30,30,0.95)',
        border: `2px solid ${colors.border}`,
        boxShadow: `0 0 15px ${colors.glow}`,
      }}
    >
      {isNegative && (
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#FF1744' }} />
      )}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-playfair" style={{ color: colors.text }}>
          {talent.name}
        </h3>
        <RarityBadge rarity={talent.rarity} />
      </div>
      <p className="text-sm text-[#CCC]">{talent.description}</p>
      <div className="flex items-center gap-2 text-xs text-[#00E676]">
        <Sparkles size={12} />
        <span>
          {talent.effect.type === 'returnRate' && '回报率 '}
          {talent.effect.type === 'critRate' && '暴击率 '}
          {talent.effect.type === 'riskReduce' && '风险降低 '}
          {talent.effect.type === 'reputationGain' && '声望 '}
          +{(talent.effect.value * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

function DirectionCard({
  direction,
  selected,
  onClick,
}: {
  direction: Direction;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer"
      style={{
        width: 160,
        height: 120,
        background: selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
        border: `2px solid ${selected ? direction.color : 'rgba(255,255,255,0.08)'}`,
        boxShadow: selected ? `0 0 20px ${direction.color}30` : 'none',
      }}
      whileHover={{ y: -4, borderColor: direction.color }}
      whileTap={{ scale: 0.97 }}
    >
      <div style={{ color: direction.color }}>{direction.icon}</div>
      <span className="text-sm font-semibold text-white">{direction.label}</span>
      <span className="text-xs text-[#FFD700]">£{direction.baseCost}</span>
      <span className="text-[10px] text-[#888]">{direction.effect}</span>
      {selected && (
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: direction.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <Check size={14} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main screen                                                         */
/* ------------------------------------------------------------------ */

export default function HeirScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();
  const eraConfig = ERA_CONFIG[state.currentEra];

  // Generate heir if none exists
  const [heir, setHeir] = useState<Heir | null>(state.player.heir);
  const [selectedDir, setSelectedDir] = useState<string | null>(null);
  const [investAmount, setInvestAmount] = useState(1000);
  const [isTraining, setIsTraining] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainedHeir, setTrainedHeir] = useState<Heir | null>(null);
  const [newTalentUnlocked, setNewTalentUnlocked] = useState(false);
  const [resultTalent, setResultTalent] = useState<Talent | null>(null);

  // Create heir on first visit if none
  useEffect(() => {
    if (!heir) {
      const newHeir = generateHeir(state.player.name);
      setHeir(newHeir);
    }
  }, []);

  // Keyboard escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/play');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  // Calculate preview values
  const calculatePreview = useCallback(() => {
    if (!heir || !selectedDir) return null;
    const baseMultiplier = 1.0;
    const investRatio = (investAmount - 1000) / 9000;
    const dirBonus = 0.3 + investRatio * 0.7;
    const newMultiplier = baseMultiplier + dirBonus;
    const talentBoost = Math.floor(investRatio * 15 + 5);
    const newTalentChance = Math.floor(investRatio * 30 + 10);

    return {
      multiplier: newMultiplier,
      talentBoost,
      newTalentChance,
      specialText: investAmount >= 7000 ? '可能觉醒史诗天赋' : investAmount >= 4000 ? '可能觉醒稀有天赋' : null,
    };
  }, [heir, selectedDir, investAmount]);

  const preview = calculatePreview();

  const handleTrain = () => {
    if (!selectedDir || !heir) return;
    if (state.player.asset < investAmount) return;

    setIsTraining(true);
    setTrainingProgress(0);

    // Progress animation
    const interval = setInterval(() => {
      setTrainingProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 20);

    // Complete training
    setTimeout(() => {
      clearInterval(interval);
      setTrainingProgress(100);
      setIsTraining(false);
      setShowResult(true);

      // Calculate result
      const investRatio = (investAmount - 1000) / 9000;
      void investRatio;

      // Check for new talent
      const roll = Math.random();
      const newTalentThreshold = investRatio * 0.3 + 0.1;
      let unlockedTalent: Talent | null = null;

      if (roll < newTalentThreshold) {
        const shuffled = [...TALENTS].sort(() => Math.random() - 0.5);
        unlockedTalent = shuffled[0];
        setNewTalentUnlocked(true);
        setResultTalent(unlockedTalent);
      } else {
        setNewTalentUnlocked(false);
        setResultTalent(null);
      }

      // Update heir
      const updatedHeir: Heir = {
        ...heir,
        talents: unlockedTalent
          ? [...heir.talents, unlockedTalent]
          : heir.talents.map(t => ({
              ...t,
              effect: {
                ...t.effect,
                value: t.effect.value * (1 + investRatio * 0.5),
              },
            })),
      };
      setTrainedHeir(updatedHeir);
      setHeir(updatedHeir);

      // Dispatch
      dispatch({
        type: 'TRAIN_HEIR',
        payload: {
          talentId: selectedDir,
          amount: investAmount,
        },
      });
      dispatch({
        type: 'INVEST',
        payload: {
          investmentId: 'heir_training',
          amount: investAmount,
          outcome: 'normal',
          returnAmount: 0,
          multiplier: 1,
        },
      });
    }, 1200);
  };

  const handleSkip = () => {
    navigate('/play');
  };

  const typewriterQuote = useTypewriter(
    trainedHeir
      ? trainedHeir.talents[0]?.description || '我会让家族更加辉煌！'
      : heir?.talents[0]?.description || '',
    50,
    showResult ? 500 : 0
  );

  if (!heir) {
    return (
      <Layout era={state.currentEra} overlayOpacity={0.92}>
        <div className="min-h-[100dvh] flex items-center justify-center">
          <div className="text-white text-lg">加载中...</div>
        </div>
      </Layout>
    );
  }

  const hasNegativeTalent = heir.talents.some(t => t.rarity === 'common' && t.effect.type === 'riskReduce');
  const maxInvest = Math.min(10000, Math.floor(state.player.asset * 0.5));
  const canAfford = state.player.asset >= investAmount && selectedDir !== null;

  return (
    <Layout era={state.currentEra} overlayOpacity={0.92}>
      <div className="min-h-[100dvh] flex flex-col items-center px-4 py-6">
        {/* Header */}
        <motion.div
          className="w-full max-w-[900px] flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
        >
          <button
            onClick={() => navigate('/play')}
            className="flex items-center gap-2 text-[#888] hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            返回
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#FFD700] font-playfair flex items-center gap-2 justify-center">
              <TrendingUp size={24} />
              继承人培养
            </h1>
            <p className="text-xs text-[#888] mt-1">为家族未来投资</p>
          </div>

          <span className="text-xs text-[#888]">
            可用资金: <span className="text-[#FFD700] font-semibold">£{state.player.asset.toLocaleString()}</span>
          </span>
        </motion.div>

        <div className="w-full max-w-[900px] flex flex-col gap-6">
          {/* Heir Info Panel */}
          <motion.div
            className="glass-panel rounded-2xl p-6 flex flex-col gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.1 }}
          >
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <motion.div
                className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.2), transparent 70%)',
                  border: '2px solid rgba(255,215,0,0.4)',
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <User size={36} className="text-[#FFD700]" />
              </motion.div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white font-playfair">
                  当前继承人: {heir.name}
                </h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-[#AAA]">
                  <span>{heir.age}岁</span>
                  <span>·</span>
                  <span>男性</span>
                  <span>·</span>
                  <span className={heir.health >= 80 ? 'text-[#00E676]' : heir.health >= 50 ? 'text-[#FFB300]' : 'text-[#FF1744]'}>
                    {heir.health >= 80 ? '健康' : heir.health >= 50 ? '一般' : '不佳'}
                  </span>
                </div>
              </div>

              {/* Legacy multiplier */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#888]">传承倍率</span>
                <motion.span
                  className="text-2xl font-bold text-[#FFD700] font-bebas"
                  key={showResult && trainedHeir ? 'trained' : 'base'}
                  initial={showResult ? { scale: 1.5, color: '#00E676' } : {}}
                  animate={{ scale: 1, color: '#FFD700' }}
                  transition={{ duration: 0.6, ease: easeOutBack }}
                >
                  {(showResult && trainedHeir ? 1.5 : 1.0).toFixed(1)}x
                </motion.span>
              </div>
            </div>

            {/* Talent cards */}
            <div className="flex flex-col gap-3">
              {heir.talents.map((talent, i) => (
                <motion.div
                  key={talent.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <TalentCard talent={talent} isNegative={talent.rarity === 'common' && talent.effect.type === 'riskReduce' && hasNegativeTalent} />
                </motion.div>
              ))}
            </div>

            {/* Negative talent warning */}
            <AnimatePresence>
              {hasNegativeTalent && (
                <motion.div
                  className="flex items-center gap-2 text-xs text-[#FF1744] px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.2)' }}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <AlertTriangle size={14} />
                  <span>负面天赋存在 — 需要额外投入抵消负面效果</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Heir quote */}
            {heir.talents[0] && (
              <p className="text-sm text-[#888] font-cinzel italic border-l-2 border-[#FFD700]30 pl-3">
                "{heir.talents[0].description}"
              </p>
            )}
          </motion.div>

          {/* Training Directions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Star size={14} className="text-[#FFD700]" />
              培养方向 (选择一项投入)
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {DIRECTIONS.map((dir, i) => (
                <motion.div
                  key={dir.id}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                >
                  <DirectionCard
                    direction={dir}
                    selected={selectedDir === dir.id}
                    onClick={() => setSelectedDir(dir.id === selectedDir ? null : dir.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Investment Slider */}
          <motion.div
            className="glass-panel rounded-2xl p-5 flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">
                投入金额: <span className="text-[#FFD700] font-bold">£{investAmount.toLocaleString()}</span>
              </span>
              <span className="text-xs text-[#888]">
                可用: £{state.player.asset.toLocaleString()}
              </span>
            </div>

            <div className="relative">
              <input
                type="range"
                min={1000}
                max={Math.max(1000, maxInvest)}
                step={100}
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                disabled={isTraining}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${eraConfig.themeColor} 0%, ${eraConfig.themeColor} ${((investAmount - 1000) / (Math.max(1000, maxInvest) - 1000)) * 100}%, rgba(255,255,255,0.1) ${((investAmount - 1000) / (Math.max(1000, maxInvest) - 1000)) * 100}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-[#666] mt-1">
                <span>£1,000</span>
                <span>£{Math.floor((Math.max(1000, maxInvest) + 1000) / 2).toLocaleString()}</span>
                <span>£{Math.max(1000, maxInvest).toLocaleString()}</span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2">
              {[500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setInvestAmount(prev => Math.min(maxInvest, prev + amount))}
                  disabled={isTraining || state.player.asset < investAmount + amount}
                  className="h-8 px-3 rounded-lg text-xs font-medium border border-[#444] text-[#AAA] hover:text-white hover:border-[#666] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +£{amount.toLocaleString()}
                </button>
              ))}
              <button
                onClick={() => setInvestAmount(maxInvest)}
                disabled={isTraining}
                className="h-8 px-3 rounded-lg text-xs font-medium border border-[#444] text-[#AAA] hover:text-white hover:border-[#666] transition-all disabled:opacity-40"
              >
                最大值
              </button>
            </div>
          </motion.div>

          {/* Legacy Preview */}
          <motion.div
            className="glass-panel rounded-2xl p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Award size={14} className="text-[#FFD700]" />
              传承预览
            </h3>

            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key={`${selectedDir}-${investAmount}`}
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">预计传承倍率</span>
                    <span className="text-[#FFD700] font-semibold">
                      1.0x <ChevronRight size={14} className="inline text-[#666]" />{' '}
                      <span className="text-[#00E676]">{preview.multiplier.toFixed(1)}x</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">天赋效果强化</span>
                    <span className="text-[#00E676]">+{preview.talentBoost}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">新天赋概率</span>
                    <span className="text-[#40C4FF]">{preview.newTalentChance}%</span>
                  </div>
                  {preview.specialText && (
                    <motion.div
                      className="text-xs text-[#FFD700] mt-1 flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Sparkles size={12} />
                      {preview.specialText}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.p
                  className="text-sm text-[#666] text-center py-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  请选择培养方向查看预览
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col gap-3 items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <button
              onClick={handleTrain}
              disabled={!canAfford || isTraining}
              className="w-full max-w-[320px] h-14 rounded-xl text-base font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 relative overflow-hidden"
              style={{
                background: canAfford
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                  : '#333',
                color: canAfford ? '#1A0F0A' : '#666',
              }}
            >
              {isTraining ? (
                <>
                  <span>培养中...</span>
                  <div
                    className="absolute bottom-0 left-0 h-1"
                    style={{
                      width: `${trainingProgress}%`,
                      background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                      transition: 'width 0.05s linear',
                    }}
                  />
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {selectedDir
                    ? `确认培养 — 投入 £${investAmount.toLocaleString()}`
                    : '请选择培养方向'}
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              disabled={isTraining}
              className="h-10 px-6 rounded-xl text-sm font-medium text-[#888] hover:text-white border border-[#444] hover:border-[#666] transition-all disabled:opacity-40"
            >
              跳过此代
            </button>
          </motion.div>
        </div>
      </div>

      {/* Training Result Overlay */}
      <AnimatePresence>
        {showResult && trainedHeir && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              className="flex flex-col items-center gap-5 max-w-[480px] w-full mx-4"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: easeOutBack, delay: 0.1 }}
            >
              {/* Heir avatar with glow */}
              <motion.div
                className="relative"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,215,0,0.3)',
                    '0 0 50px rgba(255,215,0,0.6)',
                    '0 0 20px rgba(255,215,0,0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ borderRadius: '50%' }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,215,0,0.3), transparent 70%)',
                    border: '3px solid rgba(255,215,0,0.5)',
                  }}
                >
                  <User size={44} className="text-[#FFD700]" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-3xl font-bold text-[#FFD700] font-playfair"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                培养完成！
              </motion.h2>

              {/* Stats update */}
              <motion.div
                className="glass-panel rounded-xl p-4 w-full flex flex-col gap-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">继承人</span>
                  <span className="text-white font-semibold">{trainedHeir.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">新传承倍率</span>
                  <motion.span
                    className="text-[#FFD700] font-bold font-bebas text-lg"
                    initial={{ scale: 1.5, color: '#00E676' }}
                    animate={{ scale: 1, color: '#FFD700' }}
                    transition={{ duration: 0.6, ease: easeOutBack, delay: 0.6 }}
                  >
                    1.5x
                  </motion.span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">天赋数量</span>
                  <span className="text-[#00E676]">{trainedHeir.talents.length} 个</span>
                </div>
              </motion.div>

              {/* New talent unlocked */}
              <AnimatePresence>
                {newTalentUnlocked && resultTalent && (
                  <motion.div
                    className="w-full"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, ease: easeOutBack }}
                  >
                    <div className="text-center mb-2">
                      <motion.span
                        className="text-lg font-bold text-[#FFD700] font-playfair"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                      >
                        天赋觉醒！
                      </motion.span>
                    </div>
                    <TalentCard talent={resultTalent} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Typewriter quote */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-sm text-[#AAA] font-cinzel italic">
                  "{typewriterQuote}"
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-[#FFD700] ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </p>
              </motion.div>

              {/* Return button */}
              <motion.button
                onClick={() => navigate('/play')}
                className="h-11 px-8 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  color: '#1A0F0A',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                返回游戏
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
