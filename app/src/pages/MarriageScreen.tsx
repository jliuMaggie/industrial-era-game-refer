import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useGameState } from '@/engine/GameState';
import { MARRIAGES } from '@/data/marriages';
import { RARITY_COLORS } from '@/data/constants';
import Layout from '@/components/Layout';
import RarityBadge from '@/components/RarityBadge';
import type { Marriage, Rarity } from '@/data/types';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  User,
  Gem,
  Coins,
  Check,
  Heart,
  HelpCircle,
  Crown,
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeOutBack = [0.34, 1.56, 0.64, 1] as [number, number, number, number];
const spring = [0.68, -0.55, 0.265, 1.55] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Generate 40 candidates from base 10 with variants                   */
/* ------------------------------------------------------------------ */

const GIVEN_NAMES_F = [
  '艾玛','玛丽','夏洛特','克拉拉','索菲亚','艾达','维多利亚',
  '莉莉安','安娜','伊莎贝拉','玛格丽特','海伦娜','露西','艾米莉',
  '弗洛伦斯','格蕾丝','珍妮弗','凯瑟琳','伊丽莎白','奥黛丽',
  '罗丝','佩内洛普','埃莉诺','阿比盖尔','莎拉',
];
const GIVEN_NAMES_M = [
  '威廉','亨利','爱德华','乔治','查理','弗雷德里克','亚瑟',
  '托马斯','詹姆斯','理查德','约翰','罗伯特','塞巴斯蒂安',
  '奥利弗','本杰明','塞缪尔','阿尔伯特','约瑟夫','彼得','雨果',
  '亚瑟','弗朗西斯','西蒙','马克西米利安','亚历山大',
];
const SURNAMES = [
  '冯·施泰因','哈特福德','罗斯柴尔德','克虏伯','德·梅特涅',
  '洛夫莱斯','温莎','皮尔斯','图灵-张','布莱克伍德',
  '阿什沃思','卡文迪许','塞西尔','德雷克','艾灵顿',
  '费舍尔','格雷厄姆','霍桑','艾夫斯','金斯利',
  '兰开斯特','莫蒂默','诺斯里','彭罗斯','昆西',
  '拉德克利夫','萨默塞特','塔尔博特','厄普顿','维克斯',
];

const TITLE_TEMPLATES: Record<Rarity, string[]> = {
  common: ['男爵之女','富商遗孀','小店主的女儿','乡村贵族','工厂女工头目','普通商人之女'],
  rare: ['银行家千金','工业巨头继承人','外交官之女','贵族小姐','商会主席之女','著名律师之女'],
  epic: ['科学天才','王室公主','石油女王','铁路大亨之女','著名发明家之女','公爵夫人'],
  legendary: ['AI先驱','神秘投资人','时间旅者之女','隐形富豪继承人','传奇企业家之女','跨国财阀继承人'],
};

const DESCRIPTION_TEMPLATES: Record<Rarity, string[]> = {
  common: [
    '一位有教养的贵族女子，带着 modest 嫁妆嫁入家族。',
    '继承亡夫商业头脑的精明女人。',
    '勤劳朴素的商人女儿，经营着自己的小店铺。',
    '乡下小贵族的千金，虽然贫寒但举止优雅。',
    '从工厂基层打拼上来的女主管，务实可靠。',
    '来自小商人家庭的女孩，精打细算。',
  ],
  rare: [
    '金融世家的掌上明珠，人脉广泛。',
    '钢铁帝国的女继承人，精通企业管理。',
    '外交世家的优雅女子，声望卓著。',
    '上层社会的名媛，能为家族带来广阔人脉。',
    '商会主席的独生女，继承了父亲的商业嗅觉。',
    '著名律师之女，精通法律与谈判。',
  ],
  epic: [
    '罕见的科学天才，能为家族带来技术突破。',
    '王室血脉，联姻将极大提升家族地位。',
    '白手起家的石油大亨，商业手腕凌厉。',
    '铁路大亨的继承人，掌控着庞大的运输网络。',
    '著名发明家之女，对新科技有敏锐洞察。',
    '拥有广袤领地的公爵夫人，权势显赫。',
  ],
  legendary: [
    '改变世界的技术天才，价值连城。',
    '身份不明的超级富豪，据说来自未来。',
    '传说中时间旅者的后裔，拥有不可思议的知识。',
    '隐形万亿帝国的唯一继承人，富可敌国。',
    '连续创立五家独角兽企业的传奇人物。',
    '掌控全球金融命脉的神秘家族之女。',
  ],
};

