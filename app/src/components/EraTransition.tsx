import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/engine/GameState';
import { ERA_CONFIG } from '@/data/constants';
import { ERA_TRANSITION_TEXTS } from '@/data/transitionTexts';
import { getInvestmentsByEra } from '@/data/investments';
import { CRISES } from '@/data/crises';
import { OPPORTUNITIES } from '@/data/opportunities';
import type { Era } from '@/data/types';
import {
  Briefcase,
  AlertTriangle,
  Sparkles,
  Heart,
  TrendingUp,
  ChevronRight,
  Crown,
  Award,
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Phase = 'ending' | 'epic' | 'unlock';

/* ------------------------------------------------------------------ */
/*  Multi-line typewriter hook — types one line at a time              */
/* ------------------------------------------------------------------ */
function useLineTypewriter(
  lines: string[],
  speed: number,
  active: boolean,
  onAllComplete?: () => void,
  onLineComplete?: (lineIndex: number) => void,
) {
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [allDone, setAllDone] = useState(false);
  const charIdxRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setCurrentLineIdx(0);
    setDisplayedLines([]);
    setAllDone(false);
    charIdxRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (!active || lines.length === 0) return;

    let lineIndex = 0;
    let last = performance.now();

    const tick = (now: number) => {
      if (lineIndex >= lines.length) {
        setAllDone(true);
        onAllComplete?.();
        return;
      }

      if (now - last >= speed) {
        last = now;
        charIdxRef.current += 1;

        const currentText = lines[lineIndex].slice(0, charIdxRef.current);
        setDisplayedLines(prev => {
          const next = [...prev];
          next[lineIndex] = currentText;
          return next;
        });

        if (charIdxRef.current >= lines[lineIndex].length) {
          onLineComplete?.(lineIndex);
          charIdxRef.current = 0;
          lineIndex += 1;
          setCurrentLineIdx(lineIndex);
          // Pause between lines
          last = now + 800;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lines, speed, active, onAllComplete, onLineComplete]);

  const skipAll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setDisplayedLines(lines);
    setAllDone(true);
    setCurrentLineIdx(lines.length);
    onAllComplete?.();
  }, [lines, onAllComplete]);

  const skipLine = useCallback(() => {
    if (currentLineIdx < lines.length) {
      const next = [...displayedLines];
      next[currentLineIdx] = lines[currentLineIdx];
      setDisplayedLines(next);
      charIdxRef.current = lines[currentLineIdx].length;
    }
  }, [currentLineIdx, lines, displayedLines]);

  return { displayedLines, currentLineIdx, allDone, skipAll, skipLine };
}

