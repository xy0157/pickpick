<template>
  <div class="lottery">
    <div class="mode-header">
      <span class="mode-icon">✏️</span>
      <h2 class="mode-title">抽签</h2>
    </div>

    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">
      <button class="pixel-btn" :class="{ 'pixel-btn--yellow': drawMode === 'single' }" style="font-size:13px;padding:4px 12px;" @click="drawMode = 'single'">单抽</button>
      <button class="pixel-btn" :class="{ 'pixel-btn--yellow': drawMode === 'multi' }" style="font-size:13px;padding:4px 12px;" @click="drawMode = 'multi'">连抽</button>
      <TemplateSelector :categories="templatesStore.allCategories" @select="loadTemplate" />
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;" @click="showEditor = !showEditor">✏️ 编辑</button>
    </div>

    <div v-if="drawMode === 'multi'" style="text-align:center;margin-bottom:12px;">
      <label style="font-size:14px;">抽取数量：
        <input type="number" v-model.number="drawCount" min="1" :max="options.length" class="pixel-input" style="width:60px;display:inline;font-size:14px;padding:4px;text-align:center;" />
      </label>
      <label style="margin-left:12px;font-size:14px;">
        <input type="checkbox" v-model="allowRepeat" /> 可重复
      </label>
    </div>

    <EditableList
      v-if="showEditor"
      :items="options"
      @update:items="options = $event"
      @import="openImport"
      @reset="resetOptions"
    />

    <!-- 选项标签 -->
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
      <button class="pixel-btn pixel-btn--cyan" style="font-size:20px;padding:12px 48px;" @click="doPick" :disabled="options.length === 0">
        🎲 抽签!
      </button>
    </div>

    <RandomResult
      v-if="showResult"
      :result="pickedResult"
      :options="options"
      :rolling="isRolling"
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

const options = ref(['选项A', '选项B', '选项C', '选项D', '选项E'])
const drawMode = ref('single')
const drawCount = ref(3)
const allowRepeat = ref(false)
const showEditor = ref(false)
const showImport = ref(false)
const showResult = ref(false)
const isRolling = ref(false)
const pickedResult = ref('')

function doPick() {
  if (options.value.length === 0) return
  const count = drawMode.value === 'single' ? 1 : Math.min(drawCount.value, options.value.length)
  const results = []
  const pool = allowRepeat.value ? [...options.value] : [...options.value]
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break
    const idx = Math.floor(Math.random() * pool.length)
    results.push(pool[idx])
    if (!allowRepeat.value) pool.splice(idx, 1)
  }
  pickedResult.value = count === 1 ? results[0] : results
  isRolling.value = true
  showResult.value = true
  historyStore.addRecord('lottery', options.value, count === 1 ? results[0] : results)
  setTimeout(() => { isRolling.value = false }, 100)
}

function loadTemplate(category, name) {
  options.value = [...templatesStore.getTemplate(category, name)]
}

function resetOptions() {
  options.value = ['选项A', '选项B', '选项C', '选项D', '选项E']
}

function openImport() { showImport.value = true }
function handleImport(items) { options.value = items }
</script>
