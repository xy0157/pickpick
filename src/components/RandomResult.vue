<template>
  <div v-if="show" class="random-result">
    <div class="random-result__label">{{ label }}</div>

    <div v-if="isRolling" class="random-result__rolling">
      <div class="random-result__value random-result__value--rolling">
        {{ rollingText }}
      </div>
    </div>

    <div v-else class="random-result__result" :class="animationClass">
      <div
        class="random-result__value"
        :class="`random-result__value--${resultColor}`"
      >
        {{ displayText }}
      </div>
      <button class="pixel-btn pixel-btn--yellow" @click="$emit('retry')">
        🔄 换一个
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'

const props = defineProps({
  result: { type: [String, Array], default: null },
  options: { type: Array, default: () => [] },
  rolling: { type: Boolean, default: false },
  label: { type: String, default: '结果' },
  speed: { type: String, default: 'normal' }
})

const emit = defineEmits(['done', 'retry'])

const show = ref(false)
const isRolling = ref(false)
const rollingText = ref('')
const resultColor = ref('')

const colors = ['red', 'yellow', 'cyan', 'purple', 'orange', 'green']

const duration = computed(() => props.speed === 'fast' ? 600 : 1200)

const displayText = computed(() => {
  if (Array.isArray(props.result)) {
    return props.result.join(', ')
  }
  return props.result || ''
})

const animationClass = computed(() => {
  return isRolling.value ? '' : 'bounce-in'
})

let intervalId = null
let timeoutId = null

function startRolling() {
  show.value = true
  isRolling.value = true
  rollingText.value = getRandomOption()

  const speed = 60

  intervalId = setInterval(() => {
    rollingText.value = getRandomOption()
  }, speed)

  timeoutId = setTimeout(() => {
    stopRolling()
  }, duration.value)
}

function stopRolling() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  isRolling.value = false
  resultColor.value = colors[Math.floor(Math.random() * colors.length)]
  emit('done')
}

function getRandomOption() {
  if (props.options.length > 0) {
    return props.options[Math.floor(Math.random() * props.options.length)]
  }
  return '?'
}

watch(() => props.rolling, (val) => {
  if (val) {
    startRolling()
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.random-result {
  text-align: center;
  padding: var(--space-lg) 0;
}

.random-result__label {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  margin-bottom: var(--space-md);
}

.random-result__value {
  font-size: var(--font-size-xxl);
  font-weight: bold;
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  border: var(--border-thick);
  border-radius: var(--radius-pixel);
  display: inline-block;
  min-width: 120px;
}

.random-result__value--rolling {
  color: var(--color-gray);
  border-color: var(--color-gray);
}

.random-result__value--red { background: var(--color-red); color: white; }
.random-result__value--yellow { background: var(--color-yellow); color: var(--color-text); }
.random-result__value--cyan { background: var(--color-cyan); color: white; }
.random-result__value--purple { background: var(--color-purple); color: white; }
.random-result__value--orange { background: var(--color-orange); color: white; }
.random-result__value--green { background: var(--color-green); color: white; }
</style>
