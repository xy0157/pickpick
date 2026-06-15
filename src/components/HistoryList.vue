<template>
  <div class="history-list">
    <div v-if="records.length === 0" class="history-list__empty">
      还没有历史记录
    </div>

    <div v-else class="history-list__items">
      <div v-for="record in records" :key="record.id" class="pixel-card history-list__item">
        <div class="history-list__item-header">
          <span class="history-list__mode">{{ modeEmoji(record.mode) }} {{ modeLabel(record.mode) }}</span>
          <span class="history-list__time">{{ formatTime(record.createdAt) }}</span>
        </div>
        <div class="history-list__options">
          {{ displayOptions(record) }}
        </div>
        <div class="history-list__result">
          结果：<strong>{{ displayResult(record) }}</strong>
        </div>
        <button class="history-list__delete" @click="$emit('delete', record.id)">
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  records: { type: Array, required: true }
})

defineEmits(['delete'])

const modeMap = {
  food: { emoji: '🍔', label: '吃什么' },
  rollcall: { emoji: '🎒', label: '点名' },
  lottery: { emoji: '✏️', label: '抽签' },
  yesno: { emoji: '✅', label: '是与否' },
  shopping: { emoji: '🛒', label: '购物清单' },
  wheel: { emoji: '🎲', label: '转盘' }
}

function modeEmoji(mode) {
  return modeMap[mode]?.emoji || '❓'
}

function modeLabel(mode) {
  return modeMap[mode]?.label || mode
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

function displayOptions(record) {
  if (!record.options || record.options.length === 0) return ''
  const display = record.options.slice(0, 5)
  let text = display.join(', ')
  if (record.options.length > 5) {
    text += ', ...'
  }
  return text
}

function displayResult(record) {
  if (Array.isArray(record.result)) {
    return record.result.join(', ')
  }
  return record.result || ''
}
</script>

<style scoped>
.history-list__empty {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-gray);
  font-size: var(--font-size-base);
}

.history-list__items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.history-list__item {
  position: relative;
}

.history-list__item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.history-list__mode {
  font-weight: bold;
  font-size: var(--font-size-base);
}

.history-list__time {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.history-list__options {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  margin-bottom: var(--space-xs);
}

.history-list__result {
  font-size: var(--font-size-base);
}

.history-list__result strong {
  color: var(--color-red);
}

.history-list__delete {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-pixel);
  background: var(--color-white);
  color: var(--color-gray);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s, color 0.1s;
}

.history-list__delete:hover {
  background: var(--color-red);
  color: white;
  border-color: var(--color-red);
}
</style>
