// ==========================================
// 游戏核心类型定义
// ==========================================

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type RiskLevel = 1 | 2 | 3 | 4 | 5;
export type EraType = 'first' | 'second' | 'third' | 'fourth';
export type InvestCategory = 'industry' | 'finance' | 'technology' | 'estate' | 'commerce' | 'energy' | 'transport';
export type Gender = 'male' | 'female';

// 投资物等级定义（肉鸽升级路线）
export interface InvestLevel {
  level: number;           // 1-7
  name: string;            // 等级名称
  icon: string;
  description: string;
  baseReturnRate: number;  // 基础收益率
  critRate: number;        // 暴击率
  critMultiplier: [number, number]; // 暴击倍率范围
  failRate: number;        // 失败率
  lossRange: [number, number]; // 失败损失范围(投资额的%)
  investAmountRange: [number, number]; // 投资金额范围
  specialEffects: string[];
  requiredPrevLevel?: number; // 需要前置等级
  unlockCondition?: string; // 解锁条件
}

// 投资物定义（含完整升级路线）
export interface Investment {
  id: string;
  name: string;
  category: InvestCategory;
  rarity: Rarity;
  era: EraType;
  icon: string;
  description: string;
  flavorText: string;
  riskLevel: RiskLevel;
  levels: InvestLevel[];   // 5-7个等级
  maxLevel: number;
  // 专精路线
  specialization?: {
    name: string;
    description: string;
    bonus: string;
  };
}

// 危机定义
export interface Crisis {
  id: string;
  era: EraType;
  name: string;
  year: number;
  icon: string;
  description: string;
  flavorText: string;
  effects: {
    type: 'reduce_all' | 'reduce_category' | 'reduce_ranking' | 'special';
    value: number;
    target?: InvestCategory | string;
    condition?: string;
  }[];
  probability: number; // 触发权重
}

// 机遇定义
export interface Opportunity {
  id: string;
  era: EraType;
  name: string;
  icon: string;
  description: string;
  flavorText: string;
  effects: {
    type: 'boost_all' | 'boost_category' | 'unlock_invest' | 'reputation' | 'special';
    value: number;
    target?: InvestCategory | string;
  }[];
  probability: number;
}

// AI家族定义
export interface AIFamily {
  id: string;
  name: string;
  icon: string;
  style: string;
  riskPreference: 'conservative' | 'moderate' | 'aggressive';
  specialAbility: string;
  specialBonus: {
    type: string;
    value: number;
  };
  initialAsset: number;
  color: string;
}

// 联姻对象定义
export interface MarriageCandidate {
  id: string;
  name: string;
  gender: Gender;
  rarity: Rarity;
  era: EraType;
  icon: string;
  dowryRange: [number, number];
  dowryBonus: string;
  effects: {
    type: string;
    value: number;
    description: string;
  }[];
  description: string;
  flavorText: string;
  specialEvent?: string;
}

// 继承人天赋定义
export interface HeirTalent {
  id: string;
  name: string;
  rarity: Rarity;
  icon: string;
  description: string;
  flavorText: string;
  effects: {
    type: string;
    value: number;
  }[];
  inheritMultiplier: number;
  inheritLine: string;
  warning?: string;
}

// 成就定义
export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  flavorText: string;
  condition: string;
  era?: EraType;
  hidden?: boolean;
}

// 时代定义
export interface Era {
  id: EraType;
  name: string;
  years: [number, number];
  description: string;
  features: string[];
  assetThreshold: number;
  reputationThreshold: number;
  requiredInvestments?: {
    category: InvestCategory;
    minCount: number;
  }[];
  crisisPool: Crisis[];
  opportunityPool: Opportunity[];
  investPool: Investment[];
  marriagePool: MarriageCandidate[];
  transitionText: {
    title: string;
    lines: string[];
    opportunities: string[];
  };
}

// 游戏状态
export interface GameState {
  currentYear: number;
  currentEra: EraType;
  playerFamily: {
    name: string;
    asset: number;
    reputation: number;
    members: FamilyMember[];
    currentHeir?: Heir;
    talents: string[];
    achievements: string[];
    activeInvestments: ActiveInvestment[];
    cashReserve: number;
    totalInvested: number;
  };
  aiFamilies: AIFamilyState[];
  ranking: string[]; // family IDs in rank order
  turn: number;
  comboCount: number;
  critEnergy: number;
  gameOver: boolean;
  victory: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  role: 'patriarch' | 'heir' | 'member';
  health: number;
  talent?: string;
}

export interface Heir {
  memberId: string;
  talentId: string;
  trainingFocus?: string;
  trainingInvestment: number;
}

export interface ActiveInvestment {
  investId: string;
  level: number;
  amount: number;
  yearInvested: number;
  totalReturn: number;
}

export interface AIFamilyState {
  familyId: string;
  asset: number;
  reputation: number;
  activeInvestments: string[];
  alive: boolean;
}

export interface InvestAction {
  type: 'single' | 'all_in';
  investId: string;
  targetLevel: number;
  amount: number;
}

export interface EventOutcome {
  type: 'crit' | 'normal' | 'fail';
  multiplier: number;
  returnAmount: number;
  message: string;
}
