<template>
  <div class="history-page">
    <div class="mode-header">
      <span class="mode-icon">📋</span>
      <h2 class="mode-title">历史记录</h2>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <button class="pixel-btn pixel-btn--yellow" style="font-size:13px;padding:4px 12px;" @click="exportData">
        💾 导出数据
      </button>
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;" @click="triggerImport">
        📂 导入数据
      </button>
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;color:var(--color-red);" @click="confirmClear" v-if="historyStore.records.length > 0">
        🗑️ 清空
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display:none"
      @change="handleFileImport"
    />

    <HistoryList
      :records="historyStore.records"
      @delete="historyStore.deleteRecord($event)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHistoryStore } from '../stores/history'
import { exportAllData, downloadJSON, importJSON } from '../utils/export'
import HistoryList from '../components/HistoryList.vue'

const historyStore = useHistoryStore()
const fileInput = ref(null)

function exportData() {
  const data = exportAllData()
  downloadJSON(data, `pickpick-${new Date().toISOString().slice(0, 10)}.json`)
}

function triggerImport() {
  fileInput.value?.click()
}

function handleFileImport(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      const result = importJSON(data, 'merge')
      if (result.success) {
        // Reload from localStorage to reflect merged data
        historyStore.records = JSON.parse(localStorage.getItem('pickpick_history')) || []
        alert('导入成功！')
      } else {
        alert(result.error)
      }
    } catch {
      alert('文件格式错误')
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

function confirmClear() {
  if (confirm('确定清空所有历史记录吗？')) {
    historyStore.clearAll()
  }
}
</script>
