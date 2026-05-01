import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/engine/GameState';
import { ACHIEVEMENTS } from '@/data/achievements';
import {
  ArrowLeft,
  Lock,
  Star,
  HelpCircle,
  Zap,
  TrendingUp,
  Crown,
  Clock,
  Gem,
  Award,
  Flame,
  Target,
  Shield,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Achievement } from '@/data/types';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ── Achievement category mapping ──
type CategoryKey = 'all' | 'era' | 'wealth' | 'legacy' | 'special';

interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: typeof Star;
  color: string;
  barColor: string;
}

const CATEGORIES: CategoryDef[] = [
  { key: 'all', label: '全部', icon: Star, color: '#FFD700', barColor: '#FFD700' },
  { key: 'era', label: '时代成就', icon: Clock, color: '#4682B4', barColor: '#4682B4' },
  { key: 'wealth', label: '财富里程碑', icon: Gem, color: '#FFD700', barColor: '#FFD700' },
  { key: 'legacy', label: '传承成就', icon: Flame, color: '#00E676', barColor: '#00E676' },
  { key: 'special', label: '特殊成就', icon: Zap, color: '#FF00FF', barColor: '#FF00FF' },
];

function getAchievementCategory(condition: string): CategoryKey {
  if (condition.startsWith('era_')) return 'era';
  if (condition.startsWith('asset_')) return 'wealth';
  if (['first_invest', 'first_crit', 'combo_5', 'combo_10', 'rank_1', 'all_in', 'upgrade_max', 'marry_legendary', 'survive_crisis'].includes(condition))
    return 'legacy';
  return 'special';
}

// ── Icon mapping for achievements ──
function getAchievementIcon(condition: string): typeof Star {
  if (condition.startsWith('era_')) return Clock;
  if (condition.startsWith('asset_')) return Gem;
  if (condition.includes('crit') || condition.includes('combo')) return Zap;
  if (condition.includes('rank')) return Crown;
  if (condition.includes('marry')) return Award;
  if (condition.includes('invest')) return Target;
  if (condition.includes('all_in')) return Flame;
  if (condition.includes('upgrade')) return TrendingUp;
  if (condition.includes('survive')) return Shield;
  return Star;
}

// ── Flavor texts ──
const FLAVOR_TEXTS: Record<string, string> = {
  first_invest: '第一步总是最难的，但也是最值得的。你的商业帝国就此奠基。',
  first_crit: '命运之轮开始转动，幸运女神向你微笑。这不会是最后一次。',
  combo_5: '连续的成功不是偶然——这是你商业直觉的证明。',
  combo_10: '十次连续暴击！传说级的运气，你的名字将被铭刻在商业史册上。',
  millionaire: '从£10,000到£1,000,000——一百倍的飞跃，这只是开始。',
  billionaire: '十亿资产！你已经超越了绝大多数人的想象。',
  trillionaire: '一万亿！这不是财富——这是权力，是历史，是人类文明的一个注脚。',
  era_2: '蒸汽时代已经过去，电气时代的光芒照亮了前行的道路。',
  era_3: '从模拟到数字，从 atoms 到 bits，你引领了文明的跃迁。',
  era_4: '人工智能时代降临。你站在文明最前沿，眺望星辰大海。',
  rank_1: '群山之巅，一览众山小。你是无可争议的商业霸主。',
  all_in: '赌徒的最后一搏，或是天才的果断决策？无论如何，你赢了。',
  upgrade_max: '登峰造极，臻于至善。一个投资物被你培养到了极致。',
  marry_legendary: '天作之合，强强联合。这桩联姻将改变两个家族的命运。',
  survive_crisis: '风暴过后，幸存者寥寥。而你，比风暴更坚韧。',
};

// ── Expand achievements with category and extra data ──
interface EnrichedAchievement extends Achievement {
  category: CategoryKey;
  icon: typeof Star;
  flavorText: string;
  isHidden: boolean;
}