/* ------------------------------------------------------------------ */
/*  Unlock Card                                                         */
/* ------------------------------------------------------------------ */
function UnlockCard({
  icon: Icon,
  title,
  count,
  items,
  color,
  glowColor,
  delay,
}: {
  icon: typeof Briefcase;
  title: string;
  count: string;
  items: string[];
  color: string;
  glowColor: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex-1 min-w-0 rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: 'rgba(30,30,30,0.85)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${color}30`,
        boxShadow: `0 0 20px ${glowColor}20`,
      }}
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: easeOutExpo }}
    >
      <div className="flex items-center gap-2">
        <Icon size={20} style={{ color }} />
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      <span className="text-2xl font-bold" style={{ color, fontFamily: 'Bebas Neue, sans-serif' }}>
        {count}
      </span>
      <div className="flex flex-col gap-1">
        {items.map((item, i) => (
          <span key={i} className="text-xs text-[#AAA] truncate">
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  EraTransition main component                                        */
/* ------------------------------------------------------------------ */
export default function EraTransition() {
  const navigate = useNavigate();
  const { state } = useGameState();
  const [phase, setPhase] = useState<Phase>('ending');
  const [phaseComplete, setPhaseComplete] = useState(false);

  const currentEraConfig = ERA_CONFIG[state.currentEra];
  const prevEra = (Math.max(1, state.currentEra - 1)) as Era;
  const prevEraConfig = ERA_CONFIG[prevEra];

  // Exit text for previous era
  const exitText = useMemo(() => {
    const text = ERA_TRANSITION_TEXTS[prevEra];
    if (!text) return { title: '', subtitle: '', lines: [] };
    return {
      title: text.title,
      subtitle: text.subtitle,
      lines: [
        `${prevEraConfig.endYear}年的钟声敲响时，${text.subtitle}的篇章已经写到了尾声——但它留下的遗产，将深刻地改变人类文明的走向。`,
      ],
    };
  }, [prevEra, prevEraConfig]);

  // Enter text for current era
  const enterText = useMemo(() => {
    const text = ERA_TRANSITION_TEXTS[state.currentEra];
    if (!text) return { themeQuote: '', lines: [] };
    return {
      themeQuote: `"每一个${text.title.split('与')[0]}的飞跃，都是对旧世界秩序的一次重塑。"`,
      lines: text.lines,
    };
  }, [state.currentEra]);

  // Player stats summary
  const stats = useMemo(() => ({
    asset: state.player.asset,
    investmentCount: state.player.investments.length,
    rank: state.ranking.indexOf('player') + 1,
    totalFamilies: state.ranking.length,
  }), [state.player.asset, state.player.investments.length, state.ranking]);

  // Speed (can be made configurable via settings)
  const typewriterSpeed = 40; // ms per char

  // ── Phase 1: ending typewriter ──
  const {
    displayedLines: exitDisplayed,
    allDone: exitDone,
    skipAll: skipExit,
  } = useLineTypewriter(
    exitText.lines,
    typewriterSpeed,
    phase === 'ending',
    useCallback(() => setPhaseComplete(true), [])
  );

  // ── Phase 2: epic typewriter ──
  const {
    displayedLines: epicDisplayed,
    allDone: epicDone,
    skipAll: skipEpic,
  } = useLineTypewriter(
    enterText.lines,
    typewriterSpeed,
    phase === 'epic',
    useCallback(() => setPhaseComplete(true), [])
  );

  // ── Auto phase transitions ──
  useEffect(() => {
    if (phase === 'ending' && phaseComplete) {
      const t = setTimeout(() => {
        setPhase('epic');
        setPhaseComplete(false);
      }, 1500);
      return () => clearTimeout(t);
    }
    if (phase === 'epic' && phaseComplete) {
      const t = setTimeout(() => {
        setPhase('unlock');
        setPhaseComplete(false);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, phaseComplete]);

  // ── Click/Space to advance ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (phase === 'ending') {
          if (!exitDone) skipExit();
        } else if (phase === 'epic') {
          if (!epicDone) skipEpic();
        }
      }
      if (e.code === 'Escape' && phase === 'unlock') {
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, exitDone, epicDone, skipExit, skipEpic]);

  // Handle screen click to advance
  const handleScreenClick = useCallback(() => {
    if (phase === 'ending') {
      if (!exitDone) skipExit();
    } else if (phase === 'epic') {
      if (!epicDone) skipEpic();
    }
  }, [phase, exitDone, epicDone, skipExit, skipEpic]);

  // Continue button handler
  const handleContinue = useCallback(() => {
    navigate('/play');
  }, [navigate]);

  // Get unlock data for current era
  const unlockData = useMemo(() => {
    const investments = getInvestmentsByEra(state.currentEra).slice(0, 3);
    const crises = CRISES.filter(c => c.era === state.currentEra).slice(0, 3);
    const opportunities = OPPORTUNITIES.filter(o => o.era === state.currentEra).slice(0, 3);

    return {
      investments: investments.map(i => i.name),
      crises: crises.map(c => c.name),
      opportunities: opportunities.map(o => o.name),
    };
  }, [state.currentEra]);

  // Era background image
  const bgImage = `./bg-era${state.currentEra}.jpg`;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      onClick={handleScreenClick}
    >
      <AnimatePresence mode="wait">
        {/* ═══════════════ PHASE 1: ERA ENDING ═══════════════ */}
        {phase === 'ending' && (
          <motion.div
            key="phase1"
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: '#000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Era badge */}
            <motion.div
              className="flex flex-col items-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: easeOutExpo }}
            >
              <span
                className="text-base text-[#888] tracking-widest"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {prevEraConfig.startYear} — {prevEraConfig.endYear}
              </span>
              <h1
                className="text-5xl md:text-6xl font-bold text-white"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: prevEraConfig.themeColor,
                }}
              >
                {exitText.title}
              </h1>
              <span
                className="text-xl text-[#888]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {exitText.subtitle}
              </span>
            </motion.div>

            {/* Stats summary */}
            <motion.div
              className="flex gap-8 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="flex flex-col items-center gap-1">
                <Briefcase size={20} className="text-[#FFD700]" />
                <span className="text-lg font-bold text-[#FFD700]" style={{ fontFamily: 'Bebas Neue' }}>
                  £{stats.asset.toLocaleString()}
                </span>
                <span className="text-xs text-[#888]">总资产</span>
              </div>
              <div className="w-px bg-[#333]" />
              <div className="flex flex-col items-center gap-1">
                <TrendingUp size={20} className="text-[#40C4FF]" />
                <span className="text-lg font-bold text-[#40C4FF]" style={{ fontFamily: 'Bebas Neue' }}>
                  {stats.investmentCount}
                </span>
                <span className="text-xs text-[#888]">投资数</span>
              </div>
              <div className="w-px bg-[#333]" />
              <div className="flex flex-col items-center gap-1">
                <Crown size={20} className="text-[#FF6F00]" />
                <span className="text-lg font-bold text-[#FF6F00]" style={{ fontFamily: 'Bebas Neue' }}>
                  第{stats.rank}名
                </span>
                <span className="text-xs text-[#888]">排名</span>
              </div>
            </motion.div>

            {/* Exit text typewriter */}
            <div className="max-w-[600px] px-6 text-center">
              {exitDisplayed.map((line, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-[#CCC]"
                  style={{ fontFamily: 'Inter, sans-serif', lineHeight: 2.0 }}
                >
                  {line}
                  {!exitDone && i === exitDisplayed.length - 1 && (
                    <span
                      className="inline-block w-[1px] h-5 bg-white ml-0.5 align-middle"
                      style={{ animation: 'cursor-blink 600ms infinite' }}
                    />
                  )}
                </p>
              ))}
            </div>

            {/* Continue hint */}
            {exitDone && (
              <motion.span
                className="absolute bottom-10 text-sm text-[#666] flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronRight size={16} />
                点击或按空格继续
              </motion.span>
            )}
          </motion.div>
        )}

        {/* ═══════════════ PHASE 2: EPIC TEXT ═══════════════ */}
        {phase === 'epic' && (
          <motion.div
            key="phase2"
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{
              background: `radial-gradient(ellipse at center, ${currentEraConfig.bgColor}ee 0%, #000 80%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Theme quote */}
            <motion.div
              className="flex flex-col items-center mb-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p
                className="text-lg md:text-xl text-white italic text-center max-w-[600px]"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {enterText.themeQuote}
              </p>
              <div
                className="w-[100px] h-[3px] mt-4 rounded-full"
                style={{ backgroundColor: currentEraConfig.themeColor }}
              />
            </motion.div>

            {/* Epic lines */}
            <div className="max-w-[720px] w-full">
              {epicDisplayed.map((line, i) => (
                <motion.p
                  key={i}
                  className="text-base md:text-lg leading-loose text-[#CCC] mb-4"
                  style={{ fontFamily: 'Inter, sans-serif', lineHeight: 2.0 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {line}
                </motion.p>
              ))}
              {/* Cursor on current line */}
              {!epicDone && epicDisplayed.length < enterText.lines.length && (
                <p className="text-base md:text-lg text-[#CCC]">
                  <span
                    className="inline-block w-[1px] h-5 bg-white ml-0.5 align-middle"
                    style={{ animation: 'cursor-blink 600ms infinite' }}
                  />
                </p>
              )}
            </div>

            {/* Era transition announcement */}
            {epicDone && (
              <motion.div
                className="mt-8 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: easeOutExpo }}
              >
                <div
                  className="h-[1px] w-[200px] mb-4"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${currentEraConfig.themeColor}, transparent)`,
                  }}
                />
                <span
                  className="text-xl md:text-2xl font-bold tracking-wide"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    color: currentEraConfig.themeColor,
                  }}
                >
                  ——您已跨越到{currentEraConfig.name}——
                </span>
              </motion.div>
            )}

            {/* Continue hint */}
            {epicDone && (
              <motion.span
                className="absolute bottom-10 text-sm text-[#666] flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronRight size={16} />
                点击或按空格继续
              </motion.span>
            )}
          </motion.div>
        )}

        {/* ═══════════════ PHASE 3: UNLOCK ═══════════════ */}
        {phase === 'unlock' && (
          <motion.div
            key="phase3"
            className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-y-auto"
            style={{ backgroundColor: '#000' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Background image fade in */}
            <motion.div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            />
            {/* Dark overlay */}
            <div
              className="absolute inset-0 z-[1]"
              style={{ backgroundColor: 'rgba(10,10,10,0.75)' }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-[900px] w-full py-10">
              {/* Era title */}
              <motion.div
                className="flex flex-col items-center gap-3 mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: easeOutExpo }}
              >
                <span
                  className="text-base tracking-widest text-[#888]"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {currentEraConfig.startYear} — {currentEraConfig.endYear}
                </span>
                <h1
                  className="text-4xl md:text-5xl font-bold"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: currentEraConfig.themeColor,
                  }}
                >
                  {currentEraConfig.subtitle}
                </h1>
                <h2
                  className="text-xl text-white"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {currentEraConfig.name}
                </h2>
              </motion.div>

              {/* "New Era Opportunities" title */}
              <motion.h3
                className="text-lg font-semibold text-[#FFD700] mb-6 flex items-center gap-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Sparkles size={20} />
                新时代机遇
              </motion.h3>

              {/* Unlock cards */}
              <div className="flex flex-col md:flex-row gap-4 w-full mb-8">
                <UnlockCard
                  icon={Briefcase}
                  title="新投资解锁"
                  count={`+${unlockData.investments.length}种`}
                  items={unlockData.investments}
                  color="#00E676"
                  glowColor="rgba(0,230,118,0.3)"
                  delay={1.0}
                />
                <UnlockCard
                  icon={AlertTriangle}
                  title="危机预警"
                  count={`${unlockData.crises.length}种`}
                  items={unlockData.crises}
                  color="#FF1744"
                  glowColor="rgba(255,23,68,0.3)"
                  delay={1.2}
                />
                <UnlockCard
                  icon={Sparkles}
                  title="机遇预告"
                  count={`${unlockData.opportunities.length}类`}
                  items={unlockData.opportunities}
                  color="#FFD700"
                  glowColor="rgba(255,215,0,0.3)"
                  delay={1.4}
                />
              </div>

              {/* System updates */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                {[
                  { icon: Heart, text: '联姻候选人已更新' },
                  { icon: TrendingUp, text: '继承人培养方向已扩展' },
                  { icon: Award, text: '新时代成就已开放' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 text-sm text-[#AAA]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 + i * 0.1, duration: 0.3 }}
                  >
                    <item.icon size={16} className="text-[#888]" />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Continue button */}
              <motion.button
                onClick={handleContinue}
                className="h-16 px-10 rounded-xl text-lg font-bold text-white transition-all hover:brightness-110 hover:-translate-y-1 active:scale-[0.97]"
                style={{
                  background: `linear-gradient(90deg, ${currentEraConfig.themeColor}, ${currentEraConfig.accentColor})`,
                  boxShadow: `0 0 30px ${currentEraConfig.themeColor}60`,
                  fontFamily: 'Playfair Display, serif',
                  minWidth: '280px',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.5, ease: easeOutExpo }}
              >
                进入新时代
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
