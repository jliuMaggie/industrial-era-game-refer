// ==========================================
// 游戏数值常量
// ==========================================

export const GAME_CONSTANTS = {
  // 初始状态
  INITIAL_ASSET: 10000,
  INITIAL_REPUTATION: 100,
  
  // 暴击系统
  BASE_CRIT_RATE: 0.12,
  COMBO_BONUS_MULTIPLIER: 1,
  MAX_COMBO: 10,
  CRIT_ENERGY_PER_MISS: 10,
  CRIT_ENERGY_MAX: 100,
  CRIT_ENERGY_BONUS: 0.5, // 满能量时暴击率加成
  
  // 排名
  AI_FAMILY_COUNT: 5,
  
  // 时代
  ERA_TURNS: 10, // 每个时代10轮投资
  
  // 危机
  CRISIS_MIN_PER_ERA: 1,
  CRISIS_MAX_PER_ERA: 3,
  
  // 机遇
  OPPORTUNITY_MIN_PER_ERA: 1,
  OPPORTUNITY_MAX_PER_ERA: 3,
  
  // 联姻
  MARRIAGE_REFRESH_COST: 1000,
  MARRIAGE_MAX_REFRESH: 3,
  
  // 培养
  TRAINING_COST_MIN: 1000,
  TRAINING_COST_MAX: 5000,
  
  // 现金储备效果
  CASH_RESERVE_THRESHOLD: 0.5,
  CASH_RESERVE_BONUS: 0.2,
  
  // 传承
  GENERATION_TRANSFER_PENALTY: 0.1,
  
  // 胜利条件
  VICTORY_ASSET: 1_0000_0000_0000, // 1万亿
  VICTORY_REPUTATION: 10000,
};

// 时代配置
export const ERA_CONFIG = {
  first: {
    name: '第一次工业革命',
    subtitle: '蒸汽与纺织',
    years: [1760, 1840] as [number, number],
    assetThreshold: 1000_0000, // 1千万
    reputationThreshold: 500,
    currency: '英镑',
    color: '#8B4513',
  },
  second: {
    name: '第二次工业革命',
    subtitle: '电气与钢铁',
    years: [1870, 1914] as [number, number],
    assetThreshold: 1_0000_0000, // 1亿
    reputationThreshold: 2000,
    currency: '英镑',
    color: '#4682B4',
  },
  third: {
    name: '第三次工业革命',
    subtitle: '电子与信息',
    years: [1945, 2000] as [number, number],
    assetThreshold: 10_0000_0000, // 10亿
    reputationThreshold: 8000,
    currency: '美元',
    color: '#2E8B57',
  },
  fourth: {
    name: '第四次工业革命',
    subtitle: '智能与数字',
    years: [2000, 2026] as [number, number],
    assetThreshold: 50_0000_0000, // 50亿
    reputationThreshold: 10000,
    currency: '美元',
    color: '#6A5ACD',
  },
};

// 品质配置
export const RARITY_CONFIG = {
  common: {
    name: '普通',
    color: '#A0A0A0',
    bgColor: '#F5F5F5',
    borderColor: '#D0D0D0',
    critRate: 0.12,
    failRate: 0.08,
    critMultiplier: [1, 4] as [number, number],
    lossRange: [0.15, 0.25] as [number, number],
    probability: 0.60,
  },
  rare: {
    name: '稀有',
    color: '#4169E1',
    bgColor: '#E8F0FE',
    borderColor: '#4169E1',
    critRate: 0.22,
    failRate: 0.12,
    critMultiplier: [4, 8] as [number, number],
    lossRange: [0.15, 0.30] as [number, number],
    probability: 0.25,
  },
  epic: {
    name: '史诗',
    color: '#9932CC',
    bgColor: '#F3E8FF',
    borderColor: '#9932CC',
    critRate: 0.35,
    failRate: 0.16,
    critMultiplier: [6, 15] as [number, number],
    lossRange: [0.20, 0.35] as [number, number],
    probability: 0.12,
  },
  legendary: {
    name: '传说',
    color: '#FFD700',
    bgColor: '#FFF8DC',
    borderColor: '#FFD700',
    critRate: 0.50,
    failRate: 0.12,
    critMultiplier: [12, 30] as [number, number],
    lossRange: [0.15, 0.30] as [number, number],
    probability: 0.03,
  },
};

// 投资类别配置
export const CATEGORY_CONFIG = {
  industry: { name: '工业', icon: '🏭', color: '#8B4513' },
  finance: { name: '金融', icon: '🏦', color: '#FFD700' },
  technology: { name: '科技', icon: '🔬', color: '#00BFFF' },
  estate: { name: '不动产', icon: '🏠', color: '#228B22' },
  commerce: { name: '商业', icon: '💼', color: '#FF6347' },
  energy: { name: '能源', icon: '⚡', color: '#FFA500' },
  transport: { name: '交通', icon: '🚂', color: '#4682B4' },
};

// 风险等级配置
export const RISK_CONFIG = {
  1: { name: '极低', stars: '⭐', color: '#228B22' },
  2: { name: '低', stars: '⭐⭐', color: '#32CD32' },
  3: { name: '中等', stars: '⭐⭐⭐', color: '#FFD700' },
  4: { name: '高', stars: '⭐⭐⭐⭐', color: '#FF8C00' },
  5: { name: '极高', stars: '⭐⭐⭐⭐⭐', color: '#DC143C' },
};