function enrichAchievements(achievements: Achievement[]): EnrichedAchievement[] {
  return achievements.map(a => ({
    ...a,
    category: getAchievementCategory(a.condition),
    icon: getAchievementIcon(a.condition),
    flavorText: FLAVOR_TEXTS[a.id] || '一个等待被书写的传奇...',
    isHidden: false,
  }));
}

// Generate hidden achievements for "special" category
function generateHiddenAchievements(): EnrichedAchievement[] {
  const hiddenIds = ['secret_bankrupt', 'secret_speedrun', 'secret_no_crit', 'secret_perfect'];
  return hiddenIds.map(id => ({
    id,
    name: '???',
    description: '隐藏成就，继续游戏以发现...',
    condition: '?????',
    unlocked: false,
    category: 'special' as CategoryKey,
    icon: HelpCircle,
    flavorText: '???',
    isHidden: true,
  }));
}

// ── Achievement Card ──
function AchievementCard({
  achievement,
  onClick,
  index,
}: {
  achievement: EnrichedAchievement;
  onClick: () => void;
  index: number;
}) {
  const Icon = achievement.icon;
  const isUnlocked = achievement.unlocked;
  const isHidden = achievement.isHidden;
  const catDef = CATEGORIES.find(c => c.key === achievement.category);

  return (
    <motion.div
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{
        background: isUnlocked
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.02)',
        border: isUnlocked
          ? `2px solid ${catDef?.color || '#FFD700'}`
          : isHidden
          ? '1px solid #222'
          : '1px solid #444',
        boxShadow: isUnlocked
          ? `0 0 20px ${(catDef?.color || '#FFD700') + '20'}`
          : 'none',
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: easeOutExpo }}
      whileHover={{ y: -4, boxShadow: isUnlocked ? `0 0 30px ${(catDef?.color || '#FFD700') + '40'}` : '0 0 10px rgba(255,255,255,0.05)' }}
      onClick={onClick}
    >
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: isUnlocked
              ? `${catDef?.color || '#FFD700'}20`
              : 'rgba(255,255,255,0.03)',
            opacity: isUnlocked ? 1 : 0.4,
          }}
        >
          {isHidden ? (
            <HelpCircle size={24} className="text-[#333]" />
          ) : (
            <Icon
              size={24}
              style={{ color: isUnlocked ? catDef?.color || '#FFD700' : '#555' }}
            />
          )}
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1"
          style={{
            background: isUnlocked
              ? `${catDef?.color || '#FFD700'}20`
              : 'rgba(255,255,255,0.03)',
            color: isUnlocked ? catDef?.color || '#FFD700' : '#555',
          }}
        >
          {isUnlocked ? (
            <>
              <Star size={10} />
              已解锁
            </>
          ) : isHidden ? (
            <>
              <Lock size={10} />
              隐藏
            </>
          ) : (
            <>
              <Lock size={10} />
              未解锁
            </>
          )}
        </span>
      </div>

      {/* Name */}
      <h3
        className="text-base font-bold mb-1"
        style={{
          fontFamily: 'Playfair Display, serif',
          color: isUnlocked ? '#fff' : isHidden ? '#333' : '#666',
        }}
      >
        {achievement.name}
      </h3>

      {/* Category label */}
      <span
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: isUnlocked ? catDef?.color || '#888' : '#444' }}
      >
        {catDef?.label || ''}
      </span>

      {/* Description */}
      <p
        className="text-xs mt-2 leading-relaxed"
        style={{ color: isUnlocked ? '#AAA' : '#444' }}
      >
        {achievement.description}
      </p>

      {/* Flavor text (only for unlocked) */}
      {isUnlocked && !isHidden && (
        <p className="text-xs mt-2 italic leading-relaxed text-[#666] border-t border-white/5 pt-2">
          &ldquo;{achievement.flavorText}&rdquo;
        </p>
      )}
    </motion.div>
  );
}