const EFFECT_TEMPLATES: Record<Rarity, string[]> = {
  common: ['贸易收益 +3%','声望 +5','暴击率 +1%'],
  rare: ['贸易收益 +8%','声望 +15','暴击率 +3%','资产加成 +5%'],
  epic: ['贸易收益 +12%','声望 +30','暴击率 +6%','资产加成 +10%','联姻暴击 +5%'],
  legendary: ['贸易收益 +20%','声望 +50','暴击率 +12%','资产加成 +20%','联姻暴击 +10%','时代加成 +5%'],
};

const DOWRY_RANGES: Record<Rarity, [number, number]> = {
  common: [1000, 15000],
  rare: [20000, 80000],
  epic: [100000, 500000],
  legendary: [500000, 2000000],
};

const RARITY_WEIGHTS: Rarity[] = [
  'common','common','common','common','common','common','common','common','common','common',
  'common','common','common','common','common','common','common','common','common','common',
  'rare','rare','rare','rare','rare','rare','rare','rare','rare','rare',
  'rare','rare','rare','rare',
  'epic','epic','epic',
  'epic','epic',
  'legendary','legendary',
];

function generateCandidates(): Marriage[] {
  // Start with base 10, then generate up to 40
  const base = [...MARRIAGES];
  const usedNames = new Set(base.map(m => m.name));
  let idCounter = base.length;

  for (let i = 0; i < 30; i++) {
    const rarity = RARITY_WEIGHTS[i] || 'common';
    const isFemale = Math.random() > 0.3;
    const givenName = isFemale
      ? GIVEN_NAMES_F[Math.floor(Math.random() * GIVEN_NAMES_F.length)]
      : GIVEN_NAMES_M[Math.floor(Math.random() * GIVEN_NAMES_M.length)];
    const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const name = `${givenName}·${surname}`;

    if (usedNames.has(name)) continue;
    usedNames.add(name);

    const titles = TITLE_TEMPLATES[rarity];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const descs = DESCRIPTION_TEMPLATES[rarity];
    const description = descs[Math.floor(Math.random() * descs.length)];
    const [minD, maxD] = DOWRY_RANGES[rarity];
    const assetBonus = Math.floor(minD + Math.random() * (maxD - minD));

    base.push({
      id: `candidate_${idCounter++}`,
      name,
      title,
      rarity,
      assetBonus,
      reputationBonus: rarity === 'common' ? Math.floor(Math.random() * 10 + 5)
        : rarity === 'rare' ? Math.floor(Math.random() * 20 + 15)
        : rarity === 'epic' ? Math.floor(Math.random() * 30 + 30)
        : Math.floor(Math.random() * 50 + 50),
      critBonus: rarity === 'common' ? 0.01 + Math.random() * 0.02
        : rarity === 'rare' ? 0.03 + Math.random() * 0.03
        : rarity === 'epic' ? 0.05 + Math.random() * 0.04
        : 0.08 + Math.random() * 0.08,
      description,
    });
  }

  return base;
}

const ALL_CANDIDATES = generateCandidates();

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function GoldParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    let animId: number;

    function spawn() {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * w,
          y: h + 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 0.5,
          size: Math.random() * 3 + 1,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 120 + 60,
        });
      }
    }

    let frameCount = 0;
    const c = ctx;
    function animate() {
      c.clearRect(0, 0, w, h);
      frameCount++;
      if (frameCount % 4 === 0) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        c.save();
        c.globalAlpha = p.alpha;
        c.fillStyle = '#FFD700';
        c.shadowColor = '#FFD700';
        c.shadowBlur = 8;
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fill();
        c.restore();

        if (p.life >= p.maxLife) particles.splice(i, 1);
      }

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

