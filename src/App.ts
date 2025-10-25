import { TagGroup } from './components/TagGroup.js';
import { GenerationGroup } from './components/GenerationGroup.js';
import { PromptGenerator } from './utils/PromptGenerator.js';
import { loadAppState, saveAppState, createDefaultState } from './utils/storage.js';
import { AppState } from './types.js';

export class App {
  private container: HTMLElement;
  private tagGroups: TagGroup[] = [];
  private generationGroup: GenerationGroup;
  private appState: AppState;

  constructor(container: HTMLElement) {
    this.container = container;
    this.appState = loadAppState() || createDefaultState();
    this.generationGroup = new GenerationGroup(() => this.generatePrompts());
    this.init();
  }

  private init(): void {
    this.container.innerHTML = '';
    
    // ヘッダー
    const header = document.createElement('header');
    header.className = 'text-center mb-8';
    header.innerHTML = `
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Random Prompt Generator</h1>
      <p class="text-gray-600">画像生成AI用プロンプトをランダム生成</p>
    `;

    // メインコンテンツ
    const main = document.createElement('main');
    main.className = 'space-y-6';

    // タググループを3つ作成
    for (let i = 1; i <= 3; i++) {
      const tagGroup = new TagGroup(i, () => this.saveState());
      this.tagGroups.push(tagGroup);
      main.appendChild(tagGroup.getElement());
    }

    // 生成グループを追加
    main.appendChild(this.generationGroup.getElement());

    // フッター
    const footer = document.createElement('footer');
    footer.className = 'text-center mt-12 pt-8 border-t border-gray-200';
    footer.innerHTML = `
      <p class="text-gray-500 text-sm">
        設定は自動的にLocalStorageに保存されます
      </p>
    `;

    this.container.appendChild(header);
    this.container.appendChild(main);
    this.container.appendChild(footer);

    // 保存された状態を復元
    this.loadState();
  }

  private generatePrompts(): void {
    try {
      // 各タググループからデータを取得
      const tagGroupsData = [
        this.tagGroups[0].getTagGroupData(),
        this.tagGroups[1].getTagGroupData(),
        this.tagGroups[2].getTagGroupData()
      ];

      // 生成オプションを取得
      const generationOptions = this.generationGroup.getGenerationOptions();

      // プロンプトを生成
      const prompts = PromptGenerator.generatePrompts(tagGroupsData, generationOptions);

      // 結果を表示
      this.generationGroup.setResult(prompts);

      // 状態を保存
      this.appState.generatedPrompts = prompts;
      this.saveState();

      console.log('プロンプト生成完了:', prompts);
    } catch (error) {
      console.error('プロンプト生成中にエラーが発生しました:', error);
      alert('プロンプト生成中にエラーが発生しました');
    }
  }

  private saveState(): void {
    // 現在の状態を保存
    this.appState.tagGroup1 = this.tagGroups[0].getTagGroupData();
    this.appState.tagGroup2 = this.tagGroups[1].getTagGroupData();
    this.appState.tagGroup3 = this.tagGroups[2].getTagGroupData();
    this.appState.generationOptions = this.generationGroup.getGenerationOptions();

    saveAppState(this.appState);
  }

  private loadState(): void {
    // 保存された状態を復元
    this.tagGroups[0].setTagGroupData(this.appState.tagGroup1);
    this.tagGroups[1].setTagGroupData(this.appState.tagGroup2);
    this.tagGroups[2].setTagGroupData(this.appState.tagGroup3);
    this.generationGroup.setGenerationOptions(this.appState.generationOptions);

    if (this.appState.generatedPrompts.length > 0) {
      this.generationGroup.setResult(this.appState.generatedPrompts);
    }
  }
}