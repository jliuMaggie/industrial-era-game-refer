import { useRef, useEffect, memo } from 'react';
import type { Era } from '@/data/types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  text?: string;
}

function createParticle(era: Era, canvasWidth: number, canvasHeight: number): Particle {
  switch (era) {
    case 1: // Steam/smoke
      return {
        x: Math.random() * canvasWidth,
        y: canvasHeight + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 1,
        life: 0,
        maxLife: 200 + Math.random() * 200,
        size: 8 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.2,
      };
    case 2: // Electric sparks
      return {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 0,
        maxLife: 10 + Math.random() * 15,
        size: 1 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4,
      };
    case 3: // Data stream
      return {
        x: Math.random() * canvasWidth,
        y: -10,
        vx: 0,
        vy: 1 + Math.random() * 2,
        life: 0,
        maxLife: 150 + Math.random() * 100,
        size: 10,
        opacity: 0.15 + Math.random() * 0.15,
        text: Math.random() > 0.5 ? '1' : '0',
      };
    case 4: // Hologram hexagons
      return {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.2,
        life: 0,
        maxLife: 300 + Math.random() * 200,
        size: 4 + Math.random() * 8,
        opacity: 0.1 + Math.random() * 0.2,
      };
    default:
      return { x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 100, size: 5, opacity: 0.1 };
  }
}

const ParticleCanvasComponent = memo(function ParticleCanvas({ era }: { era: Era }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
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

    const maxParticles = 30;

    const drawParticle = (p: Particle) => {
      const progress = p.life / p.maxLife;
      
      if (era === 1) {
        // Steam
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(255,255,255,${p.opacity * (1 - progress)})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (era === 2) {
        // Electric sparks
        ctx.strokeStyle = `rgba(100,180,255,${p.opacity * (1 - progress)})`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
        ctx.stroke();
      } else if (era === 3) {
        // Data stream
        ctx.fillStyle = `rgba(0,255,127,${p.opacity * (1 - progress)})`;
        ctx.font = `${p.size}px monospace`;
        if (p.text) ctx.fillText(p.text, p.x, p.y);
      } else if (era === 4) {
        // Hexagons
        ctx.strokeStyle = `rgba(106,90,205,${p.opacity * (1 - progress)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const hx = p.x + p.size * Math.cos(angle);
          const hy = p.y + p.size * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = `rgba(106,90,205,${p.opacity * 0.3 * (1 - progress)})`;
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new particles
      if (particlesRef.current.length < maxParticles && Math.random() < 0.1) {
        particlesRef.current.push(createParticle(era, canvas.width, canvas.height));
      }

      // Update and draw
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) return false;

        drawParticle(p);
        return true;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [era]);

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
});

export default ParticleCanvasComponent;
