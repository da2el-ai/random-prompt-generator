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
  spaceConversion: 'space-to-underscore' | 'underscore-to-space' | 'none'; // 空白変換オプション
  addArtistPrefix: boolean; // 先頭にartist:を付与
  insertBlankLines: boolean; // 生成結果に空行を挿入
  addTrailingComma: boolean; // 末尾に,を追加
}

// アプリケーションの状態
export interface AppState {
  tagGroup1: TagGroup;
  tagGroup2: TagGroup;
  tagGroup3: TagGroup;
  generationOptions: GenerationOptions;
  generatedPrompts: string[];
}

// Vue3コンポーネント用の追加型定義
export interface TagGroupProps {
  groupNumber: number;
  modelValue: TagGroup;
}

export interface TagGroupEmits {
  (e: 'update:modelValue', value: TagGroup): void;
}

export interface GenerationGroupProps {
  modelValue: GenerationOptions;
  generatedPrompts?: string[];
}

export interface GenerationGroupEmits {
  (e: 'update:modelValue', value: GenerationOptions): void;
  (e: 'generate'): void;
}