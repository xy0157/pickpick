<template>
  <div v-if="show" class="random-result">
    <!-- ====== 老虎机滚动阶段 ====== -->
    <template v-if="isRolling">
      <div class="random-result__slot-machine">
        <div class="random-result__slot-row random-result__slot-row--top">
          {{ topText }}
        </div>
        <div class="random-result__slot-row random-result__slot-row--center">
          {{ centerText }}
        </div>
        <div class="random-result__slot-row random-result__slot-row--bottom">
          {{ bottomText }}
        </div>
      </div>
      <div class="random-result__hint">🎰 正在决定中...</div>
    </template>

    <!-- ====== 结果揭晓阶段 ====== -->
    <template v-else>
      <div class="random-result__confetti-container" v-if="showConfetti">
        <div
          v-for="p in confettiParticles" :key="p.id"
          class="confetti-particle"
          :style="{
            '--fall-distance': p.fallDist + 'px',
            '--spin': p.spin + 'deg',
            '--duration': p.duration + 's',
            '--delay': p.delay + 's',
            left: p.x + '%',
            top: p.y + '%',
            width: p.size + 'px',
            height: p.size + 'px',
            background: p.color,
            borderRadius: p.round ? '50%' : '2px'
          }"
        ></div>
      </div>

      <div v-if="showLeaves">
        <div
          v-for="leaf in leafParticles" :key="leaf.id"
          class="leaf-float"
          :style="{
            left: leaf.x + '%',
            top: leaf.y + '%',
            fontSize: leaf.size + 'px',
            animationDelay: leaf.delay + 's',
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 999
          }"
        >{{ leaf.icon }}</div>
      </div>

      <div class="random-result__label">{{ label }}</div>
      <div class="sdv-frame" style="display:inline-block;margin-bottom:12px;">
        <div class="sdv-frame__inner random-result__result-display sdv-item-pop">
          <div class="random-result__value" :style="{ color: activeColor }">
            {{ displayText }}
          </div>
          <div class="random-result__sparkle" v-if="showSparkle">
            <span class="star-burst" style="position:absolute;top:-20px;left:-20px;">✨</span>
            <span class="star-burst" style="position:absolute;top:-20px;right:-20px;animation-delay:0.1s;">⭐</span>
            <span class="star-burst" style="position:absolute;bottom:-20px;left:50%;animation-delay:0.2s;">✨</span>
          </div>
        </div>
      </div>
      <button class="pixel-btn" @click="$emit('retry')">
        🔄 换一个
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, computed, nextTick } from 'vue'

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
const rollingTick = ref(0)
const topText = ref('')
const centerText = ref('')
const bottomText = ref('')
const showConfetti = ref(false)
const showLeaves = ref(false)
const showSparkle = ref(false)

const confettiParticles = ref([])
const leafParticles = ref([])

const rainbowColors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#6BCB77', '#FF9F43', '#AA96DA']

const activeColor = computed(() => {
  if (Array.isArray(props.result)) return rainbowColors[0]
  return rainbowColors[Math.abs(hashCode(props.result || '')) % rainbowColors.length]
})

const duration = computed(() => props.speed === 'fast' ? 600 : 1200)

const displayText = computed(() => {
  if (Array.isArray(props.result)) return props.result.join(', ')
  return props.result || ''
})

let intervalId = null
let timeoutId = null

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

function getRandomOption() {
  if (props.options.length > 0) {
    return props.options[Math.floor(Math.random() * props.options.length)]
  }
  return '?'
}

function getRandomColor() {
  return rainbowColors[Math.floor(Math.random() * rainbowColors.length)]
}

