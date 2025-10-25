import { AppState, TagGroup, GenerationOptions } from '../types.js';

const STORAGE_KEY = 'random-prompt-generator-state';

/**
 * LocalStorageからアプリケーションの状態を読み込み
 */
export function loadAppState(): AppState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored) as AppState;
  } catch (error) {
    console.warn('LocalStorageからの読み込みに失敗しました:', error);
    return null;
  }
}

/**
 * アプリケーションの状態をLocalStorageに保存
 */
export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('LocalStorageへの保存に失敗しました:', error);
  }
}

/**
 * デフォルトのアプリケーション状態を作成
 */
export function createDefaultState(): AppState {
  const createDefaultTagGroup = (minCount = 0): TagGroup => ({
    tags: [],
    minCount,
    maxCount: 3,
    minWeight: 0.5,
    maxWeight: 1.3
  });

  const defaultOptions: GenerationOptions = {
    outputCount: 5,
    escapeParentheses: false,
    spaceConversion: 'none',
    addArtistPrefix: false,
    insertBlankLines: true,
    addTrailingComma: false
  };

  return {
    tagGroup1: createDefaultTagGroup(1), // タググループ1は最小個数1
    tagGroup2: createDefaultTagGroup(0),
    tagGroup3: createDefaultTagGroup(0),
    generationOptions: defaultOptions,
    generatedPrompts: []
  };
}