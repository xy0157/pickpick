<template>
  <div class="food-picker" style="max-width:500px;margin:0 auto;">
    <div class="mode-header">
      <span class="mode-icon">🍔</span>
      <h2 class="mode-title">今天吃什么</h2>
    </div>

    <div style="display:flex;gap:6px;margin-bottom:16px;justify-content:center;">
      <button
        v-for="tpl in mealTemplates" :key="tpl.name"
        class="pixel-btn"
        :class="{ 'pixel-btn--yellow': currentMeal === tpl.name }"
        style="font-size:13px;padding:4px 12px;"
        @click="loadMeal(tpl.name)"
      >
        {{ tpl.label }}
      </button>
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;" @click="showEditor = !showEditor">
        ✏️ 编辑
      </button>
    </div>

    <EditableList
      v-if="showEditor"
      :items="options"
      @update:items="options = $event; updatePicker()"
      @import="openImport"
      @reset="loadMeal(currentMeal)"
    />

    <!-- 选项标签展示 -->
    <div class="pixel-card" style="margin-bottom:12px;padding:8px 12px;text-align:center;">
      <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;">
        <span
          v-for="(opt, i) in options" :key="i"
          style="background:var(--color-gray-light);padding:2px 8px;border-radius:3px;font-size:13px;border:1px solid var(--color-sdv-brown);"
        >{{ opt }}</span>
      </div>
      <div style="font-size:12px;color:var(--color-gray);margin-top:4px;">共 {{ options.length }} 个选项</div>
    </div>

    <div style="text-align:center;margin:16px 0;">
      <button
        class="pixel-btn pixel-btn--primary"
        style="font-size:20px;padding:12px 48px;"
        @click="doPick"
        :disabled="options.length === 0"
      >
        🎲 帮我选!!!
      </button>
    </div>

    <RandomResult
      v-if="showResult"
      :result="pickedResult"
      :options="options"
      :rolling="isRolling"
      :speed="settingsStore.animationSpeed"
      @done="isRolling = false"
      @retry="doPick"
    />

    <ImportModal :show="showImport" @close="showImport = false" @import="handleImport" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTemplatesStore } from '../stores/templates'
import { useHistoryStore } from '../stores/history'
import { useSettingsStore } from '../stores/settings'
import EditableList from '../components/EditableList.vue'
import RandomResult from '../components/RandomResult.vue'
import ImportModal from '../components/ImportModal.vue'

const templatesStore = useTemplatesStore()
const historyStore = useHistoryStore()
const settingsStore = useSettingsStore()

const mealTemplates = [
  { name: 'breakfast', label: '🥐 早餐' },
  { name: 'lunch', label: '🍱 午餐' },
  { name: 'dinner', label: '🍲 晚餐' }
]

const currentMeal = ref('lunch')

const DEFAULT_LUNCH = ['米饭套餐', '面条', '饺子', '盖饭', '麻辣烫', '炒饭', '米线', '沙拉', '三明治', '寿司']
const options = ref([...(templatesStore.getTemplate('food', 'lunch').length ? templatesStore.getTemplate('food', 'lunch') : DEFAULT_LUNCH)])

const showEditor = ref(false)
const showImport = ref(false)
const showResult = ref(false)
const isRolling = ref(false)
const pickedResult = ref('')

function loadMeal(name) {
  currentMeal.value = name
  const tpl = templatesStore.getTemplate('food', name)
  options.value = tpl.length ? [...tpl] : DEFAULT_LUNCH
  showResult.value = false
}

function updatePicker() {
  // Force reactive update - options ref is shared with RandomResult
}

function doPick() {
  if (options.value.length === 0) return
  isRolling.value = true
  showResult.value = true
  const idx = Math.floor(Math.random() * options.value.length)
  pickedResult.value = options.value[idx]
  historyStore.addRecord('food', options.value, pickedResult.value)
  setTimeout(() => { isRolling.value = false }, 100)
}

function openImport() { showImport.value = true }
function handleImport(items) { options.value = items }
</script>
