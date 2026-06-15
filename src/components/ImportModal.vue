<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="pixel-card import-modal">
      <h3 class="import-modal__title">📥 导入选项</h3>
      <p class="import-modal__hint">每行一个选项，最多 500 项</p>
      <textarea
        class="import-modal__textarea"
        v-model="text"
        placeholder="粘贴文本内容，每行一个选项..."
        rows="8"
      ></textarea>
      <div class="import-modal__actions">
        <button class="pixel-btn" @click="handleCancel">取消</button>
        <button class="pixel-btn pixel-btn--cyan" @click="handleImport">
          导入
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { parseTxtFile } from '../utils/export.js'

const props = defineProps({
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'import'])

const text = ref('')

watch(() => props.show, (val) => {
  if (!val) {
    text.value = ''
  }
})

function handleCancel() {
  emit('close')
}

function handleImport() {
  const items = parseTxtFile(text.value)
  if (items.length > 0) {
    emit('import', items)
  }
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
}

.import-modal {
  width: 100%;
  max-width: 480px;
}

.import-modal__title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-xs);
}

.import-modal__hint {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  margin-bottom: var(--space-md);
}

.import-modal__textarea {
  width: 100%;
  min-height: 160px;
  padding: var(--space-sm);
  border: var(--border-thick);
  border-radius: var(--radius-pixel);
  font-family: var(--font-pixel);
  font-size: var(--font-size-base);
  resize: vertical;
  outline: none;
  margin-bottom: var(--space-md);
}

.import-modal__textarea:focus {
  box-shadow: 0 0 0 2px var(--color-cyan);
}

.import-modal__actions {
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
}
</style>
