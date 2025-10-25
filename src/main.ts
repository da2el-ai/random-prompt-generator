import './style.css'
import { App } from './App.js'

// アプリケーションコンテナを作成
const appContainer = document.createElement('div');
appContainer.className = 'min-h-screen bg-gray-100 p-4';
appContainer.innerHTML = `
  <div class="max-w-6xl mx-auto" id="app-content">
    <!-- アプリケーションのコンテンツがここに追加されます -->
  </div>
`;

// DOMに追加
document.querySelector<HTMLDivElement>('#app')!.appendChild(appContainer);

// アプリケーションを初期化
const contentContainer = document.querySelector<HTMLDivElement>('#app-content')!;
new App(contentContainer);

console.log('Random Prompt Generator UI が起動しました')