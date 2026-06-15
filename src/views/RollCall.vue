<template>
  <div class="rollcall">
    <div class="mode-header">
      <span class="mode-icon">🎒</span>
      <h2 class="mode-title">课堂点名</h2>
    </div>

    <div style="display:flex;gap:6px;margin-bottom:16px;">
      <button class="pixel-btn" :class="{ 'pixel-btn--yellow': callMode === 'single' }" style="font-size:13px;padding:4px 12px;" @click="callMode = 'single'">单次点名</button>
      <button class="pixel-btn" :class="{ 'pixel-btn--yellow': callMode === 'multi' }" style="font-size:13px;padding:4px 12px;" @click="callMode = 'multi'">连抽</button>
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;" @click="showEditor = !showEditor">✏️ 名单</button>
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;" @click="resetCalled">🔄 重置</button>
    </div>

    <div v-if="callMode === 'multi'" style="text-align:center;margin-bottom:12px;">
      <label style="font-size:14px;">抽取人数：
        <input type="number" v-model.number="pickCount" min="1" :max="availableOptions.length" class="pixel-input" style="width:60px;display:inline;font-size:14px;padding:4px;text-align:center;" />
      </label>
    </div>

    <EditableList
      v-if="showEditor"
      :items="options"
      @update:items="options = $event"
      @import="openImport"
      @reset="resetOptions"
    />

    <div style="text-align:center;margin:16px 0;">
      <button class="pixel-btn pixel-btn--primary" style="font-size:20px;padding:12px 48px;" @click="doPick" :disabled="availableOptions.length === 0">
        🎲 点名!
      </button>
    </div>

    <div v-if="calledNames.length > 0" class="pixel-card" style="margin-bottom:16px;font-size:14px;">
      已点：{{ calledNames.join('、') }}
    </div>

    <!-- 选项标签 -->
    <div class="pixel-card" style="margin-bottom:12px;padding:8px 12px;text-align:center;">
      <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;">
        <span
          v-for="(opt, i) in availableOptions" :key="i"
          style="background:var(--color-gray-light);padding:2px 8px;border-radius:3px;font-size:13px;border:1px solid var(--color-sdv-brown);"
        >{{ opt }}</span>
      </div>
      <div style="font-size:12px;color:var(--color-gray);margin-top:4px;">剩余 {{ availableOptions.length }} 人 · 已点 {{ calledNames.length }} 人</div>
    </div>

    <RandomResult
      v-if="showResult"
      :result="pickedResult"
      :options="availableOptions"
      :rolling="isRolling"
      :label="callMode === 'multi' ? '本次点名' : '被点到的同学'"
      @done="isRolling = false"
      @retry="doPick"
    />

    <ImportModal :show="showImport" @close="showImport = false" @import="handleImport" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHistoryStore } from '../stores/history'
import EditableList from '../components/EditableList.vue'
import RandomResult from '../components/RandomResult.vue'
import ImportModal from '../components/ImportModal.vue'

const historyStore = useHistoryStore()

const options = ref(['张三', '李四', '王五', '赵六', '陈七', '周八', '吴九', '郑十'])
const calledNames = ref([])
const callMode = ref('single')
const pickCount = ref(3)
const showEditor = ref(false)
const showImport = ref(false)
const showResult = ref(false)
const isRolling = ref(false)
const pickedResult = ref('')

const availableOptions = computed(() =>
  options.value.filter(o => o.trim() && !calledNames.value.includes(o.trim()))
)

function doPick() {
  const pool = callMode.value === 'single' ? availableOptions.value : options.value.filter(o => o.trim())
  if (pool.length === 0) return
  const count = callMode.value === 'single' ? 1 : Math.min(pickCount.value, pool.length)
  const results = []
  const tempPool = [...pool]
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * tempPool.length)
    results.push(tempPool.splice(idx, 1)[0])
  }
  pickedResult.value = count === 1 ? results[0] : results
  calledNames.value.push(...results.map(r => r.trim()).filter(r => r))
  isRolling.value = true
  showResult.value = true
  historyStore.addRecord('rollcall', pool, count === 1 ? results[0] : results)
  setTimeout(() => { isRolling.value = false }, 100)
}

function resetCalled() {
  calledNames.value = []
  showResult.value = false
}

function resetOptions() {
  options.value = ['张三', '李四', '王五', '赵六', '陈七', '周八']
  calledNames.value = []
}

function openImport() { showImport.value = true }
function handleImport(items) {
  options.value = items
  calledNames.value = []
}
</script>
