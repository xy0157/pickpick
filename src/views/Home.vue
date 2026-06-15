<template>
  <div class="home">
    <div class="home__hero">
      <div class="home__icon">🎲</div>
      <h1 class="home__tagline">今天选什么？</h1>
      <p class="home__sub">让 PickPick 帮你决定！</p>
    </div>

    <div class="home__grid">
      <div
        v-for="mode in modes" :key="mode.path"
        class="home__card"
        :style="{ '--card-color': mode.color }"
        @click="go(mode.path)"
      >
        <span class="home__card-icon">{{ mode.icon }}</span>
        <span class="home__card-title">{{ mode.title }}</span>
        <span class="home__card-desc">{{ mode.desc }}</span>
      </div>
    </div>

    <button class="pixel-btn" style="width:100%;margin-top:16px;justify-content:center;" @click="go('/history')">
      📋 查看历史记录
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const modes = [
  { path: '/food', icon: '🍔', title: '今天吃什么', desc: '三餐选择困难终结者', color: 'var(--color-red)' },
  { path: '/rollcall', icon: '🎒', title: '课堂点名', desc: '随机点名，人人平等', color: 'var(--color-yellow)' },
  { path: '/lottery', icon: '✏️', title: '抽签', desc: '自定义抽签决定', color: 'var(--color-cyan)' },
  { path: '/yesno', icon: '✅', title: 'Yes or No', desc: '简单的是非题', color: 'var(--color-green)' },
  { path: '/shopping', icon: '🛒', title: '购物纠结', desc: '帮你选买哪个', color: 'var(--color-orange)' },
  { path: '/wheel', icon: '🎲', title: '命运转盘', desc: '转盘决定命运', color: 'var(--color-purple)' }
]

function go(path) {
  router.push(path)
}
</script>

<style scoped>
.home__hero {
  text-align: center;
  margin-bottom: 24px;
}
.home__icon {
  font-size: 64px;
  margin-bottom: 8px;
}
.home__tagline {
  font-size: var(--font-size-xxl);
  font-weight: bold;
}
.home__sub {
  font-size: var(--font-size-base);
  color: var(--color-gray);
  margin-top: 4px;
}
.home__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.home__card {
  border: var(--border-thick);
  border-radius: var(--radius-pixel);
  background: white;
  padding: 20px 16px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: var(--shadow-pixel);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-top: 8px solid var(--card-color);
}
.home__card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--color-border);
}
.home__card:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--color-border);
}
.home__card-icon {
  font-size: 36px;
}
.home__card-title {
  font-size: var(--font-size-lg);
  font-weight: bold;
}
.home__card-desc {
  font-size: 12px;
  color: var(--color-gray);
}
</style>
