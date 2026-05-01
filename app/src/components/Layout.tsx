import type { ReactNode } from 'react';
import ParticleCanvas from './ParticleCanvas';
import type { Era } from '@/data/types';

interface LayoutProps {
  children: ReactNode;
  era?: Era;
  bgImage?: string;
  overlayOpacity?: number;
}

export default function Layout({ children, era = 1, bgImage, overlayOpacity = 0.85 }: LayoutProps) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      {/* Background image */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(10,10,10,${overlayOpacity})` }}
      />
      
      {/* Radial gradient for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.5) 100%)`,
        }}
      />
      
      {/* Particle effects */}
      <ParticleCanvas era={era} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
