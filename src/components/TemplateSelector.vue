<template>
  <div class="template-selector">
    <button class="template-selector__toggle" @click="open = !open">
      <span>{{ open ? '▼' : '▶' }} 选择模板</span>
    </button>

    <div v-if="open" class="template-selector__body">
      <div
        v-for="cat in categories"
        :key="cat.category"
        class="template-selector__category"
      >
        <h4 class="template-selector__cat-label">{{ cat.label }}</h4>
        <div class="template-selector__tags">
          <span
            v-for="tmpl in cat.templates"
            :key="tmpl.name"
            class="template-selector__tag pop-in"
            @click="$emit('select', cat.category, tmpl.name)"
          >
            {{ tmpl.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  categories: { type: Array, required: true }
})

defineEmits(['select'])

const open = ref(false)
</script>

<style scoped>
.template-selector {
  margin-bottom: var(--space-md);
}

.template-selector__toggle {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: var(--border-thick);
  border-radius: var(--radius-pixel);
  background: var(--color-white);
  color: var(--color-text);
  cursor: pointer;
  font-family: var(--font-pixel);
  font-size: var(--font-size-base);
  text-align: left;
  transition: background 0.1s;
}

.template-selector__toggle:hover {
  background: var(--color-gray-light);
}

.template-selector__body {
  margin-top: var(--space-sm);
  border: var(--border-thick);
  border-radius: var(--radius-pixel);
  background: var(--color-white);
  padding: var(--space-md);
}

.template-selector__category {
  margin-bottom: var(--space-md);
}

.template-selector__category:last-child {
  margin-bottom: 0;
}

.template-selector__cat-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  margin-bottom: var(--space-xs);
}

.template-selector__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.template-selector__tag {
  display: inline-block;
  padding: 4px 10px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-pixel);
  font-size: var(--font-size-sm);
  cursor: pointer;
  background: var(--color-gray-light);
  transition: background 0.1s, transform 0.1s;
  user-select: none;
}

.template-selector__tag:hover {
  background: var(--color-yellow);
  transform: translateY(-1px);
}
</style>
