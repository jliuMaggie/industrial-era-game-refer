export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type Era = 1 | 2 | 3 | 4;

export type InvestmentType = 'industry' | 'finance' | 'technology' | 'logistics' | 'energy';

export type AIStyle = 'aggressive' | 'balanced' | 'conservative' | 'opportunist';

export interface InvestmentLevel {
  level: number;
  name: string;
  returnRate: number;
  critRate: number;
  failRate: number;
  minInvest: number;
  maxInvest: number;
  critMultiplierMin: number;
  critMultiplierMax: number;
  description: string;
}

export interface Investment {
  id: string;
  name: string;
  description: string;
  type: InvestmentType;
  rarity: Rarity;
  era: Era;
  icon: string;
  levels: InvestmentLevel[];
  riskStars: number;
}

export interface PlayerInvestment {
  investmentId: string;
  level: number;
  totalInvested: number;
  totalReturned: number;
  experience: number;
}

export interface Crisis {
  id: string;
  name: string;
  description: string;
  era: Era;
  assetLossPercent: number;
  reputationLoss: number;
  duration: number;
}

export interface Opportunity {
  id: string;
  name: string;
  description: string;
  era: Era;
  assetBonusPercent: number;
  reputationBonus: number;
}

export interface AIFamily {
  id: string;
  name: string;
  color: string;
  style: AIStyle;
  baseAsset: number;
  riskTolerance: number;
}

export interface Marriage {
  id: string;
  name: string;
  title: string;
  rarity: Rarity;
  assetBonus: number;
  reputationBonus: number;
  critBonus: number;
  description: string;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  effect: {
    type: 'critRate' | 'returnRate' | 'riskReduce' | 'reputationGain';
    value: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  condition: string;
  unlocked: boolean;
}

export interface Heir {
  name: string;
  age: number;
  health: number;
  talents: Talent[];
}

export interface FamilyState {
  id: string;
  name: string;
  asset: number;
  reputation: number;
  cashReserve: number;
  investments: PlayerInvestment[];
  heir: Heir | null;
  marriages: Marriage[];
  critEnergy: number;
  comboCount: number;
}

export interface AIFamilyState {
  familyId: string;
  name: string;
  color: string;
  asset: number;
  reputation: number;
  trend: 'up' | 'down' | 'stable';
}

export interface GameLogEntry {
  id: string;
  familyName: string;
  action: string;
  timestamp: number;
}

export interface GameState {
  currentYear: number;
  currentEra: Era;
  turn: number;
  maxTurnsPerEra: number;
  player: FamilyState;
  aiFamilies: AIFamilyState[];
  ranking: string[];
  comboCount: number;
  critEnergy: number;
  gameOver: boolean;
  victory: boolean;
  activeCrises: Crisis[];
  activeOpportunities: Opportunity[];
  logs: GameLogEntry[];
  achievements: Achievement[];
  soundEnabled: boolean;
  settings: {
    animations: boolean;
    particles: boolean;
  };
}

export type GameAction =
  | { type: 'START_GAME'; payload: { familyName: string } }
  | { type: 'INVEST'; payload: { investmentId: string; amount: number; outcome: 'crit' | 'normal' | 'fail'; returnAmount: number; multiplier: number } }
  | { type: 'UPGRADE_INVEST'; payload: { investmentId: string } }
  | { type: 'END_YEAR' }
  | { type: 'TRIGGER_EVENT' }
  | { type: 'MARRY'; payload: { marriageId: string } }
  | { type: 'TRAIN_HEIR'; payload: { talentId: string; amount: number } }
  | { type: 'NEXT_ERA' }
  | { type: 'GAME_OVER'; payload: { victory: boolean } }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameState['settings']> }
  | { type: 'ADD_LOG'; payload: GameLogEntry }
  | { type: 'LOAD_SAVE'; payload: GameState };

export interface InvestResult {
  outcome: 'crit' | 'normal' | 'fail';
  returnAmount: number;
  multiplier: number;
  message: string;
}
