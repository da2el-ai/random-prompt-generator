export class GenerationGroup {
  private container: HTMLElement;
  private resultTextarea!: HTMLTextAreaElement;
  private outputCountInput!: HTMLInputElement;
  private escapeParenthesesCheckbox!: HTMLInputElement;
  private replaceSpacesCheckbox!: HTMLInputElement;
  private artistPrefixCheckbox!: HTMLInputElement;
  private insertBlankLinesCheckbox!: HTMLInputElement;
  private generateButton!: HTMLButtonElement;
  private copyButton!: HTMLButtonElement;
  private clearButton!: HTMLButtonElement;
  private generateCallback?: () => void;

  constructor(generateCallback?: () => void) {
    this.generateCallback = generateCallback;
    this.container = this.createGenerationGroup();
  }

  private createGenerationGroup(): HTMLElement {
    const section = document.createElement('section');
    section.className = 'mb-6 border border-gray-300 rounded-lg overflow-hidden bg-white';

    const content = document.createElement('div');
    content.className = 'p-4 grid grid-cols-1 lg:grid-cols-2 gap-4';

    // 左側：生成結果
    const leftSection = document.createElement('div');
    const resultLabel = document.createElement('label');
    resultLabel.className = 'block text-sm font-medium text-gray-700 mb-2';
    resultLabel.textContent = '生成結果';

    this.resultTextarea = document.createElement('textarea');
    this.resultTextarea.className = 'w-full h-48 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500';
    this.resultTextarea.placeholder = '生成されたプロンプトがここに表示されます...';
    this.resultTextarea.readOnly = true;

    this.copyButton = document.createElement('button');
    this.copyButton.className = 'mt-2 mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors';
    this.copyButton.textContent = '生成結果をコピー';
    this.copyButton.addEventListener('click', () => this.copyToClipboard());

    this.clearButton = document.createElement('button');
    this.clearButton.className = 'mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors';
    this.clearButton.textContent = '生成結果を消去';
    this.clearButton.addEventListener('click', () => this.clearResult());

    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(this.copyButton);
    buttonContainer.appendChild(this.clearButton);

    leftSection.appendChild(resultLabel);
    leftSection.appendChild(this.resultTextarea);
    leftSection.appendChild(buttonContainer);

    // 右側：オプション
    const rightSection = document.createElement('div');
    rightSection.className = 'space-y-4';

    // 出力数
    const outputCountDiv = document.createElement('div');
    const outputCountLabel = document.createElement('label');
    outputCountLabel.className = 'block text-sm font-medium text-gray-700 mb-1';
    outputCountLabel.textContent = '出力数';

    this.outputCountInput = document.createElement('input');
    this.outputCountInput.type = 'number';
    this.outputCountInput.value = '5';
    this.outputCountInput.min = '1';
    this.outputCountInput.max = '20';
    this.outputCountInput.className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500';

    outputCountDiv.appendChild(outputCountLabel);
    outputCountDiv.appendChild(this.outputCountInput);

    // チェックボックス群
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'space-y-3';

    // ()エスケープ
    const escapeDiv = document.createElement('div');
    escapeDiv.className = 'flex items-center';
    this.escapeParenthesesCheckbox = document.createElement('input');
    this.escapeParenthesesCheckbox.type = 'checkbox';
    this.escapeParenthesesCheckbox.id = 'escape-parentheses';
    this.escapeParenthesesCheckbox.className = 'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded';

    const escapeLabel = document.createElement('label');
    escapeLabel.htmlFor = 'escape-parentheses';
    escapeLabel.className = 'ml-2 text-sm text-gray-700';
    escapeLabel.innerHTML = '<code>()</code>を<code>\\(\\)</code>に変換';

    escapeDiv.appendChild(this.escapeParenthesesCheckbox);
    escapeDiv.appendChild(escapeLabel);

    // 空白変換
    const spacesDiv = document.createElement('div');
    spacesDiv.className = 'flex items-center';
    this.replaceSpacesCheckbox = document.createElement('input');
    this.replaceSpacesCheckbox.type = 'checkbox';
    this.replaceSpacesCheckbox.id = 'replace-spaces';
    this.replaceSpacesCheckbox.className = 'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded';

    const spacesLabel = document.createElement('label');
    spacesLabel.htmlFor = 'replace-spaces';
    spacesLabel.className = 'ml-2 text-sm text-gray-700';
    spacesLabel.innerHTML = '空白を<code>_</code>に変換';

    spacesDiv.appendChild(this.replaceSpacesCheckbox);
    spacesDiv.appendChild(spacesLabel);

    // artist:プレフィックス
    const artistDiv = document.createElement('div');
    artistDiv.className = 'flex items-center';
    this.artistPrefixCheckbox = document.createElement('input');
    this.artistPrefixCheckbox.type = 'checkbox';
    this.artistPrefixCheckbox.id = 'artist-prefix';
    this.artistPrefixCheckbox.className = 'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded';

    const artistLabel = document.createElement('label');
    artistLabel.htmlFor = 'artist-prefix';
    artistLabel.className = 'ml-2 text-sm text-gray-700';
    artistLabel.innerHTML = 'タグの先頭に<code>artist:</code>を付与';

    artistDiv.appendChild(this.artistPrefixCheckbox);
    artistDiv.appendChild(artistLabel);

    // 空行挿入
    const blankLinesDiv = document.createElement('div');
    blankLinesDiv.className = 'flex items-center';
    this.insertBlankLinesCheckbox = document.createElement('input');
    this.insertBlankLinesCheckbox.type = 'checkbox';
    this.insertBlankLinesCheckbox.id = 'insert-blank-lines';
    this.insertBlankLinesCheckbox.className = 'h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded';
    this.insertBlankLinesCheckbox.checked = true; // デフォルトはON

    const blankLinesLabel = document.createElement('label');
    blankLinesLabel.htmlFor = 'insert-blank-lines';
    blankLinesLabel.className = 'ml-2 text-sm text-gray-700';
    blankLinesLabel.textContent = '生成結果に空行を挿入';

    blankLinesDiv.appendChild(this.insertBlankLinesCheckbox);
    blankLinesDiv.appendChild(blankLinesLabel);

    checkboxDiv.appendChild(escapeDiv);
    checkboxDiv.appendChild(spacesDiv);
    checkboxDiv.appendChild(artistDiv);
    checkboxDiv.appendChild(blankLinesDiv);

    // 生成ボタン
    this.generateButton = document.createElement('button');
    this.generateButton.className = 'w-full px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium';
    this.generateButton.textContent = 'プロンプト生成';
    this.generateButton.addEventListener('click', () => this.onGenerateClick());

    rightSection.appendChild(outputCountDiv);
    rightSection.appendChild(checkboxDiv);
    rightSection.appendChild(this.generateButton);

    content.appendChild(leftSection);
    content.appendChild(rightSection);
    section.appendChild(content);

    return section;
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  private onGenerateClick(): void {
    if (this.generateCallback) {
      this.generateCallback();
    }
  }

  private async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.resultTextarea.value);
      // 一時的にボタンのテキストを変更してフィードバック
      const originalText = this.copyButton.textContent;
      this.copyButton.textContent = 'コピーしました！';
      this.copyButton.className = this.copyButton.className.replace('bg-blue-500 hover:bg-blue-600', 'bg-green-500 hover:bg-green-600');
      
      setTimeout(() => {
        this.copyButton.textContent = originalText;
        this.copyButton.className = this.copyButton.className.replace('bg-green-500 hover:bg-green-600', 'bg-blue-500 hover:bg-blue-600');
      }, 2000);
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error);
      alert('クリップボードへのコピーに失敗しました');
    }
  }

  private clearResult(): void {
    this.resultTextarea.value = '';
  }

  public getGenerationOptions() {
    return {
      outputCount: parseInt(this.outputCountInput.value) || 5,
      escapeParentheses: this.escapeParenthesesCheckbox.checked,
      replaceSpaces: this.replaceSpacesCheckbox.checked,
      addArtistPrefix: this.artistPrefixCheckbox.checked,
      insertBlankLines: this.insertBlankLinesCheckbox.checked
    };
  }

  public setGenerationOptions(options: any): void {
    if (typeof options.outputCount === 'number') {
      this.outputCountInput.value = options.outputCount.toString();
    }
    if (typeof options.escapeParentheses === 'boolean') {
      this.escapeParenthesesCheckbox.checked = options.escapeParentheses;
    }
    if (typeof options.replaceSpaces === 'boolean') {
      this.replaceSpacesCheckbox.checked = options.replaceSpaces;
    }
    if (typeof options.addArtistPrefix === 'boolean') {
      this.artistPrefixCheckbox.checked = options.addArtistPrefix;
    }
    if (typeof options.insertBlankLines === 'boolean') {
      this.insertBlankLinesCheckbox.checked = options.insertBlankLines;
    }
  }

  public setResult(prompts: string[]): void {
    const options = this.getGenerationOptions();
    if (options.insertBlankLines) {
      this.resultTextarea.value = prompts.join('\n\n');
    } else {
      this.resultTextarea.value = prompts.join('\n');
    }
  }
}