import type { GameState } from '@/data/types';

const SAVE_KEY = 'dynasty_save';
const BEST_ASSET_KEY = 'dynasty_best_asset';
const UNLOCKED_ACHIEVEMENTS_KEY = 'dynasty_achievements';

export function saveGame(state: GameState): void {
  try {
    const saveData = {
      ...state,
      saveTime: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    
    // Update best asset record
    const currentBest = getBestAsset();
    if (state.player.asset > currentBest) {
      localStorage.setItem(BEST_ASSET_KEY, state.player.asset.toString());
    }
  } catch {
    // Storage full or unavailable
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function getBestAsset(): number {
  try {
    const raw = localStorage.getItem(BEST_ASSET_KEY);
    if (!raw) return 0;
    return parseInt(raw, 10) || 0;
  } catch {
    return 0;
  }
}

export function getSaveTime(): number | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.saveTime || null;
  } catch {
    return null;
  }
}

export function getUnlockedAchievements(): string[] {
  try {
    const raw = localStorage.getItem(UNLOCKED_ACHIEVEMENTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function unlockAchievement(achievementId: string): void {
  try {
    const unlocked = getUnlockedAchievements();
    if (!unlocked.includes(achievementId)) {
      unlocked.push(achievementId);
      localStorage.setItem(UNLOCKED_ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
    }
  } catch {
    // ignore
  }
}
