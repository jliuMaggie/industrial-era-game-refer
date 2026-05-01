import type { AIFamily } from './types';

export const AI_FAMILIES: AIFamily[] = [
  {
    id: 'rothschild',
    name: '罗斯柴尔德家族',
    color: '#FFD700',
    style: 'aggressive',
    baseAsset: 5000000,
    riskTolerance: 0.8,
  },
  {
    id: 'rockefeller',
    name: '洛克菲勒家族',
    color: '#4682B4',
    style: 'balanced',
    baseAsset: 4500000,
    riskTolerance: 0.5,
  },
  {
    id: 'morgan',
    name: '摩根家族',
    color: '#C0C0C0',
    style: 'conservative',
    baseAsset: 4000000,
    riskTolerance: 0.3,
  },
  {
    id: 'ford',
    name: '福特家族',
    color: '#2E8B57',
    style: 'opportunist',
    baseAsset: 3000000,
    riskTolerance: 0.6,
  },
  {
    id: 'vanderbilt',
    name: '范德比尔特家族',
    color: '#8B4513',
    style: 'aggressive',
    baseAsset: 3500000,
    riskTolerance: 0.7,
  },
];
