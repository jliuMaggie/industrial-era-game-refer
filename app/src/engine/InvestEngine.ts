import type { Investment, InvestResult, Talent } from '@/data/types';
import {
  BASE_CRIT_RATE,
  COMBO_MULTIPLIERS,
  MAX_CRIT_ENERGY,
  CASH_RESERVE_THRESHOLD,
  CASH_RESERVE_BONUS,
} from '@/data/constants';

export function calculateReturn(
  investment: Investment,
  level: number,
  amount: number,
  talents: Talent[],
  bonuses: {
    comboCount: number;
    critEnergy: number;
    cashReserve: number;
    totalAsset: number;
    marriageCritBonus: number;
  }
): InvestResult {
  const invLevel = investment.levels[Math.min(level - 1, investment.levels.length - 1)];
  
  // Calculate crit rate from all sources
  let totalCritRate = BASE_CRIT_RATE + invLevel.critRate;
  
  // Add talent bonuses
  for (const talent of talents) {
    if (talent.effect.type === 'critRate') {
      totalCritRate += talent.effect.value;
    }
  }
  
  // Add marriage bonus
  totalCritRate += bonuses.marriageCritBonus;
  
  // Add combo bonus
  const comboBonus = Math.min(bonuses.comboCount * 0.02, 0.10);
  totalCritRate += comboBonus;
  
  // Add energy bonus (when full, guarantee crit)
  const energyBonus = bonuses.critEnergy >= MAX_CRIT_ENERGY ? 1.0 : 0;
  totalCritRate += energyBonus;
  
  // Cap crit rate at 80%
  totalCritRate = Math.min(totalCritRate, 0.80);
  
  // Roll for outcome
  const roll = Math.random();
  
  // Apply talent risk reduction
  let failRate = invLevel.failRate;
  for (const talent of talents) {
    if (talent.effect.type === 'riskReduce') {
      failRate = Math.max(0, failRate - talent.effect.value);
    }
  }
  
  if (roll < failRate) {
    // Fail
    const lossPercent = 0.3 + Math.random() * 0.4;
    const lossAmount = -Math.floor(amount * lossPercent);
    return {
      outcome: 'fail',
      returnAmount: lossAmount,
      multiplier: -lossPercent,
      message: `投资失败！损失 £${Math.abs(lossAmount).toLocaleString()}`,
    };
  }
  
  if (roll < failRate + totalCritRate) {
    // Crit
    const critMultRange = invLevel.critMultiplierMax - invLevel.critMultiplierMin;
    let critMultiplier = invLevel.critMultiplierMin + Math.random() * critMultRange;
    
    // Apply combo multiplier
    const comboIndex = Math.min(bonuses.comboCount, COMBO_MULTIPLIERS.length - 1);
    const comboMult = COMBO_MULTIPLIERS[comboIndex];
    critMultiplier *= comboMult;
    
    // Apply return rate talents
    let returnRateBonus = 0;
    for (const talent of talents) {
      if (talent.effect.type === 'returnRate') {
        returnRateBonus += talent.effect.value;
      }
    }
    
    const returnAmount = Math.floor(amount * critMultiplier * (1 + returnRateBonus));
    
    return {
      outcome: 'crit',
      returnAmount,
      multiplier: critMultiplier,
      message: `暴击！${comboMult}x倍率！收益 £${returnAmount.toLocaleString()}`,
    };
  }
  
  // Normal
  let returnRate = invLevel.returnRate;
  for (const talent of talents) {
    if (talent.effect.type === 'returnRate') {
      returnRate += talent.effect.value;
    }
  }
  
  const returnAmount = Math.floor(amount * (1 + returnRate));
  
  return {
    outcome: 'normal',
    returnAmount,
    multiplier: 1 + returnRate,
    message: `投资成功！收益 £${returnAmount.toLocaleString()}`,
  };
}

export function applyCashReserveBonus(
  amount: number,
  cashReserve: number,
  totalAsset: number
): number {
  if (totalAsset <= 0) return amount;
  const reserveRatio = cashReserve / totalAsset;
  if (reserveRatio > CASH_RESERVE_THRESHOLD) {
    return Math.floor(amount * (1 + CASH_RESERVE_BONUS));
  }
  return amount;
}

export function canUpgrade(
  investment: Investment,
  currentLevel: number,
  playerAsset: number
): boolean {
  if (currentLevel >= 7) return false;
  const nextLevel = investment.levels[currentLevel];
  if (!nextLevel) return false;
  return playerAsset >= nextLevel.minInvest;
}

export function getUpgradeCost(investment: Investment, currentLevel: number): number {
  if (currentLevel >= 7) return Infinity;
  const nextLevel = investment.levels[currentLevel];
  return nextLevel ? nextLevel.minInvest : Infinity;
}
