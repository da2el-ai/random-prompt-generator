// タグの重み設定
export interface TagWeight {
  tag: string;
  weight: number;
}

// タググループの設定
export interface TagGroup {
  tags: string[];
  minCount: number;
  maxCount: number;
  minWeight: number;
  maxWeight: number;
}

// 生成オプション
export interface GenerationOptions {
  outputCount: number;
  escapeParentheses: boolean; // ()を\(\)に変換
  replaceSpaces: boolean; // 空白を_に変換
  addArtistPrefix: boolean; // 先頭にartist:を付与
  insertBlankLines: boolean; // 生成結果に空行を挿入
}

// アプリケーションの状態
export interface AppState {
  tagGroup1: TagGroup;
  tagGroup2: TagGroup;
  tagGroup3: TagGroup;
  generationOptions: GenerationOptions;
  generatedPrompts: string[];
}