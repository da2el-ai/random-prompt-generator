<template>
  <main class="space-y-6">
    <!-- タググループ -->
    <TagGroup
      v-for="(_, index) in tagGroups"
      :key="`tag-group-${index + 1}`"
      v-model="tagGroups[index]"
      :group-number="index + 1"
      @update:model-value="saveState"
    />

    <!-- 生成グループ -->
    <GenerationGroup
      v-model="generationOptions"
      :generated-prompts="generatedPrompts"
      @update:model-value="saveState"
      @generate="generatePrompts"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TagGroup from './TagGroup.vue'
import GenerationGroup from './GenerationGroup.vue'
import { PromptGenerator } from '../utils/PromptGenerator'
import { loadAppState, saveAppState, createDefaultState } from '../utils/storage'
import type { TagGroup as TagGroupType, GenerationOptions, AppState } from '../types'

// リアクティブな状態
const tagGroups = ref<TagGroupType[]>([
  { tags: [], minCount: 1, maxCount: 3, minWeight: 0.5, maxWeight: 1.3 },
  { tags: [], minCount: 0, maxCount: 3, minWeight: 0.5, maxWeight: 1.3 },
  { tags: [], minCount: 0, maxCount: 3, minWeight: 0.5, maxWeight: 1.3 }
])

const generationOptions = ref<GenerationOptions>({
  outputCount: 5,
  escapeParentheses: false,
  spaceConversion: 'none',
  addArtistPrefix: false,
  insertBlankLines: true,
  addTrailingComma: false
})

const generatedPrompts = ref<string[]>([])

// プロンプト生成関数
const generatePrompts = () => {
  try {
    console.log('プロンプト生成開始')
    console.log('タググループデータ:', tagGroups.value)
    console.log('生成オプション:', generationOptions.value)

    // プロンプトを生成
    const prompts = PromptGenerator.generatePrompts(
      tagGroups.value,
      generationOptions.value
    )

    // 結果を保存
    generatedPrompts.value = prompts
    saveState()

    console.log('プロンプト生成完了:', prompts)
  } catch (error) {
    console.error('プロンプト生成中にエラーが発生しました:', error)
    alert('プロンプト生成中にエラーが発生しました')
  }
}

// 状態保存
const saveState = () => {
  const appState: AppState = {
    tagGroup1: tagGroups.value[0],
    tagGroup2: tagGroups.value[1],
    tagGroup3: tagGroups.value[2],
    generationOptions: generationOptions.value,
    generatedPrompts: generatedPrompts.value
  }
  
  saveAppState(appState)
  console.log('状態を保存しました:', appState)
}

// 状態復元
const loadState = () => {
  const savedState = loadAppState()
  
  if (savedState) {
    console.log('保存された状態を復元中:', savedState)
    
    tagGroups.value[0] = savedState.tagGroup1
    tagGroups.value[1] = savedState.tagGroup2
    tagGroups.value[2] = savedState.tagGroup3
    generationOptions.value = savedState.generationOptions
    generatedPrompts.value = savedState.generatedPrompts || []
  } else {
    console.log('デフォルト状態を使用')
    const defaultState = createDefaultState()
    tagGroups.value[0] = defaultState.tagGroup1
    tagGroups.value[1] = defaultState.tagGroup2
    tagGroups.value[2] = defaultState.tagGroup3
    generationOptions.value = defaultState.generationOptions
    generatedPrompts.value = defaultState.generatedPrompts
  }
}

// コンポーネントマウント時に状態を復元
onMounted(() => {
  loadState()
})

// タググループを外部から取得できるように expose
defineExpose({
  tagGroups
})
</script>