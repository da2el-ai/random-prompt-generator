<template>
  <details 
    :open="isOpen"
    class="mb-4 border border-gray-300 rounded-lg overflow-hidden"
  >
    <summary 
      class="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 font-medium text-gray-700"
      @click="toggleOpen"
    >
      タググループ{{ groupNumber }}
    </summary>
    
    <div class="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 左側：タグ候補 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          タグ候補
        </label>
        <p class="text-xs text-gray-500 mb-1">
          改行区切りで1行＝1タグ
        </p>
        <textarea
          v-model="tags"
          @change="onInput"
          @blur="onInput"
          class="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="1girl&#10;cute&#10;beautiful&#10;portrait&#10;..."
        />
      </div>

      <!-- 右側：オプション -->
      <div class="space-y-4">
        <!-- 最小・最大個数 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              最小個数
            </label>
            <select
              v-model="minCount"
              @change="onInput"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="i in 11" :key="i-1" :value="i-1">{{ i-1 }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              最大個数
            </label>
            <select
              v-model="maxCount"
              @change="onInput"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>
        </div>

        <!-- 最小・最大重み -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              最小重み
            </label>
            <input
              v-model.number="minWeight"
              @change="onInput"
              @blur="onInput"
              type="number"
              step="0.1"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              最大重み
            </label>
            <input
              v-model.number="maxWeight"
              @change="onInput"
              @blur="onInput"
              type="number"
              step="0.1"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TagGroup } from '../types'

interface Props {
  groupNumber: number
  modelValue: TagGroup
}

interface Emits {
  (e: 'update:modelValue', value: TagGroup): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(true)

// v-modelの実装
const tags = ref('')
const minCount = ref(0)
const maxCount = ref(3)
const minWeight = ref(0.5)
const maxWeight = ref(1.3)

// propsの値で初期化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    tags.value = newValue.tags.join('\n')
    minCount.value = newValue.minCount
    maxCount.value = newValue.maxCount
    minWeight.value = newValue.minWeight
    maxWeight.value = newValue.maxWeight
  }
}, { immediate: true })

// デフォルト値の設定（グループ1の場合は最小個数を1に）
if (props.groupNumber === 1 && props.modelValue.minCount === 0) {
  minCount.value = 1
}

const tagGroupData = computed((): TagGroup => ({
  tags: tags.value.split('\n').filter(tag => tag.trim().length > 0),
  minCount: minCount.value,
  maxCount: maxCount.value,
  minWeight: minWeight.value,
  maxWeight: maxWeight.value
}))

const onInput = () => {
  emit('update:modelValue', tagGroupData.value)
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
</script>