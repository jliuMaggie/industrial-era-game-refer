import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/engine/GameState';
import { CRISES } from '@/data/crises';
import { OPPORTUNITIES } from '@/data/opportunities';
import type { Crisis, Opportunity } from '@/data/types';
import {
  AlertTriangle,
  Sparkles,
  Star,
  Zap,
  TrendingUp,
  TrendingDown,
  Shield,
  SkipForward,
  Crown,
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

type EventType = 'crisis' | 'opportunity' | 'legendary';

/* ------------------------------------------------------------------ */
/*  Typewriter hook                                                    */
/* ------------------------------------------------------------------ */
function useTypewriter(text: string, speed: number, active: boolean, onComplete?: () => void) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (!active) return;

    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= speed) {
        last = now;
        idxRef.current += 1;
        setDisplayed(text.slice(0, idxRef.current));
        if (idxRef.current >= text.length) {
          setDone(true);
          onComplete?.();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, speed, active, onComplete]);

  const skip = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setDisplayed(text);
    setDone(true);
    onComplete?.();
  }, [text, onComplete]);

  return { displayed, done, skip };
}

/* ------------------------------------------------------------------ */
/*  Particle types                                                     */
/* ------------------------------------------------------------------ */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

/* ------------------------------------------------------------------ */
/*  Crisis Canvas Particles — embers / smoke                           */
/* ------------------------------------------------------------------ */
function CrisisParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnEmber = () => {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -1.5 - Math.random() * 2,
        life: 0,
        maxLife: 2000 + Math.random() * 2000,
        size: 1 + Math.random() * 2,
        opacity: 0.6,
        color: `hsl(${10 + Math.random() * 20}, 100%, ${50 + Math.random() * 30}%)`,
        rotation: 0,
        rotationSpeed: 0,
      });
    };

    const spawnSmoke = () => {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.5 - Math.random() * 0.5,
        life: 0,
        maxLife: 4000 + Math.random() * 2000,
        size: 10 + Math.random() * 20,
        opacity: 0.15,
        color: `hsl(0, 0%, ${20 + Math.random() * 20}%)`,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
      });
    };

    let lastSpawn = performance.now();
    const animate = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (now - lastSpawn > 200) {
        spawnEmber();
        if (Math.random() > 0.5) spawnSmoke();
        lastSpawn = now;
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.life += 16;
        if (p.life >= p.maxLife) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.size < 5) {
          // Ember — glowing dot
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        } else {
          // Smoke — soft circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size * (1 + progress), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Opportunity Canvas Particles — gold sparkles / light dots           */
/* ------------------------------------------------------------------ */
function OpportunityParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnSparkle = () => {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.5 + Math.random() * 1.5,
        life: 0,
        maxLife: 3000 + Math.random() * 3000,
        size: 2 + Math.random() * 3,
        opacity: 0.8,
        color: `hsl(${45 + Math.random() * 15}, 100%, ${60 + Math.random() * 30}%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    };

    const spawnDot = () => {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1000 + Math.random() * 2000,
        size: 1 + Math.random() * 2,
        opacity: 0.4,
        color: `hsl(${40 + Math.random() * 20}, 100%, 70%)`,
        rotation: 0,
        rotationSpeed: 0,
      });
    };

    let lastSpawn = performance.now();
    const animate = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (now - lastSpawn > 150) {
        spawnSparkle();
        if (Math.random() > 0.6) spawnDot();
        lastSpawn = now;
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.life += 16;
        if (p.life >= p.maxLife) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.rotationSpeed !== 0) {
          // Sparkle — star shape
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
          }
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.stroke();
        } else {
          // Light dot
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Legendary Canvas Particles — rainbow confetti + golden beams        */
/* ------------------------------------------------------------------ */
function LegendaryParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Burst spawn
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 0,
        maxLife: 2000 + Math.random() * 2000,
        size: 3 + Math.random() * 5,
        opacity: 1,
        color: `hsl(${Math.random() * 360}, 90%, 60%)`,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 8,
      });
    }

    let lastGoldSpawn = performance.now();
    const animate = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Continuous golden particles
      if (now - lastGoldSpawn > 100) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0.8 + Math.random() * 1.2,
          life: 0,
          maxLife: 3000 + Math.random() * 2000,
          size: 2 + Math.random() * 3,
          opacity: 0.7,
          color: `hsl(${45 + Math.random() * 15}, 100%, ${60 + Math.random() * 30}%)`,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 2,
        });
        lastGoldSpawn = now;
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.life += 16;
        if (p.life >= p.maxLife) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravity
        p.rotation += p.rotationSpeed;

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Confetti rectangle
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);

        ctx.restore();
        return true;
      });

      // Golden beam from center
      const beamGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.8
      );
      beamGrad.addColorStop(0, 'rgba(255,215,0,0.08)');
      beamGrad.addColorStop(0.5, 'rgba(255,215,0,0.02)');
      beamGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Effect Item                                                         */
/* ------------------------------------------------------------------ */
function EffectItem({ icon: Icon, label, value, color }: {
  icon: typeof Zap;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 py-2 px-3 rounded-lg"
      style={{ backgroundColor: `${color}10` }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon size={18} style={{ color }} />
      <span className="text-sm text-[#CCC]">{label}</span>
      <span className="ml-auto text-sm font-bold" style={{ color }}>{value}</span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main EventModal component                                           */
/* ------------------------------------------------------------------ */
export default function EventModal() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();
  const eventType: EventType = (type as EventType) || 'crisis';

  const [eventData, setEventData] = useState<Crisis | Opportunity | null>(null);
  const [effectsReady, setEffectsReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Pick a random event on mount
  useEffect(() => {
    if (eventType === 'crisis') {
      const eraCrises = CRISES.filter(c => c.era === state.currentEra);
      if (eraCrises.length > 0) {
        setEventData(eraCrises[Math.floor(Math.random() * eraCrises.length)]);
      }
    } else if (eventType === 'opportunity' || eventType === 'legendary') {
      const eraOpps = OPPORTUNITIES.filter(o => o.era === state.currentEra);
      if (eraOpps.length > 0) {
        setEventData(eraOpps[Math.floor(Math.random() * eraOpps.length)]);
      }
    }
  }, [eventType, state.currentEra]);

  // Typewriter speed based on device
  const typewriterSpeed = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 30;
  const legendarySpeed = typeof window !== 'undefined' && window.innerWidth < 768 ? 25 : 40;

  const flavorText = useMemo(() => {
    if (!eventData) return '';
    if ('assetLossPercent' in eventData) {
      return `${eventData.description} 家族资产将受到严重冲击，声望也会受到影响。这是考验家族韧性的时候——只有最坚韧的家族才能在危机中存活下来。`;
    }
    return `${eventData.description} 这是一个千载难逢的机会，将为家族带来丰厚回报。抓住时代的脉搏，让家族财富更上一层楼！`;
  }, [eventData]);

  const handleTypewriterComplete = useCallback(() => {
    setEffectsReady(true);
  }, []);

  const { displayed, done, skip } = useTypewriter(
    flavorText,
    eventType === 'legendary' ? legendarySpeed : typewriterSpeed,
    !!eventData,
    handleTypewriterComplete
  );

  const handleConfirm = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      if (eventData) {
        if (eventType === 'crisis') {
          const assetLoss = Math.floor(state.player.asset * (eventData as Crisis).assetLossPercent);
          const newAsset = Math.max(100, state.player.asset - assetLoss);
          dispatch({
            type: 'INVEST',
            payload: {
              investmentId: 'crisis_penalty',
              amount: 0,
              outcome: 'fail',
              returnAmount: newAsset - state.player.asset,
              multiplier: 1,
            },
          });
        } else {
          const assetBonus = Math.floor(state.player.asset * (eventData as Opportunity).assetBonusPercent);
          dispatch({
            type: 'INVEST',
            payload: {
              investmentId: 'opportunity_bonus',
              amount: 0,
              outcome: 'normal',
              returnAmount: assetBonus,
              multiplier: 1,
            },
          });
        }
      }
      navigate('/play');
    }, 400);
  }, [eventData, eventType, state.player.asset, dispatch, navigate]);

  const handleSkip = useCallback(() => {
    skip();
    setEffectsReady(true);
  }, [skip]);

  if (!eventData) return null;

  const isCrisis = eventType === 'crisis';
  const isLegendary = eventType === 'legendary';

  // Theme colors
  const themeColors = {
    crisis: {
      border: '#FF1744',
      bg: 'radial-gradient(ellipse at center, rgba(255,23,68,0.05), transparent)',
      titleColor: '#FF1744',
      titleText: '危机降临',
      titleIcon: AlertTriangle,
      buttonVariant: 'danger' as const,
      buttonText: '接受现实',
      particleComponent: <CrisisParticles active={!isClosing} />,
      modalBorder: '2px solid rgba(255,23,68,0.6)',
      boxShadow: '0 0 40px rgba(255,23,68,0.3), inset 0 0 60px rgba(255,23,68,0.05)',
      effectIcon: Zap,
      effectColor: '#FF1744',
    },
    opportunity: {
      border: '#FFD700',
      bg: 'radial-gradient(ellipse at top, rgba(255,215,0,0.08), transparent)',
      titleColor: '#FFD700',
      titleText: '机遇降临',
      titleIcon: Sparkles,
      buttonVariant: 'gold' as const,
      buttonText: '接受机遇',
      particleComponent: <OpportunityParticles active={!isClosing} />,
      modalBorder: '2px solid rgba(255,215,0,0.6)',
      boxShadow: '0 0 40px rgba(255,215,0,0.3), inset 0 0 60px rgba(255,215,0,0.05)',
      effectIcon: Sparkles,
      effectColor: '#FFD700',
    },
    legendary: {
      border: 'linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #FFD700)',
      bg: 'radial-gradient(ellipse at center, rgba(255,215,0,0.1), rgba(106,90,205,0.1))',
      titleColor: '#FFD700',
      titleText: '传说投资机会出现！',
      titleIcon: Star,
      buttonVariant: 'legendary' as const,
      buttonText: '把握传说',
      particleComponent: <LegendaryParticles active={!isClosing} />,
      modalBorder: '2px solid transparent',
      boxShadow: '0 0 60px rgba(255,215,0,0.5), inset 0 0 80px rgba(255,215,0,0.1)',
      effectIcon: Crown,
      effectColor: '#FFD700',
    },
  };

  const theme = isLegendary ? themeColors.legendary : isCrisis ? themeColors.crisis : themeColors.opportunity;
  const TitleIcon = theme.titleIcon;

  // Effects derived from event data
  const effects = useMemo(() => {
    if (!eventData) return [];
    if ('assetLossPercent' in eventData) {
      const crisis = eventData as Crisis;
      const assetLoss = Math.floor(state.player.asset * crisis.assetLossPercent);
      return [
        { label: '资产损失', value: `-£${assetLoss.toLocaleString()}`, icon: TrendingDown },
        { label: '声望损失', value: `-${crisis.reputationLoss}`, icon: Shield },
        { label: '持续时间', value: `${crisis.duration}回合`, icon: Zap },
      ];
    } else {
      const opp = eventData as Opportunity;
      const assetBonus = Math.floor(state.player.asset * opp.assetBonusPercent);
      return [
        { label: '资产奖励', value: `+£${assetBonus.toLocaleString()}`, icon: TrendingUp },
        { label: '声望奖励', value: `+${opp.reputationBonus}`, icon: Crown },
      ];
    }
  }, [eventData, state.player.asset]);

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: isLegendary ? 'rgba(10,5,20,0.92)' : isCrisis ? 'rgba(20,0,0,0.9)' : 'rgba(20,15,0,0.9)',
            backdropFilter: 'blur(20px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isCrisis ? 200 : 300 }}
        >
          {/* Particle layer */}
          {theme.particleComponent}

          {/* Modal container */}
          <motion.div
            className="relative z-10 w-full max-w-[600px] mx-4 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(20,20,20,0.95)',
              border: theme.modalBorder,
              boxShadow: theme.boxShadow,
            }}
            initial={isLegendary ? { scale: 0.5, opacity: 0 } : isCrisis ? { scale: 0.8, opacity: 0 } : { y: 20, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={isCrisis ? { x: 50, opacity: 0 } : { scale: 1.05, opacity: 0 }}
            transition={{ duration: isLegendary ? 800 : 400, ease: easeOutExpo }}
          >
            {/* Legendary rainbow border animation */}
            {isLegendary && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #FFD700)',
                  backgroundSize: '300% 100%',
                  animation: 'rainbow-shift 3s linear infinite',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
            )}

            {/* Crisis pulse border */}
            {isCrisis && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  border: '2px solid rgba(255,23,68,0.4)',
                  animation: 'crisis-pulse 2s infinite',
                }}
              />
            )}

            {/* Content */}
            <div className="p-6 flex flex-col gap-5">
              {/* Header */}
              <motion.div
                className="text-center flex flex-col items-center gap-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <TitleIcon size={24} style={{ color: theme.titleColor }} />
                  <span
                    className="text-lg font-bold tracking-wide"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: theme.titleColor,
                    }}
                  >
                    {theme.titleText}
                  </span>
                  <TitleIcon size={24} style={{ color: theme.titleColor }} />
                </div>
              </motion.div>

              {/* Event title card */}
              <motion.div
                className="rounded-xl p-5 text-center flex flex-col items-center gap-2"
                style={{
                  background: 'rgba(30,30,30,0.8)',
                  border: `1px solid ${theme.titleColor}40`,
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: easeOutExpo }}
              >
                <h2
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {eventData.name}
                </h2>
                <span className="text-xs text-[#888]">{state.currentYear}年</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold mt-1"
                  style={{
                    backgroundColor: `${theme.titleColor}20`,
                    color: theme.titleColor,
                    border: `1px solid ${theme.titleColor}40`,
                  }}
                >
                  {isCrisis ? '史诗危机' : isLegendary ? '传说机遇' : '时代机遇'}
                </span>
              </motion.div>

              {/* Flavor text with typewriter */}
              <div className="relative min-h-[80px]">
                <p
                  className="text-base leading-relaxed text-[#CCC]"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.8,
                    borderLeft: `3px solid ${isCrisis ? '#FF174440' : '#FFD70040'}`,
                    paddingLeft: '12px',
                  }}
                >
                  {displayed}
                  {!done && (
                    <span
                      className="inline-block w-[1px] h-5 bg-white ml-0.5 align-middle"
                      style={{ animation: 'cursor-blink 600ms infinite' }}
                    />
                  )}
                </p>

                {/* Skip button */}
                {!done && (
                  <motion.button
                    onClick={handleSkip}
                    className="absolute bottom-0 right-0 flex items-center gap-1 text-xs text-[#888] hover:text-white transition-colors px-2 py-1 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <SkipForward size={12} />
                    跳过
                  </motion.button>
                )}
              </div>

              {/* Effects list */}
              <AnimatePresence>
                {effectsReady && (
                  <motion.div
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      className="text-sm font-semibold text-[#AAA] mb-1"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      影响效果
                    </h3>
                    {effects.map((eff, i) => (
                      <motion.div
                        key={eff.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                      >
                        <EffectItem
                          icon={eff.icon}
                          label={eff.label}
                          value={eff.value}
                          color={isCrisis ? '#FF1744' : '#00E676'}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action button */}
              <AnimatePresence>
                {effectsReady && (
                  <motion.div
                    className="flex flex-col gap-3 mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {isLegendary ? (
                      <div className="flex gap-3">
                        <button
                          onClick={handleConfirm}
                          className="flex-1 h-14 rounded-xl text-base font-bold text-[#1A0F0A] transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97]"
                          style={{
                            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                            boxShadow: '0 0 20px rgba(255,215,0,0.4)',
                          }}
                        >
                          {theme.buttonText}
                        </button>
                        <button
                          onClick={() => { setIsClosing(true); setTimeout(() => navigate('/play'), 400); }}
                          className="h-14 px-6 rounded-xl text-base font-bold text-[#888] border border-[#444] bg-transparent transition-all hover:bg-[#333] hover:text-white active:scale-[0.97]"
                        >
                          放弃
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleConfirm}
                        className="w-full h-12 rounded-xl text-base font-bold text-white transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                        style={{
                          background: isCrisis
                            ? 'linear-gradient(90deg, #FF1744, #D50000)'
                            : 'linear-gradient(90deg, #FFD700, #FFA500)',
                          boxShadow: isCrisis
                            ? '0 0 20px rgba(255,23,68,0.3)'
                            : '0 0 20px rgba(255,215,0,0.3)',
                          color: isCrisis ? '#fff' : '#1A0F0A',
                        }}
                      >
                        {theme.buttonText}
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
