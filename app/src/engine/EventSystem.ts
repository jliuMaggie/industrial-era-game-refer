import type { Crisis, Opportunity, GameState, Era } from '@/data/types';
import { CRISES } from '@/data/crises';
import { OPPORTUNITIES } from '@/data/opportunities';
import { VICTORY_ASSET_TARGET } from '@/data/constants';

export function generateCrisis(era: Era): Crisis[] {
  const eraCrises = CRISES.filter(c => c.era === era);
  if (eraCrises.length === 0) return [];
  
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...eraCrises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateOpportunity(era: Era): Opportunity[] {
  const eraOpportunities = OPPORTUNITIES.filter(o => o.era === era);
  if (eraOpportunities.length === 0) return [];
  
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...eraOpportunities].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function applyCrisisEffects(crisis: Crisis, state: GameState): GameState {
  const assetLoss = Math.floor(state.player.asset * crisis.assetLossPercent);
  const newAsset = Math.max(100, state.player.asset - assetLoss);
  const newReputation = Math.max(0, state.player.reputation - crisis.reputationLoss);
  
  return {
    ...state,
    player: {
      ...state.player,
      asset: newAsset,
      reputation: newReputation,
    },
    activeCrises: [...state.activeCrises, crisis],
  };
}

export function applyOpportunityEffects(opportunity: Opportunity, state: GameState): GameState {
  const assetBonus = Math.floor(state.player.asset * opportunity.assetBonusPercent);
  const newAsset = state.player.asset + assetBonus;
  const newReputation = state.player.reputation + opportunity.reputationBonus;
  
  return {
    ...state,
    player: {
      ...state.player,
      asset: newAsset,
      reputation: newReputation,
    },
    activeOpportunities: [...state.activeOpportunities, opportunity],
  };
}

export function checkEraTransition(state: GameState): boolean {
  if (state.turn >= state.maxTurnsPerEra) {
    return true;
  }
  
  // Check asset threshold for early era transition
  const thresholds: Record<Era, number> = {
    1: 100000,
    2: 10000000,
    3: 1000000000,
    4: VICTORY_ASSET_TARGET,
  };
  
  return state.player.asset >= thresholds[state.currentEra];
}


