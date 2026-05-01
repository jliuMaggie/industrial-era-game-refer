import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GameState, GameAction, AIFamilyState, FamilyState, Era } from '@/data/types';
import { AI_FAMILIES } from '@/data/aiFamilies';
import { ACHIEVEMENTS } from '@/data/achievements';
import { START_YEAR_BY_ERA, INITIAL_ASSET, REPUTATION_START, MAX_TURNS_PER_ERA, VICTORY_ASSET_TARGET, GAME_OVER_ASSET_THRESHOLD } from '@/data/constants';
import { simulateAIFamilies } from './AISystem';

function createInitialAIFamilies(): AIFamilyState[] {
  return AI_FAMILIES.map(ai => ({
    familyId: ai.id,
    name: ai.name,
    color: ai.color,
    asset: ai.baseAsset,
    reputation: 100,
    trend: 'stable' as const,
  }));
}

export function createInitialPlayer(familyName: string): FamilyState {
  return {
    id: 'player',
    name: familyName,
    asset: INITIAL_ASSET,
    reputation: REPUTATION_START,
    cashReserve: INITIAL_ASSET,
    investments: [],
    heir: null,
    marriages: [],
    critEnergy: 0,
    comboCount: 0,
  };
}

export function createInitialState(familyName: string): GameState {
  const aiFamilies = createInitialAIFamilies();
  return {
    currentYear: START_YEAR_BY_ERA[1],
    currentEra: 1 as Era,
    turn: 1,
    maxTurnsPerEra: MAX_TURNS_PER_ERA,
    player: createInitialPlayer(familyName),
    aiFamilies,
    ranking: ['player', ...AI_FAMILIES.map(a => a.id)].sort(() => Math.random() - 0.5),
    comboCount: 0,
    critEnergy: 0,
    gameOver: false,
    victory: false,
    activeCrises: [],
    activeOpportunities: [],
    logs: [],
    achievements: ACHIEVEMENTS.map(a => ({ ...a })),
    soundEnabled: true,
    settings: {
      animations: true,
      particles: true,
    },
  };
}

function updateRanking(state: GameState): string[] {
  const allFamilies = [
    { id: 'player', asset: state.player.asset },
    ...state.aiFamilies.map(ai => ({ id: ai.familyId, asset: ai.asset })),
  ];
  allFamilies.sort((a, b) => b.asset - a.asset);
  return allFamilies.map(f => f.id);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return createInitialState(action.payload.familyName);
    }

    case 'INVEST': {
      const { investmentId, amount, outcome, returnAmount } = action.payload;
      const invIndex = state.player.investments.findIndex(i => i.investmentId === investmentId);
      
      let newInvestments = [...state.player.investments];
      if (invIndex >= 0) {
        const existing = { ...newInvestments[invIndex] };
        existing.totalInvested += amount;
        existing.totalReturned += returnAmount;
        existing.experience += outcome === 'crit' ? 3 : outcome === 'normal' ? 1 : 0;
        newInvestments[invIndex] = existing;
      } else {
        newInvestments.push({
          investmentId,
          level: 1,
          totalInvested: amount,
          totalReturned: returnAmount,
          experience: outcome === 'crit' ? 3 : outcome === 'normal' ? 1 : 0,
        });
      }

      const newAsset = state.player.asset + returnAmount;
      const newCombo = outcome === 'crit' ? state.comboCount + 1 : 0;
      const newCritEnergy = outcome === 'crit'
        ? 0
        : Math.min(100, state.critEnergy + 15);

      const newPlayer = {
        ...state.player,
        asset: Math.max(GAME_OVER_ASSET_THRESHOLD, newAsset),
        cashReserve: Math.max(0, state.player.cashReserve - amount + returnAmount),
        investments: newInvestments,
        critEnergy: newCritEnergy,
        comboCount: newCombo,
      };

      const newState = {
        ...state,
        player: newPlayer,
        comboCount: newCombo,
        critEnergy: newCritEnergy,
      };

      return { ...newState, ranking: updateRanking(newState) };
    }

    case 'UPGRADE_INVEST': {
      const { investmentId } = action.payload;
      const newInvestments = state.player.investments.map(inv => {
        if (inv.investmentId === investmentId && inv.level < 7) {
          return { ...inv, level: inv.level + 1 };
        }
        return inv;
      });
      return {
        ...state,
        player: { ...state.player, investments: newInvestments },
      };
    }

    case 'END_YEAR': {
      const newTurn = state.turn + 1;
      const yearRange = state.currentEra === 1 ? [1760, 1840]
        : state.currentEra === 2 ? [1870, 1914]
        : state.currentEra === 3 ? [1960, 1990]
        : [2010, 2025];
      const yearProgress = (newTurn - 1) / MAX_TURNS_PER_ERA;
      const newYear = Math.floor(yearRange[0] + (yearRange[1] - yearRange[0]) * yearProgress);

      const updatedAIs = simulateAIFamilies(state.aiFamilies, state.currentEra);

      const newState = {
        ...state,
        turn: newTurn,
        currentYear: newYear,
        aiFamilies: updatedAIs,
        player: {
          ...state.player,
          asset: state.player.asset + state.player.investments.reduce((sum, inv) => {
            return sum + inv.totalReturned * 0.1;
          }, 0),
        },
      };

      return { ...newState, ranking: updateRanking(newState) };
    }

    case 'TRIGGER_EVENT': {
      return { ...state };
    }

    case 'MARRY': {
      return { ...state };
    }

    case 'TRAIN_HEIR': {
      return { ...state };
    }

    case 'NEXT_ERA': {
      const nextEra = (state.currentEra + 1) as Era;
      if (nextEra > 4) {
        return {
          ...state,
          gameOver: true,
          victory: state.player.asset >= VICTORY_ASSET_TARGET,
        };
      }
      return {
        ...state,
        currentEra: nextEra,
        currentYear: START_YEAR_BY_ERA[nextEra],
        turn: 1,
        player: {
          ...state.player,
          asset: Math.floor(state.player.asset * 0.3),
          cashReserve: Math.floor(state.player.cashReserve * 0.3),
          investments: [],
        },
        activeCrises: [],
        activeOpportunities: [],
      };
    }

    case 'GAME_OVER': {
      return {
        ...state,
        gameOver: true,
        victory: action.payload.victory,
      };
    }

    case 'TOGGLE_SOUND': {
      return { ...state, soundEnabled: !state.soundEnabled };
    }

    case 'UPDATE_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } };
    }

    case 'ADD_LOG': {
      return {
        ...state,
        logs: [action.payload, ...state.logs].slice(0, 20),
      };
    }

    case 'LOAD_SAVE': {
      return { ...action.payload };
    }

    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null!, () => createInitialState('无名'));

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameProvider');
  }
  return context;
}