function startRolling() {
  show.value = true
  isRolling.value = true
  showConfetti.value = false
  showLeaves.value = false
  showSparkle.value = false
  confettiParticles.value = []
  leafParticles.value = []

  // Initialize with random values
  topText.value = getRandomOption()
  centerText.value = getRandomOption()
  bottomText.value = getRandomOption()

  const speed = 70
  const slowdownStart = duration.value * 0.7

  let tick = 0
  intervalId = setInterval(() => {
    tick++
    topText.value = getRandomOption()
    centerText.value = getRandomOption()
    bottomText.value = getRandomOption()
    rollingTick.value = tick
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

  // Show final result in center, empty top/bottom
  const finalResult = displayText.value
  topText.value = ''
  centerText.value = finalResult
  bottomText.value = ''

  isRolling.value = false

  // Trigger confetti + leaves + sparkle after a tiny delay
  nextTick(() => {
    generateConfetti()
    generateLeaves()
    showSparkle.value = true
  })
}

function generateConfetti() {
  const particles = []
  for (let i = 0; i < 24; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 30 - 10,
      size: 4 + Math.random() * 8,
      color: getRandomColor(),
      round: Math.random() > 0.5,
      fallDist: 60 + Math.random() * 100,
      spin: Math.random() * 720 - 360,
      duration: 0.6 + Math.random() * 0.8,
      delay: Math.random() * 0.3
    })
  }
  confettiParticles.value = particles
  showConfetti.value = true

  // Auto cleanup
  setTimeout(() => {
    showConfetti.value = false
    confettiParticles.value = []
  }, 1800)
}

function generateLeaves() {
  const leaves = []
  const leafIcons = ['🌿', '🍃', '🍂', '🌾', '🌸', '⭐', '✨']
  for (let i = 0; i < 6; i++) {
    leaves.push({
      id: i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 30,
      icon: leafIcons[i % leafIcons.length],
      size: 12 + Math.random() * 12,
      delay: Math.random() * 1.0
    })
  }
  leafParticles.value = leaves
  showLeaves.value = true

  setTimeout(() => {
    showLeaves.value = false
    leafParticles.value = []
  }, 3000)
}

watch(() => props.rolling, (val) => {
  if (val) startRolling()
}, { immediate: true })

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.random-result {
  text-align: center;
  padding: var(--space-lg) 0;
  position: relative;
}

.random-result__label {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  margin-bottom: var(--space-md);
}

.random-result__hint {
  font-size: var(--font-size-sm);
  color: var(--color-gray);
  margin-top: var(--space-sm);
}

/* 老虎机 */
.random-result__slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--space-md);
  background: var(--color-sdv-brown-dark);
  border: 3px solid var(--color-sdv-brown-dark);
  border-radius: var(--radius-pixel);
  max-width: 320px;
  margin: 0 auto;
  position: relative;
}

.random-result__slot-machine::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 2px solid var(--color-sdv-wood);
  border-radius: 2px;
  pointer-events: none;
}

.random-result__slot-row {
  width: 100%;
  padding: 6px 12px;
  text-align: center;
  font-family: var(--font-pixel);
  border-radius: 2px;
  transition: all 0.05s;
}

.random-result__slot-row--top,
.random-result__slot-row--bottom {
  background: var(--color-sdv-cream);
  color: var(--color-sdv-brown);
  font-size: var(--font-size-base);
  opacity: 0.7;
}

.random-result__slot-row--center {
  background: var(--color-white);
  color: var(--color-text);
  font-size: var(--font-size-xl);
  font-weight: bold;
  border: 2px solid var(--color-sdv-gold);
  box-shadow: 0 0 8px rgba(218, 165, 32, 0.3);
}

/* 结果展示 */
.random-result__result-display {
  position: relative;
  min-width: 160px;
  text-align: center;
  overflow: hidden;
}

.random-result__value {
  font-size: var(--font-size-xxl);
  font-weight: bold;
  padding: var(--space-sm) var(--space-md);
}

.random-result__sparkle {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 彩屑容器 */
.random-result__confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.confetti-particle {
  position: absolute;
  animation: confettiFall var(--duration, 1s) ease-in forwards;
  animation-delay: var(--delay, 0s);
}
</style>
