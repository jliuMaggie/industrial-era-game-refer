import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, TrendingUp, Zap, ChevronRight, Crown } from 'lucide-react';
import { useGameState } from '@/engine/GameState';
import { INVESTMENTS } from '@/data/investments';
import { calculateReturn, canUpgrade, getUpgradeCost } from '@/engine/InvestEngine';
import { RARITY_COLORS, ERA_CONFIG } from '@/data/constants';
import RarityBadge from './RarityBadge';
import type { InvestmentLevel } from '@/data/types';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeOutBack = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

const LEVEL_ICONS = ['🏠', '🏭', '🏢', '🏛️', '🌆', '👑', '💎'];

/* ─── helper: format currency ─── */
function fmtCurrency(n: number): string {
  return `£${n.toLocaleString()}`;
}

/* ─── SVG Upgrade Tree Component ─── */
function UpgradeTree({
  levels,
  currentLevel,
  rarity,
  onUpgrade,
  canAffordUpgrade,
}: {
  levels: InvestmentLevel[];
  currentLevel: number;
  rarity: string;
  onUpgrade: () => void;
  canAffordUpgrade: boolean;
}) {
  const colors = RARITY_COLORS[rarity as keyof typeof RARITY_COLORS];
  const isLegendary = rarity === 'legendary';
  const nodeRadius = 28;
  const svgWidth = 700;
  const svgHeight = 140;
  const startX = 50;
  const endX = 650;
  const centerY = 55;
  const spacing = (endX - startX) / 6;

  const nodePositions = useMemo(() => {
    return levels.map((_, i) => ({
      x: startX + spacing * i,
      y: centerY,
    }));
  }, [levels]);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[500px]"
        style={{ maxWidth: 700 }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Legendary rainbow gradient */}
          {isLegendary && (
            <linearGradient id="legendaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="33%" stopColor="#FF6B6B" />
              <stop offset="66%" stopColor="#4ECDC4" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          )}
        </defs>

        {/* Connection lines */}
        {levels.slice(0, -1).map((_, i) => {
          const from = nodePositions[i];
          const to = nodePositions[i + 1];
          const isUnlocked = i < currentLevel - 1;
          const isNext = i === currentLevel - 1;
          const isLocked = i >= currentLevel;

          return (
            <g key={`line-${i}`}>
              {/* Background line (for locked) */}
              {isLocked && (
                <line
                  x1={from.x + nodeRadius}
                  y1={from.y}
                  x2={to.x - nodeRadius}
                  y2={to.y}
                  stroke="#555"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}
              {/* Unlocked line */}
              {isUnlocked && (
                <line
                  x1={from.x + nodeRadius}
                  y1={from.y}
                  x2={to.x - nodeRadius}
                  y2={to.y}
                  stroke={colors.border}
                  strokeWidth="4"
                  opacity="0.8"
                />
              )}
              {/* Next unlockable line (pulsing) */}
              {isNext && (
                <>
                  <line
                    x1={from.x + nodeRadius}
                    y1={from.y}
                    x2={to.x - nodeRadius}
                    y2={to.y}
                    stroke={colors.border}
                    strokeWidth="3"
                    strokeDasharray="10 5"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-30"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                </>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {levels.map((level, i) => {
          const pos = nodePositions[i];
          const isUnlocked = i < currentLevel;
          const isCurrent = i === currentLevel;
          const isNext = i === currentLevel; // Next upgradable
          const isLocked = i > currentLevel;

          const nodeColors = isLegendary && isUnlocked
            ? { fill: 'url(#legendaryGrad)', stroke: '#FFD700' }
            : {
                fill: isUnlocked ? colors.border : 'rgba(60,60,60,0.5)',
                stroke: isUnlocked ? '#fff' : '#555',
              };

          return (
            <g
              key={`node-${i}`}
              onClick={() => isNext && canAffordUpgrade && onUpgrade()}
              style={{ cursor: isNext && canAffordUpgrade ? 'pointer' : 'default' }}
            >
              {/* Glow for unlocked nodes */}
              {isUnlocked && !isLegendary && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius + 6}
                  fill={colors.glow}
                  opacity="0.3"
                >
                  {isCurrent && (
                    <animate
                      attributeName="r"
                      values={`${nodeRadius + 4};${nodeRadius + 10};${nodeRadius + 4}`}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              )}

              {/* Main circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={nodeColors.fill}
                stroke={nodeColors.stroke}
                strokeWidth={isUnlocked ? 3 : 2}
                strokeDasharray={isLocked ? '6 4' : 'none'}
                initial={false}
                animate={isCurrent && canAffordUpgrade ? {
                  r: [nodeRadius, nodeRadius + 4, nodeRadius],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Inner icon */}
              {isUnlocked ? (
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  fontSize="20"
                >
                  {LEVEL_ICONS[i]}
                </text>
              ) : (
                <g transform={`translate(${pos.x - 8}, ${pos.y - 8})`}>
                  <Lock size={16} color="#555" />
                </g>
              )}

              {/* Level number below */}
              <text
                x={pos.x}
                y={pos.y + nodeRadius + 18}
                textAnchor="middle"
                fill={isUnlocked ? '#fff' : '#555'}
                fontSize="11"
                fontWeight="600"
              >
                Lv.{i + 1}
              </text>

              {/* Level name below number */}
              <text
                x={pos.x}
                y={pos.y + nodeRadius + 32}
                textAnchor="middle"
                fill={isUnlocked ? colors.border : '#555'}
                fontSize="10"
              >
                {isLocked ? '???' : level.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Level Comparison Table ─── */
function LevelComparisonTable({
  levels,
  currentLevel,
  rarity,
}: {
  levels: InvestmentLevel[];
  currentLevel: number;
  rarity: string;
}) {
  const current = levels[Math.min(currentLevel - 1, levels.length - 1)];
  const next = currentLevel < 7 ? levels[currentLevel] : null;

  if (!next) {
    return (
      <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)' }}>
        <Crown size={24} className="mx-auto mb-2 text-[#FFD700]" />
        <p className="text-sm font-semibold text-[#FFD700]">已达最高等级</p>
        <p className="text-xs text-[#888] mt-1">传说王朝 — 无可匹敌</p>
      </div>
    );
  }

  const rows = [
    { label: '收益率', current: `${(current.returnRate * 100).toFixed(1)}%`, next: `${(next.returnRate * 100).toFixed(1)}%`, diff: `+${((next.returnRate - current.returnRate) * 100).toFixed(1)}%`, positive: true },
    { label: '暴击率', current: `${(current.critRate * 100).toFixed(0)}%`, next: `${(next.critRate * 100).toFixed(0)}%`, diff: `+${((next.critRate - current.critRate) * 100).toFixed(0)}%`, positive: true },
    { label: '暴击倍率', current: `${current.critMultiplierMin}-${current.critMultiplierMax}x`, next: `${next.critMultiplierMin}-${next.critMultiplierMax}x`, diff: '提升', positive: true },
    { label: '失败率', current: `${(current.failRate * 100).toFixed(0)}%`, next: `${(next.failRate * 100).toFixed(0)}%`, diff: current.failRate === next.failRate ? '—' : `${((next.failRate - current.failRate) * 100).toFixed(0)}%`, positive: next.failRate <= current.failRate },
    { label: '投资范围', current: `£${current.minInvest.toLocaleString()}-£${current.maxInvest.toLocaleString()}`, next: `£${next.minInvest.toLocaleString()}-£${next.maxInvest.toLocaleString()}`, diff: '扩大', positive: true },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Header */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3 text-xs font-semibold text-[#888] uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <span>属性</span>
        <span className="text-center">当前 Lv.{currentLevel}</span>
        <span className="text-center" style={{ color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS].border }}>下一级 Lv.{currentLevel + 1}</span>
        <span className="text-center">变化</span>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <motion.div
          key={row.label}
          className="grid grid-cols-4 gap-2 px-4 py-3 text-sm items-center transition-colors duration-150 hover:bg-white/[0.03]"
          style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3, ease: easeOutExpo }}
        >
          <span className="text-[#AAA] font-medium">{row.label}</span>
          <span className="text-center text-white font-semibold">{row.current}</span>
          <span className="text-center font-semibold" style={{ color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS].border }}>{row.next}</span>
          <span className={`text-center text-xs font-bold ${row.positive ? 'text-[#00E676]' : 'text-[#FF1744]'}`}>
            {row.positive && row.diff !== '—' ? '↑ ' : ''}{row.diff}
          </span>
        </motion.div>
      ))}

      {/* New perk row */}
      <motion.div
        className="grid grid-cols-4 gap-2 px-4 py-3 text-sm items-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rows.length * 0.05, duration: 0.3, ease: easeOutExpo }}
      >
        <span className="text-[#AAA] font-medium">新特效</span>
        <span className="text-center text-[#555]">—</span>
        <span className="text-center text-[#FF00FF] font-semibold text-xs">{next.description}</span>
        <span className="text-center text-[#FF00FF] text-xs font-bold">✨ 新</span>
      </motion.div>
    </div>
  );
}

/* ─── Main InvestmentModal Component ─── */
export default function InvestmentModal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();

  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [confirmAllIn, setConfirmAllIn] = useState(false);
  const [lastResult, setLastResult] = useState<{ outcome: string; amount: number; multiplier: number } | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  const investment = INVESTMENTS.find((inv) => inv.id === id);
  const playerInv = state.player.investments.find((pi) => pi.investmentId === id);
  const currentLevel = playerInv?.level || 1;
  const levelData = investment?.levels[Math.min(currentLevel - 1, 6)];

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/play');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  /* Derive investment stats */
  const colors = investment ? RARITY_COLORS[investment.rarity] : null;
  const eraConfig = investment ? ERA_CONFIG[investment.era] : null;
  const isLegendary = investment?.rarity === 'legendary';

  /* Amount calculations */
  const minInvest = levelData?.minInvest || 0;
  const maxInvest = Math.min(levelData?.maxInvest || 0, state.player.asset);
  const allInAmount = state.player.asset;

  /* Initialize slider */
  useEffect(() => {
    if (sliderValue === 0 && minInvest > 0) {
      setSliderValue(Math.min(minInvest * 5, maxInvest, state.player.asset));
    }
  }, [minInvest, maxInvest, state.player.asset, sliderValue]);

  /* Upgrade */
  const canUpgradeLevel = investment ? canUpgrade(investment, currentLevel, state.player.asset) : false;
  const upgradeCost = investment ? getUpgradeCost(investment, currentLevel) : Infinity;

  const handleUpgrade = useCallback(() => {
    if (!investment || !canUpgradeLevel) return;
    setUpgrading(true);
    setTimeout(() => {
      dispatch({ type: 'UPGRADE_INVEST', payload: { investmentId: investment.id } });
      setUpgrading(false);
    }, 800);
  }, [investment, canUpgradeLevel, dispatch]);

  /* Invest handler */
  const handleInvest = useCallback((amount: number) => {
    if (!investment || amount <= 0 || amount > state.player.asset) return;

    const result = calculateReturn(
      investment,
      currentLevel,
      amount,
      state.player.heir?.talents || [],
      {
        comboCount: state.comboCount,
        critEnergy: state.critEnergy,
        cashReserve: state.player.cashReserve,
        totalAsset: state.player.asset,
        marriageCritBonus: state.player.marriages.reduce((sum, m) => sum + m.critBonus, 0),
      }
    );

    dispatch({
      type: 'INVEST',
      payload: {
        investmentId: investment.id,
        amount,
        outcome: result.outcome,
        returnAmount: result.returnAmount,
        multiplier: result.multiplier,
      },
    });

    setLastResult({ outcome: result.outcome, amount: result.returnAmount, multiplier: result.multiplier });

    if (result.outcome === 'crit') {
      navigate('/crit', { state: { multiplier: result.multiplier, returnAmount: result.returnAmount, combo: state.comboCount + 1 } });
    }
  }, [investment, currentLevel, state, dispatch, navigate]);

  /* ALL-IN with drama */
  const handleAllIn = useCallback(() => {
    if (!confirmAllIn) {
      setConfirmAllIn(true);
      setTimeout(() => setConfirmAllIn(false), 1500);
      return;
    }
    setConfirmAllIn(false);
    handleInvest(allInAmount);
  }, [confirmAllIn, allInAmount, handleInvest]);

  /* No investment found */
  if (!investment || !colors || !eraConfig || !levelData) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center">
          <p className="text-xl text-[#FF1744] mb-4">投资物未找到</p>
          <button
            onClick={() => navigate('/play')}
            className="px-6 py-2 rounded-xl text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            返回游戏
          </button>
        </div>
      </motion.div>
    );
  }

  const investAmount = Math.min(maxInvest, Math.max(minInvest, Math.floor(state.player.asset * 0.1)));

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Legendary shimmer background */}
      {isLegendary && (
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,107,0.15), rgba(78,205,196,0.15))',
            backgroundSize: '300% 300%',
            animation: 'shimmer 3s infinite linear',
          }}
        />
      )}

      <motion.div
        className="relative w-full max-w-[1100px] max-h-[90dvh] rounded-3xl overflow-hidden flex flex-col lg:flex-row"
        style={{
          background: 'rgba(15,15,15,0.97)',
          border: `1px solid ${isLegendary ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isLegendary
            ? '0 0 60px rgba(255,215,0,0.15), inset 0 0 60px rgba(255,215,0,0.03)'
            : '0 20px 80px rgba(0,0,0,0.5)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
      >
        {/* ─── Left Panel: Investment Info ─── */}
        <motion.div
          className="w-full lg:w-[360px] flex-shrink-0 p-6 lg:p-8 flex flex-col gap-5 overflow-y-auto"
          style={{
            background: 'rgba(20,20,20,0.95)',
            borderRight: `1px solid ${isLegendary ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)'}`,
          }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
        >
          {/* Close button */}
          <button
            onClick={() => navigate('/play')}
            className="absolute top-4 right-4 lg:right-auto lg:left-4 w-9 h-9 rounded-full flex items-center justify-center text-[#888] hover:text-white hover:bg-white/10 transition-all duration-200 z-10"
            style={{ transformOrigin: 'center' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mt-4"
            style={{
              background: `linear-gradient(135deg, ${eraConfig.themeColor}40, ${eraConfig.themeColor}15)`,
              border: `2px solid ${eraConfig.themeColor}60`,
              boxShadow: isLegendary ? `0 0 30px ${colors.glow}` : `0 0 15px ${eraConfig.themeColor}30`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: easeOutBack }}
          >
            {investment.icon}
          </motion.div>

          {/* Name */}
          <motion.h2
            className="text-2xl lg:text-[28px] font-bold text-white text-center leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: easeOutExpo }}
          >
            {investment.name}
          </motion.h2>

          {/* Rarity badge */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: easeOutBack }}
          >
            <RarityBadge rarity={investment.rarity} />
          </motion.div>

          {/* Category */}
          <div className="flex justify-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${eraConfig.themeColor}20`,
                color: eraConfig.themeColor,
                border: `1px solid ${eraConfig.themeColor}40`,
              }}
            >
              {investment.era === 1 ? '蒸汽与纺织' : investment.era === 2 ? '钢铁与电气' : investment.era === 3 ? '信息与电子' : '智能与数据'}
            </span>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#AAA',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {investment.type === 'industry' ? '工业' : investment.type === 'finance' ? '金融' : investment.type === 'technology' ? '科技' : investment.type === 'logistics' ? '物流' : '能源'}
            </span>
          </div>

          {/* Core stats */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-sm text-[#888]">当前等级</span>
              <span className="text-base font-bold" style={{ color: colors.border }}>
                Lv.{currentLevel} {levelData.name}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-sm text-[#888]">收益率</span>
              <span className="text-lg font-bold text-[#00E676]">{(levelData.returnRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-sm text-[#888]">暴击率</span>
              <span className="text-base font-bold text-[#FF00FF]">{(levelData.critRate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-sm text-[#888]">暴击倍率</span>
              <span className="text-base font-bold text-[#FFD700]">{levelData.critMultiplierMin}x - {levelData.critMultiplierMax}x</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-sm text-[#888]">失败率</span>
              <span className="text-sm font-bold text-[#FF1744]">{(levelData.failRate * 100).toFixed(0)}%</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <p className="text-sm text-[#CCC] leading-relaxed">{investment.description}</p>
          </motion.div>

          {/* Flavor text */}
          <motion.div
            className="rounded-lg p-4"
            style={{
              borderLeft: `3px solid ${isLegendary ? '#FFD700' : colors.border}`,
              background: 'rgba(255,255,255,0.02)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <p className={`text-sm italic leading-relaxed ${isLegendary ? 'text-[#FFD700]' : 'text-[#888]'}`}>
              "{levelData.description}"
            </p>
          </motion.div>

          {/* Risk stars */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#888]">风险等级</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < investment.riskStars ? 'text-[#FFB300]' : 'text-[#333]'}`}>★</span>
              ))}
            </div>
          </div>

          {/* Investment actions */}
          <motion.div
            className="flex flex-col gap-3 mt-auto pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {/* ALL-IN button */}
            <button
              onClick={handleAllIn}
              disabled={allInAmount <= 0}
              className="w-full h-[52px] rounded-xl text-base font-bold transition-all duration-200 hover:brightness-125 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: confirmAllIn
                  ? 'linear-gradient(135deg, #FF1744, #8B0000)'
                  : 'linear-gradient(135deg, #FFD700, #B8860B)',
                color: confirmAllIn ? '#fff' : '#1A0F0A',
                boxShadow: confirmAllIn
                  ? '0 0 20px rgba(255,23,68,0.4)'
                  : '0 4px 15px rgba(255,215,0,0.25)',
              }}
            >
              {confirmAllIn ? '确定？再次点击确认' : `ALL-IN ${fmtCurrency(allInAmount)}`}
            </button>

            {/* Single invest button */}
            <button
              onClick={() => setShowSlider(!showSlider)}
              disabled={investAmount <= 0}
              className="w-full h-12 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-115 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${eraConfig.themeColor}, ${eraConfig.themeColor}99)`,
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <TrendingUp size={16} />
                单笔投资 {fmtCurrency(investAmount)}
              </span>
            </button>

            {/* Amount slider */}
            <AnimatePresence>
              {showSlider && (
                <motion.div
                  className="flex flex-col gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#888]">投资金额</span>
                    <span className="text-lg font-bold text-[#FFD700]">{fmtCurrency(sliderValue)}</span>
                  </div>
                  <input
                    type="range"
                    min={minInvest}
                    max={maxInvest}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="w-full accent-[#FFD700]"
                  />
                  <div className="flex justify-between text-xs text-[#666]">
                    <span>{fmtCurrency(minInvest)}</span>
                    <span>{fmtCurrency(maxInvest)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { handleInvest(sliderValue); setShowSlider(false); }}
                      className="flex-1 h-10 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-115 active:scale-[0.97]"
                      style={{ background: `linear-gradient(135deg, ${eraConfig.themeColor}, ${eraConfig.themeColor}99)` }}
                    >
                      确认投资
                    </button>
                    <button
                      onClick={() => setShowSlider(false)}
                      className="h-10 px-4 rounded-lg text-sm text-[#888] hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                      取消
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Last result */}
            <AnimatePresence>
              {lastResult && (
                <motion.div
                  className="flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold"
                  style={{
                    background: lastResult.outcome === 'crit' ? 'rgba(255,0,255,0.1)' : lastResult.outcome === 'normal' ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)',
                    color: lastResult.outcome === 'crit' ? '#FF00FF' : lastResult.outcome === 'normal' ? '#00E676' : '#FF1744',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {lastResult.outcome === 'crit' && <Zap size={16} />}
                  {lastResult.outcome === 'crit' ? `暴击！${lastResult.multiplier.toFixed(1)}x · +${fmtCurrency(lastResult.amount)}`
                    : lastResult.outcome === 'normal' ? `收益 +${fmtCurrency(lastResult.amount)}`
                    : `损失 ${fmtCurrency(Math.abs(lastResult.amount))}`}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upgrade button */}
            {currentLevel < 7 && (
              <button
                onClick={handleUpgrade}
                disabled={!canUpgradeLevel || upgrading}
                className="w-full h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-115 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: canUpgradeLevel && !upgrading
                    ? `linear-gradient(135deg, ${colors.border}60, ${colors.border}30)`
                    : 'rgba(255,255,255,0.05)',
                  color: canUpgradeLevel && !upgrading ? colors.border : '#555',
                  border: `1px solid ${canUpgradeLevel && !upgrading ? colors.border + '60' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                {upgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    升级中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ChevronRight size={16} />
                    升级到 Lv.{currentLevel + 1} ({fmtCurrency(upgradeCost)})
                  </span>
                )}
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* ─── Right Panel: Upgrade Tree + Comparison ─── */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto flex flex-col gap-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3
              className="text-xl font-bold text-white mb-1"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              升级路线
            </h3>
            <p className="text-xs text-[#888]">7级肉鸽技能树 — 从作坊到传说王朝</p>
          </motion.div>

          {/* Upgrade tree */}
          <motion.div
            className="rounded-2xl p-4 lg:p-6"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${isLegendary ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)'}`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <UpgradeTree
              levels={investment.levels}
              currentLevel={currentLevel}
              rarity={investment.rarity}
              onUpgrade={handleUpgrade}
              canAffordUpgrade={canUpgradeLevel}
            />

            {/* Current level highlight */}
            <div
              className="mt-4 text-center py-2 px-4 rounded-lg inline-block mx-auto w-full"
              style={{
                backgroundColor: `${colors.border}10`,
                border: `1px solid ${colors.border}30`,
              }}
            >
              <span className="text-sm font-semibold" style={{ color: colors.border }}>
                当前等级: Lv.{currentLevel} {levelData.name}
              </span>
            </div>
          </motion.div>

          {/* Level comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <h4 className="text-base font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              等级数值对比
            </h4>
            <LevelComparisonTable
              levels={investment.levels}
              currentLevel={currentLevel}
              rarity={investment.rarity}
            />
          </motion.div>

          {/* Unlocked perks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <h4 className="text-base font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              已解锁特效
            </h4>
            <div className="flex flex-col gap-2">
              {investment.levels.slice(0, currentLevel).map((lvl, i) => (
                <motion.div
                  key={lvl.name}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
                >
                  <span className="text-[#00E676] flex-shrink-0">
                    <TrendingUp size={14} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium">
                      {i === 6 ? <Crown size={12} className="inline mr-1 text-[#FFD700]" /> : null}
                      {lvl.name}
                    </span>
                    <span className="text-xs text-[#888]">{lvl.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Crit rate preview */}
          <motion.div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              background: 'rgba(255,0,255,0.04)',
              border: '1px solid rgba(255,0,255,0.1)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <Zap size={20} className="text-[#FF00FF] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#FF00FF]">
                暴击率预览: {((levelData.critRate + Math.min(state.comboCount * 0.02, 0.10)) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-[#888] mt-0.5">
                基础 {(levelData.critRate * 100).toFixed(0)}%
                {state.comboCount > 0 && ` + 连击加成 ${(Math.min(state.comboCount * 0.02, 0.10) * 100).toFixed(0)}%`}
                {state.player.marriages.length > 0 && ` + 联姻加成`}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
