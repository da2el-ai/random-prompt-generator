<template>
  <main class="space-y-6">
    <!-- Step 1: プロンプト入力 -->
    <section class="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 class="font-medium text-gray-800">Step 1: プロンプト入力</h2>
      </div>
      <div class="p-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            分析するプロンプト
          </label>
          <p class="text-xs text-gray-500 mb-2">
            生成されたプロンプトまたはファイル名一覧を入力してください
          </p>
          <textarea
            v-model="inputPrompt"
            class="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="例: (null_(nyanpyoun):0.4), (yabuki_kentarou:0.8), (freng:0.5), (toosaka_asagi:0.6),&#10;または&#10;(ame__(uten_cancel_)_0.6), (yamamoto souichirou_0.6), (calm white_0.6),_20251025-215827_00001_.jpg"
          />
        </div>
        <button
          @click="parsePrompt"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          分解してStep2に送る
        </button>
      </div>
    </section>

    <!-- Step 2: タグ分析結果 -->
    <section class="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 class="font-medium text-gray-800">Step 2: タグ分析</h2>
      </div>
      <div class="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- 使用されたタグ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            使用されたタグ
          </label>
          <p class="text-xs text-gray-500 mb-2">
            Step1で分解されたタグ一覧
          </p>
          <textarea
            v-model="usedTagsText"
            class="w-full h-48 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="分解されたタグがここに表示されます..."
          />
        </div>

        <!-- 候補タグ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            候補タグ
          </label>
          <p class="text-xs text-gray-500 mb-2">
            プロンプト生成で使用可能なタグ
          </p>
          <textarea
            v-model="candidateTagsText"
            class="w-full h-48 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="候補タグがここに表示されます..."
          />
          <button
            @click="loadCandidateTags"
            class="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm"
          >
            候補タグを取り込む
          </button>
        </div>

        <!-- 未使用タグ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            未使用タグ
          </label>
          <p class="text-xs text-gray-500 mb-2">
            候補タグから使用済みを除いたもの
          </p>
          <textarea
            v-model="unusedTagsText"
            class="w-full h-48 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="未使用タグがここに表示されます..."
          />
          <button
            @click="extractUnused"
            class="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm"
          >
            未使用タグを抽出
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { parseTagsFromPrompt, extractUnusedTags, combineTagGroups } from '../utils/tagAnalyzer'
import { loadAppState } from '../utils/storage'

// リアクティブな状態
const inputPrompt = ref('')
const usedTagsText = ref('')
const candidateTagsText = ref('')
const unusedTagsText = ref('')

// 内部状態
const usedTags = ref<string[]>([])
const candidateTags = ref<string[]>([])

// プロンプトを分解してStep2に送る
const parsePrompt = () => {
  try {
    // console.log('プロンプト分解開始:', inputPrompt.value)
    
    // プロンプトからタグを抽出
    const parsedTags = parseTagsFromPrompt(inputPrompt.value)
    
    // console.log('分解されたタグ:', parsedTags)
    
    // 使用されたタグを更新
    usedTags.value = parsedTags
    usedTagsText.value = parsedTags.join('\n')
    
    console.log('タグ分解完了')
  } catch (error) {
    console.error('プロンプト分解中にエラーが発生しました:', error)
    alert('プロンプト分解中にエラーが発生しました')
  }
}

// GenerateContainerの候補タグを取り込む
const loadCandidateTags = () => {
  try {
    console.log('候補タグ取り込み開始')
    
    // localStorageから状態を取得
    const savedState = loadAppState()
    
    if (savedState) {
      // 3つのタググループの候補タグを結合
      const tagGroups = [
        savedState.tagGroup1,
        savedState.tagGroup2,
        savedState.tagGroup3
      ]
      
      const combinedTags = combineTagGroups(tagGroups)
      
      console.log('取り込んだ候補タグ:', combinedTags)
      
      // 候補タグを更新
      candidateTags.value = combinedTags
      candidateTagsText.value = combinedTags.join('\n')
    } else {
      console.log('保存された状態が見つかりません')
      alert('保存された候補タグが見つかりません')
    }
  } catch (error) {
    console.error('候補タグ取り込み中にエラーが発生しました:', error)
    alert('候補タグ取り込み中にエラーが発生しました')
  }
}

// 未使用タグを抽出
const extractUnused = () => {
  try {
    console.log('未使用タグ抽出開始')
    console.log('候補タグ:', candidateTags.value)
    console.log('使用済みタグ:', usedTags.value)
    
    // 候補タグから使用済みタグを除外
    const unused = extractUnusedTags(candidateTags.value, usedTags.value)
    
    console.log('未使用タグ:', unused)
    
    // 未使用タグを更新
    unusedTagsText.value = unused.join('\n')
    
    console.log('未使用タグ抽出完了')
  } catch (error) {
    console.error('未使用タグ抽出中にエラーが発生しました:', error)
    alert('未使用タグ抽出中にエラーが発生しました')
  }
}
</script>