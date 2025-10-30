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
      // const tags = this.parseTagsFromText(group.tags);
      const tags = group.tags;
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
    let prompt = selectedTags.join(', ');
    
    // 末尾にカンマを追加
    if (options.addTrailingComma) {
      prompt += ',';
    }
    
    return prompt;
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
  static parseTagsFromText(tagsText: string): string[] {
    return tagsText
      .split('\n')
      .map(line => {
        // 前後の空白とカンマを同時に削除
        line = line.replace(/^[\s,]+/, ''); // 先頭の空白とカンマを削除
        line = line.replace(/[\s,]+$/, ''); // 末尾の空白とカンマを削除
        console.log(line);
        return line;
      })
      .filter(line => line.length > 0);
  }
}
