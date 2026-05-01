import { motion } from 'framer-motion';
import { RARITY_COLORS } from '@/data/constants';
import type { Investment } from '@/data/types';
import RarityBadge from './RarityBadge';

interface InvestmentCardProps {
  investment: Investment;
  playerLevel?: number;
  playerAsset?: number;
  onInvest?: (amount: 'all' | 'single') => void;
  onViewRoute?: () => void;
  selected?: boolean;
  index?: number;
  showActions?: boolean;
  compact?: boolean;
}

export default function InvestmentCard({
  investment,
  playerLevel = 1,
  playerAsset = 0,
  onInvest,
  onViewRoute,
  selected = false,
  index = 0,
  showActions = true,
  compact = false,
}: InvestmentCardProps) {
  const colors = RARITY_COLORS[investment.rarity];
  const levelData = investment.levels[Math.min(playerLevel - 1, investment.levels.length - 1)];
  const isLegendary = investment.rarity === 'legendary';

  const investAmount = Math.min(levelData.maxInvest, Math.max(levelData.minInvest, Math.floor(playerAsset * 0.1)));
  const allInAmount = playerAsset;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative flex flex-col rounded-2xl overflow-hidden ${compact ? 'w-[200px]' : 'w-[240px]'}`}
      style={{
        background: 'rgba(20,20,20,0.9)',
        backdropFilter: 'blur(12px)',
        border: selected ? `3px solid ${colors.border}` : `2px solid ${colors.border}40`,
        boxShadow: selected
          ? `0 0 40px ${colors.glow}, inset 0 0 30px ${colors.glow}20`
          : `0 4px 24px ${colors.glow}30`,
      }}
    >
      {/* Legendary shimmer background */}
      {isLegendary && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FF6B6B, #4ECDC4, #FFD700)',
            backgroundSize: '300%',
            animation: 'shimmer 3s infinite linear',
          }}
        />
      )}

      <div className="relative p-4 flex flex-col gap-3">
        {/* Icon & Name */}
        <div className="flex items-center justify-between">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
            style={{
              background: `linear-gradient(135deg, ${investment.era === 1 ? '#8B451340' : investment.era === 2 ? '#4682B440' : investment.era === 3 ? '#2E8B5740' : '#6A5ACD40'}, transparent)`,
            }}
          >
            {investment.icon}
          </div>
          <RarityBadge rarity={investment.rarity} />
        </div>

        {/* Name */}
        <h3
          className="text-lg font-bold text-white truncate"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {investment.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#AAA] line-clamp-3 leading-relaxed min-h-[48px]">
          {investment.description}
        </p>

        {/* Stats */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#888]">收益率</span>
            <span className="text-sm font-bold text-[#00E676]">{(levelData.returnRate * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#888]">暴击率</span>
            <span className="text-sm font-bold text-[#FF00FF]">{(levelData.critRate * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#888]">风险</span>
            <div className="flex gap-0.5">
              {Array.from({ length: investment.riskStars }).map((_, i) => (
                <span key={i} className="text-[#FFB300] text-xs">★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Amount range */}
        <div className="text-sm font-semibold text-[#FFD700] text-center py-1">
          £{levelData.minInvest.toLocaleString()} - £{levelData.maxInvest.toLocaleString()}
        </div>

        {/* Level dots */}
        <div className="flex justify-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: i < playerLevel ? colors.border : '#333',
                boxShadow: i < playerLevel ? `0 0 4px ${colors.glow}` : 'none',
              }}
            />
          ))}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={() => onInvest?.('single')}
              className="w-full h-10 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${investment.era === 1 ? '#8B4513' : investment.era === 2 ? '#4682B4' : investment.era === 3 ? '#2E8B57' : '#6A5ACD'}, ${investment.era === 1 ? '#D2691E' : investment.era === 2 ? '#708090' : investment.era === 3 ? '#3CB371' : '#9370DB'})`,
                color: 'white',
              }}
            >
              投资 £{investAmount.toLocaleString()}
            </button>
            <button
              onClick={() => onInvest?.('all')}
              className="w-full h-9 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-125 hover:shadow-lg active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #B8860B)',
                color: '#1A0F0A',
              }}
            >
              ALL-IN £{allInAmount.toLocaleString()}
            </button>
            {onViewRoute && (
              <button
                onClick={onViewRoute}
                className="w-full h-8 rounded-xl text-xs font-medium text-[#888] hover:text-white bg-transparent hover:bg-white/5 transition-all duration-200"
              >
                查看升级路线 →
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
