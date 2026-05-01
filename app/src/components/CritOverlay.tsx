import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

/* ─── Types ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'confetti' | 'number' | 'star' | 'beam';
  text?: string;
  opacity: number;
}

interface CritLocationState {
  multiplier: number;
  returnAmount: number;
  combo: number;
}

/* ─── Constants ─── */
const CONFETTI_COLORS = ['#FFD700', '#FF00FF', '#00E5FF', '#FF1744', '#00E676', '#FF6B35', '#FF8C00'];
const GOLD_COLORS = ['#FFD700', '#FFA500', '#FFEC8B', '#DAA520', '#B8860B'];
const STAR_COLORS = ['#FFD700', '#FFFFFF', '#FFFACD', '#FFE4B5'];

/* ─── Easing ─── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeOutBack = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

/* ─── Helper: get combo color ─── */
function getComboColor(combo: number): string {
  if (combo >= 10) return '#FF1744';
  if (combo >= 7) return '#FF6F00';
  if (combo >= 5) return '#FF00FF';
  if (combo >= 3) return '#FFD700';
  return '#FFFFFF';
}

/* ─── Helper: get combo label ─── */
function getComboLabel(combo: number): string {
  if (combo >= 10) return 'MAX';
  if (combo >= 7) return '传说';
  if (combo >= 5) return '史诗';
  if (combo >= 3) return '勇猛';
  return '';
}

/* ─── Helper: get special text ─── */
function getSpecialText(multiplier: number, combo: number): string {
  if (combo >= 10) return '完美连击！神级操作！';
  if (multiplier >= 10) return '传说暴击！';
  if (combo >= 5) return '势不可挡！';
  if (multiplier >= 5) return '令人惊叹！';
  if (combo >= 3) return '连击飙升！';
  return '';
}

