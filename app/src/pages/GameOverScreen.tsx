import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/engine/GameState';
import { ACHIEVEMENTS } from '@/data/achievements';
import { ERA_CONFIG } from '@/data/constants';
import {
  Trophy,
  Crown,
  TrendingUp,
  Zap,
  RotateCcw,
  Home,
  Share2,
  Heart,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeOutBack = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

// ── Utility: format asset ──
function formatAsset(value: number): string {
  if (value >= 1e12) return `£${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `£${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `£${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `£${(value / 1e3).toFixed(1)}K`;
  return `£${value.toLocaleString()}`;
}

// ── Victory Particles Canvas ──
function VictoryParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      rotation: number;
      rotSpeed: number;
      color: string;
      life: number;
      maxLife: number;
      type: 'confetti' | 'star';
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#FF69B4', '#FFF8DC'];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 1.5 - canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0.5 + Math.random() * 2,
        size: 3 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 180 + Math.random() * 300,
        type: Math.random() > 0.3 ? 'confetti' : 'star',
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life++;

        // Reset if out of bounds or expired
        if (p.y > canvas.height + 20 || p.life > p.maxLife) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.life = 0;
          p.maxLife = 180 + Math.random() * 300;
        }

        const opacity = Math.min(1, p.life / 30) * Math.min(1, (p.maxLife - p.life) / 60);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = opacity;

        if (p.type === 'confetti') {
          // Rectangular confetti
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          // Star shape
          ctx.fillStyle = p.color;
          const spikes = 4;
          const outerR = p.size;
          const innerR = p.size * 0.4;
          ctx.beginPath();
          for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Defeat Particles Canvas ──
function DefeatParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      life: number;
      maxLife: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dark red smoke / ash particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(0.3 + Math.random() * 1.2),
        size: 15 + Math.random() * 50,
        opacity: 0.05 + Math.random() * 0.1,
        color: Math.random() > 0.5 ? '#8B0000' : '#333',
        life: 0,
        maxLife: 400 + Math.random() * 600,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx + Math.sin(p.life * 0.01) * 0.3;
        p.y += p.vy;
        p.life++;
        p.size += 0.05;

        if (p.life > p.maxLife || p.y < -100) {
          p.y = canvas.height + Math.random() * 100;
          p.x = Math.random() * canvas.width;
          p.life = 0;
          p.size = 15 + Math.random() * 50;
        }

        const fadeOut = Math.min(1, (p.maxLife - p.life) / 120);
        const fadeIn = Math.min(1, p.life / 60);
        const alpha = p.opacity * fadeOut * fadeIn;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Draw smoke as soft circle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}

// ── Timeline Event Types ──
type TimelineEventType = 'start' | 'invest' | 'crit' | 'crisis' | 'marriage' | 'era' | 'end';

interface TimelineEvent {
  type: TimelineEventType;
  year: number;
  label: string;
  description: string;
}

// ── Generate timeline from game state ──
function generateTimeline(state: ReturnType<typeof useGameState>['state']): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Starting point
  events.push({
    type: 'start',
    year: 1837,
    label: '启程',
    description: `${state.player.name} 家族踏上了工业革命之路`,
  });

  // Mock timeline events based on game state
  const currentEra = state.currentEra;

  // Add era transitions
  for (let era = 1; era <= currentEra; era++) {
    if (era > 1) {
      events.push({
        type: 'era',
        year: ERA_CONFIG[era as 1 | 2 | 3 | 4].startYear,
        label: ERA_CONFIG[era as 1 | 2 | 3 | 4].name,
        description: `跨越至${ERA_CONFIG[era as 1 | 2 | 3 | 4].subtitle}时代`,
      });
    }

    if (era <= currentEra) {
      const yearProgress = ERA_CONFIG[era as 1 | 2 | 3 | 4];
      const midYear = Math.floor((yearProgress.startYear + yearProgress.endYear) / 2);

      if (state.comboCount >= 5) {
        events.push({
          type: 'crit',
          year: midYear - 5,
          label: '传说投资',
          description: `达成 ${state.comboCount} 连击暴击！`,
        });
      }

      if (state.player.marriages.length > 0 && era <= 2) {
        events.push({
          type: 'marriage',
          year: midYear - 3,
          label: '联姻',
          description: `与 ${state.player.marriages[0]?.name || '贵族'} 联姻`,
        });
      }

      if (state.activeCrises.length > 0) {
        events.push({
          type: 'crisis',
          year: midYear + 2,
          label: '危机',
          description: `遭遇危机，艰难求生`,
        });
      }

      events.push({
        type: 'invest',
        year: midYear,
        label: '投资',
        description: `在第${era}时代建立了新的投资`,
      });
    }
  }

  // End point
  events.push({
    type: state.victory ? 'end' : 'crisis',
    year: state.currentYear,
    label: state.victory ? '巅峰' : '陨落',
    description: state.victory
      ? '万亿帝国达成，家族传奇永载史册'
      : '家族陨落，一切归于尘土',
  });

  // Sort by year
  events.sort((a, b) => a.year - b.year);

  return events;
}

// ── Timeline Node Colors ──
const TIMELINE_COLORS: Record<TimelineEventType, string> = {
  start: '#FFD700',
  invest: '#4682B4',
  crit: '#FFD700',
  crisis: '#FF1744',
  marriage: '#FF69B4',
  era: '#FFF',
  end: '#FFD700',
};

const TIMELINE_ICONS: Record<TimelineEventType, typeof Sparkles> = {
  start: Crown,
  invest: TrendingUp,
  crit: Zap,
  crisis: AlertTriangle,
  marriage: Heart,
  era: Sparkles,
  end: Trophy,
};

// ── Family Timeline Component ──
function FamilyTimeline({ events, isVictory }: { events: TimelineEvent[]; isVictory: boolean }) {
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[600px] px-8">
        {/* Timeline line */}
        <div className="relative h-[120px]">
          {/* Base line */}
          <motion.div
            className="absolute top-[60px] left-0 right-0 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, #555, #555, transparent)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: easeOutExpo, delay: 0.6 }}
          />

          {/* Nodes */}
          <div className="relative flex justify-between items-start pt-[52px]">
            {events.map((event, i) => {
              const Icon = TIMELINE_ICONS[event.type];
              const color = isVictory ? TIMELINE_COLORS[event.type] : '#555';
              const isHovered = hoveredEvent === i;
              const isEra = event.type === 'era';

              return (
                <motion.div
                  key={i}
                  className="flex flex-col items-center relative"
                  style={{ zIndex: 2 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.08, ease: easeOutBack }}
                  onMouseEnter={() => setHoveredEvent(i)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Icon above line */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200"
                    style={{
                      background: isVictory ? `${color}20` : 'rgba(100,100,100,0.1)',
                      border: `2px solid ${isVictory ? color : '#555'}`,
                      boxShadow: isVictory && (event.type === 'crit' || event.type === 'end')
                        ? `0 0 20px ${color}40`
                        : 'none',
                      transform: isEra ? 'scale(1.2)' : 'scale(1)',
                    }}
                  >
                    <Icon size={isEra ? 18 : 14} style={{ color: isVictory ? color : '#666' }} />
                  </div>

                  {/* Node dot on line */}
                  <div
                    className="w-3 h-3 rounded-full absolute top-[55px]"
                    style={{
                      backgroundColor: isVictory ? color : '#555',
                      boxShadow: isVictory ? `0 0 10px ${color}60` : 'none',
                    }}
                  />

                  {/* Year */}
                  <span className="text-[10px] mt-6" style={{ color: isVictory ? '#888' : '#555' }}>
                    {event.year}
                  </span>

                  {/* Label */}
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                    style={{ color: isVictory ? color : '#555' }}
                  >
                    {event.label}
                  </span>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute bottom-full mb-2 px-3 py-2 rounded-xl whitespace-nowrap z-10"
                        style={{
                          background: 'rgba(20,20,20,0.95)',
                          border: `1px solid ${isVictory ? color + '40' : '#333'}`,
                        }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                      >
                        <p className="text-xs font-semibold text-white">{event.label} ({event.year})</p>
                        <p className="text-[10px] text-[#888] mt-0.5">{event.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Game Over Screen ──
export default function GameOverScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();
  const [showContent, setShowContent] = useState(false);

  const isVictory = state.victory;
  const bgImage = isVictory ? './bg-gameover-victory.jpg' : './bg-gameover-defeat.jpg';

  // Generate timeline
  const timelineEvents = useMemo(() => generateTimeline(state), [state]);

  // Calculate stats
  const stats = useMemo(() => {
    const playerRank = state.ranking.indexOf('player') + 1;
    const totalInvests = state.player.investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
    const critCount = state.player.investments.reduce((sum, inv) => sum + (inv.experience > 2 ? 1 : 0), 0);
    const unlockedAchievements = (state.achievements.length > 0 ? state.achievements : ACHIEVEMENTS).filter(a => a.unlocked).length;
    const totalAchievements = (state.achievements.length > 0 ? state.achievements : ACHIEVEMENTS).length;
    const bestRank = 1; // Mock - would need historical tracking

    return {
      finalAsset: state.player.asset,
      playerRank,
      totalInvests,
      critCount,
      comboBest: state.comboCount,
      erasCompleted: state.currentEra,
      totalTurns: (state.currentEra - 1) * 10 + state.turn,
      achievementsUnlocked: unlockedAchievements,
      totalAchievements,
      bestRank,
      reputation: state.player.reputation,
    };
  }, [state]);

  // Determine failure reason
  const failureReason = useMemo(() => {
    if (state.player.asset <= 1000) return '资产跌破 £1,000 且无法恢复';
    if (!state.player.heir && state.player.marriages.length === 0) return '家族绝嗣，无合格继承人';
    return '时代终结时未能积累足够财富';
  }, [state]);

  // Victory quote
  const victoryQuote = '一万亿！这不是财富——这是权力，是历史，是人类文明的一个注脚。';
  const defeatQuote = '多少帝国崛起又衰落，多少名字被遗忘——但你的故事，将到此为止。';

  // Show content after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle restart
  const handleRestart = useCallback(() => {
    dispatch({ type: 'START_GAME', payload: { familyName: state.player.name } });
    navigate('/');
  }, [dispatch, state.player.name, navigate]);

  // Handle share (copy to clipboard)
  const handleShare = useCallback(async () => {
    const text = isVictory
      ? `【家族穿越：工业革命纪元】\n我在 ${stats.totalTurns} 轮内达成了万亿帝国！\n最终资产: ${formatAsset(stats.finalAsset)}\n排名: 第${stats.playerRank}名\n成就: ${stats.achievementsUnlocked}/${stats.totalAchievements}\n`
      : `【家族穿越：工业革命纪元】\n我的家族在 ${stats.totalTurns} 轮后陨落...\n最终资产: ${formatAsset(stats.finalAsset)}\n最高成就还未解锁，再试一次！\n`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback
    }
  }, [isVictory, stats]);

  return (
    <div
      className="min-h-[100dvh] relative overflow-auto"
      style={{ background: '#0A0A0A' }}
    >
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark overlay */}
      <div
        className="fixed inset-0"
        style={{
          background: isVictory
            ? 'rgba(10,10,10,0.5)'
            : 'rgba(20,0,0,0.75)',
        }}
      />

      {/* Radial gradient for depth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: isVictory
            ? 'radial-gradient(ellipse at center, rgba(255,215,0,0.05) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at center, rgba(139,0,0,0.1) 0%, transparent 60%)',
        }}
      />

      {/* Particle effects */}
      {isVictory ? <VictoryParticles /> : <DefeatParticles />}

      {/* Content */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-4 py-12">
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="max-w-[800px] w-full flex flex-col items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Title */}
              <motion.div
                className="text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: easeOutBack, delay: 0.5 }}
              >
                {isVictory ? (
                  <>
                    <h1
                      className="text-5xl md:text-7xl font-bold mb-2"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        color: '#FFD700',
                        textShadow: '0 0 40px rgba(255,215,0,0.4)',
                      }}
                    >
                      <Sparkles size={36} className="inline-block mr-3 -mt-3" />
                      万亿帝国
                    </h1>
                    <p
                      className="text-xl md:text-2xl font-semibold"
                      style={{
                        fontFamily: 'Cinzel, serif',
                        color: '#FFF8DC',
                      }}
                    >
                      家族传奇
                    </p>
                  </>
                ) : (
                  <>
                    <h1
                      className="text-5xl md:text-7xl font-bold mb-2"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        color: '#FF1744',
                        textShadow: '0 0 30px rgba(255,23,68,0.3)',
                      }}
                    >
                      <Heart size={36} className="inline-block mr-3 -mt-3 text-[#FF1744]" />
                      家族陨落
                    </h1>
                    <p
                      className="text-xl md:text-2xl font-semibold"
                      style={{
                        fontFamily: 'Cinzel, serif',
                        color: '#888',
                      }}
                    >
                      商业帝国崩塌
                    </p>
                  </>
                )}
              </motion.div>

              {/* Quote */}
              <motion.p
                className="text-center text-base md:text-lg leading-relaxed max-w-[600px]"
                style={{ color: isVictory ? '#CCC' : '#888' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                &ldquo;{isVictory ? victoryQuote : defeatQuote}&rdquo;
              </motion.p>

              {/* Failure reason (defeat only) */}
              {!isVictory && (
                <motion.div
                  className="rounded-xl px-5 py-3 border border-[#FF1744]/30"
                  style={{ background: 'rgba(255,23,68,0.08)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2 }}
                >
                  <p className="text-sm text-[#FF1744]">
                    <AlertTriangle size={14} className="inline mr-2 -mt-0.5" />
                    失败原因: {failureReason}
                  </p>
                </motion.div>
              )}

              {/* Statistics Panel */}
              <motion.div
                className="w-full rounded-2xl p-6"
                style={{
                  background: 'rgba(20,20,20,0.85)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isVictory ? 'rgba(255,215,0,0.15)' : 'rgba(255,23,68,0.15)'}`,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
              >
                <h2
                  className="text-lg font-bold text-white mb-5 text-center"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  最终统计
                </h2>

                <div className={`grid gap-4 ${isVictory ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-2'}`}>
                  {/* Final Asset */}
                  <motion.div
                    className="text-center p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.2 }}
                  >
                    <p className="text-xs text-[#888] mb-1">最终资产</p>
                    <p
                      className="text-2xl md:text-3xl font-bold"
                      style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        color: isVictory ? '#FFD700' : '#FF1744',
                      }}
                    >
                      {formatAsset(stats.finalAsset)}
                    </p>
                  </motion.div>

                  {/* Rank */}
                  <motion.div
                    className="text-center p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.3 }}
                  >
                    <p className="text-xs text-[#888] mb-1">家族排名</p>
                    <p className="text-xl font-bold text-[#FFD700]">
                      {stats.playerRank === 1 && <Crown size={18} className="inline mr-1 -mt-1" />}
                      第 {stats.playerRank} 名
                    </p>
                  </motion.div>

                  {/* Eras */}
                  <motion.div
                    className="text-center p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.4 }}
                  >
                    <p className="text-xs text-[#888] mb-1">穿越时代</p>
                    <p
                      className="text-xl font-bold"
                      style={{
                        color: stats.erasCompleted >= 4 ? '#00E676' : '#888',
                      }}
                    >
                      {stats.erasCompleted} / 4
                      {stats.erasCompleted >= 4 && ' 全部完成'}
                    </p>
                  </motion.div>

                  {/* Total turns */}
                  <motion.div
                    className="text-center p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.5 }}
                  >
                    <p className="text-xs text-[#888] mb-1">总轮次</p>
                    <p className="text-xl font-bold text-[#AAA]">{stats.totalTurns} 轮</p>
                  </motion.div>

                  {/* Crit count (victory only) */}
                  {isVictory && (
                    <motion.div
                      className="text-center p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 2.6 }}
                    >
                      <p className="text-xs text-[#888] mb-1">暴击次数</p>
                      <p className="text-xl font-bold text-[#FF00FF]">
                        <Zap size={16} className="inline mr-1 -mt-1" />
                        {stats.critCount}
                      </p>
                    </motion.div>
                  )}

                  {/* Achievements */}
                  <motion.div
                    className="text-center p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.7 }}
                  >
                    <p className="text-xs text-[#888] mb-1">成就解锁</p>
                    <p className="text-xl font-bold text-[#FFD700]'">
                      <Trophy size={16} className="inline mr-1 -mt-1 text-[#FFD700]" />
                      {stats.achievementsUnlocked} / {stats.totalAchievements}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Family History Timeline */}
              <motion.div
                className="w-full rounded-2xl p-6"
                style={{
                  background: 'rgba(20,20,20,0.85)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${isVictory ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)'}`,
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 3 }}
              >
                <h2
                  className="text-lg font-bold text-white mb-5 text-center"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  家族史时间线
                </h2>
                <FamilyTimeline events={timelineEvents} isVictory={isVictory} />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 3.5 }}
              >
                {/* Restart */}
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 hover:brightness-125 hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2"
                  style={{
                    background: isVictory
                      ? 'linear-gradient(135deg, #FFD700, #B8860B)'
                      : 'transparent',
                    border: isVictory ? 'none' : '2px solid rgba(255,23,68,0.5)',
                    color: isVictory ? '#1A0F0A' : '#FF1744',
                  }}
                >
                  <RotateCcw size={18} />
                  {isVictory ? '再玩一次' : '再试一次'}
                </button>

                {/* Share (victory only) */}
                {isVictory && (
                  <button
                    onClick={handleShare}
                    className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2 border-2 border-[#FFD700]/50 text-[#FFD700]"
                  >
                    <Share2 size={18} />
                    分享战绩
                  </button>
                )}

                {/* Home */}
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 rounded-xl text-base font-semibold text-[#AAA] transition-all duration-200 hover:text-white hover:bg-white/5 active:scale-[0.97] flex items-center gap-2"
                >
                  <Home size={18} />
                  返回主菜单
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
