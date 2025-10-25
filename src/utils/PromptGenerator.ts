import { TagGroup, GenerationOptions } from '../types.js';
import { 
  applyWeightToTag, 
  transformTag, 
  getRandomFloat, 
  getRandomInt, 
  getRandomElements 
} from './tagProcessor.js';

export class PromptGenerator {
  /**
   * 単一のプロンプトを生成
   */
  static generateSinglePrompt(
    tagGroups: TagGroup[], 
    options: GenerationOptions
  ): string {
    const selectedTags: string[] = [];

    // 各タググループから必要な数のタグを選択
    for (const group of tagGroups) {
      const tags = this.parseTagsFromText(group.tags);
      if (tags.length === 0) continue;

      // ランダムな個数を決定
      const count = getRandomInt(group.minCount, group.maxCount);
      if (count === 0) continue;

      // ランダムにタグを選択
      const selectedGroupTags = getRandomElements(tags, count);

      // 各タグを変換してから重みを付与
      for (const tag of selectedGroupTags) {
        // まずタグを変換
        const transformedTag = transformTag(tag.trim(), options);
        // 次に重みを付与
        const weight = getRandomFloat(group.minWeight, group.maxWeight);
        const weightedTag = applyWeightToTag(transformedTag, weight);
        selectedTags.push(weightedTag);
      }
    }

    // カンマ区切りで結合
    return selectedTags.join(', ');
  }

  /**
   * 複数のプロンプトを生成
   */
  static generatePrompts(
    tagGroups: TagGroup[], 
    options: GenerationOptions
  ): string[] {
    const prompts: string[] = [];

    for (let i = 0; i < options.outputCount; i++) {
      const prompt = this.generateSinglePrompt(tagGroups, options);
      prompts.push(prompt);
    }

    return prompts;
  }

  /**
   * テキストエリアの内容からタグの配列を作成
   */
  private static parseTagsFromText(tagsText: string[]): string[] {
    if (Array.isArray(tagsText)) {
      return tagsText;
    }
    
    // 文字列の場合は改行で分割
    const text = tagsText as unknown as string;
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
}