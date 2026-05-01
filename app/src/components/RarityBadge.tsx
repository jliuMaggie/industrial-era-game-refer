import { RARITY_COLORS, RARITY_LABELS } from '@/data/constants';
import type { Rarity } from '@/data/types';

interface RarityBadgeProps {
  rarity: Rarity;
  className?: string;
}

export default function RarityBadge({ rarity, className = '' }: RarityBadgeProps) {
  const colors = RARITY_COLORS[rarity];
  const label = RARITY_LABELS[rarity];
  const isLegendary = rarity === 'legendary';

  return (
    <span
      className={`inline-flex items-center justify-center px-3 h-6 rounded-full text-xs font-semibold ${className}`}
      style={{
        border: `1px solid ${colors.border}`,
        background: isLegendary
          ? 'linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #FFD700)'
          : colors.bg,
        backgroundSize: isLegendary ? '300%' : 'auto',
        animation: isLegendary ? 'shimmer 3s infinite linear' : 'none',
        color: isLegendary ? '#1A0F0A' : colors.text,
      }}
    >
      {label}
    </span>
  );
}
