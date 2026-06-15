<template>
  <div class="editable-list">
    <div class="editable-list__header">
      <span class="editable-list__count">共 {{ items.length }} 项</span>
      <div class="editable-list__actions">
        <button class="pixel-btn pixel-btn--yellow" style="font-size:12px;padding:4px 8px;" @click="$emit('import')">
          📥 导入
        </button>
        <button class="pixel-btn pixel-btn--primary" style="font-size:12px;padding:4px 8px;" @click="$emit('reset')">
          🔄 重置
        </button>
      </div>
    </div>

    <ul class="editable-list__items">
      <li v-for="(item, index) in items" :key="index" class="editable-list__item">
        <span class="editable-list__index">{{ index + 1 }}</span>
        <input
          class="pixel-input editable-list__input"
          :value="item"
          @input="updateItem(index, $event.target.value)"
          placeholder="输入选项..."
        />
        <button
          class="editable-list__remove"
          :disabled="items.length <= 1"
          @click="removeItem(index)"
        >
          ✕
        </button>
      </li>
    </ul>

    <button class="editable-list__add" @click="addItem">
      ＋ 添加选项
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true }
})

const emit = defineEmits(['update:items', 'import', 'reset'])

function updateItem(index, value) {
  const updated = [...props.items]
  updated[index] = value
  emit('update:items', updated)
}

function removeItem(index) {
  if (props.items.length <= 1) return
  const updated = props.items.filter((_, i) => i !== index)
  emit('update:items', updated)
}

function addItem() {
  emit('update:items', [...props.items, ''])
}
</script>

<style scoped>
.editable-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.editable-list__count {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
}

.editable-list__actions {
  display: flex;
  gap: var(--space-xs);
}

.editable-list__items {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-md);
}

.editable-list__item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.editable-list__index {
  font-size: var(--font-size-sm);
  font-weight: bold;
  min-width: 24px;
  text-align: center;
  color: var(--color-gray);
}

.editable-list__input {
  flex: 1;
}

.editable-list__remove {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-pixel);
  background: var(--color-white);
  color: var(--color-red);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.1s;
}

.editable-list__remove:hover:not(:disabled) {
  background: var(--color-red);
  color: white;
}

.editable-list__remove:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.editable-list__add {
  width: 100%;
  padding: var(--space-sm);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-pixel);
  background: transparent;
  color: var(--color-gray);
  cursor: pointer;
  font-family: var(--font-pixel);
  font-size: var(--font-size-base);
  transition: background 0.1s, color 0.1s;
}

.editable-list__add:hover {
  background: var(--color-gray-light);
  color: var(--color-text);
}
</style>
