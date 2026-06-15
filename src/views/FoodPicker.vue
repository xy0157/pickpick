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
      @update:items="options = $event"
      @import="openImport"
      @reset="loadMeal(currentMeal)"
    />

    <div style="text-align:center;margin:24px 0;">
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
import { useRandomPick } from '../composables/useRandomPick'
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
const options = ref([...templatesStore.getTemplate('food', 'lunch')])
const showEditor = ref(false)
const showImport = ref(false)
const showResult = ref(false)
const isRolling = ref(false)
const pickedResult = ref('')

const picker = useRandomPick(options.value)

function loadMeal(name) {
  currentMeal.value = name
  options.value = [...templatesStore.getTemplate('food', name)]
  showResult.value = false
}

function doPick() {
  if (options.value.length === 0) return
  isRolling.value = true
  showResult.value = true
  const [result] = picker.pick(1, false)
  pickedResult.value = result
  historyStore.addRecord('food', options.value, result)
  setTimeout(() => { isRolling.value = false }, 100)
}

function openImport() { showImport.value = true }
function handleImport(items) { options.value = items }
</script>