/* ─── Canvas Particle System (isolated in dedicated component) ─── */
const CritCanvas = memo(function CritCanvas({
  multiplier,
  combo,
  isLegendary,
  active,
}: {
  multiplier: number;
  combo: number;
  isLegendary: boolean;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    /* Particle count based on intensity */
    const intensity = Math.min(multiplier / 10, 1) + combo * 0.1;
    const confettiCount = Math.min(120, 80 + Math.floor(intensity * 40));
    const numberCount = Math.min(30, 20 + Math.floor(intensity * 10));
    const starCount = Math.min(40, 30 + Math.floor(intensity * 10));

    const particles: Particle[] = [];

    /* Create confetti particles */
    for (let i = 0; i < confettiCount; i++) {
      const angle = (Math.PI * 2 * i) / confettiCount + (Math.random() - 0.5) * 0.8;
      const speed = 4 + Math.random() * 10 * (1 + intensity * 0.5);
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 0,
        maxLife: 80 + Math.random() * 80,
        size: 4 + Math.random() * 10,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        type: 'confetti',
        opacity: 1,
      });
    }

    /* Create number fragments */
    const numberTexts = ['+', '£', '%', 'x', '✦'];
    for (let i = 0; i < numberCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x: cx + (Math.random() - 0.5) * 100,
        y: cy - 30 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        life: 0,
        maxLife: 50 + Math.random() * 50,
        size: 14 + Math.random() * 10,
        color: Math.random() > 0.5 ? '#FFD700' : '#00E676',
        rotation: (Math.random() - 0.5) * 1,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        type: 'number',
        text: numberTexts[Math.floor(Math.random() * numberTexts.length)],
        opacity: 1,
      });
    }

    /* Create star particles */
    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.push({
        x: cx + (Math.random() - 0.5) * 200,
        y: cy + (Math.random() - 0.5) * 200,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 100 + Math.random() * 100,
        size: 3 + Math.random() * 8,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        type: 'star',
        opacity: 1,
      });
    }

    /* Legendary: create beam particles */
    if (isLegendary) {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * 15,
          vy: Math.sin(angle) * 15,
          life: 0,
          maxLife: 40 + Math.random() * 20,
          size: 2 + Math.random() * 4,
          color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
          rotation: angle,
          rotationSpeed: 0,
          type: 'beam',
          opacity: 0.8,
        });
      }
    }

    /* Screen shake for legendary */
    let shakeX = 0;
    let shakeY = 0;

    const animate = () => {
      if (!activeRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.save();

      /* Screen shake for legendary crits */
      if (isLegendary && shakeIntensity > 0) {
        shakeX = (Math.random() - 0.5) * shakeIntensity * 4;
        shakeY = (Math.random() - 0.5) * shakeIntensity * 4;
        ctx.translate(shakeX, shakeY);
      }

      ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

      let aliveCount = 0;
      for (const p of particles) {
        if (p.life >= p.maxLife) continue;
        aliveCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.rotation += p.rotationSpeed;

        /* Gravity for confetti */
        if (p.type === 'confetti') {
          p.vy += 0.12;
          p.vx *= 0.995;
        }

        /* Float up for numbers */
        if (p.type === 'number') {
          p.vy -= 0.05;
          p.vx *= 0.98;
        }

        /* Slow drift for stars */
        if (p.type === 'star') {
          p.vx *= 0.99;
          p.vy *= 0.99;
        }

        /* Beam speed decay */
        if (p.type === 'beam') {
          p.vx *= 0.92;
          p.vy *= 0.92;
        }

        const progress = p.life / p.maxLife;
        p.opacity = Math.max(0, 1 - progress * progress);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        switch (p.type) {
          case 'confetti': {
            /* Draw rectangle confetti */
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            break;
          }
          case 'number': {
            /* Draw floating text */
            ctx.font = `bold ${p.size}px "Bebas Neue", sans-serif`;
            ctx.fillStyle = p.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fillText(p.text || '', 0, 0);
            break;
          }
          case 'star': {
            /* Draw star shape */
            drawStar(ctx, 0, 0, p.size, p.color);
            break;
          }
          case 'beam': {
            /* Draw beam line */
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.globalAlpha = p.opacity * 0.6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-p.vx * 3, -p.vy * 3);
            ctx.stroke();
            break;
          }
        }

        ctx.restore();
      }

      /* Draw legendary rainbow ring */
      if (isLegendary) {
        const ringProgress = Math.min(1, (Date.now() - startTime) / 1500);
        const ringRadius = ringProgress * Math.max(canvas.width, canvas.height) * 0.6;
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, ringRadius);
        gradient.addColorStop(0, 'rgba(255,215,0,0)');
        gradient.addColorStop(0.5, 'rgba(255,215,0,0.15)');
        gradient.addColorStop(1, 'rgba(255,0,255,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.restore();

      if (aliveCount > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    /* Draw star helper */
    function drawStar(ctx: CanvasRenderingContext2D, _cx: number, _cy: number, size: number, color: string) {
      const spikes = 4;
      const outerR = size;
      const innerR = size * 0.4;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (Math.PI * i) / spikes - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    const startTime = Date.now();
    let shakeIntensity = isLegendary ? 1 : 0;

    /* Fade out shake over time */
    const shakeInterval = setInterval(() => {
      shakeIntensity *= 0.9;
      if (shakeIntensity < 0.01) shakeIntensity = 0;
    }, 50);

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(shakeInterval);
    };
  }, [active, multiplier, combo, isLegendary]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 101,
        pointerEvents: 'none',
      }}
    />
  );
});

