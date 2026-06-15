<template>
  <div class="shopping">
    <div class="mode-header">
      <span class="mode-icon">🛒</span>
      <h2 class="mode-title">购物纠结器</h2>
    </div>

    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
      <TemplateSelector :categories="templatesStore.allCategories" @select="loadTemplate" />
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;" @click="showEditor = !showEditor">✏️ 编辑</button>
    </div>

    <EditableList
      v-if="showEditor"
      :items="options"
      @update:items="options = $event"
      @import="openImport"
      @reset="resetOptions"
    />

    <div style="text-align:center;margin:16px 0;">
      <button class="pixel-btn pixel-btn--yellow" style="font-size:20px;padding:12px 48px;" @click="doPick" :disabled="options.length === 0">
        🎲 帮我选!
      </button>
    </div>

    <RandomResult
      v-if="showResult"
      :result="pickedResult"
      :options="options"
      :rolling="isRolling"
      label="就买这个!"
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
import EditableList from '../components/EditableList.vue'
import RandomResult from '../components/RandomResult.vue'
import TemplateSelector from '../components/TemplateSelector.vue'
import ImportModal from '../components/ImportModal.vue'

const templatesStore = useTemplatesStore()
const historyStore = useHistoryStore()

const options = ref(['iPhone 16 Pro', 'Samsung S25', 'Xiaomi 15'])
const showEditor = ref(false)
const showImport = ref(false)
const showResult = ref(false)
const isRolling = ref(false)
const pickedResult = ref('')

function doPick() {
  if (options.value.length === 0) return
  const idx = Math.floor(Math.random() * options.value.length)
  pickedResult.value = options.value[idx]
  isRolling.value = true
  showResult.value = true
  historyStore.addRecord('shopping', options.value, pickedResult.value)
  setTimeout(() => { isRolling.value = false }, 100)
}

function loadTemplate(category, name) {
  options.value = [...templatesStore.getTemplate(category, name)]
}

function resetOptions() {
  options.value = ['商品A', '商品B', '商品C']
}

function openImport() { showImport.value = true }
function handleImport(items) { options.value = items }
</script>
