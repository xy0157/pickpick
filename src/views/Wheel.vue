<template>
  <div class="wheel">
    <div class="mode-header">
      <span class="mode-icon">🎲</span>
      <h2 class="mode-title">命运转盘</h2>
    </div>

    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;justify-content:center;">
      <button class="pixel-btn" style="font-size:13px;padding:4px 12px;" @click="showEditor = !showEditor">✏️ 编辑选项</button>
    </div>

    <EditableList
      v-if="showEditor"
      :items="options"
      @update:items="options = $event; drawWheel()"
      @import="openImport"
      @reset="resetOptions"
    />

    <div style="text-align:center;margin:16px auto;max-width:360px;">
      <canvas
        ref="wheelCanvas"
        :width="canvasSize"
        :height="canvasSize"
        style="width:100%;height:auto;cursor:pointer;border:var(--border-thick);border-radius:50%;"
        @click="spin"
      ></canvas>
      <div style="margin-top:4px;font-size:13px;color:var(--color-gray);">
        {{ options.length }} 个选项 · 点击转盘旋转
      </div>
    </div>

    <div v-if="showResult" class="bounce-in" style="text-align:center;">
      <div class="pixel-card" style="display:inline-block;">
        结果：<strong style="font-size:24px;">{{ pickedResult }}</strong>
      </div>
    </div>

    <ImportModal :show="showImport" @close="showImport = false" @import="handleImport" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useHistoryStore } from '../stores/history'
import EditableList from '../components/EditableList.vue'
import ImportModal from '../components/ImportModal.vue'

const historyStore = useHistoryStore()
const canvasSize = 360
const options = ref(['选项A', '选项B', '选项C', '选项D'])
const showEditor = ref(false)
const showImport = ref(false)
const showResult = ref(false)
const pickedResult = ref('')
const wheelCanvas = ref(null)
let isSpinning = false

const COLORS = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#6BCB77', '#FF9F43', '#AA96DA', '#FFB5C2', '#B5EAD7', '#FFDAC1', '#C7CEEA', '#FF9FF3', '#54A0FF']

function drawWheel() {
  const canvas = wheelCanvas.value
  if (!canvas || options.value.length === 0) return
  const ctx = canvas.getContext('2d')
  const center = canvasSize / 2
  const radius = center - 8
  const sliceAngle = (2 * Math.PI) / options.value.length

  ctx.clearRect(0, 0, canvasSize, canvasSize)

  options.value.forEach((opt, i) => {
    const startAngle = i * sliceAngle
    const endAngle = startAngle + sliceAngle

    ctx.beginPath()
    ctx.moveTo(center, center)
    ctx.arc(center, center, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = COLORS[i % COLORS.length]
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.stroke()

    const textAngle = startAngle + sliceAngle / 2
    ctx.save()
    ctx.translate(center, center)
    ctx.rotate(textAngle)
    ctx.textAlign = 'right'
    ctx.fillStyle = '#333'
    ctx.font = 'bold 13px Courier New, monospace'
    ctx.fillText(opt.length > 6 ? opt.slice(0, 5) + '…' : opt, radius - 12, 4)
    ctx.restore()
  })

  // center dot
  ctx.beginPath()
  ctx.arc(center, center, 16, 0, 2 * Math.PI)
  ctx.fillStyle = '#333'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(center, center, 10, 0, 2 * Math.PI)
  ctx.fillStyle = '#fff'
  ctx.fill()

  drawPointer()
}

function drawPointer() {
  const canvas = wheelCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const center = canvasSize / 2
  ctx.beginPath()
  ctx.moveTo(center - 12, 4)
  ctx.lineTo(center + 12, 4)
  ctx.lineTo(center, 28)
  ctx.closePath()
  ctx.fillStyle = '#333'
  ctx.fill()
}

function spin() {
  if (isSpinning || options.value.length === 0) return
  isSpinning = true
  showResult.value = false

  const canvas = wheelCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const center = canvasSize / 2
  const sliceAngle = (2 * Math.PI) / options.value.length

  const targetIdx = Math.floor(Math.random() * options.value.length)
  const targetAngle = 2 * Math.PI * 3 + targetIdx * sliceAngle + sliceAngle / 2
  const duration = 2000
  const startTime = performance.now()

  function animate(time) {
    const elapsed = time - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const currentAngle = targetAngle * eased

    ctx.save()
    ctx.translate(center, center)
    ctx.rotate(currentAngle)
    ctx.translate(-center, -center)

    ctx.clearRect(0, 0, canvasSize, canvasSize)

    options.value.forEach((opt, i) => {
      const startA = i * sliceAngle
      const endA = startA + sliceAngle
      ctx.beginPath()
      ctx.moveTo(center, center)
      ctx.arc(center, center, center - 8, startA, endA)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.stroke()

      const textAngle = startA + sliceAngle / 2
      ctx.save()
      ctx.translate(center, center)
      ctx.rotate(textAngle)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#333'
      ctx.font = 'bold 13px Courier New, monospace'
      ctx.fillText(opt.length > 6 ? opt.slice(0, 5) + '…' : opt, center - 20, 4)
      ctx.restore()
    })

    ctx.restore()

    // pointer on top (fixed, not rotating)
    ctx.beginPath()
    ctx.moveTo(center - 12, 4)
    ctx.lineTo(center + 12, 4)
    ctx.lineTo(center, 28)
    ctx.closePath()
    ctx.fillStyle = '#333'
    ctx.fill()

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      isSpinning = false
      pickedResult.value = options.value[targetIdx]
      showResult.value = true
      historyStore.addRecord('wheel', options.value, pickedResult.value)
      drawWheel()
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  nextTick(drawWheel)
})

function resetOptions() {
  options.value = ['选项A', '选项B', '选项C', '选项D']
  nextTick(drawWheel)
}

function openImport() { showImport.value = true }
function handleImport(items) {
  options.value = items
  nextTick(drawWheel)
}
</script>
