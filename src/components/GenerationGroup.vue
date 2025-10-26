<template>
  <section class="mb-6 border border-gray-300 rounded-lg overflow-hidden bg-white">
    <div class="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 左側：生成結果 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          生成結果
        </label>
        <textarea
          v-model="resultText"
          readonly
          class="w-full h-48 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="生成されたプロンプトがここに表示されます..."
        />
        
        <button
          @click="onGenerateClick"
          class="w-full px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
        >
          プロンプト生成
        </button>
        
        <div class="mt-2">
          <button
            @click="copyToClipboard"
            :class="copyButtonClass"
            class="mr-2 px-4 py-2 text-white rounded-md focus:ring-2 focus:ring-offset-2 transition-colors"
          >
            {{ copyButtonText }}
          </button>
          
          <button
            @click="clearResult"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            生成結果を消去
          </button>
        </div>
      </div>

      <!-- 右側：オプション -->
      <div class="space-y-4">
        <!-- 出力数 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            出力数
          </label>
          <input
            v-model.number="outputCount"
            type="number"
            min="1"
            max="20"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div class="space-y-3">
          <!-- 空白変換 -->
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              空白変換
            </label>
            <select
              v-model="spaceConversion"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="none">変換しない</option>
              <option value="space-to-underscore">空白を_に変換</option>
              <option value="underscore-to-space">_を空白に変換</option>
            </select>
          </div>

          <!-- ()エスケープ -->
          <div class="flex items-center">
            <input
              v-model="escapeParentheses"
              type="checkbox"
              id="escape-parentheses"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label for="escape-parentheses" class="ml-2 text-sm text-gray-700">
              <code>()</code>を<code>\\(\\)</code>に変換
            </label>
          </div>

          <!-- artist:プレフィックス -->
          <div class="flex items-center">
            <input
              v-model="addArtistPrefix"
              type="checkbox"
              id="artist-prefix"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label for="artist-prefix" class="ml-2 text-sm text-gray-700">
              タグの先頭に<code>artist:</code>を付与
            </label>
          </div>

          <!-- 空行挿入 -->
          <div class="flex items-center">
            <input
              v-model="insertBlankLines"
              type="checkbox"
              id="insert-blank-lines"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label for="insert-blank-lines" class="ml-2 text-sm text-gray-700">
              生成結果に空行を挿入
            </label>
          </div>

          <!-- 末尾カンマ -->
          <div class="flex items-center">
            <input
              v-model="addTrailingComma"
              type="checkbox"
              id="add-trailing-comma"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label for="add-trailing-comma" class="ml-2 text-sm text-gray-700">
              末尾に<code>,</code>を追加
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { GenerationOptions } from '../types'

interface Props {
  modelValue: GenerationOptions
  generatedPrompts?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: GenerationOptions): void
  (e: 'generate'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// フォームフィールド
const outputCount = ref(5)
const escapeParentheses = ref(false)
const spaceConversion = ref<'space-to-underscore' | 'underscore-to-space' | 'none'>('none')
const addArtistPrefix = ref(false)
const insertBlankLines = ref(true)
const addTrailingComma = ref(false)

// コピーボタンの状態
const copyButtonText = ref('生成結果をコピー')
const copyButtonClass = ref('bg-blue-500 hover:bg-blue-600 focus:ring-blue-500')

// 結果表示用
const resultText = ref('')

// propsの値で初期化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    outputCount.value = newValue.outputCount
    escapeParentheses.value = newValue.escapeParentheses
    spaceConversion.value = newValue.spaceConversion
    addArtistPrefix.value = newValue.addArtistPrefix
    insertBlankLines.value = newValue.insertBlankLines
    addTrailingComma.value = newValue.addTrailingComma
  }
}, { immediate: true })

// 生成されたプロンプトの表示更新
watch(() => props.generatedPrompts, (newPrompts) => {
  if (newPrompts && newPrompts.length > 0) {
    if (insertBlankLines.value) {
      resultText.value = newPrompts.join('\n\n')
    } else {
      resultText.value = newPrompts.join('\n')
    }
  }
}, { immediate: true })

// 空行挿入オプションが変更された時の結果更新
watch(insertBlankLines, () => {
  if (props.generatedPrompts && props.generatedPrompts.length > 0) {
    if (insertBlankLines.value) {
      resultText.value = props.generatedPrompts.join('\n\n')
    } else {
      resultText.value = props.generatedPrompts.join('\n')
    }
  }
})

const generationOptions = computed((): GenerationOptions => ({
  outputCount: outputCount.value,
  escapeParentheses: escapeParentheses.value,
  spaceConversion: spaceConversion.value,
  addArtistPrefix: addArtistPrefix.value,
  insertBlankLines: insertBlankLines.value,
  addTrailingComma: addTrailingComma.value
}))

// オプションが変更された時に親に通知
watch(generationOptions, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

const onGenerateClick = () => {
  emit('generate')
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(resultText.value)
    // フィードバック表示
    copyButtonText.value = 'コピーしました！'
    copyButtonClass.value = 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
    
    setTimeout(() => {
      copyButtonText.value = '生成結果をコピー'
      copyButtonClass.value = 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
    }, 2000)
  } catch (error) {
    console.error('クリップボードへのコピーに失敗しました:', error)
    alert('クリップボードへのコピーに失敗しました')
  }
}

const clearResult = () => {
  resultText.value = ''
}
</script>