import { useRef, useEffect, memo } from 'react';

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
}

const COLORS = ['#FFD700', '#FF00FF', '#00E5FF', '#FF1744', '#00E676', '#FF6B35'];

const CritEffectComponent = memo(function CritEffect({ active, multiplier }: { active: boolean; multiplier: number }) {
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

    const particles: Particle[] = [];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Create explosion particles
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 8;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        size: 3 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    const animate = () => {
      if (!activeRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.vx *= 0.99;
        p.life++;
        p.rotation += p.rotationSpeed;

        const progress = p.life / p.maxLife;
        const opacity = 1 - progress;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;

        // Draw confetti shape
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      // Draw multiplier text
      ctx.save();
      ctx.font = `bold 96px "Bebas Neue", sans-serif`;
      ctx.fillStyle = '#FF00FF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#FF00FF';
      ctx.shadowBlur = 30;
      const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
      ctx.scale(pulse, pulse);
      ctx.fillText(`${multiplier.toFixed(1)}x`, cx / pulse, cy / pulse);
      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [active, multiplier]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    />
  );
});

export default CritEffectComponent;
