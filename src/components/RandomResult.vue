<template>
  <div v-if="show" class="random-result">
    <!-- ====== 老虎机滚动阶段（带运动模糊） ====== -->
    <template v-if="isRolling">
      <div class="random-result__slot-machine">
        <div class="random-result__slot-blur-top"></div>
        <div class="random-result__slot-row random-result__slot-row--top motion-blur">
          {{ topText }}
        </div>
        <div class="random-result__slot-row random-result__slot-row--center">
          {{ centerText }}
        </div>
        <div class="random-result__slot-row random-result__slot-row--bottom motion-blur">
          {{ bottomText }}
        </div>
        <div class="random-result__slot-blur-bottom"></div>
      </div>
      <div class="random-result__hint">🎰 正在决定中...</div>
    </template>

    <!-- ====== 结果揭晓阶段 ====== -->
    <template v-else>
      <!-- 彩屑粒子容器 -->
      <div v-if="showConfetti" class="random-result__confetti-container">
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
            borderRadius: p.round ? '50%' : '2px',
            opacity: 0
          }"
        ></div>
      </div>

      <!-- SDV 漂浮元素 -->
      <div v-if="showLeaves" class="random-result__leaf-container">
        <div
          v-for="leaf in leafParticles" :key="leaf.id"
          class="sdv-leaf"
          :style="{
            left: leaf.x + '%',
            top: leaf.y + '%',
            fontSize: leaf.size + 'px',
            animationDelay: leaf.delay + 's',
            opacity: 0
          }"
        >{{ leaf.icon }}</div>
      </div>

      <div class="random-result__label">{{ label }}</div>

      <!-- 结果展示框（带 SDV 装饰背景） -->
      <div class="random-result__result-wrapper sdv-item-pop">
        <!-- SDV 装饰星芒 -->
        <div class="random-result__sparkles" v-if="showSparkle">
          <span class="sdv-star" style="top:-25px;left:-15px;">⭐</span>
          <span class="sdv-star" style="top:-30px;right:-10px;animation-delay:0.15s;">✨</span>
          <span class="sdv-star" style="bottom:-20px;left:30%;animation-delay:0.3s;">🌟</span>
          <span class="sdv-star" style="top:40%;right:-20px;animation-delay:0.1s;">💫</span>
          <span class="sdv-star" style="bottom:-25px;right:30%;animation-delay:0.25s;">⭐</span>
        </div>

        <div class="sdv-frame" style="display:inline-block;">
          <div class="sdv-frame__inner random-result__result-inner">
            <div class="random-result__value" :style="{ color: activeColor }">
              {{ displayText }}
            </div>
          </div>
        </div>
      </div>

      <button class="pixel-btn" style="margin-top:12px;" @click="$emit('retry')">
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
const topText = ref('')
const centerText = ref('')
const bottomText = ref('')
const showConfetti = ref(false)
const showLeaves = ref(false)
const showSparkle = ref(false)

const confettiParticles = ref([])
const leafParticles = ref([])

const rainbowColors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#6BCB77', '#FF9F43', '#AA96DA']
const sdvIcons = ['⭐', '✨', '🌟', '💫', '🍃', '🌿', '🌾', '🌸', '💎', '⭐']

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

function getRandomIcon() {
  return sdvIcons[Math.floor(Math.random() * sdvIcons.length)]
}

function startRolling() {
  show.value = true
  isRolling.value = true
  showConfetti.value = false
  showLeaves.value = false
  showSparkle.value = false
  confettiParticles.value = []
  leafParticles.value = []

  topText.value = getRandomOption()
  centerText.value = getRandomOption()
  bottomText.value = getRandomOption()

  const speed = 60
  let tick = 0

  intervalId = setInterval(() => {
    tick++
    topText.value = getRandomOption()
    centerText.value = getRandomOption()
    bottomText.value = getRandomOption()
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

  const finalResult = displayText.value
  topText.value = ''
  centerText.value = finalResult
  bottomText.value = ''

  isRolling.value = false

  nextTick(() => {
    generateConfetti()
    generateLeaves()
    showSparkle.value = true
  })
}

function generateConfetti() {
  const particles = []
  const count = 48
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: -5 - Math.random() * 20,
      size: 3 + Math.random() * 8,
      color: getRandomColor(),
      round: Math.random() > 0.5,
      fallDist: 80 + Math.random() * 140,
      spin: Math.random() * 720 - 360,
      duration: 1.0 + Math.random() * 1.0,
      delay: Math.random() * 0.4
    })
  }
  confettiParticles.value = particles
  showConfetti.value = true

  setTimeout(() => {
    showConfetti.value = false
    confettiParticles.value = []
  }, 2500)
}