// ── Progress Bar ──
function ProgressBar({
  label,
  current,
  total,
  color,
  delay,
}: {
  label: string;
  current: number;
  total: number;
  color: string;
  delay: number;
}) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <span className="text-sm text-white w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[#333] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: easeOutExpo, delay: delay + 0.3 }}
        />
      </div>
      <span className="text-xs text-[#888] w-14 text-right flex-shrink-0">
        {current}/{total}
      </span>
      <span className="text-xs text-[#666] w-10 text-right flex-shrink-0">
        {percentage.toFixed(0)}%
      </span>
    </motion.div>
  );
}

// ── Achievement Detail Modal ──
function AchievementDetail({
  achievement,
}: {
  achievement: EnrichedAchievement;
}) {
  const Icon = achievement.icon;
  const isUnlocked = achievement.unlocked;
  const isHidden = achievement.isHidden;
  const catDef = CATEGORIES.find(c => c.key === achievement.category);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: isUnlocked
              ? `${catDef?.color || '#FFD700'}25`
              : 'rgba(255,255,255,0.03)',
          }}
        >
          {isHidden ? (
            <HelpCircle size={32} className="text-[#333]" />
          ) : (
            <Icon
              size={32}
              style={{ color: isUnlocked ? catDef?.color || '#FFD700' : '#555' }}
            />
          )}
        </div>
        <div>
          <h3
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {achievement.name}
          </h3>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: catDef?.color || '#888' }}
          >
            {catDef?.label || ''}成就
          </span>
        </div>
      </div>

      <div className="h-[1px] bg-white/10" />

      {/* Description */}
      <div>
        <p className="text-xs text-[#888] mb-1">描述</p>
        <p className="text-sm text-[#AAA]">{achievement.description}</p>
      </div>

      {/* Flavor text */}
      {!isHidden && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-xs text-[#888] mb-1">风味文本</p>
          <p className="text-sm italic text-[#999] leading-relaxed">
            &ldquo;{achievement.flavorText}&rdquo;
          </p>
        </div>
      )}

      {/* Condition */}
      <div>
        <p className="text-xs text-[#888] mb-1">解锁条件</p>
        <p className="text-sm" style={{ color: isUnlocked ? '#00E676' : '#888' }}>
          {isHidden ? '?????' : achievement.condition}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span
          className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
          style={{
            background: isUnlocked
              ? `${catDef?.color || '#FFD700'}20`
              : 'rgba(255,255,255,0.03)',
            color: isUnlocked ? catDef?.color || '#FFD700' : '#555',
          }}
        >
          {isUnlocked ? (
            <>
              <Star size={12} />
              已解锁
            </>
          ) : (
            <>
              <Lock size={12} />
              未解锁
            </>
          )}
        </span>
        {isUnlocked && (
          <span className="text-xs text-[#666]">
            解锁于第?轮
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Achievements Screen ──
export default function AchievementsScreen() {
  const navigate = useNavigate();
  const { state } = useGameState();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<EnrichedAchievement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Enrich all achievements
  const allAchievements = useMemo(() => {
    const enriched = enrichAchievements(state.achievements.length > 0 ? state.achievements : ACHIEVEMENTS);
    const hidden = generateHiddenAchievements();
    return [...enriched, ...hidden];
  }, [state.achievements]);

  // Filter by category
  const filteredAchievements = useMemo(() => {
    if (activeCategory === 'all') return allAchievements;
    return allAchievements.filter(a => a.category === activeCategory);
  }, [allAchievements, activeCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allAchievements.length };
    CATEGORIES.forEach(cat => {
      if (cat.key !== 'all') {
        counts[cat.key] = allAchievements.filter(a => a.category === cat.key && !a.isHidden).length;
      }
    });
    return counts;
  }, [allAchievements]);

  // Unlocked counts per category
  const unlockedCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allAchievements.filter(a => a.unlocked).length,
    };
    CATEGORIES.forEach(cat => {
      if (cat.key !== 'all') {
        counts[cat.key] = allAchievements.filter(
          a => a.category === cat.key && a.unlocked && !a.isHidden
        ).length;
      }
    });
    return counts;
  }, [allAchievements]);

  const totalUnlocked = unlockedCounts.all;
  totalUnlocked;
  const totalAchievements = categoryCounts.all - allAchievements.filter(a => a.isHidden).length;

  // Recently unlocked (mock)
  const recentlyUnlocked = useMemo(
    () => allAchievements.filter(a => a.unlocked).slice(-3).reverse(),
    [allAchievements]
  );

  // Handle Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDetailModal) {
          setShowDetailModal(false);
        } else {
          navigate('/play');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showDetailModal]);

  return (
    <div
      className="min-h-[100dvh] relative overflow-auto"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #1A1008 50%, #0A0A0A 100%)',
      }}
    >
      {/* Subtle gold radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.03) 0%, transparent 60%)',
        }}
      />

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
            <Star size={24} className="inline-block mr-2 -mt-1" />
            成就殿堂
          </h1>
          <p className="text-sm text-[#888] mt-0.5">
            <span className="text-[#FFD700] font-bold">{totalUnlocked}</span> / {totalAchievements} 已解锁
          </p>
        </div>

        <div className="w-16" />
      </motion.header>

      <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Category Filter Tabs */}
        <motion.div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className="relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${cat.color}, ${cat.color}88)`
                    : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#1A0F0A' : '#AAA',
                }}
              >
                <Icon size={14} />
                {cat.label}
                <span
                  className="text-[10px] font-bold ml-0.5 px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#1A0F0A' : '#666',
                  }}
                >
                  {cat.key === 'all' ? totalAchievements : categoryCounts[cat.key] || 0}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Achievement Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                onClick={() => {
                  setSelectedAchievement(achievement);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Progress Overview */}
        <motion.div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: 'rgba(20,20,20,0.8)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h3
            className="text-base font-bold text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            进度总览
          </h3>

          <div className="flex flex-col gap-3">
            {CATEGORIES.filter(c => c.key !== 'all').map((cat, i) => (
              <ProgressBar
                key={cat.key}
                label={cat.label}
                current={unlockedCounts[cat.key] || 0}
                total={categoryCounts[cat.key] || 1}
                color={cat.barColor}
                delay={0.7 + i * 0.1}
              />
            ))}
          </div>

          {/* Total progress */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/5">
            <span className="text-sm font-bold text-white w-24 flex-shrink-0">总进度</span>
            <div className="flex-1 h-3 rounded-full bg-[#333] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #FFD700, #B8860B)',
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${totalAchievements > 0 ? (totalUnlocked / totalAchievements) * 100 : 0}%`,
                }}
                transition={{ duration: 1.5, ease: easeOutExpo, delay: 1.2 }}
              />
            </div>
            <span className="text-xs text-[#FFD700] font-bold w-14 text-right flex-shrink-0">
              {totalUnlocked}/{totalAchievements}
            </span>
            <span className="text-xs text-[#666] w-10 text-right flex-shrink-0">
              {totalAchievements > 0 ? ((totalUnlocked / totalAchievements) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </motion.div>

        {/* Recently Unlocked */}
        {recentlyUnlocked.length > 0 && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <h3
              className="text-base font-bold text-white mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              最近解锁
            </h3>
            <div className="flex flex-col gap-2">
              {recentlyUnlocked.map((achievement, i) => {
                const Icon = achievement.icon;
                const catDef = CATEGORIES.find(c => c.key === achievement.category);
                return (
                  <motion.div
                    key={achievement.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${(catDef?.color || '#FFD700') + '30'}`,
                    }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.1 + i * 0.1 }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `${catDef?.color || '#FFD700'}20` }}
                    >
                      <Icon size={18} style={{ color: catDef?.color || '#FFD700' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{achievement.name}</p>
                      <p className="text-xs text-[#888]">{achievement.description}</p>
                    </div>
                    <span className="text-xs text-[#666]">第?轮</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>

      {/* Achievement Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent
          className="sm:max-w-md border-[#333]"
          style={{
            background: 'rgba(20,20,20,0.95)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white sr-only">成就详情</DialogTitle>
            <DialogDescription className="sr-only">
              查看成就详细信息、解锁条件和风味文本
            </DialogDescription>
          </DialogHeader>
          {selectedAchievement && (
            <AchievementDetail
              achievement={selectedAchievement}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
