<template>
  <div class="yesno">
    <div class="mode-header">
      <span class="mode-icon">✅</span>
      <h2 class="mode-title">Yes or No</h2>
    </div>

    <div class="pixel-card" style="margin-bottom:16px;">
      <label style="font-size:14px;font-weight:bold;display:block;margin-bottom:6px;">你的问题</label>
      <input
        class="pixel-input"
        v-model="question"
        placeholder="输入你的问题..."
        @keyup.enter="doPick"
      />
    </div>

    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <input class="pixel-input" v-model="yesLabel" style="font-size:14px;text-align:center;" />
      <span style="align-self:center;">vs</span>
      <input class="pixel-input" v-model="noLabel" style="font-size:14px;text-align:center;" />
      <button class="pixel-btn" style="font-size:13px;padding:4px 8px;" @click="yesLabel='Yes';noLabel='No'">🔄</button>
    </div>

    <div style="text-align:center;margin:16px 0;">
      <button
        class="pixel-btn pixel-btn--cyan"
        style="font-size:20px;padding:16px 56px;"
        @click="doPick"
        :disabled="!question.trim()"
      >
        🎲 告诉我!
      </button>
    </div>

    <div v-if="showResult" class="yesno__result bounce-in" style="text-align:center;">
      <div class="pixel-card" :style="{ borderColor: result === yesLabel ? 'var(--color-cyan)' : 'var(--color-red)' }">
        <div style="font-size:14px;color:var(--color-gray);margin-bottom:8px;">{{ question }}</div>
        <div style="font-size:48px;font-weight:bold;" :style="{ color: result === yesLabel ? 'var(--color-cyan)' : 'var(--color-red)' }">
          {{ result }}
        </div>
      </div>
      <button class="pixel-btn" style="margin-top:12px;" @click="doPick">🔄 再问一次</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHistoryStore } from '../stores/history'

const historyStore = useHistoryStore()

const question = ref('')
const yesLabel = ref('Yes')
const noLabel = ref('No')
const result = ref('')
const showResult = ref(false)

function doPick() {
  if (!question.value.trim()) return
  const options = [yesLabel.value, noLabel.value]
  result.value = options[Math.floor(Math.random() * options.length)]
  showResult.value = true
  historyStore.addRecord('yesno', [question.value, ...options], result.value)
}
</script>