function generateLeaves() {
  const leaves = []
  const count = 10
  const leafIcons = ['🌿', '🍃', '🍂', '🌾', '🌸', '⭐', '✨', '🌟', '💎', '🍀']
  for (let i = 0; i < count; i++) {
    leaves.push({
      id: i,
      x: 5 + Math.random() * 90,
      y: 10 + Math.random() * 40,
      icon: leafIcons[i % leafIcons.length],
      size: 14 + Math.random() * 14,
      delay: Math.random() * 1.2
    })
  }
  leafParticles.value = leaves
  showLeaves.value = true

  setTimeout(() => {
    showLeaves.value = false
    leafParticles.value = []
  }, 3500)
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
  animation: sdvPulse 1.5s ease-in-out infinite;
}

/* ======= 老虎机（运动模糊） ======= */
.random-result__slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-sm);
  background: var(--color-sdv-brown-dark);
  border: 3px solid var(--color-sdv-brown-dark);
  border-radius: var(--radius-pixel);
  max-width: 320px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.random-result__slot-machine::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 2px solid var(--color-sdv-wood);
  border-radius: 2px;
  pointer-events: none;
}

/* 运动模糊渐变遮罩 */
.random-result__slot-blur-top,
.random-result__slot-blur-bottom {
  position: absolute;
  left: 3px;
  right: 3px;
  height: 24px;
  z-index: 2;
  pointer-events: none;
}
.random-result__slot-blur-top {
  top: 3px;
  background: linear-gradient(to bottom, var(--color-sdv-brown-dark), transparent);
}
.random-result__slot-blur-bottom {
  bottom: 3px;
  background: linear-gradient(to top, var(--color-sdv-brown-dark), transparent);
}

.random-result__slot-row {
  width: 100%;
  padding: 4px 12px;
  text-align: center;
  font-family: var(--font-pixel);
  border-radius: 2px;
  position: relative;
}

.random-result__slot-row--top,
.random-result__slot-row--bottom {
  background: var(--color-sdv-cream);
  color: var(--color-sdv-brown);
  font-size: var(--font-size-base);
  opacity: 0.6;
}

/* 运动模糊动画 */
.motion-blur {
  animation: motionBlur 0.06s infinite alternate;
  filter: blur(1px);
}

.random-result__slot-row--center {
  background: var(--color-white);
  color: var(--color-text);
  font-size: var(--font-size-xl);
  font-weight: bold;
  border: 2px solid var(--color-sdv-gold);
  box-shadow: 0 0 12px rgba(218, 165, 32, 0.4), inset 0 0 8px rgba(218, 165, 32, 0.1);
  filter: blur(0);
  z-index: 1;
}

/* ======= 结果框（SDV 装饰风格） ======= */
.random-result__result-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 8px;
}

.random-result__result-inner {
  min-width: 180px;
  text-align: center;
  padding: var(--space-md) var(--space-lg) !important;
  position: relative;
  background: transparent !important;
}

.random-result__value {
  font-family: 'Comic Sans MS', 'Chalkboard SE', var(--font-pixel);
  font-size: var(--font-size-xxl);
  font-weight: bold;
  padding: var(--space-xs) var(--space-sm);
  line-height: 1.3;
  letter-spacing: 2px;
}

/* 星芒 */
.random-result__sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
}

.sdv-star {
  position: absolute;
  font-size: 20px;
  animation: sdvStarFloat 1.2s ease-out forwards;
  opacity: 0;
}

/* ======= 彩屑容器 ======= */
.random-result__confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.confetti-particle {
  position: absolute;
  animation: confettiFall var(--duration, 1.5s) ease-in forwards;
  animation-delay: var(--delay, 0s);
}

/* ======= SDV 漂浮容器 ======= */
.random-result__leaf-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
}

.sdv-leaf {
  position: absolute;
  animation: sdvLeafFloat 3s ease-out forwards;
  animation-delay: var(--delay, 0s);
  pointer-events: none;
}
</style>
