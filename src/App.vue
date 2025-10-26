<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- ヘッダー -->
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          Random Prompt Generator
        </h1>
        <p class="text-gray-600">
          画像生成AI用プロンプトをランダム生成
        </p>
      </header>

      <!-- タブ切り替え -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'generate'"
              :class="{
                'border-green-500 text-green-600': activeTab === 'generate',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'generate'
              }"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              プロンプト生成
            </button>
            <button
              @click="activeTab = 'analyze'"
              :class="{
                'border-blue-500 text-blue-600': activeTab === 'analyze',
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'analyze'
              }"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              タグ分析
            </button>
          </nav>
        </div>
      </div>

      <!-- タブコンテンツ -->
      <GenerateContainer v-if="activeTab === 'generate'" />
      <AnalyzeContainer v-if="activeTab === 'analyze'" />

      <!-- フッター -->
      <footer class="text-center mt-12 pt-8 border-t border-gray-200">
        <p class="text-gray-500 text-sm">
          設定は自動的にLocalStorageに保存されます
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GenerateContainer from './components/GenerateContainer.vue'
import AnalyzeContainer from './components/AnalyzeContainer.vue'

// アクティブタブの管理
const activeTab = ref<'generate' | 'analyze'>('generate')
</script>