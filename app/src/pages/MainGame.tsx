import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router';
import { useGameState } from '@/engine/GameState';
import { INVESTMENTS, getInvestmentsByEra } from '@/data/investments';
import { calculateReturn } from '@/engine/InvestEngine';
import { checkEraTransition } from '@/engine/EventSystem';
import { generateAILog } from '@/engine/AISystem';
import { saveGame } from '@/engine/SaveSystem';
import { ERA_CONFIG } from '@/data/constants';
import Layout from '@/components/Layout';
import InvestmentCard from '@/components/InvestmentCard';
import CritEffect from '@/components/CritEffect';
import InvestmentModal from '@/components/InvestmentModal';
import CritOverlay from '@/components/CritOverlay';
import type { Era, GameLogEntry, InvestResult } from '@/data/types';
import { Crown, Trophy, Settings, Heart, TrendingUp, Star, AlertTriangle } from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function MainGame() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCards, setSelectedCards] = useState<typeof INVESTMENTS>([]);
  const [showCritEffect, setShowCritEffect] = useState(false);
  const [critMultiplier, setCritMultiplier] = useState(1);
  const [floatingText, setFloatingText] = useState<{ text: string; color: string; id: number } | null>(null);
  const [lastInvestResult, setLastInvestResult] = useState<InvestResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const prevEraRef = useRef(state.currentEra);

  const eraConfig = ERA_CONFIG[state.currentEra];
  const bgImage = `./bg-era${state.currentEra}.jpg`;

  // Generate 3 random investment cards for the current era
  useEffect(() => {
    const eraInvestments = getInvestmentsByEra(state.currentEra);
    const shuffled = [...eraInvestments].sort(() => Math.random() - 0.5);
    setSelectedCards(shuffled.slice(0, 3));
    setCardKey(k => k + 1);
  }, [state.currentEra, state.turn]);

  // Refresh cards function
  const refreshCards = useCallback(() => {
    const eraInvestments = getInvestmentsByEra(state.currentEra);
    const shuffled = [...eraInvestments].sort(() => Math.random() - 0.5);
    setSelectedCards(shuffled.slice(0, 3));
    setCardKey(k => k + 1);
  }, [state.currentEra]);

  // Handle investment
  const handleInvest = useCallback((investment: typeof INVESTMENTS[0], amountType: 'all' | 'single') => {
    const invLevel = investment.levels[0];
    const amount = amountType === 'all'
      ? state.player.asset
      : Math.min(invLevel.maxInvest, Math.max(invLevel.minInvest, Math.floor(state.player.asset * 0.1)));

    if (amount <= 0 || amount > state.player.asset) return;

    const result = calculateReturn(
      investment,
      1,
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

    // Apply cash reserve bonus
    const finalReturnAmount = result.returnAmount > 0
      ? Math.floor(result.returnAmount * (1 + (state.player.cashReserve / state.player.asset > 0.5 ? 0.1 : 0)))
      : result.returnAmount;

    const finalResult = { ...result, returnAmount: finalReturnAmount };

    dispatch({
      type: 'INVEST',
      payload: {
        investmentId: investment.id,
        amount,
        outcome: finalResult.outcome,
        returnAmount: finalResult.returnAmount,
        multiplier: finalResult.multiplier,
      },
    });

    setLastInvestResult(finalResult);
    setShowResult(true);

    // Show crit effect
    if (finalResult.outcome === 'crit') {
      setCritMultiplier(finalResult.multiplier);
      setShowCritEffect(true);
      setTimeout(() => setShowCritEffect(false), 3000);
    }

    // Floating text
    const isPositive = finalResult.returnAmount > 0;
    setFloatingText({
      text: isPositive ? `+£${finalResult.returnAmount.toLocaleString()}` : `£${finalResult.returnAmount.toLocaleString()}`,
      color: isPositive ? '#00E676' : '#FF1744',
      id: Date.now(),
    });
    setTimeout(() => setFloatingText(null), 1500);

    // Add AI log
    const aiFamily = state.aiFamilies[Math.floor(Math.random() * state.aiFamilies.length)];
    if (aiFamily) {
      const logEntry: GameLogEntry = {
        id: `log_${Date.now()}`,
        familyName: aiFamily.name,
        action: generateAILog(aiFamily, state.currentEra),
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_LOG', payload: logEntry });
    }

    // End year after investment
    setTimeout(() => {
      dispatch({ type: 'END_YEAR' });
      refreshCards();
      setShowResult(false);
    }, 2000);

    // Auto save
    setTimeout(() => {
      saveGame(state);
    }, 500);
  }, [state, dispatch, refreshCards]);

  // Check era transition
  useEffect(() => {
    if (checkEraTransition(state)) {
      if (state.currentEra < 4) {
        dispatch({ type: 'NEXT_ERA' });
      } else {
        dispatch({ type: 'GAME_OVER', payload: { victory: state.player.asset >= 1000000000000 } });
      }
    }
  }, [state.turn]);

  // Navigate to era transition when era changes
  useEffect(() => {
    if (state.currentEra !== prevEraRef.current) {
      prevEraRef.current = state.currentEra;
      navigate('/era-transition');
    }
  }, [state.currentEra, navigate]);

  // Trigger random events at the start of each year (turn)
  useEffect(() => {
    if (state.turn <= 1) return; // Skip first turn

    // Check if we should trigger events this turn (50% chance)
    if (Math.random() < 0.5) {
      // Decide event type: crisis (40%), opportunity (50%), legendary (10%)
      const roll = Math.random();
      if (roll < 0.1) {
        // Legendary opportunity
        navigate('/event/legendary');
      } else if (roll < 0.5) {
        // Crisis
        navigate('/event/crisis');
      } else {
        // Regular opportunity
        navigate('/event/opportunity');
      }
    }
  }, [state.turn, navigate]);

  // Rank display
  const playerRank = state.ranking.indexOf('player') + 1;
  const totalFamilies = state.ranking.length;

  // Combo color
  const comboColor = state.comboCount >= 10 ? '#FF00FF'
    : state.comboCount >= 5 ? '#FF1744'
    : state.comboCount >= 3 ? '#FFB300'
    : '#FFD700';

  return (
    <Layout bgImage={bgImage} era={state.currentEra as Era} overlayOpacity={0.85}>
      {/* Crit overlay */}
      <CritEffect active={showCritEffect} multiplier={critMultiplier} />

      {/* Floating text */}
      <AnimatePresence>
        {floatingText && (
          <motion.div
            key={floatingText.id}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none text-4xl font-bold"
            style={{ color: floatingText.color, fontFamily: 'Bebas Neue, sans-serif' }}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -80, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: easeOutExpo }}
          >
            {floatingText.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD Bar */}
      <motion.header
        className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          {/* Year */}
          <span className="text-lg font-bold text-[#FFD700]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {state.currentYear}年
          </span>
          {/* Era badge */}
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${eraConfig.themeColor}30`,
              color: eraConfig.themeColor,
              border: `1px solid ${eraConfig.themeColor}50`,
            }}
          >
            {eraConfig.name} · {eraConfig.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Asset */}
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#888]">资产</span>
            <motion.span
              className="text-xl font-bold text-[#FFD700]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              key={state.player.asset}
              initial={{ scale: 1.3, color: '#00E676' }}
              animate={{ scale: 1, color: '#FFD700' }}
              transition={{ duration: 0.6 }}
            >
              £{state.player.asset.toLocaleString()}
            </motion.span>
          </div>

          {/* Reputation */}
          <div className="flex items-center gap-1.5">
            <Crown size={16} className="text-[#FF6F00]" />
            <span className="text-sm font-semibold text-[#FF6F00]">{state.player.reputation}</span>
          </div>

          {/* Rank */}
          <div className="flex items-center gap-1.5">
            <Trophy size={16} className="text-[#FFD700]" />
            <span className="text-sm font-semibold text-white">第{playerRank}名/{totalFamilies}</span>
          </div>
        </div>
      </motion.header>

      {/* Main 3-column layout */}
      <div className="pt-16 pb-20 min-h-[100dvh] flex gap-4 px-4 max-w-[1440px] mx-auto">
        {/* Left Sidebar - Investment Panel */}
        <motion.aside
          className="w-[280px] flex-shrink-0 flex flex-col gap-4 py-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                当前投资
              </h2>
              <span className="text-xs text-[#888]">{state.player.investments.length}/5</span>
            </div>

            {state.player.investments.length === 0 ? (
              <p className="text-xs text-[#666] text-center py-4">暂无投资</p>
            ) : (
              <div className="flex flex-col gap-2">
                {state.player.investments.map((inv) => {
                  const invData = INVESTMENTS.find(i => i.id === inv.investmentId);
                  if (!invData) return null;
                  const levelName = invData.levels[Math.min(inv.level - 1, 6)].name;
                  return (
                    <div key={inv.investmentId}
                      className="flex items-center gap-3 p-2 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${ERA_CONFIG[invData.era].themeColor}20` }}>
                        {invData.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {invData.name}
                        </p>
                        <p className="text-[10px]" style={{ color: ERA_CONFIG[invData.era].themeColor }}>
                          Lv.{inv.level} {levelName}
                        </p>
                      </div>
                      <span className="text-xs text-[#00E676] font-medium">
                        +£{Math.floor(inv.totalReturned * 0.1).toLocaleString()}/轮
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* New investment button */}
            <button
              onClick={refreshCards}
              className="w-full h-12 rounded-xl border-2 border-dashed border-[#555] text-[#888] hover:border-[#FFD700] hover:text-[#FFD700] hover:bg-[rgba(255,215,0,0.05)] transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
            >
              + 刷新投资选项
            </button>
          </div>

          {/* Asset overview */}
          <div className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="h-[1px] bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#888]">总资产</span>
              <span className="text-lg font-bold text-[#FFD700]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                £{state.player.asset.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#888]">现金储备</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-[#333] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (state.player.cashReserve / Math.max(1, state.player.asset)) * 100)}%`,
                      backgroundColor: (state.player.cashReserve / Math.max(1, state.player.asset)) > 0.5 ? '#00E676' : '#FFB300',
                    }} />
                </div>
                <span className="text-xs text-[#AAA]">
                  {((state.player.cashReserve / Math.max(1, state.player.asset)) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#888]">暴击能量</span>
              <div className="w-20 h-1.5 rounded-full bg-[#333] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${state.critEnergy}%`,
                    background: state.critEnergy >= 100 ? 'linear-gradient(90deg, #FFD700, #FF6B6B)' : '#FFD700',
                  }} />
              </div>
              <span className="text-xs text-[#AAA]">{state.critEnergy}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#888]">连击</span>
              <span className="text-sm font-bold" style={{ color: comboColor }}>
                x{state.comboCount}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#888]">时代进度</span>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full"
                    style={{ backgroundColor: i < state.turn ? '#FFD700' : '#333' }} />
                ))}
              </div>
              <span className="text-xs text-[#888] text-right">{state.turn}/10</span>
            </div>
          </div>
        </motion.aside>

        {/* Center - Investment Cards */}
        <main className="flex-1 flex flex-col items-center justify-center py-4">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <AnimatePresence mode="wait">
              {selectedCards.map((investment, index) => (
                <InvestmentCard
                  key={`${cardKey}_${investment.id}`}
                  investment={investment}
                  playerAsset={state.player.asset}
                  onInvest={(type) => handleInvest(investment, type)}
                  onViewRoute={() => navigate(`/invest/${investment.id}`)}
                  index={index}
                  showActions={true}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Result popup */}
          <AnimatePresence>
            {showResult && lastInvestResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl z-30"
                style={{
                  background: 'rgba(20,20,20,0.95)',
                  backdropFilter: 'blur(12px)',
                  border: `2px solid ${lastInvestResult.outcome === 'crit' ? '#FF00FF' : lastInvestResult.outcome === 'normal' ? '#00E676' : '#FF1744'}`,
                  boxShadow: `0 0 30px ${lastInvestResult.outcome === 'crit' ? 'rgba(255,0,255,0.3)' : lastInvestResult.outcome === 'normal' ? 'rgba(0,230,118,0.3)' : 'rgba(255,23,68,0.3)'}`,
                }}
              >
                <p className="text-sm font-medium text-center" style={{
                  color: lastInvestResult.outcome === 'crit' ? '#FF00FF' : lastInvestResult.outcome === 'normal' ? '#00E676' : '#FF1744',
                }}>
                  {lastInvestResult.message}
                </p>
                {lastInvestResult.outcome === 'crit' && (
                  <p className="text-xs text-[#FF00FF] text-center mt-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {lastInvestResult.multiplier.toFixed(1)}x 暴击倍率
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar - Rankings */}
        <motion.aside
          className="w-[240px] flex-shrink-0 flex flex-col gap-4 py-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                财富排名
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: eraConfig.themeColor }}>
                {eraConfig.subtitle}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {state.ranking.map((familyId, index) => {
                const isPlayer = familyId === 'player';
                const aiFamily = state.aiFamilies.find(a => a.familyId === familyId);
                const asset = isPlayer ? state.player.asset : aiFamily?.asset || 0;
                const name = isPlayer ? state.player.name : aiFamily?.name || '???';
                const color = isPlayer ? eraConfig.themeColor : aiFamily?.color || '#888';
                const trend = aiFamily?.trend || 'stable';
                const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                const rankColor = index < 3 ? rankColors[index] : '#888';

                return (
                  <motion.div
                    key={familyId}
                    layout
                    className="flex items-center gap-2 p-2 rounded-xl transition-colors duration-200"
                    style={{
                      background: isPlayer ? `${eraConfig.themeColor}15` : 'transparent',
                      border: isPlayer ? `1px solid ${eraConfig.themeColor}40` : '1px solid transparent',
                    }}
                  >
                    <span className="w-6 text-center text-sm font-bold" style={{ color: rankColor }}>
                      {index < 3 && <span>♔</span>}
                      {index >= 3 && index + 1}
                    </span>
                    <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="flex-1 text-sm text-white truncate">{name}</span>
                    <span className="text-xs text-[#FFD700] font-medium">
                      £{(asset / 1000000).toFixed(1)}M
                    </span>
                    {trend === 'up' && <TrendingUp size={12} className="text-[#00E676]" />}
                    {trend === 'down' && <TrendingUp size={12} className="text-[#FF1744] rotate-180" />}
                  </motion.div>
                );
              })}
            </div>

            {/* AI Logs */}
            <div className="h-[1px] bg-white/10" />
            <div>
              <h3 className="text-xs font-semibold text-[#888] mb-2 uppercase tracking-wider">AI行动日志</h3>
              <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto">
                {state.logs.slice(0, 5).map((log) => (
                  <motion.p
                    key={log.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-[#888] leading-relaxed"
                  >
                    <span className="text-[#AAA]">{log.familyName}</span> {log.action}
                  </motion.p>
                ))}
                {state.logs.length === 0 && (
                  <p className="text-[11px] text-[#666]">暂无行动记录</p>
                )}
              </div>
            </div>
          </div>

          {/* Crisis/Opportunity indicators */}
          {(state.activeCrises.length > 0 || state.activeOpportunities.length > 0) && (
            <div className="flex flex-col gap-2">
              {state.activeCrises.map(crisis => (
                <div key={crisis.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF1744]/10 border border-[#FF1744]/30">
                  <AlertTriangle size={14} className="text-[#FF1744]" />
                  <span className="text-xs text-[#FF1744]">{crisis.name}</span>
                </div>
              ))}
              {state.activeOpportunities.map(opp => (
                <div key={opp.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/30">
                  <Star size={14} className="text-[#FFD700]" />
                  <span className="text-xs text-[#FFD700]">{opp.name}</span>
                </div>
              ))}
            </div>
          )}
        </motion.aside>
      </div>

      {/* Bottom Action Bar */}
      <motion.footer
        className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-between px-6 z-40"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        {/* Heir info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Crown size={18} className="text-[#FFD700]" />
          </div>
          <div>
            <p className="text-sm text-white">
              {state.player.heir ? `继承人: ${state.player.heir.name}` : '暂无继承人'}
            </p>
            <p className="text-xs text-[#888]">
              {state.player.heir ? `${state.player.heir.age}岁 · ${state.player.heir.talents.length}个天赋` : '请联姻以产生继承人'}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-3">
          {[
            { icon: Heart, label: '联姻', color: '#FF1744' },
            { icon: TrendingUp, label: '培养', color: '#00E676' },
            { icon: Trophy, label: '排名', color: '#FFD700' },
            { icon: Star, label: '成就', color: '#FFB300' },
            { icon: Settings, label: '设置', color: '#A0A0A0' },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#AAA',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${color}20`;
                e.currentTarget.style.color = color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#AAA';
              }}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>

        {/* Era status */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: eraConfig.themeColor }}>
            {eraConfig.description}
          </span>
          {state.activeCrises.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FF1744]/20 text-[#FF1744] border border-[#FF1744]/30">
              ⚠ 危机
            </span>
          )}
          {state.activeOpportunities.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
              ✦ 机遇
            </span>
          )}
        </div>
      </motion.footer>

      {/* Game Over overlay */}
      <AnimatePresence>
        {state.gameOver && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
            >
              <h1 className="text-6xl font-bold mb-4"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: state.victory ? '#FFD700' : '#FF1744',
                }}>
                {state.victory ? '胜利！' : '家族衰落'}
              </h1>
              <p className="text-xl text-[#AAA] mb-2">
                {state.victory
                  ? '你建立了万亿商业王朝！'
                  : '你的家族资产已耗尽...'}
              </p>
              <p className="text-lg text-[#FFD700] mb-8">
                最终资产: £{state.player.asset.toLocaleString()}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:brightness-125 active:scale-[0.97]"
                style={{
                  background: state.victory
                    ? 'linear-gradient(135deg, #FFD700, #B8860B)'
                    : 'linear-gradient(135deg, #FF1744, #8B0000)',
                  color: 'white',
                }}
              >
                再来一局
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Investment Detail Modal Overlay */}
      <AnimatePresence>
        {location.pathname.startsWith('/invest/') && (
          <InvestmentModal />
        )}
      </AnimatePresence>

      {/* Crit Overlay */}
      <AnimatePresence>
        {location.pathname === '/crit' && (
          <CritOverlay />
        )}
      </AnimatePresence>
    </Layout>
  );
}
