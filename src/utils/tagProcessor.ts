import { GenerationOptions } from '../types.js';

/**
 * タグに重みを付与する
 */
export function applyWeightToTag(tag: string, weight: number): string {
  if (weight === 1.0) {
    return tag;
  }
  return `(${tag}:${weight.toFixed(1)})`;
}

/**
 * タグの変換処理（エスケープ、空白変換、artist:プレフィックス）
 */
export function transformTag(tag: string, options: GenerationOptions): string {
  let transformedTag = tag;

  // artist:プレフィックスを追加
  if (options.addArtistPrefix) {
    transformedTag = `artist:${transformedTag}`;
  }

  // 空白を_に変換
  if (options.replaceSpaces) {
    transformedTag = transformedTag.replace(/\s+/g, '_');
  }

  // ()を\(\)に変換
  if (options.escapeParentheses) {
    transformedTag = transformedTag.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  return transformedTag;
}

/**
 * 指定された範囲からランダムな数値を生成
 */
export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * 指定された範囲からランダムな整数を生成
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 配列からランダムに要素を選択
 */
export function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}