import type { Era, Rarity } from './types';

export const ERA_CONFIG: Record<Era, {
  name: string;
  subtitle: string;
  startYear: number;
  endYear: number;
  themeColor: string;
  accentColor: string;
  bgColor: string;
  description: string;
}> = {
  1: {
    name: '第一次工业革命',
    subtitle: '蒸汽与纺织',
    startYear: 1760,
    endYear: 1840,
    themeColor: '#8B4513',
    accentColor: '#FFD700',
    bgColor: '#1A0F0A',
    description: '蒸汽动力 +15%',
  },
  2: {
    name: '第二次工业革命',
    subtitle: '钢铁与电气',
    startYear: 1870,
    endYear: 1914,
    themeColor: '#4682B4',
    accentColor: '#C0C0C0',
    bgColor: '#0A121A',
    description: '电气时代 +20%',
  },
  3: {
    name: '第三次工业革命',
    subtitle: '信息与电子',
    startYear: 1960,
    endYear: 1990,
    themeColor: '#2E8B57',
    accentColor: '#00FF7F',
    bgColor: '#0A1A0F',
    description: '数字革命 +25%',
  },
  4: {
    name: '第四次工业革命',
    subtitle: '智能与数据',
    startYear: 2010,
    endYear: 2025,
    themeColor: '#6A5ACD',
    accentColor: '#E0B0FF',
    bgColor: '#0F0A1A',
    description: 'AI智能 +30%',
  },
};

export const RARITY_COLORS: Record<Rarity, {
  text: string;
  bg: string;
  border: string;
  glow: string;
}> = {
  common: {
    text: '#A0A0A0',
    bg: 'rgba(160,160,160,0.15)',
    border: '#D0D0D0',
    glow: 'rgba(160,160,160,0.3)',
  },
  rare: {
    text: '#4169E1',
    bg: 'rgba(65,105,225,0.15)',
    border: '#4169E1',
    glow: 'rgba(65,105,225,0.4)',
  },
  epic: {
    text: '#9932CC',
    bg: 'rgba(153,50,204,0.15)',
    border: '#9932CC',
    glow: 'rgba(153,50,204,0.5)',
  },
  legendary: {
    text: '#FFD700',
    bg: 'rgba(255,215,0,0.15)',
    border: '#FFD700',
    glow: 'rgba(255,215,0,0.6)',
  },
};

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export const BASE_CRIT_RATE = 0.08;
export const MAX_CRIT_ENERGY = 100;
export const CRIT_ENERGY_PER_FAIL = 15;
export const COMBO_MULTIPLIERS = [1, 3, 5, 8, 12, 16, 20];
export const CASH_RESERVE_THRESHOLD = 0.5;
export const CASH_RESERVE_BONUS = 0.1;
export const INITIAL_ASSET = 10000;
export const REPUTATION_START = 100;
export const MAX_INVESTMENT_SLOTS = 5;
export const MAX_TURNS_PER_ERA = 10;
export const ERA_TRANSITION_ASSET_MULTIPLIER = 0.3;
export const VICTORY_ASSET_TARGET = 1000000000000; // 1 trillion
export const GAME_OVER_ASSET_THRESHOLD = 100;

export const ERA_YEAR_RANGES: Record<Era, [number, number]> = {
  1: [1760, 1840],
  2: [1870, 1914],
  3: [1960, 1990],
  4: [2010, 2025],
};

export const START_YEAR_BY_ERA: Record<Era, number> = {
  1: 1837,
  2: 1890,
  3: 1975,
  4: 2020,
};
