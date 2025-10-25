export class TagGroup {
  private container: HTMLElement;
  private groupNumber: number;
  private tagsTextarea!: HTMLTextAreaElement;
  private minCountSelect!: HTMLSelectElement;
  private maxCountSelect!: HTMLSelectElement;
  private minWeightInput!: HTMLInputElement;
  private maxWeightInput!: HTMLInputElement;
  private changeCallback?: () => void;

  constructor(groupNumber: number, changeCallback?: () => void) {
    this.groupNumber = groupNumber;
    this.changeCallback = changeCallback;
    this.container = this.createTagGroup();
  }

  private createTagGroup(): HTMLElement {
    const details = document.createElement('details');
    details.className = 'mb-4 border border-gray-300 rounded-lg overflow-hidden';
    details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 font-medium text-gray-700';
    summary.textContent = `タググループ${this.groupNumber}`;

    const content = document.createElement('div');
    content.className = 'p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4';

    // 左側：タグ候補
    const leftSection = document.createElement('div');
    leftSection.innerHTML = `
      <label class="block text-sm font-medium text-gray-700 mb-2">タグ候補</label>
      <p class="text-xs text-gray-500 mb-1">改行区切りで1行＝1タグ</p>
    `;

    this.tagsTextarea = document.createElement('textarea');
    this.tagsTextarea.className = 'w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    this.tagsTextarea.placeholder = '1girl\ncute\nbeautiful\nportrait\n...';
    this.tagsTextarea.addEventListener('input', () => this.onInputChange());
    leftSection.appendChild(this.tagsTextarea);

    // 右側：オプション
    const rightSection = document.createElement('div');
    rightSection.className = 'space-y-4';

    // 最小・最大個数
    const countSection = document.createElement('div');
    countSection.className = 'grid grid-cols-2 gap-4';
    
    const minCountDiv = document.createElement('div');
    minCountDiv.innerHTML = '<label class="block text-sm font-medium text-gray-700 mb-1">最小個数</label>';
    this.minCountSelect = document.createElement('select');
    this.minCountSelect.className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    this.minCountSelect.innerHTML = this.generateOptions(0, 10, this.groupNumber === 1 ? 1 : 0);
    this.minCountSelect.addEventListener('change', () => this.onInputChange());
    minCountDiv.appendChild(this.minCountSelect);

    const maxCountDiv = document.createElement('div');
    maxCountDiv.innerHTML = '<label class="block text-sm font-medium text-gray-700 mb-1">最大個数</label>';
    this.maxCountSelect = document.createElement('select');
    this.maxCountSelect.className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    this.maxCountSelect.innerHTML = this.generateOptions(1, 10, 3);
    this.maxCountSelect.addEventListener('change', () => this.onInputChange());
    maxCountDiv.appendChild(this.maxCountSelect);

    countSection.appendChild(minCountDiv);
    countSection.appendChild(maxCountDiv);

    // 最小・最大重み
    const weightSection = document.createElement('div');
    weightSection.className = 'grid grid-cols-2 gap-4';

    const minWeightDiv = document.createElement('div');
    minWeightDiv.innerHTML = '<label class="block text-sm font-medium text-gray-700 mb-1">最小重み</label>';
    this.minWeightInput = document.createElement('input');
    this.minWeightInput.type = 'number';
    this.minWeightInput.step = '0.1';
    this.minWeightInput.value = '0.5';
    this.minWeightInput.className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    this.minWeightInput.addEventListener('input', () => this.onInputChange());
    minWeightDiv.appendChild(this.minWeightInput);

    const maxWeightDiv = document.createElement('div');
    maxWeightDiv.innerHTML = '<label class="block text-sm font-medium text-gray-700 mb-1">最大重み</label>';
    this.maxWeightInput = document.createElement('input');
    this.maxWeightInput.type = 'number';
    this.maxWeightInput.step = '0.1';
    this.maxWeightInput.value = '1.3';
    this.maxWeightInput.className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
    this.maxWeightInput.addEventListener('input', () => this.onInputChange());
    maxWeightDiv.appendChild(this.maxWeightInput);

    weightSection.appendChild(minWeightDiv);
    weightSection.appendChild(maxWeightDiv);

    rightSection.appendChild(countSection);
    rightSection.appendChild(weightSection);

    content.appendChild(leftSection);
    content.appendChild(rightSection);
    details.appendChild(summary);
    details.appendChild(content);

    return details;
  }

  private generateOptions(min: number, max: number, selected: number): string {
    let options = '';
    for (let i = min; i <= max; i++) {
      options += `<option value="${i}" ${i === selected ? 'selected' : ''}>${i}</option>`;
    }
    return options;
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  private onInputChange(): void {
    if (this.changeCallback) {
      this.changeCallback();
    }
  }

  public getTagGroupData() {
    return {
      tags: this.tagsTextarea.value.split('\n').filter(tag => tag.trim().length > 0),
      minCount: parseInt(this.minCountSelect.value),
      maxCount: parseInt(this.maxCountSelect.value),
      minWeight: parseFloat(this.minWeightInput.value),
      maxWeight: parseFloat(this.maxWeightInput.value)
    };
  }

  public setTagGroupData(data: any): void {
    if (data.tags && Array.isArray(data.tags)) {
      this.tagsTextarea.value = data.tags.join('\n');
    }
    if (typeof data.minCount === 'number') {
      this.minCountSelect.value = data.minCount.toString();
    }
    if (typeof data.maxCount === 'number') {
      this.maxCountSelect.value = data.maxCount.toString();
    }
    if (typeof data.minWeight === 'number') {
      this.minWeightInput.value = data.minWeight.toString();
    }
    if (typeof data.maxWeight === 'number') {
      this.maxWeightInput.value = data.maxWeight.toString();
    }
  }
}