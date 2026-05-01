import type { AIFamilyState, Era } from '@/data/types';
import { AI_FAMILIES } from '@/data/aiFamilies';
import { INVESTMENTS } from '@/data/investments';

const STYLE_MULTIPLIERS: Record<string, { investRange: [number, number]; returnMult: number }> = {
  aggressive: { investRange: [0.15, 0.35], returnMult: 1.3 },
  balanced: { investRange: [0.08, 0.20], returnMult: 1.1 },
  conservative: { investRange: [0.03, 0.12], returnMult: 0.9 },
  opportunist: { investRange: [0.10, 0.30], returnMult: 1.5 },
};

export function simulateAIFamilies(
  aiFamilies: AIFamilyState[],
  currentEra: Era
): AIFamilyState[] {
  return aiFamilies.map(ai => {
    const config = AI_FAMILIES.find(a => a.id === ai.familyId);
    if (!config) return ai;

    const styleMult = STYLE_MULTIPLIERS[config.style] || STYLE_MULTIPLIERS.balanced;
    
    // Determine investment amount based on style and current asset
    const investRatio = styleMult.investRange[0] + Math.random() * (styleMult.investRange[1] - styleMult.investRange[0]);
    const investAmount = Math.floor(ai.asset * investRatio);
    
    // Find available investments for this era
    const eraInvestments = INVESTMENTS.filter(inv => inv.era === currentEra);
    if (eraInvestments.length === 0) return ai;
    
    // Pick a random investment
    const chosenInvestment = eraInvestments[Math.floor(Math.random() * eraInvestments.length)];
    const invLevel = chosenInvestment.levels[0];
    
    // Roll for outcome
    const roll = Math.random();
    let returnAmount: number;
    let trend: 'up' | 'down' | 'stable';
    
    if (roll < invLevel.failRate) {
      // Loss
      const lossPercent = 0.2 + Math.random() * 0.3;
      returnAmount = -Math.floor(investAmount * lossPercent);
      trend = 'down';
    } else if (roll < invLevel.failRate + invLevel.critRate) {
      // Crit win
      const critMult = invLevel.critMultiplierMin + Math.random() * (invLevel.critMultiplierMax - invLevel.critMultiplierMin);
      returnAmount = Math.floor(investAmount * critMult * styleMult.returnMult);
      trend = 'up';
    } else {
      // Normal
      returnAmount = Math.floor(investAmount * (1 + invLevel.returnRate) * styleMult.returnMult);
      trend = Math.random() > 0.5 ? 'up' : 'stable';
    }
    
    // Add random market fluctuation
    const marketFluctuation = (Math.random() - 0.4) * 0.05 * ai.asset;
    
    const newAsset = Math.max(100, ai.asset + returnAmount + marketFluctuation);
    
    return {
      ...ai,
      asset: Math.floor(newAsset),
      trend,
    };
  });
}

export function updateRanking(
  allFamilies: { id: string; asset: number }[]
): string[] {
  const sorted = [...allFamilies].sort((a, b) => b.asset - a.asset);
  return sorted.map(f => f.id);
}

export function generateAILog(
  _aiFamily: AIFamilyState,
  currentEra: Era
): string {
  const eraInvestments = INVESTMENTS.filter(inv => inv.era === currentEra);
  const investment = eraInvestments[Math.floor(Math.random() * eraInvestments.length)];
  if (!investment) return '正在观望市场';
  
  const actions = [
    `投资了 ${investment.name}`,
    `增持了 ${investment.name} 的股份`,
    `在 ${investment.name} 上获得了可观收益`,
    `正在研究 ${investment.name} 的投资机会`,
    `加大了对 ${investment.name} 的投入`,
  ];
  
  return actions[Math.floor(Math.random() * actions.length)];
}
