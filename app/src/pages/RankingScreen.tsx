import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/engine/GameState';
import { AI_FAMILIES } from '@/data/aiFamilies';
import {
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Crown,
  Medal,
  Award,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { AIFamilyState } from '@/data/types';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ── Utility: format asset with K/M/B/T suffix ──
function formatAsset(value: number): string {
  if (value >= 1e12) return `£${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `£${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `£${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `£${(value / 1e3).toFixed(1)}K`;
  return `£${value.toLocaleString()}`;
}

// ── Generate mock history data for trend chart ──
function generateFamilyHistory(
  familyId: string,
  currentAsset: number,
  turns: number,
  color: string
): { familyId: string; color: string; history: number[] } {
  const history: number[] = [];
  // Work backwards from current asset to create plausible history
  let asset = currentAsset;
  for (let i = turns; i >= 0; i--) {
    history.unshift(asset);
    // Random fluctuation backwards (divide by 1.0-1.3)
    const fluctuation = 0.95 + Math.random() * 0.3;
    asset = Math.max(1000, Math.floor(asset / fluctuation));
  }
  return { familyId, color, history };
}

// ── Sparkline component ──
function Sparkline({ data, width = 60, height = 24 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return <div style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const trend = data[data.length - 1] > data[0] ? '#00E676' : data[data.length - 1] < data[0] ? '#FF1744' : '#888';

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={trend}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Trend Chart (SVG) ──
function TrendChart({
  familyHistories,
  hiddenFamilies,
  onToggleFamily,
  hoverData,
  onHover,
}: {
  familyHistories: { familyId: string; color: string; history: number[] }[];
  hiddenFamilies: Set<string>;
  onToggleFamily: (id: string) => void;
  hoverData: { familyId: string; turn: number; value: number } | null;
  onHover: (data: { familyId: string; turn: number; value: number } | null) => void;
}) {
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 80, bottom: 40, left: 70 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = familyHistories.flatMap(f => f.history);
  const minVal = Math.max(1, Math.min(...allValues));
  const maxVal = Math.max(...allValues);

  // Log scale helpers
  const logMin = Math.log10(minVal);
  const logMax = Math.log10(maxVal);
  const logRange = logMax - logMin || 1;

  const maxTurns = Math.max(...familyHistories.map(f => f.history.length), 1);

  const xScale = (turn: number) => padding.left + (turn / Math.max(1, maxTurns - 1)) * chartW;
  const yScale = (value: number) => {
    const logVal = Math.log10(Math.max(1, value));
    return padding.top + chartH - ((logVal - logMin) / logRange) * chartH;
  };

  // Grid lines (log scale)
  const gridValues = useMemo(() => {
    const grids: number[] = [];
    const startPower = Math.floor(logMin);
    const endPower = Math.ceil(logMax);
    for (let p = startPower; p <= endPower; p++) {
      grids.push(Math.pow(10, p));
      if (p < endPower) {
        grids.push(2 * Math.pow(10, p));
        grids.push(5 * Math.pow(10, p));
      }
    }
    return grids.filter(v => v >= minVal && v <= maxVal);
  }, [logMin, logMax, minVal, maxVal]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      style={{ overflow: 'visible' }}
      onMouseLeave={() => onHover(null)}
    >
      {/* Grid lines */}
      {gridValues.map((val, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={yScale(val)}
            y2={yScale(val)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
          <text
            x={padding.left - 8}
            y={yScale(val) + 3}
            fill="#888"
            fontSize={9}
            textAnchor="end"
          >
            {formatAsset(val)}
          </text>
        </g>
      ))}

      {/* X axis labels */}
      {Array.from({ length: Math.min(maxTurns, 10) }).map((_, i) => {
        const turn = Math.floor((i / 9) * (maxTurns - 1));
        return (
          <text
            key={i}
            x={xScale(turn)}
            y={height - 10}
            fill="#888"
            fontSize={9}
            textAnchor="middle"
          >
            {turn + 1}
          </text>
        );
      })}
      <text
        x={width / 2}
        y={height - 2}
        fill="#666"
        fontSize={9}
        textAnchor="middle"
      >
        回合
      </text>

      {/* Family lines */}
      <AnimatePresence>
        {familyHistories.map((family) => {
          if (hiddenFamilies.has(family.familyId)) return null;
          const points = family.history.map((val, i) => `${xScale(i)},${yScale(val)}`).join(' ');
          const isPlayer = family.familyId === 'player';

          return (
            <g key={family.familyId}>
              {/* Glow filter for player */}
              {isPlayer && (
                <defs>
                  <filter id="playerGlow">
                    <feGaussianBlur stdDeviation={3} result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              )}
              <motion.polyline
                points={points}
                fill="none"
                stroke={family.color}
                strokeWidth={isPlayer ? 3 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={isPlayer ? 'url(#playerGlow)' : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: easeOutExpo, delay: isPlayer ? 0.5 : 0.2 }}
                style={{
                  strokeDasharray: 2000,
                  strokeDashoffset: 0,
                }}
              />
              {/* Data points */}
              {family.history.map((val, i) => (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(val)}
                  r={i === family.history.length - 1 ? (isPlayer ? 6 : 4) : 3}
                  fill={family.color}
                  stroke={isPlayer ? '#FFD700' : 'none'}
                  strokeWidth={isPlayer ? 2 : 0}
                  opacity={0.9}
                  onMouseEnter={() => onHover({ familyId: family.familyId, turn: i, value: val })}
                  style={{ cursor: 'pointer' }}
                >
                  {i === family.history.length - 1 && isPlayer && (
                    <animate
                      attributeName="r"
                      values="4;7;4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              ))}
            </g>
          );
        })}
      </AnimatePresence>

      {/* Hover tooltip */}
      {hoverData && (
        <g>
          <line
            x1={xScale(hoverData.turn)}
            x2={xScale(hoverData.turn)}
            y1={padding.top}
            y2={height - padding.bottom}
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="4,4"
          />
          <rect
            x={xScale(hoverData.turn) + 8}
            y={yScale(hoverData.value) - 28}
            width={120}
            height={22}
            rx={4}
            fill="rgba(20,20,20,0.95)"
            stroke="rgba(255,255,255,0.1)"
          />
          <text
            x={xScale(hoverData.turn) + 16}
            y={yScale(hoverData.value) - 12}
            fill="#FFD700"
            fontSize={10}
          >
            {formatAsset(hoverData.value)} (第{hoverData.turn + 1}轮)
          </text>
        </g>
      )}

      {/* Legend */}
      <g transform={`translate(${width - padding.right + 5}, ${padding.top})`}>
        {familyHistories.map((family, i) => {
          const aiConfig = AI_FAMILIES.find(a => a.id === family.familyId);
          const name = family.familyId === 'player' ? '玩家' : aiConfig?.name?.replace('家族', '') || family.familyId;
          return (
            <g
              key={family.familyId}
              transform={`translate(0, ${i * 18})`}
              onClick={() => onToggleFamily(family.familyId)}
              style={{ cursor: 'pointer' }}
              opacity={hiddenFamilies.has(family.familyId) ? 0.3 : 1}
            >
              <line x1={0} y1={0} x2={14} y2={0} stroke={family.color} strokeWidth={2} />
              <text x={18} y={3} fill={hiddenFamilies.has(family.familyId) ? '#555' : '#AAA'} fontSize={9}>
                {name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ── AI Family Detail Modal Content ──
function AIFamilyDetail({ family }: { family: AIFamilyState | null }) {
  if (!family) return null;

  const aiConfig = AI_FAMILIES.find(a => a.id === family.familyId);
  const styleLabels: Record<string, string> = {
    aggressive: '激进',
    balanced: '均衡',
    conservative: '保守',
    opportunist: '投机',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${family.color}30`, border: `2px solid ${family.color}` }}
        >
          <Crown size={22} style={{ color: family.color }} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            {family.name}
          </h3>
          <p className="text-xs text-[#888]">
            风格: {styleLabels[aiConfig?.style || 'balanced']} | 风险容忍度: {aiConfig?.riskTolerance || 0.5}
          </p>
        </div>
      </div>

      <div className="h-[1px] bg-white/10" />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-xs text-[#888]">当前资产</p>
          <p className="text-lg font-bold text-[#FFD700]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {formatAsset(family.asset)}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-xs text-[#888]">声望</p>
          <p className="text-lg font-bold text-[#FF6F00]">{family.reputation}</p>
        </div>
      </div>

      {aiConfig && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-xs text-[#888] mb-1">特殊能力</p>
          <p className="text-sm text-[#AAA]">
            {aiConfig.style === 'aggressive' && '高风险高回报投资策略，暴击率提升'}
            {aiConfig.style === 'balanced' && '均衡配置资产，稳定增长'}
            {aiConfig.style === 'conservative' && '低风险保守策略，注重资产保全'}
            {aiConfig.style === 'opportunist' && '善于抓住市场机遇，收益波动较大'}
          </p>
        </div>
      )}

      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-xs text-[#888] mb-2">当前趋势</p>
        <div className="flex items-center gap-2">
          {family.trend === 'up' && <TrendingUp size={18} className="text-[#00E676]" />}
          {family.trend === 'down' && <TrendingDown size={18} className="text-[#FF1744]" />}
          {family.trend === 'stable' && <Minus size={18} className="text-[#888]" />}
          <span className={
            family.trend === 'up' ? 'text-[#00E676]' : family.trend === 'down' ? 'text-[#FF1744]' : 'text-[#888]'
          }>
            {family.trend === 'up' ? '上升趋势' : family.trend === 'down' ? '下降趋势' : '平稳'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Ranking Screen ──
export default function RankingScreen() {
  const navigate = useNavigate();
  const { state } = useGameState();
  const [hiddenFamilies, setHiddenFamilies] = useState<Set<string>>(new Set());
  const [hoverData, setHoverData] = useState<{ familyId: string; turn: number; value: number } | null>(null);
  const [selectedAIFamily, setSelectedAIFamily] = useState<AIFamilyState | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Build ranking data
  const rankingData = useMemo(() => {
    const allFamilies = [
      {
        id: 'player',
        name: state.player.name,
        asset: state.player.asset,
        color: '#FFD700',
        trend: 'up' as const,
        isPlayer: true,
      },
      ...state.aiFamilies.map(ai => ({
        id: ai.familyId,
        name: ai.name,
        asset: ai.asset,
        color: ai.color,
        trend: ai.trend,
        isPlayer: false,
      })),
    ];
    allFamilies.sort((a, b) => b.asset - a.asset);
    return allFamilies;
  }, [state.player, state.aiFamilies]);

  const playerRank = rankingData.findIndex(f => f.isPlayer) + 1;

  // Generate family histories for chart
  const familyHistories = useMemo(() => {
    const histories = [
      generateFamilyHistory('player', state.player.asset, state.turn, '#FFD700'),
      ...state.aiFamilies.map(ai =>
        generateFamilyHistory(ai.familyId, ai.asset, state.turn, ai.color)
      ),
    ];
    return histories;
  }, [state.player.asset, state.aiFamilies, state.turn]);

  // Toggle family line visibility
  const toggleFamily = useCallback((id: string) => {
    setHiddenFamilies(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/play');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Medal icons for top 3
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={18} className="text-[#FFD700]" />;
    if (rank === 2) return <Medal size={18} className="text-[#C0C0C0]" />;
    if (rank === 3) return <Award size={18} className="text-[#CD7F32]" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#888';
  };

  return (
    <div
      className="min-h-[100dvh] relative overflow-auto"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #1A0F0A 50%, #0A0A0A 100%)',
      }}
    >
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate('/play')}
          className="flex items-center gap-2 text-[#AAA] hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>

        <div className="text-center">
          <h1
            className="text-2xl font-bold text-[#FFD700]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <Trophy size={24} className="inline-block mr-2 -mt-1" />
            财富排行榜
          </h1>
          <p className="text-sm text-[#888] mt-0.5">
            第 <span className="text-[#FFD700] font-bold">{playerRank}</span> / {rankingData.length} 名
          </p>
        </div>

        <button
          onClick={() => navigate('/achievements')}
          className="flex items-center gap-2 text-[#FFD700] hover:text-white transition-colors duration-200 text-sm"
        >
          成就
          <ChevronRight size={16} />
        </button>
      </motion.header>

      <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Trend Chart */}
        <motion.div
          className="rounded-[20px] p-4 md:p-6"
          style={{
            background: 'rgba(20,20,20,0.8)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2
            className="text-lg font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            资产趋势
          </h2>
          <div className="h-[200px] md:h-[280px]">
            <TrendChart
              familyHistories={familyHistories}
              hiddenFamilies={hiddenFamilies}
              onToggleFamily={toggleFamily}
              hoverData={hoverData}
              onHover={setHoverData}
            />
          </div>
        </motion.div>

        {/* Ranking List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h2
            className="text-lg font-bold text-white mb-3 px-1"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            当前排名
          </h2>
          <div className="flex flex-col gap-1">
            <AnimatePresence>
              {rankingData.map((family, index) => {
                const rank = index + 1;
                const isPlayer = family.isPlayer;
                const history = familyHistories.find(f => f.familyId === family.id);
                const recentHistory = history?.history.slice(-5) || [];

                return (
                  <motion.div
                    key={family.id}
                    layout
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200"
                    style={{
                      background: isPlayer
                        ? 'rgba(255,215,0,0.05)'
                        : 'rgba(255,255,255,0.02)',
                      borderLeft: isPlayer
                        ? '3px solid #FFD700'
                        : family.trend === 'up'
                        ? '3px solid rgba(0,230,118,0.3)'
                        : family.trend === 'down'
                        ? '3px solid rgba(255,23,68,0.3)'
                        : '3px solid transparent',
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.08, ease: easeOutExpo }}
                    whileHover={{ backgroundColor: isPlayer ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.04)' }}
                  >
                    {/* Rank */}
                    <div className="w-10 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(rank) || (
                        <span className="text-base font-bold" style={{ color: getRankColor(rank) }}>
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* Family Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${family.color}30` }}
                    >
                      <Crown size={16} style={{ color: family.color }} />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${isPlayer ? 'text-[#FFD700]' : 'text-white'}`}
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {family.name}
                      </p>
                    </div>

                    {/* Asset */}
                    <span
                      className="text-base font-bold text-[#FFD700] flex-shrink-0"
                      style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                    >
                      {formatAsset(family.asset)}
                    </span>

                    {/* Sparkline */}
                    <div className="hidden md:block flex-shrink-0 w-[60px]">
                      <Sparkline data={recentHistory} />
                    </div>

                    {/* Trend indicator */}
                    <div className="flex-shrink-0 w-6 flex justify-center">
                      {family.trend === 'up' && <TrendingUp size={16} className="text-[#00E676]" />}
                      {family.trend === 'down' && <TrendingDown size={16} className="text-[#FF1744]" />}
                      {family.trend === 'stable' && <Minus size={16} className="text-[#888]" />}
                    </div>

                    {/* Detail button */}
                    {!isPlayer && (
                      <button
                        onClick={() => {
                          const aiFamily = state.aiFamilies.find(a => a.familyId === family.id);
                          if (aiFamily) {
                            setSelectedAIFamily(aiFamily);
                            setShowDetailModal(true);
                          }
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0"
                      >
                        <ChevronRight size={16} />
                      </button>
                    )}
                    {isPlayer && <div className="w-8 flex-shrink-0" />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Stats Comparison */}
        <motion.div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{
            background: 'rgba(20,20,20,0.8)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="text-center flex-1">
            <p className="text-xs text-[#888]">你的资产</p>
            <p className="text-lg font-bold text-[#FFD700]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              {formatAsset(state.player.asset)}
            </p>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="text-center flex-1">
            <p className="text-xs text-[#888]">AI平均</p>
            <p className="text-lg font-bold text-[#AAA]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              {formatAsset(
                state.aiFamilies.reduce((sum, ai) => sum + ai.asset, 0) / state.aiFamilies.length
              )}
            </p>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="text-center flex-1">
            <p className="text-xs text-[#888]">差距</p>
            <p className="text-sm font-bold text-[#888]">
              {playerRank === 1
                ? '领先第2名 '
                : `距第${playerRank - 1}名差 `}
              <span className={playerRank === 1 ? 'text-[#00E676]' : 'text-[#FF1744]'}>
                {formatAsset(
                  Math.abs(
                    (rankingData[playerRank - 2]?.asset || 0) -
                      (rankingData[playerRank - 1]?.asset || 0)
                  )
                )}
              </span>
            </p>
          </div>
        </motion.div>

        {/* AI Action Logs */}
        <motion.div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(20,20,20,0.8)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <h3 className="text-sm font-semibold text-[#888] mb-3 uppercase tracking-wider">
            AI 行动日志
          </h3>
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
            {state.logs.length === 0 ? (
              <p className="text-xs text-[#666] text-center py-4">暂无行动记录</p>
            ) : (
              state.logs.slice(0, 15).map((log, i) => (
                <motion.p
                  key={log.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="text-xs text-[#888] leading-relaxed"
                >
                  <span className="text-[#555]">第{state.turn - i}轮</span>{' '}
                  <span style={{ color: AI_FAMILIES.find(a => a.name === log.familyName)?.color || '#AAA' }}>
                    {log.familyName}
                  </span>{' '}
                  {log.action}
                </motion.p>
              ))
            )}
          </div>
        </motion.div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>

      {/* AI Family Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent
          className="sm:max-w-md border-[#333]"
          style={{
            background: 'rgba(20,20,20,0.95)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white sr-only">家族详情</DialogTitle>
            <DialogDescription className="sr-only">
              查看AI家族的详细信息和资产趋势
            </DialogDescription>
          </DialogHeader>
          <AIFamilyDetail
            family={selectedAIFamily}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
