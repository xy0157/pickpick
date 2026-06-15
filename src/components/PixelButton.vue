<template>
  <button
    class="pixel-btn"
    :class="[`pixel-btn--${color}`, { 'pixel-btn--block': block }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  color: { type: String, default: 'primary' },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
.pixel-btn--block {
  display: block;
  width: 100%;
  text-align: center;
}

.pixel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