/* ─── Animated Number Counter ─── */
function AnimatedNumber({ value, duration = 800, prefix = '', suffix = '', decimals = 1 }: { value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease out */
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * end;
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

/* ─── Animated Currency Counter ─── */
function AnimatedCurrency({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * end;
      setDisplay(Math.floor(start));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  const formatted = display >= 1000000
    ? `${(display / 1000000).toFixed(1)}M`
    : display >= 1000
    ? `${(display / 1000).toFixed(1)}K`
    : display.toLocaleString();

  return <span>+£{formatted}</span>;
}

/* ─── Main CritOverlay Component ─── */
export default function CritOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CritLocationState | null;

  const multiplier = state?.multiplier || 1;
  const returnAmount = state?.returnAmount || 0;
  const combo = state?.combo || 0;

  const isLegendary = multiplier >= 10;
  const specialText = getSpecialText(multiplier, combo);
  const comboColor = getComboColor(combo);
  const comboLabel = getComboLabel(combo);

  const [visible, setVisible] = useState(true);
  const [skipped, setSkipped] = useState(false);

  /* Auto-close after animation */
  useEffect(() => {
    if (skipped) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => navigate('/play'), 500);
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate, skipped]);

  /* Skip on click */
  const handleSkip = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    setVisible(false);
    setTimeout(() => navigate('/play'), 300);
  }, [navigate, skipped]);

  /* Escape to skip */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleSkip]);

  /* Font size based on multiplier magnitude */
  const multiplierSize = multiplier >= 10 ? 'text-[100px] lg:text-[120px]' : multiplier >= 5 ? 'text-[80px] lg:text-[96px]' : 'text-[64px] lg:text-[80px]';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center cursor-pointer select-none"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleSkip}
        >
          {/* Canvas particles layer */}
          <CritCanvas
            multiplier={multiplier}
            combo={combo}
            isLegendary={isLegendary}
            active={visible}
          />

          {/* Content container */}
          <div className="relative z-[102] flex flex-col items-center gap-4 pointer-events-none">

            {/* "暴击！" label */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: [0.3, 1.3, 1], opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.6, ease: easeOutBack, delay: 0.1 }}
            >
              <h2
                className="text-5xl lg:text-6xl font-bold text-[#FFD700] tracking-wider"
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  textShadow: '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3), 0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                <span className="flex items-center gap-3">
                  <Zap size={40} className="text-[#FFD700]" />
                  暴击！
                  <Zap size={40} className="text-[#FFD700]" />
                </span>
              </h2>
            </motion.div>

            {/* Multiplier display */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: easeOutBack, delay: 0.2 }}
            >
              <span
                className={`font-bold leading-none ${multiplierSize}`}
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  background: isLegendary
                    ? 'linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #FFD700)'
                    : 'linear-gradient(180deg, #FF00FF, #FFD700)',
                  backgroundSize: isLegendary ? '200%' : '100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: isLegendary ? 'drop-shadow(0 0 20px rgba(255,215,0,0.5))' : 'drop-shadow(0 0 15px rgba(255,0,255,0.4))',
                  animation: isLegendary ? 'shimmer 2s infinite linear' : 'none',
                }}
              >
                <AnimatedNumber value={multiplier} suffix="x" />
              </span>

              {/* Star rating */}
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => {
                  const threshold = (i + 1) * 2;
                  const filled = multiplier >= threshold;
                  return (
                    <motion.span
                      key={i}
                      className="text-xl lg:text-2xl"
                      style={{
                        color: filled ? '#FFD700' : 'rgba(255,255,255,0.15)',
                        textShadow: filled ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3, ease: easeOutBack }}
                    >
                      ★
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>

            {/* Return amount */}
            <motion.div
              className="text-3xl lg:text-5xl font-bold text-[#00E676]"
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                textShadow: '0 0 20px rgba(0,230,118,0.4), 0 2px 4px rgba(0,0,0,0.5)',
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.6 }}
            >
              <AnimatedCurrency value={returnAmount} />
            </motion.div>

            {/* Combo counter */}
            {combo > 1 && (
              <motion.div
                className="flex items-center gap-3 mt-2"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.3, 1], opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, ease: easeOutBack, delay: 0.7 }}
              >
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full"
                  style={{
                    backgroundColor: `${comboColor}20`,
                    border: `2px solid ${comboColor}60`,
                    boxShadow: `0 0 20px ${comboColor}30`,
                  }}
                >
                  <span
                    className="text-2xl lg:text-3xl font-bold"
                    style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      color: comboColor,
                      textShadow: `0 0 10px ${comboColor}60`,
                    }}
                  >
                    ×{combo}
                  </span>
                  <span className="text-sm font-semibold text-white">连击</span>
                  {comboLabel && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${comboColor}30`,
                        color: comboColor,
                      }}
                    >
                      {comboLabel}
                    </span>
                  )}
                </div>

                {/* Fire icons */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(combo, 5) }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3, ease: easeOutBack }}
                    >
                      <Flame size={20} style={{ color: i >= 3 ? '#FF1744' : '#FF6F00' }} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Special text */}
            {specialText && (
              <motion.p
                className={`text-lg lg:text-xl font-bold text-center ${isLegendary ? 'text-[#FFD700]' : 'text-[#FF00FF]'}`}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  textShadow: isLegendary
                    ? '0 0 20px rgba(255,215,0,0.4)'
                    : '0 0 15px rgba(255,0,255,0.3)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                {specialText}
              </motion.p>
            )}

            {/* Click to continue hint */}
            <motion.p
              className="text-xs text-[#666] mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ delay: 2, duration: 2, repeat: Infinity }}
            >
              点击任意位置继续
            </motion.p>
          </div>

          {/* Legendary: edge glow effect */}
          {isLegendary && (
            <div
              className="absolute inset-0 pointer-events-none z-[101]"
              style={{
                boxShadow: 'inset 0 0 100px rgba(255,215,0,0.1), inset 0 0 200px rgba(255,0,255,0.05)',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
