<template>
  <div
    class="pixel-card"
    :class="{ 'pixel-card--clickable': clickable }"
    :style="borderStyle"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: { type: String, default: null },
  clickable: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const borderStyle = computed(() => {
  if (!props.color) return {}
  return { borderColor: props.color }
})

function handleClick(e) {
  if (props.clickable) {
    emit('click', e)
  }
}
</script>

<style scoped>
.pixel-card--clickable {
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.pixel-card--clickable:hover {
  transform: translate(-1px, -1px);
  box-shadow: 6px 6px 0 var(--color-border);
}

.pixel-card--clickable:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--color-border);
}
</style>