/* Candidate card front face */
function CandidateCardFront({
  candidate,
  isSelected,
  onSelect,
  canAfford,
}: {
  candidate: Marriage;
  isSelected: boolean;
  onSelect: () => void;
  canAfford: boolean;
}) {
  const colors = RARITY_COLORS[candidate.rarity];
  const effects = EFFECT_TEMPLATES[candidate.rarity];
  const selectedEffects = effects.slice(0, candidate.rarity === 'legendary' ? 3 : 2);

  return (
    <div
      className="absolute inset-0 rounded-2xl p-3 flex flex-col gap-2"
      style={{
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        background: 'linear-gradient(145deg, rgba(30,30,30,0.98), rgba(20,20,20,0.98))',
        border: `2px solid ${colors.border}`,
        boxShadow: `0 0 ${candidate.rarity === 'legendary' ? 30 : 15}px ${colors.glow}, inset 0 0 20px ${colors.glow}15`,
      }}
    >
      {/* Quality badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <RarityBadge rarity={candidate.rarity} />
      </div>

      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
        style={{
          background: `radial-gradient(circle, ${colors.glow}, transparent 70%)`,
          border: `2px solid ${colors.border}`,
        }}
      >
        <User size={28} style={{ color: colors.text }} />
      </div>

      {/* Name & Title */}
      <div className="text-center">
        <h3 className="text-sm font-bold text-white font-playfair leading-tight">
          {candidate.name}
        </h3>
        <p className="text-[10px] mt-0.5" style={{ color: colors.text }}>
          {candidate.title}
        </p>
      </div>

      {/* Description */}
      <p className="text-[10px] text-[#AAA] leading-relaxed text-center line-clamp-2 flex-1">
        {candidate.description}
      </p>

      {/* Dowry */}
      <div className="flex items-center justify-center gap-1 text-xs font-semibold text-[#FFD700]">
        <Coins size={12} />
        <span>嫁妆: £{candidate.assetBonus.toLocaleString()}</span>
      </div>

      {/* Effects */}
      <div className="flex flex-col gap-0.5">
        {selectedEffects.map((eff, i) => (
          <div key={i} className="flex items-center gap-1 text-[10px]">
            <Sparkles size={10} className="text-[#00E676] flex-shrink-0" />
            <span className="text-[#CCC]">{eff}</span>
          </div>
        ))}
      </div>

      {/* Select button */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        disabled={!canAfford}
        className="w-full h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all duration-200 mt-auto"
        style={{
          background: isSelected
            ? 'linear-gradient(135deg, #FFD700, #FFA500)'
            : canAfford
            ? 'linear-gradient(135deg, #8B4513, #A0522D)'
            : '#333',
          color: isSelected ? '#1A0F0A' : canAfford ? '#FFF' : '#666',
          cursor: canAfford ? 'pointer' : 'not-allowed',
          opacity: canAfford ? 1 : 0.5,
        }}
      >
        {isSelected ? <Check size={14} /> : null}
        {canAfford ? (isSelected ? '已选中' : '选择联姻') : '资金不足'}
      </button>
    </div>
  );
}

/* Main screen */
export default function MarriageScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useGameState();

  const [pool, setPool] = useState<Marriage[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState(3);
  const [dealing, setDealing] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [marrying, setMarrying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Draw 4 random candidates
  const drawPool = useCallback(() => {
    const shuffled = [...ALL_CANDIDATES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);

  useEffect(() => {
    setPool(drawPool());
    setFlipped([false, false, false, false]);
    setSelectedIdx(null);
    setDealing(true);
    const t = setTimeout(() => setDealing(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Keyboard escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/play');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  const handleFlip = (idx: number) => {
    if (dealing || flipped[idx] || marrying) return;
    setFlipped(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  const handleSelect = (idx: number) => {
    if (flipped[idx]) {
      setSelectedIdx(idx === selectedIdx ? null : idx);
    }
  };

  const handleRefresh = () => {
    if (refreshCount <= 0 || state.player.asset < 1000 || marrying) return;
    dispatch({
      type: 'INVEST',
      payload: {
        investmentId: 'refresh_marriage',
        amount: 1000,
        outcome: 'normal',
        returnAmount: -1000,
        multiplier: 1,
      },
    });
    setRefreshCount(c => c - 1);
    setDealing(true);
    setFlipped([false, false, false, false]);
    setSelectedIdx(null);
    setTimeout(() => {
      setPool(drawPool());
      setDealing(false);
    }, 400);
  };

  const handleConfirmMarriage = () => {
    if (selectedIdx === null) return;
    const candidate = pool[selectedIdx];
    setShowConfirm(false);
    setMarrying(true);

    // Apply marriage after animation
    setTimeout(() => {
      dispatch({
        type: 'MARRY',
        payload: { marriageId: candidate.id },
      });
      // Also add bonus
      dispatch({
        type: 'INVEST',
        payload: {
          investmentId: 'marriage_bonus',
          amount: 0,
          outcome: 'normal',
          returnAmount: candidate.assetBonus,
          multiplier: 1,
        },
      });
      setMarrying(false);
      setShowResult(true);
      setTimeout(() => navigate('/play'), 2500);
    }, 1500);
  };

  const canRefresh = refreshCount > 0 && state.player.asset >= 1000;
  const selectedCandidate = selectedIdx !== null ? pool[selectedIdx] : null;

  // Card positions for dealing animation
  const cardOffsets = [
    { x: -340, rotate: -8 },
    { x: -115, rotate: -3 },
    { x: 115, rotate: 3 },
    { x: 340, rotate: 8 },
  ];

  return (
    <Layout era={state.currentEra} overlayOpacity={0.92}>
      <GoldParticles active={selectedCandidate?.rarity === 'legendary' && showResult} />

      <div className="min-h-[100dvh] flex flex-col items-center px-4 py-6">
        {/* Header */}
        <motion.div
          className="w-full max-w-[1200px] flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
        >
          <button
            onClick={() => navigate('/play')}
            className="flex items-center gap-2 text-[#888] hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            返回
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#FFD700] font-playfair flex items-center gap-2 justify-center">
              <span className="text-2xl">&#128141;</span>
              家族联姻
            </h1>
            <p className="text-xs text-[#888] mt-1">选择合适的联姻对象，壮大家族势力</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-[#888]">
              当前资金: <span className="text-[#FFD700] font-semibold">£{state.player.asset.toLocaleString()}</span>
            </span>
            <span className="text-xs text-[#888]">
              刷新次数: <span className="text-white font-semibold">{refreshCount}/3</span>
            </span>
          </div>
        </motion.div>

        {/* Cards Area */}
        <div className="flex-1 flex items-center justify-center w-full max-w-[1200px] relative">
          <div className="relative flex items-center justify-center" style={{ height: 320, width: '100%' }}>
            <AnimatePresence mode="wait">
              {pool.map((candidate, idx) => {
                const offset = cardOffsets[idx];
                const isFlipped = flipped[idx];
                const isSelected = selectedIdx === idx;

                return (
                  <motion.div
                    key={`${candidate.id}-${idx}`}
                    className="absolute"
                    style={{ perspective: 1000, zIndex: isSelected ? 30 : 20 - idx }}
                    initial={{
                      x: 0,
                      y: 40,
                      rotateZ: 0,
                      opacity: 0,
                      scale: 0.8,
                    }}
                    animate={{
                      x: dealing ? 0 : offset.x,
                      y: dealing ? 40 : 0,
                      rotateZ: dealing ? 0 : offset.rotate,
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{
                      duration: 0.5,
                      delay: dealing ? 0 : idx * 0.12,
                      ease: easeOutBack,
                    }}
                  >
                    <motion.div
                      className="relative cursor-pointer"
                      style={{
                        width: 200,
                        height: 280,
                        transformStyle: 'preserve-3d',
                      }}
                      animate={{
                        rotateY: isFlipped ? 180 : 0,
                        scale: isSelected ? 1.05 : marrying && isSelected ? 1.08 : selectedIdx !== null && !isSelected ? 0.95 : 1,
                        opacity: marrying && !isSelected ? 0.3 : selectedIdx !== null && !isSelected ? 0.5 : 1,
                      }}
                      transition={{
                        rotateY: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
                        scale: { duration: 0.3, ease: spring },
                        opacity: { duration: 0.3 },
                      }}
                      onClick={() => {
                        if (!isFlipped) handleFlip(idx);
                        else handleSelect(idx);
                      }}
                    >
                      {/* Back face */}
                      <div
                        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4"
                        style={{
                          backfaceVisibility: 'hidden',
                          background: 'linear-gradient(145deg, #2A2A2A, #1E1E1E)',
                          border: '3px solid #555',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }}
                      >
                        <HelpCircle size={48} className="text-[#555]" />
                        <span className="text-xs text-[#666]">点击翻牌</span>
                        <div
                          className="absolute inset-0 rounded-2xl opacity-30"
                          style={{
                            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 20px)',
                          }}
                        />
                      </div>

                      {/* Front face */}
                      <CandidateCardFront
                        candidate={candidate}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(idx)}
                        canAfford={state.player.asset >= 0}
                      />

                      {/* Legendary rainbow border during flip */}
                      {candidate.rarity === 'legendary' && isFlipped && !marrying && (
                        <motion.div
                          className="absolute -inset-1 rounded-2xl pointer-events-none"
                          style={{
                            background: 'linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4, #45B7D1, #96E6A1, #FFD700)',
                            backgroundSize: '300%',
                            animation: 'shimmer 2s infinite linear',
                            zIndex: -1,
                            filter: 'blur(4px)',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isFlipped ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom controls */}
        <motion.div
          className="flex flex-col items-center gap-6 mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {/* Selected info */}
          <AnimatePresence>
            {selectedCandidate && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: easeOutExpo }}
                className="glass-panel rounded-2xl px-8 py-4 flex items-center gap-6"
              >
                <div className="flex items-center gap-3">
                  <Crown size={20} className="text-[#FFD700]" />
                  <span className="text-sm text-white font-playfair">{selectedCandidate.name}</span>
                  <RarityBadge rarity={selectedCandidate.rarity} />
                </div>
                <div className="h-6 w-px bg-[#333]" />
                <div className="flex items-center gap-2 text-sm text-[#FFD700]">
                  <Gem size={14} />
                  <span>嫁妆: £{selectedCandidate.assetBonus.toLocaleString()}</span>
                </div>
                <div className="h-6 w-px bg-[#333]" />
                <button
                  onClick={() => setShowConfirm(true)}
                  className="h-9 px-6 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#1A0F0A',
                  }}
                >
                  确认联姻
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={!canRefresh}
            className="flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-medium transition-all duration-200 border border-[#555] hover:border-[#888] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              background: 'transparent',
              color: canRefresh ? '#CCC' : '#666',
            }}
          >
            <RefreshCw size={16} className={dealing ? 'animate-spin' : ''} />
            {refreshCount > 0
              ? `刷新候选人池 — £1,000 (${refreshCount}次)`
              : '本时代刷新次数已用尽'}
          </button>

          {/* Rules */}
          <motion.div
            className="glass-panel rounded-xl px-6 py-4 max-w-[600px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-white mb-2">联姻规则</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#888]">
              <span>· 每次展示4位候选人，可选择1位联姻</span>
              <span>· 联姻后获得嫁妆和永久加成</span>
              <span>· 刷新消耗 £1,000，每时代最多3次</span>
              <span>· 联姻影响下一代继承人天赋</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && selectedCandidate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              className="glass-panel rounded-2xl p-8 max-w-[420px] w-full mx-4 flex flex-col items-center gap-5"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: easeOutBack }}
              onClick={e => e.stopPropagation()}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${RARITY_COLORS[selectedCandidate.rarity].glow}, transparent 70%)`,
                  border: `2px solid ${RARITY_COLORS[selectedCandidate.rarity].border}`,
                }}
              >
                <Heart size={28} style={{ color: RARITY_COLORS[selectedCandidate.rarity].text }} />
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-white font-playfair">
                  确定与 {selectedCandidate.name} 联姻？
                </h2>
                <p className="text-sm text-[#888] mt-1">{selectedCandidate.title}</p>
              </div>

              <div className="w-full rounded-xl p-4 flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">嫁妆</span>
                  <span className="text-[#FFD700] font-semibold">£{selectedCandidate.assetBonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">声望加成</span>
                  <span className="text-[#FF6F00] font-semibold">+{selectedCandidate.reputationBonus}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#888]">暴击加成</span>
                  <span className="text-[#00E676] font-semibold">+{(selectedCandidate.critBonus * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 h-11 rounded-xl text-sm font-medium border border-[#555] text-[#CCC] hover:bg-[#222] transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmMarriage}
                  className="flex-1 h-11 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    color: '#1A0F0A',
                  }}
                >
                  确认联姻
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result overlay */}
      <AnimatePresence>
        {showResult && selectedCandidate && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: easeOutBack, delay: 0.2 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${RARITY_COLORS[selectedCandidate.rarity].glow}, transparent 70%)`,
                  border: `3px solid ${RARITY_COLORS[selectedCandidate.rarity].border}`,
                  boxShadow: `0 0 40px ${RARITY_COLORS[selectedCandidate.rarity].glow}`,
                }}
              >
                <Heart size={36} className="text-[#FF1744]" />
              </div>
              <h2 className="text-3xl font-bold text-[#FFD700] font-playfair">
                联姻成功！
              </h2>
              <p className="text-lg text-white font-playfair">
                {selectedCandidate.name} 加入了家族
              </p>
              <motion.p
                className="text-2xl font-bold text-[#00E676] font-bebas"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                +£{selectedCandidate.assetBonus.toLocaleString()} 嫁妆
              </motion.p>
              <div className="flex gap-4 mt-2">
                <motion.span
                  className="text-sm text-[#FF6F00]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  声望 +{selectedCandidate.reputationBonus}
                </motion.span>
                <motion.span
                  className="text-sm text-[#00E676]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  暴击 +{(selectedCandidate.critBonus * 100).toFixed(0)}%
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
